"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { SECTION_STYLES } from "../utils/sectionStyles";
import SectionHeader from "./SectionHeader";
import { SERVICE_ART, type ServiceArtKey } from "./ServiceArt";

type Service = {
  art: ServiceArtKey;
  /** Plain-English name a non-technical visitor would search for. */
  title: string;
  /** One or two sentences on what the visitor gets, not how it is built. */
  promise: string;
  /** Everyday examples, also the words people type into Google. */
  goodFor: string[];
};

const SERVICES: Service[] = [
  {
    art: "web",
    title: "Websites & Mobile Apps",
    promise:
      "A fast, good-looking website or app that works on every phone and brings you new customers.",
    goodFor: ["business websites", "online shops", "booking sites", "mobile apps"],
  },
  {
    art: "ai",
    title: "AI That Saves You Time",
    promise:
      "Let AI answer customer questions, read documents and handle the repetitive work, so your team can focus on people.",
    goodFor: ["chat assistants", "automatic replies", "document reading", "smart reports"],
  },
  {
    art: "design",
    title: "Simple, Clear Design",
    promise:
      "Screens people understand at first glance, so visitors trust you and turn into customers.",
    goodFor: ["website redesigns", "app screens", "sign-up and checkout pages"],
  },
  {
    art: "payments",
    title: "Safe Online Payments",
    promise:
      "Get paid online, including Mobile Money, with wallets and subscriptions built to keep money and personal data safe.",
    goodFor: ["checkout pages", "digital wallets", "subscriptions", "finance dashboards"],
  },
  {
    art: "backend",
    title: "The Engine Behind Your App",
    promise:
      "Databases, servers and cloud hosting that keep your app fast and online, even as more people use it.",
    goodFor: ["APIs", "databases", "cloud hosting", "connecting your tools"],
  },
  {
    art: "business",
    title: "Tools to Run Your Business",
    promise:
      "Swap paper, spreadsheets and endless chat threads for one simple system to manage stock, bookings, staff and customers.",
    goodFor: ["admin dashboards", "stock management", "booking systems", "customer portals"],
  },
];

// Structured data so search engines can read the services list.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Services by Tabe Rickson",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.promise,
      serviceType: s.goodFor.join(", "),
      areaServed: ["Cameroon", "Worldwide"],
      provider: { "@type": "Person", name: "Tabe Rickson", url: "https://taberickson.com" },
    },
  })),
};

// Critically damped (no overshoot): content arriving on scroll isn't a flick.
const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Art = SERVICE_ART[service.art];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...SPRING, delay: (index % 3) * 0.06 }}
      className="h-full"
    >
      <article className="work-tile group h-full">
        <div className="px-6 pt-7 pb-6 sm:px-8 sm:pt-8">
          <h3 className="work-title text-foreground">
            {/* Stretched over the whole card: every service leads to "start a project". */}
            <Link
              href="/lets-work"
              className="after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-none"
            >
              {service.title}
            </Link>
          </h3>

          <p className="work-tagline mt-3 text-foreground/80">{service.promise}</p>

          <p className="mt-4 text-[14px] leading-relaxed text-foreground/60">
            <span className="font-semibold text-foreground/75">Good for: </span>
            {service.goodFor.join(", ")}
          </p>

          <p className="mt-5 text-[15px]">
            <span className="work-link" aria-hidden="true">
              Start a project ›
            </span>
          </p>
        </div>

        <div className="work-drawer">
          <span className="work-drawer-handle" aria-hidden="true" />
          <div className="work-drawer-shot svc-art aspect-[2/1]">
            <Art />
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export default function Services() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="services" className={SECTION_STYLES.wrapper}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <div className={SECTION_STYLES.container}>
          <SectionHeader
            className="mb-12 lg:mb-16"
            backdrop="SERVICES"
            eyebrow="Services"
            title="What I do."
            lede="Websites, mobile apps, AI tools and business software for companies in Cameroon and beyond, explained in plain words."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.art} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
