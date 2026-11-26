"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export type Project = {
  name: string;
  slug: string;
  description: string;
  image: string;
  liveUrl?: string;
  codeUrl?: string;
  techIcons?: string[];
};

/**
 * One short line per project. The full descriptions live on the case-study pages;
 * a tile says what the product is in a sentence, like a product page would.
 */
export const TAGLINES: Record<string, string> = {
  "mobi-rent": "Car rental for Cameroon, booked online in minutes.",
  "tutor-finder": "Learners matched with the right tutor, with help from AI.",
  "niatrust-wallet": "Escrow and group savings people can actually trust.",
  startwise: "Mentorship and clear career paths for new developers.",
  cambrilia: "An AI assistant you can talk to with text, images and voice.",
  "kmc-restaurant": "Online orders, table bookings and payments for a restaurant.",
  stepup: "A quick, simple online shoe shop.",
  evogym: "Gym memberships, payments and class bookings in one place.",
};

/** Projects that are still being built get a small label. */
const IN_PROGRESS = new Set(["cambrilia"]);

/** Every project uses Git and GitHub, so they say nothing. */
const HIDDEN_TECH = new Set(["Git", "GitHub"]);

const SHORT_TECH: Record<string, string> = { TailwindCSS: "Tailwind" };

/** Placeholder links (e.g. github.com/example/…) are never shown. */
const isRealUrl = (url?: string) => !!url && !/\/\/(www\.)?github\.com\/example\//.test(url);

// Critically damped (no overshoot): content arriving on scroll isn't a flick.
export const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;

/**
 * Liquid-glass distortion for the tiles' backdrop (`.work-tile` uses `url(#work-glass)`
 * where the browser supports it). Render once per page that shows tiles.
 */
export function GlassFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="work-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

/** A project card: liquid glass, with the screenshot in a drawer that slides out on hover. */
export function ProjectTile({
  project,
  index,
  headingLevel = "h3",
  revealOnScroll = true,
}: {
  project: Project;
  index: number;
  headingLevel?: "h2" | "h3";
  revealOnScroll?: boolean;
}) {
  const techs = (project.techIcons ?? []).filter((t) => !HIDDEN_TECH.has(t)).map((t) => SHORT_TECH[t] ?? t);
  const Heading = headingLevel;
  const liveUrl = isRealUrl(project.liveUrl) ? project.liveUrl : undefined;
  const codeUrl = isRealUrl(project.codeUrl) ? project.codeUrl : undefined;

  const reveal = revealOnScroll
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { ...SPRING, delay: (index % 2) * 0.06 },
      }
    : {};

  return (
    <motion.div {...reveal} className="h-full">
      <article className="work-tile group h-full">
        <div className="px-6 pt-7 pb-7 sm:px-10 sm:pt-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {techs.length > 0 && (
              <p className="text-[13px] tracking-[0.01em] text-foreground/55">{techs.join(" · ")}</p>
            )}
            {IN_PROGRESS.has(project.slug) && (
              <span className="rounded-full border border-[var(--hero-accent)]/40 px-2 py-0.5 text-[11px] font-semibold text-[var(--hero-accent)]">
                In progress
              </span>
            )}
          </div>

          <Heading className="work-title mt-3 text-foreground">
            {/* Stretched over the whole tile, so a click anywhere opens the case study. */}
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-none"
            >
              {project.name}
            </Link>
          </Heading>

          <p className="work-tagline mt-3 max-w-md text-foreground/80">
            {TAGLINES[project.slug] ?? project.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3.5 sm:gap-x-6 gap-y-2 text-[15px]">
            <span className="work-link" aria-hidden="true">
              Case study ›
            </span>
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="work-link relative z-10"
                aria-label={`Visit the ${project.name} site (opens in a new tab)`}
              >
                Visit site ↗
              </a>
            )}
            {codeUrl && (
              <a
                href={codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 font-semibold text-foreground/60 hover:text-foreground transition-colors"
                aria-label={`${project.name} source code on GitHub (opens in a new tab)`}
              >
                Code ↗
              </a>
            )}
          </div>
        </div>

        {/* The screenshot drawer: slides further out of the tile on hover */}
        <div className="work-drawer">
          <span className="work-drawer-handle" aria-hidden="true" />
          <div className="work-drawer-shot aspect-[2/1] bg-background">
            <Image
              src={project.image}
              alt={`${project.name} home page`}
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 48vw, 95vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </article>
    </motion.div>
  );
}
