"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Brain, ChevronRight, User, Award, AlertTriangle, DollarSign, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const FLOW_STEPS = [
  { icon: User, label: "Customer Profile", desc: "Your age, health status, income & dependents", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Brain, label: "AI Analysis", desc: "Deep analysis across 200+ data points", color: "text-pine", bg: "bg-pine/10" },
  { icon: Award, label: "Recommended Policies", desc: "Top plans ranked by suitability, not premium", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: AlertTriangle, label: "Coverage Gap Analysis", desc: "What your current cover is missing", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: DollarSign, label: "Premium Estimate", desc: "Accurate, personalised cost projection", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: CheckCircle2, label: "Claim Strength Score", desc: "How well a policy actually pays out", color: "text-violet-500", bg: "bg-violet-500/10" },
];

export function AIAdvisorSection() {
  const [activeStep, setActiveStep] = useState(0);
  const reduced = useReducedMotion();
  const router = useRouter();

  return (
    <section id="ai-advisor" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        className="text-center mb-16"
      >
        <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">Powered by AI</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
          Meet Your AI Insurance Advisor
        </h2>
        <p className="mt-4 text-ink-soft max-w-xl mx-auto text-base leading-relaxed">
          From your profile to the perfect policy — our AI analyses every angle so you never miss a thing.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-3">
          {FLOW_STEPS.map((step, i) => (
            <motion.button
              key={step.label}
              initial={reduced ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.07 }}
              onClick={() => setActiveStep(i)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${
                activeStep === i
                  ? "border-pine/40 bg-pine/5 shadow-[0_4px_24px_-12px_rgba(252,128,25,0.25)]"
                  : "border-surface-line/60 bg-surface/70 hover:border-pine/20"
              }`}
              id={`ai-step-${i}`}
            >
              <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center shrink-0`}>
                <step.icon className={`w-5 h-5 ${step.color}`} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-ink text-sm">{step.label}</div>
                <div className="text-ink-soft text-[13px] mt-0.5">{step.desc}</div>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 ${activeStep === i ? "text-pine" : "text-ink-soft/30"}`} />
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22, delay: 0.2 }}
          className="sticky top-24"
        >
          <div className="rounded-[32px] border border-surface-line/60 bg-surface/90 backdrop-blur-xl shadow-[0_24px_64px_-28px_rgba(18,24,38,0.16)] overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-line/60 flex items-center gap-3 bg-gradient-to-r from-pine/5 to-transparent">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-breathe" />
              <span className="text-[13px] font-mono text-ink-soft tracking-wide">AI Analysis · Live Demo</span>
            </div>

            <div className="p-6 min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div key="profile"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    className="space-y-4"
                  >
                    <h4 className="font-display font-semibold text-ink">Customer Profile</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[["Name", "Priya Sharma"], ["Age", "34"], ["City", "Bengaluru"], ["Current Cover", "₹10L"]].map(([k, v]) => (
                        <div key={k} className="bg-paper-dim/60 rounded-xl p-3">
                          <div className="text-[11px] text-ink-soft uppercase tracking-wider font-mono">{k}</div>
                          <div className="font-semibold text-ink mt-0.5">{v}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeStep === 1 && (
                  <motion.div key="analysis"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    className="space-y-4"
                  >
                    <h4 className="font-display font-semibold text-ink">AI is analysing…</h4>
                    {["Health profile & risk factors", "Income & dependent ratio", "Matching 140+ plans", "Claim settlement history"].map((item, i) => (
                      <motion.div key={item}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-pine animate-breathe" />
                        <span className="text-sm text-ink-soft">{item}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {activeStep === 2 && (
                  <motion.div key="recommended"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    className="space-y-3"
                  >
                    <h4 className="font-display font-semibold text-ink">Top Recommendation</h4>
                    <div className="bg-pine/5 border border-pine/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-pine" />
                        <span className="font-semibold text-ink text-sm">Star Health Comprehensive</span>
                      </div>
                      <div className="text-[13px] text-ink-soft">Recommended based on CSR, cashless network and your health profile.</div>
                    </div>
                    <p className="text-[11px] text-ink-soft/60">Rankings are illustrative. Based on publicly available IRDAI data. Verify before purchase.</p>
                  </motion.div>
                )}
                {activeStep === 3 && (
                  <motion.div key="gap"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    className="space-y-3"
                  >
                    <h4 className="font-display font-semibold text-ink">Coverage Gap Found</h4>
                    <div className="bg-rose-500/8 border border-rose-500/20 rounded-2xl p-4">
                      <div className="text-rose-600 font-bold text-lg">₹15L under-insured</div>
                      <div className="text-[13px] text-ink-soft mt-1">Based on city, age and inflation-adjusted medical costs</div>
                    </div>
                    <div className="text-[13px] text-ink-soft">A ₹25L cover would adequately protect your family in Bengaluru.</div>
                  </motion.div>
                )}
                {activeStep === 4 && (
                  <motion.div key="premium"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    className="space-y-3"
                  >
                    <h4 className="font-display font-semibold text-ink">Premium Estimate</h4>
                    <div className="flex items-end gap-1">
                      <span className="font-display text-4xl font-bold text-pine">₹14,800</span>
                      <span className="text-ink-soft text-sm mb-1">/year</span>
                    </div>
                    <p className="text-[13px] text-ink-soft">For ₹25L health cover with zero-co-payment. Final premium subject to underwriting.</p>
                  </motion.div>
                )}
                {activeStep === 5 && (
                  <motion.div key="claim"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    className="space-y-3"
                  >
                    <h4 className="font-display font-semibold text-ink">Claim Strength Score</h4>
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20">
                        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(252,128,25,0.12)" strokeWidth="8" />
                          <motion.circle cx="40" cy="40" r="34" fill="none" stroke="#FC8019" strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 34}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 34 * 0.09 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold text-ink text-lg">91</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-ink font-semibold">Excellent</div>
                        <div className="text-[13px] text-ink-soft">CSR: 94.2% (FY 2023-24)</div>
                        <div className="text-[11px] text-ink-soft/60 mt-1">Source: IRDAI Annual Report</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-6 pb-6">
              <motion.button
                whileHover={reduced ? undefined : { y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/advisor")}
                className="w-full btn-primary py-3.5 text-sm gap-2"
                id="ai-advisor-cta"
              >
                <Sparkles className="w-4 h-4" />
                Get My AI Recommendation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
