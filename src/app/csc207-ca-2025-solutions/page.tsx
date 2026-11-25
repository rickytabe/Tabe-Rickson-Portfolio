import type { Metadata } from "next";
import { fraunces } from "../fonts/fraunces";
import BookReader, { type BookPart, type ReaderBook } from "../algorithms-made-easy-csc207/BookReader";
import { BOOK_AUTHOR, BOOK_AUTHOR_AVATAR, formatReadTime, readingMinutes } from "../algorithms-made-easy-csc207/book-meta";
import { BOOKS, sectionLabel } from "@/lib/books";
import { CSC207TEST1_ITEMS } from "@/content/csc207test1/questions";
import {
  csc207test1BookHtml as bookHtml,
  CSC207TEST1_COUNT as COUNT,
  CSC207TEST1_LABELS,
  CSC207TEST1_NUMBERS,
  CSC207TEST1_PARTS,
  CSC207TEST1_PDF,
} from "@/content/csc207test1/render";
import "../algorithms-made-easy-csc207/book.css";
import "../csc211-tutorial-solutions/csc211.css";
import "../csc207-tutorial-solutions/csc207t.css";
import "./csc207test1.css";

const book = BOOKS.csc207test1;
const siteUrl = "https://www.taberickson.com";
const pageUrl = `${siteUrl}${book.path}`;

const title = "CSC207 CA 2025 Solutions: Every Question Solved | Tabe Rickson";
const description = `All ${COUNT} questions on the CSC207 Introduction to Algorithms CA 2025 solved: ordered set initSet and contains, isPalindrome, exact-output tracing of switch, for and while, and the course registration pseudocode with its flowchart.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CSC207",
    "CSC207 CA 2025",
    "CSC207 CA",
    "CSC207 test solutions",
    "CSC207 past questions",
    "pseudocode",
    "flowchart",
    "Introduction to Algorithms",
    "Tabe Rickson",
  ],
  alternates: { canonical: book.path },
  openGraph: {
    type: "book",
    title: "CSC207 CA 2025",
    description: "Every question on the CSC207 CA 2025, solved. Pseudocode, flowchart and exact outputs.",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CSC207 CA 2025",
    description: "Every question on the CSC207 CA 2025, solved. Pseudocode, flowchart and exact outputs.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Book",
      "@id": `${pageUrl}#book`,
      name: book.title,
      alternativeHeadline: "CSC207 CA 2025, solved",
      description,
      url: pageUrl,
      inLanguage: "en",
      author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: BOOK_AUTHOR, url: siteUrl },
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
    <span class="bs-item">${icon('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>')}${COUNT} questions</span>
    <span class="bs-item bs-views" data-book-views></span>
  </div>`;
}

const parts: BookPart[] = CSC207TEST1_PARTS.map((p) => ({
  name: p.name,
  chapters: p.ids.map((id) => ({
    id,
    num: book.sections.indexOf(id) + 1,
    tag: sectionLabel(book, id),
    title: CSC207TEST1_ITEMS.find((i) => i.id === id)!.topic,
    subs: [],
  })),
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
    labels: CSC207TEST1_LABELS,
    numbers: CSC207TEST1_NUMBERS,
    introLine: "Short questions on the CA 2025 topics. Pick A, B, C or D.",
  },
  feedback: { noun: "solution", example: "e.g. I didn't get why the for loop prints 11 at the end" },
  support: {
    title: "Did these solutions help you?",
    text: "CSC207 CA 2025 is every question on the paper solved in full, free for everyone, no ads. If it helped you, a small tip tells Tabe it was worth it and keeps solved papers coming before every exam.",
    download: "The 8-page PDF of the CA 2025 solutions is yours to keep, print and share, free. If it helps you in the exam, a small tip tells Tabe it was worth it and keeps solved papers coming.",
  },
};

export default function Csc207Test1Book() {
  const page = html.replace("<!--book-stats-->", statsHtml());
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookReader
        book={readerBook}
        parts={parts}
        pdf={CSC207TEST1_PDF}
        className={fraunces.variable}
        about="Every question on the CSC207 Introduction to Algorithms CA 2025 paper, solved in the course pseudocode, straight to the answers."
        credits={
          <p className="book-foot-credit">
            Questions are reproduced word for word from the CSC207 CA 2025 paper (University of Buea) so
            you can match them to your copy. Where the paper leaves a choice open, the solution says what was assumed.
          </p>
        }
      >
        <article className="book-content book-csc211 book-csc207t book-csc207test1" dangerouslySetInnerHTML={{ __html: page }} />
      </BookReader>
    </>
  );
}
