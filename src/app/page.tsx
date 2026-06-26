import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import ProjectsGallery from "./components/ProjectsGallery";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import { InteractiveBackground } from "./components/InteractiveBackground";

export default function Home() {
  return (
    <>
      {/* Interactive Fixed Background & Main Content wrapper */}
      <InteractiveBackground>
        <div className="flex flex-col min-h-screen overflow-x-clip relative z-10">
          <Navbar />
          <Hero />
          <About />
          <Services />
          <ProjectsGallery />
          <Experience />
          <Contact />
        </div>
      </InteractiveBackground>
    </>
  );
}
