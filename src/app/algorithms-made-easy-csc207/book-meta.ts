import { readFileSync } from "fs";
import path from "path";

// Server-only: reads the book from disk. Plain details live in ./book-info.
export { BOOK_AUTHOR, BOOK_AUTHOR_AVATAR, BOOK_CHAPTERS, BOOK_PATH } from "./book-info";

// Technical text reads slower than prose; 200 words a minute is a fair pace for study reading.
const WORDS_PER_MINUTE = 200;

export function readBookHtml(): string {
  return readFileSync(path.join(process.cwd(), "src/app/algorithms-made-easy-csc207/content.html"), "utf8");
}

/** Reading time in minutes, counted from the book's text (illustrations and markup excluded). */
export function readingMinutes(html: string): number {
  const text = html
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "52 min read", or "1 hr 5 min read" past an hour. */
export function formatReadTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min read`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min read` : `${h} hr read`;
}
