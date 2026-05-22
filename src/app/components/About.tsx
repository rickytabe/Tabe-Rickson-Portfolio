"use client";

import { motion } from "framer-motion";
import portfolioData from "../../../portfolio-data.json";
import { SECTION_STYLES } from "../utils/sectionStyles";

// Inline SVG components for updated brand logos
const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function About() {
  return (
    <section
      id="about"
      className={SECTION_STYLES.wrapper}
    >
      <div className={SECTION_STYLES.container}>
        {/* Backdrop text — positioned behind the section title */}
        <div className={SECTION_STYLES.backdropWrapper}>
          <span className={SECTION_STYLES.backdropText}>
            ABOUT-ME
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={SECTION_STYLES.headerBadgeWrapper}
        >
          <span className={SECTION_STYLES.headerBadgeNumber}>01</span>
          <span className={SECTION_STYLES.headerBadgeLine}></span>
          <span className={SECTION_STYLES.headerBadgeText}>About Me</span>
        </motion.div>
      </div>
       
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left Column: Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-square md:aspect-[4/5] "
        >
          <img
            src="/my_pic1.png"
            alt="Tabe Rickson"
            className="w-full h-full md:h-4/5 object-cover shadow-2xl  hover:grayscale-0 transition-all duration-700 relative z-10 mt-20"
          />
        </motion.div>

        {/* Right Column: Text & Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center relative"
        >
        

          <div className="relative z-10">
            <h4 className={SECTION_STYLES.subtitle}>
              Who am I?
            </h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-white mb-6 leading-tight tracking-tight capitalize">
              I'm Tabe Rickson, a Full-Stack Web & Mobile Software Engineer
            </h2>

            <p className="text-white/60 text-md leading-relaxed mb-8 font-light font-inter">
              I develop modern web and mobile applications with a focus on performance, scalability, and clean user experience. I also work with AI automation systems and RAG pipelines to build smarter and more efficient digital solutions. My goal is to create software that solves real-world problems and helps businesses and communities grow.
            </p>

            <hr className="border-white/10 mb-8" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white min-w-[60px]">Name:</span>
                <span className="text-white/60">Tabe Rickson</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white min-w-[60px]">From:</span>
                <span className="text-white/60">Cameroon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white min-w-[60px]">Email:</span>
                <span className="text-white/60">rickytabe2@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white min-w-[60px]">Status:</span>
                <span className="text-white/60">Available for Work</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-6">
                <a
                  href="/Tabe_Rickson_CV.pdf"
                  className="inline-block px-8 py-3 text-sm font-semibold font-mono tracking-widest text-[#121212] bg-[#39FF14] transition-all duration-300 hover:bg-[#4dff33] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] uppercase"
                >
                  Download CV
                </a>
                
                <div className="flex items-center gap-4">
                  {portfolioData.socials.github && (
                    <a 
                      href={portfolioData.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-[#39FF14] transition-all duration-300 hover:scale-110"
                    >
                      <GithubIcon size={24} />
                    </a>
                  )}
                  {portfolioData.socials.linkedin && (
                    <a 
                      href={portfolioData.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-[#39FF14] transition-all duration-300 hover:scale-110"
                    >
                      <LinkedinIcon size={24} />
                    </a>
                  )}
                  {portfolioData.socials.twitter && (
                    <a 
                      href={portfolioData.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-[#39FF14] transition-all duration-300 hover:scale-110"
                    >
                      <TwitterIcon size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
