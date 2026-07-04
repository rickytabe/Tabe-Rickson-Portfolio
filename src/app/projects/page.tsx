import portfolioData from "../../../portfolio-data.json";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Tabe Rickson",
  description: "A collection of my full-stack web and mobile applications.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsIndex() {
  const { projects } = portfolioData;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tighter uppercase mb-4 text-foreground">
          All <span className="text-[#39FF14]">Projects</span>
        </h1>
        <p className="text-foreground/60 text-lg max-w-2xl font-inter">
          A comprehensive collection of my software engineering work, spanning full-stack web applications, mobile platforms, and AI integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.slug} className="group flex flex-col bg-card-bg border border-card-border rounded-2xl overflow-hidden hover:border-[#39FF14]/50 transition-colors duration-300">
            <div className="relative w-full h-48 bg-background/50 overflow-hidden">
              <Image 
                src={project.image} 
                alt={project.name} 
                fill 
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold font-sans text-foreground">{project.name}</h2>
                {"badge" in project && project.badge && (
                  <span className="px-2 py-0.5 border border-[#39FF14]/40 bg-[#39FF14]/10 text-[#39FF14] text-[10px] uppercase tracking-wider rounded-full font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]" title={project.badge}>
                    Award
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/60 font-inter line-clamp-3 mb-6 flex-grow">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.techIcons.slice(0, 3).map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 bg-background/50 border border-card-border rounded text-foreground/70 font-mono">
                    {tech}
                  </span>
                ))}
                {project.techIcons.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-background/50 border border-card-border rounded text-foreground/70 font-mono">
                    +{project.techIcons.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
