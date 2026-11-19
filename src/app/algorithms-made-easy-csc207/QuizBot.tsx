"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Loader2, RotateCcw, Trophy, X } from "lucide-react";
import { TOPIC_LABELS } from "./book-info";
import { track } from "./insights";

const LETTERS = ["A", "B", "C", "D"];

type Profile = { asked: boolean; name: string | null; anonymous: boolean };
type Question = { id: string; chapter: string; q: string; options: string[]; order: number[] };
type Feedback = { correct: boolean; answer: number; explain: string };
type Result = { id: string; chapter: string; correct: boolean };
type BoardRow = { rank: number; name: string | null; points: number; quizzes: number; avg: number; you: boolean };
type Board = { week: string; total: number; top: BoardRow[]; you: BoardRow | null };
type Phase = "loading" | "name" | "intro" | "q" | "done" | "board" | "error";

type Props = { onClose: () => void; onReadChapter: (chapterId: string) => void };

async function api<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/book/quiz/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Something went wrong");
  return data as T;
}

const shuffle = () => [0, 1, 2, 3].sort(() => Math.random() - 0.5);

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function verdict(score: number) {
  if (score >= 9) return { title: "CA-ready!", line: "You clearly know this course. Keep it fresh and you'll fly through the CA." };
  if (score >= 7) return { title: "Strong work", line: "Solid grasp. Polish the topics you missed and you're there." };
  if (score >= 5) return { title: "Getting there", line: "Good base. Revisit the topics below, then try a fresh set." };
  return { title: "Good start", line: "Every miss shows you exactly what to read next. Revisit the topics below and try again." };
}

/**
 * Algo, the quiz bot. Asks what to call the reader (or lets them stay anonymous), then runs a
 * 10-question quiz graded on the server. The first finished attempt each week goes on the
 * weekly leaderboard.
 */
