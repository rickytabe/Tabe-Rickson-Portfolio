import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import { getApps } from "firebase-admin/app";
import { adminDb } from "@/lib/firebase/admin";

/*
 * Anonymous reader insights for the book. No accounts and no personal data: each reader gets a
 * random id in a signed, HttpOnly cookie that page scripts cannot read and nobody can forge.
 * Only this server writes to Firestore.
 */

export const BOOK_ID = "csc207";
const COOKIE = "bk_rid";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function insightsEnabled(): boolean {
  return getApps().length > 0 && !!secret();
}

export function db() {
  return adminDb as FirebaseFirestore.Firestore;
}

// Signing key: INSIGHTS_SECRET if set, otherwise derived from the Firebase private key with a
// purpose label, so no extra setup is needed.
function secret(): string | null {
  const own = process.env.INSIGHTS_SECRET;
  if (own) return own;
  const pk = process.env.FIREBASE_PRIVATE_KEY;
  return pk ? createHash("sha256").update(`book-reader-id|${pk}`).digest("hex") : null;
}

function sign(id: string): string {
  return createHmac("sha256", secret()!).update(id).digest("base64url").slice(0, 32);
}

/** The reader id from the request cookie, if its signature is valid. */
export function readerFromRequest(request: Request): string | null {
  const raw = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!raw) return null;
  const [id, sig] = raw.split(".");
  if (!id || !sig || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const want = Buffer.from(sign(id));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got) ? id : null;
}

export function newReaderId(): string {
  return randomUUID();
}

export function readerCookie(id: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${id}.${sign(id)}; Path=/api/book; Max-Age=${ONE_YEAR}; HttpOnly; SameSite=Lax${secure}`;
}

/** Reject posts from other websites (they would otherwise ride on a visitor's cookie). */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // sendBeacon from older browsers may omit it
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function cleanRef(ref: unknown): string | null {
  if (typeof ref !== "string") return null;
  const r = ref.toLowerCase().replace(/^www\./, "").slice(0, 40);
  return /^[a-z0-9._-]+$/.test(r) ? r : null;
}

/** Firestore field names: keep to safe characters (dots would create nested paths). */
export function fieldKey(s: string): string {
  return s.replace(/[^a-z0-9_-]/gi, "_");
}

/** Today's date in Cameroon (Africa/Douala, UTC+1) as a Firestore-safe key, e.g. "d20261118". */
export function dayKey(date = new Date()): string {
  const local = new Date(date.getTime() + 60 * 60 * 1000);
  return `d${local.toISOString().slice(0, 10).replace(/-/g, "")}`;
}

/**
 * The reader behind a request: the signed cookie's id, or a new reader (recorded in Firestore and
 * counted in the stats). When `isNew` is true, set `readerCookie(rid)` on the response.
 */
export async function ensureReader(request: Request): Promise<{ rid: string; isNew: boolean }> {
  const existing = readerFromRequest(request);
  if (existing) return { rid: existing, isNew: false };
  const rid = newReaderId();
  const { FieldValue } = await import("firebase-admin/firestore");
  const store = db();
  await store.collection("bookReaders").doc(rid).set({ book: BOOK_ID, firstSeen: FieldValue.serverTimestamp(), ref: null });
  await store
    .collection("bookStats")
    .doc(BOOK_ID)
    .set(
      {
        readers: { total: FieldValue.increment(1) },
        refs: { direct: FieldValue.increment(1) },
        daily: { [dayKey()]: FieldValue.increment(1) },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  return { rid, isNew: true };
}
