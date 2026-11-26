// Server-only: the CSC205 Past CA Solutions page. The first 15 solutions of each paper are in the
// page; the rest are blurred placeholders, served by /api/book/solutions to unlocked readers only.
// The full PDF lives in private/ and is served by /api/book/pdf to unlocked readers only.
import { BOOKS, isLocked, sectionLabel } from "@/lib/books";
import { CA_BY_PAPER, CA_ITEMS, CA_PAPERS, type CaItem } from "./questions";

const BOOK = BOOKS.csc205ca;
const WALL = BOOK.paywall!;

/** Where the download buttons point. The route checks the unlock before sending the file. */
export const CSC205CA_PDF_URL = "/api/book/pdf?book=csc205ca";
export const CSC205CA_PAGES = 21;

const paperOf = (id: string) => CA_PAPERS.find((p) => p.id === id.split("-")[0])!;

export const CSC205CA_LABELS: Record<string, string> = Object.fromEntries(CA_ITEMS.map((i) => [i.id, i.topic]));
export const CSC205CA_NUMBERS: Record<string, string> = Object.fromEntries(
  CA_ITEMS.map((i) => [i.id, sectionLabel(BOOK, i.id)])
);

const locked = CA_ITEMS.filter((i) => isLocked(BOOK, i.id));
export const CSC205CA_LOCKED_COUNT = locked.length;
export const CSC205CA_COUNT = CA_ITEMS.length;

const solutionHtml = (item: CaItem) => `<div class="sol">${item.solution}</div>`;

/** Locked solutions, by question id. Only for readers who unlocked the book. */
export function csc205caLockedSolutions(): Record<string, string> {
  return Object.fromEntries(locked.map((i) => [i.id, solutionHtml(i)]));
}

// Blurred placeholder lines: no real content, so nothing can be read from the page.
const TEASER = `<div class="sol-teaser" aria-hidden="true">
  <span style="width:92%"></span><span style="width:64%"></span>
  <span class="sol-teaser-eq" style="width:48%"></span>
  <span style="width:86%"></span><span style="width:72%"></span>
</div>`;

const DL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 11l5 5l5-5"/><path d="M4 20h16"/></svg>`;

function sectionHtml(item: CaItem): string {
  const paper = paperOf(item.id);
  const lock = isLocked(BOOK, item.id);
  return `<section class="ch" id="${item.id}"${lock ? ' data-locked="1"' : ""}>
  <div class="ch-head">
    <div class="ch-num">${item.label}</div>
    <div>
      <h3>${item.topic}</h3>
      <p class="oneline">${paper.name} &middot; Question ${item.label}${lock ? ' &middot; <span class="ch-lock">Locked solution</span>' : ""}</p>
    </div>
  </div>
  <div class="box note q-box"><div class="lab">Question ${item.label}</div>${item.question}</div>
  <h4 class="sol-h">Solution</h4>
  ${lock ? `<div class="sol-lock" data-q="${item.id}">${TEASER}<div class="sol-lock-slot"></div></div>` : solutionHtml(item)}
  <div class="ch-feedback" data-chapter="${item.id}"${lock ? ' data-locked="1"' : ""}></div>
</section>`;
}

function paperHtml(paperId: string): string {
  const paper = CA_PAPERS.find((p) => p.id === paperId)!;
  const items = CA_BY_PAPER[paperId];
  const free = items.filter((i) => !isLocked(BOOK, i.id)).length;
  return `<div class="ca-paper" id="paper-${paper.id}">
  <div class="ca-paper-k">Paper</div>
  <h2 class="ca-paper-h">${paper.name}</h2>
  <p class="ca-paper-meta">${paper.meta}${paper.note ? ` ${paper.note}` : ""}</p>
  <p class="ca-paper-free">${free === items.length ? `All ${items.length} solutions free` : `${free} of ${items.length} solutions free to read`}</p>
</div>
${items.map(sectionHtml).join("\n")}`;
}

function coverHtml(): string {
  return `<header class="cover">
  <div class="kicker">CSC205 &middot; Four past papers &middot; solved</div>
  <h1 class="title">CSC205 <em>Past CA Solutions</em></h1>
  <p class="sub">The 2022, 2023 and 2024 CSC205 papers, every question answered with the working shown: number bases, complements, floating point, IEEE 754, ethics, operating systems and computer architecture.</p>
  <!--book-stats-->
  <p class="dlwrap">
    <a class="dl" href="${CSC205CA_PDF_URL}" data-paid-pdf>${DL_ICON}Download the full PDF</a>
  </p>
  <p class="dlnote">All four papers in one ${CSC205CA_PAGES}-page PDF for ${WALL.priceFcfa} FCFA. The first ${WALL.freeSections} solutions of every paper are free to read below.</p>
</header>`;
}

function tocHtml(): string {
  return `<div class="toc" id="tocPanel">
  <h2>What is inside</h2>
  ${CA_PAPERS.map(
    (p) => `<div class="part">${p.name}</div>
  <ol>
    ${CA_BY_PAPER[p.id]
      .map((i) => {
        const lock = isLocked(BOOK, i.id) ? ' <i class="toc-lock" aria-label="locked">🔒</i>' : "";
        return `<li><a href="#${i.id}"><b>${i.label}</b><span>${i.topic}${lock}</span></a></li>`;
      })
      .join("\n    ")}
  </ol>`
  ).join("\n  ")}
</div>`;
}

function introHtml(): string {
  return `<div class="box note">
  <div class="lab">How to use it</div>
  <p>Cover the solution, try the question on paper, then check. The same question types come back every year: base conversions, the four signed representations, floating point, and short ethics and operating system questions.</p>
  <p>When you finish a paper, open <b>Quiz me</b>. Algo asks you questions from these papers, and each quiz brings ones you haven't answered yet.</p>
</div>
<div class="box real free-note">
  <div class="lab">Free to read</div>
  <p>Every question is free, and so are the first ${WALL.freeSections} solutions of each paper. The other ${CSC205CA_LOCKED_COUNT} solutions and the full PDF unlock for <strong>${WALL.priceFcfa} FCFA</strong> with MTN or Orange Money.</p>
</div>`;
}

/** The whole page: cover, contents, how to use it, then each paper. */
export function csc205caBookHtml(): string {
  return [
    coverHtml(),
    tocHtml(),
    introHtml(),
    ...CA_PAPERS.map((p) => paperHtml(p.id)),
    `<div class="closing"><div class="rule"></div><p class="closing-quote">The same five or six question types come back every year. Learn the method once and the marks follow.</p></div>`,
  ].join("\n\n");
}
