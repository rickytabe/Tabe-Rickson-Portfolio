import Image from "next/image";
import type { CSSProperties } from "react";

export default function Hero() {
  const heroDelay = (delay: string) =>
    ({ "--hero-delay": delay } as CSSProperties);

  return (
    <section 
      id="hero" 
      className="min-h-dvh relative flex flex-col justify-between pt-24 pb-12 px-8 lg:px-16 overflow-hidden bg-transparent"
    >
      {/* Removed Mobile Background Image to unify layout */}

      {/* Top Metadata Row */}
      <div
        className="hero-fade-down flex justify-between items-start text-[10px] tracking-[0.2em] text-foreground/50 w-full max-w-7xl mx-auto z-10 font-mono relative pt-4"
      >
        <div className="w-1/2">CAMEROON-BUEA</div>
        <div className="w-1/2 text-right">SOFTWARE ENGINEER</div>
      </div>

      {/* Main Content Area — two-column on lg */}
      <div className="flex flex-col lg:flex-row items-center justify-between flex-1 w-full max-w-7xl mx-auto z-10 mt-5 gap-8 lg:gap-8">
        
        {/* Left Column — Text */}
        <div className="flex-1 min-w-0">
          {/* Massive Typography */}
          <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black leading-[0.85] tracking-tighter font-sans flex flex-col">
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block text-foreground" style={heroDelay("80ms")}>
                I BUILD  
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block text-foreground" style={heroDelay("80ms")}>
               TECH THAT
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block" style={{ ...heroDelay("240ms"), color: "#39FF14" }}>
                CHANGES
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block text-foreground" style={heroDelay("320ms")}>
                LIVES.
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <div className="overflow-hidden mt-8 max-w-md">
            <p
              className="hero-line text-sm md:text-base text-foreground/60 leading-relaxed font-light font-inter"
              style={heroDelay("400ms")}
            >
              Hi, My name is <span className="font-bold text-foreground">Tabe Rickson</span>. I&apos;m a full-stack engineer based in Cameroon, passionate about crafting impactful digital solutions that empower communities and drive innovation. 
            </p>
          </div>

          {/* Buttons */}
          <div className="overflow-hidden mt-10">
            <div
              className="hero-line flex items-center gap-4"
              style={heroDelay("480ms")}
            >
              <a 
                href="#portfolio" 
                className="group relative flex items-center gap-2 px-6 py-3 text-[10px] font-bold tracking-widest text-[#121212] hover:text-background overflow-hidden transition-all duration-300 font-mono"
                style={{ backgroundColor: "#39FF14" }}
              >
                <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                <span className="relative z-10">SEE MY WORK</span>
                <svg className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a 
                href="#portfolio" 
                className="group relative flex items-center gap-2 px-6 py-3 text-[10px] font-bold tracking-widest text-foreground border border-foreground/20 hover:border-foreground/60 transition-all duration-300 font-mono"
              >
                <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-0"></div>
                <span className="relative z-10">LET&apos;S TALK</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column — Profile Picture with Spiral Aura */}
        <div 
          className="shrink-0 flex items-center justify-center mt-12 lg:mt-0"
        >
          <div className="hero-portrait-wrapper hero-portrait-roll-in">
            {/* Soft ambient glow behind the circle */}
            <div className="hero-portrait-glow" />

            {/* Rotating spiral ring */}
            <svg 
              className="hero-spiral-ring" 
              viewBox="0 0 400 400" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Spiral dots — placed along a circle path with varying opacity */}
              {Array.from({ length: 48 }).map((_, i) => {
                const angle = (i / 48) * Math.PI * 2;
                const radius = 194;
                const cx = 200 + Math.cos(angle) * radius;
                const cy = 200 + Math.sin(angle) * radius;
                // Create spiral effect: dots fade and vary in size
                const opacity = 0.15 + 0.55 * Math.sin((i / 48) * Math.PI * 2);
                const r = i % 6 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="#39FF14"
                    opacity={opacity}
                  />
                );
              })}
              {/* Thin arc segments for additional depth */}
              <circle cx="200" cy="200" r="194" stroke="#39FF14" strokeWidth="0.5" opacity="0.12" strokeDasharray="8 24" />
              <circle cx="200" cy="200" r="188" stroke="white" strokeWidth="0.3" opacity="0.06" strokeDasharray="4 32" />
            </svg>

            {/* The actual circular image */}
            <div className="hero-portrait-frame">
              <Image
                src="/my_pic1.png"
                alt="Tabe Rickson — Full-Stack Engineer"
                width={510}
                height={510}
                priority
                className="hero-portrait-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Metadata */}
      <div
        className="hero-fade-left absolute bottom-12 right-8 lg:right-16 text-right z-10 font-mono"
      >
        <div className="text-[9px] tracking-[0.2em] text-foreground/50 mb-1">FULL-STACK ENGINEER</div>
        <div className="text-[10px] tracking-[0.15em] font-bold text-foreground uppercase">Freelancer - CAMEROON</div>
      </div>
      
    </section>
  );
}
 