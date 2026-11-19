import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ADMIN_COOKIE, dashboardEnabled, validSession } from "@/lib/insights/admin-auth";
import { BOOK_ID, dayKey, db, insightsEnabled } from "@/lib/insights/server";
import { getPathViews } from "@/lib/vercel/analytics";
import { TOPIC_LABELS } from "../algorithms-made-easy-csc207/book-info";
import { QUIZ_QUESTIONS } from "../algorithms-made-easy-csc207/quiz-questions";
import { loadBoard } from "@/lib/quiz/board";
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
  support_copy?: Counts;
  support_dial?: Counts;
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
  updatedAt?: { toDate(): Date };
};
type Note = { chapter: string; vote: "up" | "down"; text: string; at: Date | null };

const CHAPTERS = Array.from({ length: 24 }, (_, i) => `c${i + 1}`);
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

async function load() {
  const store = db();
  const [statsSnap, notesSnap, views, board] = await Promise.all([
    store.collection("bookStats").doc(BOOK_ID).get(),
    store.collection("bookFeedback").orderBy("at", "desc").limit(60).get(),
    Promise.all([getPathViews("/algorithms-made-easy-csc207"), getPathViews("/algorithms")]),
    loadBoard(weekKey(), { includeHidden: true }),
  ]);
  const stats = (statsSnap.data() ?? {}) as Stats;
  const notes: Note[] = notesSnap.docs
    .map((d) => d.data())
    .filter((d) => d.book === BOOK_ID)
    .map((d) => ({ chapter: d.chapter, vote: d.vote, text: d.text, at: d.at?.toDate?.() ?? null }));
  const known = views.filter((v): v is number => v !== null);

  // The last 14 days (Cameroon time), oldest first.
  const now = Date.now();
  const dayLabel = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Douala", day: "numeric", month: "short" });
  const recentDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now - (13 - i) * 24 * 60 * 60 * 1000);
    return { key: dayKey(d), label: dayLabel.format(d) };
  });

  return { stats, notes, views: known.length ? known.reduce((a, b) => a + b, 0) : null, recentDays, board };
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

export default async function BookInsights({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (!dashboardEnabled()) notFound();
  const jar = await cookies();
  if (!validSession(jar.get(ADMIN_COOKIE)?.value)) {
    const { e } = await searchParams;
    return <Login failed={e === "1"} />;
  }
  if (!insightsEnabled()) {
    return (
      <main className="ins">
        <div className="ins-card">Insights are off: Firebase admin isn&apos;t configured on this deployment.</div>
      </main>
    );
  }

  const { stats, notes, views, recentDays, board } = await load();
  const readers = n(stats.readers);
  const finished = n(stats.end);
  const downloads = n(stats.download_free) + n(stats.download_supported) + n(stats.download_direct);
  const copies = n(stats.support_copy);
  const dials = n(stats.support_dial);
  const shownBy = stats.support_shown ?? {};
  const shown = Object.values(shownBy).reduce((a, b) => a + Number(b), 0);

  const rows = CHAPTERS.map((c) => {
    const up = n(stats.clarity, `${c}_up`);
    const down = n(stats.clarity, `${c}_down`);
    return { id: c, num: Number(c.slice(1)), label: TOPIC_LABELS[c] ?? c, reach: n(stats.reach, c), up, down };
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
  const hardest = QUIZ_QUESTIONS.map((question) => {
    const seen = n(qStats, `${question.id}_seen`);
    const wrong = n(qStats, `${question.id}_wrong`);
    return { q: question, seen, wrong, rate: seen ? wrong / seen : 0 };
  })
    .filter((r) => r.seen >= 3)
    .sort((a, b) => b.rate - a.rate || b.seen - a.seen)
    .slice(0, 6);

  const updated = stats.updatedAt?.toDate?.();

  return (
    <main className="ins">
      <header className="ins-head">
        <div>
          <p className="ins-kicker">CSC207 Made Easy</p>
          <h1 className="ins-h1">Book insights</h1>
          <p className="ins-sub">
            {updated ? `Last activity ${when.format(updated)}` : "No activity yet"} · Cameroon time
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
        <Tile label="PDF downloads" value={fmt.format(downloads)} hint={`${fmt.format(n(stats.download_free))} chose free`} />
        <Tile
          label="Copied or dialled code"
          value={fmt.format(copies + dials)}
          hint={`${pct(copies + dials, shown)}% of prompts shown`}
        />
        <Tile
          label="Found chapters clear"
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
        <h2 className="ins-h2">Chapters: reach and clarity</h2>
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
                <th scope="col">Chapter</th>
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
                      <span className="ins-num">{String(r.num).padStart(2, "0")}</span> {r.label}
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

      <div className="ins-grid">
        {/* Support funnel */}
        <section className="ins-card">
          <h2 className="ins-h2">Support funnel</h2>
          <dl className="ins-funnel">
            <div>
              <dt>Prompt shown</dt>
              <dd>{fmt.format(shown)}</dd>
            </div>
            <div>
              <dt>Copied the code</dt>
              <dd>
                {fmt.format(copies)} <small>{pct(copies, shown)}%</small>
              </dd>
            </div>
            <div>
              <dt>Tapped Dial now</dt>
              <dd>
                {fmt.format(dials)} <small>{pct(dials, shown)}%</small>
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
              <span>After copying / dialling</span>
              <b>{fmt.format(n(stats.download_supported))}</b>
            </li>
            <li>
              <span>Returning supporters</span>
              <b>{fmt.format(n(stats.download_direct))}</b>
            </li>
          </ul>
          <p className="ins-note">
            Copying the code isn&apos;t the same as paying. Compare with the tips you actually received on Mobile
            Money.
          </p>
        </section>

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
              ["link", "Direct link (/csc207/quiz)"],
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
                    {Number(h.q.chapter.slice(1))}. {TOPIC_LABELS[h.q.chapter]}
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
        <p className="ins-note">Latest {notes.length || ""} notes from &ldquo;Was this chapter clear?&rdquo;</p>
        {notes.length ? (
          <ul className="ins-notes">
            {notes.map((note, i) => (
              <li key={i} className={note.vote === "down" ? "is-down" : "is-up"}>
                <p className="ins-note-meta">
                  <span aria-label={note.vote === "down" ? "not quite" : "clear"}>{note.vote === "down" ? "👎" : "👍"}</span>{" "}
                  {Number(note.chapter.slice(1))}. {TOPIC_LABELS[note.chapter] ?? note.chapter}
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
