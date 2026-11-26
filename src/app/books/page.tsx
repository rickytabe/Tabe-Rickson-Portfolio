import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Download } from "lucide-react";
import ViewCount from "../algorithms-made-easy-csc207/ViewCount";
import {
  BOOK_AUTHOR,
  BOOK_AUTHOR_AVATAR,
  BOOK_CHAPTERS,
  BOOK_PATH,
  formatReadTime,
  readBookHtml,
  readingMinutes,
} from "../algorithms-made-easy-csc207/book-meta";
import { BOOKS } from "@/lib/books";
import { LOCKED_COUNT, SOLVED_COUNT, bookHtml } from "@/content/csc211/render";
import { CSC207T_PDF, CSC207T_SOLVED_COUNT, csc207tBookHtml } from "@/content/csc207t/render";
import { CSC207TEST1_COUNT, CSC207TEST1_PDF, csc207test1BookHtml } from "@/content/csc207test1/render";
import { CSC207CA24_COUNT, CSC207CA24_PDF, csc207ca24BookHtml } from "@/content/csc207ca24/render";
import { CSC205_PAGES, CSC205_PDF } from "@/content/csc205/render";
import { CSC205_QUESTIONS } from "../csc205-revision/quiz-questions";
import { CSC211CA_PAGES, CSC211CA_PAPERS } from "@/content/csc211ca/render";
import { CSC205CA_COUNT, CSC205CA_LOCKED_COUNT, CSC205CA_PAGES, csc205caBookHtml } from "@/content/csc205ca/render";
import { InteractiveBackground } from "../components/InteractiveBackground";
import BookSearch from "./BookSearch";

const siteUrl = "https://www.taberickson.com";

type Book = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  pdf?: string;
  cover: string;
  /** The small print above the title, e.g. ["24 CHAPTERS", "68-PAGE PDF"]. */
  facts: string[];
  price: string;
  author: string;
  avatar: string;
  readTime: string;
  topics: string[];
};

