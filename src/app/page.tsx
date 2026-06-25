import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import ProjectsGallery from "./components/ProjectsGallery";
import Experience from "./components/Experience";
import Beliefs from "./components/Beliefs";
import { DotField } from "@/components/ui/dot-field";
import { ClickSpark } from "@/components/ui/click-spark";

export default function Home() {
  return (
    <>
      {/* Interactive Fixed Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#121212" }}>
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
        />
      </div>

      {/* Main Content */}
      <ClickSpark sparkColor="#39FF14" sparkSize={12} sparkRadius={20} sparkCount={8} duration={400}>
        <div 
          className="flex flex-col min-h-screen overflow-x-clip relative z-10" 
        >
        <Navbar />
        <Hero />
        <About />
        <Services />
        <ProjectsGallery />
        <Experience />
        </div>
      </ClickSpark>
    </>
  );
}
