"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import portfolioData from "../../../portfolio-data.json";
import SectionHeader from "../components/SectionHeader";
import { FAQS } from "./faqs";

const WHATSAPP_URL =
  "https://wa.me/237671353341?text=" + encodeURIComponent("Hi Tabe, I'd like to talk about a project.");
const EMAIL = "rickytabe2@gmail.com";

/** What the visitor wants built, in the same plain words as the Services cards. */
const PROJECT_TYPES = [
  "Website",
  "Mobile app",
  "AI tool",
  "Online payments",
  "Business system",
  "Something else",
];

/** Optional. Ranges in FCFA; edit to match how Tabe prices work. */
const BUDGETS = ["Under 200k FCFA", "200k – 500k FCFA", "500k – 1M FCFA", "Over 1M FCFA", "Not sure yet"];

const TIMELINES = ["As soon as possible", "Within a month", "In 1–3 months", "Just exploring"];

const STEPS = [
  {
    title: "You tell me about your idea",
    body: "A few lines is enough. What you want, who it's for, and anything you already have.",
  },
  {
    title: "I reply with a plan and a price",
    body: "I read every message myself. You get honest advice, the questions that matter, and a clear price before any work starts.",
  },
  {
    title: "We build it together",
    body: "You see progress as we go and can change course early, so the final product is what you actually need.",
  },
];

/** Real projects as proof, linking to their case studies. */
const PROOF: { slug: string; line: string }[] = [
  { slug: "kmc-restaurant", line: "Online orders, table bookings and payments for a restaurant." },
  { slug: "mobi-rent", line: "Car rental for Cameroon, booked online in minutes." },
  { slug: "niatrust-wallet", line: "Escrow and group savings people can trust." },
];


// Critically damped (no overshoot): content arriving isn't a flick.
const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;

