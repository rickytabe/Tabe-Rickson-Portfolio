"use client";

import Link from "next/link";
import { AnimatedText } from "@/components/ui/animated-text";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-background text-foreground px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[#39FF14]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className="relative animate-reveal-scale"
        >
          {/* Glitch-like stacked 404 text */}
          <h1 className="text-[120px] md:text-[200px] font-black font-sans leading-none tracking-tighter text-foreground relative z-10">
            404
          </h1>
          <h1 className="text-[120px] md:text-[200px] font-black font-sans leading-none tracking-tighter text-[#39FF14] absolute top-1 -left-2 opacity-50 z-0 select-none blur-[2px]">
            404
          </h1>
          <h1 className="text-[120px] md:text-[200px] font-black font-sans leading-none tracking-tighter text-foreground/20 absolute -top-1 left-2 opacity-50 z-0 select-none blur-[1px]">
            404
          </h1>
        </div>

        <div
          className="mt-6 mb-10 animate-reveal-up-static"
          style={{ animationDelay: '0.2s' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-sans mb-4">
            Page Not Found
          </h2>
          <p className="text-foreground/60 font-inter max-w-md mx-auto">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div
          className="animate-reveal-up-static"
          style={{ animationDelay: '0.4s' }}
        >
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#121212] overflow-hidden transition-all duration-300"
            style={{ backgroundColor: "#39FF14" }}
          >
            <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-background transition-colors duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-x-1">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Return Home
            </span>
          </Link>
        </div>
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
        }}
      />
    </main>
  );
}
