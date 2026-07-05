import { client } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "../components/Navbar";
import { InteractiveBackground } from "../components/InteractiveBackground";
import BlogListClient from "../components/BlogListClient";
import { getPageViews } from "@/lib/vercel/analytics";

export const metadata: Metadata = {
  title: "The Blog | Tabe Rickson",
  description: "Exploring questions and sharing insights on life, nature, science, and technology.",
  alternates: {
    canonical: "/blog",
  },
};

export const revalidate = 60; // revalidate every minute

export default async function BlogIndex() {
  const posts = await client.fetch(POSTS_QUERY);

  // Attach views
  const postsWithViews = await Promise.all(
    posts.map(async (post: any) => {
      const views = await getPageViews(post.slug.current);
      return {
        ...post,
        views: views !== null ? Math.max(views, 1) : 1
      };
    })
  );

  return (
    <InteractiveBackground>
      <div className="flex flex-col min-h-screen overflow-x-clip relative z-10">
        <Navbar />
        
        <main className="flex-1 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tighter uppercase mb-4 text-foreground">
              The <span className="text-[#39FF14]">Blog</span>
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl font-inter">
              Exploring the intersections of life, nature, science, and technology. Answering curious questions and documenting the journey.
            </p>
          </div>

          <BlogListClient initialPosts={postsWithViews} />
        </main>
      </div>
    </InteractiveBackground>
  );
}
