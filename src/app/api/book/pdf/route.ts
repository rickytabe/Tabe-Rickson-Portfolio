import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { insightsEnabled, readerFromRequest } from "@/lib/insights/server";
import { bookFrom } from "@/lib/books";
import { getUnlock } from "@/lib/unlock";

export const runtime = "nodejs";

/**
 * A paid book's PDF (?book=, and ?paper= for books with one PDF per paper), for readers who have
 * unlocked it. The files live in private/, never in public/, so there is no direct link to them.
 * Anyone else is sent to the book, where the unlock sheet explains how to get them.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const book = bookFrom(params.get("book"));
  const paper = params.get("paper");
  const file = paper ? book.paywall?.pdfs?.[paper] : book.paywall?.pdf;
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
