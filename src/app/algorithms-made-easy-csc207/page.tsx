import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import BookReader, { type BookPart } from "./BookReader";
import { TOPIC_LABELS as topicLabels } from "./book-info";
import {
  BOOK_AUTHOR,
  BOOK_AUTHOR_AVATAR,
  BOOK_CHAPTERS,
  BOOK_PATH,
  formatReadTime,
  readBookHtml,
  readingMinutes,
} from "./book-meta";
import "./book.css";

// The illustrations' SVG text is set in Fraunces; the rest of the book uses the site fonts.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  style: ["normal", "italic"],
});

const siteUrl = "https://taberickson.com";
const pageUrl = `${siteUrl}${BOOK_PATH}`;
const minutes = readingMinutes(readBookHtml());
const pdfPath = "/algorithms-made-easy-csc207/csc207-made-easy.pdf";
const ogImage = "/algorithms-made-easy-csc207/og.png";

const title = "CSC207 Made Easy: Introduction to Algorithms in Plain English";
const description =
  "CSC207 Introduction to Algorithms, rewritten in plain English. 24 illustrated chapters covering pseudocode, flowcharts, Euclid's algorithm, greedy methods, divide and conquer, dynamic programming and Big O notation, each with a real life example. Free to read, with a downloadable PDF.";
const shortDescription =
  "The whole course in 24 illustrated chapters, with a real life example for every hard idea. Free to read, PDF included.";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "Tabe Rickson", url: siteUrl }],
  keywords: [
    "CSC207",
    "Introduction to Algorithms",
    "algorithms in plain English",
    "free algorithms book",
    "algorithms PDF",
    "pseudocode",
    "flowcharts",
    "Euclid's algorithm",
    "greedy algorithms",
    "divide and conquer",
    "dynamic programming",
    "Big O notation",
  ],
  alternates: { canonical: "/algorithms-made-easy-csc207" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    title: "CSC207 Made Easy",
    description: shortDescription,
    url: pageUrl,
    siteName: "taberickson.com",
    type: "article",
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "CSC207 Made Easy. Introduction to Algorithms in plain English, free to read.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSC207 Made Easy",
    description: shortDescription,
    images: [ogImage],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Book",
      "@id": `${pageUrl}#book`,
      name: "CSC207 Made Easy",
      alternativeHeadline: "Introduction to Algorithms in Plain English",
      description,
      url: pageUrl,
      image: `${siteUrl}${ogImage}`,
      author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: "Tabe Rickson", url: siteUrl },
      inLanguage: "en",
      isAccessibleForFree: true,
      bookFormat: "https://schema.org/EBook",
      numberOfPages: 68,
      timeRequired: `PT${minutes}M`,
      genre: "Computer science",
      educationalLevel: "Undergraduate",
      learningResourceType: "Textbook",
      about: [
        "Algorithms",
        "Pseudocode",
        "Flowcharts",
        "Greedy algorithms",
        "Divide and conquer",
        "Dynamic programming",
        "Big O notation",
      ],
      encoding: {
        "@type": "MediaObject",
        contentUrl: `${siteUrl}${pdfPath}`,
        encodingFormat: "application/pdf",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Books", item: `${siteUrl}/books` },
        { "@type": "ListItem", position: 3, name: "CSC207 Made Easy", item: pageUrl },
      ],
    },
  ],
};

const decode = (s: string) =>
  s
    .replace(/&middot;/g, "·")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"');


// Subtopics shown under a chapter in the sidebar: [index of the chapter's <h4>, sidebar label].
const subtopics: Record<string, [number, string][]> = {
  c9: [[0, "Pseudocode keywords"], [1, "Worked example: searching a list"]],
  c11: [[0, "Pre-test vs post-test loops"]],
  c12: [[0, "Sequence"], [1, "Binary selection"], [2, "Multi-way selection"], [3, "Combined example: toll gate"]],
  c13: [[0, "Numbered steps"], [1, "Pseudocode"], [2, "C program"]],
  c14: [[1, "Step by step"], [2, "In BASIC"], [3, "In C"]],
  c16: [[0, "Where greedy works"]],
  c17: [[0, "Advantages"], [1, "Disadvantages"]],
  c18: [[0, "DP vs divide and conquer"], [1, "Top-down vs bottom-up"], [2, "Applications"]],
  c19: [
    [0, "Recursion vs iteration"],
    [1, "Procedural vs declarative"],
    [2, "Serial, parallel, distributed"],
    [3, "Deterministic vs non-deterministic"],
    [4, "Exact vs approximate"],
    [5, "Randomized algorithms"],
    [6, "Linear programming"],
    [7, "Reduction (transform and conquer)"],
    [8, "Branch and bound, backtracking"],
  ],
  c23: [[0, "Common complexity classes"], [1, "Growth at real input sizes"]],
  c24: [[0, "Key definitions"], [1, "Lists to memorise"], [2, "Key distinctions"], [3, "Frequency counting"]],
};

// Give every chapter subheading a stable id (c19-s0, c19-s1, ...) so subtopics can link to it.
function addSubheadingIds(html: string): string {
  return html.replace(/<section class="ch" id="(c\d+)">([\s\S]*?)<\/section>/g, (_, id: string, body: string) => {
    let i = 0;
    const withIds = body.replace(/<h4>/g, () => `<h4 id="${id}-s${i++}">`);
    // A slot at the end of each chapter for the "Was this chapter clear?" feedback.
    return `<section class="ch" id="${id}">${withIds}<div class="ch-feedback" data-chapter="${id}"></div></section>`;
  });
}

const icon = (d: string) =>
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

// Author, read time and chapters are part of the page HTML; the view count is filled in by the reader.
function statsHtml(): string {
  return `<div class="book-stats">
    <a class="bs-author" href="/" rel="author">
      <img class="bs-avatar" src="${BOOK_AUTHOR_AVATAR}" alt="" width="34" height="34" />
      <span><span class="bs-label">Written by</span><span class="bs-name">${BOOK_AUTHOR}</span></span>
    </a>
    <span class="bs-item">${icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')}${formatReadTime(minutes)}</span>
    <span class="bs-item">${icon('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>')}${BOOK_CHAPTERS} chapters</span>
    <span class="bs-item bs-views" data-book-views></span>
  </div>`;
}

// The sidebar's order and parts come from the book's own "What is inside" list.
function parseContents(html: string): BookPart[] {
  const toc = html.slice(html.indexOf('<div class="toc"'), html.indexOf('<div class="box note">'));
  const parts: BookPart[] = [];
  const partRe = /<div class="part">([\s\S]*?)<\/div>\s*<ol>([\s\S]*?)<\/ol>/g;
  const chRe = /<a href="#([^"]+)"><b>(\d+)<\/b><span>([\s\S]*?)<\/span><\/a>/g;
  for (const [, name, list] of toc.matchAll(partRe)) {
    parts.push({
      name: decode(name.trim()),
      chapters: [...list.matchAll(chRe)].map(([, id, num, chTitle]) => ({
        id,
        num: Number(num),
        title: topicLabels[id] ?? decode(chTitle.trim()),
        subs: (subtopics[id] ?? []).map(([n, label]) => ({ id: `${id}-s${n}`, title: label })),
      })),
    });
  }
  return parts;
}

export default function AlgorithmsBook() {
  const html = addSubheadingIds(readBookHtml()).replace("<!--book-stats-->", statsHtml());
  const parts = parseContents(html);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookReader parts={parts} pdf={pdfPath} className={fraunces.variable}>
        <article className="book-content" dangerouslySetInnerHTML={{ __html: html }} />
      </BookReader>
    </>
  );
}
