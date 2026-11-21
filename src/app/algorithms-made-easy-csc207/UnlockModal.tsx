"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, KeyRound, Loader2, MessageCircle, Phone, Share2, Smartphone, Users, X } from "lucide-react";
import { settled, track } from "./insights";
import { Smiley } from "./SupportModal";

// MTN Mobile Money (Cameroon) transfer to Tabe, with the unlock price as the amount.
const momoCode = (price: number) => `*126*1*1*681110631*${price}#`;
const WHATSAPP = "237671353341";

export type UnlockStatus = {
  unlocked: boolean;
  via: "code" | "invite" | "payment" | null;
  /** Whether instant Mobile Money checkout is switched on (Fapshi keys set). */
  pay: boolean;
  invite: { link: string; count: number; needed: number };
};

type Props = {
  book: { id: string; title: string; priceFcfa: number; lockedCount: number; freeSections: number };
  status: UnlockStatus | null;
  /** Open straight on the "enter your code" step. */
  startWithCode?: boolean;
  onUnlocked: () => void;
  onClose: () => void;
};

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

/** The unlock sheet for a paid book: pay with Mobile Money and enter the code, or invite classmates. */
export default function UnlockModal({ book, status, startWithCode = false, onUnlocked, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [redeemed, setDone] = useState(false);
  // Unlocked here (a code), or found unlocked by the reader (a payment that just confirmed).
  const done = redeemed || !!status?.unlocked;
  const [copied, setCopied] = useState<"momo" | "link" | null>(null);
  const [canDial] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  const cardRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const momo = momoCode(book.priceFcfa);
  const invite = status?.invite;
  const canPay = !!status?.pay;
  const [paying, setPaying] = useState(false);

  // Instant checkout: Fapshi's page takes MTN or Orange Money, then sends the reader back here,
  // where the book checks the payment with Fapshi and unlocks.
  const payNow = async () => {
    if (paying) return;
    setPaying(true);
    setError("");
    track("pay_start");
    try {
      await settled();
      const res = await fetch("/api/book/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: book.id }),
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { link?: string; unlocked?: boolean; error?: string };
      if (data.unlocked) {
        setDone(true);
        onUnlocked();
        return;
      }
      if (!res.ok || !data.link) throw new Error(data.error || "Couldn't start the payment. Try again.");
      window.location.assign(data.link);
    } catch (e) {
      setError((e as Error).message);
      setPaying(false);
    }
  };

  const close = useCallback(() => {
    if (closeTimer.current) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      onClose();
      opener?.focus?.({ preventScroll: true });
    }, 220);
  }, [onClose, opener]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus, Tab trap and Escape, as in the support prompt.
  useEffect(() => {
    const t = setTimeout(() => {
      if (startWithCode && !done) codeRef.current?.focus({ preventScroll: true });
      else firstRef.current?.focus({ preventScroll: true });
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;
      const items = cardRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
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
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [close, startWithCode, done]);

  useEffect(() => {
    if (startWithCode) codeRef.current?.scrollIntoView({ block: "center" });
  }, [startWithCode]);

  const flash = (what: "momo" | "link") => {
    setCopied(what);
    setTimeout(() => setCopied(null), 1600);
  };

  const redeem = async () => {
    if (busy || code.replace(/[^0-9a-z]/gi, "").length < 8) return;
    setBusy(true);
    setError("");
    try {
      await settled();
      const res = await fetch("/api/book/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: book.id, code }),
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "That code didn't work. Try again.");
      setDone(true);
      onUnlocked();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const waText = encodeURIComponent(
    `Hi Tabe, I just paid ${book.priceFcfa} FCFA to unlock ${book.title}. Here is my payment screenshot:`
  );
  const inviteText = invite
    ? encodeURIComponent(
        `I'm revising CSC211 with this: every tutorial question solved step by step, free to start. ${invite.link}`
      )
    : "";

  return (
    <div
      className={`support-backdrop ${closing ? "is-closing" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={cardRef}
        className={`support-card unlock-card ${done ? "is-thanked" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-title"
      >
        <button type="button" className="support-x" onClick={close} aria-label="Close">
          <X className="w-4 h-4" aria-hidden />
        </button>

        {done ? (
          <div className="support-body" key="done" aria-live="polite">
            <Smiley grin />
            <p className="support-kicker">{status?.via === "invite" ? "You and your classmates" : "You are a star"}</p>
            <h2 id="unlock-title" className="support-title">
              Thank you, truly.
            </h2>
            <p className="support-text">
              {status?.via === "invite" ? (
                <>
                  Sharing the book with your classmates means a lot. Every solution is now open for you, free.
                </>
              ) : (
                <>
                  Your support goes straight to <strong>Tabe</strong> and keeps new solutions coming before every CA.
                  It really means a lot.
                </>
              )}
            </p>
            <p className="support-text unlock-done-note">
              <Check className="w-4 h-4" aria-hidden /> All {book.lockedCount} solutions are open on this device and
              stay open when you come back.
            </p>
            <div className="support-actions">
              <button ref={firstRef} type="button" className="support-btn support-btn-primary" onClick={close}>
                Back to the solutions
              </button>
            </div>
            <p className="support-fine">Good luck in the CA. You&apos;ve got this.</p>
          </div>
        ) : (
          <div className="support-body" key="offer">
            <div className="unlock-badge" aria-hidden>
              <KeyRound className="w-7 h-7" />
            </div>
            <p className="support-kicker">Questions 1 to {book.freeSections} are free</p>
            <h2 id="unlock-title" className="support-title">
              Unlock all {book.lockedCount} worked solutions
            </h2>
            <p className="support-text">
              One payment of <strong>{book.priceFcfa} FCFA</strong> opens every remaining solution for good. Or invite{" "}
              {invite?.needed ?? 3} classmates and unlock it free.
            </p>

            {canPay ? (
              <div className="unlock-pay">
                <button
                  ref={firstRef}
                  type="button"
                  className="support-btn support-btn-primary unlock-pay-btn"
                  onClick={payNow}
                  disabled={paying}
                >
                  {paying ? <Loader2 className="w-4 h-4 quiz-spin" aria-hidden /> : <Smartphone className="w-4 h-4" aria-hidden />}
                  {paying ? "Opening checkout…" : `Pay ${book.priceFcfa} FCFA`}
                </button>
                <p className="unlock-step-text unlock-pay-note">
                  MTN Mobile Money or Orange Money. Confirm on your phone and the solutions open straight away.
                </p>
                {error && !code ? (
                  <p className="unlock-error" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
            ) : null}

            <details className="unlock-manual" open={!canPay || startWithCode}>
              {canPay ? (
                <summary>
                  Paid Tabe directly, or have a code? <ChevronDown className="w-4 h-4" aria-hidden />
                </summary>
              ) : null}
            <ol className="unlock-steps">
              <li>
                <span className="unlock-step-n">1</span>
                <div>
                  <p className="unlock-step-title">Send {book.priceFcfa} FCFA with MTN Mobile Money</p>
                  <div className="support-code unlock-code">
                    <code className="support-code-value" aria-label={`Mobile Money code ${momo}`}>
                      {momo}
                    </code>
                    <span className="support-code-meta">
                      Goes to <b>Tabe</b>. On Orange Money? Message Tabe on WhatsApp instead.
                    </span>
                  </div>
                  <div className="support-actions">
                    {canDial ? (
                      <a
                        href={"tel:" + momo.replace(/#/g, "%23")}
                        className="support-btn support-btn-primary"
                        onClick={() => track("unlock_dial")}
                      >
                        <Phone className="w-4 h-4" aria-hidden /> Dial now
                      </a>
                    ) : null}
                    <button
                      ref={canPay ? undefined : firstRef}
                      type="button"
                      className={`support-btn ${canDial || canPay ? "support-btn-ghost" : "support-btn-primary"}`}
                      onClick={async () => {
                        if (await copyText(momo)) {
                          track("unlock_copy");
                          flash("momo");
                        }
                      }}
                    >
                      {copied === "momo" ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
                      {copied === "momo" ? "Copied" : "Copy code"}
                    </button>
                  </div>
                </div>
              </li>
              <li>
                <span className="unlock-step-n">2</span>
                <div>
                  <p className="unlock-step-title">Send Tabe the payment screenshot</p>
                  <p className="unlock-step-text">Tabe replies on WhatsApp with your unlock code.</p>
                  <a
                    className="support-btn support-btn-ghost unlock-wa"
                    href={`https://wa.me/${WHATSAPP}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("unlock_whatsapp")}
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden /> Open WhatsApp
                  </a>
                </div>
              </li>
              <li>
                <span className="unlock-step-n">3</span>
                <form
                  className="unlock-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void redeem();
                  }}
                >
                  <label className="unlock-step-title" htmlFor="unlock-code-input">
                    Enter your unlock code
                  </label>
                  <div className="unlock-form-row">
                    <input
                      ref={codeRef}
                      id="unlock-code-input"
                      className="unlock-input"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="K7P2-XQ9M"
                      autoComplete="one-time-code"
                      autoCapitalize="characters"
                      spellCheck={false}
                      maxLength={12}
                      aria-invalid={!!error}
                      aria-describedby={error ? "unlock-error" : undefined}
                    />
                    <button
                      type="submit"
                      className="support-btn support-btn-primary"
                      disabled={busy || code.replace(/[^0-9a-z]/gi, "").length < 8}
                    >
                      {busy ? <Loader2 className="w-4 h-4 quiz-spin" aria-hidden /> : null} Unlock
                    </button>
                  </div>
                  {error ? (
                    <p className="unlock-error" id="unlock-error" role="alert">
                      {error}
                    </p>
                  ) : null}
                </form>
              </li>
            </ol>
            </details>

            <div className="unlock-or" role="separator">
              <span>or unlock free</span>
            </div>

            <div className="unlock-invite">
              <p className="unlock-step-title">
                <Users className="w-4 h-4" aria-hidden /> Invite {invite?.needed ?? 3} classmates
              </p>
              <p className="unlock-step-text">
                Share your link. Each classmate counts once they open it on their own phone and read 3 questions.
              </p>
              {invite ? (
                <>
                  <div
                    className="unlock-meter"
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={invite.needed}
                    aria-valuenow={invite.count}
                    aria-label={`${invite.count} of ${invite.needed} classmates`}
                  >
                    {Array.from({ length: invite.needed }, (_, i) => (
                      <span key={i} className={i < invite.count ? "is-on" : undefined} />
                    ))}
                    <b>
                      {invite.count} / {invite.needed}
                    </b>
                  </div>
                  <div className="support-actions">
                    <a
                      className="support-btn support-btn-ghost"
                      href={`https://wa.me/?text=${inviteText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("invite_share", "whatsapp")}
                    >
                      <Share2 className="w-4 h-4" aria-hidden /> Share on WhatsApp
                    </a>
                    <button
                      type="button"
                      className="support-btn support-btn-ghost"
                      onClick={async () => {
                        if (await copyText(invite.link)) {
                          track("invite_share", "copy");
                          flash("link");
                        }
                      }}
                    >
                      {copied === "link" ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
                      {copied === "link" ? "Copied" : "Copy link"}
                    </button>
                  </div>
                </>
              ) : (
                <p className="unlock-step-text">
                  <Loader2 className="w-4 h-4 quiz-spin" aria-hidden /> Getting your link…
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
