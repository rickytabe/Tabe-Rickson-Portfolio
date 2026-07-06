"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { AnimatedText } from "@/components/ui/animated-text";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/#hero", sectionId: "hero" },
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Services", href: "/#services", sectionId: "services" },
  { label: "Portfolio", href: "/#portfolio", sectionId: "portfolio" },
  { label: "Experience", href: "/#experience", sectionId: "experience" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

const tagLinks = [
  { label: "BLOGS", href: "/blog" },
  { label: "EVENTS", href: "/events" },
];

const mobileContentLinks = [
  { label: "BLOGS", href: "/blog" },
  { label: "EVENTS", href: "/events" },
  { label: "PROJECTS", href: "/projects" },
];

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("Home");
  const [pillStyle, setPillStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0, scale: "scale(1, 1)" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Detect if we're on the home page or a sub-page
  const isOnHomePage = pathname === '/';
  // Check if current path matches a tag/content link
  const activeTagPath = tagLinks.find(l => pathname.startsWith(l.href))?.href ?? null;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const pillStyleRef = useRef(pillStyle);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    pillStyleRef.current = pillStyle;
  }, [pillStyle]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navigationEntry?.type === "reload") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        setActiveSection("Home");
        setHasScrolled(false);
      });
    }
  }, []);

  // Handle scrolling to hash when navigating from another page
  useEffect(() => {
    if (isOnHomePage && window.location.hash) {
      const hash = window.location.hash.substring(1); // Remove the #
      // Add a slight delay to ensure the page has rendered
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, [isOnHomePage, pathname]);

  useEffect(() => {
    // Only track scroll sections when on the home page
    if (!isOnHomePage) return;

    const updateActiveSection = () => {
      setHasScrolled(window.scrollY > 0);

      const visibleSections = navLinks.map((link) => {
        const el = document.getElementById(link.sectionId);
        if (!el) {
          return { label: link.label, visibleHeight: 0 };
        }

        const rect = el.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, window.innerHeight);

        return {
          label: link.label,
          visibleHeight: Math.max(0, visibleBottom - visibleTop),
        };
      });

      const currentSection = visibleSections.reduce((current, section) => {
        return section.visibleHeight > current.visibleHeight ? section : current;
      });

      if (currentSection.visibleHeight > 0) {
        setActiveSection(currentSection.label);
      };
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [isOnHomePage]);

  // On non-home pages, clear the section active state so no pill highlights a section
  useEffect(() => {
    if (!isOnHomePage) {
      setActiveSection("");
    }
  }, [isOnHomePage]);

  // Update sliding pill position
  useEffect(() => {
    const targetLink = hoveredLink || activeSection;
    let el = linkRefs.current[targetLink];

    // Fallback to active section if hovering over a tag link that isn't tracked
    if (!el && activeSection) {
      el = linkRefs.current[activeSection];
    }

    if (el) {
      const previousPillStyle = pillStyleRef.current;
      const isMoving = previousPillStyle.opacity === 1 && Math.abs(el.offsetLeft - previousPillStyle.left) > 5;
      const nextPillStyle = {
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
        opacity: 1,
        // Squash and stretch based on movement
        scale: isMoving ? "scale(1.15, 0.85)" : "scale(1, 1)",
      };

      pillStyleRef.current = nextPillStyle;
      setPillStyle(nextPillStyle);

      // Revert the squash and stretch as the velocity settles
      if (isMoving) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setPillStyle((prev) => {
            const settledPillStyle = { ...prev, scale: "scale(1, 1)" };
            pillStyleRef.current = settledPillStyle;
            return settledPillStyle;
          });
        }, 150); // Mid-flight revert so it springs back visually as it arrives
      }
    } else {
      setPillStyle((prev) => {
        const hiddenPillStyle = { ...prev, opacity: 0, scale: "scale(1, 1)" };
        pillStyleRef.current = hiddenPillStyle;
        return hiddenPillStyle;
      });
    }
  }, [hoveredLink, activeSection]);

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 lg:opacity-100 lg:pointer-events-auto ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
        style={{
          background: hasScrolled ? "color-mix(in srgb, var(--background) 75%, transparent)" : "transparent",
          backdropFilter: hasScrolled ? "blur(12px) saturate(160%)" : "none",
          WebkitBackdropFilter: hasScrolled ? "blur(12px) saturate(160%)" : "none",
          borderBottom: hasScrolled ? "1px solid var(--card-border)" : "1px solid transparent",
          transition: "background-color 250ms ease, border-color 250ms ease, backdrop-filter 250ms ease, opacity 250ms ease",
        }}
      >
        <div className="mx-auto flex items-center justify-between px-6 py-3 max-w-[1400px]">
          {/* Logo / Brand */}
          <Link
            href="/"
            id="navbar-brand"
            className="flex items-center gap-2 group"
            style={{ textDecoration: "none" }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                backgroundColor: "#39FF14",
                boxShadow: "0 0 0 0 rgba(57, 255, 20, 0.55)",
                animation: "greenDotPulse 1.8s ease-in-out infinite",
              }}
            />
            <AnimatedText
              text="Tabe Rickson"
              textClassName="text-base lg:text-2xl font-bold font-sans text-foreground"
              underlineClassName="text-[#39FF14]"
            />
            <span
              className="text-base lg:text-2xl font-light font-sans text-foreground/40"
            >
              / 2026
            </span>
          </Link>
          <style jsx>{`
          @keyframes greenDotPulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(57, 255, 20, 0.45);
            }
            50% {
              transform: scale(1.35);
              box-shadow: 0 0 0px 5px rgba(57, 255, 20, 0.24);
            }
          }
        `}</style>

          {/* Desktop: Center + Right Nav Links */}
          <div className="hidden lg:flex items-center gap-2 relative" onMouseLeave={() => setHoveredLink(null)}>

            {/* Animated Liquid Glass Pill with Squash & Stretch Physics */}
            <div
              className="liquid-glass-pill"
              style={{
                position: "absolute",
                transition: "all 700ms cubic-bezier(0.34, 1.56, 0.64, 1.0)", // Snappy Spring Physics
                left: `${pillStyle.left}px`,
                top: `${pillStyle.top}px`,
                width: `${pillStyle.width}px`,
                height: `${pillStyle.height}px`,
                transform: pillStyle.scale,
                opacity: pillStyle.opacity,
                borderRadius: "4px",
                zIndex: 1,
                pointerEvents: "none", // ensure it doesn't intercept hovers
              }}
            />

            {/* Primary Nav Links */}
            {navLinks.map((link) => {
              const isActive = activeSection === link.label || hoveredLink === link.label;
              return (
                <a
                  key={link.label}
                  ref={(el) => {
                    linkRefs.current[link.label] = el;
                  }}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (pathname === '/') {
                      document.getElementById(link.sectionId)?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      router.push(link.href);
                    }
                  }}
                  className="relative px-3.5 py-1.5 text-[12px] font-medium tracking-widest transition-colors duration-300 z-10 font-mono"
                  style={{
                    color: isActive ? "var(--foreground)" : "var(--muted)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={() => setHoveredLink(link.label)}
                >
                  <span>{link.label}</span>
                </a>
              );
            })}

            {/* Divider */}
            <div
              className="w-px h-4 mx-2 z-10"
              style={{ backgroundColor: "var(--card-border)" }}
            />

            {/* Tag Links with liquid-glass styling */}
            {tagLinks.map((link) => {
              const isHovered = hoveredLink === link.label;
              const isActiveTag = pathname.startsWith(link.href);
              return (
                <a
                  key={link.label}
                  id={`nav-tag-${link.label.toLowerCase()}`}
                  href={link.href}
                  className="liquid-glass-pill flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-medium tracking-widest transition-all duration-300 font-mono"
                  style={{
                    color: isActiveTag || isHovered ? "var(--neon-green)" : "var(--muted)",
                    textDecoration: "none",
                    borderRadius: "2px",
                    border: isActiveTag ? "1px solid rgba(57,255,20,0.4)" : undefined,
                    background: isActiveTag ? "rgba(57,255,20,0.08)" : undefined,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(link.href);
                  }}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span
                    className="inline-block w-1 h-1 rounded-full"
                    style={{ backgroundColor: isActiveTag ? "#39FF14" : "#39FF14", position: "relative", zIndex: 2, boxShadow: isActiveTag ? "0 0 4px rgba(57,255,20,0.8)" : "none" }}
                  />
                  <span>{link.label}</span>
                </a>
              );
            })}

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 ml-2 transition-colors duration-300 rounded-full hover:bg-foreground/10"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-foreground" />
                ) : (
                  <Moon className="w-4 h-4 text-foreground" />
                )}
              </button>
            )}

            {/* CTA Button */}
            <a
              id="nav-cta-lets-talk"
              href="/lets-work"
              onClick={(e) => {
                e.preventDefault();
                router.push('/lets-work');
              }}
              className="group relative flex items-center gap-1.5 ml-3 px-5 py-2 text-xs font-semibold tracking-widest text-[#121212] hover:text-background overflow-hidden transition-all duration-300 font-mono"
              style={{
                backgroundColor: "#39FF14",
                textDecoration: "none",
                borderRadius: "0px",
              }}
            >
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              <span className="relative z-10">LET&apos;S WORK</span>
              <svg
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: "2px" }}
              >
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Mobile: Hamburger Button & Theme Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 transition-colors duration-300 rounded-full hover:bg-foreground/10"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="relative flex flex-col justify-center items-center w-11 h-11 rounded-xl border border-card-border bg-card-bg hover:border-[#39FF14]/40 transition-all duration-300"
            >
              <span
                className={`block h-[2px] w-6 bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`block h-[2px] w-6 bg-foreground rounded-full transition-all duration-300 mt-[5px] ${isMobileMenuOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block h-[2px] w-6 bg-foreground rounded-full transition-all duration-300 mt-[5px] ${isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out lg:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "color-mix(in srgb, var(--background) 97%, transparent)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)" }}
      >
        {/* Menu Header - acts as the navbar when menu is open */}
        <div
          className="flex items-center justify-between px-6 border-b border-card-border"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)", paddingBottom: "0.75rem" }}
        >
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-foreground/40 uppercase mb-0.5">Navigation</p>
            <h2 className="text-2xl font-black font-sans tracking-tight text-foreground">MENU</h2>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-card-border bg-card-bg text-foreground/60 hover:text-[#39FF14] hover:border-[#39FF14]/40 transition-all duration-300 text-2xl"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-73px)] px-6 pt-6 pb-8 overflow-y-auto">

          {/* 2-Column Nav Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {navLinks.map((link) => {
              // On home page, use scroll-based active section. On other pages, nothing is active.
              const isActive = isOnHomePage && activeSection === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    if (isOnHomePage) {
                      setTimeout(() => {
                        document.getElementById(link.sectionId)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      // Navigate to home page then scroll to section
                      router.push(link.href);
                    }
                  }}
                  className={`relative flex flex-col justify-between px-5 py-4 rounded-2xl border transition-all duration-300 font-mono group ${
                    isActive
                      ? "border-[#39FF14]/50 bg-[#39FF14]/10 text-[#39FF14]"
                      : "border-card-border bg-card-bg text-foreground/70 hover:border-[#39FF14]/30 hover:text-foreground hover:bg-card-bg"
                  }`}
                  style={{ textDecoration: "none", minHeight: "80px" }}
                >
                  {isActive && (
                    <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                  )}
                  <span className="text-[10px] tracking-widest opacity-50 uppercase">0{navLinks.indexOf(navLinks.find(l => l.label === link.label)!) + 1}</span>
                  <span className="text-lg font-bold tracking-tight">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Content Links (mobile only) - includes Projects */}
          <div className="mb-6">
            <p className="text-[10px] font-mono tracking-[0.3em] text-foreground/30 uppercase mb-3">Content</p>
            <div className="grid grid-cols-2 gap-3">
              {mobileContentLinks.map((link) => {
                const isActiveContent = pathname.startsWith(link.href);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      router.push(link.href);
                    }}
                    className={`flex items-center gap-2.5 px-5 py-4 rounded-2xl border transition-all duration-300 font-mono ${
                      isActiveContent
                        ? "border-[#39FF14]/50 bg-[#39FF14]/10 text-[#39FF14]"
                        : "border-card-border bg-card-bg text-foreground/60 hover:border-[#39FF14]/30 hover:text-[#39FF14]"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: "#39FF14",
                        boxShadow: isActiveContent ? "0 0 6px rgba(57,255,20,0.8)" : "0 0 4px rgba(57,255,20,0.4)"
                      }}
                    />
                    <span className="text-sm font-bold tracking-widest">{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA */}
          <a
            href="/lets-work"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              router.push('/lets-work');
            }}
            className="group relative flex items-center justify-center gap-3 w-full py-4 text-sm font-bold tracking-widest text-[#121212] overflow-hidden transition-all duration-300 font-mono rounded-2xl"
            style={{ backgroundColor: "#39FF14", textDecoration: "none" }}
          >
            <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">LET&apos;S WORK TOGETHER</span>
            <svg className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" width="14" height="14" viewBox="0 0 10 10" fill="none">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
