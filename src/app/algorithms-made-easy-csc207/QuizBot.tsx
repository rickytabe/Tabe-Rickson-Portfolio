"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, RotateCcw, X } from "lucide-react";
import { TOPIC_LABELS } from "./book-info";
import { drawQuiz } from "./quiz-bank";
import { track } from "./insights";

const LETTERS = ["A", "B", "C", "D"];
const COUNT = 10;

type Result = { id: string; chapter: string; correct: boolean };
type Props = { onClose: () => void; onReadChapter: (chapterId: string) => void };

function verdict(score: number) {
  if (score >= 9) return { title: "CA-ready!", line: "You clearly know this course. Keep it fresh and you'll fly through the CA." };
  if (score >= 7) return { title: "Strong work", line: "Solid grasp. Polish the topics you missed and you're there." };
  if (score >= 5) return { title: "Getting there", line: "Good base. Revisit the topics below, then try a fresh set." };
  return { title: "Good start", line: "Every miss shows you exactly what to read next. Revisit the topics below and try again." };
}

/** A friendly quiz bot: 10 MCQs from across the book, one at a time, with instant feedback. */
export default function QuizBot({ onClose, onReadChapter }: Props) {
  const [questions, setQuestions] = useState(() => drawQuiz(COUNT));
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null); // position in the shown order
  const [results, setResults] = useState<Result[]>([]);
  const [closing, setClosing] = useState(false);
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  const cardRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const done = started && results.length === questions.length && picked === null;
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

  useEffect(() => {
    track("quiz_open");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const answer = useCallback(
    (pos: number) => {
      if (!started || picked !== null || !current) return;
      const correct = current.order[pos] === current.answer;
      setPicked(pos);
      setResults((r) => [...r, { id: current.id, chapter: current.chapter, correct }]);
      if (!correct) track("quiz_miss", current.id);
    },
    [started, picked, current]
  );

  const next = useCallback(() => {
    if (picked === null) return;
    setPicked(null);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      track("quiz_finish", `s${score}`);
    }
  }, [picked, index, questions.length, score]);

  const restart = () => {
    setQuestions(drawQuiz(COUNT));
    setIndex(0);
    setPicked(null);
    setResults([]);
    setStarted(true);
  };

  // Keep focus on the main action as the quiz moves along.
  useEffect(() => {
    const t = setTimeout(() => primaryRef.current?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(t);
  }, [started, index, picked, done]);

  // Keyboard: A-D or 1-4 to answer, Enter for next, Escape to close, Tab stays inside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && cardRef.current) {
        const items = cardRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
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
      if (!started || done || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toUpperCase();
      const pos = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : ["1", "2", "3", "4"].indexOf(k);
      if (pos >= 0 && picked === null) {
        e.preventDefault();
        answer(pos);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, started, done, picked, answer]);

  const missed = results.filter((r) => !r.correct);
  const missedChapters = Array.from(new Set(missed.map((r) => r.chapter)));
  const isCorrect = picked !== null && current && current.order[picked] === current.answer;
  const progress = started ? ((results.length) / questions.length) * 100 : 0;

  return (
    <div
      className={`quiz-backdrop ${closing ? "is-closing" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div ref={cardRef} className="quiz-card" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
        <header className="quiz-head">
          <Robot mood={done ? (score >= 7 ? "happy" : "cheer") : picked === null ? "idle" : isCorrect ? "happy" : "oops"} />
          <div className="quiz-head-text">
            <p id="quiz-title" className="quiz-name">
              Algo <span>· quiz bot</span>
            </p>
            <p className="quiz-sub">
              {!started ? "CSC207 Made Easy" : done ? "Quiz complete" : `Question ${index + 1} of ${questions.length}`}
            </p>
          </div>
          <button type="button" className="quiz-x" onClick={() => close()} aria-label="Close quiz">
            <X className="w-4 h-4" aria-hidden />
          </button>
        </header>
        <div className="quiz-progress" aria-hidden>
          <i style={{ width: `${done ? 100 : progress}%` }} />
        </div>

        <div className="quiz-body" aria-live="polite">
          {!started ? (
            <div className="quiz-step" key="intro">
              <p className="quiz-bubble">
                Hi! I&apos;m <b>Algo</b>{" "}🤖 Ready to test what you&apos;ve read?
              </p>
              <p className="quiz-bubble">
                <b>10 quick questions</b>{" "}from across the book. No calculations, no drawing: just pick A, B, C or D.
                I&apos;ll explain every answer.
              </p>
              <button ref={primaryRef} type="button" className="quiz-btn" onClick={() => setStarted(true)}>
                Start the quiz <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          ) : done ? (
            <div className="quiz-step quiz-result" key="done">
              <div className="quiz-score" aria-label={`You scored ${score} out of ${questions.length}`}>
                <span className="quiz-score-num">{score}</span>
                <span className="quiz-score-of">/ {questions.length}</span>
              </div>
              <p className="quiz-result-title">{verdict(score).title}</p>
              <p className="quiz-bubble">{verdict(score).line}</p>
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
                <button ref={primaryRef} type="button" className="quiz-btn" onClick={restart}>
                  <RotateCcw className="w-4 h-4" aria-hidden /> Try a fresh set
                </button>
                <button type="button" className="quiz-btn quiz-btn-ghost" onClick={() => close()}>
                  Back to reading
                </button>
              </div>
            </div>
          ) : current ? (
            <div className="quiz-step" key={current.id}>
              <p className="quiz-topic">
                {Number(current.chapter.slice(1))}. {TOPIC_LABELS[current.chapter] ?? current.chapter}
              </p>
              <p className="quiz-bubble quiz-q">{current.q}</p>
              <div className="quiz-options" role="group" aria-label="Answers">
                {current.order.map((optIndex, pos) => {
                  const isAnswer = optIndex === current.answer;
                  const state =
                    picked === null ? "" : isAnswer ? "is-right" : pos === picked ? "is-wrong" : "is-dim";
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
                        {picked !== null && isAnswer ? <Check className="w-3.5 h-3.5" aria-hidden /> : LETTERS[pos]}
                      </span>
                      <span>{current.options[optIndex]}</span>
                    </button>
                  );
                })}
              </div>

              {picked !== null ? (
                <div className={`quiz-feedback ${isCorrect ? "is-right" : "is-wrong"}`}>
                  <p className="quiz-feedback-title">
                    {isCorrect ? "Correct! 🎯" : `Not quite. The answer is ${LETTERS[current.order.indexOf(current.answer)]}.`}
                  </p>
                  <p>{current.explain}</p>
                  {!isCorrect ? (
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
              ) : (
                <p className="quiz-hint">Tap an answer, or press A–D.</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
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
