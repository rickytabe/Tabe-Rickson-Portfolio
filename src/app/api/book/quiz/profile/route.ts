import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import {
  db,
  ensureReader,
  insightsEnabled,
  readerCookie,
  readerFromRequest,
  sameOrigin,
} from "@/lib/insights/server";
import { cleanName } from "@/lib/quiz/server";
import { bookFrom } from "@/lib/books";

/** What Algo should call this reader: { asked, name, anonymous }. */
export async function GET(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  const rid = readerFromRequest(request);
  if (!rid) return NextResponse.json({ asked: false, name: null, anonymous: false });
  const data = (await db().collection("bookReaders").doc(rid).get()).data() ?? {};
  return NextResponse.json(
    { asked: Boolean(data.quizAskedAt), name: data.quizName ?? null, anonymous: Boolean(data.quizAnon) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** Save a display name ({ name }) or the anonymous choice ({ anonymous: true }), from a book ({ book }). */
export async function POST(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { name?: unknown; anonymous?: unknown; book?: unknown };
  const book = bookFrom(body.book);

  let update: Record<string, unknown>;
  if (body.anonymous === true) {
    update = { quizName: null, quizAnon: true };
  } else {
    const check = cleanName(body.name);
    if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 400 });
    update = { quizName: check.name, quizAnon: false };
  }

  const { rid, isNew } = await ensureReader(request, book);
  const store = db();
  const readerRef = store.collection("bookReaders").doc(rid);
  const firstTime = !(await readerRef.get()).data()?.quizAskedAt;
  await readerRef.set({ ...update, quizAskedAt: FieldValue.serverTimestamp() }, { merge: true });
  if (firstTime) {
    await store
      .collection("bookStats")
      .doc(book.id)
      .set({ quiz: { [update.quizAnon ? "anonymous" : "named"]: FieldValue.increment(1) } }, { merge: true });
  }

  const res = NextResponse.json({ asked: true, name: update.quizName, anonymous: update.quizAnon });
  if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
  return res;
}
