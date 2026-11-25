import type { Metadata } from "next";
import { fraunces } from "../fonts/fraunces";
import BookReader, { type BookPart, type ReaderBook } from "../algorithms-made-easy-csc207/BookReader";
import { BOOK_AUTHOR, BOOK_AUTHOR_AVATAR } from "../algorithms-made-easy-csc207/book-meta";
import { BOOKS, sectionLabel } from "@/lib/books";
import { CSC205_QUESTIONS } from "./quiz-questions";
import {
  csc205BookHtml as bookHtml,
  CSC205_LABELS,
  CSC205_NUMBERS,
  CSC205_PAGES,
  CSC205_PARTS_LIST,
  CSC205_PDF,
} from "@/content/csc205/render";
import "../algorithms-made-easy-csc207/book.css";
import "./csc205.css";

const book = BOOKS.csc205;
const siteUrl = "https://taberickson.com";
const pageUrl = `${siteUrl}${book.path}`;

const title = "CSC205 All-In-One Revision: Notes and Past Papers in One PDF";
const description = `CSC205 revision notes in one ${CSC205_PAGES}-page PDF, built from the lecture notes and the 2022, 2023 and 2024 past papers: number base conversions, signed numbers and 2's complement, IEEE 754, computer ethics, operating systems, Windows and GUIs, and the history of computing. With ${CSC205_QUESTIONS.length} quiz questions.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CSC205",
    "CSC205 revision",
    "CSC205 past questions",
    "number base conversion",
    "2's complement",
    "computer ethics",
    "operating systems",
    "Tabe Rickson",
  ],
  alternates: { canonical: book.path },
  openGraph: {
    type: "book",
    title: "CSC205 All-In-One Revision",
    description: "Lecture notes and three past papers in one PDF, ordered by what actually comes up.",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CSC205 All-In-One Revision",
    description: "Lecture notes and three past papers in one PDF, ordered by what actually comes up.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Book",
      "@id": `${pageUrl}#book`,
      name: book.title,
      description,
      url: pageUrl,
      inLanguage: "en",
      bookFormat: "https://schema.org/EBook",
      numberOfPages: CSC205_PAGES,
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

const icon = (d: string) =>
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

function statsHtml(): string {
  return `<div class="book-stats">
    <a class="bs-author" href="/" rel="author">
      <img class="bs-avatar" src="${BOOK_AUTHOR_AVATAR}" alt="" width="34" height="34" />
      <span><span class="bs-label">Shared by</span><span class="bs-name">${BOOK_AUTHOR}</span></span>
    </a>
    <span class="bs-item">${icon('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>')}${CSC205_PAGES}-page PDF</span>
    <span class="bs-item">${icon('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>')}${CSC205_QUESTIONS.length} quiz questions</span>
    <span class="bs-item bs-views" data-book-views></span>
  </div>`;
}

const parts: BookPart[] = [
  {
    name: "The revision notes",
    chapters: CSC205_PARTS_LIST.map((p) => ({
      id: p.id,
      num: book.sections.indexOf(p.id) + 1,
      tag: sectionLabel(book, p.id),
      title: p.title,
      subs: [],
    })),
  },
];

const readerBook: ReaderBook = {
  id: book.id,
  title: book.title,
  path: book.path,
  quiz: {
    id: book.id,
    title: book.title,
    quizLink: book.quizLink,
    sectionNoun: "part",
    labels: CSC205_LABELS,
    numbers: CSC205_NUMBERS,
    introLine: "Questions on every part of the notes. Each quiz brings ones you haven't answered yet. Pick A, B, C or D.",
  },
  feedback: { noun: "part", example: "e.g. I still don't get 2's complement subtraction" },
  support: {
    title: "Did these notes help you?",
    text: "CSC205 All-In-One Revision is free for everyone, no ads. If it helped you, a small tip tells Tabe it was worth it and keeps revision notes coming before every exam.",
    download: `The ${CSC205_PAGES}-page CSC205 revision PDF is yours to keep, print and share, free. If it helps you in the exam, a small tip tells Tabe it was worth it and keeps revision notes coming.`,
  },
};

export default function Csc205RevisionBook() {
  const page = html.replace("<!--book-stats-->", statsHtml());
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookReader
        book={readerBook}
        parts={parts}
        pdf={CSC205_PDF}
        className={fraunces.variable}
        about="CSC205 revision notes in one PDF, built from the lecture notes and the 2022, 2023 and 2024 past papers, ordered by how often each topic comes up."
        credits={
          <p className="book-foot-credit">
            Built from the CSC205 lecture notes and past papers (University of Buea) for revision. Check anything you
            are unsure of against your own course notes.
          </p>
        }
      >
        <article className="book-content book-csc205" dangerouslySetInnerHTML={{ __html: page }} />
      </BookReader>
    </>
  );
}
