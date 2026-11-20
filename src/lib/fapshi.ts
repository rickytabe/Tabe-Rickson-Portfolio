import { createHash, timingSafeEqual } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import type { BookInfo } from "@/lib/books";
import { db } from "@/lib/insights/server";

/*
 * Fapshi (MTN Mobile Money and Orange Money, Cameroon). Hosted checkout via /initiate-pay.
 * Docs: https://docs.fapshi.com/en/api-reference/getting-started
 *
 * Env: FAPSHI_BASE_URL (https://sandbox.fapshi.com or https://live.fapshi.com), FAPSHI_API_USER,
 * FAPSHI_API_KEY, and FAPSHI_WEBHOOK_SECRET (the value set on the Fapshi dashboard).
 *
 * A payment is only trusted after asking Fapshi for its status with our own credentials: never
 * from the browser, and never from a webhook body alone. Webhooks are sent once and not retried,
 * so the reader's return to the book also checks their pending payments.
 */

export type FapshiStatus = "CREATED" | "PENDING" | "SUCCESSFUL" | "FAILED" | "EXPIRED";

type FapshiPayment = {
  transId: string;
  status: FapshiStatus;
  amount: number;
  revenue?: number;
  transType?: string;
  medium?: string;
};

export function fapshiEnabled(): boolean {
  return !!(process.env.FAPSHI_BASE_URL && process.env.FAPSHI_API_USER && process.env.FAPSHI_API_KEY);
}

function base(): string {
  return process.env.FAPSHI_BASE_URL!.replace(/\/+$/, "");
}

function headers(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    apiuser: process.env.FAPSHI_API_USER!,
    apikey: process.env.FAPSHI_API_KEY!,
  };
}

const payments = () => db().collection("payments");

/** Create a hosted checkout link for this reader. Returns the URL to send them to. */
export async function startPayment(book: BookInfo, rid: string, returnUrl: string): Promise<string> {
  const price = book.paywall!.priceFcfa;
  const res = await fetch(`${base()}/initiate-pay`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      amount: price,
      redirectUrl: returnUrl,
      userId: rid,
      externalId: `${book.id}-${Date.now()}`,
      message: `${book.title}: unlock all solutions`,
    }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { link?: string; transId?: string; message?: string };
  if (!res.ok || !data.link || !data.transId) {
    throw new Error(`Fapshi initiate-pay failed (${res.status}): ${data.message ?? "no link"}`);
  }
  await payments().doc(data.transId).set({
    book: book.id,
    rid,
    amount: price,
    status: "CREATED",
    createdAt: Date.now(),
    env: base().includes("sandbox") ? "sandbox" : "live",
  });
  await db()
    .collection("bookStats")
    .doc(book.id)
    .set({ paywall: { paymentsStarted: FieldValue.increment(1) } }, { merge: true });
  return data.link;
}

async function fetchStatus(transId: string): Promise<FapshiPayment | null> {
  const res = await fetch(`${base()}/payment-status/${encodeURIComponent(transId)}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) return null; // 400/404: not ours; 429: try again later
  return (await res.json()) as FapshiPayment;
}

/**
 * Ask Fapshi for a payment's status and record it. A SUCCESSFUL payment of the full price unlocks
 * the book for the reader who started it. Safe to call repeatedly: it unlocks and counts once.
 */
export async function settlePayment(transId: string): Promise<FapshiStatus | null> {
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(transId)) return null;
  const ref = payments().doc(transId);
  const known = (await ref.get()).data();
  if (!known) return null; // not a payment this site started
  if (known.status === "SUCCESSFUL") return "SUCCESSFUL";

  const p = await fetchStatus(transId);
  if (!p) return known.status as FapshiStatus;

  const store = db();
  await store.runTransaction(async (tx) => {
    const doc = (await tx.get(ref)).data()!;
    if (doc.status === "SUCCESSFUL") return;
    const paid = p.status === "SUCCESSFUL" && p.amount >= doc.amount && (p.transType ?? "Collection") === "Collection";
    tx.update(ref, {
      status: p.status,
      medium: p.medium ?? null,
      revenue: p.revenue ?? null,
      checkedAt: Date.now(),
      ...(paid ? { paidAt: Date.now() } : {}),
    });
    if (!paid) return;
    const readerRef = store.collection("bookReaders").doc(doc.rid);
    const reader = (await tx.get(readerRef)).data() ?? {};
    if (!reader.unlocks?.[doc.book]) {
      tx.set(readerRef, { unlocks: { [doc.book]: { via: "payment", at: Date.now() } } }, { merge: true });
    }
    tx.set(
      store.collection("bookStats").doc(doc.book),
      {
        paywall: {
          unlockedByPayment: FieldValue.increment(1),
          paymentsAmount: FieldValue.increment(p.amount),
          paymentsRevenue: FieldValue.increment(p.revenue ?? 0),
          [`paidBy_${p.medium === "orange money" ? "orange" : "mtn"}`]: FieldValue.increment(1),
        },
      },
      { merge: true }
    );
  });
  return p.status;
}

/** Check this reader's recent unsettled payments (the return from checkout, or a missed webhook). */
export async function settleReaderPayments(book: BookInfo, rid: string): Promise<boolean> {
  const snap = await payments().where("rid", "==", rid).limit(20).get();
  const open = snap.docs
    .filter((d) => d.data().book === book.id && ["CREATED", "PENDING"].includes(d.data().status))
    .filter((d) => Date.now() - Number(d.data().createdAt) < 25 * 60 * 60 * 1000);
  let unlocked = false;
  for (const d of open.slice(0, 3)) {
    if ((await settlePayment(d.id)) === "SUCCESSFUL") unlocked = true;
  }
  return unlocked;
}

/** The webhook's x-wh-secret header against FAPSHI_WEBHOOK_SECRET, compared in constant time. */
export function webhookSecretOk(header: string | null): boolean {
  const secret = process.env.FAPSHI_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const a = createHash("sha256").update(header).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b);
}

export type PaymentRow = { id: string; status: string; medium: string | null; amount: number; revenue: number | null; createdAt: number; env: string };

export async function listPayments(book: BookInfo, limit = 30): Promise<PaymentRow[]> {
  const snap = await payments().orderBy("createdAt", "desc").limit(200).get();
  return snap.docs
    .filter((d) => d.data().book === book.id)
    .slice(0, limit)
    .map((d) => {
      const p = d.data();
      return { id: d.id, status: p.status, medium: p.medium ?? null, amount: p.amount, revenue: p.revenue ?? null, createdAt: p.createdAt, env: p.env };
    });
}
