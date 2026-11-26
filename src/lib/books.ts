// The books on the site. Plain data, safe to import from client components and the server.
// Each book's stats, quiz board, feedback and unlocks are kept apart by its id.

export type BookId = "csc207" | "csc211" | "csc207t" | "csc207test1" | "csc207ca24" | "csc205" | "csc205ca";

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
  /** Extra ids that take "Was this clear?" votes without being a section, e.g. the whole notes. */
  feedbackOn?: string[];
  /**
   * Paid books: the first `freeSections` solutions are open, the rest unlock.
   * `perPart`: count the free ones per part (the id before the first "-", e.g. one past paper).
   * `invitesNeeded: 0` turns invites off; `codes: false` turns gift codes off (payment only).
   * `pdf`: the full PDF, kept out of public/ and served only to unlocked readers.
   */
  paywall?: {
    freeSections: number;
    priceFcfa: number;
    invitesNeeded: number;
    perPart?: boolean;
    codes?: boolean;
    pdf?: string;
  };
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
    title: "CSC207 CA 2025",
    path: "/csc207-ca-2025-solutions",
    quizLink: "https://taberickson.com/csc207/ca2025/quiz?ref=quiz-share",
    shortLink: "https://taberickson.com/csc207/ca2025",
    sectionNoun: "question",
    // CA 2025: Section A 1, 2, 3a-c; Section B 1.
    sections: ["a1", "a2", "a3a", "a3b", "a3c", "b1"],
    // Free for everyone, like the other CSC207 books: supported by voluntary tips.
  },
  csc207ca24: {
    id: "csc207ca24",
    title: "CSC207 CA 2024",
    path: "/csc207-ca-2024-solutions",
    quizLink: "https://taberickson.com/csc207/ca2024/quiz?ref=quiz-share",
    shortLink: "https://taberickson.com/csc207/ca2024",
    sectionNoun: "question",
    // CA 2024 (20/11/2024): Section A 1a-c, 2a-d; Section B the auto teller.
    sections: ["a1a", "a1b", "a1c", "a2a", "a2b", "a2c", "a2d", "b1"],
    // Free for everyone, like the other CSC207 books: supported by voluntary tips.
  },
  csc205: {
    id: "csc205",
    title: "CSC205 All-In-One Revision",
    path: "/csc205-revision",
    quizLink: "https://taberickson.com/csc205/quiz?ref=quiz-share",
    shortLink: "https://taberickson.com/csc205",
    sectionNoun: "part",
    // A PDF-only book: the page lists the parts of the notes, and Algo quizzes each one.
    sections: ["p1", "p2", "p3", "p4", "p5", "p6"],
    // "Were these notes helpful?" under the download button rates the PDF as a whole.
    feedbackOn: ["notes"],
    // Free for everyone: supported by voluntary tips when the PDF is downloaded.
  },
  csc205ca: {
    id: "csc205ca",
    title: "CSC205 Past CA Solutions",
    path: "/csc205-ca-solutions",
    quizLink: "https://taberickson.com/csc205/ca/quiz?ref=quiz-share",
    shortLink: "https://taberickson.com/csc205/ca",
    sectionNoun: "question",
    // Four past papers, newest first. Ids are `<paper>-<question>`, matching src/content/csc205ca.
    sections: [
      ...range("y24-a", 1, 7),
      ...range("y24-b", 1, 7),
      ...range("y24-c", 1, 8),
      ...range("y23-a", 1, 10),
      ...range("y23-b", 1, 3),
      ...range("y23-e1-", 1, 5),
      ...range("y23-e2-", 1, 7),
      ...range("y22b-a", 1, 10),
      ..."abcdefghij".split("").map((l) => `y22-1${l}`),
      ...range("y22-2-", 1, 4),
    ],
    // Paid, payment only (Tabe's call): the first 15 solutions of each paper are free, then
    // 500 FCFA through Fapshi unlocks the rest and the full PDF. No invites, no gift codes.
    paywall: { freeSections: 15, perPart: true, priceFcfa: 500, invitesNeeded: 0, codes: false, pdf: "csc205-past-ca-solutions.pdf" },
  },
};

export const BOOK_IDS = Object.keys(BOOKS) as BookId[];

/** The course a book belongs to, read from its title: "CSC207 CA 2025" -> "CSC207". */
export function courseOf(book: BookInfo): string {
  return /^[A-Z]{2,4}\s?\d{3}/.exec(book.title)?.[0].replace(/\s/, "") ?? "Other";
}

/** A book's name inside its course: "CSC207 CA 2025" -> "CA 2025". */
export function titleInCourse(book: BookInfo): string {
  return book.title.replace(/^[A-Z]{2,4}\s?\d{3}\s*/, "") || book.title;
}

/**
 * Every book grouped by course, courses in code order and books in the order they are listed in
 * BOOKS. New books join their course's group, and a new course becomes a new group, so lists built
 * from this stay organised however many books there are.
 */
export function booksByCourse(ids: readonly BookId[] = BOOK_IDS): { course: string; ids: BookId[] }[] {
  const groups = new Map<string, BookId[]>();
  for (const id of ids) {
    const course = courseOf(BOOKS[id]);
    groups.set(course, [...(groups.get(course) ?? []), id]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))
    .map(([course, list]) => ({ course, ids: list }));
}

/** The book a request is about. Requests from pages built before there were two books say nothing: CSC207. */
export function bookFrom(value: unknown): BookInfo {
  return typeof value === "string" && value in BOOKS ? BOOKS[value as BookId] : BOOKS.csc207;
}

/** Whether a section's solution is behind the paywall. */
export function isLocked(book: BookInfo, section: string): boolean {
  if (!book.paywall) return false;
  const part = section.split("-")[0];
  const list = book.paywall.perPart ? book.sections.filter((s) => s.split("-")[0] === part) : book.sections;
  return list.indexOf(section) >= book.paywall.freeSections;
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
  // CSC205 Past CA: "y24-b3" -> "B3", "y23-e1-2" -> "E1.2", "y22-1c" -> "1(c)", "y22-2-3" -> "2.3"
  if (book.id === "csc205ca") {
    const rest = section.slice(section.indexOf("-") + 1);
    if (/^1[a-j]$/.test(rest)) return `1(${rest[1]})`;
    return rest.replace(/-/g, ".").toUpperCase();
  }
  // CSC207 CA 2025 and CA 2024: "a3b" -> "A3b", "b1" -> "B1"
  if (book.id === "csc207test1" || book.id === "csc207ca24") return `${section[0].toUpperCase()}${section.slice(1)}`;
  return section.startsWith("b") ? `B${section.slice(1)}` : section.slice(1);
}
