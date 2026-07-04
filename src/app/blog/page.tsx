import { client } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "../components/Navbar";
import { InteractiveBackground } from "../components/InteractiveBackground";

export const metadata: Metadata = {
  title: "Blog | Tabe Rickson",
  description: "FAQ-style posts answering common tech questions and deep dives into software engineering.",
  alternates: {
    canonical: "/blog",
  },
};

export const revalidate = 60; // revalidate every minute

export default async function BlogIndex() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <InteractiveBackground>
      <div className="flex flex-col min-h-screen overflow-x-clip relative z-10">
        <Navbar />
        
        <main className="flex-1 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tighter uppercase mb-4 text-foreground">
              Tech <span className="text-[#39FF14]">Blog</span>
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl font-inter">
              Thoughts, tutorials, and deep-dives into full-stack web and mobile development, AI integration, and systems architecture.
            </p>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link href={`/blog/${post.slug.current}`} key={post._id} className="group flex flex-col bg-card-bg border border-card-border rounded-2xl overflow-hidden hover:border-[#39FF14]/50 transition-colors duration-300">
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-4 text-xs font-mono text-foreground/40">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h2 className="text-2xl font-bold font-sans text-foreground mb-3 group-hover:text-[#39FF14] transition-colors">{post.title}</h2>
                    <p className="text-sm text-foreground/60 font-inter line-clamp-3 mb-6 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto text-[#39FF14] text-sm font-mono flex items-center gap-2">
                      Read Post <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-foreground/10 text-center rounded-2xl bg-card-bg/50">
              <p className="text-foreground/50 font-mono text-sm tracking-widest">NO POSTS FOUND</p>
              <p className="text-foreground/40 font-inter text-xs mt-2">Content is currently being written. Check back soon.</p>
            </div>
          )}
        </main>
      </div>
    </InteractiveBackground>
  );
}
