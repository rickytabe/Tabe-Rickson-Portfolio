# Project notes for Claude

Personal portfolio and publishing site of Tabe Rickson, live at https://taberickson.com.
Next.js 16 App Router (Turbopack), deployed on Vercel from `master`. Content for the blog comes from Sanity.

## How we work

- Every change goes on its own branch and ships as a pull request against `master`; Vercel builds a preview for each PR.
- Before pushing to a branch, check its PR has not already merged. If it has, start a fresh branch from `origin/master`.
- Run `npx tsc --noEmit` and `npx eslint` on the changed files before committing.
- Keep the tone of anything students see warm and voluntary. CSC207 Made Easy stays fully free: support is always optional, no guilt, no paywall. CSC211 Tutorial Sheet Solutions is the one paid book (see below), and even there every question and hint is free, the first 15 solutions are free, and inviting classmates unlocks the rest at no cost.
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
  - `SupportModal.tsx`: voluntary MTN Mobile Money tip (code `*126*1*1*681110631*200#`, recipient Tabe). Opens after about 1 minute of reading and when the PDF is downloaded. The download flow always has a free path ("I'd love to support, but I don't have money right now"). It remembers "later" and "supported" in localStorage.
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
- Unlock (`src/lib/unlock.ts`, `/api/book/unlock`): either a code or invites.
  - Code: the student pays 200 FCFA by MTN MoMo (`*126*1*1*681110631*200#`), sends the screenshot on WhatsApp, and Tabe makes a code on `/book-insights?book=csc211` and sends it back. Codes are 8 characters (`K7P2-XQ9M`), stored only as a SHA-256 fingerprint, work on 2 devices, can be switched off, and readers get 10 tries a day.
  - Invites: each reader has a link `taberickson.com/csc211?ref=i-<code>` (`inviteCodeFor`). An invited reader counts once they have reached 3 questions on their own device; 3 counted invites unlock.
- Unlocks are tied to the anonymous cookie. A student who clears cookies or changes phone uses their code again (2 devices), or asks Tabe for a new one.
- The dashboard has a book switcher; the CSC211 tab adds the unlock funnel, invites, revenue (codes used × 200) and the code maker.

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
- A failed Vercel preview with font errors was a stale Turbopack build cache, not the code. Redeploy without cache.

## Ideas not started yet

- Past CA solutions, once the content is ready (CSC211 tutorial solutions are done).
- Automatic Mobile Money unlocks through a payment API (NotchPay, Fapshi, Campay or PawaPay) instead of manual codes, once there is a merchant account. Orange Money support comes with it.
- A "Revising for the CA? Start here" shortcut in the book.
- Optionally show unique readers instead of page views in the public 👁 count.
