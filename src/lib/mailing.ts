import { createHash, createHmac, timingSafeEqual } from "crypto";
import { getApps } from "firebase-admin/app";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebase/admin";

/*
 * The email list: newsletter subscribers in Firestore `subscribers`, written only by this server.
 * New docs are keyed by a fingerprint of the address, so signing up twice keeps one doc. Older docs
 * (written from the browser before) have random ids; the list is de-duplicated by address.
 * Unsubscribes live in `emailUnsubscribes/{fingerprint}` and win over any subscriber doc.
 * Every list email is sent one per person, with a personal unsubscribe link and the one-click
 * List-Unsubscribe headers Gmail and Yahoo expect from bulk senders.
 */

export const SITE = "https://www.taberickson.com";
export const LIST_FROM = "Tabe Rickson <hello@taberickson.com>";
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Recipient = { email: string; firstName: string };

function db() {
  return adminDb as FirebaseFirestore.Firestore;
}

export function mailingEnabled(): boolean {
  return getApps().length > 0 && !!process.env.RESEND_API_KEY;
}

/** A stable fingerprint of an address, used as a document id. */
export function emailKey(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

function signingKey(): string {
  const base = process.env.INSIGHTS_SECRET || process.env.FIREBASE_PRIVATE_KEY || "";
  return createHash("sha256").update(`unsubscribe|${base}`).digest("hex");
}

function token(email: string): string {
  return createHmac("sha256", signingKey()).update(email.trim().toLowerCase()).digest("base64url").slice(0, 32);
}

/**
 * The personal unsubscribe link for an address: the page (a link in the email, which asks first so
 * link scanners can't unsubscribe anyone), or the API (the List-Unsubscribe header, which mail apps
 * POST to for their one-click button).
 */
export function unsubscribeUrl(email: string, kind: "page" | "api" = "page"): string {
  const e = Buffer.from(email.trim().toLowerCase()).toString("base64url");
  return `${SITE}${kind === "api" ? "/api/unsubscribe" : "/unsubscribe"}?e=${e}&t=${token(email)}`;
}

/** The address an unsubscribe link was made for, or null if the link was altered. */
export function verifyUnsubscribe(e: unknown, t: unknown): string | null {
  if (typeof e !== "string" || typeof t !== "string" || !e || !t) return null;
  let email: string;
  try {
    email = Buffer.from(e, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!EMAIL_RE.test(email)) return null;
  const want = Buffer.from(token(email));
  const got = Buffer.from(t);
  return want.length === got.length && timingSafeEqual(want, got) ? email : null;
}

/** Add or refresh a subscriber. Signing up again also undoes an earlier unsubscribe. */
export async function saveSubscriber(email: string, firstName: string): Promise<void> {
  const key = emailKey(email);
  const ref = db().collection("subscribers").doc(key);
  const now = FieldValue.serverTimestamp();
  const existing = await ref.get();
  await ref.set(
    {
      email: email.trim(),
      emailLower: email.trim().toLowerCase(),
      firstName,
      updatedAt: now,
      ...(existing.exists ? {} : { createdAt: now }),
    },
    { merge: true },
  );
  await db().collection("emailUnsubscribes").doc(key).delete();
}

export async function unsubscribe(email: string): Promise<void> {
  await db()
    .collection("emailUnsubscribes")
    .doc(emailKey(email))
    .set({ at: FieldValue.serverTimestamp() });
}

/** Everyone on the list, once each, without those who unsubscribed. */
export async function loadRecipients(): Promise<Recipient[]> {
  const [subs, unsubs] = await Promise.all([
    db().collection("subscribers").get(),
    db().collection("emailUnsubscribes").get(),
  ]);
  const gone = new Set(unsubs.docs.map((d) => d.id));
  const byKey = new Map<string, Recipient>();
  for (const doc of subs.docs) {
    const data = doc.data();
    const email = typeof data.email === "string" ? data.email.trim() : "";
    if (!EMAIL_RE.test(email)) continue;
    const key = emailKey(email);
    if (gone.has(key)) continue;
    const firstName = typeof data.firstName === "string" ? data.firstName.trim() : "";
    const seen = byKey.get(key);
    if (!seen || (!seen.firstName && firstName)) byKey.set(key, { email, firstName });
  }
  return [...byKey.values()];
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ListEmail = { subject: string; html: string; text: string };

/** Resend takes up to 100 emails per batch call. */
const BATCH = 100;

/**
 * Send one email per recipient, in batches. `build` gets the recipient and their unsubscribe link.
 * `onBatch` runs after each accepted batch with the keys just sent, so a caller can record
 * progress and resume after a failure without emailing anyone twice. Throws on the first
 * rejected batch; everything before it was sent.
 */
export async function sendToList(
  recipients: Recipient[],
  build: (r: Recipient, unsubscribe: string) => ListEmail,
  opts: { idempotencyPrefix: string; onBatch?: (keys: string[]) => Promise<void> },
): Promise<number> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const chunk = recipients.slice(i, i + BATCH);
    const payload = chunk.map((r) => {
      const link = unsubscribeUrl(r.email);
      const mail = build(r, link);
      return {
        from: LIST_FROM,
        to: r.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl(r.email, "api")}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });
    const keys = chunk.map((r) => emailKey(r.email));
    // Same batch content, same key: a retried request is not sent twice by Resend.
    const idem = createHash("sha256").update(`${opts.idempotencyPrefix}|${keys.join(",")}`).digest("hex");
    const { error } = await resend.batch.send(payload, { idempotencyKey: idem });
    if (error) throw new Error(`Resend rejected a batch: ${error.message ?? JSON.stringify(error)}`);
    sent += chunk.length;
    await opts.onBatch?.(keys);
  }
  return sent;
}
