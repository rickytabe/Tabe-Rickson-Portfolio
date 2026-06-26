"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import {
  MonitorSmartphone,
  Cpu,
  PenTool,
  Landmark,
  Cloud,
  Building2
} from "lucide-react";
import { SECTION_STYLES } from "../utils/sectionStyles";
import { AnimatedText } from "@/components/ui/animated-text";

interface Service {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  techIcons: { name: string; src: string }[];
}

const services: Service[] = [
  {
    id: "01",
    title: "Custom Web &\nMobile Apps",
    desc: "I build custom websites and mobile apps that help businesses and ideas become real, useful digital products. Whether you need a business website, booking platform, dashboard, customer app, or full web application, I create solutions that are fast, reliable, and built around the way your business actually works. My goal is to build software that improves operations, attracts customers, and helps businesses grow with confidence.",
    icon: <MonitorSmartphone size={40} strokeWidth={1.5} />,
    techIcons: [
      { name: "React", src: "/react.svg" },
      { name: "Next.js", src: "/nextdotjs.svg" },
      { name: "TypeScript", src: "/typescript.svg" },
      { name: "TailwindCSS", src: "/tailwindcss.svg" },
      { name: "HTML5", src: "/html5.svg" },
      { name: "JavaScript", src: "/javascript.svg" },
    ]
  },
  {
    id: "02",
    title: "AI Integration &\nAutomation",
    desc: "I help businesses save time and reduce stress by using AI and automation to handle repetitive tasks and improve workflows. This can include AI-powered features, automated customer support, document processing, smart dashboards, AI agents, and RAG-based systems for intelligent applications. The goal is simple: less manual work, faster processes, better service, and more time to focus on what truly matters.",
    icon: <Cpu size={40} strokeWidth={1.5} />,
    techIcons: [
      { name: "Python", src: "/python.svg" },
      { name: "OpenAI", src: "/openai.svg" },
      { name: "Gemini", src: "/googlegemini.svg" },
      { name: "Node.js", src: "/nodedotjs.svg" },
    ]
  },
  {
    id: "03",
    title: "UI/UX & Product\nExperience",
    desc: "I design modern, clean, and easy-to-use digital experiences that help users trust your product and navigate it with ease. I focus on creating interfaces that feel smooth, professional, and simple to understand while helping businesses turn visitors into active users, customers, or loyal clients.",
    icon: <PenTool size={40} strokeWidth={1.5} />,
    techIcons: [
      { name: "Framer", src: "/framer.svg" },
      { name: "TailwindCSS", src: "/tailwindcss.svg" },
      { name: "React", src: "/react.svg" },
      { name: "HTML5", src: "/html5.svg" },
    ]
  },
  {
    id: "04",
    title: "Secure Financial\n& Payment Systems",
    desc: "I build secure systems for platforms that handle payments, transactions, user accounts, and sensitive data. Whether it is an online payment flow, wallet system, subscription platform, or financial dashboard, I focus on creating software that is stable, secure, and easy for users to trust and use every day.",
    icon: <Landmark size={40} strokeWidth={1.5} />,
    techIcons: [
      { name: "Supabase", src: "/supabase.svg" },
      { name: "PostgreSQL", src: "/postgresql.svg" },
      { name: "Node.js", src: "/nodedotjs.svg" },
      { name: "TypeScript", src: "/typescript.svg" },
    ]
  },
  {
    id: "05",
    title: "Backend & Cloud\nInfrastructure",
    desc: "I build the systems behind the scenes that keep applications fast, organized, and dependable. From databases and APIs to cloud infrastructure and system integrations, I create strong foundations that help apps run smoothly, handle growth, and stay reliable as businesses expand.",
    icon: <Cloud size={40} strokeWidth={1.5} />,
    techIcons: [
      { name: "Node.js", src: "/nodedotjs.svg" },
      { name: "Firebase", src: "/firebase.svg" },
      { name: "MongoDB", src: "/mongodb.svg" },
      { name: "PostgreSQL", src: "/postgresql.svg" },
      { name: "Git", src: "/git.svg" },
    ]
  },
  {
    id: "06",
    title: "Business Digitization\n& Internal Tools",
    desc: "I help businesses move from manual processes to modern digital systems that make daily operations easier and more organized. This can include admin dashboards, inventory systems, booking platforms, customer portals, internal tools, and business management software designed to save time, improve visibility, and simplify the way teams work.",
    icon: <Building2 size={40} strokeWidth={1.5} />,
    techIcons: [
      { name: "Next.js", src: "/nextdotjs.svg" },
      { name: "Supabase", src: "/supabase.svg" },
      { name: "React", src: "/react.svg" },
      { name: "TypeScript", src: "/typescript.svg" },
      { name: "MongoDB", src: "/mongodb.svg" },
    ]
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
      <div className="relative bg-card-bg border border-card-border shadow-sm dark:shadow-none flex flex-col h-full overflow-hidden">
        {/* Inner cursor glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(57, 255, 20, 0.04), transparent 40%)`,
          }}
        />

        {/* Floating ambient tech icons in background */}
        {service.techIcons.map((tech, i) => {
          const positions = [
            { top: '20%', right: '20%' },
            { bottom: '25%', left: '20%' },
            { top: '50%', right: '25%' },
            { bottom: '20%', right: '35%' },
            { top: '25%', left: '50%' },
            { top: '65%', left: '25%' },
          ];
          const pos = positions[i % positions.length];
          const sizes = [42, 51, 36, 45, 39, 48];
          const size = sizes[i % sizes.length];
          const rotations = [-12, 8, -5, 15, -8, 10];
          const rotation = rotations[i % rotations.length];
          const delays = [0, 2, 4, 1.5, 3, 5];
          const delay = delays[i % delays.length];
          const durations = [24, 28, 32, 26, 30, 22];
          const duration = durations[i % durations.length];

          return (
            <div
              key={tech.name}
              className="absolute pointer-events-none z-[1] opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-700 animate-float-around"
              style={{
                ...pos,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
            >
              <Image
                src={tech.src}
                width={size}
                height={size}
                alt=""
                className="dark:invert"
                style={{ width: size, height: size, transform: `rotate(${rotation}deg)` }}
              />
            </div>
          );
        })}

        <div className="relative z-10 flex flex-col h-full p-8 md:p-9">
          <div className="flex justify-between items-start mb-10">
            <div className="text-foreground/50 group-hover:text-[#39FF14] group-hover:scale-110 transition-all duration-400 ease-out origin-top-left">
              {service.icon}
            </div>
            <div className="text-[10px] font-mono tracking-widest text-foreground/30 group-hover:text-[#39FF14] transition-colors duration-400 mt-1">
              {service.id}
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-bold font-sans text-foreground mb-4 whitespace-pre-line tracking-tight leading-tight">
            {service.title}
          </h3>
          <p className="text-foreground/50 font-inter text-[13px] leading-relaxed mt-auto">
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
      className={SECTION_STYLES.wrapper}
    >
      <div className={SECTION_STYLES.container}>
        {/* Backdrop text — positioned behind the section title */}
        <div className={SECTION_STYLES.backdropWrapper}>
          <span className={SECTION_STYLES.backdropText}>
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
          <div className={SECTION_STYLES.headerBadgeWrapper}>
            <span className={SECTION_STYLES.headerBadgeNumber}>02</span>
            <span className={SECTION_STYLES.headerBadgeLine}></span>
            <span className={SECTION_STYLES.headerBadgeText}>Services</span>
          </div>
          <AnimatedText
            as="h2"
            text="What I Do"
            className="items-start mb-6"
            textClassName={SECTION_STYLES.title}
            underlineClassName="text-[#39FF14]"
          />
          <p className={SECTION_STYLES.description}>
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
