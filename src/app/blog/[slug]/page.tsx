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
import { getPageViews } from "@/lib/vercel/analytics";
import Image from "next/image";
import ShareWidget from "../../components/ShareWidget";

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
  
  // Fetch post and views in parallel for metadata
  const [post, rawViews] = await Promise.all([
    client.fetch(POST_QUERY, { slug }),
    getPageViews(slug)
  ]);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const views = rawViews !== null ? Math.max(rawViews, 1) : 1;
  const viewText = `${views.toLocaleString()} ${views === 1 ? 'View' : 'Views'}`;
  const fullTitle = `(${viewText}) ${post.title} | Tabe Rickson`;

  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined;

  return {
    title: fullTitle,
    description: post.excerpt || "Read this post on Tabe Rickson's Tech Blog",
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `(${viewText}) ${post.title}`,
      description: post.excerpt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch post and views in parallel
  const [post, views] = await Promise.all([
    client.fetch(POST_QUERY, { slug }),
    getPageViews(slug)
  ]);

  if (!post) {
    notFound();
  }

  return (
    <InteractiveBackground>
      <div className="flex flex-col min-h-screen overflow-x-clip relative z-10">
        <Navbar />
        
        <div className="flex-1 pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto w-full">
          <article className="bg-background/80 backdrop-blur-2xl border border-card-border rounded-3xl p-6 md:p-12 shadow-2xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-foreground/60 hover:text-[#39FF14] transition-colors mb-8 font-mono text-sm uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            
            <header className="mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[#39FF14] font-mono text-sm mb-4">
                    <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {views !== null && (
                      <>
                        <span className="text-foreground/30">•</span>
                        <span>{Math.max(views, 1).toLocaleString()} {Math.max(views, 1) === 1 ? 'view' : 'views'}</span>
                      </>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans tracking-tight mb-6">
                    {post.title}
                  </h1>
                </div>
              </div>
              <div className="shrink-0">
                  <ShareWidget url={`/blog/${slug}`} title={post.title} />
                </div>
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
      </div>
    </InteractiveBackground>
  );
}
