import type { Metadata } from "next";
import { fraunces } from "../fonts/fraunces";
import BookReader, { type BookPart, type ReaderBook } from "../algorithms-made-easy-csc207/BookReader";
import { BOOK_AUTHOR, BOOK_AUTHOR_AVATAR, formatReadTime, readingMinutes } from "../algorithms-made-easy-csc207/book-meta";
import { BOOKS, isLocked, sectionLabel } from "@/lib/books";
import { CSC211_ITEMS } from "@/content/csc211/questions";
import { bookHtml, CSC211_LABELS, CSC211_NUMBERS, CSC211_PARTS, LOCKED_COUNT, SOLVED_COUNT } from "@/content/csc211/render";
import "katex/dist/katex.min.css";
import "../algorithms-made-easy-csc207/book.css";
import "./csc211.css";

const book = BOOKS.csc211;
const wall = book.paywall!;
const siteUrl = "https://taberickson.com";
const pageUrl = `${siteUrl}${book.path}`;

const title = "CSC211 Tutorial Solutions: Every Probability Question Solved Step by Step";
const description = `All ${SOLVED_COUNT} CSC211 tutorial questions solved in full: sample spaces, conditional probability, Bayes, counting, binomial, Poisson, geometric and normal distributions, and joint densities. Each one starts with how to recognise the problem. Questions 1 to ${wall.freeSections} free.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CSC211",
    "CSC211 tutorial solutions",
    "probability tutorial solutions",
    "conditional probability",
    "Bayes theorem examples",
    "binomial distribution examples",
    "Poisson distribution examples",
    "joint density function",
    "Tabe Rickson",
  ],
  alternates: { canonical: book.path },
  openGraph: {
    type: "book",
    title: "CSC211 Tutorial Sheet Solutions",
    description: "Every CSC211 tutorial question, solved step by step. Know exactly which rule to use in the CA.",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CSC211 Tutorial Sheet Solutions",
    description: "Every CSC211 tutorial question, solved step by step. Know exactly which rule to use in the CA.",
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
      alternativeHeadline: "CSC211 tutorial solutions, step by step",
      description,
      url: pageUrl,
      inLanguage: "en",
      author: { "@type": "Person", name: BOOK_AUTHOR, url: siteUrl },
      isAccessibleForFree: false,
      hasPart: CSC211_ITEMS.filter((i) => i.solution && isLocked(book, i.id)).length
        ? { "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".sol-lock" }
        : undefined,
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

const parts: BookPart[] = CSC211_PARTS.map((p) => ({
  name: p.name,
  chapters: p.ids.map((id) => {
    const item = CSC211_ITEMS.find((i) => i.id === id)!;
    return {
      id,
      num: book.sections.indexOf(id) + 1,
      tag: sectionLabel(book, id),
      title: item.topic,
      subs: [],
      locked: !!item.solution && isLocked(book, id),
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
    labels: CSC211_LABELS,
    numbers: CSC211_NUMBERS,
    introLine: "Short questions on which tool to use and why. Pick A, B, C or D.",
  },
  feedback: { noun: "solution", example: "e.g. I got lost at the step with the binomial coefficient" },
  paywall: { ...wall, lockedCount: LOCKED_COUNT },
};

export default function Csc211Book() {
  const page = html.replace("<!--book-stats-->", statsHtml());
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookReader
        book={readerBook}
        parts={parts}
        className={fraunces.variable}
        about={`Every question on the CSC211 probability and statistics tutorial sheet, solved in full. Before each solution, a short box shows how to recognise the problem and which rule to use, so the method carries over to the CA and the exam.`}
        credits={
          <p className="book-foot-credit">
            Questions are reproduced word for word from the CSC211 tutorial sheet so you can match them to your copy.
            Where the sheet has a typing mistake or a missing formula, the solution says what was assumed.
          </p>
        }
      >
        <article className="book-content book-csc211" dangerouslySetInnerHTML={{ __html: page }} />
      </BookReader>
    </>
  );
}
