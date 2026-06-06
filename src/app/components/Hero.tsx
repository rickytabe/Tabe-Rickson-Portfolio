import Image from "next/image";
import type { CSSProperties } from "react";

export default function Hero() {
  const heroDelay = (delay: string) =>
    ({ "--hero-delay": delay } as CSSProperties);

  return (
    <section 
      id="hero" 
      className="min-h-dvh relative flex flex-col justify-between pt-24 pb-12 px-8 lg:px-16 overflow-hidden"
    >
      {/* Background Image Reveal */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="hero-bg-reveal absolute inset-0">
          <Image
            src="/hero_im.png"
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[center_right]"
          />
        </div>
      </div>
      {/* Top Metadata Row */}
      <div
        className="hero-fade-down flex justify-between items-start text-[10px] tracking-[0.2em] text-white/50 w-full max-w-7xl mx-auto z-10 font-mono relative pt-4"
      >
        <div className="w-1/2">CAMEROON-BUEA</div>
        <div className="w-1/2 text-right">SOFTWARE ENGINEER</div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-7xl  mx-auto z-10 mt-16">
        <div>
          {/* Massive Typography */}
          <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black leading-[0.85] tracking-tighter font-sans flex flex-col">
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block text-white" style={heroDelay("80ms")}>
                I BUILD
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block text-white" style={heroDelay("160ms")}>
                TECH THAT
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block" style={{ ...heroDelay("240ms"), color: "#39FF14" }}>
                CHANGES
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block text-white" style={heroDelay("320ms")}>
                LIVES.
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <div className="overflow-hidden mt-8 max-w-md">
            <p
              className="hero-line text-sm md:text-base text-white/60 leading-relaxed font-light font-inter"
              style={heroDelay("400ms")}
            >
              Hi, My name is <span className="font-bold text-white">Tabe Rickson</span>. I&apos;m a full-stack engineer based in Cameroon, passionate about crafting impactful digital solutions that empower communities and drive innovation. 
            </p>
          </div>

          {/* Buttons */}
          <div className="overflow-hidden mt-10">
            <div
              className="hero-line flex items-center gap-4"
              style={heroDelay("480ms")}
            >
              <a 
                href="#work" 
                className="group relative flex items-center gap-2 px-6 py-3 text-[10px] font-bold tracking-widest text-[#121212] overflow-hidden transition-all duration-300 font-mono"
                style={{ backgroundColor: "#39FF14" }}
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                <span className="relative z-10">SEE MY WORK</span>
                <svg className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a 
                href="#contact" 
                className="group relative flex items-center gap-2 px-6 py-3 text-[10px] font-bold tracking-widest text-white border border-white/20 hover:border-white/60 transition-all duration-300 font-mono"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-0"></div>
                <span className="relative z-10">LET&apos;S TALK</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Metadata */}
      <div
        className="hero-fade-left absolute bottom-12 right-8 lg:right-16 text-right z-10 font-mono"
      >
        <div className="text-[9px] tracking-[0.2em] text-white/50 mb-1">FULL-STACK ENGINEER</div>
        <div className="text-[10px] tracking-[0.15em] font-bold text-white uppercase">Freelancer - CAMEROON</div>
      </div>
      
      {/* Subtle dark gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-linear-to-r from-[#121212] via-[#121212]/80 to-transparent pointer-events-none z-0"></div>
    </section>
  );
}
 