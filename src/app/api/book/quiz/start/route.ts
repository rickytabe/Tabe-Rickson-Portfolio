import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { dayKey, db, ensureReader, insightsEnabled, readerCookie, sameOrigin } from "@/lib/insights/server";
import { bookFrom } from "@/lib/books";
import { boardDocId, DAILY_COUNTED, readEntry } from "@/lib/quiz/board";
import { drawQuestionIds, weekKey } from "@/lib/quiz/server";
import { quizBank } from "@/lib/quiz/bank";

/**
 * Start a quiz attempt ({ book }). The server picks the questions and records the start time, so it
 * can grade every answer and time the attempt itself. Only questions are returned, never answers.
 */
export async function POST(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await request.json().catch(() => ({}))) as { book?: unknown };
  const book = bookFrom(body.book);
  const { rid, isNew } = await ensureReader(request, book);
  const store = db();
  const week = weekKey();
  const ids = drawQuestionIds(book);
  const entry = readEntry((await store.collection("quizBoard").doc(boardDocId(book, week, rid)).get()).data());
  const countedToday = entry.days[dayKey()] ?? 0;
  // A hint for the intro: whether this quiz will add to the weekly points (decided at the finish).
  const ranked = countedToday < DAILY_COUNTED;

  const session = store.collection("quizSessions").doc();
  await session.set({ book: book.id, rid, week, ids, startedAt: Date.now(), answered: {}, score: 0, done: false, ranked });
  await store
    .collection("bookStats")
    .doc(book.id)
    .set({ quiz: { started: FieldValue.increment(1) }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  const byId = new Map(quizBank(book).questions.map((q) => [q.id, q]));
  const res = NextResponse.json(
    {
      sid: session.id,
      // Whether finishing this quiz will add to this week's points (up to DAILY_COUNTED a day).
      ranked,
      points: entry.points,
      quizzes: entry.quizzes,
      questions: ids.map((id) => {
        const q = byId.get(id)!;
        return { id: q.id, chapter: q.chapter, q: q.q, options: q.options };
      }),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
  if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
  return res;
}
