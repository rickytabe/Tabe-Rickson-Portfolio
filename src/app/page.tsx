import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import ProjectsGallery from "./components/ProjectsGallery";
import Experience from "./components/Experience";
import Beliefs from "./components/Beliefs";

export default function Home() {
  return (
    <div 
      className="flex flex-col min-h-screen overflow-x-clip" 
      style={{ background: "#121212" }}
    >
      <Navbar />
      <Hero />
      <About />
      <Services />
      <ProjectsGallery />
      <Experience />
    </div>
  );
}
