// Server-only: the CSC211 Past CA Solutions page. The book is three PDFs, strictly paid: the page
// shows one card per paper, previewed by the top of its own answer sheet (the university header and
// title, cut from the original PDF, no answers), with the topics that came up and its download.
// The PDFs live in private/ and are served by /api/book/pdf to unlocked readers only. The source
// sheets and the build script are in csc207-tutorial-1-source/ (build_csc211ca.py).
import { BOOKS, sectionLabel } from "@/lib/books";

const BOOK = BOOKS.csc211ca;
const WALL = BOOK.paywall!;
const DIR = "/csc211-ca-solutions";

export type Csc211CaPaper = {
  id: string;
  name: string;
  meta: string;
  questions: number;
  pages: number;
  /** The header strip of the original answer sheet (PNG) and its pixel size. */
  header: { src: string; width: number; height: number };
  topics: string[];
};

export const CSC211CA_PAPERS: Csc211CaPaper[] = [
  {
    id: "y24",
    name: "CA November 2024",
    meta: "Mme Tabo D.",
    questions: 5,
    pages: 3,
    header: { src: `${DIR}/y24-header.png`, width: 1240, height: 269 },
    topics: [
      "Definitions: sample space, event, probability, random variable, distribution function",
      "When two events are independent, and when they are mutually exclusive",
      "The combined mean of two groups",
      "Expected value and the cumulative distribution function of a discrete random variable",
      "A joint probability function: drawing balls without replacement",
      "Distorted bits: counting orderings, the binomial distribution, E(X) and Var(X)",
    ],
  },
  {
    id: "y23",
    name: "CA November 2023",
    meta: "17 November 2023 · 1 h 30 min · Dr Nyanga and Mme Tabo D.",
    questions: 3,
    pages: 4,
    header: { src: `${DIR}/y23-header.png`, width: 1240, height: 293 },
    topics: [
      "Range, percentage pass and the 75th percentile of 20 scores",
      "Grouped data: mean, mode, median and variance",
      "Independent events: will both, neither or at least one be alive in 20 years",
      "Conditional probability: drawing marbles without replacement",
    ],
  },
  {
    id: "y22",
    name: "CA November 2022",
    meta: "25 November 2022 · 90 minutes · Mme Tabo D.",
    questions: 3,
    pages: 5,
    header: { src: `${DIR}/y22-header.png`, width: 1240, height: 293 },
    topics: [
      "Range and a grouped frequency table of 50 values",
      "Grouped data: mean, mode and median",
      "The addition rule: job offers from two companies",
      "The hypergeometric distribution: defective chips, a tree diagram, E[X], Var[X] and the CDF",
    ],
  },
];

export const CSC211CA_PAGES = CSC211CA_PAPERS.reduce((a, p) => a + p.pages, 0);

export const CSC211CA_LABELS: Record<string, string> = {
  ...Object.fromEntries(CSC211CA_PAPERS.map((p) => [p.id, p.name])),
  notes: "The book as a whole",
};
export const CSC211CA_NUMBERS: Record<string, string> = {
  ...Object.fromEntries(CSC211CA_PAPERS.map((p) => [p.id, sectionLabel(BOOK, p.id)])),
  notes: "All",
};

const pdfUrl = (paper: string) => `/api/book/pdf?book=${BOOK.id}&paper=${paper}`;
/** Every paper's PDF, offered on the thank-you screen. */
export const CSC211CA_DOWNLOADS = CSC211CA_PAPERS.map((p) => ({ label: `${p.name} Solutions`, href: pdfUrl(p.id) }));

const LOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

function paperHtml(p: Csc211CaPaper): string {
  return `<section class="ch ca-card" id="${p.id}">
  <a class="ca-sheet" href="${pdfUrl(p.id)}" data-paid-pdf aria-label="Get the ${p.name} Solutions">
    <img src="${p.header.src}" width="${p.header.width}" height="${p.header.height}" alt="The top of the ${p.name} answer sheet: University of Buea, Faculty of Science, CSC 211 Probability and Statistics" loading="lazy" decoding="async" />
    <span class="ca-sheet-cap">${p.pages}-page answer sheet &middot; ${p.questions} questions solved</span>
  </a>
  <div class="ch-head">
    <div class="ch-num">${sectionLabel(BOOK, p.id)}</div>
    <div>
      <h3>${p.name} Solutions</h3>
      <p class="oneline">${p.meta}</p>
    </div>
  </div>
  <p class="ca-sec">What came up</p>
  <ul class="rev-covers">${p.topics.map((t) => `<li>${t}</li>`).join("")}</ul>
  <p class="ca-dls"><a class="dl" href="${pdfUrl(p.id)}" data-paid-pdf>${LOCK_ICON}Download the ${p.name} Solutions</a></p>
</section>`;
}

function coverHtml(): string {
  return `<header class="cover">
  <div class="kicker">CSC211 &middot; Probability &amp; statistics &middot; past papers</div>
  <h1 class="title">CSC211 <em>Past CA Solutions</em></h1>
  <p class="sub">The November 2022, 2023 and 2024 CSC211 CAs, every question solved step by step: grouped data, percentiles, conditional probability, and the binomial and hypergeometric distributions.</p>
  <!--book-stats-->
  <p class="dlnote">Three answer sheets, ${CSC211CA_PAGES} pages in all. One payment of ${WALL.priceFcfa} FCFA unlocks all three.</p>
</header>
<div class="ch-feedback rev-feedback" data-chapter="notes" data-question="Were these solutions helpful?" data-yes="Yes, helpful" data-example="e.g. please add the 2021 CA"></div>`;
}

/** The whole page: cover, how to use it, then one card per paper. */
export function csc211caBookHtml(): string {
  return [
    coverHtml(),
    `<div class="box note">
  <div class="lab">How to use it</div>
  <p>The same question types come back every year: grouped data, a probability rule, and one distribution. Try each paper under exam time, then check every step against the solutions.</p>
  <p>Then open <b>Quiz me</b>. Algo asks questions on the same topics, and each quiz brings ones you haven't answered yet.</p>
</div>`,
    `<h2 class="rev-h">The papers</h2>`,
    ...CSC211CA_PAPERS.map(paperHtml),
  ].join("\n\n");
}
