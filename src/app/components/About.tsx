"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import Image from "next/image";
import portfolioData from "../../../portfolio-data.json";
import { SECTION_STYLES } from "../utils/sectionStyles";
import SectionHeader from "./SectionHeader";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { ArrowDown } from "lucide-react";

// Inline SVG components for updated brand logos
const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIALS = [
  { href: portfolioData.socials.github, label: "GitHub", Icon: GithubIcon },
  { href: portfolioData.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: portfolioData.socials.twitter, label: "X (Twitter)", Icon: TwitterIcon },
].filter((s) => s.href);

export default function About() {
  return (
    <section id="about" className={SECTION_STYLES.wrapper}>
      <div className={SECTION_STYLES.container}>
        <ScrollReveal direction="up" margin="-100px">
          <SectionHeader className="mb-12 lg:mb-16" backdrop="ABOUT-ME" eyebrow="About me" title="Who I am." />
        </ScrollReveal>

        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Photo, framed like the hero portrait */}
          <ScrollReveal direction="up" margin="-100px" className="w-full max-w-[460px]">
            <div className="hero-portrait-frame aspect-[4/5]">
              <Image
                src="/my_pic1.png"
                alt="Tabe Rickson smiling, in a patterned shirt"
                fill
                sizes="(max-width: 767px) calc(100vw - 4rem), 460px"
                className="object-cover object-top"
              />
            </div>
          </ScrollReveal>

          {/* Story and details */}
          <ScrollReveal direction="up" margin="-100px" className="min-w-0">
            <TextRevealByWord
              as="h3"
              text="Hi, I'm Tabe. I turn ideas into software people enjoy using."
              className="text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.025em] text-foreground"
            />

            <div className="mt-6 space-y-4 font-inter text-[17px] leading-relaxed text-foreground/75">
              <p>
                I&apos;m a full-stack engineer from Buea, Cameroon. I build websites, mobile apps and AI tools for
                businesses, startups and communities, and I care about software that is fast, simple to use and
                solves a real problem.
              </p>
              <p>
                When I&apos;m not building for clients, I write study books for computer science students, so the
                hard topics finally make sense.
              </p>
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-card-border pt-6 text-[15px]">
              <div>
                <dt className="text-[13px] text-foreground/55">Email</dt>
                <dd className="mt-1">
                  <a
                    href="mailto:rickytabe2@gmail.com"
                    className="font-medium text-foreground hover:text-[var(--hero-accent)] transition-colors"
                  >
                    rickytabe2@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-foreground/55">Status</dt>
                <dd className="mt-1 inline-flex items-center gap-2 font-medium text-foreground">
                  <span className="w-2 h-2 rounded-full bg-[var(--hero-accent)]" aria-hidden="true" />
                  Available for work
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/Tabe_Rickson_CV.pdf"
                download
                className="group inline-flex h-12 items-center gap-2 px-7 text-sm font-bold text-[#121212] bg-[#39FF14] hover:bg-foreground hover:text-background active:scale-[0.97] transition-[color,background-color,transform] duration-300"
              >
                Download CV
                <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>

              <div className="flex items-center gap-1">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground/55 hover:text-[var(--hero-accent)] hover:bg-foreground/5 active:scale-95 transition-[color,background-color,transform] duration-200"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
