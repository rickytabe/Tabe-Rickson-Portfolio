"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Loader2, Smartphone, X } from "lucide-react";
import { settled, track } from "./insights";

// Tips go through Fapshi's checkout (MTN Mobile Money or Orange Money), never a dial code.
// Keep in step with TIP_AMOUNTS in src/lib/fapshi.ts.
const TIP_AMOUNTS = [200, 500, 1000] as const;

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

/** True once a tip from this device has been confirmed by Fapshi. */
export function hasSupported(): boolean {
  return readStore()?.state === "supported";
}

/** Remember a confirmed tip on this device. */
export function markSupported() {
  writeStore("supported");
}

/** Start a file download from a click handler. */
export function startDownload(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

type Props = {
  /** The book being supported (sent with the tip). */
  bookId: string;
  onClose: () => void;
  /** "download": opened from a PDF download link, with a free download path. */
  mode?: "support" | "download";
  pdf?: string;
  /** The ask in this book's words. Defaults to CSC207 Made Easy's. */
  ask?: { title: string; text: string; download?: string };
  /** Open straight on the thank-you (back from checkout with a confirmed tip). */
  thanked?: boolean;
};

type View = "ask" | "thanks" | "free";

/** Rendered only while open: the reader mounts it, and it plays its own exit before calling onClose. */
export default function SupportModal({ bookId, onClose, mode = "support", pdf, ask, thanked = false }: Props) {
  const [closing, setClosing] = useState(false);
  const [view, setView] = useState<View>(thanked ? "thanks" : "ask");
  const isDownload = mode === "download";
  const [amount, setAmount] = useState<(typeof TIP_AMOUNTS)[number]>(200);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
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
    if (view === "ask") writeStore("later");
    close();
  }, [view, close]);

  // "I'd love to support, but..." : download straight away, no strings attached, and treat it as
  // "maybe later" so the timed prompt leaves them alone for a while.
  const downloadFree = () => {
    track("download_free");
    if (pdf) startDownload(pdf);
    writeStore("later");
    setView("free");
  };

  // Fapshi's hosted checkout: MTN or Orange Money, then back to the book (?tipped=1), where the
  // reader confirms the tip with Fapshi and shows the thank-you.
  const pay = async () => {
    if (paying) return;
    setPaying(true);
    setError("");
    track("tip_start", String(amount));
    try {
      await settled();
      const res = await fetch("/api/book/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: bookId, amount }),
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { link?: string; error?: string };
      if (!res.ok || !data.link) {
        throw new Error(
          res.status === 503 ? "Support isn't available right now. Thank you for wanting to help!" : data.error || "Couldn't open the checkout. Try again."
        );
      }
      window.location.assign(data.link);
    } catch (e) {
      setError((e as Error).message);
      setPaying(false);
    }
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
  }, [dismiss, view]);

  return (
    <div
      className={`support-backdrop ${closing ? "is-closing" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        ref={cardRef}
        className={`support-card ${view !== "ask" ? "is-thanked" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
        aria-describedby="support-desc"
      >
        <button type="button" className="support-x" onClick={dismiss} aria-label="Close">
          <X className="w-4 h-4" aria-hidden />
        </button>

        <Smiley grin={view !== "ask"} />

        {view === "ask" ? (
          <div className="support-body" key="ask">
            <p className="support-kicker">{isDownload ? "Your PDF is ready" : "Free for everyone. Always."}</p>
            <h2 id="support-title" className="support-title">
              {isDownload ? "Before you download, one small ask" : (ask?.title ?? "Did this book make algorithms click?")}
            </h2>
            <p id="support-desc" className="support-text">
              {isDownload && ask?.download ? (
                <>{ask.download}</>
              ) : isDownload ? (
                <>
                  The 68-page PDF is yours to keep, print and share, free. If it helps you pass, a small tip tells{" "}
                  <strong>Tabe</strong> it was worth it and helps the next free book get written.
                </>
              ) : ask ? (
                <>{ask.text}</>
              ) : (
                <>
                  CSC207 Made Easy is the whole course rewritten in plain English, with an illustration for every
                  chapter. No paywall, no ads. If it helped you, a small tip tells <strong>Tabe</strong> it was worth
                  it and helps the next free book get written.
                </>
              )}
            </p>

            <div className="support-amounts" role="radiogroup" aria-label="Tip amount">
              {TIP_AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={amount === a}
                  className={`support-amount ${amount === a ? "is-on" : ""}`}
                  onClick={() => setAmount(a)}
                >
                  {a} <small>FCFA</small>
                </button>
              ))}
            </div>

            <div className="support-actions">
              <button
                ref={firstRef}
                type="button"
                className="support-btn support-btn-primary support-btn-pay"
                onClick={pay}
                disabled={paying}
              >
                {paying ? <Loader2 className="w-4 h-4 quiz-spin" aria-hidden /> : <Smartphone className="w-4 h-4" aria-hidden />}
                {paying ? "Opening checkout…" : `Support with ${amount} FCFA`}
              </button>
            </div>
            <p className="support-hint">MTN Mobile Money or Orange Money. Confirm on your phone, then you come straight back.</p>
            {error ? (
              <p className="support-error" role="alert">
                {error}
              </p>
            ) : null}

            {isDownload ? (
              <button type="button" className="support-free" onClick={downloadFree}>
                <span className="support-free-main">I&apos;d love to support, but I don&apos;t have money right now</span>
                <span className="support-free-sub">
                  <Download className="w-3.5 h-3.5" aria-hidden />
                  Download free
                </span>
              </button>
            ) : (
              <>
                <button type="button" className="support-later" onClick={dismiss}>
                  Maybe later, keep reading
                </button>
                <p className="support-fine">Completely optional. The book stays free either way.</p>
              </>
            )}
          </div>
        ) : view === "thanks" ? (
          <div className="support-body" key="thanks" aria-live="polite">
            <p className="support-kicker">You are a star</p>
            <h2 id="support-title" className="support-title">
              Thank you, truly.
            </h2>
            <p id="support-desc" className="support-text">
              Your support goes straight to Tabe and into the next free solutions. Good luck in the exam, you have got
              this.
            </p>
            <div className="support-actions">
              {pdf ? (
                <button
                  ref={firstRef}
                  type="button"
                  className="support-btn support-btn-primary"
                  onClick={() => {
                    track("download_supported");
                    startDownload(pdf);
                    close();
                  }}
                >
                  <Download className="w-4 h-4" aria-hidden />
                  Download the PDF
                </button>
              ) : (
                <button ref={firstRef} type="button" className="support-btn support-btn-primary" onClick={close}>
                  Back to reading
                </button>
              )}
            </div>
            {pdf ? (
              <button type="button" className="support-later" onClick={close}>
                Back to reading
              </button>
            ) : null}
          </div>
        ) : (
          <div className="support-body" key="free" aria-live="polite">
            <p className="support-kicker">No worries at all</p>
            <h2 id="support-title" className="support-title">
              It&apos;s yours. Go ace that CA.
            </h2>
            <p id="support-desc" className="support-text">
              Your download has started. Want to help anyway? Share the book with a classmate who is struggling,
              that means a lot too.
            </p>
            <div className="support-actions">
              <button ref={firstRef} type="button" className="support-btn support-btn-primary" onClick={close}>
                Back to reading
              </button>
            </div>
            {pdf ? (
              <p className="support-fine">
                Download didn&apos;t start?{" "}
                <a href={pdf} download className="support-link">
                  Try again
                </a>
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/** The book's smiley: smiles while asking, grins (with sparks) when thanking. */
export function Smiley({ grin, size = 76, className = "" }: { grin: boolean; size?: number; className?: string }) {
  return (
    <div
      className={`support-smiley ${grin ? "is-grin" : ""} ${className}`}
      style={size === 76 ? undefined : { width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 96 96" width={size} height={size}>
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
