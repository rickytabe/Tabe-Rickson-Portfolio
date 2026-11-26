import type { Metadata } from "next";
import { InteractiveBackground } from "../components/InteractiveBackground";
import LetsWorkClient from "./LetsWorkClient";
import { FAQS } from "./faqs";

export const metadata: Metadata = {
  title: "Hire a Full-Stack Developer in Cameroon | Tabe Rickson",
  description:
    "Need a website, mobile app, AI tool or online payments? Send Tabe Rickson a short project brief and get honest advice, a plan and a clear price.",
  alternates: {
    canonical: "/lets-work",
  },
  openGraph: {
    title: "Let's work together | Tabe Rickson",
    description: "Tell me what you want to build. Honest advice, a plan and a clear price.",
    url: "/lets-work",
  },
};

// FAQ structured data, so search engines can show the answers.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function LetsWorkPage() {
  return (
    <InteractiveBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <LetsWorkClient />
    </InteractiveBackground>
  );
}