const books: Book[] = [
  {
    title: "CSC207 Made Easy",
    subtitle: "Introduction to Algorithms in plain English",
    description:
      "The full CSC207 Introduction to Algorithms syllabus, rewritten in plain English. Every hard idea is explained with an example from ordinary life, and every chapter is illustrated. Covers pseudocode, flowcharts, Euclid's algorithm, greedy methods, divide and conquer, dynamic programming and Big O notation.",
    href: BOOK_PATH,
    pdf: "/algorithms-made-easy-csc207/csc207-made-easy.pdf",
    cover: "/algorithms-made-easy-csc207/og.png",
    facts: [`${BOOK_CHAPTERS} CHAPTERS`, "68-PAGE PDF"],
    price: "FREE",
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: formatReadTime(readingMinutes(readBookHtml())),
    topics: ["Algorithms", "Pseudocode", "Flowcharts", "Dynamic programming", "Big O notation"],
  },
  {
    title: BOOKS.csc211.title,
    subtitle: "Probability and statistics, every question solved step by step",
    description: `The whole CSC211 probability and statistics tutorial sheet, solved in full. Before each solution, a short box shows how to recognise the problem and which rule to use. Questions 1 to ${BOOKS.csc211.paywall!.freeSections} are free; the other ${LOCKED_COUNT} solutions unlock for ${BOOKS.csc211.paywall!.priceFcfa} FCFA, or free by inviting ${BOOKS.csc211.paywall!.invitesNeeded} classmates.`,
    href: BOOKS.csc211.path,
    cover: `${BOOKS.csc211.path}/opengraph-image`,
    facts: [`${SOLVED_COUNT} QUESTIONS`, "ALGO QUIZ BOT"],
    price: `Q1\u2013${BOOKS.csc211.paywall!.freeSections} FREE`,
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: formatReadTime(readingMinutes(bookHtml())),
    topics: ["Probability", "Bayes", "Binomial", "Poisson", "Normal distribution", "Joint densities"],
  },
  {
    title: BOOKS.csc207t.title,
    subtitle: "Branching, loops and output tracing, every question solved",
    description: `Every question on CSC207 Tutorial Sheet 1 solved in the course pseudocode: ordered set Insert and Union, isPalindrome, ten branching programs, ten looping programs and the exact-output tracing questions. Each one starts with how to recognise the problem and which construct to use. Free to read.`,
    href: BOOKS.csc207t.path,
    pdf: CSC207T_PDF,
    cover: `${BOOKS.csc207t.path}/opengraph-image`,
    facts: [`${CSC207T_SOLVED_COUNT} QUESTIONS`, "22-PAGE PDF"],
    price: "FREE",
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: formatReadTime(readingMinutes(csc207tBookHtml())),
    topics: ["Pseudocode", "Branching", "Loops", "switch", "Tracing output", "Data structures"],
  },
  {
    title: BOOKS.csc207test1.title,
    subtitle: "CA 2025: every question solved",
    description:
      "Every question on the CSC207 Introduction to Algorithms CA 2025 paper, solved: ordered set initSet and contains, isPalindrome, exact-output tracing, and the course registration pseudocode with its flowchart. Free to read.",
    href: BOOKS.csc207test1.path,
    pdf: CSC207TEST1_PDF,
    cover: `${BOOKS.csc207test1.path}/opengraph-image`,
    facts: [`${CSC207TEST1_COUNT} QUESTIONS`, "8-PAGE PDF"],
    price: "FREE",
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: formatReadTime(readingMinutes(csc207test1BookHtml())),
    topics: ["Pseudocode", "Flowchart", "Tracing output", "Ordered set", "Palindrome"],
  },
  {
    title: BOOKS.csc207ca24.title,
    subtitle: "CA 2024: every question solved",
    description:
      "Every question on the CSC207 Introduction to Algorithms CA 2024 paper (20/11/2024), solved: reverseList, arrays versus files, exact-output tracing with continue and break, and the auto teller algorithm with its flowchart. Free to read.",
    href: BOOKS.csc207ca24.path,
    pdf: CSC207CA24_PDF,
    cover: `${BOOKS.csc207ca24.path}/opengraph-image`,
    facts: [`${CSC207CA24_COUNT} QUESTIONS`, "9-PAGE PDF"],
    price: "FREE",
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: formatReadTime(readingMinutes(csc207ca24BookHtml())),
    topics: ["Pseudocode", "Flowchart", "Tracing output", "Arrays", "ATM"],
  },
  {
    title: BOOKS.csc205.title,
    subtitle: "Lecture notes and past papers in one PDF",
    description:
      "CSC205 revision notes built from the lecture notes and the 2022, 2023 and 2024 past papers, ordered by how often each topic comes up: base conversions, signed numbers and 2's complement, IEEE 754, ethics, operating systems, Windows and GUIs, and history. Free to download.",
    href: BOOKS.csc205.path,
    pdf: CSC205_PDF,
    cover: `${BOOKS.csc205.path}/opengraph-image`,
    facts: [`${CSC205_PAGES}-PAGE PDF`, `${CSC205_QUESTIONS.length} QUIZ QUESTIONS`],
    price: "FREE",
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: `${CSC205_PAGES} pages`,
    topics: ["Number bases", "2's complement", "IEEE 754", "Ethics", "Operating systems", "GUIs"],
  },
  {
    title: BOOKS.csc205ca.title,
    subtitle: "Four past papers, every question solved",
    description: `${CSC205CA_COUNT} questions from the CSC205 CA 2024/2025, Test 1 (November 2023), CA 2022/2023 and CA Test I (November 2022) papers, solved with the working shown. The first ${BOOKS.csc205ca.paywall!.freeSections} solutions of each paper are free; the other ${CSC205CA_LOCKED_COUNT} and the full ${CSC205CA_PAGES}-page PDF unlock for ${BOOKS.csc205ca.paywall!.priceFcfa} FCFA.`,
    href: BOOKS.csc205ca.path,
    cover: `${BOOKS.csc205ca.path}/opengraph-image`,
    facts: [`${CSC205CA_COUNT} QUESTIONS`, "4 PAPERS"],
    price: `${BOOKS.csc205ca.paywall!.freeSections} PER PAPER FREE`,
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: formatReadTime(readingMinutes(csc205caBookHtml())),
    topics: ["Past papers", "Number bases", "2's complement", "IEEE 754", "Ethics", "Architecture"],
  },
  {
    title: BOOKS.csc211ca.title,
    subtitle: "Three past CAs, every question solved",
    description: `The CSC211 Probability and Statistics CAs of November 2022, 2023 and 2024, solved step by step: grouped mean, mode, median and variance, percentiles, conditional probability, joint distributions, and the binomial and hypergeometric distributions. Three PDF answer sheets for ${BOOKS.csc211ca.paywall!.priceFcfa} FCFA.`,
    href: BOOKS.csc211ca.path,
    cover: `${BOOKS.csc211ca.path}/opengraph-image`,
    facts: [`${CSC211CA_PAPERS.length} PAPERS`, `${CSC211CA_PAGES} PAGES`],
    price: `${BOOKS.csc211ca.paywall!.priceFcfa} FCFA`,
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: `${CSC211CA_PAGES} pages`,
    topics: ["Past papers", "Grouped data", "Conditional probability", "Binomial", "Hypergeometric"],
  },
];

