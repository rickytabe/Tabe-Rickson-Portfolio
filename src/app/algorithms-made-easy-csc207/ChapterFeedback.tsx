"use client";

import { useState } from "react";
import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { sendFeedback } from "./insights";

const STORE = "csc207-feedback";
type Saved = Record<string, { vote: "up" | "down"; noted?: boolean }>;

function load(): Saved {
  try {
    return JSON.parse(localStorage.getItem(STORE) || "{}") as Saved;
  } catch {
    return {};
  }
}
function save(chapter: string, entry: Saved[string]) {
  try {
    localStorage.setItem(STORE, JSON.stringify({ ...load(), [chapter]: entry }));
  } catch {
    // storage blocked: the vote is still sent, it just won't be remembered on this device
  }
}

/** "Was this chapter clear?" at the end of a chapter, with an optional private note. */
export default function ChapterFeedback({ chapter }: { chapter: string }) {
  const [state, setState] = useState(() => load()[chapter] ?? null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const vote = (v: "up" | "down") => {
    if (state?.vote === v) return;
    const next = { vote: v, noted: state?.noted };
    setState(next);
    save(chapter, next);
    void sendFeedback(chapter, v);
  };

  const sendNote = async () => {
    if (!state || !text.trim() || sending) return;
    setSending(true);
    await sendFeedback(chapter, state.vote, text.trim());
    const next = { ...state, noted: true };
    setState(next);
    save(chapter, next);
    setSending(false);
  };

  const prompt =
    state?.vote === "down"
      ? "What was confusing? Tell Tabe and it will get fixed."
      : "What helped most? (optional)";

  return (
    <div className="cf" aria-label="Chapter feedback">
      <div className="cf-row">
        <p className="cf-q">Was this chapter clear?</p>
        <div className="cf-votes" role="group" aria-label="Was this chapter clear?">
          <button
            type="button"
            className={`cf-btn ${state?.vote === "up" ? "is-on" : ""}`}
            aria-pressed={state?.vote === "up"}
            onClick={() => vote("up")}
          >
            <ThumbsUp className="w-4 h-4" aria-hidden /> Yes, it clicked
          </button>
          <button
            type="button"
            className={`cf-btn ${state?.vote === "down" ? "is-on is-down" : ""}`}
            aria-pressed={state?.vote === "down"}
            onClick={() => vote("down")}
          >
            <ThumbsDown className="w-4 h-4" aria-hidden /> Not quite
          </button>
        </div>
      </div>

      {state && !state.noted ? (
        <div className="cf-note" key={state.vote}>
          <label className="cf-label" htmlFor={`cf-${chapter}`}>
            {prompt}
          </label>
          <div className="cf-note-row">
            <textarea
              id={`cf-${chapter}`}
              className="cf-text"
              rows={2}
              maxLength={600}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={state.vote === "down" ? "e.g. the part about the frequency count lost me" : "Optional"}
            />
            <button type="button" className="cf-send" onClick={sendNote} disabled={!text.trim() || sending}>
              {sending ? "Sending" : "Send"}
            </button>
          </div>
          <p className="cf-fine">Anonymous. Only Tabe sees it.</p>
        </div>
      ) : null}

      {state?.noted ? (
        <p className="cf-thanks">
          <Check className="w-4 h-4" aria-hidden /> Thank you. Your note went straight to Tabe.
        </p>
      ) : null}
    </div>
  );
}
