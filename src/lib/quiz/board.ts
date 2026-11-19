import { db } from "@/lib/insights/server";

/** How many finished quizzes per day add to a reader's weekly points. Extra ones are practice. */
export const DAILY_COUNTED = 5;

export type BoardEntry = {
  points: number; // total correct answers this week, across counted quizzes
  quizzes: number; // counted quizzes this week
  best: number;
  totalMs: number;
  lastAt: number; // when the latest counted quiz finished
  days: Record<string, number>; // counted quizzes per day, keyed like "d20261119"
  hidden: boolean;
};

/**
 * Read a board document. Entries written before points existed held one first-attempt score
 * ({ score, ms, at }); they read as one counted quiz with that score.
 */
export function readEntry(d: Record<string, unknown> | undefined): BoardEntry {
  const num = (v: unknown) => (typeof v === "number" ? v : 0);
  if (!d) return { points: 0, quizzes: 0, best: 0, totalMs: 0, lastAt: 0, days: {}, hidden: false };
  const legacy = typeof d.points !== "number" && typeof d.score === "number";
  return {
    points: legacy ? num(d.score) : num(d.points),
    quizzes: legacy ? 1 : num(d.quizzes),
    best: legacy ? num(d.score) : num(d.best),
    totalMs: legacy ? num(d.ms) : num(d.totalMs),
    lastAt: legacy ? num(d.at) : num(d.lastAt),
    days: (d.days as Record<string, number>) ?? {},
    hidden: Boolean(d.hidden),
  };
}

export type BoardRow = BoardEntry & {
  id: string; // board document id: `${week}_${rid}`
  rid: string;
  name: string | null; // null = anonymous
  avg: number; // points per counted quiz
};

/** Ranking: most points, then the better average, then whoever got there first. */
export function compareRows(a: BoardRow, b: BoardRow) {
  return b.points - a.points || b.avg - a.avg || a.lastAt - b.lastAt;
}

/** Every entry for a week, ranked. */
export async function loadBoard(week: string, { includeHidden = false } = {}): Promise<BoardRow[]> {
  const store = db();
  const snap = await store.collection("quizBoard").where("week", "==", week).limit(1000).get();
  const entries = snap.docs
    .map((d) => ({ id: d.id, rid: String(d.data().rid ?? ""), ...readEntry(d.data()) }))
    .filter((e) => e.rid && e.quizzes > 0 && (includeHidden || !e.hidden));
  if (!entries.length) return [];

  const readers = await store.getAll(...entries.map((e) => store.collection("bookReaders").doc(e.rid)));
  const names = new Map(readers.map((r) => [r.id, r.data()?.quizAnon ? null : (r.data()?.quizName ?? null)]));

  return entries
    .map((e) => ({ ...e, name: names.get(e.rid) ?? null, avg: e.points / e.quizzes }))
    .sort(compareRows);
}
