"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GlassFilter, ProjectTile, SPRING, type Project } from "../components/ProjectTile";

/** Plain-language categories a visitor would browse by (a project can be in several). */
const CATEGORIES: Record<string, string[]> = {
  "mobi-rent": ["bookings", "payments"],
  "tutor-finder": ["ai", "learning"],
  "niatrust-wallet": ["payments"],
  startwise: ["ai", "learning"],
  cambrilia: ["ai"],
  "kmc-restaurant": ["shops", "bookings", "payments"],
  stepup: ["shops", "payments"],
  evogym: ["bookings", "payments"],
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "payments", label: "Payments" },
  { id: "shops", label: "Online shops" },
  { id: "bookings", label: "Bookings" },
  { id: "learning", label: "Learning" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<FilterId>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) for (const cat of CATEGORIES[p.slug] ?? []) c[cat] = (c[cat] ?? 0) + 1;
    return c;
  }, [projects]);

  const shown = filter === "all" ? projects : projects.filter((p) => CATEGORIES[p.slug]?.includes(filter));

  return (
    <MotionConfig reducedMotion="user">
      <GlassFilter />

      {/* Filter bar: a glass segmented control with a sliding selection */}
      <LayoutGroup id="project-filters">
        <div
          role="toolbar"
          aria-label="Filter projects"
          className="projects-filter mb-10 flex max-w-full gap-1 overflow-x-auto rounded-full p-1"
        >
          {FILTERS.filter((f) => counts[f.id]).map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`projects-filter-btn relative shrink-0 rounded-full px-4 h-10 text-[15px] font-semibold transition-colors ${
                  active ? "text-[#121212]" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-thumb"
                    className="absolute inset-0 rounded-full bg-[#39FF14]"
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  />
                )}
                <span className="relative">
                  {f.label}
                  <span className={`ml-1.5 text-[13px] ${active ? "text-[#121212]/60" : "text-foreground/40"}`}>
                    {counts[f.id]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>

      <motion.div layout className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={SPRING}
            >
              <ProjectTile project={project} index={i} headingLevel="h2" revealOnScroll={filter === "all"} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Closing call to action */}
      <section className="projects-cta mt-16 flex flex-col items-start gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em] text-foreground">
            Have something in mind?
          </h2>
          <p className="mt-3 max-w-xl font-inter text-[17px] leading-relaxed text-foreground/70">
            Tell me what you want to build. I&apos;ll reply with honest advice, a plan and a price.
          </p>
        </div>
        <Link
          href="/lets-work"
          className="group inline-flex h-12 shrink-0 items-center gap-2 px-7 text-sm font-bold text-[#121212] bg-[#39FF14] hover:bg-foreground hover:text-background active:scale-[0.97] transition-[color,background-color,transform] duration-300"
        >
          Start a project
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </section>
    </MotionConfig>
  );
}
