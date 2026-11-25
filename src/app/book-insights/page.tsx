import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ADMIN_COOKIE, dashboardEnabled, validSession } from "@/lib/insights/admin-auth";
import { dayKey, db, insightsEnabled } from "@/lib/insights/server";
import { getPathViews } from "@/lib/vercel/analytics";
import { TOPIC_LABELS } from "../algorithms-made-easy-csc207/book-info";
import { CSC211_LABELS, CSC211_NUMBERS } from "@/content/csc211/render";
import { CSC207T_LABELS, CSC207T_NUMBERS } from "@/content/csc207t/render";
import { CSC207TEST1_LABELS, CSC207TEST1_NUMBERS } from "@/content/csc207test1/render";
import { CSC207CA24_LABELS, CSC207CA24_NUMBERS } from "@/content/csc207ca24/render";
import { CSC205_LABELS, CSC205_NUMBERS } from "@/content/csc205/render";
import { quizBank } from "@/lib/quiz/bank";
import { loadBoard } from "@/lib/quiz/board";
import { BOOK_IDS, bookFrom, type BookInfo, BOOKS, booksByCourse, sectionLabel, titleInCourse } from "@/lib/books";
import { listCodes, type CodeRow } from "@/lib/unlock";
import { fapshiEnabled, listPayments, type PaymentRow } from "@/lib/fapshi";
import { NEW_CODE_COOKIE } from "@/lib/insights/admin-auth";
import { weekKey, weekStartLabel } from "@/lib/quiz/server";
import "./insights.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Book insights",
  robots: { index: false, follow: false },
};

type Counts = Record<string, number>;
type Stats = {
  readers?: Counts;
  refs?: Counts;
  daily?: Counts;
  reach?: Counts;
  end?: Counts;
  clarity?: Counts;
  support_shown?: Counts;
  tip_start?: Counts;
  tip_return?: Counts;
  support?: { tips?: number; tipsStarted?: number; tipsAmount?: number; tipsRevenue?: number; tipsBy_mtn?: number; tipsBy_orange?: number };
  download_free?: Counts;
  download_supported?: Counts;
  download_direct?: Counts;
  figure_open?: Counts;
  quiz_open?: Counts;
  quiz_share?: Counts;
  // Counted on the server, per attempt.
  quiz?: {
    started?: number;
    finished?: number;
    scoreSum?: number;
    counted?: number;
    named?: number;
    anonymous?: number;
    byScore?: Counts;
  };
  quizQ?: Counts; // `${questionId}_seen` and `${questionId}_wrong`
  // Paid books.
  unlock_shown?: Counts;
  invite_share?: Counts;
  pay_start?: Counts;
  pay_return?: Counts;
  paywall?: {
    codes?: number;
    codesUsed?: number;
    unlockedByCode?: number;
    unlockedByInvite?: number;
    invitesCounted?: number;
    paymentsStarted?: number;
    unlockedByPayment?: number;
    paymentsAmount?: number;
    paymentsRevenue?: number;
    paidBy_mtn?: number;
    paidBy_orange?: number;
  };
  updatedAt?: { toDate(): Date };
};
type Note = { chapter: string; vote: "up" | "down"; text: string; at: Date | null };

const n = (c: Counts | undefined, k = "total") => Number(c?.[k] ?? 0);
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
const fmt = new Intl.NumberFormat("en");
const when = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Douala",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

// Sidebar labels and printed numbers per book, for the tables below.
const LABELS: Record<BookInfo["id"], Record<string, string>> = {
  csc207: TOPIC_LABELS,
  csc211: CSC211_LABELS,
  csc207t: CSC207T_LABELS,
  csc207test1: CSC207TEST1_LABELS,
  csc207ca24: CSC207CA24_LABELS,
  csc205: CSC205_LABELS,
};
const NUMBERS: Record<BookInfo["id"], Record<string, string>> = {
  csc207: Object.fromEntries(BOOKS.csc207.sections.map((id) => [id, sectionLabel(BOOKS.csc207, id)])),
  csc211: CSC211_NUMBERS,
  csc207t: CSC207T_NUMBERS,
  csc207test1: CSC207TEST1_NUMBERS,
  csc207ca24: CSC207CA24_NUMBERS,
  csc205: CSC205_NUMBERS,
};
// Older URLs whose views still count toward a book.
const VIEW_PATHS: Record<BookInfo["id"], string[]> = {
  csc207: ["/algorithms-made-easy-csc207", "/algorithms"],
  csc211: ["/csc211-tutorial-solutions"],
  csc207t: ["/csc207-tutorial-solutions"],
  csc207test1: ["/csc207-ca-2025-solutions", "/csc207-test-1-solutions"],
  csc207ca24: ["/csc207-ca-2024-solutions"],
  csc205: ["/csc205-revision"],
};