export default function QuizBot({ onClose, onReadChapter }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [sid, setSid] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [ranked, setRanked] = useState(false);
  const [onBoard, setOnBoard] = useState(false);
  const [weekPoints, setWeekPoints] = useState<{ points: number; quizzes: number } | null>(null);

  const [board, setBoard] = useState<Board | null>(null);
  const [boardBack, setBoardBack] = useState<Phase>("intro");

  const [closing, setClosing] = useState(false);
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  const cardRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = questions[index];
  const score = results.filter((r) => r.correct).length;

  const close = useCallback(
    (then?: () => void) => {
      if (closeTimer.current) return;
      setClosing(true);
      closeTimer.current = setTimeout(() => {
        onClose();
        if (then) then();
        else opener?.focus?.({ preventScroll: true });
      }, 200);
    },
    [onClose, opener]
  );

  // Open: lock page scroll and find out whether Algo already knows this reader.
  useEffect(() => {
    track("quiz_open");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let alive = true;
    api<Profile>("profile")
      .then((p) => {
        if (!alive) return;
        setProfile(p);
        setPhase(p.asked ? "intro" : "name");
      })
      .catch(() => {
        if (!alive) return;
        setErrorText("Algo can't reach the server right now. Check your connection and try again.");
        setPhase("error");
      });
    return () => {
      alive = false;
      document.body.style.overflow = prev;
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const saveName = async (anonymous: boolean) => {
    if (busy) return;
    setBusy(true);
    setNameError("");
    try {
      const p = await api<Profile>("profile", anonymous ? { anonymous: true } : { name: nameInput });
      setProfile(p);
      setPhase("intro");
    } catch (e) {
      setNameError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const start = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const s = await api<{
        sid: string;
        ranked: boolean;
        points: number;
        quizzes: number;
        questions: Omit<Question, "order">[];
      }>("start", {});
      setSid(s.sid);
      setRanked(s.ranked);
      setOnBoard(false);
      setWeekPoints({ points: s.points, quizzes: s.quizzes });
      setQuestions(s.questions.map((q) => ({ ...q, order: shuffle() })));
      setIndex(0);
      setPicked(null);
      setFeedback(null);
      setResults([]);
      setErrorText("");
      setPhase("q");
    } catch {
      setErrorText("Couldn't start the quiz. Check your connection and try again.");
      setPhase("error");
    } finally {
      setBusy(false);
    }
  };

  const answer = useCallback(
    async (pos: number) => {
      if (phase !== "q" || picked !== null || busy || !current) return;
      setPicked(pos);
      setBusy(true);
      setErrorText("");
      try {
        const r = await api<
          Feedback & { done: boolean; score: number; ranked: boolean; points: number; quizzes: number }
        >("answer", {
          sid,
          qid: current.id,
          choice: current.order[pos],
        });
        setFeedback({ correct: r.correct, answer: r.answer, explain: r.explain });
        setResults((list) => [...list, { id: current.id, chapter: current.chapter, correct: r.correct }]);
        if (!r.correct) track("quiz_miss", current.id);
        if (r.done) {
          setOnBoard(r.ranked);
          setWeekPoints({ points: r.points, quizzes: r.quizzes });
          track("quiz_finish", `s${r.score}`);
        }
      } catch (e) {
        setPicked(null);
        setErrorText((e as Error).message || "Couldn't check that answer. Try again.");
      } finally {
        setBusy(false);
      }
    },
    [phase, picked, busy, current, sid]
  );

  const next = useCallback(() => {
    if (!feedback) return;
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
      setFeedback(null);
    } else {
      setPhase("done");
    }
  }, [feedback, index, questions.length]);

  const openBoard = async (back: Phase) => {
    setBoardBack(back);
    setBoard(null);
    setPhase("board");
    try {
      setBoard(await api<Board>("board"));
    } catch {
      setBoard({ week: "", total: 0, top: [], you: null });
    }
  };

  // Keep focus on the main action as Algo moves along.
  useEffect(() => {
    const t = setTimeout(() => {
      if (phase === "name") nameRef.current?.focus({ preventScroll: true });
      else primaryRef.current?.focus({ preventScroll: true });
    }, 60);
    return () => clearTimeout(t);
  }, [phase, index, feedback, board]);

  // Keyboard: A-D or 1-4 to answer, Escape to close, Tab stays inside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && cardRef.current) {
        const items = cardRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (phase !== "q" || picked !== null || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toUpperCase();
      const pos = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : ["1", "2", "3", "4"].indexOf(k);
      if (pos >= 0) {
        e.preventDefault();
        void answer(pos);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, phase, picked, answer]);

  const missedChapters = Array.from(new Set(results.filter((r) => !r.correct).map((r) => r.chapter)));
  const greetingName = profile?.anonymous ? null : profile?.name;
  const mood =
    phase === "done"
      ? score >= 7
        ? "happy"
        : "cheer"
      : phase === "q" && feedback
        ? feedback.correct
          ? "happy"
          : "oops"
        : "idle";
  const progress =
    phase === "q"
      ? (results.length / Math.max(questions.length, 1)) * 100
      : phase === "done" || (phase === "board" && boardBack === "done")
        ? 100
        : 0;
  const subtitle =
    phase === "q"
      ? `Question ${index + 1} of ${questions.length}`
      : phase === "done"
        ? "Quiz complete"
        : phase === "board"
          ? "Weekly leaderboard"
          : "CSC207 Made Easy";

  return (
    <div
      className={`quiz-backdrop ${closing ? "is-closing" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div ref={cardRef} className="quiz-card" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
        <header className="quiz-head">
          <Robot mood={mood} />
          <div className="quiz-head-text">
            <p id="quiz-title" className="quiz-name">
              Algo <span>· quiz bot</span>
            </p>
            <p className="quiz-sub">{subtitle}</p>
          </div>
          <button type="button" className="quiz-x" onClick={() => close()} aria-label="Close quiz">
            <X className="w-4 h-4" aria-hidden />
          </button>
        </header>
        <div className="quiz-progress" aria-hidden>
          <i style={{ width: `${progress}%` }} />
        </div>

        <div className="quiz-body" aria-live="polite">
          {phase === "loading" ? (
            <div className="quiz-step quiz-loading" key="loading">
              <Loader2 className="w-5 h-5 quiz-spin" aria-hidden /> Waking Algo up…
            </div>
          ) : null}

          {phase === "error" ? (
            <div className="quiz-step" key="error">
              <p className="quiz-bubble">{errorText}</p>
              <button ref={primaryRef} type="button" className="quiz-btn" onClick={() => close()}>
                Back to reading
              </button>
            </div>
          ) : null}

          {phase === "name" ? (
            <form
              className="quiz-step"
              key="name"
              onSubmit={(e) => {
                e.preventDefault();
                void saveName(false);
              }}
            >
              <p className="quiz-bubble">
                Hi! I&apos;m <b>Algo</b>{" "}🤖 I&apos;ll test you on what you&apos;ve read.
              </p>
              <p className="quiz-bubble">
                <b>What should Algo call you?</b>{" "}Your name appears on this week&apos;s leaderboard.
              </p>
              <label className="quiz-label" htmlFor="quiz-name-input">
                Your name
              </label>
              <input
                ref={nameRef}
                id="quiz-name-input"
                className="quiz-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                autoComplete="nickname"
                placeholder="e.g. Brenda"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "quiz-name-error" : undefined}
              />
              {nameError ? (
                <p className="quiz-error" id="quiz-name-error">
                  {nameError}
                </p>
              ) : null}
              <button type="submit" className="quiz-btn" disabled={busy || nameInput.trim().length < 2}>
                {busy ? <Loader2 className="w-4 h-4 quiz-spin" aria-hidden /> : null} Continue
              </button>
              <button type="button" className="quiz-later" onClick={() => saveName(true)} disabled={busy}>
                Stay anonymous
              </button>
            </form>
          ) : null}

          {phase === "intro" ? (
            <div className="quiz-step" key="intro">
              <p className="quiz-bubble">
                {greetingName ? (
                  <>
                    Welcome back, <b>{greetingName}</b>{" "}👋
                  </>
                ) : (
                  <>Welcome back 👋</>
                )}
              </p>
              <p className="quiz-bubble">
                <b>10 quick questions</b>{" "}from across the book. No calculations, just pick A, B, C or D. Every
                quiz you finish adds your score to this week&apos;s{" "}<b>leaderboard</b>{" "}(up to 5 a day).
              </p>
              <button ref={primaryRef} type="button" className="quiz-btn" onClick={start} disabled={busy}>
                {busy ? <Loader2 className="w-4 h-4 quiz-spin" aria-hidden /> : null} Start the quiz{" "}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
              <button type="button" className="quiz-btn quiz-btn-ghost" onClick={() => openBoard("intro")}>
                <Trophy className="w-4 h-4" aria-hidden /> This week&apos;s leaderboard
              </button>
              <button
                type="button"
                className="quiz-later"
                onClick={() => {
                  setNameInput(profile?.name ?? "");
                  setPhase("name");
                }}
              >
                {greetingName ? "Change name" : "Add a name"}
              </button>
            </div>
          ) : null}

          {phase === "q" && current ? (
            <div className="quiz-step" key={current.id}>
              <p className="quiz-bubble quiz-q">
                <span className="quiz-qnum">{index + 1}.</span>{" "}{current.q}
              </p>
              <div className="quiz-options" role="group" aria-label="Answers">
                {current.order.map((optIndex, pos) => {
                  const isAnswer = feedback !== null && optIndex === feedback.answer;
                  const state =
                    feedback === null
                      ? pos === picked
                        ? "is-pending"
                        : ""
                      : isAnswer
                        ? "is-right"
                        : pos === picked
                          ? "is-wrong"
                          : "is-dim";
                  return (
                    <button
                      key={pos}
                      type="button"
                      className={`quiz-opt ${state}`}
                      onClick={() => answer(pos)}
                      disabled={picked !== null}
                      aria-label={`${LETTERS[pos]}: ${current.options[optIndex]}`}
                    >
                      <span className="quiz-letter">
                        {isAnswer ? (
                          <Check className="w-3.5 h-3.5" aria-hidden />
                        ) : pos === picked && !feedback ? (
                          <Loader2 className="w-3.5 h-3.5 quiz-spin" aria-hidden />
                        ) : (
                          LETTERS[pos]
                        )}
                      </span>
                      <span>{current.options[optIndex]}</span>
                    </button>
                  );
                })}
              </div>

              {feedback ? (
                <div className={`quiz-feedback ${feedback.correct ? "is-right" : "is-wrong"}`}>
                  <p className="quiz-feedback-title">
                    {feedback.correct
                      ? "Correct! 🎯"
                      : `Not quite. The answer is ${LETTERS[current.order.indexOf(feedback.answer)]}.`}
                  </p>
                  <p>{feedback.explain}</p>
                  {!feedback.correct ? (
                    <button
                      type="button"
                      className="quiz-read"
                      onClick={() => close(() => onReadChapter(current.chapter))}
                    >
                      <BookOpen className="w-3.5 h-3.5" aria-hidden /> Read chapter {Number(current.chapter.slice(1))}
                    </button>
                  ) : null}
                  <button ref={primaryRef} type="button" className="quiz-btn" onClick={next}>
                    {index + 1 < questions.length ? "Next question" : "See my score"}{" "}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </button>
                </div>
              ) : errorText ? (
                <p className="quiz-error">{errorText}</p>
              ) : (
                <p className="quiz-hint">Tap an answer, or press A–D.</p>
              )}
            </div>
          ) : null}

          {phase === "done" ? (
            <div className="quiz-step quiz-result" key="done">
              <div className="quiz-score" aria-label={`You scored ${score} out of ${questions.length}`}>
                <span className="quiz-score-num">{score}</span>
                <span className="quiz-score-of">/ {questions.length}</span>
              </div>
              <p className="quiz-result-title">{verdict(score).title}</p>
              <p className="quiz-bubble">{verdict(score).line}</p>
              <p className={`quiz-rank-note ${onBoard ? "is-on" : ""}`}>
                {onBoard
                  ? `🏆 +${plural(score, "point")}! You have ${plural(weekPoints?.points ?? score, "point")} from ${plural(
                      weekPoints?.quizzes ?? 1,
                      "quiz",
                      "quizzes"
                    )} this week.`
                  : ranked
                    ? "This quiz couldn't be added to the leaderboard. Your points are safe."
                    : "Practice round: 5 quizzes a day count for points, and you've done today's. Come back tomorrow for more!"}
              </p>
              {missedChapters.length ? (
                <>
                  <p className="quiz-label">Revisit these topics</p>
                  <ul className="quiz-revisit">
                    {missedChapters.map((c) => (
                      <li key={c}>
                        <button type="button" onClick={() => close(() => onReadChapter(c))}>
                          <BookOpen className="w-3.5 h-3.5" aria-hidden />
                          {Number(c.slice(1))}. {TOPIC_LABELS[c] ?? c}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="quiz-bubble">A perfect score. Algo is impressed 🎉</p>
              )}
              <div className="quiz-actions">
                <button ref={primaryRef} type="button" className="quiz-btn" onClick={() => openBoard("done")}>
                  <Trophy className="w-4 h-4" aria-hidden /> See the leaderboard
                </button>
                <button type="button" className="quiz-btn quiz-btn-ghost" onClick={start} disabled={busy}>
                  <RotateCcw className="w-4 h-4" aria-hidden /> Try a fresh set
                </button>
              </div>
            </div>
          ) : null}

          {phase === "board" ? (
            <div className="quiz-step" key="board">
              <p className="quiz-board-title">
                <Trophy className="w-5 h-5" aria-hidden /> This week&apos;s leaderboard
              </p>
              <p className="quiz-board-sub">
                {board?.week ? `Week of ${board.week} · resets every Monday` : "Resets every Monday"}
              </p>
              {!board ? (
                <p className="quiz-loading">
                  <Loader2 className="w-5 h-5 quiz-spin" aria-hidden /> Loading…
                </p>
              ) : board.top.length ? (
                <ol className="quiz-board">
                  {board.top.map((r) => (
                    <BoardItem key={r.rank} row={r} />
                  ))}
                  {board.you ? (
                    <>
                      <li className="quiz-board-gap" aria-hidden>
                        ⋯
                      </li>
                      <BoardItem row={board.you} />
                    </>
                  ) : null}
                </ol>
              ) : (
                <p className="quiz-bubble">No scores yet this week. Take the quiz and claim the top spot 🏆</p>
              )}
              <p className="quiz-hint">
                Points = correct answers from every quiz you finish this week (up to 5 quizzes a day). Ties go to the
                better average.
              </p>
              <div className="quiz-actions">
                <button
                  ref={primaryRef}
                  type="button"
                  className="quiz-btn quiz-btn-ghost"
                  onClick={() => setPhase(boardBack)}
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden /> Back
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BoardItem({ row }: { row: BoardRow }) {
  const medal = row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : null;
  return (
    <li className={`quiz-board-row ${row.you ? "is-you" : ""}`}>
      <span className="quiz-board-rank">{medal ?? row.rank}</span>
      <span className="quiz-board-who">
        <span className="quiz-board-name">
          {row.name ?? <i>Anonymous</i>}
          {row.you ? <span className="quiz-board-you">you</span> : null}
        </span>
        <span className="quiz-board-time">
          {row.quizzes} {row.quizzes === 1 ? "quiz" : "quizzes"} · avg {row.avg.toFixed(1)}/10
        </span>
      </span>
      <span className="quiz-board-score">{row.points} pts</span>
    </li>
  );
}

/** Algo, the quiz robot. Blinks while idle, smiles at right answers, winces at wrong ones. */
export function Robot({ mood = "idle", size = 44 }: { mood?: "idle" | "happy" | "oops" | "cheer"; size?: number }) {
  return (
    <span className={`robot robot-${mood}`} aria-hidden style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <line x1="32" y1="6" x2="32" y2="14" className="robot-stalk" />
        <circle cx="32" cy="6" r="4" className="robot-light" />
        <rect x="10" y="14" width="44" height="38" rx="12" className="robot-head" />
        <rect x="5" y="28" width="6" height="12" rx="3" className="robot-ear" />
        <rect x="53" y="28" width="6" height="12" rx="3" className="robot-ear" />
        <g className="robot-eyes">
          <circle cx="24" cy="31" r="4.5" className="robot-eye" />
          <circle cx="40" cy="31" r="4.5" className="robot-eye" />
        </g>
        {mood === "oops" ? (
          <path d="M24 44 Q32 39 40 44" className="robot-mouth" />
        ) : mood === "happy" || mood === "cheer" ? (
          <path d="M22 41 Q32 50 42 41" className="robot-mouth" />
        ) : (
          <path d="M25 42 Q32 46 39 42" className="robot-mouth" />
        )}
      </svg>
    </span>
  );
}
