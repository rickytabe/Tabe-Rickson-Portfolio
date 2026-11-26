import type { ReactNode } from "react";
import { SECTION_STYLES } from "../utils/sectionStyles";

/**
 * The landing page's section header: a faded backdrop word, a small green eyebrow,
 * a large sentence-case title, and an optional one-line intro. An optional `aside`
 * (stats, for example) sits on the right on wider screens.
 */
export default function SectionHeader({
  backdrop,
  eyebrow,
  title,
  lede,
  aside,
  className = "",
}: {
  backdrop: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`relative ${className}`}>
      <div className={SECTION_STYLES.backdropWrapper} aria-hidden="true">
        <span className={SECTION_STYLES.backdropText}>{backdrop}</span>
      </div>

      <div
        className={`relative z-10 ${aside ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end" : ""}`}
      >
        <div className="max-w-3xl">
          <p className="text-[15px] font-semibold tracking-[0.01em] text-[var(--hero-accent)]">{eyebrow}</p>
          <h2 className="mt-3 text-[clamp(2.5rem,1.6rem+3vw,4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-foreground">
            {title}
          </h2>
          {lede && (
            <p className="mt-5 max-w-xl font-inter text-[17px] sm:text-lg leading-relaxed text-foreground/70">
              {lede}
            </p>
          )}
        </div>
        {aside}
      </div>
    </header>
  );
}
