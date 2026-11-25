// Server-only: turns CSC207 CA 2025 into the book's HTML. Built like
// src/content/csc207t/render.ts, but straight to the solutions: no "How to think about it" box.
import { BOOKS, sectionLabel } from "@/lib/books";
import { CSC207TEST1_ITEMS, type Csc207Test1Item } from "./questions";

const BOOK = BOOKS.csc207test1;

const PART_NAMES: Record<Csc207Test1Item["section"], string> = {
  A: "Section A · Answer all questions",
  B: "Section B · Pseudocode and flowchart",
};

export type Csc207Test1Part = { name: string; ids: string[] };

/** The sidebar's parts, in paper order. */
export const CSC207TEST1_PARTS: Csc207Test1Part[] = (Object.keys(PART_NAMES) as Csc207Test1Item["section"][]).map(
  (section) => ({
    name: PART_NAMES[section],
    ids: CSC207TEST1_ITEMS.filter((i) => i.section === section).map((i) => i.id),
  })
);

export const CSC207TEST1_LABELS: Record<string, string> = Object.fromEntries(
  CSC207TEST1_ITEMS.map((i) => [i.id, i.topic])
);
export const CSC207TEST1_NUMBERS: Record<string, string> = Object.fromEntries(
  CSC207TEST1_ITEMS.map((i) => [i.id, sectionLabel(BOOK, i.id)])
);

export const CSC207TEST1_COUNT = CSC207TEST1_ITEMS.length;

/** The whole paper, solved, as a printable PDF (public/, free like the book). */
export const CSC207TEST1_PDF = "/csc207-ca-2025-solutions/csc207-ca-2025-solutions.pdf";

// The last question of each section gets an inline support card after it (rendered by the reader).
const SECTION_ENDS = new Set(
  (["A", "B"] as const).map((s) => CSC207TEST1_ITEMS.filter((i) => i.section === s).at(-1)!.id)
);

function sectionHtml(item: Csc207Test1Item): string {
  const num = sectionLabel(BOOK, item.id);
  const support = SECTION_ENDS.has(item.id)
    ? `<div class="support-inline" data-support-inline="section-${item.section.toLowerCase()}"></div>`
    : "";
  return `<section class="ch" id="${item.id}">
  <div class="ch-head">
    <div class="ch-num">${num}</div>
    <div>
      <h3>${item.topic}</h3>
      <p class="oneline">CA 2025 &middot; Section ${item.section} &middot; Question ${num.slice(1)}</p>
    </div>
  </div>
  <div class="box note q-box"><div class="lab">Question ${num}</div>${item.question}</div>
  <h4 class="sol-h">Solution</h4>
  <div class="sol">${item.solution}</div>
  <div class="ch-feedback" data-chapter="${item.id}"></div>
  ${support}
</section>`;
}

function tocHtml(): string {
  const byId = new Map(CSC207TEST1_ITEMS.map((i) => [i.id, i]));
  return `<div class="toc" id="tocPanel">
  <h2>What is inside</h2>
  ${CSC207TEST1_PARTS.map(
    (p) => `<div class="part">${p.name}</div>
  <ol>
    ${p.ids
      .map((id) => `<li><a href="#${id}"><b>${sectionLabel(BOOK, id)}</b><span>${byId.get(id)!.topic}</span></a></li>`)
      .join("\n    ")}
  </ol>`
  ).join("\n  ")}
</div>`;
}

function coverHtml(): string {
  return `<header class="cover">
  <div class="kicker">Introduction to algorithms &middot; CA 2025</div>
  <h1 class="title">CSC207 <em>CA 2025</em></h1>
  <p class="sub">Every question on the CSC207 CA 2025 paper, solved: ordered set snippets, isPalindrome, exact-output tracing, and the course registration pseudocode with its flowchart. Straight to the answers.</p>
  <!--book-stats-->
  <p class="byline">CSC207 Introduction to Algorithms, CA 2025.<br>${CSC207TEST1_COUNT} questions, every one solved in full.</p>
  <p class="dlwrap">
    <a class="dl" href="${CSC207TEST1_PDF}" download>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3v12"/><path d="M7 11l5 5l5-5"/><path d="M4 20h16"/>
      </svg>
      Download CA 2025 Solutions
    </a>
  </p>
  <p class="dlnote">An 8-page PDF with every question and solution. Print it, or read it offline on a phone.</p>
</header>`;
}

function introHtml(): string {
  return `<div class="box note">
  <div class="lab">How to use this page</div>
  <p>The <b>blue box</b> is the question exactly as it is on the paper. The solution follows it directly. Section A is the short questions, Section B the pseudocode and flowchart.</p>
  <p>Solutions use the course pseudocode: curly braces, typed functions, <code>*</code> and <code>-&gt;</code> for structs, and <code>//</code> comments. <code>read(x)</code> reads a value, <code>println(...)</code> prints and ends the line, <code>print(...)</code> stays on the same line.</p>
  <p>Also solved: <a href="/csc207-ca-2024-solutions">CSC207 CA 2024</a>, the paper from the year before.</p>
</div>`;
}

/** The whole book page. */
export function csc207test1BookHtml(): string {
  return [
    coverHtml(),
    tocHtml(),
    introHtml(),
    ...CSC207TEST1_ITEMS.map(sectionHtml),
    `<div class="closing"><div class="rule"></div><p class="closing-quote">Trace by hand, line by line, and write what is printed exactly as it would appear. That is most of the marks in Section A.</p></div>`,
  ].join("\n\n");
}
