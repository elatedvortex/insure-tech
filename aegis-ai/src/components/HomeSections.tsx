"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Shield, Car, Home as HomeIcon, Plane, HeartPulse, Briefcase, Lock, Sparkles, PawPrint } from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { icon: Car, label: "Vehicle", slug: "vehicle" },
  { icon: HeartPulse, label: "Health", slug: "health" },
  { icon: HomeIcon, label: "Home", slug: "home" },
  { icon: Plane, label: "Travel", slug: "travel" },
  { icon: Shield, label: "Life", slug: "life" },
  { icon: PawPrint, label: "Pet", slug: "pet" },
  { icon: Briefcase, label: "Business", slug: "business" },
];

const FAQS = [
  {
    q: "Is this actually AI, or a chatbot in front of a form?",
    a: "The AI drives the entire journey — understanding your situation, asking only what's necessary, and generating recommendations with visible reasoning. There's no hidden form behind it.",
  },
  {
    q: "How is my data protected?",
    a: "Every document and conversation is encrypted at rest and in transit. You can see exactly what's stored about you, and request deletion at any time.",
  },
  {
    q: "Can I still talk to a person?",
    a: "Always. Ask at any point in the conversation and you'll be connected to a licensed advisor who has full context — you won't have to repeat yourself.",
  },
  {
    q: "How does the AI decide what to recommend?",
    a: "Every recommendation includes the reasoning behind it — your risk profile, what similar situations typically require, and trade-offs, so you can question or override it.",
  },
];

export function HowItWorks() {
  const reduced = useReducedMotion();
  const steps = [
    { title: "Tell Aegis what's going on", detail: "In your own words — no forms, no jargon." },
    { title: "It asks only what matters", detail: "A few sharp questions instead of forty fields." },
    { title: "You get a reasoned recommendation", detail: "With the trade-offs explained, not just a price." },
  ];

  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <SectionEyebrow>How it works</SectionEyebrow>
      <div className="mt-10 grid sm:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={reduced ? false : { opacity: 0, y: 30, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.12 }}
            whileHover={reduced ? undefined : { y: -6, scale: 1.01, rotate: -0.6 }}
            className="group relative overflow-hidden rounded-[28px] border border-surface-line/70 bg-surface/70 p-7 shadow-[0_16px_50px_-24px_rgba(2,6,23,0.18)] backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-linear-to-br from-pine/8 via-transparent to-clay/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="w-8 h-8 rounded-full border border-pine/40 flex items-center justify-center mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-pine" />
              </div>
              <h3 className="font-display text-xl text-ink mb-2">{s.title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{s.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ProtectionCategories() {
  const router = useRouter();
  const reduced = useReducedMotion();

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <SectionEyebrow>What you can protect</SectionEyebrow>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {CATEGORIES.map((c, i) => (
          <motion.button
            key={c.label}
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 150, damping: 20, delay: i * 0.08 }}
            whileHover={reduced ? undefined : { y: -4, scale: 1.01, rotate: -0.4 }}
            onClick={() => router.push(`/protection/${c.slug}`)}
            className="group relative overflow-hidden text-left p-6 rounded-[24px] premium-surface border border-surface-line/70 transition-all duration-300 hover:border-pine/40"
          >
            <div className="absolute inset-0 bg-linear-to-br from-pine/8 via-transparent to-clay/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <c.icon className="w-5 h-5 text-pine mb-6" strokeWidth={1.5} />
              <div className="font-display text-lg text-ink">{c.label}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export function TrustSection() {
  const reduced = useReducedMotion();
  const points = [
    { icon: Lock, title: "Encrypted by default", detail: "Every document and message encrypted in transit and at rest." },
    { icon: Shield, title: "You control your data", detail: "See what's stored, export it, or delete it — anytime." },
    { icon: Sparkles, title: "Reasoning, not black boxes", detail: "Every AI recommendation shows the 'why' behind it." },
  ];
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 25 }}
      className="px-6 py-24 bg-pine-deep text-paper rounded-[40px] mx-4 sm:mx-6 my-10"
    >
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-paper/60 mb-10">Security & trust</p>
        <div className="grid sm:grid-cols-3 gap-10">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={reduced ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: 0.15 + i * 0.1 }}
            >
              <p.icon className="w-5 h-5 mb-5 text-paper/80" strokeWidth={1.5} />
              <h3 className="font-display text-xl mb-2">{p.title}</h3>
              <p className="text-paper/70 text-sm leading-relaxed">{p.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function FAQSection() {
  const reduced = useReducedMotion();
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <SectionEyebrow>Questions</SectionEyebrow>
      <div className="mt-10 divide-y divide-surface-line">
        {FAQS.map((f, i) => (
          <motion.details
            key={f.q}
            initial={reduced ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={reduced ? { duration: 0.01 } : { duration: 0.35, delay: i * 0.08 }}
            className="group rounded-2xl px-3 py-5 hover:bg-paper/40"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none font-display text-lg text-ink">
              {f.q}
              <span className="text-sage group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
            </summary>
            <p className="text-ink-soft text-sm leading-relaxed mt-3 max-w-xl">{f.a}</p>
          </motion.details>
        ))}
      </div>
    </section>
  );
}

export function ClosingCTA() {
  const router = useRouter();
  const reduced = useReducedMotion();
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20 }}
      className="px-6 py-28 text-center"
    >
      <h2 className="font-display text-3xl sm:text-4xl text-ink max-w-xl mx-auto leading-tight">
        Stop filling forms. Start a conversation.
      </h2>
      <motion.button
        whileHover={reduced ? undefined : { y: -2, scale: 1.01, boxShadow: "0 18px 40px -16px rgba(16, 185, 129, 0.35)" }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/advisor")}
        className="mt-8 px-7 py-3.5 rounded-full bg-pine text-paper font-medium hover:bg-pine-deep transition-colors"
      >
        Talk to Aegis
      </motion.button>
    </motion.section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-widest uppercase text-sage">{children}</p>
  );
}
