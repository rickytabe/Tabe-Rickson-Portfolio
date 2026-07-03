"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedText } from "@/components/ui/animated-text";

export default function Beliefs() {
  const expertise = [
    {
      title: "UI/UX & Frontend",
      description: "Designing futuristic interfaces that align aesthetics with function. Building immersive user interfaces with React, TailwindCSS, and animation-first workflows."
    },
    {
      title: "Backend & Systems",
      description: "Engineering robust, scalable APIs with Node.js and Supabase. Crafting secure backend systems optimized for performance and cloud integration."
    },
    {
      title: "AI Automation",
      description: "Integrating intelligent systems with OpenAI and Supabase edge functions. Automating tasks and building smarter apps with AI-first thinking."
    }
  ];

  return (
    <section 
      id="beliefs" 
      className="min-h-dvh flex flex-col justify-center pt-24 pb-12 px-8 lg:px-16 border-t border-card-border relative"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal
          direction="left"
          margin="-100px"
        >
          <div className="flex items-center gap-4 mb-6 font-mono text-xs tracking-[0.2em] text-[#39FF14] neon-text">
            <span className="font-bold text-sm">04</span>
            <span className="w-10 h-px bg-[#39FF14]/50"></span>
            <span className="text-foreground/50 uppercase font-semibold">Beliefs</span>
          </div>
          <div className="flex flex-col items-start mb-8">
            <AnimatedText
              as="h2"
              text={<>Core Beliefs &<br />Expertise.</>}
              className="items-start"
              textClassName="text-4xl md:text-5xl font-bold text-foreground tracking-tight font-sans text-left"
              underlineClassName="text-[#39FF14]"
            />
          </div>
          <p className="text-lg text-foreground/60 leading-relaxed font-light mb-8 font-inter">
            &quot;Design is not just what it looks like and feels like. Design is how it works.&quot;
          </p>
          <p className="text-sm text-foreground/40 leading-relaxed font-light font-inter">
            My philosophy revolves around building resilient architecture, defense-in-depth security, and prioritizing visual excellence. Whether developing platforms for local businesses in Cameroon or scalable cloud infrastructures, I ensure technology remains a force for good.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-8">
          {expertise.map((item, index) => (
            <ScrollReveal 
              key={index}
              direction="right"
              delay={index * 0.15}
              margin="-50px"
              className="flex gap-6 liquid-glass-pill p-6 transition-transform hover:-translate-x-2 duration-300"
            >
              <div className="text-[#39FF14] neon-text font-mono text-sm mt-1 relative z-10">0{index + 1}</div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-foreground mb-2 tracking-wide font-sans">{item.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed font-inter">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
