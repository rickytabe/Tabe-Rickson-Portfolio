'use client';

import { useState } from 'react';
import { ExternalLink, Calendar, MapPin, Search, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "@/lib/sanity/client";

const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

type ViewMode = 'list' | 'grid';

export default function EventsListClient({ initialEvents }: { initialEvents: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filteredEvents = initialEvents?.filter((event) => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = event.title?.toLowerCase().includes(searchLower);
    const descMatch = event.description?.toLowerCase().includes(searchLower);
    return titleMatch || descMatch;
  });

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Search size={18} className="text-foreground/40 group-focus-within:text-[#39FF14] transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-card-bg/50 border border-card-border rounded-lg py-2.5 pl-10 pr-4 text-foreground font-inter text-sm focus:outline-none focus:border-[#39FF14]/50 transition-colors"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      </div>

      {/* Events Display */}
      {filteredEvents && filteredEvents.length > 0 ? (
        <div className={viewMode === 'list' ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
          {filteredEvents.map((event: any) => (
            <div 
              key={event._id} 
              className={`group overflow-hidden bg-card-bg border border-card-border hover:border-[#39FF14]/50 transition-colors duration-300 rounded-2xl flex ${viewMode === 'list' ? 'flex-col md:flex-row gap-0' : 'flex-col'}`}
            >
              {event.mainImage && (
                <div className={`relative shrink-0 border-card-border ${viewMode === 'list' ? 'w-full md:w-[40%] aspect-video md:aspect-auto md:min-h-full border-b md:border-b-0 md:border-r' : 'w-full aspect-video border-b'}`}>
                  <Image 
                    src={urlFor(event.mainImage).url()}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-2 py-1 text-xs font-mono uppercase tracking-widest rounded ${event.isOnline ? "bg-blue-500/10 text-blue-400 border border-blue-500/30" : "bg-purple-500/10 text-purple-400 border border-purple-500/30"}`}>
                    {event.isOnline ? "Online" : "In Person"}
                  </span>
                  <span className="flex items-center gap-1.5 text-foreground/50 text-sm font-mono">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h2 className={`${viewMode === 'list' ? 'text-2xl md:text-3xl' : 'text-xl'} font-bold font-sans text-foreground mb-3`}>
                  {event.title}
                </h2>
                <p className={`text-foreground/70 font-inter text-sm ${viewMode === 'list' ? 'md:text-base' : ''} mb-6 leading-relaxed ${viewMode === 'grid' ? 'line-clamp-3 flex-grow' : 'max-w-2xl'}`}>
                  {event.description}
                </p>
                
                <div className={`mt-auto pt-4 border-t border-card-border flex ${viewMode === 'list' ? 'flex-col sm:flex-row sm:items-center justify-between gap-4' : 'flex-col gap-4'}`}>
                  <div className="flex items-start gap-2 text-foreground/50 text-sm font-inter">
                    <MapPin size={16} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{event.location || "Location TBD"}</span>
                  </div>
                  
                  {event.link && (
                    <a 
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-[#39FF14] text-[#121212] font-bold font-mono text-sm tracking-widest uppercase hover:bg-white transition-colors ${viewMode === 'grid' ? 'w-full rounded-lg' : 'rounded-lg sm:rounded-none'}`}
                    >
                      Join / Register <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 border border-foreground/10 text-center rounded-2xl bg-card-bg/50">
          <p className="text-foreground/50 font-mono text-sm tracking-widest">
            {searchQuery ? "NO EVENTS MATCH YOUR SEARCH" : "NO EVENTS SCHEDULED"}
          </p>
          <p className="text-foreground/40 font-inter text-xs mt-2">
            {searchQuery ? "Try adjusting your search terms." : "Check back later or subscribe to the newsletter for updates."}
          </p>
        </div>
      )}
    </div>
  );
}