const title = "My Books | Tabe Rickson";
const description =
  "Free books by Tabe Rickson for University of Buea computer science students: CSC207 Made Easy, CSC207 and CSC211 Tutorial Sheet Solutions, solved CSC207 CA papers (2024 and 2025), CSC205 All-In-One Revision, and CSC205 and CSC211 Past CA Solutions.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CSC207",
    "CSC211",
    "CSC211 tutorial solutions",
    "CSC207 tutorial solutions",
    "Introduction to Algorithms",
    "algorithms in plain English",
    "free algorithms book",
    "algorithms PDF",
    "Big O notation",
    "Tabe Rickson",
  ],
  alternates: {
    canonical: "/books",
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/books`,
    siteName: "Tabe Rickson Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/algorithms-made-easy-csc207/og.png",
        width: 1200,
        height: 630,
        alt: "CSC207 Made Easy. Introduction to Algorithms in plain English, free to read.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/algorithms-made-easy-csc207/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/books#page`,
      url: `${siteUrl}/books`,
      name: "Books by Tabe Rickson",
      description,
      inLanguage: "en",
      author: { "@id": `${siteUrl}/#person` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: books.map((book, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}${book.href}`,
          name: book.title,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Books", item: `${siteUrl}/books` },
      ],
    },
  ],
};

export default function BooksIndex() {
  return (
    <InteractiveBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen overflow-x-clip relative z-10">
        <main className="flex-1 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tighter uppercase mb-4 text-foreground">
              My <span className="text-[#39FF14]">Books</span>
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl font-inter">
              Hard subjects, rewritten in plain English, and tutorial sheets solved step by step.
            </p>
          </div>

          <BookSearch total={books.length} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {books.map((book) => (
              <article
                key={book.href}
                data-book-search={[book.title, book.subtitle, book.description, ...book.topics].join(" ").toLowerCase()}
                className="group flex flex-col bg-card-bg border border-foreground/10 rounded-2xl overflow-hidden hover:border-[#39FF14]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#39FF14]/5"
              >
                <Link href={book.href} className="relative block w-full aspect-[1200/630] bg-foreground/5 overflow-hidden">
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover: ${book.subtitle}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={book.cover.endsWith("/opengraph-image")}
                    priority
                  />
                  <div className="absolute inset-0 border-b border-foreground/10 pointer-events-none" />
                </Link>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-mono text-foreground/50">
                    {book.facts.map((fact) => (
                      <span key={fact} className="contents">
                        <span>{fact}</span>
                        <span className="text-foreground/30">•</span>
                      </span>
                    ))}
                    <span className="text-[#39FF14]">{book.price}</span>
                  </div>

                  <h2 className="text-2xl font-bold font-sans text-foreground mb-1 leading-snug">
                    <Link href={book.href} className="group-hover:text-[#39FF14] transition-colors">
                      {book.title}
                    </Link>
                  </h2>
                  <p className="text-sm font-mono text-foreground/50 mb-4">{book.subtitle}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-xs font-mono text-foreground/60">
                    <span className="inline-flex items-center gap-2">
                      <Image
                        src={book.avatar}
                        alt=""
                        width={26}
                        height={26}
                        className="rounded-full ring-1 ring-foreground/15"
                      />
                      <span>
                        By <span className="text-foreground font-semibold">{book.author}</span>
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-[15px] h-[15px]" aria-hidden />
                      {book.readTime}
                    </span>
                    <ViewCount path={book.href} className="inline-flex items-center gap-1.5" />
                  </div>
                  <p className="text-sm text-foreground/60 font-inter mb-5">{book.description}</p>

                  <ul className="flex flex-wrap gap-2 mb-8" aria-label="Topics">
                    {book.topics.map((topic) => (
                      <li
                        key={topic}
                        className="text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-full border border-foreground/10 text-foreground/60"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      href={book.href}
                      className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground hover:text-[#39FF14] transition-colors"
                    >
                      READ ONLINE <ArrowRight className="w-4 h-4" />
                    </Link>
                    {book.pdf ? (
                      <a
                        href={book.pdf}
                        download
                        className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground/60 hover:text-[#39FF14] transition-colors"
                      >
                        <Download className="w-4 h-4" /> DOWNLOAD PDF
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </InteractiveBackground>
  );
}
