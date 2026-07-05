'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Calendar } from 'lucide-react';
import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from '@/lib/sanity/client';

const builder = createImageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export default function BlogListClient({ initialPosts }: { initialPosts: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = initialPosts.filter((post) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(searchLower) ||
      post.excerpt?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-12 max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-foreground/40 group-focus-within:text-[#39FF14] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card-bg/50 border border-foreground/10 focus:border-[#39FF14]/50 pl-12 pr-4 py-4 rounded-xl text-foreground placeholder:text-foreground/40 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(57,255,20,0.08)] backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post: any) => (
            <Link
              href={`/blog/${post.slug.current}`}
              key={post._id}
              className="group flex flex-col bg-card-bg border border-foreground/10 rounded-2xl overflow-hidden hover:border-[#39FF14]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#39FF14]/5"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[16/10] bg-foreground/5 overflow-hidden">
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-foreground/20 font-mono text-sm tracking-widest">NO IMAGE</span>
                  </div>
                )}
                {/* Overlay gradient for text legibility if needed, but we put text below */}
                <div className="absolute inset-0 border-b border-foreground/10 pointer-events-none" />
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Meta */}
                <div className="flex items-center gap-2 mb-4 text-xs font-mono text-foreground/50">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold font-sans text-foreground mb-3 leading-snug group-hover:text-[#39FF14] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-foreground/60 font-inter line-clamp-3 mb-6 flex-grow">
                  {post.excerpt}
                </p>

                {/* Button */}
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-mono text-foreground font-semibold group-hover:text-[#39FF14] transition-colors">
                  READ POST <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 border border-foreground/10 text-center rounded-2xl bg-card-bg/50 backdrop-blur-sm">
          <p className="text-foreground/50 font-mono text-sm tracking-widest">
            {searchQuery ? "NO MATCHING POSTS" : "NO POSTS FOUND"}
          </p>
          <p className="text-foreground/40 font-inter text-xs mt-2">
            {searchQuery ? `Try adjusting your search for "${searchQuery}"` : "Content is currently being written. Check back soon."}
          </p>
        </div>
      )}
    </div>
  );
}
