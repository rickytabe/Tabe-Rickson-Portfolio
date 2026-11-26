# Project notes for Claude

Personal portfolio and publishing site of Tabe Rickson, live at https://taberickson.com.
Next.js 16 App Router (Turbopack), deployed on Vercel from `master`. Content for the blog comes from Sanity.

## How we work

- Every change goes on its own branch and ships as a pull request against `master`; Vercel builds a preview for each PR.
- Before pushing to a branch, check its PR has not already merged. If it has, start a fresh branch from `origin/master`.
- For any UI or motion work, use the `apple-design` skill (`.claude/skills/apple-design/SKILL.md`): restraint over decoration, no glow or looping animation for its own sake, instant press feedback, size-specific type tracking, and reduced-motion fallbacks.
- Run `npx tsc --noEmit` and `npx eslint` on the changed files before committing.
- Keep the tone of anything students see warm and voluntary. CSC207 Made Easy and CSC207 Tutorial Sheet Solutions are fully free: support is always optional, no guilt, no paywall. CSC211 Tutorial Sheet Solutions is the one paid book (see below), and even there every question and hint is free, the first 15 solutions are free, and inviting classmates unlocks the rest at no cost.
- **Every payment goes through Fapshi** (tips and unlocks). Never show a USSD dial code (`*126*…#`) or ask for payment screenshots: Tabe asked for that to be removed everywhere.
- Never commit secrets. `.env*` is git-ignored; keys live in Vercel → Project → Settings → Environment Variables.

## Running locally

```bash
npm install
npm run dev   # http://localhost:3000
```

`.env.local` needs these names (values come from Vercel, never from the repo):
`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `NEXT_PUBLIC_FIREBASE_*` (API_KEY, APP_ID, AUTH_DOMAIN, MEASUREMENT_ID, MESSAGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET),
`INSIGHTS_PASSWORD`, `INSIGHTS_SECRET`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_WEBHOOK_SECRET` (server only; never prefix it with `NEXT_PUBLIC_`),
`RESEND_API_KEY`, `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`.

Without real keys the site still renders with placeholders, e.g.
`RESEND_API_KEY=re_dummy NEXT_PUBLIC_SANITY_PROJECT_ID=dummy123 NEXT_PUBLIC_SANITY_DATASET=production npm run dev`,
but views, the quiz and the leaderboard need Firebase. **`.env.local` holds the production Firebase keys**, so a plain `npm run dev` writes to the live database. For local testing, run the Firestore emulator and start a fresh server with `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` (firebase-admin connects once at startup, so a running server does not switch over when env files change). `npx firebase-tools@13 emulators:start --only firestore` works with Java 17; newer firebase-tools versions need Java 21.

## The book: CSC207 Made Easy (Introduction to Algorithms)

A free online book for CSC207 students, rendered natively at `/algorithms-made-easy-csc207`.

- `src/app/algorithms-made-easy-csc207/`
  - `page.tsx`: page and SEO metadata. `content.html` holds the book body; `book.css` holds its styles, including a softer light-mode palette for reading.
  - `BookReader.tsx`: topic sidebar with subtopics, reading bar, views, author and read time, floating support button, Quiz me entry.
  - `SupportModal.tsx`: voluntary tip of 200, 500 or 1000 FCFA through Fapshi's checkout (MTN or Orange Money; `/api/book/tip`). The reader comes back with `?tipped=1`, the book confirms the tip with Fapshi, and only then shows the thank-you and remembers "supported" in localStorage. Opens after about 1 minute of reading, from the floating button, sidebar, footer, inline cards and the end of a quiz, and when the PDF is downloaded. The download flow always has a free path ("I'd love to support, but I don't have money right now"). Any free book can pass its own wording (`ReaderBook.support`).
  - `FigureLightbox.tsx`: click-to-expand illustrations with an origin-aware FLIP animation.
  - `QuizBot.tsx` and `quiz-questions.ts`: Algo, the quiz robot (see below).
  - `insights.ts` (client `track()`), `book-info.ts` (`TOPIC_LABELS`, `BOOK_PATH`), `book-meta.ts`, `ViewCount.tsx`, `ChapterFeedback.tsx`.
