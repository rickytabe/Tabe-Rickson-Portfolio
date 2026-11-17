"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Phone, X } from "lucide-react";

// MTN Mobile Money (Cameroon) transfer to Tabe. The last number before # is the amount in FCFA.
export const SUPPORT_CODE = "*126*1*1*681110631*200#";
const SUPPORT_TEL = "tel:" + SUPPORT_CODE.replace(/#/g, "%23");

const STORE_KEY = "csc207-support";
const LATER_DAYS = 30;

type Stored = { state: "later" | "supported"; at: number };

function readStore(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function writeStore(state: Stored["state"]) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ state, at: Date.now() }));
  } catch {
    // private mode or blocked storage: the prompt may simply show again next visit
  }
}

/** Whether the prompt may open by itself: never after support, and not within 30 days of "later". */
export function mayAutoPrompt(): boolean {
  const s = readStore();
  if (!s) return true;
  if (s.state === "supported") return false;
  return Date.now() - s.at > LATER_DAYS * 24 * 60 * 60 * 1000;
}

type Props = { onClose: () => void };

/** Rendered only while open: the reader mounts it, and it plays its own exit before calling onClose. */
export default function SupportModal({ onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [thanked, setThanked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canDial] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    if (closeTimer.current) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      onClose();
      opener?.focus?.({ preventScroll: true });
    }, 220);
  }, [onClose, opener]);

  const dismiss = useCallback(() => {
    if (!thanked) writeStore("later");
    close();
  }, [thanked, close]);

  const markSupported = () => {
    writeStore("supported");
    setThanked(true);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Lock page scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus the main action, trap Tab inside the dialog, close on Escape.
  useEffect(() => {
    const focusTimer = setTimeout(() => firstRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;
      const items = cardRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
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
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
    };
  }, [dismiss, thanked]);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(SUPPORT_CODE);
      ok = true;
    } catch {
      // older browsers: fall back to a hidden textarea
      const ta = document.createElement("textarea");
      ta.value = SUPPORT_CODE;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (ok) {
      setCopied(true);
      setTimeout(markSupported, 900);
    }
  };

  return (
    <div
      className={`support-backdrop ${closing ? "is-closing" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        ref={cardRef}
        className={`support-card ${thanked ? "is-thanked" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
        aria-describedby="support-desc"
      >
        <button type="button" className="support-x" onClick={dismiss} aria-label="Close">
          <X className="w-4 h-4" aria-hidden />
        </button>

        <Smiley grin={thanked} />

        {!thanked ? (
          <div className="support-body" key="ask">
            <p className="support-kicker">Free for everyone. Always.</p>
            <h2 id="support-title" className="support-title">
              Did this book make algorithms click?
            </h2>
            <p id="support-desc" className="support-text">
              CSC207 Made Easy is the whole course rewritten in plain English, with an illustration for every
              chapter. No paywall, no ads. If it helped you, a small tip tells <strong>Tabe</strong> it was worth it
              and helps the next free book get written.
            </p>

            <div className="support-code">
              <span className="support-code-label">Dial on your MTN phone</span>
              <code className="support-code-value" aria-label={`Mobile Money code ${SUPPORT_CODE}`}>
                {SUPPORT_CODE}
              </code>
              <span className="support-code-meta">
                Sends <b>200 FCFA</b> to <b>Tabe</b> with MTN Mobile Money
              </span>
            </div>

            <div className="support-actions">
              {canDial ? (
                <a href={SUPPORT_TEL} className="support-btn support-btn-primary" onClick={markSupported}>
                  <Phone className="w-4 h-4" aria-hidden />
                  Dial now
                </a>
              ) : null}
              <button
                ref={firstRef}
                type="button"
                className={`support-btn ${canDial ? "support-btn-ghost" : "support-btn-primary"}`}
                onClick={copy}
              >
                {copied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>

            <p className="support-hint">Want to give a different amount? Change the 200 before you dial.</p>

            <button type="button" className="support-later" onClick={dismiss}>
              Maybe later, keep reading
            </button>
            <p className="support-fine">Completely optional. The book stays free either way.</p>
          </div>
        ) : (
          <div className="support-body" key="thanks" aria-live="polite">
            <p className="support-kicker">You are a star</p>
            <h2 id="support-title" className="support-title">
              Thank you, truly.
            </h2>
            <p id="support-desc" className="support-text">
              Your support goes straight to Tabe and into the next free book. Good luck in the exam, you have got
              this.
            </p>
            <div className="support-actions">
              <button ref={firstRef} type="button" className="support-btn support-btn-primary" onClick={close}>
                Back to reading
              </button>
            </div>
            <p className="support-fine">
              Didn&apos;t get to dial yet? The code is <code>{SUPPORT_CODE}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Smiley({ grin }: { grin: boolean }) {
  return (
    <div className={`support-smiley ${grin ? "is-grin" : ""}`} aria-hidden>
      <svg viewBox="0 0 96 96" width="76" height="76">
        <circle cx="48" cy="48" r="44" className="sm-face" />
        <g className="sm-eyes">
          <ellipse cx="34" cy="40" rx="5" ry="6.5" className="sm-eye" />
          <ellipse cx="62" cy="40" rx="5" ry="6.5" className="sm-eye" />
        </g>
        <circle cx="25" cy="56" r="6" className="sm-cheek" />
        <circle cx="71" cy="56" r="6" className="sm-cheek" />
        {grin ? (
          <path d="M28 55 Q48 80 68 55 Z" className="sm-grin" />
        ) : (
          <path d="M31 58 Q48 72 65 58" className="sm-smile" />
        )}
      </svg>
      <span className="sm-spark sm-spark-1" />
      <span className="sm-spark sm-spark-2" />
      <span className="sm-spark sm-spark-3" />
      <span className="sm-spark sm-spark-4" />
    </div>
  );
}
