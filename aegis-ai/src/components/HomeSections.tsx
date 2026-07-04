"use client";

import { motion } from "framer-motion";
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
            initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.15 }}
            className="relative"
          >
            <div className="w-8 h-8 rounded-full border border-pine/40 flex items-center justify-center mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-pine" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">{s.title}</h3>
            <p className="text-ink-soft text-sm leading-relaxed">{s.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ProtectionCategories() {
  const router = useRouter();
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <SectionEyebrow>What you can protect</SectionEyebrow>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {CATEGORIES.map((c, i) => (
          <motion.button
            key={c.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: i * 0.1 }}
            onClick={() => router.push(`/protection/${c.slug}`)}
            className="group text-left p-6 rounded-3xl bg-surface/60 border border-surface-line hover:border-pine hover:bg-surface transition-colors"
          >
            <c.icon className="w-5 h-5 text-pine mb-6" strokeWidth={1.5} />
            <div className="font-display text-lg text-ink">{c.label}</div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export function TrustSection() {
  const points = [
    { icon: Lock, title: "Encrypted by default", detail: "Every document and message encrypted in transit and at rest." },
    { icon: Shield, title: "You control your data", detail: "See what's stored, export it, or delete it — anytime." },
    { icon: Sparkles, title: "Reasoning, not black boxes", detail: "Every AI recommendation shows the 'why' behind it." },
  ];
  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 80, damping: 25 }}
      className="px-6 py-24 bg-pine-deep text-paper rounded-[40px] mx-4 sm:mx-6 my-10"
    >
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-paper/60 mb-10">Security & trust</p>
        <div className="grid sm:grid-cols-3 gap-10">
          {points.map((p, i) => (
            <motion.div 
              key={p.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 + i * 0.15 }}
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
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <SectionEyebrow>Questions</SectionEyebrow>
      <div className="mt-10 divide-y divide-surface-line">
        {FAQS.map((f, i) => (
          <motion.details 
            key={f.q} 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group py-5"
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
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="px-6 py-28 text-center"
    >
      <h2 className="font-display text-3xl sm:text-4xl text-ink max-w-xl mx-auto leading-tight">
        Stop filling forms. Start a conversation.
      </h2>
      <button
        onClick={() => router.push("/advisor")}
        className="mt-8 px-7 py-3.5 rounded-full bg-pine text-paper font-medium hover:bg-pine-deep transition-colors"
      >
        Talk to Aegis
      </button>
    </motion.section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-widest uppercase text-sage">{children}</p>
  );
}
