"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  MonitorSmartphone, 
  Cpu, 
  PenTool, 
  Landmark, 
  Cloud, 
  Building2 
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    id: "01",
    title: "Custom Web &\nMobile Apps",
    desc: "I build custom websites and mobile apps that help businesses and ideas become real, useful digital products. Whether you need a business website, booking platform, dashboard, customer app, or full web application, I create solutions that are fast, reliable, and built around the way your business actually works. My goal is to build software that improves operations, attracts customers, and helps businesses grow with confidence.",
    icon: <MonitorSmartphone size={40} strokeWidth={1.5} />
  },
  {
    id: "02",
    title: "AI Integration &\nAutomation",
    desc: "I help businesses save time and reduce stress by using AI and automation to handle repetitive tasks and improve workflows. This can include AI-powered features, automated customer support, document processing, smart dashboards, AI agents, and RAG-based systems for intelligent applications. The goal is simple: less manual work, faster processes, better service, and more time to focus on what truly matters.",
    icon: <Cpu size={40} strokeWidth={1.5} />
  },
  {
    id: "03",
    title: "UI/UX & Product\nExperience",
    desc: "I design modern, clean, and easy-to-use digital experiences that help users trust your product and navigate it with ease. I focus on creating interfaces that feel smooth, professional, and simple to understand while helping businesses turn visitors into active users, customers, or loyal clients.",
    icon: <PenTool size={40} strokeWidth={1.5} />
  },
  {
    id: "04",
    title: "Secure Financial\n& Payment Systems",
    desc: "I build secure systems for platforms that handle payments, transactions, user accounts, and sensitive data. Whether it is an online payment flow, wallet system, subscription platform, or financial dashboard, I focus on creating software that is stable, secure, and easy for users to trust and use every day.",
    icon: <Landmark size={40} strokeWidth={1.5} />
  },
  {
    id: "05",
    title: "Backend & Cloud\nInfrastructure",
    desc: "I build the systems behind the scenes that keep applications fast, organized, and dependable. From databases and APIs to cloud infrastructure and system integrations, I create strong foundations that help apps run smoothly, handle growth, and stay reliable as businesses expand.",
    icon: <Cloud size={40} strokeWidth={1.5} />
  },
  {
    id: "06",
    title: "Business Digitization\n& Internal Tools",
    desc: "I help businesses move from manual processes to modern digital systems that make daily operations easier and more organized. This can include admin dashboards, inventory systems, booking platforms, customer portals, internal tools, and business management software designed to save time, improve visibility, and simplify the way teams work.",
    icon: <Building2 size={40} strokeWidth={1.5} />
  }
];

function ServiceCard({ service, idx }: { service: Service; idx: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className="group relative p-[1px] overflow-hidden"
    >
      {/* Cursor-tracking border glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(57, 255, 20, 0.5), transparent 40%)`,
        }}
      />

      {/* Card body */}
      <div className="relative bg-[#0d0d0d] border border-white/4 flex flex-col h-full overflow-hidden">
        {/* Inner cursor glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(57, 255, 20, 0.04), transparent 40%)`,
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-8 md:p-9">
          <div className="flex justify-between items-start mb-10">
            <div className="text-white/50 group-hover:text-[#39FF14] group-hover:scale-110 transition-all duration-400 ease-out origin-top-left">
              {service.icon}
            </div>
            <div className="text-[10px] font-mono tracking-widest text-white/30 group-hover:text-[#39FF14] transition-colors duration-400 mt-1">
              {service.id}
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-bold font-sans text-white mb-4 whitespace-pre-line tracking-tight leading-tight">
            {service.title}
          </h3>
          <p className="text-white/50 font-inter text-[13px] leading-relaxed mt-auto">
            {service.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section 
      id="services" 
      className="snap-start min-h-dvh flex flex-col justify-center py-24 px-8 lg:px-16 border-t border-white/5 relative bg-[#121212] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Backdrop text — positioned behind the section title */}
        <div className="absolute top-0 left-0 pointer-events-none select-none z-0 -mt-12 md:-mt-20">
          <span className="text-[18vw] md:text-[12vw] font-black font-mono text-white/2 tracking-tighter whitespace-nowrap uppercase leading-none">
            Services
          </span>
        </div>
        
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6 font-mono text-xs tracking-[0.2em] text-[#39FF14] ">
            <span className="font-bold text-sm">02</span>
            <span className="w-10 h-px bg-[#39FF14]/50"></span>
            <span className="text-white/50 uppercase font-semibold">Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-white mb-6 tracking-tight uppercase">
            What I Do
          </h2>
          <p className="text-white/50 font-inter max-w-2xl text-sm leading-relaxed">
            I build software that improves operations, attracts customers, and helps businesses grow with confidence.
          </p>
        </motion.div>

        {/* Grid with backdrop text behind it */}
        <div className="relative">

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, idx) => (
              <ServiceCard key={service.id} service={service} idx={idx} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
