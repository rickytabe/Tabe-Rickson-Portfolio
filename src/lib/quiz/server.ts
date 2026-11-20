import type { BookInfo } from "@/lib/books";
import { quizBank } from "@/lib/quiz/bank";

export const QUIZ_LENGTH = 10;

/** The current leaderboard week (Mondays, Cameroon time), e.g. "w2026-47" (ISO week). */
export function weekKey(date = new Date()): string {
  const local = new Date(date.getTime() + 60 * 60 * 1000); // Africa/Douala is UTC+1 all year
  const d = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day); // the Thursday of this ISO week decides its year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `w${d.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}

/** Monday of the current week (Cameroon time), for labels like "Week of 16 Nov". */
export function weekStartLabel(date = new Date()): string {
  const local = new Date(date.getTime() + 60 * 60 * 1000);
  const day = local.getUTCDay() || 7;
  local.setUTCDate(local.getUTCDate() - (day - 1));
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(local);
}

// A short list of words that shouldn't appear on a public board (English, French, Pidgin) and
// names that would impersonate staff. Matching ignores case, spaces and punctuation.
const BLOCKED = [
  "fuck", "shit", "bitch", "cunt", "dick", "pussy", "nigg", "fag", "whore", "slut", "porn", "sex",
  "rape", "bastard", "asshole", "merde", "pute", "salope", "connard", "conasse", "encule", "batard",
  "nyash", "ashawo", "admin", "moderator", "official", "lecturer", "teacher", "professor",
];

export type NameCheck = { ok: true; name: string } | { ok: false; reason: string };

/** Validate a display name for the leaderboard. */
export function cleanName(input: unknown): NameCheck {
  if (typeof input !== "string") return { ok: false, reason: "Please type a name." };
  const name = input.normalize("NFKC").replace(/\s+/g, " ").trim();
  if (name.length < 2) return { ok: false, reason: "Use at least 2 characters." };
  if (name.length > 20) return { ok: false, reason: "Keep it to 20 characters or fewer." };
  if (!/^[\p{L}\p{N} ._'-]+$/u.test(name)) {
    return { ok: false, reason: "Letters, numbers, spaces and . _ ' - only." };
  }
  const squashed = name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  if (BLOCKED.some((w) => squashed.includes(w))) {
    return { ok: false, reason: "Please pick a different name." };
  }
  return { ok: true, name };
}

/** Draw a quiz on the server: questions from different sections where possible, in book order. */
export function drawQuestionIds(book: BookInfo, count = QUIZ_LENGTH): string[] {
  const { questions } = quizBank(book);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  const picked: typeof questions = [];
  const chapters = new Set<string>();
  for (const q of shuffled) {
    if (picked.length >= count) break;
    if (!chapters.has(q.chapter)) {
      picked.push(q);
      chapters.add(q.chapter);
    }
  }
  for (const q of shuffled) {
    if (picked.length >= count) break;
    if (!picked.includes(q)) picked.push(q);
  }
  const order = (q: (typeof questions)[number]) => book.sections.indexOf(q.chapter);
  picked.sort((a, b) => order(a) - order(b));
  return picked.map((q) => q.id);
}
