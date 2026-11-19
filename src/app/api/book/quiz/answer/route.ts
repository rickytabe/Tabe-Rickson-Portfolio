import { NextResponse } from "next/server";
import { dayKey, db, insightsEnabled, readerFromRequest, sameOrigin } from "@/lib/insights/server";
import { DAILY_COUNTED, readEntry } from "@/lib/quiz/board";
import { QUIZ_ANSWERS } from "@/lib/quiz/answers";

type Session = {
  rid: string;
  week: string;
  ids: string[];
  startedAt: number;
  answered: Record<string, { choice: number; correct: boolean }>;
  score: number;
  done: boolean;
  ranked: boolean;
};

/**
 * Grade one answer: { sid, qid, choice } where choice is the index into the question's original
 * options. Each question can be answered once. After the last one the attempt is timed on the
 * server and its score is added to the reader's points for the week (up to DAILY_COUNTED
 * finished quizzes a day count; the rest are practice).
 */
export async function POST(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rid = readerFromRequest(request);
  if (!rid) return NextResponse.json({ error: "No session" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { sid?: unknown; qid?: unknown; choice?: unknown };
  const sid = typeof body.sid === "string" ? body.sid : "";
  const qid = typeof body.qid === "string" ? body.qid : "";
  const choice = typeof body.choice === "number" ? body.choice : -1;
  const key = QUIZ_ANSWERS[qid];
  if (!/^[A-Za-z0-9]{10,40}$/.test(sid) || !key || ![0, 1, 2, 3].includes(choice)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const store = db();
  const ref = store.collection("quizSessions").doc(sid);
  try {
    const result = await store.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const s = snap.data() as Session | undefined;
      if (!s || s.rid !== rid) return { status: 404 as const };
      if (!s.ids.includes(qid)) return { status: 400 as const };
      if (s.answered[qid]) return { status: 409 as const };

      const correct = choice === key.answer;
      const answeredCount = Object.keys(s.answered).length + 1;
      const score = s.score + (correct ? 1 : 0);
      const done = answeredCount === s.ids.length;
      const update: Record<string, unknown> = { [`answered.${qid}`]: { choice, correct }, score };

      let ranked = false;
      let points = 0;
      let quizzes = 0;
      if (done) {
        const now = Date.now();
        const ms = now - s.startedAt;
        update.done = true;
        update.ms = ms;
        const boardRef = store.collection("quizBoard").doc(`${s.week}_${rid}`);
        const entry = readEntry((await tx.get(boardRef)).data());
        const today = dayKey();
        const countedToday = entry.days[today] ?? 0;
        points = entry.points;
        quizzes = entry.quizzes;
        if (countedToday < DAILY_COUNTED) {
          points += score;
          quizzes += 1;
          ranked = true;
          // Written in full (not merged) so entries in the old format are converted in place.
          tx.set(boardRef, {
            week: s.week,
            rid,
            points,
            quizzes,
            best: Math.max(entry.best, score),
            totalMs: entry.totalMs + ms,
            lastAt: now,
            days: { ...entry.days, [today]: countedToday + 1 },
            hidden: entry.hidden,
          });
        }
        update.counted = ranked;
      }
      tx.update(ref, update);
      return { status: 200 as const, correct, done, score, ranked, points, quizzes };
    });

    if (result.status !== 200) return NextResponse.json({ error: "Not allowed" }, { status: result.status });
    return NextResponse.json(
      {
        correct: result.correct,
        answer: key.answer,
        explain: key.explain,
        done: result.done,
        score: result.score,
        ranked: result.ranked,
        points: result.points,
        quizzes: result.quizzes,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Quiz answer failed", error);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}
