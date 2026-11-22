"use client";

import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SECTION_STYLES } from "../utils/sectionStyles";

const timelineData = [
  {
    year: "2022",
    title: "The Beginning",
    description: "Started university at Buea, Maths major, CS minor. First time properly writing code. Algorithms, Data Structures, C, Python. It was mostly coursework at that point, not yet something I cared deeply about.",
    image: "/first-year(2022).png"
  },
  {
    year: "2023",
    title: "My Tech Journey begins",
    description: "Second year, something shifted. I started actually enjoying it, staying up late to figure things out, not because I had to. Joined Google developers group on campus. Being around other people who were building things made a difference.",
    image: "/devfest.png, /aws.png, /bwa.png,/rnn24.png"
  },
  {
    year: "Early 2024",
    title: "Trial and Error",
    description: "Tried Flutter for mobile development. Hit a wall — hardware constraints, not much local community support. Moved to React instead, shipped a few frontend projects, then started learning Node.js on the backend side. Learned more from the pivoting than from sticking to the plan.",
    image: "/trail-error.png"
  },
  {
    year: "Dec 2024 – Mar 2025",
    title: "First Real Pressure",
    description: "Joined the RNN24 Bootcamp by Tech Chantier. Three months of actual deadlines and accountability. Built Tutor Finder — a platform for connecting learners with local tutors. First time the work felt less like practice and more like something real.",
    image: "/first-real.png, /rnn24_1.png, /rnn24_2.png"
  },
  {
    year: "March 2025",
    title: "First Hackathon",
    description: "Code4Change Hackathon by DeltechHub. Four of us, one week, barely recovered from the bootcamp. We shipped. Didn't win, but learned that getting something out the door matters more than waiting for it to be perfect.",
    image: "/first-hack.png, /first-hack2.png, /c4c.png"
  },
  {
    year: "Apr – Aug 2025",
    title: "First Work",
    description: "A few freelance projects came through. Nothing huge, but they were paid and they were mine. In August, followed up with Tech Chantier and got a fullstack internship. Things were moving.",
    image: "/fw.png"
  },
  {
    year: "October 2025",
    title: "A Rough Month",
    description: "Power cuts at home became a consistent problem. The internship ended. Phone broke. Laptop broke — same week. It wasn't a crisis of confidence, just bad timing and circumstance stacking up. Had to wait it out.",
    image: "/rough-m.png, /codingnight.png"
  },
  {
    year: "Nov 2025 – Jan 2026",
    title: "Getting Back",
    description: "Got a new phone in November, a laptop in January. No big reset, no dramatic comeback story. Just picked up where I left off and kept going.",
    image: "/back.png"
  },
  {
    year: "2026",
    title: "Still at It",
    description: "Shipping across web, mobile, and AI. Some things are going well, some are still figuring themselves out. The journey's been uneven, but it's been honest — and there's still a lot I want to build.",
    image: "/stillait.png, /pawapay2.png, /pawapay3.png, /pawapay4.png"
  }
];

type Entry = (typeof timelineData)[number];

const photosOf = (item: Entry) =>
  item.image ? item.image.split(",").map((s) => s.trim()).filter(Boolean) : [];

// Critically damped (no overshoot): content arriving on scroll isn't a flick.
const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;

function JourneyCard({ item, index }: { item: Entry; index: number }) {
  const photos = photosOf(item);
  const [shown, setShown] = useState(0);

  return (
    <motion.li
      className="journey-item"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...SPRING, delay: Math.min(index, 3) * 0.05 }}
    >
      <div className="journey-track" aria-hidden="true">
        <span className="journey-dot" />
        <span className="journey-year">{item.year}</span>
      </div>

      <article className="journey-card" aria-label={`${item.year}: ${item.title}`}>
        {photos.length > 0 && (
          <div className="journey-photo bg-card-bg">
            {photos.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={photos.length > 1 ? `${item.title}, photo ${i + 1} of ${photos.length}` : item.title}
                fill
                sizes="(max-width: 640px) 82vw, 360px"
                className={`object-cover ${i === shown ? "opacity-100" : "opacity-0"}`}
                aria-hidden={i !== shown}
              />
            ))}
            {photos.length > 1 && (
              <div className="journey-photo-dots">
                {photos.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className="journey-photo-dot"
                    aria-label={`Show photo ${i + 1} of ${photos.length}`}
                    aria-pressed={i === shown}
                    onPointerDown={() => setShown(i)}
                    onClick={() => setShown(i)}
                  >
                    <span />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col px-6 pt-5 pb-6">
          <h3 className="journey-title text-foreground">{item.title}</h3>
          <p className="mt-3 font-inter text-[15px] leading-relaxed text-foreground/75">{item.description}</p>
        </div>
      </article>
    </motion.li>
  );
}

export default function Experience() {
  const scrollerRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  // Move by one card; the snap points finish the landing.
  const step = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const card = el?.querySelector<HTMLElement>(".journey-item");
    if (!el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="experience"
        className="relative overflow-x-clip border-t border-card-border px-8 lg:px-16 py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto w-full">
          <header className="relative mb-12 lg:mb-14">
            <div className={SECTION_STYLES.backdropWrapper} aria-hidden="true">
              <span className={SECTION_STYLES.backdropText}>JOURNEY</span>
            </div>

            <div className="relative z-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="max-w-3xl">
                <p className="text-[15px] font-semibold tracking-[0.01em] text-[var(--hero-accent)]">The story so far</p>
                <h2 className="mt-3 text-[clamp(2.5rem,1.6rem+3vw,4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-foreground">
                  How I got here.
                </h2>
                <p className="mt-5 max-w-xl font-inter text-[17px] sm:text-lg leading-relaxed text-foreground/70">
                  The path hasn&apos;t always been clean, but it&apos;s been real. Swipe through the years.
                </p>
              </div>

              <dl className="flex gap-10">
                <div className="flex flex-col">
                  <dt className="order-2 mt-1 text-[13px] text-foreground/60">years coding</dt>
                  <dd className="text-4xl font-bold tracking-[-0.03em] text-foreground">4+</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="order-2 mt-1 text-[13px] text-foreground/60">projects</dt>
                  <dd className="text-4xl font-bold tracking-[-0.03em] text-foreground">15+</dd>
                </div>
              </dl>
            </div>
          </header>
        </div>

        {/* Full-bleed carousel whose first card lines up with the content column */}
        <ol
          ref={scrollerRef}
          className="journey-scroller"
          tabIndex={0}
          aria-label="Timeline from 2022 to today. Scroll sideways or use the arrow keys."
        >
          {timelineData.map((item, index) => (
            <JourneyCard key={item.title} item={item} index={index} />
          ))}
        </ol>

        <div className="max-w-7xl mx-auto w-full mt-8 flex items-center gap-6">
          <div className="journey-progress flex-1" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="journey-nav"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="journey-nav"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
