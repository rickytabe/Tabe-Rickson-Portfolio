"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, ChevronDown, Download, KeyRound, List, Lock, Smile, X } from "lucide-react";
import SupportModal, { hasSupported, mayAutoPrompt } from "./SupportModal";
import UnlockModal, { type UnlockStatus } from "./UnlockModal";
import ViewCount from "./ViewCount";
import FigureLightbox from "./FigureLightbox";
import ChapterFeedback from "./ChapterFeedback";
import QuizBot, { Robot, type QuizBook } from "./QuizBot";
import { setBook, settled, track } from "./insights";

export type BookSubtopic = { id: string; title: string };
/** `tag` replaces the zero-padded number in the sidebar ("B30"); `locked` marks a paid solution. */
export type BookChapter = {
  id: string;
  num: number;
  title: string;
  subs: BookSubtopic[];
  tag?: string;
  locked?: boolean;
};
export type BookPart = { name: string; chapters: BookChapter[] };

/** Everything the reader needs to know about its book. Plain data, from the server page. */
export type ReaderBook = {
  id: string;
  title: string;
  path: string;
  quiz: Omit<QuizBook, "help">;
  feedback: { noun: string; example: string };
  /** Paid books: the solutions after `freeSections` unlock. */
  paywall?: { priceFcfa: number; freeSections: number; lockedCount: number; invitesNeeded: number };
};

type Props = {
  book: ReaderBook;
  parts: BookPart[];
  pdf?: string;
  className?: string;
  /** The paragraph under the book's title in the footer. */
  about: React.ReactNode;
  /** Small print at the very end. */
  credits: React.ReactNode;
  children: React.ReactNode;
};

