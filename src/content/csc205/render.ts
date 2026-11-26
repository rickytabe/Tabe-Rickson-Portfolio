// Server-only: the CSC205 All-In-One Revision page. The book itself is the PDF; the page is a short
// cover, the download, and what each part covers, so it loads fast. Algo quizzes every part.
import { BOOKS, sectionLabel } from "@/lib/books";

const BOOK = BOOKS.csc205;

/** The revision notes as a PDF (public/, free). Downloads go through the support ask. */
export const CSC205_PDF = "/csc205-revision/csc205-all-in-one-revision.pdf";
export const CSC205_PAGES = 11;

type Part = { id: string; title: string; weight: string; covers: string[] };

export const CSC205_PARTS_LIST: Part[] = [
  { id: "p1", title: "Number systems and conversions", weight: "Every paper, usually 5+ marks",
    covers: ["Binary, octal, decimal and hexadecimal", "Any base to decimal, decimal to any base", "Numbers with a fractional part"] },
  { id: "p2", title: "Signed numbers", weight: "Every paper",
    covers: ["Sign magnitude, 1's, 2's, 9's, 10's complement, excess-N", "Bit-width formulas and ranges", "2's complement arithmetic and IEEE 754"] },
  { id: "p3", title: "Computer ethics", weight: "Recall",
    covers: ["The seven areas in its scope", "The historical timeline, ACM and IEEE", "The nine ethical theories"] },
  { id: "p4", title: "Operating systems", weight: "Recall",
    covers: ["The seven OS services", "Batch processing", "Multitasking and time-sharing"] },
  { id: "p5", title: "Windows and GUIs", weight: "Recall",
    covers: ["Windows features and the screen", "The parts of a window", "GUI terms and the version timeline"] },
  { id: "p6", title: "Foundations and history", weight: "A question or two",
    covers: ["Computer science, IT and software engineering", "Babbage, Lovelace, Hollerith, Turing, von Neumann", "The four generations of computers"] },
];

export const CSC205_LABELS: Record<string, string> = {
  ...Object.fromEntries(CSC205_PARTS_LIST.map((p) => [p.id, p.title])),
  notes: "The revision notes (whole PDF)",
};
export const CSC205_NUMBERS: Record<string, string> = {
  ...Object.fromEntries(CSC205_PARTS_LIST.map((p) => [p.id, sectionLabel(BOOK, p.id)])),
  notes: "PDF",
};

const DL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 11l5 5l5-5"/><path d="M4 20h16"/></svg>`;

function coverHtml(): string {
  return `<header class="cover">
  <div class="kicker">CSC205 &middot; Revision notes &middot; PDF</div>
  <h1 class="title">CSC205 <em>All-In-One Revision</em></h1>
  <p class="sub">Your lecture notes and the 2022, 2023 and 2024 past papers in one ${CSC205_PAGES}-page PDF, ordered by how often each topic actually comes up. Worked conversions, complements and 2&rsquo;s complement arithmetic, then the recall topics, then a morning drill.</p>
  <!--book-stats-->
  <p class="dlwrap">
    <a class="dl" href="${CSC205_PDF}" download>${DL_ICON}Download the revision notes</a>
  </p>
  <p class="dlnote">A ${CSC205_PAGES}-page PDF. Print it, or read it offline on a phone. Then test yourself with Algo below.</p>
</header>
<div class="ch-feedback rev-feedback" data-chapter="notes" data-question="Were these notes helpful?" data-yes="Yes, helpful" data-example="e.g. add more worked IEEE 754 examples"></div>`;
}

function partHtml(p: Part): string {
  return `<section class="ch rev-part" id="${p.id}">
  <div class="ch-head">
    <div class="ch-num">${sectionLabel(BOOK, p.id)}</div>
    <div>
      <h3>${p.title}</h3>
      <p class="oneline">${p.weight}</p>
    </div>
  </div>
  <ul class="rev-covers">${p.covers.map((c) => `<li>${c}</li>`).join("")}</ul>
</section>`;
}

/** The whole page: cover, how to revise, what each part covers, and a quiz prompt. */
export function csc205BookHtml(): string {
  return [
    coverHtml(),
    `<div class="box note">
  <div class="lab">How to use it</div>
  <p>Parts 1 to 3 of the notes are worth more than everything else combined, and they are procedural: learn them first. The rest is recall, quick to pick up the morning of the paper.</p>
  <p>After each part, open <b>Quiz me</b>. Algo has over a hundred questions on these notes, and each quiz brings ones you have not answered yet.</p>
</div>`,
    `<h2 class="rev-h">What is inside</h2>`,
    ...CSC205_PARTS_LIST.map(partHtml),
  ].join("\n\n");
}
