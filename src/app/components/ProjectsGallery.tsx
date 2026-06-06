"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import portfolioData from "../../../portfolio-data.json";
import { SECTION_STYLES } from "../utils/sectionStyles";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// Color accents for each card to add variety
const cardAccents = [
  "#39FF14", // neon green
  "#00D4FF", // cyan
  "#FF6B35", // orange
  "#A855F7", // purple
  "#FF3366", // rose
  "#FACC15", // yellow
  "#22D3EE", // sky
  "#10B981", // emerald
];

const projectImages: Record<string, string> = {
  "Mobi-Rent": "/MobiRent.png",
  "Tutor-Finder": "/TutorFinder.png",
  "NiaTrust Wallet": "/NiaTrust.png",
  StartWise: "/StartWise.png",
  Cambrilia: "/Cambrillia.png",
  "KMC Restaurant": "/kmc-restaurant.png",
  stepUp: "/stepup.png",
};

export default function ProjectsGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const projects = portfolioData.projects;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map vertical scroll progress to horizontal translation
  // We need to move enough to reveal all cards
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["1%", "-58%"]
  );

  return (
    <section
      ref={containerRef}
      id="portfolio"
      className="relative border-t border-white/5 bg-[#121212] pb-10"
      // Height determines how much vertical scroll is needed to traverse all cards
      style={{ height: '700vh' }}
    >
      {/* Sticky viewport that stays pinned while content scrolls horizontally */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="pt-16 pb-2 px-8 lg:px-16 relative z-10">
          <div className="max-w-7xl mx-auto w-full relative">
            {/* Backdrop text */}
            <div className={SECTION_STYLES.backdropWrapper}>
              <span className={SECTION_STYLES.backdropText}>PORTFOLIO</span>
            </div>

            <div className={SECTION_STYLES.headerBadgeWrapper}>
              <span className={SECTION_STYLES.headerBadgeNumber}>04</span>
              <span className={SECTION_STYLES.headerBadgeLine}></span>
              <span className={SECTION_STYLES.headerBadgeText}>
                Portfolio
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h2 className={SECTION_STYLES.title}>Top Work</h2>
                <p className={SECTION_STYLES.description}>
                  Scroll to explore a curated selection of standout projects
                  I&apos;ve built.
                </p>
              </div>
              {/* Scroll hint */}
              <motion.div
                className="hidden md:flex items-center gap-3 text-white/30 text-sm font-mono tracking-wider"
                animate={{ x: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                SCROLL <ArrowRight size={16} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="flex-1 max-w-7xl flex items-center px-8 lg:px-16 min-h-0">
          <motion.div className="flex gap-6 " style={{ x }}>
            {projects.map((project, idx) => {
              const accent = cardAccents[idx % cardAccents.length];
              const hasBadge = "badge" in project && project.badge;
              const projectImage = projectImages[project.name];

              return (
                <div
                  key={project.name}
                  className="group relative shrink-0 w-[80vw] sm:w-[55vw] md:w-[40vw] lg:w-[32vw] xl:w-[26vw]"
                >
                  <div className="relative bg-[#0d0d0d] border border-white/5 flex flex-col h-full overflow-hidden transition-all duration-500 group-hover:border-white/10">
                    {/* Project visual */}
                    <div
                      className="relative w-full h-32 md:h-55 overflow-hidden border-b border-white/5"
                      style={{
                        background: `linear-gradient(135deg, ${accent}08 0%, ${accent}03 50%, transparent 100%)`,
                      }}
                    >
                      {projectImage && (
                        <Image
                          src={projectImage}
                          alt={`${project.name} preview`}
                          fill
                          sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 32vw, (min-width: 768px) 40vw, (min-width: 640px) 55vw, 80vw"
                          className="object-contain p-5 md:p-7 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      )}

                      {/* Grid pattern */}
                      <div
                        className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
                      />
                      {/* Number overlay */}
                      <span
                        className="absolute bottom-4 right-5 text-6xl md:text-7xl font-black font-mono tracking-tighter opacity-10 group-hover:opacity-30 transition-all duration-500"
                        style={{ color: accent }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {!projectImage && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/10 font-mono text-sm tracking-widest">
                          [ PROJECT VISUAL ]
                        </div>
                      )}
                      {hasBadge && (
                        <div
                          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 border rounded-full text-[10px] font-mono font-bold tracking-widest uppercase"
                          style={{
                            borderColor: `${accent}33`,
                            backgroundColor: `${accent}15`,
                            color: accent,
                          }}
                        >
                          🏆 {project.badge}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-5 md:p-6">
                      <h3
                        className="text-xl md:text-2xl font-bold font-sans text-white mb-3 tracking-tight transition-colors duration-500"
                        style={{ "--hover-color": accent } as React.CSSProperties}
                      >
                        <span className="group-hover:text-(--hover-color) transition-colors duration-500">
                          {project.name}
                        </span>
                      </h3>

                      <p className="text-white/50 font-inter text-xs md:text-sm leading-relaxed mb-4 flex-1 max-w-md">
                        {project.description}
                      </p>

                      {/* Action Links */}
                      <div className="flex items-center gap-4 border-t border-white/5 pt-3 mt-auto">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase transition-colors duration-300"
                            style={{ color: `${accent}99` }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = accent)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = `${accent}99`)
                            }
                          >
                            <ExternalLink size={16} /> Live
                          </a>
                        )}
                        {project.codeUrl && (
                          <a
                            href={project.codeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-mono tracking-widest text-white/40 hover:text-white transition-colors duration-300 uppercase"
                          >
                            <GithubIcon size={16} /> Code
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Bottom accent line that grows on hover */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out" style={{ backgroundColor: accent }} />
                    
                    {/* Subtle corner glow on hover */}
                    <div
                      className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: `${accent}20` }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
