import { db } from "@/lib/insights/server";

export type BoardRow = {
  id: string; // board document id: `${week}_${rid}`
  rid: string;
  name: string | null; // null = anonymous
  score: number;
  ms: number;
  at: number;
  hidden: boolean;
};

/** Every entry for a week, ranked: score high to low, then faster first, then earlier first. */
export async function loadBoard(week: string, { includeHidden = false } = {}): Promise<BoardRow[]> {
  const store = db();
  const snap = await store.collection("quizBoard").where("week", "==", week).limit(1000).get();
  const entries = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as { rid: string; score: number; ms: number; at: number; hidden?: boolean }) }))
    .filter((e) => includeHidden || !e.hidden);
  if (!entries.length) return [];

  const readers = await store.getAll(...entries.map((e) => store.collection("bookReaders").doc(e.rid)));
  const names = new Map(readers.map((r) => [r.id, r.data()?.quizAnon ? null : (r.data()?.quizName ?? null)]));

  return entries
    .map((e) => ({ id: e.id, rid: e.rid, name: names.get(e.rid) ?? null, score: e.score, ms: e.ms, at: e.at, hidden: !!e.hidden }))
    .sort((a, b) => b.score - a.score || a.ms - b.ms || a.at - b.at);
}