- Overlays (modal, lightbox, quiz) are portaled to `<body>` inside a `.book-portal` wrapper so they sit above the navbar and keep the book's colour tokens.
- Books replaced Blogs in the navbar; `/books` lists the book.

### Links and redirects

- `/algorithms` and `/algorithms/:path*`: permanent redirect to the book. It was shared widely, so keep it forever.
- `/csc207`: short link, temporary redirect to the book.
- `/csc207/quiz`: opens Algo directly. `src/proxy.ts` (Next 16 middleware) serves link-preview bots a page with the quiz Open Graph image (`public/algorithms-made-easy-csc207/quiz-og.png`) and sends people a 307 to `/algorithms-made-easy-csc207?quiz=1`.
- `/Algorithms-made-easy-csc207` (capitalised): the proxy sends a 308 to the lowercase path. `next.config` redirects match case-insensitively, so that rule must stay in the proxy or it loops.
- Proxy matchers must be literal strings.
- Referral tags: add `?ref=<name>` (lowercase) to any link, e.g. `taberickson.com/csc207/quiz?ref=cindy`. The tag survives the redirects and shows up in Vercel Analytics.

## Two books, one reader

`src/lib/books.ts` lists the books (`BOOKS`, `bookFrom`, `scoped`). Every API route takes a `book` id and falls back to `csc207` when it is missing, so pages built before the second book keep working. The shared reader components (`BookReader`, `QuizBot`, `ChapterFeedback`, `insights.ts`, `UnlockModal`, `book.css`) live in `src/app/algorithms-made-easy-csc207/` and are imported by both books.

- CSC207's Firestore keys are unchanged. Other books get a prefix: marks and votes are `csc211-…`, board docs are `csc211_{week}_{rid}` with a `book` field, stats are `bookStats/{book}`. One `bk_rid` reader id covers both books.
- Quiz banks are per book in `src/lib/quiz/bank.ts` (questions public, answers server-only).

## The book: CSC211 Tutorial Sheet Solutions (tutorial solutions, paid)

Every question on the CSC211 probability tutorial sheet, solved, at `/csc211-tutorial-solutions` (short links `/csc211`, `/csc211/quiz`).

- Content is structured data in `src/content/csc211/questions.ts` (question word for word from the sheet, "How to think about it", solution), with TeX between `\( \)` and `\[ \]`. `render.ts` renders it with KaTeX on the server.
- Paywall: questions, hints and solutions 1–15 are in the page. Locked solutions (Q16 to B39, 33 of them) are **never in the page**: the page has blurred placeholder lines, and `/api/book/solutions` returns the real ones only to an unlocked reader. Don't move them into the page or a client bundle.
- Unlock: three ways in, all recorded on the reader (`unlocks.{book}` with `via`).
  - **Pay with Fapshi (main path, live):** "Pay 200 FCFA" sends the student to Fapshi's hosted checkout (MTN or Orange Money); back on the book (`?paid=1`) the site asks Fapshi for the status and unlocks. Code in `src/lib/fapshi.ts`, `/api/book/pay`, webhook `/api/payments/fapshi` (checked with `x-wh-secret`). Nothing unlocks from the browser or a webhook body alone: always `GET /payment-status/{transId}` with our keys. Unsettled payments are re-checked on every unlock-status call for 7 days. Env: `FAPSHI_BASE_URL` (`https://live.fapshi.com`), `FAPSHI_API_USER`, `FAPSHI_API_KEY`, `FAPSHI_WEBHOOK_SECRET`. In Fapshi the webhook URL must be `https://www.taberickson.com/api/payments/fapshi` (the apex domain 308-redirects to `www`). Fapshi keeps 3%: revenue is 194 per 200.
  - **Gift code:** Tabe can make a code on `/book-insights?book=csc211` to give someone free access ("Have an unlock code?" in the unlock sheet). Codes are 8 characters (`K7P2-XQ9M`), stored only as a SHA-256 fingerprint, work on 2 devices, can be switched off, and readers get 10 tries a day. They are not a payment path.
  - **Invites (free):** each reader has a link `taberickson.com/csc211?ref=i-<code>` (`inviteCodeFor`). An invited reader counts once they have reached 3 questions on their own device; 3 counted invites unlock.
