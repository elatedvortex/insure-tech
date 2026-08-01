"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Compass, Search, BookOpen, ShoppingCart, FileCheck, RefreshCw, ShieldCheck } from "lucide-react";

const JOURNEY_STEPS = [
  { icon: Compass, step: "1", label: "Discover", desc: "Understand what coverage you actually need" },
  { icon: Search, step: "2", label: "Compare", desc: "Honest comparison across 140+ plans" },
  { icon: BookOpen, step: "3", label: "Understand", desc: "Plain-language explanation of every term" },
  { icon: ShoppingCart, step: "4", label: "Buy", desc: "Secure purchase in minutes" },
  { icon: FileCheck, step: "5", label: "Claim", desc: "Expert support from day one" },
  { icon: RefreshCw, step: "6", label: "Renew", desc: "AI-powered renewal reminders" },
  { icon: ShieldCheck, step: "7", label: "Stay Protected", desc: "Lifetime partnership, not a one-time sale" },
];

export function CustomerJourneySection() {
  const reduced = useReducedMotion();

  return (
    <section id="journey" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        className="text-center mb-16"
      >
        <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">Your path to protection</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
          We Stay With You,{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine-deep via-pine to-pine-bright">
            Every Step
          </span>
        </h2>
        <p className="mt-4 text-ink-soft max-w-lg mx-auto text-base leading-relaxed">
          From your first question to your last claim — and every renewal in between.
        </p>
      </motion.div>

      {/* Desktop horizontal flow */}
      <div className="hidden lg:flex items-start justify-between relative">
        {/* Connector line */}
        <div className="absolute top-8 left-[calc(100%/14)] right-[calc(100%/14)] h-[2px] bg-gradient-to-r from-pine/20 via-pine/60 to-pine/20" />

        {JOURNEY_STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
            className="flex flex-col items-center gap-3 text-center flex-1 px-2"
          >
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.12, y: -4 }}
              className="relative w-16 h-16 rounded-2xl bg-surface border-2 border-surface-line shadow-[0_8px_32px_-12px_rgba(18,24,38,0.18)] flex items-center justify-center z-10 transition-all duration-200 hover:border-pine/50"
            >
              <step.icon className="w-7 h-7 text-pine" strokeWidth={1.8} />
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-pine text-white text-[10px] font-bold flex items-center justify-center">
                {step.step}
              </div>
            </motion.div>
            <div className="font-display font-semibold text-ink text-sm">{step.label}</div>
            <div className="text-ink-soft text-[12px] leading-snug">{step.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Mobile vertical flow */}
      <div className="lg:hidden space-y-4">
        {JOURNEY_STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            initial={reduced ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={reduced ? { duration: 0.01 } : { delay: i * 0.06 }}
            className="flex items-center gap-4 p-4 rounded-2xl border border-surface-line/60 bg-surface/80 backdrop-blur-sm"
          >
            <div className="relative w-12 h-12 rounded-xl bg-pine/10 flex items-center justify-center shrink-0">
              <step.icon className="w-5 h-5 text-pine" strokeWidth={1.8} />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pine text-white text-[9px] font-bold flex items-center justify-center">
                {step.step}
              </div>
            </div>
            <div>
              <div className="font-semibold text-ink text-sm">{step.label}</div>
              <div className="text-ink-soft text-[13px]">{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
