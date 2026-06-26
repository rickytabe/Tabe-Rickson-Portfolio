"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { SECTION_STYLES } from "../utils/sectionStyles";
import { AnimatedText } from "@/components/ui/animated-text";
import portfolioData from "../../../portfolio-data.json";

/* ── Icons ── */
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MailIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const MapPinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SendIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
    <path d="m21.854 2.147-10.94 10.939" />
  </svg>
);

type FormMode = "hello" | "project";

const budgetOptions = ["< $500", "$500 – $2k", "$2k – $5k", "$5k+", "Not sure yet"];
const timelineOptions = ["ASAP", "1–2 weeks", "1 month", "Flexible"];

export default function Contact() {
  const [formMode, setFormMode] = useState<FormMode>("hello");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Let the native form submit to formsubmit.co
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const inputClasses =
    "w-full bg-transparent border border-foreground/30 dark:border-foreground/10 focus:border-[#39FF14]/50 px-5 py-4 text-sm font-inter text-foreground placeholder:text-foreground/25 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(57,255,20,0.08)]";

  const labelClasses =
    "block text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/40 mb-2";

  return (
    <section id="contact" className={SECTION_STYLES.wrapper}>
      <div className={SECTION_STYLES.container}>
        {/* Backdrop text */}
        <div className={SECTION_STYLES.backdropWrapper}>
          <span className={SECTION_STYLES.backdropText}>CONTACT</span>
        </div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={SECTION_STYLES.headerBadgeWrapper}>
            <span className={SECTION_STYLES.headerBadgeNumber}>06</span>
            <span className={SECTION_STYLES.headerBadgeLine}></span>
            <span className={SECTION_STYLES.headerBadgeText}>Contact</span>
          </div>
          <div className="flex flex-col items-start mb-4">
            <AnimatedText
              as="h2"
              text={<>Let&apos;s Build<br />Something.</>}
              className="items-start"
              textClassName="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight font-sans text-left"
              underlineClassName="text-[#39FF14]"
            />
          </div>
          <p className={`${SECTION_STYLES.description} mb-12`}>
            Got a project in mind, a question, or just want to connect? I&apos;m always open to new conversations and opportunities.
          </p>
        </motion.div>

        {/* Main content — two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
          
          {/* ── Left Column: Info + Socials ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {/* Contact info cards */}
            <div className="space-y-4">
              <a
                href="mailto:rickytabe2@gmail.com"
                className="group flex items-center gap-5 p-5 border border-foreground/30 dark:border-card-border hover:border-[#39FF14]/50 transition-all duration-500 bg-card-bg/50 shadow-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 group-hover:text-[#39FF14] group-hover:border-[#39FF14]/50 transition-all duration-500">
                  <MailIcon size={20} />
                </div>
                <div>
                  <div className={labelClasses}>Email</div>
                  <div className="text-sm font-inter text-foreground/90 dark:text-foreground/80 group-hover:text-[#39FF14] transition-colors">rickytabe2@gmail.com</div>
                </div>
              </a>
              <div className="flex items-center gap-5 p-5 border border-foreground/30 dark:border-card-border bg-card-bg/50 shadow-sm">
                <div className="w-12 h-12 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40">
                  <MapPinIcon size={20} />
                </div>
                <div>
                  <div className={labelClasses}>Location</div>
                  <div className="text-sm font-inter text-foreground/90 dark:text-foreground/80">Cameroon</div>
                </div>
              </div>
            </div>

            {/* Availability badge */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39FF14] shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
              </span>
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-foreground/70 dark:text-foreground/50">
                Available for work
              </span>
            </div>

            {/* Social links */}
            <div>
              <div className={`${labelClasses} mb-4`}>Find me on</div>
              <div className="flex items-center gap-3">
                {portfolioData.socials.github && (
                  <a
                    href={portfolioData.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:border-[#39FF14]/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 bg-background"
                  >
                    <GithubIcon size={18} />
                  </a>
                )}
                {portfolioData.socials.linkedin && (
                  <a
                    href={portfolioData.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:border-[#39FF14]/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 bg-background"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                )}
                {portfolioData.socials.twitter && (
                  <a
                    href={portfolioData.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:border-[#39FF14]/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 bg-background"
                  >
                    <TwitterIcon size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Decorative quote */}
            <div className="border-l-2 border-[#39FF14]/30 pl-6 py-2">
              <p className="text-foreground/30 text-sm font-inter italic leading-relaxed">
                &ldquo;The best way to predict the future is to build it.&rdquo;
              </p>
              <p className="text-foreground/20 text-xs font-mono mt-2 tracking-wider">— PETER DRUCKER</p>
            </div>
          </motion.div>

          {/* ── Right Column: The Dynamic Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative group/form"
          >
            <div className="relative border border-foreground/30 dark:border-card-border bg-card-bg/50 p-8 md:p-10 z-10 shadow-sm">
              {/* Success State */}
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-[#39FF14] flex items-center justify-center mb-6">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold font-sans text-foreground mb-3">Message Sent</h3>
                    <p className="text-foreground/50 font-inter text-sm max-w-xs">
                      Thanks for reaching out! I&apos;ll get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }}>
                    {/* Mode Toggle */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-10">
                      <button
                        type="button"
                        onClick={() => setFormMode("hello")}
                        className={`flex-1 py-3 px-5 text-[10px] font-mono tracking-[0.25em] uppercase border transition-all duration-300 ${
                          formMode === "hello"
                            ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_20px_rgba(57,255,20,0.15)] neon-text"
                            : "border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 hover:border-foreground/50 dark:hover:border-foreground/20 hover:text-foreground/80"
                        }`}
                      >
                        👋 Just saying hi
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormMode("project")}
                        className={`flex-1 py-3 px-5 text-[10px] font-mono tracking-[0.25em] uppercase border transition-all duration-300 ${
                          formMode === "project"
                            ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_20px_rgba(57,255,20,0.15)] neon-text"
                            : "border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 hover:border-foreground/50 dark:hover:border-foreground/20 hover:text-foreground/80"
                        }`}
                      >
                        🚀 I have a project
                      </button>
                    </div>

                    {/* The Form */}
                    <form
                      ref={formRef}
                      action="https://formsubmit.co/rickytabe2@gmail.com"
                      method="POST"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* FormSubmit config */}
                      <input type="hidden" name="_captcha" value="false" />
                      <input type="hidden" name="_template" value="table" />
                      <input type="hidden" name="_subject" value={formMode === "project" ? "New Project Inquiry — Portfolio" : "New Message — Portfolio"} />
                      <input type="hidden" name="inquiry_type" value={formMode === "project" ? "Project Inquiry" : "General Message"} />

                      {/* Name + Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClasses}>Name</label>
                          <input
                            type="text"
                            name="name"
                            required
                            placeholder="Your name"
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Email</label>
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      {/* ── Project-specific fields (animated) ── */}
                      <AnimatePresence initial={false}>
                        {formMode === "project" && (
                          <motion.div
                            key="project-fields"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-6 pt-2">
                              {/* Budget */}
                              <div>
                                <label className={labelClasses}>Budget Range</label>
                                <div className="flex flex-wrap gap-2">
                                  {budgetOptions.map((opt) => (
                                    <label key={opt} className="cursor-pointer">
                                      <input type="radio" name="budget" value={opt} className="peer sr-only" />
                                      <span className="inline-block px-4 py-2 text-[10px] font-mono tracking-wider uppercase border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 peer-checked:border-[#39FF14] peer-checked:text-[#39FF14] peer-checked:bg-[#39FF14]/5 peer-checked:neon-text hover:border-foreground/50 dark:hover:border-foreground/20 transition-all duration-300">
                                        {opt}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              {/* Timeline */}
                              <div>
                                <label className={labelClasses}>Timeline</label>
                                <div className="flex flex-wrap gap-2">
                                  {timelineOptions.map((opt) => (
                                    <label key={opt} className="cursor-pointer">
                                      <input type="radio" name="timeline" value={opt} className="peer sr-only" />
                                      <span className="inline-block px-4 py-2 text-[10px] font-mono tracking-wider uppercase border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 peer-checked:border-[#39FF14] peer-checked:text-[#39FF14] peer-checked:bg-[#39FF14]/5 peer-checked:neon-text hover:border-foreground/50 dark:hover:border-foreground/20 transition-all duration-300">
                                        {opt}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              {/* Project type */}
                              <div>
                                <label className={labelClasses}>Project Type</label>
                                <select
                                  name="project_type"
                                  className={`${inputClasses} appearance-none cursor-pointer`}
                                  defaultValue=""
                                >
                                  <option value="" disabled className="bg-background text-foreground/40">Select a type...</option>
                                  <option value="Website" className="bg-background text-foreground">Website</option>
                                  <option value="Web Application" className="bg-background text-foreground">Web Application</option>
                                  <option value="Mobile App" className="bg-background text-foreground">Mobile App</option>
                                  <option value="Dashboard / Admin Panel" className="bg-background text-foreground">Dashboard / Admin Panel</option>
                                  <option value="API / Backend" className="bg-background text-foreground">API / Backend</option>
                                  <option value="Other" className="bg-background text-foreground">Other</option>
                                </select>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Message */}
                      <div>
                        <label className={labelClasses}>
                          {formMode === "project" ? "Project Details" : "Message"}
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={5}
                          placeholder={
                            formMode === "project"
                              ? "Tell me about your project — what problem does it solve, who is it for, and what's your vision?"
                              : "What's on your mind?"
                          }
                          className={`${inputClasses} resize-none`}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full py-4 px-6 text-[11px] font-mono font-bold tracking-[0.3em] uppercase text-[#121212] overflow-hidden transition-all duration-300 disabled:opacity-50"
                        style={{ backgroundColor: "#39FF14" }}
                      >
                        <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                        <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-background transition-colors duration-300">
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              {formMode === "project" ? "Send Project Brief" : "Send Message"}
                              <SendIcon size={14} />
                            </>
                          )}
                        </span>
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-24 pt-10 border-t border-foreground/20 dark:border-card-border"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <span className="text-foreground font-sans font-bold text-sm tracking-widest">TABE RICKSON</span>
              <span className="hidden md:inline text-foreground/20">|</span>
              <span className="text-foreground/60 dark:text-foreground/40 font-inter text-xs">All rights reserved © {new Date().getFullYear()}</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs font-mono uppercase tracking-widest text-foreground/70 dark:text-foreground/50">
              <a href="#hero" className="hover:text-[#39FF14] hover:neon-text transition-all duration-300">Home</a>
              <a href="#about" className="hover:text-[#39FF14] hover:neon-text transition-all duration-300">About</a>
              <a href="#services" className="hover:text-[#39FF14] hover:neon-text transition-all duration-300">Services</a>
              <a href="#portfolio" className="hover:text-[#39FF14] hover:neon-text transition-all duration-300">Portfolio</a>
              <a href="#experience" className="hover:text-[#39FF14] hover:neon-text transition-all duration-300">Experience</a>
            </div>

            <div className="flex items-center gap-4">
              {portfolioData.socials.github && (
                <a href={portfolioData.socials.github} target="_blank" rel="noopener noreferrer" className="text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:neon-text transition-all duration-300">
                  <GithubIcon size={18} />
                </a>
              )}
              {portfolioData.socials.linkedin && (
                <a href={portfolioData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:neon-text transition-all duration-300">
                  <LinkedinIcon size={18} />
                </a>
              )}
              {portfolioData.socials.twitter && (
                <a href={portfolioData.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:neon-text transition-all duration-300">
                  <TwitterIcon size={18} />
                </a>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-foreground/60 dark:text-foreground/40 font-inter text-xs italic">Designed & coded with intention.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
