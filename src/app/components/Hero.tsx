import Image from "next/image";
import type { CSSProperties } from "react";

const delay = (ms: number) => ({ "--hero-delay": `${ms}ms` }) as CSSProperties;

const PORTRAIT_ALT = "Tabe Rickson, full-stack and AI engineer";

/** Both portraits are rendered; CSS (`.hero-img-light` / `.hero-img-dark`) shows the one for the theme. */
function Portrait({ sizes, priority }: { sizes: string; priority?: boolean }) {
  return (
    <>
      <Image
        src="/tabe-rickson-portrait-light-hq.webp"
        alt={PORTRAIT_ALT}
        fill
        priority={priority}
        unoptimized
        sizes={sizes}
        className="hero-img-light object-cover object-top"
      />
      <Image
        src="/tabe-rickson-portrait-dark-hq.webp"
        alt={PORTRAIT_ALT}
        fill
        priority={priority}
        unoptimized
        sizes={sizes}
        className="hero-img-dark object-cover object-top"
      />
    </>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center min-h-svh px-6 sm:px-8 lg:px-16 pt-28 pb-16 lg:pt-32 lg:pb-24"
    >
      <div className="hero-grid w-full max-w-7xl mx-auto">
        {/* Copy */}
        <div className="min-w-0">
          <div className="hero-rise flex items-center gap-4" style={delay(0)}>
            <div className="hero-avatar lg:hidden">
              <Portrait sizes="64px" priority />
            </div>
            <p className="font-mono text-xs sm:text-sm tracking-[0.12em] uppercase leading-relaxed">
              <span className="font-bold text-foreground">Tabe Rickson</span>
              <span className="block sm:inline text-foreground/65">
                <span className="hidden sm:inline" aria-hidden="true"> · </span>
                Full-stack &amp; AI engineer
              </span>
              <span className="block sm:inline text-foreground/65">
                <span className="hidden sm:inline" aria-hidden="true"> · </span>
                Buea, Cameroon
              </span>
            </p>
          </div>

          <h1 className="hero-title font-sans text-foreground mt-8 lg:mt-10">
            <span className="hero-rise block" style={delay(80)}>I build tech</span>
            <span className="hero-rise block" style={delay(160)}>
              that <span className="hero-accent">changes</span>
            </span>
            <span className="hero-rise block hero-accent" style={delay(240)}>lives.</span>
          </h1>

          <p
            className="hero-rise mt-8 max-w-xl font-inter text-base sm:text-lg leading-relaxed text-foreground/75"
            style={delay(320)}
          >
            I design and ship full-stack products for startups and communities, and I write study books
            for computer science students in Cameroon.
          </p>

          <div
            className="hero-rise mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
            style={delay(400)}
          >
            <a
              href="#portfolio"
              className="group inline-flex h-12 items-center justify-center gap-2 px-7 text-sm font-bold text-[#121212] bg-[#39FF14] hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              See my work
              <svg
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                width="12"
                height="12"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="/books"
              className="inline-flex h-12 items-center justify-center px-7 text-sm font-bold text-foreground border border-foreground/25 hover:border-foreground/70 hover:bg-foreground/5 transition-colors duration-300"
            >
              Read my books
            </a>
          </div>
        </div>

        {/* Portrait (desktop) */}
        <div className="hero-fade hero-portrait hidden lg:block" style={delay(200)}>
          <div className="hero-portrait-frame">
            <Portrait sizes="440px" priority />
          </div>
        </div>
      </div>
    </section>
  );
}
