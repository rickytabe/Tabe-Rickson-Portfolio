import { client } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "../components/Navbar";
import { InteractiveBackground } from "../components/InteractiveBackground";
import BlogListClient from "../components/BlogListClient";

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

          <BlogListClient initialPosts={posts} />
        </main>
      </div>
    </InteractiveBackground>
  );
}
