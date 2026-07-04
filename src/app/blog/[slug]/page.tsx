import { client } from "@/lib/sanity/client";
import { POST_QUERY, POSTS_SLUGS_QUERY } from "@/lib/sanity/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import { InteractiveBackground } from "../../components/InteractiveBackground";
import PortableTextRenderer from "../../components/PortableTextRenderer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createImageUrlBuilder } from "@sanity/image-url";
import Image from "next/image";

const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await client.fetch(POSTS_SLUGS_QUERY);
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) {
    return { title: "Post Not Found" };
  }

  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined;

  return {
    title: `${post.title} | Tabe Rickson Blog`,
    description: post.excerpt || "Read this post on Tabe Rickson's Tech Blog",
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) {
    notFound();
  }

  return (
    <InteractiveBackground>
      <div className="flex flex-col min-h-screen overflow-x-clip relative z-10">
        <Navbar />
        
        <article className="flex-1 pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto w-full">
          <Link href="/blog" className="inline-flex items-center gap-2 text-foreground/60 hover:text-[#39FF14] transition-colors mb-8 font-mono text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          <header className="mb-10">
            <div className="text-[#39FF14] font-mono text-sm mb-4">
              {new Date(post.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans tracking-tight mb-6">
              {post.title}
            </h1>
          </header>

          {post.mainImage && (
            <div className="relative w-full aspect-video bg-card-bg border border-card-border rounded-2xl overflow-hidden mb-12 shadow-xl">
              <Image 
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            {post.body ? (
              <PortableTextRenderer value={post.body} />
            ) : (
              <p className="text-foreground/50 italic">Content is missing.</p>
            )}
          </div>
        </article>
      </div>
    </InteractiveBackground>
  );
}
