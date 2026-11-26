import { NextResponse } from "next/server";
import { insightsEnabled, readerFromRequest } from "@/lib/insights/server";
import { bookFrom, type BookId } from "@/lib/books";
import { getUnlock } from "@/lib/unlock";
import { lockedSolutions as csc211LockedSolutions } from "@/content/csc211/render";
import { csc205caLockedSolutions } from "@/content/csc205ca/render";

// Each paid book's locked solutions, by question id.
const LOCKED: Partial<Record<BookId, () => Record<string, string>>> = {
  csc211: csc211LockedSolutions,
  csc205ca: csc205caLockedSolutions,
};

/**
 * The locked solutions of a paid book (?book=), for readers who have unlocked it. They are never
 * part of the page itself, so they can't be read from the page source or a cached copy.
 */
export async function GET(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  const book = bookFrom(new URL(request.url).searchParams.get("book"));
  const solutions = LOCKED[book.id];
  if (!book.paywall || !solutions) return NextResponse.json({ error: "Not a paid book" }, { status: 404 });

  const unlock = await getUnlock(readerFromRequest(request), book);
  if (!unlock) return NextResponse.json({ error: "Locked" }, { status: 402 });
  return NextResponse.json({ solutions: solutions() }, { headers: { "Cache-Control": "private, no-store" } });
}
