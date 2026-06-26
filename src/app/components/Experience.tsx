"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SECTION_STYLES } from "../utils/sectionStyles";
import { AnimatedText } from "@/components/ui/animated-text";

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
    image: "/journey_started.png, /devfest.png, /aws.png, /bwa.png"
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
    image: "/first-real.png"
  },
  {
    year: "March 2025",
    title: "First Hackathon",
    description: "Code4Change Hackathon by DeltechHub. Four of us, one week, barely recovered from the bootcamp. We shipped. Didn't win, but learned that getting something out the door matters more than waiting for it to be perfect.",
    image: "/first-hack.png, /first-hack2.png"
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
    image: "/rough-m.png"
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
    image: "/stillait.png"
  }
];

/* ── Single timeline entry ── */
function TimelineEntry({ item, index }: { item: typeof timelineData[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = item.image ? item.image.split(',').map(s => s.trim()).filter(Boolean) : [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* ── Desktop layout (md+) ── */}
      <div className={`hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-0 items-start`}>

        {/* Left column */}
        <div className={`flex ${isEven ? 'justify-end pr-12' : 'justify-start pl-12'} ${isEven ? 'order-1' : 'order-3'}`}>
          <div className={`max-w-md transition-transform duration-500 group-hover:-translate-y-2 ${isEven ? 'text-right' : 'text-left'}`}>
            {/* Year chip */}
            <motion.span
              className="inline-block font-mono text-xs tracking-[0.3em] uppercase px-3 py-1 mb-5 border border-[#39FF14]/30 text-[#39FF14] bg-black"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {item.year}
            </motion.span>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-bold font-sans text-foreground mb-4 tracking-tight leading-tight group-hover:text-[#39FF14] transition-colors duration-500 neon-text">
              {item.title}
            </h3>

            {/* Accent line */}
            <div className={`h-[2px] bg-gradient-to-r ${isEven ? 'from-transparent via-[#39FF14]/40 to-[#39FF14]' : 'from-[#39FF14] via-[#39FF14]/40 to-transparent'} mb-5 w-0 group-hover:w-full transition-all duration-700 ease-out`} />

            {/* Description */}
            <p className="text-foreground/55 font-inter text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Center dot + connector */}
        <div className="order-2 flex flex-col items-center relative z-10">
          {/* The dot */}
          <div className="relative">
            <div className={`w-4 h-4 rounded-full border-[3px] transition-all duration-500 ${isHovered ? 'border-[#39FF14] bg-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.6)]' : 'border-[#39FF14]/50 bg-background'}`} />
            {/* Ping animation on hover */}
            {isHovered && (
              <div className="absolute inset-0 rounded-full border-2 border-[#39FF14] animate-ping opacity-40" />
            )}
          </div>
        </div>

        {/* Right column — image reveal */}
        <div className={`flex ${isEven ? 'justify-start pl-12' : 'justify-end pr-12'} ${isEven ? 'order-3' : 'order-1'}`}>
          <div className={`relative w-full max-w-sm aspect-[4/3] overflow-hidden ${!isEven ? 'text-right' : ''}`}>
            {images.length > 0 ? (
              <div className="relative w-full h-full overflow-hidden group/img">
                <div className="absolute inset-0 w-full h-full transition-transform duration-700 scale-100 group-hover:scale-110">
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Rickson ${item.year} - ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        i === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    />
                  ))}
                </div>
                {/* Corner accent */}
                <div className={`absolute z-20 ${isEven ? 'top-0 left-0' : 'top-0 right-0'} w-8 h-8 pointer-events-none`}>
                  <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-full h-[2px] bg-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-[2px] h-full bg-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </div>
            ) : (
              /* No-image placeholder with styled treatment */
              <div className="w-full h-full flex items-center justify-center border border-dashed border-card-border bg-card-bg/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.03)_0%,transparent_70%)]" />
                <span className="font-mono text-[11px] tracking-[0.3em] text-foreground/15 uppercase">No Visual</span>
              </div>
            )}
          </div>

          {/* For the non-even side that shows text instead of image, 
              we need to show text on the right. Handled by the swap of order above. */}
        </div>
      </div>

      {/* ── Mobile layout (below md) ── */}
      <div className="md:hidden relative pl-10">
        {/* Left dot */}
        <div className="absolute left-0 top-1 -translate-x-1/2 z-10">
          <div className={`w-3.5 h-3.5 rounded-full border-[3px] transition-all duration-500 ${isHovered ? 'border-[#39FF14] bg-[#39FF14] shadow-[0_0_14px_rgba(57,255,20,0.5)]' : 'border-[#39FF14]/50 bg-background'}`} />
        </div>

        {/* Year */}
        <span className="inline-block font-mono text-[10px] tracking-[0.3em] uppercase px-2 py-0.5 mb-3 border border-[#39FF14]/30 text-[#39FF14] bg-black">
          {item.year}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold font-sans text-foreground mb-3 tracking-tight leading-tight group-hover:text-[#39FF14] transition-colors duration-500 neon-text">
          {item.title}
        </h3>

        {/* Mobile image reveal */}
        {images.length > 0 && (
          <div className="relative w-full aspect-video overflow-hidden mb-5 rounded-sm border border-card-border/50 group/img">
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 scale-100 group-hover:scale-105">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Rickson ${item.year} - ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    i === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-foreground/55 font-inter text-sm leading-relaxed transition-transform duration-500 group-hover:-translate-y-1">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  // Grow the vertical line based on scroll
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="min-h-screen py-24 px-8 lg:px-16 border-t border-card-border relative bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* ── Header Section ── */}
        <div className="mb-24 relative">
          <div className={SECTION_STYLES.backdropWrapper}>
            <span className={SECTION_STYLES.backdropText}>JOURNEY</span>
          </div>

          <div className={SECTION_STYLES.headerBadgeWrapper}>
            <span className={SECTION_STYLES.headerBadgeNumber}>05</span>
            <span className={SECTION_STYLES.headerBadgeLine} />
            <span className={SECTION_STYLES.headerBadgeText}>
              The Story So Far
            </span>
          </div>

          <AnimatedText
            as="h2"
            text="Experience & Timeline"
            className="items-start mb-6"
            textClassName={SECTION_STYLES.title}
            underlineClassName="text-[#39FF14]"
          />
          <p className={SECTION_STYLES.description}>
            The path hasn&apos;t always been clean, but it&apos;s been real. Here is the timeline of my journey.
          </p>

          {/* Decorative stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-12 mt-10 font-mono text-xs tracking-widest"
          >
            <div>
              <span className="block text-3xl font-bold text-foreground mb-1">4+</span>
              <span className="text-foreground/40 uppercase">Years Coding</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-foreground mb-1">15+</span>
              <span className="text-foreground/40 uppercase">Projects</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-foreground mb-1">∞</span>
              <span className="text-foreground/40 uppercase">Curiosity</span>
            </div>
          </motion.div>
        </div>

        {/* ── Timeline ── */}
        <div className="relative">

          {/* Desktop: centre vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
            {/* Background track */}
            <div className="w-[1px] h-full bg-card-border" />
            {/* Animated fill */}
            <motion.div
              className="absolute top-0 left-0 w-[1px] bg-gradient-to-b from-[#39FF14] via-[#39FF14]/60 to-[#39FF14]/10 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Mobile: left vertical line */}
          <div className="md:hidden absolute left-0 top-0 bottom-0">
            <div className="w-[1px] h-full bg-card-border" />
            <motion.div
              className="absolute top-0 left-0 w-[1px] bg-gradient-to-b from-[#39FF14] via-[#39FF14]/60 to-[#39FF14]/10 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Entries */}
          <div className="space-y-20 md:space-y-28">
            {timelineData.map((item, index) => (
              <TimelineEntry key={index} item={item} index={index} />
            ))}
          </div>

          {/* End marker */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mt-16"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-3 h-3 rotate-45 border-2 border-[#39FF14] bg-[#39FF14]/20" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-foreground/30 uppercase">
                More to come
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
