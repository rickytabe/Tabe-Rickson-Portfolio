"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, ChevronDown, Download, List, Smile, X } from "lucide-react";
import SupportModal, { hasSupported, mayAutoPrompt } from "./SupportModal";
import ViewCount from "./ViewCount";
import FigureLightbox from "./FigureLightbox";
import { BOOK_PATH } from "./book-info";

export type BookSubtopic = { id: string; title: string };
export type BookChapter = { id: string; num: number; title: string; subs: BookSubtopic[] };
export type BookPart = { name: string; chapters: BookChapter[] };

type Props = {
  parts: BookPart[];
  pdf: string;
  className?: string;
  children: React.ReactNode;
};

export default function BookReader({ parts, pdf, className = "", children }: Props) {
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
  const autoPrompted = useRef(false);
  const [minuteRead, setMinuteRead] = useState(false);
  const [viewsSlot, setViewsSlot] = useState<HTMLElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

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
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Count one minute of actual reading: time only passes while the tab is visible.
  useEffect(() => {
    if (!mayAutoPrompt()) return;
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
  }, []);

  // Ask for support once that minute is up (never on arrival). If the contents drawer or the
  // prompt is already open, wait until it closes.
  useEffect(() => {
    if (!minuteRead || autoPrompted.current || drawerOpen || supportOpen) return;
    autoPrompted.current = true;
    setSupportMode("support");
    setSupportOpen(true);
  }, [minuteRead, drawerOpen, supportOpen]);

  // Opening the prompt by hand also counts as "asked", so the one-minute prompt won't follow.
  const openSupport = useCallback((mode: "support" | "download") => {
    autoPrompted.current = true;
    setDrawerOpen(false);
    setSupportMode(mode);
    setSupportOpen(true);
  }, []);

  // PDF downloads inside the book go through the prompt, which always offers a free download.
  // Readers who already supported download straight away.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.<HTMLAnchorElement>('.book a[download][href$=".pdf"]');
      if (!link || hasSupported() || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      openSupport("download");
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
                      <span className="book-toc-num">{String(c.num).padStart(2, "0")}</span>
                      <span>{c.title}</span>
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
        <a href={pdf} download className="book-toc-pdf">
          <Download className="w-3.5 h-3.5" aria-hidden />
          Download the PDF
        </a>
        <button
          type="button"
          className="book-toc-support"
          onClick={() => {
            onPick?.();
            openSupport("support");
          }}
        >
          <Smile className="w-3.5 h-3.5" aria-hidden />
          Support this book
        </button>
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
            <a href="#top">CSC207 Made Easy</a>
          </nav>
          <p className="book-bar-chapter" aria-live="polite">
            {activeChapter ? (
              <>
                <span className="book-bar-num">{String(activeChapter.num).padStart(2, "0")}</span>
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
            <h2>CSC207 Made Easy</h2>
            <p>
              A plain English rewrite of the CSC207 Introduction to Algorithms course, 2023/2024 academic year.
              Every definition, pseudocode listing, code sample and complexity rule has been kept in full. What has
              been added is the explanation around them.
            </p>
            <div className="book-foot-links">
              <a href={pdf} download>
                <Download className="w-4 h-4" aria-hidden /> Download the PDF
              </a>
              <button type="button" onClick={() => openSupport("support")}>
                <Smile className="w-4 h-4" aria-hidden /> Support this book
              </button>
              <Link href="/books">More free books &rarr;</Link>
            </div>
            <p className="book-foot-credit">
              Original course material by Drs. Nyanga B., Achenkeng P. and Fotsing C. Definitions quoted in chapter 1
              are from Dromey, <i>How to Solve it by Computer</i> (1982) and Woodhouse et al, <i>Computer Science</i>{" "}
              (1984).
            </p>
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
        className={`book-top ${showTop && !drawerOpen && !supportOpen ? "is-on" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" aria-hidden />
      </button>

      <button
        type="button"
        className={`book-fab ${showFab && !drawerOpen && !supportOpen ? "is-on" : ""}`}
        onClick={() => openSupport("support")}
        aria-label="Support this book"
      >
        <Smile className="book-fab-icon" aria-hidden />
        <span>Support</span>
      </button>

      {/* Overlays render at the top of the page: inside .book they would sit under the site
          navbar, because .book is its own stacking layer. The wrapper carries the book's
          colour tokens and fonts. */}
      {portalTarget
        ? createPortal(
            <div className={`book-portal ${className}`}>
              <FigureLightbox />
              {supportOpen ? (
                <SupportModal mode={supportMode} pdf={pdf} onClose={() => setSupportOpen(false)} />
              ) : null}
            </div>,
            portalTarget
          )
        : null}
      {viewsSlot ? createPortal(<ViewCount path={BOOK_PATH} className="bs-views-in" />, viewsSlot) : null}
    </div>
  );
}
