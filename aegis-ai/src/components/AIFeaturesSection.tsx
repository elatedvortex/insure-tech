"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Brain, Bot, Bell, Users2, Calculator, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const AI_FEATURES = [
  { icon: Brain, title: "AI Policy Advisor", desc: "Get personalised policy recommendations based on your life stage, income and risk profile.", live: true },
  { icon: Bot, title: "AI Claim Assistant", desc: "Step-by-step guidance through every claim — document checklist, insurer timelines and escalation paths.", live: false },
  { icon: Bell, title: "AI Renewal Reminder", desc: "Never lapse again. Smart reminders with comparison data before your renewal date.", live: false },
  { icon: Users2, title: "AI Family Insurance Planner", desc: "One view for every family member's coverage. Gaps, overlaps and optimisation in seconds.", live: false },
  { icon: Calculator, title: "AI Risk Calculator", desc: "Understand your true risk exposure based on health, lifestyle and financial goals.", live: false },
  { icon: AlertCircle, title: "AI Coverage Gap Analyzer", desc: "Find exactly where your current policies leave you exposed — before a claim does.", live: true },
];

export function AIFeaturesSection() {
  const reduced = useReducedMotion();
  const router = useRouter();

  return (
    <section id="ai-features" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        className="text-center mb-14"
      >
        <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">AI-First Platform</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
          Your AI Insurance Suite
        </h2>
        <p className="mt-4 text-ink-soft max-w-xl mx-auto text-base leading-relaxed">
          Six intelligent tools designed to help you buy smarter, claim faster and stay protected longer.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {AI_FEATURES.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.08 }}
            whileHover={reduced ? undefined : { y: -6, scale: 1.015 }}
            className="group relative overflow-hidden rounded-[26px] border border-surface-line/60 bg-surface/90 backdrop-blur-xl p-7 shadow-[0_16px_48px_-28px_rgba(18,24,38,0.12)]"
          >
            {/* AI shimmer gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 via-pine/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-[26px]" />

            {/* Status badge */}
            <div className="absolute top-5 right-5">
              {feat.live ? (
                <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-breathe" />Live
                </span>
              ) : (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-pine/8 border border-pine/20 text-pine font-semibold">
                  Coming Soon
                </span>
              )}
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3b82f6]/10 to-pine/10 flex items-center justify-center mb-5 shadow-[0_8px_24px_-16px_rgba(59,130,246,0.3)]">
                <feat.icon className="w-6 h-6 text-pine" strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink mb-2">{feat.title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{feat.desc}</p>

              {feat.live && (
                <motion.button
                  whileHover={reduced ? undefined : { x: 4 }}
                  onClick={() => router.push("/advisor")}
                  className="mt-5 flex items-center gap-1.5 text-pine text-sm font-semibold group/btn"
                  id={`ai-feature-${i}`}
                >
                  Try it now <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function FinalCTASection() {
  const reduced = useReducedMotion();
  const router = useRouter();

  return (
    <motion.section
      id="final-cta"
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
      className="px-6 py-32 text-center max-w-4xl mx-auto"
    >
      <p className="font-mono text-xs tracking-widest uppercase text-pine mb-5">Ready?</p>
      <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-bold text-ink leading-tight mb-6">
        Ready to Choose the
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine-deep via-pine to-pine-bright">
          Best Policy?
        </span>
      </h2>
      <p className="text-ink-soft text-base sm:text-xl max-w-lg mx-auto leading-relaxed mb-10">
        Join thousands of smart Indians who chose the right policy — not just the cheapest one.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.button
          whileHover={reduced ? undefined : { y: -3, scale: 1.03, boxShadow: "0 24px 56px -18px rgba(252,128,25,0.55)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/protection/health")}
          className="btn-primary text-base px-10 py-4 gap-2"
          id="final-compare-cta"
        >
          <Sparkles className="w-5 h-5" />
          Compare Policies
        </motion.button>
        <motion.button
          whileHover={reduced ? undefined : { y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/advisor")}
          className="px-10 py-4 rounded-full border border-surface-line bg-surface/70 backdrop-blur-sm text-ink font-semibold text-base hover:border-pine/40 hover:bg-pine/5 transition-all duration-200"
          id="final-advisor-cta"
        >
          Get AI Recommendation
        </motion.button>
      </div>

      {/* Compliance disclaimer */}
      <p className="mt-12 text-[12px] text-ink-soft/50 max-w-2xl mx-auto leading-relaxed">
        Insurance is subject to terms, conditions, underwriting, and policy wording. theBestPolicy is an AI-powered insurance advisory platform.
        All insurer data sourced from publicly available IRDAI reports. We earn through partner referrals which is disclosed transparently.
        Please read policy documents carefully before purchase.
      </p>
    </motion.section>
  );
}
