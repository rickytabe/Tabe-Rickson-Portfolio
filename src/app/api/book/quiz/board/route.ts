import { NextResponse } from "next/server";
import { insightsEnabled, readerFromRequest } from "@/lib/insights/server";
import { loadBoard } from "@/lib/quiz/board";
import { bookFrom } from "@/lib/books";
import { weekKey, weekStartLabel } from "@/lib/quiz/server";

/** This week's leaderboard for a book (?book=): top 20, plus the requesting reader's own row if they're further down. */
export async function GET(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  const rid = readerFromRequest(request);
  const book = bookFrom(new URL(request.url).searchParams.get("book"));
  const rows = await loadBoard(weekKey(), { book });
  const shape = (r: (typeof rows)[number], i: number) => ({
    rank: i + 1,
    name: r.name,
    points: r.points,
    quizzes: r.quizzes,
    avg: Math.round(r.avg * 10) / 10,
    you: !!rid && r.rid === rid,
  });
  const top = rows.slice(0, 20).map(shape);
  const mineIndex = rid ? rows.findIndex((r) => r.rid === rid) : -1;
  return NextResponse.json(
    {
      week: weekStartLabel(),
      total: rows.length,
      top,
      you: mineIndex >= 20 ? shape(rows[mineIndex], mineIndex) : null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
