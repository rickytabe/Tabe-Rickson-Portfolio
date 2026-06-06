"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
    image: "/hero_image.png"
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
    image: ""
  },
  {
    year: "March 2025",
    title: "First Hackathon",
    description: "Code4Change Hackathon by DeltechHub. Four of us, one week, barely recovered from the bootcamp. We shipped. Didn't win, but learned that getting something out the door matters more than waiting for it to be perfect.",
    image: "/my_pic1.png"
  },
  {
    year: "Apr – Aug 2025",
    title: "First Work",
    description: "A few freelance projects came through. Nothing huge, but they were paid and they were mine. In August, followed up with Tech Chantier and got a fullstack internship. Things were moving.",
    image: "/hero_image.png"
  },
  {
    year: "October 2025",
    title: "A Rough Month",
    description: "Power cuts at home became a consistent problem. The internship ended. Phone broke. Laptop broke — same week. It wasn't a crisis of confidence, just bad timing and circumstance stacking up. Had to wait it out.",
    image: "/my_pic1.png"
  },
  {
    year: "Nov 2025 – Jan 2026",
    title: "Getting Back",
    description: "Got a new phone in November, a laptop in January. No big reset, no dramatic comeback story. Just picked up where I left off and kept going.",
    image: "/hero_image.png"
  },
  {
    year: "2026",
    title: "Still at It",
    description: "Shipping across web, mobile, and AI. Some things are going well, some are still figuring themselves out. The journey's been uneven, but it's been honest — and there's still a lot I want to build.",
    image: "/my_pic1.png"
  }
];

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
      className="min-h-screen py-24 px-8 lg:px-16 border-t border-white/5 relative bg-[#121212] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header Section */}
        <div className="mb-24 relative">
          <div className={SECTION_STYLES.backdropWrapper}>
            <span className={SECTION_STYLES.backdropText}>JOURNEY</span>
          </div>

          <div className={SECTION_STYLES.headerBadgeWrapper}>
            <span className={SECTION_STYLES.headerBadgeNumber}>05</span>
            <span className={SECTION_STYLES.headerBadgeLine}></span>
            <span className={SECTION_STYLES.headerBadgeText}>
              The Story So Far
            </span>
          </div>
          
          <h2 className={SECTION_STYLES.title}>Experience & Timeline</h2>
          <p className={SECTION_STYLES.description}>
            The path hasn't always been clean, but it's been real. Here is the timeline of my journey.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-6xl mx-auto pl-4 md:pl-8">
          {/* Main vertical line background */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2"></div>
          
          {/* Animated vertical line fill */}
          <motion.div 
            className="absolute left-4 md:left-8 top-0 w-[2px] bg-gradient-to-b from-[#39FF14] via-[#39FF14]/50 to-transparent origin-top -translate-x-1/2"
            style={{ height: lineHeight }}
          ></motion.div>

          <div className="space-y-16 md:space-y-24">
            {timelineData.map((item, index) => {
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative pl-12 md:pl-20"
                >
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-8 md:top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-[#121212] border-4 border-[#39FF14]/50 shadow-[0_0_10px_rgba(57,255,20,0.3)] z-10 overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-[#39FF14]"></div>
                  </div>

                  {/* Content Card */}
                  <div className="group flex flex-col md:flex-row bg-[#0d0d0d] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden">
                    
                    {/* Text Side (Left) */}
                    <div className="flex-1 p-8 md:p-12 lg:p-16 relative flex flex-col justify-center order-2 md:order-1">
                      {/* Subtle background glow on hover */}
                      <div className="absolute top-0 left-0 w-32 h-32 bg-[#39FF14]/5 blur-[60px] pointer-events-none group-hover:bg-[#39FF14]/10 transition-colors duration-500"></div>

                      <span className="block text-[#39FF14] font-mono text-xs md:text-sm tracking-widest mb-4">
                        {item.year}
                      </span>
                      
                      <h3 className="text-2xl md:text-3xl font-bold font-sans text-white mb-6 tracking-tight group-hover:text-[#39FF14] transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      <p className="text-white/60 font-inter text-sm md:text-base leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </div>

                    {/* Image Side (Right) */}
                    <div className="w-full md:w-5/12 lg:w-1/2 h-64 md:h-125 min-h-75 relative overflow-hidden order-1 md:order-2 border-b md:border-b-0 md:border-l border-white/5">
                      <img 
                        src={item.image} 
                        alt={`Rickson ${item.year}`}
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
                      />
                      {/* Overlay gradient to blend image into the dark card */}
                      <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-[#0d0d0d] via-transparent to-transparent opacity-80"></div>
                      
                      {/* Accent line border bottom */}
                      <div className="absolute bottom-0 right-0 h-[2px] w-0 bg-[#39FF14] transition-all duration-500 ease-out group-hover:w-full"></div>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
