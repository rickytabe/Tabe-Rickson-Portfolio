import { readFileSync } from "fs";
import path from "path";
import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import BookReader, { type BookPart } from "./BookReader";
import "./book.css";

// The illustrations' SVG text is set in Fraunces; the rest of the book uses the site fonts.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  style: ["normal", "italic"],
});

const siteUrl = "https://taberickson.com";
const pageUrl = `${siteUrl}/algorithms-made-easy-csc207`;
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

// Sidebar labels: plain topic names, so readers can find a syllabus topic at a glance. The chapters
// keep their own friendlier headings in the text. Keyed by chapter id.
const topicLabels: Record<string, string> = {
  c1: "What is an algorithm?",
  c2: "Properties of an algorithm",
  c3: "Problem difficulty",
  c4: "Variables and assignment",
  c5: "Data types",
  c6: "Data structures",
  c7: "Algorithm vs program vs language",
  c8: "The programming process",
  c9: "Pseudocode",
  c10: "Flowcharts",
  c11: "Control structures",
  c12: "Worked examples: sequence and selection",
  c13: "Factorial (steps, pseudocode, C)",
  c14: "Euclid's algorithm (GCD)",
  c15: "Top-down and bottom-up design",
  c16: "Greedy algorithms",
  c17: "Divide and conquer",
  c18: "Dynamic programming",
  c19: "Other algorithm types",
  c20: "Time complexity",
  c21: "Space complexity",
  c22: "Best, worst and average case",
  c23: "Big O notation",
  c24: "Exam revision summary",
};

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
    return `<section class="ch" id="${id}">${withIds}</section>`;
  });
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
  const html = addSubheadingIds(
    readFileSync(path.join(process.cwd(), "src/app/algorithms-made-easy-csc207/content.html"), "utf8")
  );
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
