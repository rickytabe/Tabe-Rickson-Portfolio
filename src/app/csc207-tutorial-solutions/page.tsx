import type { Metadata } from "next";
import { fraunces } from "../fonts/fraunces";
import BookReader, { type BookPart, type ReaderBook } from "../algorithms-made-easy-csc207/BookReader";
import { BOOK_AUTHOR, BOOK_AUTHOR_AVATAR, formatReadTime, readingMinutes } from "../algorithms-made-easy-csc207/book-meta";
import { BOOKS, sectionLabel } from "@/lib/books";
import { CSC207T_ITEMS } from "@/content/csc207t/questions";
import {
  csc207tBookHtml as bookHtml,
  CSC207T_LABELS,
  CSC207T_NUMBERS,
  CSC207T_PARTS,
  CSC207T_SOLVED_COUNT as SOLVED_COUNT,
  CSC207T_PDF,
} from "@/content/csc207t/render";
import "../algorithms-made-easy-csc207/book.css";
import "../csc211-tutorial-solutions/csc211.css";
import "./csc207t.css";

const book = BOOKS.csc207t;
const siteUrl = "https://taberickson.com";
const pageUrl = `${siteUrl}${book.path}`;

const title = "CSC207 Tutorial Sheet Solutions: Branching and Looping, Every Question Solved";
const description = `All ${SOLVED_COUNT} questions on CSC207 Tutorial Sheet 1 solved in full pseudocode: ordered set Insert and Union, isPalindrome, branching programs (grades, leap year, BMI, calculator), looping programs (factorial, Fibonacci, primes, patterns) and exact-output tracing. Each one starts with how to recognise the problem.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CSC207",
    "CSC207 tutorial solutions",
    "CSC207 tutorial sheet",
    "branching and looping pseudocode",
    "pseudocode exercises with solutions",
    "algorithm output tracing",
    "Introduction to Algorithms",
    "Tabe Rickson",
  ],
  alternates: { canonical: book.path },
  openGraph: {
    type: "book",
    title: "CSC207 Tutorial Sheet Solutions",
    description: "Every CSC207 tutorial question, solved step by step. Know exactly which construct to use in the CA.",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CSC207 Tutorial Sheet Solutions",
    description: "Every CSC207 tutorial question, solved step by step. Know exactly which construct to use in the CA.",
  },
};

// Free solutions are part of the page, locked ones are not: Google sees the free part as free.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Book",
      "@id": `${pageUrl}#book`,
      name: book.title,
      alternativeHeadline: "CSC207 tutorial solutions, step by step",
      description,
      url: pageUrl,
      inLanguage: "en",
      author: { "@type": "Person", name: BOOK_AUTHOR, url: siteUrl },
      isAccessibleForFree: true,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Books", item: `${siteUrl}/books` },
        { "@type": "ListItem", position: 3, name: book.title, item: pageUrl },
      ],
    },
  ],
};

const html = bookHtml();
const minutes = readingMinutes(html);

const icon = (d: string) =>
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

function statsHtml(): string {
  return `<div class="book-stats">
    <a class="bs-author" href="/" rel="author">
      <img class="bs-avatar" src="${BOOK_AUTHOR_AVATAR}" alt="" width="34" height="34" />
      <span><span class="bs-label">Solved by</span><span class="bs-name">${BOOK_AUTHOR}</span></span>
    </a>
    <span class="bs-item">${icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')}${formatReadTime(minutes)}</span>
    <span class="bs-item">${icon('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>')}${SOLVED_COUNT} questions</span>
    <span class="bs-item bs-views" data-book-views></span>
  </div>`;
}

const parts: BookPart[] = CSC207T_PARTS.map((p) => ({
  name: p.name,
  chapters: p.ids.map((id) => {
    const item = CSC207T_ITEMS.find((i) => i.id === id)!;
    return {
      id,
      num: book.sections.indexOf(id) + 1,
      tag: sectionLabel(book, id),
      title: item.topic,
      subs: [],
    };
  }),
}));

const readerBook: ReaderBook = {
  id: book.id,
  title: book.title,
  path: book.path,
  quiz: {
    id: book.id,
    title: book.title,
    quizLink: book.quizLink,
    sectionNoun: "question",
    labels: CSC207T_LABELS,
    numbers: CSC207T_NUMBERS,
    introLine: "Short questions on branching, loops and tracing. Pick A, B, C or D.",
  },
  feedback: { noun: "solution", example: "e.g. I didn't get why the loop stops at i * i <= n" },
  support: {
    title: "Did these solutions help you?",
    text: "CSC207 Tutorial Sheet Solutions is every tutorial question solved in full, free for everyone, no ads. If it helped you, a small tip tells Tabe it was worth it and keeps new sheets coming before every CA.",
    download: "The 22-page PDF of Tutorial Sheet 1 is yours to keep, print and share, free. If it helps you in the CA, a small tip tells Tabe it was worth it and keeps new sheets coming.",
  },
};

export default function Csc207TutorialBook() {
  const page = html.replace("<!--book-stats-->", statsHtml());
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookReader
        book={readerBook}
        parts={parts}
        pdf={CSC207T_PDF}
        className={fraunces.variable}
        about={`Every question on the CSC207 tutorial sheets, solved in full in the course pseudocode. Before each solution, a short box shows how to recognise the problem and which construct to use, so the method carries over to the CA and the exam.`}
        credits={
          <p className="book-foot-credit">
            Questions are reproduced word for word from CSC207 Tutorial Sheet 1 (Dr. Achankeng P. / Dr. Nyanga B.) so
            you can match them to your copy. Where the sheet leaves a choice open, the solution says what was assumed.
          </p>
        }
      >
        <article className="book-content book-csc211 book-csc207t" dangerouslySetInnerHTML={{ __html: page }} />
      </BookReader>
    </>
  );
}
