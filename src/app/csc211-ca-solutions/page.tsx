import type { Metadata } from "next";
import { fraunces } from "../fonts/fraunces";
import BookReader, { type BookPart, type ReaderBook } from "../algorithms-made-easy-csc207/BookReader";
import { BOOK_AUTHOR, BOOK_AUTHOR_AVATAR } from "../algorithms-made-easy-csc207/book-meta";
import { BOOKS, sectionLabel } from "@/lib/books";
import { CSC211CA_QUESTIONS } from "./quiz-questions";
import {
  csc211caBookHtml,
  CSC211CA_DOWNLOADS,
  CSC211CA_LABELS,
  CSC211CA_NUMBERS,
  CSC211CA_PAGES,
  CSC211CA_PAPERS,
} from "@/content/csc211ca/render";
import "../algorithms-made-easy-csc207/book.css";
import "../csc205-revision/csc205.css";
import "./csc211ca.css";

const book = BOOKS.csc211ca;
const wall = book.paywall!;
const siteUrl = "https://www.taberickson.com";
const pageUrl = `${siteUrl}${book.path}`;

const title = "CSC211 Past CA Solutions: 2022, 2023 and 2024 CAs Solved | Tabe Rickson";
const description = `The CSC211 Probability and Statistics CAs of November 2022, 2023 and 2024, every question solved step by step: grouped mean, mode, median and variance, percentiles, conditional probability, joint distributions, and the binomial and hypergeometric distributions. Three PDF answer sheets.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CSC211",
    "CSC211 past questions",
    "CSC211 CA solutions",
    "University of Buea CSC211",
    "probability and statistics past papers",
    "grouped data mean mode median",
    "hypergeometric distribution example",
    "Tabe Rickson",
  ],
  alternates: { canonical: book.path },
  openGraph: {
    type: "book",
    title: "CSC211 Past CA Solutions",
    description: "Three past CSC211 CAs, every question solved step by step.",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CSC211 Past CA Solutions",
    description: "Three past CSC211 CAs, every question solved step by step.",
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
      numberOfPages: CSC211CA_PAGES,
      author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: BOOK_AUTHOR, url: siteUrl },
      isAccessibleForFree: false,
      offers: { "@type": "Offer", price: wall.priceFcfa, priceCurrency: "XAF", availability: "https://schema.org/InStock" },
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

const html = csc211caBookHtml();

const icon = (d: string) =>
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

function statsHtml(): string {
  return `<div class="book-stats">
    <a class="bs-author" href="/" rel="author">
      <img class="bs-avatar" src="${BOOK_AUTHOR_AVATAR}" alt="" width="34" height="34" />
      <span><span class="bs-label">Solved by</span><span class="bs-name">${BOOK_AUTHOR}</span></span>
    </a>
    <span class="bs-item">${icon('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>')}${CSC211CA_PAPERS.length} papers, ${CSC211CA_PAGES} pages</span>
    <span class="bs-item">${icon('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>')}${CSC211CA_QUESTIONS.length} quiz questions</span>
    <span class="bs-item bs-views" data-book-views></span>
  </div>`;
}

const parts: BookPart[] = [
  {
    name: "The papers",
    chapters: CSC211CA_PAPERS.map((p) => ({
      id: p.id,
      num: book.sections.indexOf(p.id) + 1,
      tag: sectionLabel(book, p.id),
      title: p.name,
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
    sectionNoun: "paper",
    labels: CSC211CA_LABELS,
    numbers: CSC211CA_NUMBERS,
    introLine: "Questions on the topics of the CSC211 CAs. Each quiz brings ones you haven't answered yet. Pick A, B, C or D.",
  },
  feedback: { noun: "paper", example: "e.g. please add the 2021 CA" },
  paywall: {
    priceFcfa: wall.priceFcfa,
    freeSections: wall.freeSections,
    lockedCount: CSC211CA_PAPERS.length,
    invitesNeeded: wall.invitesNeeded,
    codes: wall.codes !== false,
    downloads: CSC211CA_DOWNLOADS,
    askOnOpen: true,
    freeLine: "Three past CSC211 papers, fully solved",
    unlockTitle: "Get the CSC211 CA solutions",
    unlockText: `One payment of ${wall.priceFcfa} FCFA unlocks all three answer sheets (November 2022, 2023 and 2024), every question solved step by step.`,
    doneText: "All three answer sheets are open on this device and stay open when you come back.",
    welcomeOut: "Look around first",
  },
};

export default function Csc211CaBook() {
  const page = html.replace("<!--book-stats-->", statsHtml());
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookReader
        book={readerBook}
        parts={parts}
        className={fraunces.variable}
        about={`The CSC211 CAs of November 2022, 2023 and 2024, solved step by step, as three PDF answer sheets. One payment of ${wall.priceFcfa} FCFA unlocks all three.`}
        credits={
          <p className="book-foot-credit">
            Each answer sheet states the question from the paper, then the full working. Where the source paper left
            something out, the sheet says so.
          </p>
        }
      >
        <article className="book-content book-csc205 book-csc211ca" dangerouslySetInnerHTML={{ __html: page }} />
      </BookReader>
    </>
  );
}
