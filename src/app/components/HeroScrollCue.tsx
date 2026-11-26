"use client";

import { useEffect, useState } from "react";

/**
 * A quiet scroll cue for the hero: a glass circle holding two stacked chevrons that
 * light up one after the other, like a current flowing down, with a rest between
 * waves. On hover it turns green; the moment the page scrolls, the chevrons flatten
 * into a dash and fade: job done. Drawn as SVG, centred on the circle's middle.
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
      {/* Both chevrons together span 7–17 on each axis, so the pair sits on (12, 12). */}
      <svg className="hero-cue-svg" viewBox="0 0 24 24" aria-hidden="true">
        <polyline className="hero-cue-a" points="7,7 12,12 17,7" />
        <polyline className="hero-cue-b" points="7,12 12,17 17,12" />
      </svg>
    </a>
  );
}