- After unlocking, the reader thanks them: the grinning smiley ("Thank you, truly.") opens once per device (`{book}-thanked` in localStorage), and a thank-you card replaces the unlock button in the sidebar and footer.
- Unlocks are tied to the anonymous cookie. A student who clears cookies or changes phone uses their code again (2 devices), or asks Tabe for a new one.
- The dashboard (`/book-insights`) opens on a board of every book; a book's tab adds the unlock funnel, Fapshi payments, invites, revenue and the code maker.
- Firestore transactions must do every read before any write (a read after a write broke every payment once). Test money paths against the emulator with Fapshi's API simulated before shipping.

## The book: CSC207 Tutorial Sheet Solutions (tutorial solutions, free)

The CSC207 tutorial sheets, solved in the course pseudocode, at `/csc207-tutorial-solutions` (book id `csc207t`). Built from the CSC211 template but **free** (Tabe's call): no paywall, every solution in the page, supported by Fapshi tips through the support pop-up (after a minute of reading, floating button, sidebar, footer, end of a quiz) and an inline support card after the last question of each exercise (`data-support-inline` slots).

- Short links are `/csc207/tutorial` and `/csc207/tutorial/quiz`, because `/csc207` and `/csc207/quiz` belong to CSC207 Made Easy. Keep it that way.
- Content: `src/content/csc207t/questions.ts`, with section ids `s<sheet>-e<exercise>-<question>` (e.g. `s1-e2-5`), printed as `II.5` by `sectionLabel`. Add later sheets as new items and new `sections` entries in `src/lib/books.ts`; the paywall counts from the start, so keep new sheets after the existing ones.
- Solutions are pre-rendered HTML pseudocode blocks (`pre.code` with tinted keywords). Ligatures are off for code, so `==` and `->` print as typed. Exercise IV-style questions end in an "Exact output" box.
- The page reuses `csc211.css` (lock cards, unlock sheet) through the `book-csc211` class, and adds `csc207t.css`.
- Code is mobile-first: each line is a `.ln` block with its indentation in `--ind`, and end-of-line comments are `.c-trail` spans. On phones (≤720px) lines wrap with a hanging indent and comments move onto their own line, so there is no sideways scroll.
- The PDF of Tutorial Sheet 1 is published at `/csc207-tutorial-solutions/csc207-tutorial-sheet-1-solutions.pdf` (cover, sidebar, footer and Books page). Downloads go through the support ask, which always offers "Download free". Its build script (`build.py`, `to_ts.py`) is in `csc207-tutorial-1-source/` next to the repo: rebuild the PDF and `questions.ts` from it when the content changes.

## The book: CSC205 Past CA Solutions (paid, payment only)

Four CSC205 past papers solved, at `/csc205-ca-solutions` (book id `csc205ca`, short links `/csc205/ca` and `/csc205/ca/quiz`; `/csc205` belongs to CSC205 All-In-One Revision).

- Content: `src/content/csc205ca/questions.ts` (papers `y24`, `y23`, `y22b`, `y22`; ids `<paper>-<question>`), rendered by `render.ts`. Working blocks are one `.ln` per line with `--ind`, so phones wrap with a hanging indent.
- Paywall (Tabe's call): `paywall: { freeSections: 15, perPart: true, priceFcfa: 500, invitesNeeded: 0, codes: false, pdf }`. The first 15 solutions **of each paper** are free; 500 FCFA through Fapshi unlocks the other 17 and the full PDF. No invites and no gift codes (the unlock and code-maker routes refuse them).
- The book offers the unlock once per visit on arrival (`askOnOpen`), with "View the free solutions first" as the way out.
- The full PDF is in `private/` (never `public/`), built by `csc207-tutorial-1-source/build_csc205ca.py` from the four answer sheets plus a cover. `/api/book/pdf?book=csc205ca` sends it only to unlocked readers and redirects everyone else to the book with `?unlock=1`. `next.config` traces `private/` into that route.
- Algo: `gen_csc205ca_quiz.py` writes `quiz-questions.ts` and `answers-csc205ca.ts`, built from free solutions only so the quiz never gives a locked answer away.

## The book: CSC211 Past CA Solutions (paid, PDFs only)

The November 2022, 2023 and 2024 CSC211 CAs, solved, at `/csc211-ca-solutions` (book id `csc211ca`, short links `/csc211/ca` and `/csc211/ca/quiz`).

- PDF-only, **strictly paid** (Tabe's call): no free downloads. One payment of 500 FCFA through Fapshi unlocks all three answer sheets; no invites. Unlock codes are on: Tabe makes them on `/book-insights?book=csc211ca` (Unlock codes) to test or to give someone access (8 characters, 2 devices each, as for CSC211 Tutorial).
- The page has one card per paper. Each card shows the top of the paper's own answer sheet as a PNG (the university heading and paper details, cut above QUESTION 1, so no answers), then the topics that came up, then the download.
- The three PDFs are in `private/`, served by `/api/book/pdf?book=csc211ca&paper=y24|y23|y22` (`paywall.pdfs`) to unlocked readers only. Source sheets and `build_csc211ca.py` (copies the PDFs and renders the headers with PyMuPDF) are in `csc207-tutorial-1-source/`.
- Algo (`gen_csc211ca_quiz.py`) practises the same topics with new numbers, so it never gives a paid answer away.
- Keep the previews cut from the original PDFs. Don't re-typeset them.

## New books and solution sets: always this format

Every new book or tutorial solution set follows the CSC211 Tutorial Sheet Solutions format exactly, unless Tabe says otherwise.

**Name and links**
- Title: `<COURSE> Tutorial Sheet Solutions` (e.g. "CSC213 Tutorial Sheet Solutions"). Path `/<course>-tutorial-solutions`, short links `/<course>` and `/<course>/quiz` in `next.config.ts` (or `/<course>/tutorial` when the course already has a book on `/<course>`, as CSC207 does).

**Content** (`src/content/<course>/`)
- `questions.ts`: one item per sheet question with `id`, `topic` (sidebar label), `question` word for word from the sheet (typos included), a yellow "How to think about it" box (`think`), and a full worked `solution`. Maths as TeX in `\( \)` / `\[ \]`, rendered with KaTeX by `render.ts`. Keep the sheet's numbering; blank sheet questions stay as `blank` items.
- Re-derive every numeric answer before publishing, and say clearly in the solution when the sheet has a typo or a missing part and what was assumed.
- Illustrations as inline SVG in the book's paper palette (`#20242B` ink, `#15847B`, `#E2703A`, `#F3BF3F`, Fraunces titles), no `<text>` inside `opengraph-image.tsx` SVGs.

**Wiring**
- Register the book in `src/lib/books.ts` (`sections` in sheet order, `paywall: { freeSections: 15, priceFcfa: 200, invitesNeeded: 3 }`).
- Page `src/app/<course>-tutorial-solutions/page.tsx` built like CSC211's: shared `BookReader`, cover, "What is inside", how-to-use box, key formulas, quick guide, `book.css` + a small book CSS file, KaTeX CSS.
- Algo: public questions in `src/app/<course>-tutorial-solutions/quiz-questions.ts` (correct option listed first), answers server-only in `src/lib/quiz/answers-<course>.ts`, both added to `src/lib/quiz/bank.ts`.
- Solutions API: add the book's `lockedSolutions` function to `LOCKED` in `src/app/api/book/solutions/route.ts`. Locked solutions are served only there, for unlocked readers, never in the page or a client bundle.
- Dashboard: add the book to `LABELS`, `NUMBERS` and `VIEW_PATHS` in `src/app/book-insights/page.tsx`. Also `src/app/api/views/route.ts`, `sitemap.ts`, the Books page card, and the Navbar `match` list.

**Money and gratitude**
- Ask Tabe whether a new book is paid or free. Paid: questions and hints all free; solutions 1–15 free; the rest unlock for 200 FCFA through Fapshi, or free with 3 invites. Free: every solution open, with the Fapshi support pop-up and inline support cards. Either way: the thank-you smiley and sidebar thank-you card, and no dial codes.

**Marketing**
- `opengraph-image.tsx`: a pure marketing card. The title "<COURSE> Tutorial Sheet Solutions", a one-line promise, and the short link, in two fixed columns so art never covers text. No free/paid details.
- Announcements to classmates: short, the promise and the link (tag it, e.g. `?ref=whatsapp`), with no free or paid details.

**Before shipping**
- `tsc` and ESLint on changed files, `next build`, check that no locked answer appears in the built HTML, and test the page, unlock and quiz against the Firestore emulator (never against the live database).

## Readers, insights and security model

- No logins. Each reader gets an anonymous id in a signed (HMAC with `INSIGHTS_SECRET`), HttpOnly cookie `bk_rid`, scoped to `Path=/api/book`. See `src/lib/insights/server.ts` (`ensureReader`, `dayKey`).
- All Firestore writes happen on the server through `firebase-admin` (`src/lib/firebase`). The browser never writes to the database.
- Firestore collections: `bookStats/{book}` (counters), `bookReaders/{rid}` (with `marks` and `votes` subcollections; `unlocks`, `invites`, `invitedBy` maps per book), `bookFeedback`, `quizSessions`, `quizBoard`, `unlockCodes/{sha256}`, `inviteCodes/{code}`.
- API routes live under `src/app/api/book/`: `events`, `feedback`, `unlock`, `solutions`, `admin`, `admin/board`, `admin/codes`, `quiz/profile`, `quiz/start`, `quiz/answer`, `quiz/board`.
- `/book-insights` is a private dashboard. It is unlocked with `INSIGHTS_PASSWORD`, which sets an admin session cookie `bk_admin` (`src/lib/insights/admin-auth.ts`). Never put the password in code or chat logs, and rotate it if it was shared.
- Page views come from Vercel Web Analytics via `src/lib/vercel/analytics.ts` (`getPathViews`) and `src/app/api/views/route.ts`. The count is edge-cached, and ad blockers hide some visits, so it lags and undercounts.

## Algo, the quiz bot

- 10 multiple-choice questions (A–D) per round, drawn from a public pool in `quiz-questions.ts`. Answers live only on the server in `src/lib/quiz/answers.ts` and grading happens server-side, so the browser cannot cheat.
- Before the quiz, Algo asks what to call the reader; they can stay anonymous. Names are cleaned with `cleanName` (`src/lib/quiz/server.ts`).
- Weekly leaderboard (`weekKey`). Points are the sum of a reader's quiz scores that week, counting at most 5 quizzes a day (`DAILY_COUNTED` in `src/lib/quiz/board.ts`), so effort counts and not just the first attempt.
- Full screen on mobile, a larger modal on desktop. It opens from the sidebar's Quiz me button or `?quiz=1`.
- The end of a quiz shows a support card (CSC207) or the unlock offer (CSC211), and a WhatsApp share button. Quiz metrics are counted on the server.

## Gotchas we hit

- JSX trims a space after a closing tag at a line break; write `{" "}` explicitly.
- Don't call `Date.now()` during render (lint error). Do it inside effects or loaders.
- Grid and flex children that overflow on mobile need `min-width: 0`.
- Fonts are self-hosted with `next/font/local` (`src/app/fonts/`: `site.ts` for Space Grotesk, JetBrains Mono and Inter, `fraunces.ts` for the books). Don't go back to `next/font/google`: fetching from Google during Vercel builds kept failing production deploys with `module-not-found` in `[next]/internal/font/google/*.module.css`.

## Ideas not started yet

- Past CA solutions, once the content is ready (CSC211 tutorial solutions are done).
- A "Revising for the CA? Start here" shortcut in the book.
- Optionally show unique readers instead of page views in the public 👁 count.
