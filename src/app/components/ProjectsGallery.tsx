"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import portfolioData from "../../../portfolio-data.json";
import { SECTION_STYLES } from "../utils/sectionStyles";
import { AnimatedText } from "@/components/ui/animated-text";

const GithubIcon = ({ size = 20, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// Helper to generate a fallback SVG with an initial
const FallbackIcon = ({ text, className }: { text: string, className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
    <text x="12" y="16" fontSize="12" fontWeight="bold" textAnchor="middle" fill="currentColor">{text}</text>
  </svg>
);

const TechIcon = ({ name, className = "w-4 h-4" }: { name: string; className?: string }) => {
  const iconMap: Record<string, string> = {
    'Next.js': '/nextdotjs.svg',
    'Node.js': '/nodedotjs.svg',
    'Git': '/git.svg',
    'GitHub': '/github.svg',
    'Framer': '/framer.svg',
    'Firebase': '/firebase.svg',
    'Gemini': '/googlegemini.svg',
    'MongoDB': '/mongodb.svg',
    'HTML5': '/html5.svg',
    'JavaScript': '/javascript.svg',
  };

  if (iconMap[name]) {
    return <Image src={iconMap[name]} width={16} height={16} alt={name} className={`${className} invert opacity-80`} />;
  }

  switch (name) {
    case 'React':
      return (
        <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
          <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      );
    case 'TailwindCSS':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
        </svg>
      );
    case 'Supabase':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L1.442 13.845a.396.396 0 0 0 .32.634H12v8.959a.396.396 0 0 0 .716.233l9.842-13.683a.396.396 0 0 0-.32-.634Z" />
        </svg>
      );
    case 'OpenAI':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2057 5.9847 5.9847 0 0 0 3.989-2.9 6.051 6.051 0 0 0-.7388-7.0732zM13.2599 22.5002c-1.2242 0-2.3828-.4803-3.2678-1.3533L16.242 17.535l1.6268-.9401-1.6268-2.8152 2.6506-1.5303v3.7056c0 3.6593-2.9732 6.6346-6.6327 6.6346zm-7.6062-1.8906a5.132 5.132 0 0 1-1.644-2.8464l4.9084-2.8361.8134 1.4087-2.44 4.2255-2.6502 1.5292c-1.3202-1.3732-2.1382-3.238-2.1382-5.3015zm-2.0366-9.1554a5.13 5.13 0 0 1 2.8251-1.6315l1.6841 4.9143-1.6268.9413v4.8812L2.6506 18.25v-3.7056c0-1.8152.7423-3.551 2.0624-4.8219zM10.7401 1.4998c1.2241 0 2.3827.4804 3.2677 1.3534L7.758 6.465l-1.6267.9401 1.6267 2.8153L5.1074 11.75V8.0454c0-3.6593 2.9732-6.6346 6.6327-6.6346zm7.6061 1.8906a5.132 5.132 0 0 1 1.644 2.8464l-4.9083 2.836-.8134-1.4086 2.44-4.2256 2.6503-1.5292c1.3202 1.3733 2.1381 3.238 2.1381 5.3015zm2.0366 9.1554a5.13 5.13 0 0 1-2.825 1.6315l-1.6841-4.9142 1.6268-.9413v-4.8812l3.8549 2.226v3.7056c0 1.8152-.7423 3.551-2.0625 4.8219zM12 15.2285a3.2285 3.2285 0 1 1 0-6.457 3.2285 3.2285 0 0 1 0 6.457z"/>
        </svg>
      );
    default:
      return <FallbackIcon text={name.charAt(0)} className={className} />;
  }
};

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
  Evogym: "/evo-gym.png",
};

