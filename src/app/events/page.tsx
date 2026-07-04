import { client } from "@/lib/sanity/client";
import { EVENTS_QUERY } from "@/lib/sanity/queries";
import { Metadata } from "next";
import Navbar from "../components/Navbar";
import { InteractiveBackground } from "../components/InteractiveBackground";
import { ExternalLink, Calendar, MapPin } from "lucide-react";
import { createImageUrlBuilder } from "@sanity/image-url";
import Image from "next/image";

const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export const metadata: Metadata = {
  title: "Events | Tabe Rickson",
  description: "Upcoming physical and online events, workshops, and webinars.",
  alternates: {
    canonical: "/events",
  },
};

export const revalidate = 60;

export default async function EventsIndex() {
  const events = await client.fetch(EVENTS_QUERY);

  return (
    <InteractiveBackground>
      <div className="flex flex-col min-h-screen overflow-x-clip relative z-10">
        <Navbar />
        
        <main className="flex-1 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tighter uppercase mb-4 text-foreground">
              Upcoming <span className="text-[#39FF14]">Events</span>
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl font-inter">
              Join me for live sessions, workshops, and community meetups covering modern software engineering.
            </p>
          </div>

          <div className="space-y-6">
            {events && events.length > 0 ? (
              events.map((event: any) => (
                <div key={event._id} className="group overflow-hidden bg-card-bg border border-card-border hover:border-[#39FF14]/50 transition-colors duration-300 rounded-2xl flex flex-col md:flex-row gap-0">
                  {event.mainImage && (
                    <div className="relative w-full md:w-[40%] aspect-video md:aspect-auto md:min-h-full shrink-0 border-b md:border-b-0 md:border-r border-card-border">
                      <Image 
                        src={urlFor(event.mainImage).url()}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-2 py-1 text-xs font-mono uppercase tracking-widest rounded ${event.isOnline ? "bg-blue-500/10 text-blue-400 border border-blue-500/30" : "bg-purple-500/10 text-purple-400 border border-purple-500/30"}`}>
                        {event.isOnline ? "Online" : "In Person"}
                      </span>
                      <span className="flex items-center gap-1.5 text-foreground/50 text-sm font-mono">
                        <Calendar size={14} />
                        {new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground mb-3">{event.title}</h2>
                    <p className="text-foreground/70 font-inter text-sm md:text-base mb-6 leading-relaxed max-w-2xl">{event.description}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-card-border">
                      <div className="flex items-center gap-1.5 text-foreground/50 text-sm font-inter">
                        <MapPin size={14} />
                        {event.location || "Location TBD"}
                      </div>
                      
                      {event.link && (
                        <a 
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-[#39FF14] text-[#121212] font-bold font-mono text-sm tracking-widest uppercase hover:bg-white transition-colors rounded-lg sm:rounded-none"
                        >
                          Join / Register <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 border border-foreground/10 text-center rounded-2xl bg-card-bg/50">
                <p className="text-foreground/50 font-mono text-sm tracking-widest">NO EVENTS SCHEDULED</p>
                <p className="text-foreground/40 font-inter text-xs mt-2">Check back later or subscribe to the newsletter for updates.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </InteractiveBackground>
  );
}
