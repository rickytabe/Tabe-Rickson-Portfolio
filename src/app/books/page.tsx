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
import { InteractiveBackground } from "../components/InteractiveBackground";

const siteUrl = "https://taberickson.com";

type Book = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  pdf: string;
  cover: string;
  pages: number;
  chapters: number;
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
    pages: 68,
    chapters: BOOK_CHAPTERS,
    author: BOOK_AUTHOR,
    avatar: BOOK_AUTHOR_AVATAR,
    readTime: formatReadTime(readingMinutes(readBookHtml())),
    topics: ["Algorithms", "Pseudocode", "Flowcharts", "Dynamic programming", "Big O notation"],
  },
];

const title = "Books | Tabe Rickson";
const description =
  "Free books by Tabe Rickson. CSC207 Made Easy rewrites Introduction to Algorithms in plain English, with 24 illustrated chapters and a downloadable PDF.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CSC207",
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
              The <span className="text-[#39FF14]">Books</span>
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl font-inter">
              Hard subjects, rewritten in plain English. Free to read online, with a PDF to keep.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {books.map((book) => (
              <article
                key={book.href}
                className="group flex flex-col bg-card-bg border border-foreground/10 rounded-2xl overflow-hidden hover:border-[#39FF14]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#39FF14]/5"
              >
                <Link href={book.href} className="relative block w-full aspect-[1200/630] bg-foreground/5 overflow-hidden">
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover: ${book.subtitle}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 border-b border-foreground/10 pointer-events-none" />
                </Link>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-mono text-foreground/50">
                    <span>{book.chapters} CHAPTERS</span>
                    <span className="text-foreground/30">•</span>
                    <span>{book.pages}-PAGE PDF</span>
                    <span className="text-foreground/30">•</span>
                    <span className="text-[#39FF14]">FREE</span>
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
                    <a
                      href={book.pdf}
                      download
                      className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground/60 hover:text-[#39FF14] transition-colors"
                    >
                      <Download className="w-4 h-4" /> DOWNLOAD PDF
                    </a>
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
