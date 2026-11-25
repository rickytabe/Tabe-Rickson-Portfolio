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

/**
 * Draw a quiz on the server: questions from different sections where possible, in book order.
 *
 * Rotation: `seen` is the questions this reader has already answered in the current cycle. They are
 * left out until every question in the bank has been answered once, so the same reader does not get
 * the same questions again before they have seen them all. When fewer than `count` unseen questions
 * remain, the quiz takes all of them, tops up from the rest, and `reset` says the cycle starts again.
 */
export function drawQuestions(
  book: BookInfo,
  seen: readonly string[] = [],
  count = QUIZ_LENGTH
): { ids: string[]; reset: boolean } {
  const { questions } = quizBank(book);
  const seenSet = new Set(seen);
  const fresh = questions.filter((q) => !seenSet.has(q.id));
  const reset = fresh.length < count;
  const shuffle = <T,>(list: T[]) => [...list].sort(() => Math.random() - 0.5);
  // Unseen questions first; on a reset, every one of them is in, and the rest of the bank fills up.
  const pools = reset ? [fresh, questions.filter((q) => seenSet.has(q.id))] : [fresh];
  const picked: typeof questions = [];
  for (const pool of pools) {
    const shuffled = shuffle(pool);
    const chapters = new Set(picked.map((q) => q.chapter));
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
  }
  const order = (q: (typeof questions)[number]) => book.sections.indexOf(q.chapter);
  picked.sort((a, b) => order(a) - order(b));
  return { ids: picked.map((q) => q.id), reset };
}

/** Reader field that holds the question ids answered in the current rotation, per book. */
export const QUIZ_SEEN_FIELD = "quizSeen";
