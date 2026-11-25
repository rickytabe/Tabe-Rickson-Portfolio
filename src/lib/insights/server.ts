import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import { getApps } from "firebase-admin/app";
import { adminDb } from "@/lib/firebase/admin";
import { BOOKS, type BookInfo } from "@/lib/books";

/*
 * Anonymous reader insights for the books. No accounts and no personal data: each reader gets a
 * random id in a signed, HttpOnly cookie that page scripts cannot read and nobody can forge.
 * One reader id covers every book. Only this server writes to Firestore.
 */

/** The first book's id. Kept for code that predates the second book; prefer a BookInfo. */
export const BOOK_ID = BOOKS.csc207.id;
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

/**
 * A reader's own invite code, e.g. "k7p2xq9m": the same for a reader every time, and impossible to
 * guess or to turn back into the reader id. Shared as ?ref=i-<code>.
 */
export function inviteCodeFor(rid: string): string {
  const alphabet = "23456789abcdefghjkmnpqrstuvwxyz";
  const bytes = createHmac("sha256", secret()!).update(`invite|${rid}`).digest();
  return Array.from(bytes.subarray(0, 8), (b) => alphabet[b % alphabet.length]).join("");
}

export const INVITE_REF = /^i-([2-9a-hjkmnp-z]{8})$/;

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

/** The mark that says a reader has been counted as a reader of this book (one per reader and book). */
export function readerMarkId(book: BookInfo): string {
  return fieldKey(book.id === "csc207" ? "reader" : `${book.id}-reader`);
}

/**
 * Count an existing reader (cookie already set) the first time they open this book. Readers used to
 * be counted only in the first book they ever opened, so a student who came from another book never
 * showed up in this one's Readers, while their chapters and "finished" marks did. Returns whether
 * this call counted them, so the caller can add `readers`, `refs` and `daily` to its stats write.
 */
export async function claimBookReader(rid: string, book: BookInfo): Promise<boolean> {
  const { FieldValue } = await import("firebase-admin/firestore");
  const reader = db().collection("bookReaders").doc(rid);
  try {
    await reader.collection("marks").doc(readerMarkId(book)).create({ at: FieldValue.serverTimestamp() });
  } catch {
    return false; // already counted in this book
  }
  // Readers created before this mark existed were counted in their first book when they were created.
  const first = (await reader.get()).data()?.book ?? BOOKS.csc207.id;
  return first !== book.id;
}

/**
 * The reader behind a request: the signed cookie's id, or a new reader (recorded in Firestore and
 * counted in the stats). When `isNew` is true, set `readerCookie(rid)` on the response.
 */
export async function ensureReader(
  request: Request,
  book: BookInfo = BOOKS.csc207
): Promise<{ rid: string; isNew: boolean }> {
  const existing = readerFromRequest(request);
  if (existing) return { rid: existing, isNew: false };
  const rid = newReaderId();
  const { FieldValue } = await import("firebase-admin/firestore");
  const store = db();
  await store.collection("bookReaders").doc(rid).set({ book: book.id, firstSeen: FieldValue.serverTimestamp(), ref: null });
  await store.collection("bookReaders").doc(rid).collection("marks").doc(readerMarkId(book)).set({ at: FieldValue.serverTimestamp() });
  await store
    .collection("bookStats")
    .doc(book.id)
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
