import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { insightsEnabled, readerFromRequest } from "@/lib/insights/server";
import { bookFrom } from "@/lib/books";
import { getUnlock } from "@/lib/unlock";

export const runtime = "nodejs";

/**
 * A paid book's full PDF (?book=), for readers who have unlocked it. The file lives in private/,
 * never in public/, so there is no direct link to it. Anyone else is sent to the book, where the
 * unlock sheet explains how to get it.
 */
export async function GET(request: Request) {
  const book = bookFrom(new URL(request.url).searchParams.get("book"));
  const file = book.paywall?.pdf;
  if (!file) return NextResponse.json({ error: "No PDF for this book" }, { status: 404 });

  const unlock = insightsEnabled() ? await getUnlock(readerFromRequest(request), book) : null;
  if (!unlock) return NextResponse.redirect(new URL(`${book.path}?unlock=1`, request.url), 303);

  const bytes = await readFile(path.join(process.cwd(), "private", path.basename(file)));
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${path.basename(file)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
