import type { Metadata } from "next";
import { fraunces } from "../fonts/fraunces";
import BookReader, { type BookPart, type ReaderBook } from "../algorithms-made-easy-csc207/BookReader";
import { BOOK_AUTHOR, BOOK_AUTHOR_AVATAR, formatReadTime, readingMinutes } from "../algorithms-made-easy-csc207/book-meta";
import { BOOKS, isLocked } from "@/lib/books";
import { CA_BY_PAPER, CA_PAPERS } from "@/content/csc205ca/questions";
import {
  csc205caBookHtml,
  CSC205CA_COUNT,
  CSC205CA_LABELS,
  CSC205CA_LOCKED_COUNT,
  CSC205CA_NUMBERS,
  CSC205CA_PAGES,
  CSC205CA_PDF_URL,
} from "@/content/csc205ca/render";
import "../algorithms-made-easy-csc207/book.css";
import "../csc211-tutorial-solutions/csc211.css";
import "./csc205ca.css";

const book = BOOKS.csc205ca;
const wall = book.paywall!;
const siteUrl = "https://www.taberickson.com";
const pageUrl = `${siteUrl}${book.path}`;

const title = "CSC205 Past CA Solutions: 2022, 2023 and 2024 Papers Solved | Tabe Rickson";
const description = `${CSC205CA_COUNT} questions from four CSC205 past papers (CA 2024/2025, Test 1 2023, CA 2022/2023 and CA Test I 2022), solved with the working: base conversions, sign magnitude and two's complement, floating point and IEEE 754, ethics, operating systems and computer architecture. The first ${wall.freeSections} solutions of each paper are free.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CSC205",
    "CSC205 past questions",
    "CSC205 CA solutions",
    "University of Buea CSC205",
    "two's complement examples",
    "IEEE 754 examples",
    "number base conversion",
    "Tabe Rickson",
  ],
  alternates: { canonical: book.path },
  openGraph: {
    type: "book",
    title: "CSC205 Past CA Solutions",
    description: "Four past CSC205 papers, every question solved with the working shown.",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CSC205 Past CA Solutions",
    description: "Four past CSC205 papers, every question solved with the working shown.",
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
      author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: BOOK_AUTHOR, url: siteUrl },
      isAccessibleForFree: false,
      hasPart: { "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".sol-lock" },
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

const html = csc205caBookHtml();
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
    <span class="bs-item">${icon('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>')}${CSC205CA_COUNT} questions</span>
    <span class="bs-item bs-views" data-book-views></span>
  </div>`;
}

const parts: BookPart[] = CA_PAPERS.map((p) => ({
  name: p.name,
  chapters: CA_BY_PAPER[p.id].map((item) => ({
    id: item.id,
    num: book.sections.indexOf(item.id) + 1,
    tag: item.label,
    title: item.topic,
    subs: [],
    locked: isLocked(book, item.id),
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
    labels: CSC205CA_LABELS,
    numbers: CSC205CA_NUMBERS,
    introLine: "Questions from four CSC205 past papers. Each quiz brings ones you haven't answered yet. Pick A, B, C or D.",
  },
  feedback: { noun: "solution", example: "e.g. I got lost at the step where the bits are regrouped" },
  paywall: {
    priceFcfa: wall.priceFcfa,
    freeSections: wall.freeSections,
    lockedCount: CSC205CA_LOCKED_COUNT,
    invitesNeeded: wall.invitesNeeded,
    codes: wall.codes !== false,
    pdf: CSC205CA_PDF_URL,
    askOnOpen: true,
    freeLine: `The first ${wall.freeSections} solutions of each paper are free`,
    unlockTitle: "Get the full CSC205 CA solutions",
    unlockText: `All four papers in one ${CSC205CA_PAGES}-page PDF, plus the other ${CSC205CA_LOCKED_COUNT} solutions on this page, for one payment of ${wall.priceFcfa} FCFA.`,
  },
};

export default function Csc205CaBook() {
  const page = html.replace("<!--book-stats-->", statsHtml());
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookReader
        book={readerBook}
        parts={parts}
        pdf={CSC205CA_PDF_URL}
        className={fraunces.variable}
        about={`Four CSC205 past papers, every question answered with the working shown. The first ${wall.freeSections} solutions of each paper are free; the full ${CSC205CA_PAGES}-page PDF and the remaining solutions unlock for ${wall.priceFcfa} FCFA.`}
        credits={
          <p className="book-foot-credit">
            Questions are reproduced word for word from the papers so you can match them to your copy. Where a paper was
            only partly available, the paper&apos;s heading says so.
          </p>
        }
      >
        <article className="book-content book-csc211 book-csc205ca" dangerouslySetInnerHTML={{ __html: page }} />
      </BookReader>
    </>
  );
}
