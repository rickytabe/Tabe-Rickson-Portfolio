"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { AnimatedText } from "@/components/ui/animated-text";
import { InteractiveBackground } from "../components/InteractiveBackground";
import portfolioData from "../../../portfolio-data.json";
import { FaWhatsapp } from "react-icons/fa";

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



const SendIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
    <path d="m21.854 2.147-10.94 10.939" />
  </svg>
);

export default function LetsWorkPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      const response = await fetch("https://formsubmit.co/ajax/rickytabe2@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          _subject: "New Project Inquiry — Portfolio",
          _captcha: "false",
          _template: "table",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success === "true") {
        toast.success("Inquiry sent successfully!");
        form.reset();
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/thank-you");
        }, 2000);
      } else {
        toast.error("Failed to send inquiry. Please try again.");
        setIsSubmitting(false);
      }
    } catch {
      toast.error("Failed to send inquiry. Please check your connection.");
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full bg-foreground/5 border border-foreground/30 dark:border-foreground/10 focus:border-[#39FF14]/50 px-5 py-4 text-sm font-inter text-foreground placeholder:text-foreground/40 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(57,255,20,0.08)] backdrop-blur-sm";

  const labelClasses =
    "block text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/40 mb-2";

  return (
    <InteractiveBackground>
      <main className="relative min-h-screen bg-transparent text-foreground pt-20 pb-24 px-6 md:px-12 overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: '16px',
            padding: '16px 24px',
            maxWidth: '500px',
          }
        }}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
        
          
          <AnimatedText
            as="h1"
            text={<>Let&apos;s Build<br />Something.</>}
            className="items-start"
            textClassName="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight font-sans text-left"
            underlineClassName="text-[#39FF14]"
          />
          <p className="text-foreground/60 font-inter max-w-2xl mt-6 text-lg">
            Ready to start your next project? Fill out the form below with your details and I&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          {/* Left Column: Socials and Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <h3 className={`${labelClasses} !text-sm !text-foreground/80 mb-6`}>Direct Contact</h3>
              <div className="space-y-4">
                <a
                  href="https://wa.me/237671353341"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 p-5 border border-foreground/30 dark:border-card-border hover:border-[#39FF14]/50 transition-all duration-500 bg-card-bg/90 backdrop-blur-md shadow-sm"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 group-hover:text-[#39FF14] group-hover:border-[#39FF14]/50 transition-all duration-500">
                    <FaWhatsapp size={24} />
                  </div>
                  <div>
                    <div className={labelClasses}>WhatsApp</div>
                    <div className="text-sm font-inter text-foreground/90 dark:text-foreground/80 group-hover:text-[#39FF14] transition-colors">
                      +237 671 353 341
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:rickytabe2@gmail.com"
                  className="group flex items-center gap-5 p-5 border border-foreground/30 dark:border-card-border hover:border-[#39FF14]/50 transition-all duration-500 bg-card-bg/90 backdrop-blur-md shadow-sm"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 group-hover:text-[#39FF14] group-hover:border-[#39FF14]/50 transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <div className={labelClasses}>Email</div>
                    <div className="text-sm font-inter text-foreground/90 dark:text-foreground/80 group-hover:text-[#39FF14] transition-colors">rickytabe2@gmail.com</div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className={`${labelClasses} !text-sm !text-foreground/80 mb-6`}>Social Profiles</h3>
              <div className="flex gap-4">
                {portfolioData.socials.github && (
                  <a
                    href={portfolioData.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-14 h-14 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:border-[#39FF14]/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 bg-card-bg/90 backdrop-blur-md"
                  >
                    <GithubIcon size={24} />
                  </a>
                )}
                {portfolioData.socials.linkedin && (
                  <a
                    href={portfolioData.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-14 h-14 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:border-[#39FF14]/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 bg-card-bg/90 backdrop-blur-md"
                  >
                    <LinkedinIcon size={24} />
                  </a>
                )}
                {portfolioData.socials.twitter && (
                  <a
                    href={portfolioData.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-14 h-14 flex items-center justify-center border border-foreground/30 dark:border-foreground/10 text-foreground/60 dark:text-foreground/40 hover:text-[#39FF14] hover:border-[#39FF14]/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 bg-card-bg/90 backdrop-blur-md"
                  >
                    <TwitterIcon size={24} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: The Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative group/form"
          >
            <div className="relative border border-foreground/30 dark:border-card-border bg-card-bg/90 backdrop-blur-xl p-8 md:p-12 z-10 shadow-lg">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-[#39FF14] flex items-center justify-center mb-6">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold font-sans text-foreground mb-4">Inquiry Sent</h3>
                    <p className="text-foreground/60 font-inter text-base max-w-sm">
                      Thank you for reaching out! I&apos;ve received your project details and will be in touch shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_subject" value="New Project Inquiry — Portfolio" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className={labelClasses}>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Tabe Rickson"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="tabe@example.com"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className={labelClasses}>WhatsApp / Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+237 671 353 341"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Project Type</label>
                        <div className="relative">
                          <select
                            name="project_type"
                            required
                            className={`${inputClasses} appearance-none bg-transparent cursor-pointer`}
                            defaultValue=""
                          >
                            <option value="" disabled className="bg-background text-foreground/50">Select an option...</option>
                            <option value="Web Development" className="bg-background text-foreground">Web Development</option>
                            <option value="Mobile App" className="bg-background text-foreground">Mobile App Development</option>
                            <option value="UI/UX Design" className="bg-background text-foreground">UI/UX Design</option>
                            <option value="Full Stack System" className="bg-background text-foreground">Full Stack System</option>
                            <option value="Other" className="bg-background text-foreground">Other</option>
                          </select>
                          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-foreground/40">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m6 9 6 6 6-6"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClasses}>Project Details</label>
                      <textarea
                        name="details"
                        required
                        rows={6}
                        placeholder="Tell me a bit about your project goals, features you need, and any other important details..."
                        className={`${inputClasses} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-5 px-8 text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#121212] overflow-hidden transition-all duration-300 disabled:opacity-50 mt-4"
                      style={{ backgroundColor: "#39FF14" }}
                    >
                      <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                      <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-background transition-colors duration-300">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Inquiry
                            <SendIcon size={16} />
                          </>
                        )}
                      </span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      </main>
    </InteractiveBackground>
  );
}
