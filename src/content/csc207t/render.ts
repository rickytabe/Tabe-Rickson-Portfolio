// Server-only: turns the CSC207 tutorial content into the book's HTML. Built like
// src/content/csc211/render.ts (the template for every solutions book), with pseudocode in place of maths.
import { BOOKS, sectionLabel } from "@/lib/books";
import { CSC207T_ITEMS, CSC207T_QUICK_GUIDE, type Csc207tItem } from "./questions";

const BOOK = BOOKS.csc207t;

const PART_NAMES: Record<Csc207tItem["part"], string> = {
  I: "Sheet 1 · Exercise I · Data structures",
  II: "Sheet 1 · Exercise II · Branching",
  III: "Sheet 1 · Exercise III · Looping",
  IV: "Sheet 1 · Exercise IV · Exact output",
};

export type Csc207tPart = { name: string; ids: string[] };

/** The sidebar's parts, in sheet order. */
export const CSC207T_PARTS: Csc207tPart[] = (Object.keys(PART_NAMES) as Csc207tItem["part"][]).map((part) => ({
  name: PART_NAMES[part],
  ids: CSC207T_ITEMS.filter((i) => i.part === part).map((i) => i.id),
}));

export const CSC207T_LABELS: Record<string, string> = Object.fromEntries(CSC207T_ITEMS.map((i) => [i.id, i.topic]));
export const CSC207T_NUMBERS: Record<string, string> = Object.fromEntries(
  CSC207T_ITEMS.map((i) => [i.id, sectionLabel(BOOK, i.id)])
);

export const CSC207T_SOLVED_COUNT = CSC207T_ITEMS.length;

// The last question of each exercise gets an inline support card after it (rendered by the reader).
const EXERCISE_ENDS = new Set(
  (["I", "II", "III", "IV"] as const).map((part) => CSC207T_ITEMS.filter((i) => i.part === part).at(-1)!.id)
);

function sectionHtml(item: Csc207tItem): string {
  const num = sectionLabel(BOOK, item.id);
  const head = `<div class="ch-head">
    <div class="ch-num">${num}</div>
    <div>
      <h3>${item.topic}</h3>
      <p class="oneline">Tutorial Sheet 1 &middot; Exercise ${item.part} &middot; Question ${num}</p>
    </div>
  </div>`;
  const support = EXERCISE_ENDS.has(item.id)
    ? `<div class="support-inline" data-support-inline="exercise-${item.part.toLowerCase()}"></div>`
    : "";
  return `<section class="ch" id="${item.id}">
  ${head}
  <div class="box note q-box"><div class="lab">Question ${num}</div>${item.question}</div>
  <div class="box stick"><div class="lab">How to think about it</div>${item.think}</div>
  <h4 class="sol-h">Solution</h4>
  <div class="sol">${item.solution}</div>
  <div class="ch-feedback" data-chapter="${item.id}"></div>
  ${support}
</section>`;
}

function tocHtml(): string {
  const byId = new Map(CSC207T_ITEMS.map((i) => [i.id, i]));
  return `<div class="toc" id="tocPanel">
  <h2>What is inside</h2>
  ${CSC207T_PARTS.map(
    (p) => `<div class="part">${p.name}</div>
  <ol>
    ${p.ids
      .map((id) => {
        const item = byId.get(id)!;
        return `<li><a href="#${id}"><b>${sectionLabel(BOOK, id)}</b><span>${item.topic}</span></a></li>`;
      })
      .join("\n    ")}
  </ol>`
  ).join("\n  ")}
</div>`;
}

