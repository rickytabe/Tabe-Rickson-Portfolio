// Server-only: turns the CSC211 content into the book's HTML, with the maths rendered by KaTeX.
import katex from "katex";
import { BOOKS, isLocked, sectionLabel } from "@/lib/books";
import { CSC211_FORMULAS, CSC211_ITEMS, CSC211_QUICK_GUIDE, type Csc211Item } from "./questions";

const BOOK = BOOKS.csc211;

/** Render \( \) and \[ \] TeX inside an HTML string. */
export function renderMath(html: string): string {
  return html
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, tex: string) =>
      katex.renderToString(tex, { displayMode: true, throwOnError: false })
    )
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, tex: string) =>
      katex.renderToString(tex, { displayMode: false, throwOnError: false })
    );
}

const memo = new Map<string, string>();
function math(html: string): string {
  let out = memo.get(html);
  if (out === undefined) {
    out = renderMath(html);
    memo.set(html, out);
  }
  return out;
}

export type Csc211Part = { name: string; ids: string[] };

/** The sidebar's parts, in sheet order. */
export const CSC211_PARTS: Csc211Part[] = [
  { name: "Part A · Probability", ids: BOOK.sections.slice(0, 23) },
  { name: "Part A · Random variables", ids: BOOK.sections.slice(23, 35) },
  { name: "Part B · Distributions and joint variables", ids: BOOK.sections.slice(35) },
];

export const CSC211_LABELS: Record<string, string> = Object.fromEntries(CSC211_ITEMS.map((i) => [i.id, i.topic]));
export const CSC211_NUMBERS: Record<string, string> = Object.fromEntries(
  CSC211_ITEMS.map((i) => [i.id, sectionLabel(BOOK, i.id)])
);

const solvedLocked = CSC211_ITEMS.filter((i) => i.solution && isLocked(BOOK, i.id));
export const LOCKED_COUNT = solvedLocked.length;
export const SOLVED_COUNT = CSC211_ITEMS.filter((i) => i.solution).length;

function solutionHtml(item: Csc211Item): string {
  return `<div class="sol">${math(item.solution!)}</div>`;
}

/** Locked solutions, by question id. Only for readers who unlocked the book. */
export function lockedSolutions(): Record<string, string> {
  return Object.fromEntries(solvedLocked.map((i) => [i.id, solutionHtml(i)]));
}

// Blurred placeholder lines: no real content, so nothing can be read from the page.
const TEASER = `<div class="sol-teaser" aria-hidden="true">
  <span style="width:92%"></span><span style="width:64%"></span>
  <span class="sol-teaser-eq" style="width:48%"></span>
  <span style="width:86%"></span><span style="width:72%"></span>
  <span class="sol-teaser-eq" style="width:56%"></span>
</div>`;

function sectionHtml(item: Csc211Item): string {
  const num = sectionLabel(BOOK, item.id);
  const part = item.id.startsWith("b") ? "Part B" : "Part A";
  const locked = isLocked(BOOK, item.id) && !!item.solution;
  const head = `<div class="ch-head">
    <div class="ch-num">${num}</div>
    <div>
      <h3>${item.topic}</h3>
      <p class="oneline">${part} &middot; Question ${num}${locked ? ' &middot; <span class="ch-lock">Locked solution</span>' : ""}</p>
    </div>
  </div>`;
  if (item.blank) {
    return `<section class="ch is-blank" id="${item.id}">${head}<div class="box note"><div class="lab">Question ${num}</div>${math(item.question)}</div></section>`;
  }
  const body = locked
    ? `<div class="sol-lock" data-q="${item.id}">${TEASER}<div class="sol-lock-slot"></div></div>`
    : solutionHtml(item);
  return `<section class="ch" id="${item.id}"${locked ? ' data-locked="1"' : ""}>
  ${head}
  <div class="box note q-box"><div class="lab">Question ${num}</div>${math(item.question)}</div>
  ${item.think ? `<div class="box stick"><div class="lab">How to think about it</div>${math(item.think)}</div>` : ""}
  <h4 class="sol-h">Solution</h4>
  ${body}
  <div class="ch-feedback" data-chapter="${item.id}"${locked ? ' data-locked="1"' : ""}></div>
</section>`;
}

function tocHtml(): string {
  const byId = new Map(CSC211_ITEMS.map((i) => [i.id, i]));
  return `<div class="toc" id="tocPanel">
  <h2>What is inside</h2>
  ${CSC211_PARTS.map(
    (p) => `<div class="part">${p.name}</div>
  <ol>
    ${p.ids
      .map((id) => {
        const item = byId.get(id)!;
        const lock = isLocked(BOOK, id) && item.solution ? ' <i class="toc-lock" aria-label="locked">🔒</i>' : "";
        return `<li><a href="#${id}"><b>${sectionLabel(BOOK, id)}</b><span>${item.topic}${lock}</span></a></li>`;
      })
      .join("\n    ")}
  </ol>`
  ).join("\n  ")}
</div>`;
}