export default function BookReader({ book, parts, pdf, className = "", about, credits, children }: Props) {
  setBook(book.id);
  const paid = !!book.paywall;
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMode, setSupportMode] = useState<"support" | "download">("support");
  const [showFab, setShowFab] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizSource, setQuizSource] = useState<"fab" | "sidebar" | "link">("fab");
  const autoPrompted = useRef(false);
  const [minuteRead, setMinuteRead] = useState(false);
  const [viewsSlot, setViewsSlot] = useState<HTMLElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [feedbackSlots, setFeedbackSlots] = useState<HTMLElement[]>([]);
  const [lockSlots, setLockSlots] = useState<HTMLElement[]>([]);
  const [unlock, setUnlock] = useState<UnlockStatus | null>(null);
  const [solutions, setSolutions] = useState<Record<string, string> | null>(null);
  const [unlockOpen, setUnlockOpen] = useState<false | "offer" | "code">(false);
  const unlocked = !!unlock?.unlocked;

  const chapters = parts.flatMap((p) => p.chapters);
  const activeChapter = chapters.find((c) => c.id === active);

  // Track the site navbar's height so the reading bar and sidebar sit right under it.
  useEffect(() => {
    const nav = document.getElementById("main-navbar");
    const root = rootRef.current;
    if (!nav || !root) return;
    const set = () => root.style.setProperty("--nav-h", `${nav.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  // Reading progress, back-to-top, and which chapter is being read.
  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
      setShowTop(h.scrollTop > 800);
      setShowFab(h.scrollTop > 500);

      const line = (barRef.current?.getBoundingClientRect().bottom ?? 120) + 80;
      let current: string | null = null;
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= line) current = sec.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // chapters come from static props; recomputing on every render is unnecessary
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the active chapter visible inside the sidebar list without scrolling the page.
  const reveal = useCallback((container: HTMLElement | null) => {
    if (!container || !active) return;
    const link = container.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!link) return;
    const top = link.offsetTop;
    const bottom = top + link.offsetHeight;
    if (top < container.scrollTop + 48) container.scrollTop = top - 48;
    else if (bottom > container.scrollTop + container.clientHeight - 48)
      container.scrollTop = bottom - container.clientHeight + 48;
  }, [active]);

  useEffect(() => reveal(sideRef.current), [reveal]);

  // Drawer: lock page scroll, close on Escape, focus the current chapter.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    reveal(drawerRef.current);
    const current = drawerRef.current?.querySelector<HTMLElement>('a[aria-current="true"]')
      ?? drawerRef.current?.querySelector<HTMLElement>("a");
    current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, reveal]);

  // Close the drawer if the window grows to the sidebar layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setDrawerOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // The view count lives in the stats row inside the book's HTML; render it there with a portal.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setViewsSlot(document.querySelector<HTMLElement>("[data-book-views]"));
      setPortalTarget(document.body);
      setFeedbackSlots(Array.from(document.querySelectorAll<HTMLElement>(".ch-feedback[data-chapter]")));
      setLockSlots(Array.from(document.querySelectorAll<HTMLElement>(".sol-lock[data-q] .sol-lock-slot")));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // ?quiz=1 (from taberickson.com/csc207/quiz) opens Algo straight away. Drop just that parameter
  // from the address bar so a refresh doesn't reopen it; ?ref= stays for the reading stats.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("quiz")) return;
    autoPrompted.current = true; // don't stack the support prompt on top of the quiz
    url.searchParams.delete("quiz");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    const frame = requestAnimationFrame(() => {
      setQuizSource("link");
      setQuizOpen(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Paid books: whether this reader has unlocked, their invite progress, and the solutions once
  // unlocked. Checked again when the reader comes back to the tab (an invite may have counted).
  const refreshUnlock = useCallback(async () => {
    if (!paid) return;
    try {
      await settled();
      const res = await fetch(`/api/book/unlock?book=${book.id}`, { credentials: "same-origin" });
      if (!res.ok) return;
      const status = (await res.json()) as UnlockStatus;
      setUnlock(status);
      if (status.unlocked) {
        const sol = await fetch(`/api/book/solutions?book=${book.id}`, { credentials: "same-origin" });
        if (sol.ok) setSolutions(((await sol.json()) as { solutions: Record<string, string> }).solutions);
      }
    } catch {
      // offline: the lock cards stay, and the next visit tries again
    }
  }, [paid, book.id]);

  useEffect(() => {
    if (!paid) return;
    const frame = requestAnimationFrame(() => void refreshUnlock());
    const onVisible = () => {
      if (document.visibilityState === "visible" && !unlocked) void refreshUnlock();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [paid, unlocked, refreshUnlock]);

  // Once the solutions arrive, hide the blurred placeholders they replace.
  useEffect(() => {
    if (!solutions) return;
    for (const slot of lockSlots) {
      if (solutions[slot.parentElement?.dataset.q ?? ""]) slot.parentElement?.classList.add("is-open");
    }
  }, [solutions, lockSlots]);

  const openUnlock = useCallback((source: string, step: "offer" | "code" = "offer") => {
    autoPrompted.current = true;
    track("unlock_shown", source);
    setDrawerOpen(false);
    setUnlockOpen(step);
  }, []);

  // Count one minute of actual reading: time only passes while the tab is visible.
  // Paid books don't ask for a tip: their lock cards already make the one ask.
  useEffect(() => {
    if (paid || !mayAutoPrompt()) return;
    let seconds = 0;
    const tick = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds += 1;
      if (seconds >= 60) {
        clearInterval(tick);
        setMinuteRead(true);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [paid]);

  // Ask for support once that minute is up (never on arrival). If the contents drawer or the
  // prompt is already open, wait until it closes.
  useEffect(() => {
    if (!minuteRead || autoPrompted.current || drawerOpen || supportOpen) return;
    autoPrompted.current = true;
    track("support_shown", "timer");
    setSupportMode("support");
    setSupportOpen(true);
  }, [minuteRead, drawerOpen, supportOpen]);

  // Reading stats: which chapters each reader reaches, and whether they reach the end.
  useEffect(() => {
    if (active) track("reach", active);
  }, [active]);

  useEffect(() => {
    const foot = document.querySelector(".book-foot");
    if (!foot) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track("end");
        io.disconnect();
      }
    });
    io.observe(foot);
    return () => io.disconnect();
  }, []);

  // Opening the prompt by hand also counts as "asked", so the one-minute prompt won't follow.
  const openSupport = useCallback((mode: "support" | "download", source: string) => {
    autoPrompted.current = true;
    track("support_shown", source);
    setDrawerOpen(false);
    setSupportMode(mode);
    setSupportOpen(true);
  }, []);

  // PDF downloads inside the book go through the prompt, which always offers a free download.
  // Readers who already supported download straight away.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.<HTMLAnchorElement>('.book a[download][href$=".pdf"]');
      if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (hasSupported()) {
        track("download_direct");
        return;
      }
      e.preventDefault();
      openSupport("download", "download");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openSupport]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const contents = (where: "side" | "drawer", onPick?: () => void) => (
    <>
      {parts.map((part) => (
        <div key={part.name} className="book-toc-part">
          <p className="book-toc-label">{part.name}</p>
          <ol>
            {part.chapters.map((c) => {
              const isActive = c.id === active;
              const hasSubs = c.subs.length > 0;
              // Subtopics show for the chapter being read, or when opened with the chevron.
              const isOpen = hasSubs && (isActive || expanded.has(c.id));
              const subsId = `${where}-${c.id}-subs`;
              return (
                <li key={c.id} className={hasSubs ? "has-subs" : undefined}>
                  <div className="book-toc-row">
                    <a
                      href={`#${c.id}`}
                      onClick={onPick}
                      aria-current={isActive ? "true" : undefined}
                      className={isActive ? "is-active" : undefined}
                    >
                      <span className="book-toc-num">{c.tag ?? String(c.num).padStart(2, "0")}</span>
                      <span>{c.title}</span>
                      {c.locked && !unlocked ? <Lock className="book-toc-lock" aria-label="locked" /> : null}
                    </a>
                    {hasSubs ? (
                      <button
                        type="button"
                        className={`book-toc-toggle ${isOpen ? "is-open" : ""}`}
                        onClick={() => toggle(c.id)}
                        aria-expanded={isOpen}
                        aria-controls={subsId}
                        aria-label={`${isOpen ? "Hide" : "Show"} topics in ${c.title}`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" aria-hidden />
                      </button>
                    ) : null}
                  </div>
                  {hasSubs ? (
                    <div className={`book-toc-subs ${isOpen ? "is-open" : ""}`} id={subsId}>
                      <ul inert={!isOpen}>
                        {c.subs.map((sub) => (
                          <li key={sub.id}>
                            <a href={`#${sub.id}`} onClick={onPick}>
                              {sub.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
      <div className="book-toc-extra">
        {pdf ? (
          <a href={pdf} download className="book-toc-pdf">
            <Download className="w-3.5 h-3.5" aria-hidden />
            Download the PDF
          </a>
        ) : null}
        <button
          type="button"
          className="book-toc-support book-toc-quiz"
          onClick={() => {
            onPick?.();
            setDrawerOpen(false);
            setQuizSource("sidebar");
            setQuizOpen(true);
          }}
        >
          <Robot size={16} />
          Quiz me
        </button>
        {paid ? (
          unlocked ? null : (
            <button
              type="button"
              className="book-toc-support book-toc-unlock"
              onClick={() => {
                onPick?.();
                openUnlock("sidebar");
              }}
            >
              <KeyRound className="w-3.5 h-3.5" aria-hidden />
              Unlock all solutions
            </button>
          )
        ) : (
          <button
            type="button"
            className="book-toc-support"
            onClick={() => {
              onPick?.();
              openSupport("support", "sidebar");
            }}
          >
            <Smile className="w-3.5 h-3.5" aria-hidden />
            Support this book
          </button>
        )}
      </div>
    </>
  );

  return (
    <div ref={rootRef} className={`book ${className}`}>
      {/* Reading bar: sits under the site navbar */}
      <div ref={barRef} className="book-bar">
        <div className="book-bar-in">
          <button
            type="button"
            className="book-bar-btn"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-expanded={drawerOpen}
            aria-controls="book-drawer"
          >
            {drawerOpen ? <X className="w-4 h-4" aria-hidden /> : <List className="w-4 h-4" aria-hidden />}
            Contents
          </button>
          <nav className="book-crumbs" aria-label="Breadcrumb">
            <Link href="/books">Books</Link>
            <span aria-hidden>/</span>
            <a href="#top">{book.title}</a>
          </nav>
          <p className="book-bar-chapter" aria-live="polite">
            {activeChapter ? (
              <>
                <span className="book-bar-num">
                  {activeChapter.tag ?? String(activeChapter.num).padStart(2, "0")}
                </span>
                <span className="book-bar-title">{activeChapter.title}</span>
              </>
            ) : null}
          </p>
          <span className="book-bar-pct">{Math.round(progress)}%</span>
        </div>
        <div className="book-progress" aria-hidden>
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="book-layout" id="top">
        <aside ref={sideRef} className="book-side" aria-label="Contents">
          <p className="book-side-head">Contents</p>
          {contents("side")}
        </aside>

        <div className="book-main">
          {children}
          <footer className="book-foot">
            <h2>{book.title}</h2>
            <p>{about}</p>
            <div className="book-foot-links">
              {pdf ? (
                <a href={pdf} download>
                  <Download className="w-4 h-4" aria-hidden /> Download the PDF
                </a>
              ) : null}
              {paid ? (
                unlocked ? null : (
                  <button type="button" onClick={() => openUnlock("footer")}>
                    <KeyRound className="w-4 h-4" aria-hidden /> Unlock all solutions
                  </button>
                )
              ) : (
                <button type="button" onClick={() => openSupport("support", "footer")}>
                  <Smile className="w-4 h-4" aria-hidden /> Support this book
                </button>
              )}
              <Link href="/books">More books &rarr;</Link>
            </div>
            <p className="book-foot-credit">
              Anonymous reading stats and {book.feedback.noun} feedback help improve this book. No names or personal
              details are collected.
            </p>
            {credits}
          </footer>
        </div>
      </div>

      {/* Drawer, below the sidebar breakpoint */}
      <div
        className={`book-scrim lg:hidden ${drawerOpen ? "is-on" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />
      <nav
        ref={drawerRef}
        id="book-drawer"
        className={`book-drawer lg:hidden ${drawerOpen ? "is-open" : ""}`}
        aria-label="Contents"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <p className="book-side-head">Contents</p>
        {contents("drawer", () => setDrawerOpen(false))}
      </nav>

      <button
        type="button"
        className={`book-top ${showTop && !drawerOpen && !supportOpen && !quizOpen && !unlockOpen ? "is-on" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" aria-hidden />
      </button>

      {paid ? (
        unlocked ? null : (
          <button
            type="button"
            className={`book-fab book-fab-unlock ${showFab && !drawerOpen && !quizOpen && !unlockOpen ? "is-on" : ""}`}
            onClick={() => openUnlock("fab")}
            aria-label="Unlock all solutions"
          >
            <KeyRound className="book-fab-icon" aria-hidden />
            <span>Unlock</span>
          </button>
        )
      ) : (
        <button
          type="button"
          className={`book-fab ${showFab && !drawerOpen && !supportOpen && !quizOpen ? "is-on" : ""}`}
          onClick={() => openSupport("support", "fab")}
          aria-label="Support this book"
        >
          <Smile className="book-fab-icon" aria-hidden />
          <span>Support</span>
        </button>
      )}

      <button
        type="button"
        className={`book-quiz-fab ${
          showFab && !drawerOpen && !supportOpen && !quizOpen && !unlockOpen ? "is-on" : ""
        } ${
          showTop ? "is-raised" : ""
        }`}
        onClick={() => {
          setDrawerOpen(false);
          setQuizSource("fab");
          setQuizOpen(true);
        }}
        aria-label="Quiz me: test what you've read"
      >
        <Robot size={26} />
        <span>Quiz me</span>
      </button>

      {/* Overlays render at the top of the page: inside .book they would sit under the site
          navbar, because .book is its own stacking layer. The wrapper carries the book's
          colour tokens and fonts. */}
      {portalTarget
        ? createPortal(
            <div className={`book-portal ${className}`}>
              <FigureLightbox />
              {quizOpen ? (
                <QuizBot
                  book={{ ...book.quiz, help: quizHelp(book, unlocked) }}
                  source={quizSource}
                  onSupport={() => (paid ? openUnlock("quiz") : openSupport("support", "quiz"))}
                  onClose={() => setQuizOpen(false)}
                  onReadChapter={(id) =>
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                />
              ) : null}
              {supportOpen ? (
                <SupportModal mode={supportMode} pdf={pdf} onClose={() => setSupportOpen(false)} />
              ) : null}
              {unlockOpen && book.paywall ? (
                <UnlockModal
                  book={{ id: book.id, title: book.title, ...book.paywall }}
                  status={unlock}
                  startWithCode={unlockOpen === "code"}
                  onUnlocked={() => void refreshUnlock()}
                  onClose={() => setUnlockOpen(false)}
                />
              ) : null}
            </div>,
            portalTarget
          )
        : null}
      {feedbackSlots
        .filter((slot) => !slot.dataset.locked || solutions?.[slot.dataset.chapter!])
        .map((slot) =>
          createPortal(
            <ChapterFeedback
              chapter={slot.dataset.chapter!}
              book={book.id}
              noun={book.feedback.noun}
              example={book.feedback.example}
            />,
            slot,
            slot.dataset.chapter
          )
        )}
      {book.paywall
        ? lockSlots.map((slot) => {
            const q = slot.parentElement?.dataset.q ?? "";
            const html = solutions?.[q];
            const wall = book.paywall!;
            return createPortal(
              html ? (
                <div className="sol-unlocked" dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <div className="sol-lock-card">
                  <Lock className="sol-lock-icon" aria-hidden />
                  <p className="sol-lock-title">Solution locked</p>
                  <p className="sol-lock-text">
                    Questions 1 to {wall.freeSections} are free. Unlock all {wall.lockedCount} worked solutions for{" "}
                    {wall.priceFcfa} FCFA, or free by inviting {wall.invitesNeeded} classmates.
                  </p>
                  <button type="button" className="sol-lock-btn" onClick={() => openUnlock("inline")}>
                    <KeyRound className="w-4 h-4" aria-hidden /> Unlock all solutions
                  </button>
                  <button type="button" className="sol-lock-code" onClick={() => openUnlock("inline", "code")}>
                    I already have a code
                  </button>
                </div>
              ),
              slot,
              q
            );
          })
        : null}
      {viewsSlot ? createPortal(<ViewCount path={book.path} className="bs-views-in" />, viewsSlot) : null}
    </div>
  );
}

/** The card at the end of a quiz: a tip for free books, the unlock for paid ones. */
function quizHelp(book: ReaderBook, unlocked: boolean): QuizBook["help"] {
  if (book.paywall) {
    return unlocked
      ? {
          title: "Thanks for unlocking 💚",
          text: "Know someone revising for the CA? Send them Algo. The quiz is free for everyone.",
          button: null,
        }
      : {
          title: "Want every worked solution?",
          text: `Questions 1 to ${book.paywall.freeSections} are free. Unlock the other ${book.paywall.lockedCount} for ${book.paywall.priceFcfa} FCFA, or free by inviting ${book.paywall.invitesNeeded} classmates.`,
          button: "Unlock all solutions",
        };
  }
  return hasSupported()
    ? {
        title: "Thank you for supporting Algo 💚",
        text: "You're part of why this stays free. Know someone cramming for the CA? Send them Algo.",
        button: null,
      }
    : {
        title: "Algo is free. Help keep it that way 💚",
        text: "Every question, explanation and chapter here is free for every student, no ads. Tips from students like you keep new quizzes and solved tutorials coming before the CA.",
        button: "Support the book",
      };
}