export default function ProjectsGallery() {
  const projects = portfolioData.projects;
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);

  const activeProject = projects[hoveredIdx];
  const activeAccent = cardAccents[hoveredIdx % cardAccents.length];

  return (
    <section
      id="portfolio"
      className="relative border-t border-card-border bg-transparent py-32"
    >
      <div className="max-w-7xl mx-auto w-full px-8 lg:px-16 relative z-10">
        
        {/* Backdrop text */}
        <div className={SECTION_STYLES.backdropWrapper}>
          <span className={SECTION_STYLES.backdropText}>PORTFOLIO</span>
        </div>

        {/* Header */}
        <div className={SECTION_STYLES.headerBadgeWrapper}>
          <span className={SECTION_STYLES.headerBadgeNumber}>04</span>
          <span className={SECTION_STYLES.headerBadgeLine}></span>
          <span className={SECTION_STYLES.headerBadgeText}>Portfolio</span>
        </div>
        
        <div className="flex flex-col items-start mb-16">
          <AnimatedText
            as="h2"
            text="Selected Works"
            className="items-start mb-6"
            textClassName={SECTION_STYLES.title}
            underlineClassName="text-[#39FF14]"
          />
          <p className={SECTION_STYLES.description}>
            Hover over each project to reveal its details. A minimalist collection of my best work.
          </p>
        </div>

        {/* Split Layout: List on Left, Image on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative mt-12">
          
          {/* Left Column: Interactive List */}
          <div className="lg:col-span-7 flex flex-col z-20">
            {projects.map((project, idx) => {
              const accent = cardAccents[idx % cardAccents.length];
              const isActive = hoveredIdx === idx;
              const hasBadge = "badge" in project && project.badge;
              const techIcons = "techIcons" in project ? project.techIcons as string[] : [];
              
              return (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={`group relative flex flex-col py-8 border-b border-card-border transition-all duration-500 cursor-default ${
                    isActive ? "opacity-100 pl-4 md:pl-8" : "opacity-40 hover:opacity-70"
                  }`}
                  style={{ "--hover-accent": accent } as React.CSSProperties}
                >
                  {/* Active Indicator Line */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-500 ease-out ${isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
                    style={{ backgroundColor: accent }}
                  />

                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-sm md:text-base font-bold tracking-widest transition-colors duration-500" style={{ color: isActive ? accent : "inherit" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {hasBadge && (
                      <div 
                        className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-[10px] font-mono font-bold tracking-widest uppercase transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                        style={{ borderColor: `${accent}40`, backgroundColor: `${accent}15`, color: accent }}
                      >
                        🏆 {project.badge}
                      </div>
                    )}
                  </div>

                  <h3 
                    className="text-4xl md:text-5xl lg:text-6xl font-black font-sans tracking-tighter uppercase transition-colors duration-500"
                    style={{ color: isActive ? "var(--foreground)" : "inherit" }}
                  >
                    {project.name}
                  </h3>

                  {/* Expanded Content (Visible only when active or on mobile) */}
                  <AnimatePresence>
                    {(isActive) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6">
                          
                          {/* Tech Icons */}
                          {techIcons.length > 0 && (
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                              {techIcons.map((tech) => (
                                <div
                                  key={tech}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card-bg border border-card-border/50 text-xs font-mono tracking-widest transition-colors hover:border-foreground/30 hover:bg-foreground/5"
                                  title={tech}
                                >
                                  <TechIcon name={tech} className="w-4 h-4 text-foreground/70" />
                                  <span className="text-foreground/70">{tech}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-foreground/60 font-inter text-sm md:text-base leading-relaxed max-w-lg mb-6">
                            {project.description}
                          </p>
                          
                          <div className="flex gap-6">
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-mono font-bold tracking-widest uppercase transition-colors hover:opacity-70" style={{ color: accent }}>
                                <ExternalLink size={16} /> Live Project
                              </a>
                            )}
                            {project.codeUrl && (
                              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-mono font-bold tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors">
                                <GithubIcon size={16} /> Source Code
                              </a>
                            )}
                          </div>

                          {/* Mobile Inline Image Display */}
                          <div className="block lg:hidden mt-8 relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-card-bg border border-card-border">
                             {projectImages[project.name] && (
                               <Image
                                 src={projectImages[project.name]}
                                 alt={project.name}
                                 fill
                                 className="object-contain p-6"
                               />
                             )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Sticky Image Container (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="sticky top-32 w-full aspect-square rounded-[2rem] overflow-hidden bg-card-bg border border-card-border shadow-2xl transition-all duration-700">
              
              {/* Dynamic Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] transition-opacity duration-700"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)', backgroundSize: '24px 24px' }}
              />

              {/* Dynamic Gradient Background */}
              <div 
                className="absolute inset-0 opacity-30 transition-colors duration-700"
                style={{ background: `radial-gradient(circle at center, ${activeAccent}40 0%, transparent 70%)` }}
              />

              {/* Crossfading Images */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  {activeProject && projectImages[activeProject.name] ? (
                    <div className="relative w-full h-full drop-shadow-2xl">
                      <Image
                        src={projectImages[activeProject.name]}
                        alt={activeProject.name}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="text-foreground/20 font-mono tracking-widest text-sm uppercase">
                      [ Visual Unavailable ]
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Corner Accent Glow */}
              <div 
                className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none transition-colors duration-700" 
                style={{ backgroundColor: `${activeAccent}60` }} 
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
