import portfolioData from "../../../../portfolio-data.json";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ExternalLink, ArrowLeft } from "lucide-react";
import ShareWidget from "../../components/ShareWidget";

const GithubIcon = ({ size = 20, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params for all projects
export async function generateStaticParams() {
  return portfolioData.projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate dynamic metadata for each project page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioData.projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.name} | Tabe Rickson`,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.name} | Tabe Rickson`,
      description: project.description,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Tabe Rickson`,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = portfolioData.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Parse the markdown-like content blocks
  const contentSections = project.content.split('### ').filter(Boolean).map(section => {
    const [title, ...body] = section.split('\n');
    return { title: title.trim(), body: body.join('\n').trim() };
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
      <article className="bg-background/80 backdrop-blur-2xl border border-card-border rounded-3xl p-6 md:p-12 shadow-2xl">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "name": project.name,
              "description": project.description,
              "url": project.liveUrl || `https://taberickson.com/projects/${project.slug}`,
              "author": {
                "@id": "https://taberickson.com/#person"
              },
              "image": `https://taberickson.com${project.image}`
            })
          }}
        />

        {/* Back button */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-foreground/60 hover:text-[#39FF14] transition-colors mb-8 font-mono text-sm uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tighter uppercase text-foreground">
                  {project.name}
                </h1>
                {"badge" in project && project.badge && (
                  <span className="px-3 py-1 border border-[#39FF14]/40 bg-[#39FF14]/10 text-[#39FF14] text-xs uppercase tracking-wider rounded-full font-mono">
                    🏆 {project.badge}
                  </span>
                )}
              </div>
              
              <p className="text-xl text-foreground/60 font-light font-inter max-w-3xl leading-relaxed">
                {project.description}
              </p>
            </div>
            <div className="flex-shrink-0 md:pt-2">
              <ShareWidget url={`/projects/${project.slug}`} title={project.name} />
            </div>
          </div>
        </header>

        {/* Main Image */}
        <div className="relative w-full aspect-video md:aspect-[21/9] bg-card-bg border border-card-border rounded-3xl overflow-hidden mb-16 shadow-2xl">
          <Image 
            src={project.image} 
            alt={project.name} 
            fill 
            className="object-contain p-8"
            priority
          />
        </div>

        {/* Two Column Layout for Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Col: Main Content (Problem, Solution, Outcome) */}
          <div className="lg:col-span-2 space-y-12">
            {contentSections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-2xl font-bold font-sans text-foreground mb-4 flex items-center gap-3">
                  <span className="text-[#39FF14] opacity-50 font-mono text-sm">0{idx + 1}</span>
                  {section.title}
                </h2>
                <div className="text-foreground/70 font-inter leading-relaxed space-y-4">
                  {section.body.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Right Col: Sidebar (Tech Stack & Links) */}
          <aside className="space-y-8">
            <div className="p-8 bg-card-bg border border-card-border rounded-2xl">
              <h3 className="text-sm font-mono tracking-widest text-foreground/50 uppercase mb-6">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.techIcons.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-background border border-card-border rounded-md text-foreground/80 font-mono text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8 bg-card-bg border border-card-border rounded-2xl flex flex-col gap-4">
              <h3 className="text-sm font-mono tracking-widest text-foreground/50 uppercase mb-2">Project Links</h3>
              
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 w-full py-3 px-4 bg-[#39FF14] text-black font-bold rounded-xl transition-transform hover:scale-105"
                >
                  <ExternalLink size={20} /> View Live Project
                </a>
              )}
              
              {project.codeUrl && (
                <a 
                  href={project.codeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 w-full py-3 px-4 bg-background border border-card-border text-foreground hover:text-[#39FF14] hover:border-[#39FF14]/50 font-bold rounded-xl transition-all"
                >
                  <GithubIcon size={20} /> View Source Code
                </a>
              )}
            </div>
          </aside>

        </div>
      </article>
    </div>
  );
}