function coverHtml(): string {
  return `<header class="cover">
  <div class="kicker">CSC211 made easy &middot; probability and statistics</div>
  <h1 class="title">CSC211 <em>Made Easy</em></h1>
  <p class="sub">Every question on the CSC211 tutorial sheet, solved step by step. Before each solution, a short box shows you how to recognise the type of problem and which tool to reach for.</p>
  <!--book-stats-->
  <div class="coverart">
    <svg viewBox="0 0 620 230" role="img" aria-label="Two dice and a tree diagram feeding into a bell curve with the shaded answer">
      <defs>
        <marker id="ca211" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#20242B"/>
        </marker>
      </defs>
      <g>
        <rect x="22" y="30" width="62" height="62" rx="12" fill="#fff" stroke="#20242B" stroke-width="2.5" transform="rotate(-8 53 61)"/>
        <g fill="#20242B" transform="rotate(-8 53 61)"><circle cx="38" cy="46" r="5"/><circle cx="53" cy="61" r="5"/><circle cx="68" cy="76" r="5"/></g>
        <rect x="70" y="58" width="62" height="62" rx="12" fill="#F3BF3F" stroke="#20242B" stroke-width="2.5" transform="rotate(10 101 89)"/>
        <g fill="#20242B" transform="rotate(10 101 89)"><circle cx="86" cy="74" r="5"/><circle cx="116" cy="74" r="5"/><circle cx="86" cy="104" r="5"/><circle cx="116" cy="104" r="5"/></g>
        <text x="78" y="146" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#4A525E">counting outcomes</text>
      </g>
      <g stroke="#20242B" stroke-width="2" fill="none">
        <path d="M40 196L84 172M40 196L84 220"/><path d="M96 172L132 160M96 172L132 184"/>
      </g>
      <g fill="#20242B"><circle cx="40" cy="196" r="4"/><circle cx="90" cy="172" r="5"/><circle cx="90" cy="220" r="5"/></g>
      <text x="152" y="200" font-family="JetBrains Mono,monospace" font-size="12" font-weight="700" fill="#2E4F86">4/7 · 5/9</text>
      <path d="M200 110h56" stroke="#20242B" stroke-width="2" marker-end="url(#ca211)"/>
      <g>
        <rect x="270" y="26" width="334" height="178" rx="14" fill="#fff" stroke="#20242B" stroke-width="2.5"/>
        <path d="M290 178H584" stroke="#20242B" stroke-width="2"/>
        <path d="M296 176C350 176 372 60 437 60S524 176 578 176" fill="none" stroke="#20242B" stroke-width="2.5"/>
        <path d="M437 60C470 60 486 112 500 140L500 176L437 176Z" fill="#15847B" fill-opacity=".35"/>
        <path d="M437 60V176" stroke="#20242B" stroke-width="1.5" stroke-dasharray="4 4"/>
        <text x="437" y="196" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" font-weight="700" fill="#20242B">µ</text>
        <text x="500" y="196" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" font-weight="700" fill="#20242B">x</text>
        <text x="300" y="54" font-family="Fraunces,serif" font-size="22" font-weight="800" fill="#15847B">P = 0.34</text>
        <text x="300" y="74" font-family="Inter,sans-serif" font-size="11.5" fill="#7A8492">the shaded area is the answer</text>
      </g>
    </svg>
  </div>
  <p class="byline">Based on the CSC211 tutorial sheet.<br>${SOLVED_COUNT} questions, every one solved in full.</p>
</header>`;
}

function introHtml(): string {
  const free = BOOK.paywall!.freeSections;
  return `<div class="box note">
  <div class="lab">How to use this book</div>
  <p>Each question has a yellow box first. That box tells you how to recognise the type of problem and which tool to use. Read it before the solution. If you can explain the yellow box in your own words, you can solve any problem of the same type.</p>
  <p>Every blue box gives the question word for word as it is on the original sheet, including its typing mistakes. Part B questions keep their sheet numbers, with a &ldquo;B&rdquo; in front.</p>
  <p>The sheet has some typing mistakes and missing parts. Where an assumption was needed, the solution says so clearly. The sheet also numbers questions 1 to 35 and then starts again at 26: the first group is Part A and the second group is Part B.</p>
</div>
<div class="box real free-note">
  <div class="lab">Free to read</div>
  <p>Every question and every &ldquo;how to think about it&rdquo; box is free. The worked solutions to questions 1 to ${free} are free too. The other ${LOCKED_COUNT} unlock for <strong>${BOOK.paywall!.priceFcfa} FCFA</strong>, or for free when ${BOOK.paywall!.invitesNeeded} classmates start reading through your link.</p>
</div>
<div class="box stick">
  <div class="lab">Key formulas used everywhere</div>
  ${math(CSC211_FORMULAS)}
</div>`;
}

function guideHtml(): string {
  return `<section class="ch" id="guide">
  <div class="ch-head">
    <div class="ch-num">✓</div>
    <div><h3>Quick guide: which tool for which problem?</h3><p class="oneline">Read the question, find the words, pick the tool.</p></div>
  </div>
  <table>
    <tr><th>If the question says&hellip;</th><th>Use</th></tr>
    ${CSC211_QUICK_GUIDE.map(([a, b]) => `<tr><td>${math(a)}</td><td>${math(b)}</td></tr>`).join("\n    ")}
  </table>
</section>`;
}

/** The whole book page (free solutions included, locked ones as placeholders). */
export function bookHtml(): string {
  return [
    coverHtml(),
    tocHtml(),
    introHtml(),
    ...CSC211_ITEMS.map(sectionHtml),
    guideHtml(),
    `<div class="closing"><div class="rule"></div><p class="closing-quote">Probability is counting, done carefully. Every question on this sheet comes back to a handful of rules.</p></div>`,
  ].join("\n\n");
}