function ChipGroup({
  legend,
  name,
  options,
  required,
  hint,
}: {
  legend: string;
  name: string;
  options: string[];
  required?: boolean;
  hint?: string;
}) {
  return (
    <fieldset>
      <legend className="lw-label">
        {legend}
        {!required && <span className="font-normal text-foreground/50"> (optional)</span>}
      </legend>
      {hint && <p className="-mt-1 mb-3 text-[13px] text-foreground/55">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option, i) => (
          <label key={option} className="lw-chip">
            <input
              type="radio"
              name={name}
              value={option}
              required={required && i === 0}
              className="peer sr-only"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function BriefForm() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      data[key] = value.toString();
    });

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: "project" }),
      });
      const result: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (res.ok && result.ok === true) {
        form.reset();
        setSent(true);
        setTimeout(() => router.push("/thank-you"), 2200);
      } else {
        toast.error(
          `${result.error ?? "Your brief couldn't be sent."} Please try again, or message me on WhatsApp.`,
          { duration: 8000 },
        );
        setSending(false);
      }
    } catch {
      toast.error("Couldn't reach the server. Check your connection and try again.");
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center py-16 text-center" role="status">
        <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#39FF14] text-[#121212]">
          <Check size={30} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground">Brief sent. Thank you!</h2>
        <p className="mt-3 max-w-sm font-inter text-[17px] leading-relaxed text-foreground/70">
          I&apos;ve got your project details and will get back to you personally.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" aria-label="Project brief">
      {/* Honeypot: hidden from people, bots fill it in */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lw-name" className="lw-label">Your name</label>
          <input id="lw-name" name="name" required autoComplete="name" className="lw-input" placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="lw-email" className="lw-label">Email</label>
          <input
            id="lw-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="lw-input"
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lw-phone" className="lw-label">
          WhatsApp <span className="font-normal text-foreground/50">(optional, the fastest way to reach you)</span>
        </label>
        <input
          id="lw-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="lw-input"
          placeholder="+237 6XX XXX XXX"
        />
      </div>

      <ChipGroup legend="What do you want to build?" name="project_type" options={PROJECT_TYPES} required />

      <div>
        <label htmlFor="lw-details" className="lw-label">Tell me about it</label>
        <textarea
          id="lw-details"
          name="details"
          required
          rows={5}
          className="lw-input resize-y"
          placeholder="What should it do, who is it for, and is there anything you already have?"
        />
      </div>

      <ChipGroup legend="Budget" name="budget" options={BUDGETS} hint="A rough idea helps me suggest the right plan." />
      <ChipGroup legend="When do you need it?" name="timeline" options={TIMELINES} />

      <div>
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex h-14 w-full items-center justify-center gap-2 text-base font-bold text-[#121212] bg-[#39FF14] hover:bg-foreground hover:text-background active:scale-[0.98] disabled:opacity-60 transition-[color,background-color,transform] duration-300"
        >
          {sending ? "Sending…" : "Send my project brief"}
          {!sending && (
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          )}
        </button>
        <p className="mt-3 text-center text-[13px] text-foreground/55">
          No spam and no obligation. Your details only go to me.
        </p>
      </div>
    </form>
  );
}

export default function LetsWorkClient() {
  const proof = PROOF.map((p) => ({ ...p, project: portfolioData.projects.find((x) => x.slug === p.slug) })).filter(
    (p) => p.project,
  );

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative z-10 overflow-x-clip px-8 lg:px-16 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto w-full">
          <SectionHeader
            as="h1"
            className="mb-8"
            backdrop="LET'S WORK"
            eyebrow="Start a project"
            title="Tell me what you want to build."
            lede="Websites, apps, AI tools and business systems for companies in Cameroon and beyond. Send a short brief and I'll reply with honest advice, a plan and a price."
          />

          <div className="mb-14 flex flex-wrap gap-3">
            <a
              href="#brief"
              className="group inline-flex h-12 items-center gap-2 px-7 text-sm font-bold text-[#121212] bg-[#39FF14] hover:bg-foreground hover:text-background active:scale-[0.97] transition-[color,background-color,transform] duration-300"
            >
              Send a project brief
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 px-7 text-sm font-bold text-foreground border border-foreground/25 hover:border-foreground/70 hover:bg-foreground/5 active:scale-[0.97] transition-[color,background-color,border-color,transform] duration-300"
            >
              <FaWhatsapp size={18} aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            {/* The brief: first on phones, right-hand column on desktop */}
            <motion.section
              id="brief"
              aria-labelledby="brief-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="lw-panel scroll-mt-28 p-6 sm:p-10 lg:order-2 lg:sticky lg:top-28"
            >
              <h2 id="brief-title" className="text-2xl font-bold tracking-[-0.02em] text-foreground">
                Your project brief
              </h2>
              <p className="mt-2 mb-8 text-[15px] text-foreground/60">Takes about two minutes.</p>
              <BriefForm />
            </motion.section>

            {/* How it works, direct contact, proof */}
            <div className="space-y-12 lg:order-1">
              <section aria-labelledby="steps-title">
                <h2 id="steps-title" className="text-2xl font-bold tracking-[-0.02em] text-foreground">
                  What happens next
                </h2>
                <ol className="mt-6 space-y-6">
                  {STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--hero-accent)] text-[15px] font-bold text-[var(--hero-accent)]">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-[17px] font-semibold text-foreground">{step.title}</h3>
                        <p className="mt-1 font-inter text-[15px] leading-relaxed text-foreground/70">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="direct-title">
                <h2 id="direct-title" className="text-2xl font-bold tracking-[-0.02em] text-foreground">
                  Prefer to talk?
                </h2>
                <div className="mt-5 grid gap-3">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="lw-panel lw-row group">
                    <span className="lw-row-icon">
                      <FaWhatsapp size={22} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[13px] text-foreground/55">WhatsApp</span>
                      <span className="block font-semibold text-foreground">+237 671 353 341</span>
                    </span>
                    <ArrowRight size={18} className="ml-auto text-foreground/40 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                  <a href={`mailto:${EMAIL}`} className="lw-panel lw-row group">
                    <span className="lw-row-icon">
                      <Mail size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] text-foreground/55">Email</span>
                      <span className="block truncate font-semibold text-foreground">{EMAIL}</span>
                    </span>
                    <ArrowRight size={18} className="ml-auto shrink-0 text-foreground/40 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </div>
              </section>

              <section aria-labelledby="proof-title">
                <h2 id="proof-title" className="text-2xl font-bold tracking-[-0.02em] text-foreground">
                  Recent work
                </h2>
                <ul className="mt-5 grid gap-3">
                  {proof.map(({ slug, line, project }) => (
                    <li key={slug}>
                      <Link href={`/projects/${slug}`} className="lw-panel lw-row group">
                        <span className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-[var(--work-glass-border)] bg-background">
                          <Image
                            src={project!.image}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover object-top"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-foreground">{project!.name}</span>
                          <span className="block text-[14px] leading-snug text-foreground/65">{line}</span>
                        </span>
                        <ArrowRight size={18} className="ml-auto shrink-0 text-foreground/40 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/projects" className="work-link mt-4 inline-block text-[15px]">
                  See all projects ›
                </Link>
              </section>
            </div>
          </div>

          {/* Questions people ask before they get in touch */}
          <section aria-labelledby="faq-title" className="mt-24">
            <h2 id="faq-title" className="text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] font-bold tracking-[-0.025em] text-foreground">
              Questions people ask
            </h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="lw-panel lw-faq group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-[17px] font-semibold text-foreground">
                    {q}
                    <span className="lw-faq-icon" aria-hidden="true" />
                  </summary>
                  <p className="px-6 pb-6 -mt-2 font-inter text-[15px] leading-relaxed text-foreground/70">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </MotionConfig>
  );
}
