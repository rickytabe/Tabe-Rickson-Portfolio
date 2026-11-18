import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import {
  BOOK_ID,
  db,
  insightsEnabled,
  newReaderId,
  readerCookie,
  readerFromRequest,
  sameOrigin,
} from "@/lib/insights/server";

const CHAPTER = /^c([1-9]|1[0-9]|2[0-4])$/;
const MAX_TEXT = 600;

/**
 * "Was this chapter clear?" One vote per reader per chapter (changing it moves the count), plus
 * an optional private note. Notes are stored for the author only and never shown publicly here.
 */
export async function POST(request: Request) {
  if (!insightsEnabled()) return new NextResponse(null, { status: 204 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { chapter?: unknown; vote?: unknown; text?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const chapter = String(body.chapter ?? "");
  const vote = body.vote === "up" || body.vote === "down" ? body.vote : null;
  if (!CHAPTER.test(chapter) || !vote) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const text =
    typeof body.text === "string"
      ? body.text.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, MAX_TEXT)
      : "";

  let rid = readerFromRequest(request);
  const isNew = !rid;
  if (!rid) rid = newReaderId();

  const store = db();
  const reader = store.collection("bookReaders").doc(rid);
  const voteDoc = reader.collection("votes").doc(chapter);
  const statsDoc = store.collection("bookStats").doc(BOOK_ID);

  try {
    await store.runTransaction(async (tx) => {
      const prev = (await tx.get(voteDoc)).data()?.vote as "up" | "down" | undefined;
      const counts: Record<string, FirebaseFirestore.FieldValue> = {};
      if (prev !== vote) {
        counts[`${chapter}_${vote}`] = FieldValue.increment(1);
        if (prev) counts[`${chapter}_${prev}`] = FieldValue.increment(-1);
      }
      if (isNew) {
        tx.set(reader, { book: BOOK_ID, firstSeen: FieldValue.serverTimestamp(), ref: null });
      }
      tx.set(voteDoc, { vote, at: FieldValue.serverTimestamp() });
      if (Object.keys(counts).length || isNew) {
        tx.set(
          statsDoc,
          {
            ...(Object.keys(counts).length ? { clarity: counts } : {}),
            ...(isNew ? { readers: { total: FieldValue.increment(1) }, refs: { direct: FieldValue.increment(1) } } : {}),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
      if (text) {
        tx.set(store.collection("bookFeedback").doc(`${rid}_${chapter}`), {
          book: BOOK_ID,
          chapter,
          vote,
          text,
          at: FieldValue.serverTimestamp(),
        });
      }
    });
  } catch (error) {
    console.error("Book feedback write failed", error);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
  return res;
}