function coverHtml(): string {
  return `<header class="cover">
  <div class="kicker">Introduction to algorithms &middot; branching and looping</div>
  <h1 class="title">CSC207 <em>Tutorial Sheet Solutions</em></h1>
  <p class="sub">Every question on the CSC207 tutorial sheets, solved step by step in the course's pseudocode. Before each solution, a short box shows you how to recognise the problem and which construct to reach for.</p>
  <!--book-stats-->
  <div class="coverart">
    <svg viewBox="0 0 620 210" role="img" aria-label="read(n), a decision n%2==0 with yes leading to Even and no leading to Odd, and a loop arrow">
      <rect x="10" y="10" width="600" height="190" rx="14" fill="#fff" stroke="#20242B" stroke-width="2"/>
      <rect x="34" y="62" width="104" height="44" rx="22" fill="#fff" stroke="#20242B" stroke-width="2"/>
      <text x="86" y="89" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="14" font-weight="700" fill="#20242B">read(n)</text>
      <path d="M138 84h44" stroke="#20242B" stroke-width="2"/>
      <path d="M244 38l62 46-62 46-62-46z" fill="#F3BF3F" stroke="#20242B" stroke-width="2.5"/>
      <text x="244" y="89" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="13" font-weight="700" fill="#20242B" style="font-variant-ligatures:none">n%2==0?</text>
      <path d="M306 84h50" stroke="#20242B" stroke-width="2"/>
      <text x="318" y="76" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#137a35">yes</text>
      <rect x="356" y="62" width="96" height="44" rx="8" fill="#9ED3C9" stroke="#20242B" stroke-width="2"/>
      <text x="404" y="89" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#20242B">"Even"</text>
      <path d="M244 130v38h112" stroke="#20242B" stroke-width="2" fill="none"/>
      <text x="254" y="152" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#c2415a">no</text>
      <rect x="356" y="146" width="96" height="44" rx="8" fill="#F6C9B4" stroke="#20242B" stroke-width="2"/>
      <text x="404" y="173" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#20242B">"Odd"</text>
      <path d="M500 64a42 42 0 1 1 0 84" fill="none" stroke="#15847B" stroke-width="3"/>
      <path d="M500 148l-11 -6 2 12z" fill="#15847B"/>
      <text x="550" y="186" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" font-weight="700" fill="#15847B">repeat: for i</text>
    </svg>
  </div>
  <p class="byline">Based on CSC207 Tutorial Sheet 1, Branching and Looping Constructs.<br>${CSC207T_SOLVED_COUNT} questions, every one solved in full.</p>
</header>`;
}

function introHtml(): string {
  return `<div class="box note">
  <div class="lab">How to use this book</div>
  <p>Each question has three parts. The <b>blue box</b> is the question exactly as it is on the sheet. The <b>yellow box</b> tells you how to recognise the type of problem and which tool to use. Read it before the solution. If you can explain the yellow box in your own words, you can solve any problem of the same type in the CA.</p>
  <p>The sheet says "Program here refers to pseudocodes", so the solutions are pseudocode in the course style: curly braces, typed functions, <code>*</code> and <code>-&gt;</code> for the struct, and <code>//</code> comments.</p>
</div>
<div class="box real free-note">
  <div class="lab">Free for everyone</div>
  <p>Every question, every &ldquo;how to think about it&rdquo; box and every worked solution here is free, with no ads. If it helps you, a small tip tells <strong>Tabe</strong> it was worth it and keeps new sheets coming before every CA. Completely optional.</p>
</div>
<div class="box stick">
  <div class="lab">Conventions used in the solutions</div>
  <p><code>read(x)</code> reads one value into x. <code>println(...)</code> prints and ends the line. <code>print(...)</code> prints and stays on the same line. Several items in one <code>println</code> are printed one after another, as in <code>println("Sum: ", sum)</code>.</p>
</div>`;
}

function guideHtml(): string {
  return `<section class="ch" id="guide">
  <div class="ch-head">
    <div class="ch-num">✓</div>
    <div><h3>Quick guide: which construct for which problem?</h3><p class="oneline">Read the question, find the words, pick the construct.</p></div>
  </div>
  <table>
    <tr><th>If the problem says&hellip;</th><th>Use</th></tr>
    ${CSC207T_QUICK_GUIDE.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("\n    ")}
  </table>
</section>`;
}

/** The whole book page (free solutions included, locked ones as placeholders). */
export function csc207tBookHtml(): string {
  return [
    coverHtml(),
    tocHtml(),
    introHtml(),
    ...CSC207T_ITEMS.map(sectionHtml),
    guideHtml(),
    `<div class="closing"><div class="rule"></div><p class="closing-quote">Before you write code, write the steps. Most of this sheet is three ideas: choose with if, repeat with a loop, and keep a running total.</p></div>`,
  ].join("\n\n");
}
