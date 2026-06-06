"use client";

import { motion } from "framer-motion";
import { ExternalLink, Trophy } from "lucide-react";
import portfolioData from "../../../portfolio-data.json";
import { SECTION_STYLES } from "../utils/sectionStyles";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function Projects() {
  // Extract the specific projects we want to feature
  const featuredProject = portfolioData.projects.find((p) => p.name === "StartWise");
  const subProjects = portfolioData.projects.filter(
    (p) => p.name === "NiaTrust Wallet" || p.name === "Mobi-Rent"
  );

  return (
    <section id="projects" className="min-h-[100dvh] flex flex-col justify-center pt-24 pb-12 px-8 lg:px-16 border-t border-white/5 relative bg-[#121212]">
      <div className={SECTION_STYLES.container}>
        {/* Backdrop text */}
        <div className={SECTION_STYLES.backdropWrapper}>
          <span className={SECTION_STYLES.backdropText}>PROJECTS</span>
        </div>

        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className={SECTION_STYLES.headerBadgeWrapper}>
            <span className={SECTION_STYLES.headerBadgeNumber}>03</span>
            <span className={SECTION_STYLES.headerBadgeLine}></span>
            <span className={SECTION_STYLES.headerBadgeText}>Featured Work</span>
          </div>
          <h2 className={SECTION_STYLES.title}>Selected Projects</h2>
          <p className={SECTION_STYLES.description}>
            A showcase of award-winning platforms, secure financial tech, and solutions built for real-world impact.
          </p>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          
          {/* Main Featured Project (StartWise) - Full Width */}
          {featuredProject && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 group relative p-[1px] overflow-hidden"
            >
              <div className="relative bg-[#0d0d0d] border border-white/5 p-8 md:p-12 flex flex-col md:flex-row gap-10 h-full overflow-hidden">
                {/* Content Side */}
                <div className="flex-1 flex flex-col justify-center relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-full w-fit mb-6">
                    <Trophy size={14} className="text-[#39FF14]" />
                    <span className="text-[#39FF14] text-[11px] font-mono font-bold tracking-widest uppercase">
                      {featuredProject.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-bold font-sans text-white mb-6 tracking-tight leading-none group-hover:text-[#39FF14] transition-colors duration-500">
                    {featuredProject.name}
                  </h3>
                  
                  <p className="text-white/60 text-sm md:text-md font-inter leading-relaxed max-w-xl mb-10">
                    {featuredProject.description}
                  </p>

                  <div className="flex items-center gap-6 mt-auto">
                    {featuredProject.liveUrl && (
                      <a
                        href={featuredProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-mono tracking-widest text-[#121212] bg-[#39FF14] px-6 py-3 transition-all duration-300 hover:bg-[#4dff33] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] uppercase font-semibold"
                      >
                        Live Project <ExternalLink size={16} />
                      </a>
                    )}
                    {featuredProject.codeUrl && (
                      <a
                        href={featuredProject.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-mono tracking-widest text-white/50 hover:text-white transition-colors duration-300 uppercase"
                      >
                        <GithubIcon size={20} /> Code
                      </a>
                    )}
                  </div>
                </div>

                {/* Abstract Visual Side (Simulating a mockup area) */}
                <div className="flex-1 relative min-h-[300px] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden group-hover:bg-white/[0.04] transition-colors duration-700">
                  {/* Subtle glowing orb behind */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#39FF14]/10 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
                  
                  {/* Grid pattern overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
                  />

                  <div className="text-white/10 font-mono text-sm tracking-widest">
                    [ PROJECT VISUAL ]
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sub Projects (Side by Side) */}
          {subProjects.map((project, idx) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-[1px] overflow-hidden flex flex-col"
            >
              <div className="relative bg-[#0d0d0d] border border-white/5 p-8 md:p-10 flex flex-col h-full overflow-hidden">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-16">
                    <div className="text-white/30 font-mono text-5xl font-black tracking-tighter opacity-50 group-hover:opacity-100 group-hover:text-[#39FF14] transition-all duration-500">
                      0{idx + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-sans text-white mb-4 tracking-tight group-hover:text-[#39FF14] transition-colors duration-500">
                    {project.name}
                  </h3>
                  
                  <p className="text-white/50 font-inter text-sm leading-relaxed mb-10 flex-1">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-6 mt-auto border-t border-white/5 pt-6">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/50 hover:text-[#39FF14] transition-colors duration-300"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                    {project.codeUrl && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/50 hover:text-white transition-colors duration-300"
                      >
                        <GithubIcon size={20} />
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Subtle hover gradient */}
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#39FF14]/5 blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
          
        </div>
      </div>
    </section>
  );
}
