"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import portfolioData from "../../../portfolio-data.json";
import SectionHeader from "./SectionHeader";
import { GlassFilter, ProjectTile, type Project } from "./ProjectTile";

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

          <GlassFilter />

          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectTile key={project.slug} project={project} index={i} />
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
