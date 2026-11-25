// The books on the site. Plain data, safe to import from client components and the server.
// Each book's stats, quiz board, feedback and unlocks are kept apart by its id.

export type BookId = "csc207" | "csc211" | "csc207t" | "csc207test1";

export type BookInfo = {
  id: BookId;
  title: string;
  path: string;
  /** Link shared from the quiz's "Challenge a classmate" button. */
  quizLink: string;
  /** Short link to the book, used for invite links. */
  shortLink: string;
  /** What a section of the book is called in the quiz and feedback ("chapter", "question"). */
  sectionNoun: string;
  /** Section ids in reading order: every id the stats and the quiz may refer to. */
  sections: string[];
  /** Paid books: the first `freeSections` solutions are open, the rest unlock. */
  paywall?: { freeSections: number; priceFcfa: number; invitesNeeded: number };
};

const range = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

export const BOOKS: Record<BookId, BookInfo> = {
  csc207: {
    id: "csc207",
    title: "CSC207 Made Easy",
    path: "/algorithms-made-easy-csc207",
    quizLink: "https://taberickson.com/csc207/quiz?ref=quiz-share",
    shortLink: "https://taberickson.com/csc207",
    sectionNoun: "chapter",
    sections: range("c", 1, 24),
  },
  csc211: {
    id: "csc211",
    title: "CSC211 Tutorial Sheet Solutions",
    path: "/csc211-tutorial-solutions",
    quizLink: "https://taberickson.com/csc211/quiz?ref=quiz-share",
    shortLink: "https://taberickson.com/csc211",
    sectionNoun: "question",
    // Part A questions 1 to 35, then Part B questions 26 to 39, in the order of the sheet.
    sections: [...range("a", 1, 35), ...range("b", 26, 39)],
    paywall: { freeSections: 15, priceFcfa: 200, invitesNeeded: 3 },
  },
  csc207t: {
    id: "csc207t",
    title: "CSC207 Tutorial Sheet Solutions",
    path: "/csc207-tutorial-solutions",
    quizLink: "https://taberickson.com/csc207/tutorial/quiz?ref=quiz-share",
    // /csc207 and /csc207/quiz belong to CSC207 Made Easy, so the tutorials live under /csc207/tutorial.
    shortLink: "https://taberickson.com/csc207/tutorial",
    sectionNoun: "question",
    // Tutorial Sheet 1: Exercise I (1a, 1b, 2), II (1-10), III (1-10), IV (a-d). Later sheets append here.
    sections: [
      "s1-e1-1a", "s1-e1-1b", "s1-e1-2",
      ...range("s1-e2-", 1, 10),
      ...range("s1-e3-", 1, 10),
      "s1-e4-a", "s1-e4-b", "s1-e4-c", "s1-e4-d",
    ],
    // Free for everyone (Tabe's call): supported by voluntary tips, like CSC207 Made Easy.
  },
  csc207test1: {
    id: "csc207test1",
    title: "CSC207 Test 1 Solutions",
    path: "/csc207-test-1-solutions",
    quizLink: "https://taberickson.com/csc207/test1/quiz?ref=quiz-share",
    shortLink: "https://taberickson.com/csc207/test1",
    sectionNoun: "question",
    // Test 1 (November 2025): Section A 1, 2, 3a-c; Section B 1.
    sections: ["a1", "a2", "a3a", "a3b", "a3c", "b1"],
    // Free for everyone, like the other CSC207 books: supported by voluntary tips.
  },
};

export const BOOK_IDS = Object.keys(BOOKS) as BookId[];

/** The book a request is about. Requests from pages built before there were two books say nothing: CSC207. */
export function bookFrom(value: unknown): BookInfo {
  return typeof value === "string" && value in BOOKS ? BOOKS[value as BookId] : BOOKS.csc207;
}

/** Whether a section's solution is behind the paywall. */
export function isLocked(book: BookInfo, section: string): boolean {
  if (!book.paywall) return false;
  const i = book.sections.indexOf(section);
  return i >= book.paywall.freeSections;
}

/**
 * Firestore keys that are per book. CSC207 was the only book when its data was first written,
 * so its keys stay exactly as they were; other books get a prefix.
 */
export function scoped(book: BookInfo, key: string): string {
  return book.id === "csc207" ? key : `${book.id}-${key}`;
}

/** "Q16", "B30": how a CSC211 section is printed on the question sheet. */
export function sectionLabel(book: BookInfo, section: string): string {
  if (book.id === "csc207") return String(Number(section.slice(1)));
  if (book.id === "csc207t") {
    // "s1-e2-3" -> "II.3", "s1-e4-a" -> "IV.a"
    const m = /^s\d+-e(\d)-(\w+)$/.exec(section);
    return m ? `${["", "I", "II", "III", "IV"][Number(m[1])] ?? m[1]}.${m[2]}` : section;
  }
  // CSC207 Test 1: "a3b" -> "A3b", "b1" -> "B1"
  if (book.id === "csc207test1") return `${section[0].toUpperCase()}${section.slice(1)}`;
  return section.startsWith("b") ? `B${section.slice(1)}` : section.slice(1);
}
