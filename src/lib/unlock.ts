import { createHash, randomInt } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import type { BookInfo } from "@/lib/books";
import { dayKey, db, inviteCodeFor } from "@/lib/insights/server";

/*
 * Unlocking a paid book's solutions. Two ways in, both recorded on the reader:
 *  - a code Tabe sends after a Mobile Money payment (created on /book-insights), or
 *  - inviting classmates: each invited reader who goes on to read a few questions counts once.
 * Codes are stored only as hashes. Each one works on up to two devices (a phone and a laptop).
 */

/** Questions an invited reader must reach before they count for the friend who sent them. */
export const INVITE_READS = 3;
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O, 1/I/L
const CODE_LENGTH = 8;
const DEVICES_PER_CODE = 2;
const TRIES_PER_DAY = 10;

export type Unlock = { via: "code" | "invite" | "payment"; at: number };

const readers = () => db().collection("bookReaders");
const codes = () => db().collection("unlockCodes");
const statsDoc = (book: BookInfo) => db().collection("bookStats").doc(book.id);

/** "K7P2-XQ9M": what a student types. Spaces, dashes and lower case are all accepted. */
export function formatCode(raw: string): string {
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

function normalise(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const raw = input.toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (raw.length !== CODE_LENGTH || [...raw].some((c) => !CODE_ALPHABET.includes(c))) return null;
  return raw;
}

function codeId(raw: string): string {
  return createHash("sha256").update(`unlock-code|${raw}`).digest("hex");
}

/** Make a new code for a paying student. The plain code is returned once and never stored. */
export async function createCode(book: BookInfo, note: string): Promise<string> {
  const raw = Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
  await codes().doc(codeId(raw)).create({
    book: book.id,
    hint: raw.slice(-4),
    note: note.slice(0, 80),
    createdAt: Date.now(),
    uses: [],
    revoked: false,
  });
  await statsDoc(book).set({ paywall: { codes: FieldValue.increment(1) } }, { merge: true });
  return formatCode(raw);
}

export async function revokeCode(id: string, revoked: boolean): Promise<void> {
  if (!/^[0-9a-f]{64}$/.test(id)) return;
  const ref = codes().doc(id);
  if ((await ref.get()).exists) await ref.update({ revoked });
}

export type CodeRow = { id: string; hint: string; note: string; createdAt: number; uses: number; revoked: boolean };

export async function listCodes(book: BookInfo, limit = 40): Promise<CodeRow[]> {
  const snap = await codes().orderBy("createdAt", "desc").limit(200).get();
  return snap.docs
    .filter((d) => d.data().book === book.id)
    .slice(0, limit)
    .map((d) => {
      const c = d.data();
      return { id: d.id, hint: c.hint, note: c.note ?? "", createdAt: c.createdAt, uses: (c.uses ?? []).length, revoked: !!c.revoked };
    });
}

export async function getUnlock(rid: string | null, book: BookInfo): Promise<Unlock | null> {
  if (!rid || !book.paywall) return null;
  const u = (await readers().doc(rid).get()).data()?.unlocks?.[book.id];
  return u ? { via: u.via, at: u.at } : null;
}

export type RedeemResult = { ok: true; unlock: Unlock } | { ok: false; error: string; status: number };

/** Redeem a code for this reader. */
export async function redeemCode(book: BookInfo, rid: string, input: unknown): Promise<RedeemResult> {
  const raw = normalise(input);
  const store = db();
  const readerRef = readers().doc(rid);
  const today = dayKey();

  return store.runTransaction(async (tx) => {
    const reader = (await tx.get(readerRef)).data() ?? {};
    const existing = reader.unlocks?.[book.id];
    if (existing) return { ok: true as const, unlock: { via: existing.via, at: existing.at } };

    const tries = Number(reader.unlockTries?.[book.id]?.[today] ?? 0);
    if (tries >= TRIES_PER_DAY) {
      return { ok: false as const, status: 429, error: "Too many tries today. Message Tabe on WhatsApp to sort it out." };
    }
    const fail = (error: string) => {
      tx.set(readerRef, { unlockTries: { [book.id]: { [today]: tries + 1 } } }, { merge: true });
      return { ok: false as const, status: 400, error };
    };
    if (!raw) return fail("That doesn't look like a code. It has 8 letters and numbers, like K7P2-XQ9M.");

    const codeRef = codes().doc(codeId(raw));
    const code = (await tx.get(codeRef)).data();
    if (!code || code.book !== book.id) return fail("That code didn't work. Check it and try again.");
    if (code.revoked) return fail("That code has been switched off. Message Tabe on WhatsApp.");
    const uses: string[] = code.uses ?? [];
    if (!uses.includes(rid) && uses.length >= DEVICES_PER_CODE) {
      return fail(`That code is already in use on ${DEVICES_PER_CODE} devices. Message Tabe on WhatsApp if it's yours.`);
    }

    const unlock: Unlock = { via: "code", at: Date.now() };
    if (!uses.includes(rid)) tx.update(codeRef, { uses: [...uses, rid] });
    tx.set(readerRef, { unlocks: { [book.id]: unlock } }, { merge: true });
    tx.set(
      statsDoc(book),
      { paywall: { unlockedByCode: FieldValue.increment(1), ...(uses.length === 0 ? { codesUsed: FieldValue.increment(1) } : {}) } },
      { merge: true }
    );
    return { ok: true as const, unlock };
  });
}

/** This reader's invite code and how many classmates have counted so far. */
export async function inviteStatus(book: BookInfo, rid: string): Promise<{ code: string; count: number }> {
  const code = inviteCodeFor(rid);
  const ref = db().collection("inviteCodes").doc(code);
  if (!(await ref.get()).exists) await ref.set({ rid, createdAt: Date.now() });
  const count = Number((await readers().doc(rid).get()).data()?.invites?.[book.id] ?? 0);
  return { code, count };
}

/** An invited reader has read enough: count them once for their inviter, and unlock at the target. */
export async function creditInvite(book: BookInfo, inviterRid: string, inviteeRid: string): Promise<void> {
  const needed = book.paywall?.invitesNeeded;
  if (!needed) return;
  const store = db();
  const inviterRef = readers().doc(inviterRid);
  const inviteeRef = readers().doc(inviteeRid);
  await store.runTransaction(async (tx) => {
    const [invitee, inviter] = await Promise.all([tx.get(inviteeRef), tx.get(inviterRef)]);
    if (invitee.data()?.inviteCredited?.[book.id] || !inviter.exists) return;
    const count = Number(inviter.data()?.invites?.[book.id] ?? 0) + 1;
    const unlockNow = count >= needed && !inviter.data()?.unlocks?.[book.id];
    tx.set(inviteeRef, { inviteCredited: { [book.id]: true } }, { merge: true });
    tx.set(
      inviterRef,
      { invites: { [book.id]: count }, ...(unlockNow ? { unlocks: { [book.id]: { via: "invite", at: Date.now() } } } : {}) },
      { merge: true }
    );
    tx.set(
      statsDoc(book),
      { paywall: { invitesCounted: FieldValue.increment(1), ...(unlockNow ? { unlockedByInvite: FieldValue.increment(1) } : {}) } },
      { merge: true }
    );
  });
}
