import { client } from "@/lib/sanity/client";
import { EVENTS_QUERY } from "@/lib/sanity/queries";
import { Metadata } from "next";
import Navbar from "../components/Navbar";
import { InteractiveBackground } from "../components/InteractiveBackground";
import EventsListClient from "../components/EventsListClient";

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

          <EventsListClient initialEvents={events} />
        </main>
      </div>
    </InteractiveBackground>
  );
}
