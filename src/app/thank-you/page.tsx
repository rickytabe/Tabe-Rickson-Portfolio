import Navbar from "../components/Navbar";
import { InteractiveBackground } from "../components/InteractiveBackground";
import { AnimatedText } from "@/components/ui/animated-text";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | Tabe Rickson",
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <InteractiveBackground>
      <div className="flex flex-col min-h-screen overflow-x-clip relative z-10">
        <Navbar />
        
        <main className="flex-1 flex flex-col justify-center items-center py-32 px-6">
          <div className="text-center max-w-2xl mx-auto border border-foreground/30 dark:border-card-border bg-card-bg/50 p-10 shadow-sm relative group">
             {/* Decorative Corner Borders */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#39FF14]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#39FF14]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#39FF14]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#39FF14]"></div>

            <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#39FF14] flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            
            <AnimatedText
              as="h1"
              text="Thank You!"
              className="justify-center mb-4"
              textClassName="text-4xl md:text-5xl font-bold text-foreground tracking-tight font-sans text-center"
              underlineClassName="text-[#39FF14]"
            />
            
            <p className="text-foreground/70 mb-8 font-inter">
              Your message has been successfully received. I appreciate you taking the time to reach out and will get back to you as soon as possible.
            </p>

            <Link href="/" className="inline-block group relative py-3 px-8 text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#121212] overflow-hidden transition-all duration-300" style={{ backgroundColor: "#39FF14" }}>
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-background transition-colors duration-300">
                Back to Home
              </span>
            </Link>
          </div>
        </main>
        
        {/* Simple Footer derived from Contact.tsx */}
        <footer className="py-10 border-t border-foreground/20 dark:border-card-border px-6 max-w-[1400px] mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <span className="text-foreground font-sans font-bold text-sm tracking-widest">TABE RICKSON</span>
              <span className="hidden md:inline text-foreground/20">|</span>
              <span className="text-foreground/60 dark:text-foreground/40 font-inter text-xs">All rights reserved © {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-foreground/60 dark:text-foreground/40 font-inter text-xs italic">Designed & coded with intention.</span>
            </div>
          </div>
        </footer>
      </div>
    </InteractiveBackground>
  );
}