async function load(book: BookInfo) {
  const store = db();
  const [statsSnap, notesSnap, views, board, codes, payments] = await Promise.all([
    store.collection("bookStats").doc(book.id).get(),
    store.collection("bookFeedback").orderBy("at", "desc").limit(120).get(),
    Promise.all(VIEW_PATHS[book.id].map((p) => getPathViews(p))),
    loadBoard(weekKey(), { includeHidden: true, book }),
    book.paywall ? listCodes(book) : Promise.resolve([] as CodeRow[]),
    book.paywall ? listPayments(book) : Promise.resolve([] as PaymentRow[]),
  ]);
  const stats = (statsSnap.data() ?? {}) as Stats;
  const notes: Note[] = notesSnap.docs
    .map((d) => d.data())
    .filter((d) => d.book === book.id)
    .slice(0, 60)
    .map((d) => ({ chapter: d.chapter, vote: d.vote, text: d.text, at: d.at?.toDate?.() ?? null }));
  const known = views.filter((v): v is number => v !== null);

  // The last 14 days (Cameroon time), oldest first.
  const now = Date.now();
  const dayLabel = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Douala", day: "numeric", month: "short" });
  const recentDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now - (13 - i) * 24 * 60 * 60 * 1000);
    return { key: dayKey(d), label: dayLabel.format(d) };
  });

  return { stats, notes, views: known.length ? known.reduce((a, b) => a + b, 0) : null, recentDays, board, codes, payments };
}

function Login({ failed }: { failed: boolean }) {
  return (
    <main className="ins ins-login">
      <form method="post" action="/api/book/admin" className="ins-card ins-login-card">
        <p className="ins-kicker">Private</p>
        <h1 className="ins-h1">Book insights</h1>
        <label htmlFor="pw" className="ins-label">
          Password
        </label>
        <input id="pw" name="password" type="password" autoComplete="current-password" required className="ins-input" />
        {failed ? <p className="ins-error">That password didn&apos;t match.</p> : null}
        <button type="submit" className="ins-btn">
          Open dashboard
        </button>
      </form>
    </main>
  );
}

