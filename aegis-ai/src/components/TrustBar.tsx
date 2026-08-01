"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Shield, Brain, Users, TrendingUp, BadgeCheck, Clock } from "lucide-react";

const TRUST_POINTS = [
  { icon: Brain, label: "AI-Powered Recommendations", desc: "Unbiased, data-driven policy matching" },
  { icon: BadgeCheck, label: "IRDAI Data Backed", desc: "Public insurer data & claim ratios" },
  { icon: Users, label: "Licensed Human Advisors", desc: "Real experts, always available" },
  { icon: Shield, label: "No Commission Bias", desc: "We recommend the right policy, not the highest paying" },
  { icon: TrendingUp, label: "Claim Settlement Insights", desc: "Transparent ratios from IRDAI reports" },
  { icon: Clock, label: "Lifetime Policy Support", desc: "We stay with you from buy to claim" },
];

export function TrustBar() {
  const reduced = useReducedMotion();

  return (
    <section id="why-trust" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        className="text-center mb-14"
      >
        <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">Why 50,000+ Indians choose us</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
          We&apos;re Not a Comparison Website.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine-deep via-pine to-pine-bright">
            We&apos;re Your Insurance Partner.
          </span>
        </h2>
        <p className="mt-4 text-ink-soft max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Unlike aggregators who push the cheapest policy, we use AI, transparency and human expertise to help you choose the right one.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRUST_POINTS.map((pt, i) => (
          <motion.div
            key={pt.label}
            initial={reduced ? false : { opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.08 }}
            whileHover={reduced ? undefined : { y: -6, scale: 1.015 }}
            className="group relative overflow-hidden rounded-[28px] border border-surface-line/60 bg-surface/80 p-7 shadow-[0_16px_48px_-28px_rgba(18,24,38,0.14)] backdrop-blur-xl cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pine/6 via-transparent to-clay/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[28px]" />
            <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-pine/10 blur-2xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-pine/10 flex items-center justify-center shrink-0 shadow-[0_8px_24px_-16px_rgba(252,128,25,0.4)] group-hover:bg-pine/15 transition-colors">
                <pt.icon className="w-5 h-5 text-pine" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-display text-[16px] font-semibold text-ink mb-1">{pt.label}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{pt.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
