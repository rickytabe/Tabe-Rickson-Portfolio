"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ExternalLink, Plus } from "lucide-react";
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
    'React': '/react.svg',
    'TailwindCSS': '/tailwindcss.svg',
    'Supabase': '/supabase.svg',
    'OpenAI': '/openai.svg',
    'TypeScript': '/typescript.svg',
    'PostgreSQL': '/postgresql.svg',
    'Python': '/python.svg'
  };

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (iconMap[name]) {
    return (
      <Image 
        src={iconMap[name]} 
        width={16} 
        height={16} 
        alt={name} 
        className={`${className} opacity-80 ${mounted && resolvedTheme === "dark" ? "invert" : ""}`} 
      />
    );
  }

  switch (name) {
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

const MobileProjectImage = ({ project, imageSrc, accent }: { project: any, imageSrc: string, accent: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  if (!imageSrc) return null;

  return (
    <div ref={ref} className="block lg:hidden mt-8 relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-card-bg border border-card-border group">
      <motion.div style={{ y }} className="absolute -inset-8">
        <Image src={imageSrc} alt={project.name} fill className="object-contain p-6 md:p-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </div>
  );
};

const DesktopProjectDisplay = ({ activeProject, activeAccent, hoveredIdx }: { activeProject: any, activeAccent: string, hoveredIdx: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="hidden lg:block lg:col-span-5 relative perspective-[1200px]" ref={containerRef}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="sticky top-32 w-full aspect-square rounded-[2rem] overflow-hidden bg-card-bg border border-card-border shadow-2xl"
      >
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

        {/* Crossfading Parallax Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {activeProject && projectImages[activeProject.name] ? (
              <motion.div style={{ y: parallaxY, translateZ: 50 }} className="relative w-full h-full drop-shadow-2xl">
                <Image
                  src={projectImages[activeProject.name]}
                  alt={activeProject.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-foreground/20 font-mono tracking-widest text-sm uppercase">
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
        
        {/* Shine effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
          style={{
            background: useTransform(
              () => `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(255,255,255,0.8), transparent 40%)`
            )
          }}
        />
      </motion.div>
    </div>
  );
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
      {/* Floating Code Symbol Background Illustration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="sticky top-[30vh] mt-[15vh] md:mt-[20vh] left-0 right-0 mx-auto w-[250px] md:w-[400px] lg:w-[500px] opacity-[0.12] animate-float" style={{ animationDuration: '10s' }}>
          <img
            src="/code-symbol.png"
            alt=""
            className="w-full h-auto object-contain block dark:hidden"
          />
          <img
            src="/code-symbol-light.png"
            alt=""
            className="w-full h-auto object-contain hidden dark:block"
          />
        </div>
      </div>

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
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: (i: number) => ({
                      opacity: 0,
                      x: -60,
                      y: 60,
                      scale: 0.95
                    }),
                    visible: (i: number) => ({
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 18,
                        mass: 1,
                        delay: i * 0.1
                      }
                    })
                  }}
                >
                  <div
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onClick={() => setHoveredIdx(idx)}
                    className={`group relative flex flex-col py-8 border-b border-card-border transition-all duration-500 cursor-pointer ${
                      isActive ? "pl-4 md:pl-8" : "hover:pl-2"
                    }`}
                    style={{ "--hover-accent": accent } as React.CSSProperties}
                  >
                    {/* Active Indicator Line */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-500 ease-out ${isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
                      style={{ backgroundColor: accent }}
                    />

                    <div className={`flex items-center gap-4 mb-4 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}>
                      <span className="font-mono text-sm md:text-base font-bold tracking-widest transition-colors duration-500" style={{ color: isActive ? accent : "inherit" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {hasBadge && (
                        <div 
                          className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-[10px] font-mono font-bold tracking-widest uppercase transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                          style={{ borderColor: `${accent}40`, backgroundColor: `${accent}15`, color: accent }}
                        >
                          🏆 {project.badge}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row items-center justify-between w-full gap-4">
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans tracking-tighter uppercase text-foreground">
                        {project.name}
                      </h3>
                      <div className={`shrink-0 transition-transform duration-500 ${isActive ? 'rotate-45' : 'opacity-40 group-hover:opacity-100'}`} style={{ color: isActive ? accent : 'var(--foreground)' }}>
                        <Plus size={32} strokeWidth={1.5} />
                      </div>
                    </div>

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
                        <div className="mt-6 p-6 md:p-8 rounded-2xl bg-background/30 dark:bg-card-bg/40 backdrop-blur-[3px] border border-card-border/50 shadow-sm relative overflow-hidden">
                          {/* Accent Gradient Glow inside the box */}
                          <div 
                            className="absolute top-0 left-0 w-full h-1 opacity-50"
                            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                          />
                          
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

                          {/* Mobile Inline Image Display with Parallax */}
                          <MobileProjectImage 
                            project={project} 
                            imageSrc={projectImages[project.name]} 
                            accent={accent} 
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Sticky Image Container (Desktop Only) with 3D Tilt & Parallax */}
          <DesktopProjectDisplay 
            activeProject={activeProject} 
            activeAccent={activeAccent} 
            hoveredIdx={hoveredIdx} 
          />
          
        </div>
      </div>
    </section>
  );
}
