"use client";

import { useEffect, useState } from "react";

/**
 * A quiet scroll cue for the hero: a glass circle holding a chevron made of two
 * strokes. It nudges down once on load (never loops), opens wider on hover, and
 * the moment the page scrolls it flattens into a dash and fades: job done.
 */
export default function HeroScrollCue() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#about"
      aria-label="Scroll to About"
      className={`hero-cue hidden lg:grid absolute bottom-8 inset-x-0 mx-auto ${scrolled ? "is-done" : ""}`}
      tabIndex={scrolled ? -1 : 0}
      aria-hidden={scrolled}
    >
      <span className="hero-cue-chevron" aria-hidden="true">
        <span className="hero-cue-stroke hero-cue-left" />
        <span className="hero-cue-stroke hero-cue-right" />
      </span>
    </a>
  );
}
