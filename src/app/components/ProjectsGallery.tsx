"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import portfolioData from "../../../portfolio-data.json";
import SectionHeader from "./SectionHeader";

type Project = {
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
const TAGLINES: Record<string, string> = {
  "mobi-rent": "Car rental for Cameroon, booked online in minutes.",
  "tutor-finder": "Learners matched with the right tutor, with help from AI.",
  "niatrust-wallet": "Escrow and group savings people can actually trust.",
  startwise: "Mentorship and clear career paths for new developers.",
};

/** Every project uses Git and GitHub, so they say nothing. */
const HIDDEN_TECH = new Set(["Git", "GitHub"]);

const SHORT_TECH: Record<string, string> = { TailwindCSS: "Tailwind" };

// Critically damped (no overshoot): content arriving on scroll isn't a flick.
const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;

function Tile({ project, index }: { project: Project; index: number }) {
  const techs = (project.techIcons ?? []).filter((t) => !HIDDEN_TECH.has(t)).map((t) => SHORT_TECH[t] ?? t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING, delay: (index % 2) * 0.06 }}
      className="h-full"
    >
      <article className="work-tile group h-full">
        <div className="px-6 pt-7 pb-7 sm:px-10 sm:pt-10">
          {techs.length > 0 && (
            <p className="text-[13px] tracking-[0.01em] text-foreground/55">{techs.join(" · ")}</p>
          )}

          <h3 className="work-title mt-3 text-foreground">
            {/* Stretched over the whole tile, so a click anywhere opens the case study. */}
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-none"
            >
              {project.name}
            </Link>
          </h3>

          <p className="work-tagline mt-3 max-w-md text-foreground/80">
            {TAGLINES[project.slug] ?? project.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3.5 sm:gap-x-6 gap-y-2 text-[15px]">
            <span className="work-link" aria-hidden="true">
              Case study ›
            </span>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="work-link relative z-10"
                aria-label={`Visit the ${project.name} site (opens in a new tab)`}
              >
                Visit site ↗
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
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

export default function ProjectsGallery() {
  const projects = (portfolioData.projects as Project[]).slice(0, 4);

  return (
    // reducedMotion="user": with reduced motion on, tiles fade in without moving.
    <MotionConfig reducedMotion="user">
      <section id="portfolio" className="relative overflow-x-clip border-t border-card-border px-8 lg:px-16 py-24 lg:py-32">
        {/* Same frame as the other sections: padding on the section, a full max-w-7xl container */}
        <div className="max-w-7xl mx-auto w-full">
          <SectionHeader
            className="mb-12 lg:mb-16"
            backdrop="PORTFOLIO"
            eyebrow="Selected work"
            title="Things I've shipped."
            lede="Products I designed and built end to end, from the first idea to real people using them."
          />

          {/* Liquid-glass distortion for the tiles' backdrop (used by .work-tile where supported) */}
          <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
            <filter id="work-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="7" result="noise" />
              <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
              <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>

          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, i) => (
              <Tile key={project.slug} project={project} index={i} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/projects" className="work-link text-[17px]">
              See all projects ›
            </Link>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
