"use client";

import { motion } from "framer-motion";

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
      className="min-h-dvh flex flex-col justify-center pt-24 pb-12 px-8 lg:px-16 border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-6 font-mono text-xs tracking-[0.2em] text-[#39FF14]">
            <span className="font-bold text-sm">04</span>
            <span className="w-10 h-px bg-[#39FF14]/50"></span>
            <span className="text-white/50 uppercase font-semibold">Beliefs</span>
          </div>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight font-sans"
          >
            Core Beliefs &<br />Expertise.
          </h2>
          <div className="w-12 h-1 bg-[#39FF14] mb-8"></div>
          <p className="text-lg text-white/60 leading-relaxed font-light mb-8 font-inter">
            "Design is not just what it looks like and feels like. Design is how it works."
          </p>
          <p className="text-sm text-white/40 leading-relaxed font-light font-inter">
            My philosophy revolves around building resilient architecture, defense-in-depth security, and prioritizing visual excellence. Whether developing platforms for local businesses in Cameroon or scalable cloud infrastructures, I ensure technology remains a force for good.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {expertise.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-6 liquid-glass-pill p-6 transition-transform hover:-translate-x-2 duration-300"
            >
              <div className="text-[#39FF14] font-mono text-sm mt-1 relative z-10">0{index + 1}</div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-2 tracking-wide font-sans">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-inter">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
