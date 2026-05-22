"use client";

import { motion } from "framer-motion";

export default function Experience() {
  const projects = [
    {
      name: "Mobi-Rent",
      description: "A secure and intelligent car rental platform built to transform the underdeveloped rental infrastructure in Cameroon. Empowers rental services and customers with seamless online booking, fleet management, and fraud prevention.",
      badge: "Local Infrastructure"
    },
    {
      name: "Tutor-Finder",
      description: "A full-stack platform connecting learners to tutors with live collaboration tools, API integrations, and an AI model that recommends the best tutor based on learning style and preferences. Developed during my Tech-Chantier internship.",
      badge: "AI & EdTech"
    },
    {
      name: "NiaTrust Wallet",
      description: "A fintech escrow and savings solution enabling secure peer-to-peer transactions, group savings, and conditional fund releases — designed to revolutionize online financial trust and collaboration.",
      badge: "FinTech"
    },
    {
      name: "StartWise",
      description: "Hackathon-winning platform (Code4Change 2025) guiding aspiring tech professionals with real-time mentorship, AI-powered career navigation, and access to local and remote job or internship opportunities.",
      badge: "Hackathon Winner"
    }
  ];

  return (
    <section 
      id="experience" 
      className="snap-start min-h-[100dvh] flex flex-col justify-center pt-24 pb-12 px-8 lg:px-16 border-t border-white/5 relative"
    >
      <div className="max-w-8xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-xs tracking-[0.2em] text-[#39FF14]">
              <span className="font-bold text-sm">03</span>
              <span className="w-10 h-px bg-[#39FF14]/50"></span>
              <span className="text-white/50 uppercase font-semibold">Experience</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold text-white tracking-tight font-sans"
            >
              Experience &<br/>Selected Works.
            </h2>
          </div>
          <div className="hidden md:block text-right text-xs tracking-[0.2em] text-white/40 uppercase font-mono pb-2">
            Curated Projects
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group p-8 liquid-glass-pill transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-[#39FF14] transition-colors duration-300 font-sans">
                  {project.name}
                </h3>
                <span className="text-[9px] tracking-widest text-[#39FF14] border border-[#39FF14]/30 px-2 py-1 rounded-full uppercase font-mono">
                  {project.badge}
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed font-light relative z-10 font-inter">
                {project.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
