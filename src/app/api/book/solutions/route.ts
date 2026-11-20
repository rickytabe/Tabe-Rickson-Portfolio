import { NextResponse } from "next/server";
import { insightsEnabled, readerFromRequest } from "@/lib/insights/server";
import { bookFrom } from "@/lib/books";
import { getUnlock } from "@/lib/unlock";
import { lockedSolutions } from "@/content/csc211/render";

/**
 * The locked solutions of a paid book (?book=), for readers who have unlocked it. They are never
 * part of the page itself, so they can't be read from the page source or a cached copy.
 */
export async function GET(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  const book = bookFrom(new URL(request.url).searchParams.get("book"));
  if (book.id !== "csc211") return NextResponse.json({ error: "Not a paid book" }, { status: 404 });

  const unlock = await getUnlock(readerFromRequest(request), book);
  if (!unlock) return NextResponse.json({ error: "Locked" }, { status: 402 });
  return NextResponse.json(
    { solutions: lockedSolutions() },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