export default async function BookInsights({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; book?: string }>;
}) {
  if (!dashboardEnabled()) notFound();
  const jar = await cookies();
  const params = await searchParams;
  if (!validSession(jar.get(ADMIN_COOKIE)?.value)) {
    return <Login failed={params.e === "1"} />;
  }
  if (!insightsEnabled()) {
    return (
      <main className="ins">
        <div className="ins-card">Insights are off: Firebase admin isn&apos;t configured on this deployment.</div>
      </main>
    );
  }
  // No book picked: the board of every book. A card opens that book's insights.
  if (!params.book || !BOOK_IDS.includes(params.book as BookInfo["id"])) {
    return <Overview />;
  }

  const book = bookFrom(params.book);
  const labels = LABELS[book.id];
  const numbers = NUMBERS[book.id];
  const newCode = (() => {
    const raw = jar.get(NEW_CODE_COOKIE)?.value;
    if (!raw) return null;
    const [code, note] = decodeURIComponent(raw).split("|");
    return { code, note: note ?? "" };
  })();

  const { stats, notes, views, recentDays, board, codes, payments } = await load(book);
  const readers = n(stats.readers);
  const finished = n(stats.end);
  const downloads = n(stats.download_free) + n(stats.download_supported) + n(stats.download_direct);
  // Tips through Fapshi: started (tapped Support), confirmed by Fapshi, and what they are worth.
  const sup = stats.support ?? {};
  const tipsStarted = Number(sup.tipsStarted ?? 0);
  const tips = Number(sup.tips ?? 0);
  const tipsRevenue = Number(sup.tipsRevenue ?? 0);
  const shownBy = stats.support_shown ?? {};
  const shown = Object.values(shownBy).reduce((a, b) => a + Number(b), 0);

  const rows = book.sections.map((c) => {
    const up = n(stats.clarity, `${c}_up`);
    const down = n(stats.clarity, `${c}_down`);
    return { id: c, num: numbers[c] ?? c, label: labels[c] ?? c, reach: n(stats.reach, c), up, down };
  });
  const votesUp = rows.reduce((a, r) => a + r.up, 0);
  const votesDown = rows.reduce((a, r) => a + r.down, 0);
  const reachMax = Math.max(readers, ...rows.map((r) => r.reach), 1);

  // Biggest drop between consecutive chapters, and the least clear chapter (3+ votes).
  let drop: { from: (typeof rows)[number]; to: (typeof rows)[number]; lost: number } | null = null;
  for (let i = 0; i < rows.length - 1; i++) {
    const lost = rows[i].reach - rows[i + 1].reach;
    if (lost > 0 && (!drop || lost > drop.lost)) drop = { from: rows[i], to: rows[i + 1], lost };
  }
  const voted = rows.filter((r) => r.up + r.down >= 3);
  const leastClear = voted.length
    ? voted.reduce((w, r) => (r.up / (r.up + r.down) < w.up / (w.up + w.down) ? r : w))
    : null;

  // Last 14 days of new readers.
  const days = recentDays.map((d) => ({ ...d, count: n(stats.daily, d.key) }));
  const dayMax = Math.max(...days.map((d) => d.count), 1);
  const today = days[days.length - 1].count;

  const refs = Object.entries(stats.refs ?? {})
    .map(([k, v]) => ({ name: k, count: Number(v) }))
    .sort((a, b) => b.count - a.count);
  const refMax = Math.max(...refs.map((r) => r.count), 1);

  const sources: [string, string][] = [
    ["timer", "1-minute prompt"],
    ["download", "PDF download"],
    ["fab", "Floating button"],
    ["sidebar", "Sidebar link"],
    ["footer", "Footer link"],
  ];

  // Quiz: reader-level opens (events) and exact attempt-level numbers (server).
  const q = stats.quiz ?? {};
  const openedBy = stats.quiz_open ?? {};
  const quizOpened = Object.values(openedBy).reduce((a, b) => a + Number(b), 0);
  const quizStarted = Number(q.started ?? 0);
  const quizFinished = Number(q.finished ?? 0);
  const avgScore = quizFinished ? Number(q.scoreSum ?? 0) / quizFinished : null;
  const scoreRows = Array.from({ length: 11 }, (_, i) => ({ score: i, count: n(q.byScore, `s${i}`) }));
  const scoreMax = Math.max(...scoreRows.map((r) => r.count), 1);
  const qStats = stats.quizQ ?? {};
  const hardest = quizBank(book).questions.map((question) => {
    const seen = n(qStats, `${question.id}_seen`);
    const wrong = n(qStats, `${question.id}_wrong`);
    return { q: question, seen, wrong, rate: seen ? wrong / seen : 0 };
  })
    .filter((r) => r.seen >= 3)
    .sort((a, b) => b.rate - a.rate || b.seen - a.seen)
    .slice(0, 6);

  const updated = stats.updatedAt?.toDate?.();

  // Paid books: unlocks and what they are worth.
  const pw = stats.paywall ?? {};
  const unlockShownBy = stats.unlock_shown ?? {};
  const unlockShown = Object.values(unlockShownBy).reduce((a, b) => a + Number(b), 0);
  const byCode = Number(pw.unlockedByCode ?? 0);
  const byInvite = Number(pw.unlockedByInvite ?? 0);
  const codesUsed = Number(pw.codesUsed ?? 0);
  const byPayment = Number(pw.unlockedByPayment ?? 0);
  // Codes: what students sent you directly. Payments: what Fapshi pays out, after its 3% fee.
  const revenue = codesUsed * (book.paywall?.priceFcfa ?? 0) + Number(pw.paymentsRevenue ?? 0) + tipsRevenue;

  return (
    <main className="ins">
      <header className="ins-head">
        <div>
          <p className="ins-kicker">{book.title}</p>
          <h1 className="ins-h1">Book insights</h1>
          <BookTabs current={book.id} />
          <p className="ins-sub">
            {updated ? `Last activity ${when.format(updated)}` : "No activity yet"} · Cameroon time
          </p>
        </div>
        <div className="ins-head-actions">
          <a href={`/book-insights?book=${book.id}`} className="ins-btn ins-btn-ghost">
            Refresh
          </a>
          <form method="post" action="/api/book/admin">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="ins-btn ins-btn-ghost">
              Log out
            </button>
          </form>
        </div>
      </header>

      {readers === 0 ? (
        <div className="ins-card ins-empty">
          No readers recorded yet. Tracking started with this release; new readers appear here within seconds.
        </div>
      ) : null}

      {/* Headline numbers */}
      <section className="ins-tiles" aria-label="Headline numbers">
        <Tile label="Readers" value={fmt.format(readers)} hint={`${fmt.format(today)} new today`} />
        <Tile label="Page views" value={views === null ? "–" : fmt.format(views)} hint="Vercel Analytics" />
        <Tile label="Finished the book" value={`${pct(finished, readers)}%`} hint={`${fmt.format(finished)} readers`} />
        {book.paywall ? (
          <>
            <Tile
              label="Unlocked"
              value={fmt.format(byCode + byInvite + byPayment)}
              hint={`${fmt.format(byPayment)} MoMo · ${fmt.format(byCode)} code · ${fmt.format(byInvite)} invited`}
            />
            <Tile
              label="Revenue"
              value={`${fmt.format(revenue)} FCFA`}
              hint={`after Fapshi's 3% · ${fmt.format(codesUsed)} codes`}
            />
          </>
        ) : (
          <>
            <Tile label="PDF downloads" value={fmt.format(downloads)} hint={`${fmt.format(n(stats.download_free))} chose free`} />
            <Tile
              label="Tips (Fapshi)"
              value={`${fmt.format(tipsRevenue)} FCFA`}
              hint={`${fmt.format(tips)} confirmed · ${pct(tips, shown)}% of prompts shown`}
            />
          </>
        )}
        <Tile
          label={`Found ${book.sectionNoun}s clear`}
          value={votesUp + votesDown ? `${pct(votesUp, votesUp + votesDown)}%` : "–"}
          hint={`${fmt.format(votesUp + votesDown)} votes`}
        />
      </section>

      {/* New readers per day */}
      <section className="ins-card">
        <h2 className="ins-h2">New readers per day</h2>
        <p className="ins-note">Last 14 days. Counting started with this release.</p>
        <div className="ins-days" role="list">
          {days.map((d) => (
            <div key={d.key} className="ins-day" role="listitem" tabIndex={0} aria-label={`${d.label}: ${d.count} new readers`}>
              <span className="ins-day-bar" style={{ height: `${Math.max((d.count / dayMax) * 100, d.count ? 4 : 0)}%` }} />
              <span className="ins-tip">
                {d.label}: <b>{d.count}</b>
              </span>
            </div>
          ))}
        </div>
        <div className="ins-days-axis">
          <span>{days[0].label}</span>
          <span>peak {Math.max(...days.map((d) => d.count))}</span>
          <span>{days[days.length - 1].label}</span>
        </div>
      </section>

      {/* Chapters */}
      <section className="ins-card">
        <h2 className="ins-h2">{book.id === "csc207" ? "Chapters" : "Questions"}: reach and clarity</h2>
        <div className="ins-callouts">
          <p>
            <b>Biggest drop:</b>{" "}
            {drop
              ? `${drop.lost} readers stop between ${drop.from.num}. ${drop.from.label} and ${drop.to.num}. ${drop.to.label}`
              : "not enough data yet"}
          </p>
          <p>
            <b>Least clear:</b>{" "}
            {leastClear
              ? `${leastClear.num}. ${leastClear.label} (${pct(leastClear.up, leastClear.up + leastClear.down)}% clear)`
              : "needs 3+ votes on a chapter"}
          </p>
        </div>
        <div className="ins-table-wrap">
          <table className="ins-table">
            <thead>
              <tr>
                <th scope="col">{book.id === "csc207" ? "Chapter" : "Question"}</th>
                <th scope="col">Readers reached</th>
                <th scope="col">Clear?</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const votes = r.up + r.down;
                return (
                  <tr key={r.id}>
                    <th scope="row">
                      <span className="ins-num">{r.num.padStart(2, "0")}</span> {r.label}
                    </th>
                    <td>
                      <div className="ins-hbar" title={`${r.reach} readers (${pct(r.reach, readers)}%)`}>
                        <span className="ins-hbar-fill" style={{ width: `${(r.reach / reachMax) * 100}%` }} />
                      </div>
                      <span className="ins-val">
                        {r.reach} <small>{pct(r.reach, readers)}%</small>
                      </span>
                    </td>
                    <td>
                      {votes ? (
                        <>
                          <div className="ins-split" title={`${r.up} clear, ${r.down} not quite`}>
                            {r.up ? <span className="ins-up" style={{ flexGrow: r.up }} /> : null}
                            {r.down ? <span className="ins-down" style={{ flexGrow: r.down }} /> : null}
                          </div>
                          <span className="ins-val">
                            <span aria-label="clear">👍 {r.up}</span> · <span aria-label="not quite">👎 {r.down}</span>
                          </span>
                        </>
                      ) : (
                        <span className="ins-muted">no votes</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {book.paywall ? (
        <PaywallPanel
          book={book}
          stats={stats}
          shownBy={unlockShownBy}
          shown={unlockShown}
          codes={codes}
          newCode={newCode}
          payments={payments}
        />
      ) : null}

      <div className="ins-grid">
        {/* Support funnel */}
        {book.paywall ? null : (
        <section className="ins-card">
          <h2 className="ins-h2">Support funnel</h2>
          <dl className="ins-funnel">
            <div>
              <dt>Prompt shown</dt>
              <dd>{fmt.format(shown)}</dd>
            </div>
            <div>
              <dt>Opened the checkout</dt>
              <dd>
                {fmt.format(tipsStarted)} <small>{pct(tipsStarted, shown)}%</small>
              </dd>
            </div>
            <div>
              <dt>Tip confirmed by Fapshi</dt>
              <dd>
                {fmt.format(tips)}{" "}
                <small>
                  MTN {fmt.format(Number(sup.tipsBy_mtn ?? 0))} · Orange {fmt.format(Number(sup.tipsBy_orange ?? 0))}
                </small>
              </dd>
            </div>
            <div>
              <dt>Tips received</dt>
              <dd>
                {fmt.format(tipsRevenue)} FCFA <small>after Fapshi&apos;s 3%</small>
              </dd>
            </div>
          </dl>
          <h3 className="ins-h3">Where the prompt opened</h3>
          <ul className="ins-list">
            {sources.map(([k, label]) => (
              <li key={k}>
                <span>{label}</span>
                <b>{fmt.format(n(shownBy, k))}</b>
              </li>
            ))}
          </ul>
          <h3 className="ins-h3">PDF downloads</h3>
          <ul className="ins-list">
            <li>
              <span>&ldquo;I don&apos;t have money&rdquo; (free)</span>
              <b>{fmt.format(n(stats.download_free))}</b>
            </li>
            <li>
              <span>After a confirmed tip</span>
              <b>{fmt.format(n(stats.download_supported))}</b>
            </li>
            <li>
              <span>Returning supporters</span>
              <b>{fmt.format(n(stats.download_direct))}</b>
            </li>
          </ul>
          <p className="ins-note">
            Tips are counted only when Fapshi confirms the payment. Each tip shows in the payments list of the book.
          </p>
        </section>
        )}

        {/* Sources */}
        <section className="ins-card">
          <h2 className="ins-h2">Where readers come from</h2>
          <p className="ins-note">
            Tag the links you share with <code>?ref=</code>, e.g. <code>?ref=l2-whatsapp</code>.
          </p>
          {refs.length ? (
            <ul className="ins-refs">
              {refs.map((r) => (
                <li key={r.name}>
                  <span className="ins-ref-name">{r.name === "direct" ? "Direct / untagged" : r.name}</span>
                  <span className="ins-hbar" title={`${r.count} readers`}>
                    <span className="ins-hbar-fill" style={{ width: `${(r.count / refMax) * 100}%` }} />
                  </span>
                  <b>
                    {r.count} <small>{pct(r.count, readers)}%</small>
                  </b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ins-muted">No readers yet.</p>
          )}
          <h3 className="ins-h3">Other</h3>
          <ul className="ins-list">
            <li>
              <span>Opened an illustration</span>
              <b>{fmt.format(n(stats.figure_open))}</b>
            </li>
          </ul>
        </section>
      </div>

      {/* Quiz */}
      <section className="ins-card">
        <h2 className="ins-h2">Quiz bot</h2>
        <p className="ins-note">Attempt numbers are counted on the server, so repeat quizzes are included.</p>
        <dl className="ins-funnel">
          <div>
            <dt>Quizzes started</dt>
            <dd>{fmt.format(quizStarted)}</dd>
          </div>
          <div>
            <dt>Finished</dt>
            <dd>
              {fmt.format(quizFinished)} <small>{pct(quizFinished, quizStarted)}%</small>
            </dd>
          </div>
          <div>
            <dt>Average score</dt>
            <dd>{avgScore === null ? "–" : `${avgScore.toFixed(1)} / 10`}</dd>
          </div>
        </dl>
        <ul className="ins-list">
          <li>
            <span>Readers who opened Algo</span>
            <b>{fmt.format(quizOpened)}</b>
          </li>
          <li>
            <span>Players: named / anonymous</span>
            <b>
              {fmt.format(Number(q.named ?? 0))} / {fmt.format(Number(q.anonymous ?? 0))}
            </b>
          </li>
          <li>
            <span>Quizzes that earned leaderboard points</span>
            <b>{fmt.format(Number(q.counted ?? 0))}</b>
          </li>
          <li>
            <span>&ldquo;Challenge a classmate&rdquo; shares</span>
            <b>{fmt.format(n(stats.quiz_share))}</b>
          </li>
          <li>
            <span>Support prompt opened from the quiz</span>
            <b>{fmt.format(n(stats.support_shown, "quiz"))}</b>
          </li>
        </ul>
        <h3 className="ins-h3">Where Algo was opened</h3>
        <ul className="ins-list">
          {(
            [
              ["fab", "Quiz me button"],
              ["sidebar", "Sidebar / menu"],
              ["link", `Direct link (/${book.id}/quiz)`],
            ] as const
          ).map(([k, label]) => (
            <li key={k}>
              <span>{label}</span>
              <b>{fmt.format(n(openedBy, k))}</b>
            </li>
          ))}
        </ul>
        {quizFinished ? (
          <>
            <h3 className="ins-h3">Scores (all finished quizzes)</h3>
            <ul className="ins-refs">
              {scoreRows
                .filter((r) => r.count)
                .reverse()
                .map((r) => (
                  <li key={r.score}>
                    <span className="ins-ref-name">{r.score} / 10</span>
                    <span className="ins-hbar" title={`${r.count} quizzes`}>
                      <span className="ins-hbar-fill" style={{ width: `${(r.count / scoreMax) * 100}%` }} />
                    </span>
                    <b>{r.count}</b>
                  </li>
                ))}
            </ul>
          </>
        ) : null}
        <h3 className="ins-h3">Hardest questions (missed most often)</h3>
        {hardest.length ? (
          <ul className="ins-list">
            {hardest.map((h) => (
              <li key={h.q.id}>
                <span>
                  <span className="ins-num">
                    {numbers[h.q.chapter] ?? h.q.chapter}. {labels[h.q.chapter]}
                  </span>
                  <br />
                  {h.q.q}
                </span>
                <b title={`${h.wrong} wrong of ${h.seen}`}>{pct(h.wrong, h.seen)}%</b>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ins-muted">Needs a question to be answered at least 3 times.</p>
        )}
      </section>

      {/* Leaderboard */}
      <section className="ins-card" id="leaderboard">
        <h2 className="ins-h2">This week&apos;s leaderboard</h2>
        <p className="ins-note">
          Week of {weekStartLabel()} · points = correct answers across finished quizzes (up to 5 a day count) ·
          hidden entries stay off the public board.
        </p>
        {board.length ? (
          <ol className="ins-board">
            {board.map((r, i) => (
              <li key={r.id} className={r.hidden ? "is-hidden" : undefined}>
                <span className="ins-num">{i + 1}</span>
                <span className="ins-board-name">{r.name ?? <i>Anonymous</i>}</span>
                <b>{r.points} pts</b>
                <span className="ins-muted">
                  {r.quizzes} {r.quizzes === 1 ? "quiz" : "quizzes"} · avg {r.avg.toFixed(1)}
                </span>
                <form method="post" action="/api/book/admin/board">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="book" value={book.id} />
                  <input type="hidden" name="hidden" value={r.hidden ? "0" : "1"} />
                  <button type="submit" className="ins-btn ins-btn-ghost ins-btn-sm">
                    {r.hidden ? "Show" : "Hide"}
                  </button>
                </form>
              </li>
            ))}
          </ol>
        ) : (
          <p className="ins-muted">No quiz scores yet this week.</p>
        )}
      </section>

      {/* Notes */}
      <section className="ins-card">
        <h2 className="ins-h2">Reader notes</h2>
        <p className="ins-note">
          Latest {notes.length || ""} notes from &ldquo;Was this {book.id === "csc207" ? "chapter" : "solution"} clear?&rdquo;
        </p>
        {notes.length ? (
          <ul className="ins-notes">
            {notes.map((note, i) => (
              <li key={i} className={note.vote === "down" ? "is-down" : "is-up"}>
                <p className="ins-note-meta">
                  <span aria-label={note.vote === "down" ? "not quite" : "clear"}>{note.vote === "down" ? "👎" : "👍"}</span>{" "}
                  {numbers[note.chapter] ?? note.chapter}. {labels[note.chapter] ?? note.chapter}
                  {note.at ? <span className="ins-muted"> · {when.format(note.at)}</span> : null}
                </p>
                <p className="ins-note-text">{note.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ins-muted">No notes yet.</p>
        )}
      </section>
    </main>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="ins-tile">
      <p className="ins-tile-label">{label}</p>
      <p className="ins-tile-value">{value}</p>
      <p className="ins-tile-hint">{hint}</p>
    </div>
  );
}

const codeWhen = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Douala", day: "numeric", month: "short" });

/** Paid books: the unlock funnel, invites, and the unlock codes. */
function PaywallPanel({
  book,
  stats,
  shownBy,
  shown,
  codes,
  newCode,
  payments,
}: {
  book: BookInfo;
  stats: Stats;
  shownBy: Counts;
  shown: number;
  codes: CodeRow[];
  newCode: { code: string; note: string } | null;
  payments: PaymentRow[];
}) {
  const pw = stats.paywall ?? {};
  const wall = book.paywall!;
  const sources: [string, string][] = [
    ["inline", "Lock card on a solution"],
    ["fab", "Floating Unlock button"],
    ["sidebar", "Sidebar"],
    ["footer", "Footer"],
    ["quiz", "End of a quiz"],
  ];
  const waMessage = (code: string) =>
    encodeURIComponent(
      `Thank you! Your ${book.title} unlock code is ${code}. Open ${book.shortLink}, tap Unlock, then "I already have a code". It works on 2 devices.`
    );
  return (
    <div className="ins-grid">
      <section className="ins-card">
        <h2 className="ins-h2">Unlock funnel</h2>
        <dl className="ins-funnel">
          <div>
            <dt>Unlock sheet opened</dt>
            <dd>{fmt.format(shown)}</dd>
          </div>
          <div>
            <dt>Tapped Pay (Fapshi)</dt>
            <dd>
              {fmt.format(n(stats.pay_start))} <small>{pct(n(stats.pay_start), shown)}%</small>
            </dd>
          </div>
          <div>
            <dt>Paid through Fapshi</dt>
            <dd>
              {fmt.format(Number(pw.unlockedByPayment ?? 0))}{" "}
              <small>
                MTN {fmt.format(Number(pw.paidBy_mtn ?? 0))} · Orange {fmt.format(Number(pw.paidBy_orange ?? 0))}
              </small>
            </dd>
          </div>
          <div>
            <dt>Unlocked with a code</dt>
            <dd>
              {fmt.format(Number(pw.unlockedByCode ?? 0))}{" "}
              <small>{pct(Number(pw.unlockedByCode ?? 0), shown)}%</small>
            </dd>
          </div>
        </dl>
        <h3 className="ins-h3">Where the unlock sheet opened</h3>
        <ul className="ins-list">
          {sources.map(([k, label]) => (
            <li key={k}>
              <span>{label}</span>
              <b>{fmt.format(n(shownBy, k))}</b>
            </li>
          ))}
        </ul>
        <h3 className="ins-h3">Invites</h3>
        <ul className="ins-list">
          <li>
            <span>Invite link shared (WhatsApp / copied)</span>
            <b>
              {fmt.format(n(stats.invite_share, "whatsapp"))} / {fmt.format(n(stats.invite_share, "copy"))}
            </b>
          </li>
          <li>
            <span>Readers who arrived from an invite</span>
            <b>{fmt.format(n(stats.refs, "invite"))}</b>
          </li>
          <li>
            <span>Invited readers who read {wall.invitesNeeded} questions (counted)</span>
            <b>{fmt.format(Number(pw.invitesCounted ?? 0))}</b>
          </li>
          <li>
            <span>Unlocked by inviting {wall.invitesNeeded} classmates</span>
            <b>{fmt.format(Number(pw.unlockedByInvite ?? 0))}</b>
          </li>
        </ul>
      </section>

      <section className="ins-card" id="payments">
        <h2 className="ins-h2">Mobile Money payments (Fapshi)</h2>
        <p className="ins-note">
          {fapshiEnabled()
            ? "Instant checkout is on. Payments are confirmed with Fapshi before anything unlocks."
            : "Instant checkout is off: set FAPSHI_BASE_URL, FAPSHI_API_USER and FAPSHI_API_KEY to switch it on. Students see the manual steps meanwhile."}
        </p>
        {payments.length ? (
          <ul className="ins-list">
            {payments.map((p) => (
              <li key={p.id}>
                <span>
                  <b>{p.status}</b> · {p.kind === "tip" ? "tip" : "unlock"} · {p.amount} FCFA{p.medium ? ` · ${p.medium}` : ""}
                  {p.env === "sandbox" ? <span className="ins-muted"> · sandbox</span> : null}
                  <br />
                  <span className="ins-muted">
                    {when.format(new Date(p.createdAt))} · <code>{p.id}</code>
                  </span>
                </span>
                <b>{p.revenue === null ? "–" : `${p.revenue} FCFA`}</b>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ins-muted">No payments yet.</p>
        )}
      </section>

      <section className="ins-card" id="codes">
        <h2 className="ins-h2">Unlock codes</h2>
        <p className="ins-note">
          Gift codes: make one here for a student you want to give free access to, and send it to them. Payments
          themselves go through Fapshi. Each code works on {2} devices and is stored only as a fingerprint, so copy
          it now.
        </p>
        {newCode ? (
          <div className="ins-newcode" role="status">
            <p className="ins-kicker">New code{newCode.note ? ` for ${newCode.note}` : ""}</p>
            <p className="ins-newcode-value">{newCode.code}</p>
            <a
              className="ins-btn"
              href={`https://wa.me/?text=${waMessage(newCode.code)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send on WhatsApp
            </a>
            <p className="ins-note">Shown for one minute. Make a new one if you miss it.</p>
          </div>
        ) : null}
        <form method="post" action="/api/book/admin/codes" className="ins-codeform">
          <input type="hidden" name="book" value={book.id} />
          <label htmlFor="code-note" className="ins-label">
            Who paid (name or last digits of their number)
          </label>
          <div className="ins-codeform-row">
            <input id="code-note" name="note" maxLength={80} className="ins-input" placeholder="e.g. Brenda ·· 4471" />
            <button type="submit" className="ins-btn">
              Make a code
            </button>
          </div>
        </form>
        {codes.length ? (
          <ul className="ins-list ins-codes">
            {codes.map((c) => (
              <li key={c.id} className={c.revoked ? "is-hidden" : undefined}>
                <span>
                  <code>····-{c.hint}</code> {c.note || <i className="ins-muted">no note</i>}
                  <br />
                  <span className="ins-muted">
                    {codeWhen.format(new Date(c.createdAt))} · used on {c.uses} of 2 devices
                    {c.revoked ? " · switched off" : ""}
                  </span>
                </span>
                <form method="post" action="/api/book/admin/codes">
                  <input type="hidden" name="book" value={book.id} />
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="revoked" value={c.revoked ? "0" : "1"} />
                  <button type="submit" className="ins-btn ins-btn-ghost ins-btn-sm">
                    {c.revoked ? "Switch on" : "Switch off"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ins-muted">No codes yet.</p>
        )}
      </section>
    </div>
  );
}

/** "All books" plus one tab per book. */
/**
 * Book navigation, one row per course: the course code on the left, its books on the right. A new
 * book joins its course's row and a new course adds a row, so the list never turns into one long,
 * wrapping strip of near-identical "CSC207 …" pills.
 */
function BookTabs({ current }: { current: BookInfo["id"] | null }) {
  return (
    <nav className="ins-tabs" aria-label="Books">
      <a href="/book-insights" className="ins-tabs-all" aria-current={current === null ? "page" : undefined}>
        All books
      </a>
      {booksByCourse().map((g) => (
        <div key={g.course} className="ins-tabs-group">
          <span className="ins-tabs-course">{g.course}</span>
          <div className="ins-tabs-row">
            {g.ids.map((id) => (
              <a
                key={id}
                href={`/book-insights?book=${id}`}
                aria-current={id === current ? "page" : undefined}
                title={BOOKS[id].title}
              >
                {titleInCourse(BOOKS[id])}
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

/** One book's headline numbers for the board. */
async function bookSummary(book: BookInfo) {
  const [snap, views] = await Promise.all([
    db().collection("bookStats").doc(book.id).get(),
    Promise.all(VIEW_PATHS[book.id].map((p) => getPathViews(p))),
  ]);
  const stats = (snap.data() ?? {}) as Stats;
  const known = views.filter((v): v is number => v !== null);
  const readers = n(stats.readers);
  const q = stats.quiz ?? {};
  const quizFinished = Number(q.finished ?? 0);
  let up = 0;
  let down = 0;
  for (const [k, v] of Object.entries(stats.clarity ?? {})) {
    if (k.endsWith("_up")) up += Number(v);
    else if (k.endsWith("_down")) down += Number(v);
  }
  const pw = stats.paywall ?? {};
  const now = Date.now();
  const days = Array.from({ length: 14 }, (_, i) => n(stats.daily, dayKey(new Date(now - (13 - i) * 86400000))));
  return {
    book,
    readers,
    today: days[days.length - 1],
    days,
    views: known.length ? known.reduce((a, b) => a + b, 0) : null,
    finishedPct: pct(n(stats.end), readers),
    quizFinished,
    avgScore: quizFinished ? Number(q.scoreSum ?? 0) / quizFinished : null,
    clearPct: up + down ? pct(up, up + down) : null,
    votes: up + down,
    unlocked: Number(pw.unlockedByCode ?? 0) + Number(pw.unlockedByInvite ?? 0) + Number(pw.unlockedByPayment ?? 0),
    revenue:
      Number(pw.codesUsed ?? 0) * (book.paywall?.priceFcfa ?? 0) +
      Number(pw.paymentsRevenue ?? 0) +
      Number(stats.support?.tipsRevenue ?? 0),
    tips: Number(stats.support?.tips ?? 0),
    downloads: n(stats.download_free) + n(stats.download_supported) + n(stats.download_direct),
    updated: stats.updatedAt?.toDate?.() ?? null,
  };
}

/**
 * People, not book readers: a student who reads three books is one person here. Counts reader
 * documents (one per anonymous reader id), and those first seen since midnight in Cameroon.
 */
async function peopleCounts(now = new Date()): Promise<{ people: number; today: number }> {
  const readers = db().collection("bookReaders");
  const local = new Date(now.getTime() + 3600000); // Africa/Douala is UTC+1 all year
  const startOfToday = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - 3600000);
  const [people, today] = await Promise.all([
    readers.count().get(),
    readers.where("firstSeen", ">=", startOfToday).count().get(),
  ]);
  return { people: people.data().count, today: today.data().count };
}

/** The board: every book at a glance. Each card opens that book's insights. */
async function Overview() {
  const books = await Promise.all(BOOK_IDS.map((id) => bookSummary(BOOKS[id])));
  const { people: totalReaders, today: totalToday } = await peopleCounts();
  const totalRevenue = books.reduce((a, b) => a + b.revenue, 0);
  const totalQuizzes = books.reduce((a, b) => a + b.quizFinished, 0);
  const latest = books
    .map((b) => b.updated)
    .filter((d): d is Date => d !== null)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <main className="ins">
      <header className="ins-head">
        <div>
          <p className="ins-kicker">All books</p>
          <h1 className="ins-h1">Book insights</h1>
          <BookTabs current={null} />
          <p className="ins-sub">
            {latest ? `Last activity ${when.format(latest)}` : "No activity yet"} · Cameroon time
          </p>
        </div>
        <div className="ins-head-actions">
          <a href="/book-insights" className="ins-btn ins-btn-ghost">
            Refresh
          </a>
          <form method="post" action="/api/book/admin">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="ins-btn ins-btn-ghost">
              Log out
            </button>
          </form>
        </div>
      </header>

      <section className="ins-tiles" aria-label="All books together">
        <Tile label="People, all books" value={fmt.format(totalReaders)} hint={`${fmt.format(totalToday)} new today · each counted once`} />
        <Tile label="Quizzes finished" value={fmt.format(totalQuizzes)} hint="across every book" />
        <Tile label="Revenue" value={`${fmt.format(totalRevenue)} FCFA`} hint="unlocks and tips, after fees" />
        <Tile label="Books" value={String(books.length)} hint={`${books.filter((b) => b.book.paywall).length} paid`} />
      </section>

      {booksByCourse().map((group) => {
        const inCourse = books.filter((b) => group.ids.includes(b.book.id));
        const courseReaders = inCourse.reduce((a, b) => a + b.readers, 0);
        return (
          <section key={group.course} className="ins-course" aria-labelledby={`course-${group.course}`}>
            <header className="ins-course-head">
              <h2 id={`course-${group.course}`} className="ins-course-title">
                {group.course}
              </h2>
              <p className="ins-muted">
                {inCourse.length} {inCourse.length === 1 ? "book" : "books"} · {fmt.format(courseReaders)}{" "}
                {courseReaders === 1 ? "book reader" : "book readers"}
              </p>
            </header>
            <div className="ins-books">
        {inCourse.map((b) => {
          const max = Math.max(...b.days, 1);
          return (
            <a key={b.book.id} href={`/book-insights?book=${b.book.id}`} className="ins-card ins-book">
              <div className="ins-book-head">
                <div>
                  <p className="ins-kicker">{b.book.paywall ? `Paid · ${b.book.paywall.priceFcfa} FCFA` : "Free"}</p>
                  <h3 className="ins-h2">{titleInCourse(b.book)}</h3>
                  <p className="ins-muted">{b.book.path}</p>
                </div>
                <span className="ins-book-go" aria-hidden>
                  &rarr;
                </span>
              </div>

              <dl className="ins-book-stats">
                <div>
                  <dt>Readers</dt>
                  <dd>
                    {fmt.format(b.readers)} <small>+{fmt.format(b.today)} today</small>
                  </dd>
                </div>
                <div>
                  <dt>Page views</dt>
                  <dd>{b.views === null ? "–" : fmt.format(b.views)}</dd>
                </div>
                <div>
                  <dt>Read to the end</dt>
                  <dd>{b.finishedPct}%</dd>
                </div>
                <div>
                  <dt>Quizzes finished</dt>
                  <dd>
                    {fmt.format(b.quizFinished)}{" "}
                    <small>{b.avgScore === null ? "" : `avg ${b.avgScore.toFixed(1)}/10`}</small>
                  </dd>
                </div>
                <div>
                  <dt>Found it clear</dt>
                  <dd>
                    {b.clearPct === null ? "–" : `${b.clearPct}%`} <small>{fmt.format(b.votes)} votes</small>
                  </dd>
                </div>
                {b.book.paywall ? (
                  <div>
                    <dt>Unlocked · revenue</dt>
                    <dd>
                      {fmt.format(b.unlocked)} <small>{fmt.format(b.revenue)} FCFA</small>
                    </dd>
                  </div>
                ) : (
                  <div>
                    <dt>Tips · PDF downloads</dt>
                    <dd>
                      {fmt.format(b.tips)} <small>{fmt.format(b.downloads)} PDFs</small>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="ins-book-spark" aria-label={`New readers over the last 14 days: ${b.days.join(", ")}`}>
                {b.days.map((d, i) => (
                  <span key={i} style={{ height: `${Math.max((d / max) * 100, d ? 6 : 2)}%` }} />
                ))}
              </div>
              <p className="ins-muted ins-book-spark-label">New readers, last 14 days</p>
            </a>
          );
        })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
