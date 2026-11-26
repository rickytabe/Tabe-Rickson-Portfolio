import type { Metadata } from "next";
import portfolioData from "../../../portfolio-data.json";
import { InteractiveBackground } from "../components/InteractiveBackground";
import SectionHeader from "../components/SectionHeader";
import type { Project } from "../components/ProjectTile";
import ProjectsBrowser from "./ProjectsBrowser";

export const metadata: Metadata = {
  title: "Projects | Tabe Rickson",
  description:
    "Websites, mobile apps, AI tools and payment systems built by Tabe Rickson, a full-stack engineer in Buea, Cameroon. See the live sites, the code and the case studies.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Tabe Rickson",
    description: "Websites, mobile apps, AI tools and payment systems, designed and built end to end.",
    url: "/projects",
  },
};

export default function ProjectsIndex() {
  const projects = portfolioData.projects as Project[];

  return (
    <InteractiveBackground>
      <main className="relative z-10 overflow-x-clip px-8 lg:px-16 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto w-full">
          <SectionHeader
            as="h1"
            className="mb-10 lg:mb-12"
            backdrop="PROJECTS"
            eyebrow="All projects"
            title="Everything I've built."
            lede="Websites, apps, AI tools and payment systems for real businesses and communities. Open any card for the full story."
          />

          <ProjectsBrowser projects={projects} />
        </div>
      </main>
    </InteractiveBackground>
  );
}
