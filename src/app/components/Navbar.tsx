"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, X } from "lucide-react";
import { usePathname } from "next/navigation";

type NavLink = {
  label: string;
  href: string;
  /** Home-page section this link scrolls to (drives the scroll-spy underline). */
  sectionId?: string;
  /** Extra paths that count as this page (a book lives at its own URL). */
  match?: string[];
  /** Small green dot to draw the eye. */
  dot?: boolean;
};

const BOOK_PATHS = ["/algorithms-made-easy-csc207", "/csc211-tutorial-solutions", "/csc207-tutorial-solutions", "/csc207-test-1-solutions"];

const work: NavLink = { label: "Work", href: "/#portfolio", sectionId: "portfolio" };
const services: NavLink = { label: "Services", href: "/#services", sectionId: "services" };
const about: NavLink = { label: "About", href: "/#about", sectionId: "about" };
const books: NavLink = { label: "Books", href: "/books", match: BOOK_PATHS, dot: true };
const events: NavLink = { label: "Events", href: "/events" };

/**
 * Desktop: five links. Home-page sections come first, in the order they scroll
 * (About → Services → Work), so the underline moves left to right as you read down.
 * Home is the logo, Contact is the "Let's work" button.
 */
const desktopLinks = [about, services, work, books, events];

/** Phone menu: every home-page section in scroll order, then the other pages. */
const mobileLinks: NavLink[] = [
  about,
  services,
  work,
  { label: "Experience", href: "/#experience", sectionId: "experience" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
  books,
  events,
  { label: "Projects", href: "/projects" },
];

const SPY_SECTIONS = ["hero", "about", "services", "portfolio", "experience", "contact"];

function ThemeToggle({ size }: { size: "sm" | "md" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const isDark = resolvedTheme !== "light";
  const icon = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  // The button keeps its size before mount, so the bar never shifts when the icon appears.
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-colors"
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
    >
      {mounted && (isDark ? <Sun className={icon} /> : <Moon className={icon} />)}
    </button>
  );
}

function Arrow({ size = 10 }: { size?: number }) {
  return (
    <svg
      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isOnHomePage = pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (link: NavLink) => {
    if (link.sectionId) return isOnHomePage && activeSection === link.sectionId;
    return [link.href, ...(link.match ?? [])].some((p) => pathname.startsWith(p));
  };

  // Close the menu whenever the route changes.
  useEffect(() => {
    const t = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // A reload of the home page starts at the top, without the old hash.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  }, []);

  // Arriving on the home page from another page with a hash: scroll to that section once it renders.
  useEffect(() => {
    if (!isOnHomePage || !window.location.hash) return;
    const id = window.location.hash.substring(1);
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
    return () => clearTimeout(t);
  }, [isOnHomePage, pathname]);

  // Frosted background once the page scrolls, on every page.
  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Scroll-spy on the home page: the section taking up most of the screen is active.
  useEffect(() => {
    if (!isOnHomePage) return;
    const update = () => {
      let best = { id: "", visible: 0 };
      for (const id of SPY_SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
        if (visible > best.visible) best = { id, visible };
      }
      if (best.id) setActiveSection(best.id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isOnHomePage]);

  // Mobile menu: lock the page, close on Escape, keep focus inside, return focus to the button.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
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
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        id="main-navbar"
        aria-label="Main"
        className="fixed top-0 left-0 w-full z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300"
        style={{
          background: hasScrolled ? "color-mix(in srgb, var(--background) 80%, transparent)" : "transparent",
          backdropFilter: hasScrolled ? "blur(12px) saturate(160%)" : "none",
          WebkitBackdropFilter: hasScrolled ? "blur(12px) saturate(160%)" : "none",
          borderColor: hasScrolled ? "var(--card-border)" : "transparent",
        }}
      >
        <div className="mx-auto flex h-16 items-center justify-between gap-6 px-6 lg:px-10 max-w-[1400px]">
          {/* Brand */}
          <Link href="/" id="navbar-brand" className="flex items-center gap-2.5 shrink-0" aria-label="Tabe Rickson, home">
            <span className="inline-block w-2 h-2 rounded-full bg-[#39FF14]" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight text-foreground">Tabe Rickson</span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-7">
              {desktopLinks.map((link) => {
                const active = isActive(link);
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      id={`nav-link-${link.label.toLowerCase()}`}
                      aria-current={active ? (link.sectionId ? "location" : "page") : undefined}
                      className={`relative inline-flex items-center gap-1.5 py-2 text-sm font-medium transition-colors ${
                        active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                      }`}
                    >
                      {link.label}
                      {link.dot && <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" aria-hidden="true" />}
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[var(--neon-green)] origin-left transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <ThemeToggle size="sm" />
              <Link
                href="/lets-work"
                id="nav-cta-lets-talk"
                className="group inline-flex h-10 items-center gap-2 px-5 text-sm font-bold text-[#121212] bg-[#39FF14] hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                Let&apos;s work
                <Arrow />
              </Link>
            </div>
          </div>

          {/* Phone and tablet */}
          <div className="lg:hidden flex items-center gap-1">
            <ThemeToggle size="md" />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="inline-flex flex-col items-center justify-center gap-[5px] w-11 h-11 rounded-xl hover:bg-foreground/10 transition-colors"
            >
              <span className="block h-[2px] w-6 bg-foreground rounded-full" />
              <span className="block h-[2px] w-6 bg-foreground rounded-full" />
              <span className="block h-[2px] w-4 self-end mr-2.5 bg-foreground rounded-full" />
            </button>
          </div>
        </div>
      </nav>

      {/* Phone menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className={`fixed inset-0 z-[60] lg:hidden flex flex-col bg-background transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-card-border">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="inline-block w-2 h-2 rounded-full bg-[#39FF14]" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight text-foreground">Tabe Rickson</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-foreground hover:bg-foreground/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
          <ul>
            {mobileLinks.map((link, i) => {
              const active = isActive(link);
              return (
                <li
                  key={link.label}
                  className={`border-b border-card-border transition-all duration-500 ${
                    isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${60 + i * 30}ms` : "0ms" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={active ? (link.sectionId ? "location" : "page") : undefined}
                    className={`flex items-center justify-between py-4 text-2xl font-bold tracking-tight transition-colors ${
                      active ? "text-[var(--neon-green)]" : "text-foreground hover:text-[var(--neon-green)]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {link.label}
                      {link.dot && <span className="w-2 h-2 rounded-full bg-[#39FF14]" aria-hidden="true" />}
                    </span>
                    <span className="text-foreground/30" aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/lets-work"
            onClick={() => setIsMobileMenuOpen(false)}
            className="group mt-8 flex h-14 w-full items-center justify-center gap-2.5 text-base font-bold text-[#121212] bg-[#39FF14] hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Let&apos;s work together
            <Arrow size={12} />
          </Link>
        </div>
      </div>
    </>
  );
}
