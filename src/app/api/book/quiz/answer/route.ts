import { NextResponse } from "next/server";
import { db, insightsEnabled, readerFromRequest, sameOrigin } from "@/lib/insights/server";
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
 * server, and the reader's first finished attempt of the week goes on the leaderboard.
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
      if (done) {
        const ms = Date.now() - s.startedAt;
        update.done = true;
        update.ms = ms;
        const boardRef = store.collection("quizBoard").doc(`${s.week}_${rid}`);
        if (s.ranked && !(await tx.get(boardRef)).exists) {
          tx.set(boardRef, { week: s.week, rid, score, ms, at: Date.now(), hidden: false });
          ranked = true;
        }
      }
      tx.update(ref, update);
      return { status: 200 as const, correct, done, score, ranked };
    });

    if (result.status !== 200) return NextResponse.json({ error: "Not allowed" }, { status: result.status });
    return NextResponse.json(
      { correct: result.correct, answer: key.answer, explain: key.explain, done: result.done, score: result.score, ranked: result.ranked },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Quiz answer failed", error);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}
