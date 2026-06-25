"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AnimatedText } from "@/components/ui/animated-text";

const navLinks = [
  { label: "Home", href: "#hero", sectionId: "hero" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Services", href: "#services", sectionId: "services" },
  { label: "Portfolio", href: "#portfolio", sectionId: "portfolio" },
  { label: "Experience", href: "#experience", sectionId: "experience" },
];

const tagLinks = [
  { label: "WRITING", href: "#writing" },
  { label: "WEBINAR", href: "#webinar" },
];

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("Home");
  const [pillStyle, setPillStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0, scale: "scale(1, 1)" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
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

  useEffect(() => {
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
  }, []);

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
        className="fixed top-0 left-0 w-full z-50"
      style={{
        background: hasScrolled ? "rgba(18, 18, 18, 0.25)" : "transparent",
        backdropFilter: hasScrolled ? "blur(12px) saturate(160%)" : "none",
        WebkitBackdropFilter: hasScrolled ? "blur(12px) saturate(160%)" : "none",
        borderBottom: hasScrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent",
        transition: "background-color 250ms ease, border-color 250ms ease, backdrop-filter 250ms ease",
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
            textClassName="text-2xl font-bold font-sans text-white"
            underlineClassName="text-[#39FF14]"
          />
          <span
            className="text-2xl font-light font-sans"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
            }}
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
                className="relative px-3.5 py-1.5 text-[12px] font-medium tracking-widest transition-colors duration-300 z-10 font-mono"
                style={{
                  color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
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
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          {/* Tag Links with liquid-glass styling */}
          {tagLinks.map((link) => {
            const isHovered = hoveredLink === link.label;
            return (
              <a
                key={link.label}
                id={`nav-tag-${link.label.toLowerCase()}`}
                href={link.href}
                className="liquid-glass-pill flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-medium tracking-widest transition-all duration-300 font-mono"
                style={{
                  color: isHovered ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  borderRadius: "2px",
                }}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span
                  className="inline-block w-1 h-1 rounded-full"
                  style={{ backgroundColor: "#39FF14", position: "relative", zIndex: 2 }}
                />
                <span>{link.label}</span>
              </a>
            );
          })}

          {/* CTA Button */}
          <a
            id="nav-cta-lets-talk"
            href="#contact"
            className="flex items-center gap-1.5 ml-3 px-5 py-2 text-xs font-semibold tracking-widest transition-all duration-300 font-mono"
            style={{
              backgroundColor: "#39FF14",
              color: "#121212",
              textDecoration: "none",
              borderRadius: "0px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4dff33";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(57, 255, 20, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#39FF14";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            LET&apos;S TALK
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginLeft: "2px" }}
            >
              <path
                d="M1 9L9 1M9 1H3M9 1V7"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors p-2"
          >
            <span className="text-[10px] font-medium tracking-widest font-mono">
              {isMobileMenuOpen ? "CLOSE" : "MENU"}
            </span>
            <div className="flex flex-col gap-1">
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  isMobileMenuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-4 bg-current transition-opacity duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  isMobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#121212]/95 backdrop-blur-xl transition-all duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center h-full gap-6 px-6 pt-32 pb-12 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = activeSection === link.label;

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative w-full max-w-[280px] px-6 py-3 text-center text-2xl font-bold tracking-widest transition-all duration-300 font-mono ${
                  isActive ? "text-[#39FF14] bg-[#39FF14]/10" : "text-white/60 hover:text-white"
                }`}
                style={{
                  textDecoration: "none",
                  borderRadius: "8px",
                }}
              >
                <span>{link.label}</span>
              </a>
            );
          })}

          <div className="w-12 h-px bg-white/10 my-4" />

          {tagLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm tracking-widest text-[#39FF14] hover:text-[#4dff33] transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {link.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 px-8 py-3 text-sm font-semibold tracking-widest bg-[#39FF14] text-[#121212] transition-colors hover:bg-[#4dff33]"
            style={{  }}
          >
            LET&apos;S TALK
          </a>
        </div>
      </div>
    </>
  );
}
