"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Trophy } from "lucide-react";
import type { PointerEvent } from "react";
import portfolioData from "../../../portfolio-data.json";

type Project = {
  name: string;
  slug: string;
  description: string;
  image: string;
  liveUrl?: string;
  codeUrl?: string;
  techIcons?: string[];
  badge?: string;
};

const TECH_ICONS: Record<string, string> = {
  "Next.js": "/nextdotjs.svg",
  "Node.js": "/nodedotjs.svg",
  Framer: "/framer.svg",
  Firebase: "/firebase.svg",
  Gemini: "/googlegemini.svg",
  MongoDB: "/mongodb.svg",
  HTML5: "/html5.svg",
  JavaScript: "/javascript.svg",
  React: "/react.svg",
  TailwindCSS: "/tailwindcss.svg",
  Supabase: "/supabase.svg",
  OpenAI: "/openai.svg",
  TypeScript: "/typescript.svg",
  PostgreSQL: "/postgresql.svg",
  Python: "/python.svg",
};

/** Every project uses Git and GitHub, so they say nothing. */
const HIDDEN_TECH = new Set(["Git", "GitHub"]);

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const hostOf = (url?: string) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/** Spotlight position for the card's CSS (`--mx`, `--my`). */
const trackPointer = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

function BrowserFrame({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <div className="work-window">
      <div className="flex items-center gap-3 px-3 h-8 border-b border-card-border bg-card-bg">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--hero-accent)] opacity-70" />
        </span>
        <span className="flex-1 min-w-0 truncate rounded-md bg-foreground/[0.06] px-2.5 py-0.5 font-mono text-[11px] text-foreground/55">
          {hostOf(project.liveUrl) || `${project.slug}.app`}
        </span>
      </div>
      <div className="relative aspect-[2/1] overflow-hidden bg-card-bg">
        <Image
          src={project.image}
          alt={`${project.name} screenshot`}
          fill
          sizes={featured ? "(min-width: 1024px) 680px, 100vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"}
          className="work-shot object-cover object-top"
        />
      </div>
    </div>
  );
}

function TechList({ techs }: { techs: string[] }) {
  const shown = techs.filter((t) => !HIDDEN_TECH.has(t));
  if (!shown.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Built with">
      {shown.map((tech) => (
        <li
          key={tech}
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border px-2.5 py-1 font-mono text-[11px] text-foreground/70"
        >
          {TECH_ICONS[tech] && (
            <Image src={TECH_ICONS[tech]} alt="" width={12} height={12} className="work-tech-icon opacity-80" />
          )}
          {tech}
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="relative z-10 flex items-center gap-1">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name} live site`}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-[var(--hero-accent)] hover:bg-foreground/5 transition-colors"
        >
          Live
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
      {project.codeUrl && (
        <a
          href={project.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.name} source code on GitHub`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <GithubIcon />
        </a>
      )}
    </div>
  );
}

function Hud() {
  return (
    <>
      <span className="work-hud work-hud-tl" aria-hidden="true" />
      <span className="work-hud work-hud-tr" aria-hidden="true" />
      <span className="work-hud work-hud-bl" aria-hidden="true" />
      <span className="work-hud work-hud-br" aria-hidden="true" />
    </>
  );
}

/** The card's title link is stretched over the whole card, so a click anywhere opens the project. */
function TitleLink({ project, className }: { project: Project; className: string }) {
  return (
    <h3 className={className}>
      <Link
        href={`/projects/${project.slug}`}
        className="after:absolute after:inset-0 after:rounded-[20px] after:content-[''] focus-visible:outline-none"
      >
        {project.name}
      </Link>
    </h3>
  );
}

export default function ProjectsGallery() {
  const all = (portfolioData.projects as Project[]).slice(0, 4);
  // The award-winning project leads; the rest keep their order.
  const featured = all.find((p) => p.badge) ?? all[0];
  const rest = all.filter((p) => p !== featured);
  const ordered = [featured, ...rest];
  const number = (p: Project) => String(ordered.indexOf(p) + 1).padStart(2, "0");

  // Same props on server and client (no hydration mismatch); a short, small fade-up.
  const reveal = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.08 },
  });

  return (
    <section id="portfolio" className="relative border-t border-card-border py-24 lg:py-32">
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12 lg:mb-16">
          <div>
            <p className="font-mono text-xs sm:text-sm tracking-[0.12em] uppercase text-foreground/65">
              <span className="font-bold text-[var(--hero-accent)]">Selected work</span>
              <span aria-hidden="true"> · </span>
              {String(all.length).padStart(2, "0")} projects
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02] text-foreground">
              Things I&apos;ve shipped
            </h2>
          </div>
          <p className="max-w-md font-inter text-base sm:text-lg leading-relaxed text-foreground/70">
            Products I designed and built end to end, from the first idea to real people using them.
          </p>
        </div>

        {/* Featured project */}
        <motion.article
          {...reveal(0)}
          onPointerMove={trackPointer}
          className="work-card group grid gap-8 p-6 lg:grid-cols-12 lg:items-center lg:gap-10 lg:p-8"
        >
          <span className="work-card-grid" aria-hidden="true" />
          <Hud />
          <div className="lg:col-span-7">
            <BrowserFrame project={featured} featured />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-bold text-[var(--hero-accent)]">{number(featured)}</span>
              {featured.badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hero-accent)]/40 bg-[var(--hero-accent-soft)] px-3 py-1 text-xs font-bold text-[var(--hero-accent)]">
                  <Trophy size={13} aria-hidden="true" />
                  {featured.badge}
                </span>
              )}
            </div>
            <TitleLink
              project={featured}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
            />
            <p className="font-inter text-base leading-relaxed text-foreground/70 line-clamp-4 lg:line-clamp-none">
              {featured.description}
            </p>
            <TechList techs={featured.techIcons ?? []} />
            <div className="flex items-center justify-between border-t border-card-border pt-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-[var(--hero-accent)] transition-colors">
                Case study
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <ProjectLinks project={featured} />
            </div>
          </div>
        </motion.article>

        {/* The rest */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => (
            <motion.article
              key={project.slug}
              {...reveal(i + 1)}
              onPointerMove={trackPointer}
              className="work-card group flex flex-col gap-5 p-6"
            >
              <span className="work-card-grid" aria-hidden="true" />
              <Hud />
              <BrowserFrame project={project} />
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--hero-accent)]">{number(project)}</span>
                  <TitleLink project={project} className="text-2xl font-bold tracking-tight text-foreground" />
                </div>
                <p className="font-inter text-sm leading-relaxed text-foreground/70 line-clamp-3">
                  {project.description}
                </p>
                <div className="mt-auto pt-2">
                  <TechList techs={project.techIcons ?? []} />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-card-border pt-3">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-[var(--hero-accent)] transition-colors">
                  Case study
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
                <ProjectLinks project={project} />
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex h-12 items-center gap-2 px-7 text-sm font-bold text-foreground border border-foreground/25 hover:border-foreground/70 hover:bg-foreground/5 transition-colors"
          >
            See all projects
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
