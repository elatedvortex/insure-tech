"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, Zap, Star, Hospital, Smartphone, Eye, AlertCircle } from "lucide-react";

const METRICS = [
  { icon: BarChart3, label: "Claim Settlement Ratio", key: "csr" },
  { icon: Zap, label: "Claim Processing Speed", key: "speed" },
  { icon: Star, label: "Customer Rating", key: "rating" },
  { icon: Hospital, label: "Cashless Hospitals", key: "hospitals" },
  { icon: Smartphone, label: "Digital Claims", key: "digital" },
  { icon: Eye, label: "Transparency Score", key: "transparency" },
];

const INSURERS = [
  { name: "Star Health", csr: "94.2%", speed: "2-3 days", rating: "4.6", hospitals: "14,000+", digital: "Yes", transparency: "9.1/10" },
  { name: "HDFC ERGO", csr: "93.4%", speed: "3-4 days", rating: "4.4", hospitals: "10,000+", digital: "Yes", transparency: "8.8/10" },
  { name: "Niva Bupa", csr: "91.8%", speed: "2-4 days", rating: "4.3", hospitals: "9,500+", digital: "Yes", transparency: "8.5/10" },
  { name: "Care Health", csr: "90.1%", speed: "3-5 days", rating: "4.2", hospitals: "8,600+", digital: "Yes", transparency: "8.2/10" },
  { name: "New India", csr: "89.3%", speed: "4-7 days", rating: "4.0", hospitals: "6,000+", digital: "Partial", transparency: "7.9/10" },
];

export function ClaimSettlementSection() {
  const reduced = useReducedMotion();

  return (
    <section id="claim-settlement" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        className="text-center mb-4"
      >
        <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">Transparency first</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
          Don&apos;t Buy Before Checking
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine-deep via-pine to-pine-bright">
            Claim Settlement
          </span>
        </h2>
        <p className="mt-4 text-ink-soft max-w-2xl mx-auto text-base leading-relaxed">
          The cheapest policy means nothing if claims aren&apos;t settled. We show you what really matters.
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reduced ? { duration: 0.01 } : { delay: 0.15 }}
        className="flex items-start gap-2 mb-8 p-4 rounded-2xl bg-amber-500/6 border border-amber-500/20 max-w-3xl mx-auto"
      >
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[13px] text-ink-soft leading-relaxed">
          Data below is illustrative and based on publicly available IRDAI Annual Report (FY 2023-24). Rankings may change. Always verify on the official{" "}
          <a href="https://www.irdai.gov.in" target="_blank" rel="noopener noreferrer" className="text-pine underline">irdai.gov.in</a>{" "}
          before purchasing any policy.
        </p>
      </motion.div>

      {/* Desktop Table */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22, delay: 0.1 }}
        className="hidden lg:block rounded-[28px] border border-surface-line/60 bg-surface/90 backdrop-blur-xl shadow-[0_20px_60px_-28px_rgba(18,24,38,0.12)] overflow-hidden"
      >
        {/* Header Row */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-pine/5 to-transparent border-b border-surface-line/60 px-6 py-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Insurer</div>
          {METRICS.map((m) => (
            <div key={m.key} className="flex items-center gap-1.5">
              <m.icon className="w-3.5 h-3.5 text-pine" strokeWidth={1.8} />
              <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">{m.label.split(" ")[0]}</span>
            </div>
          ))}
        </div>

        {INSURERS.map((ins, i) => (
          <motion.div
            key={ins.name}
            initial={reduced ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={reduced ? { duration: 0.01 } : { delay: i * 0.06 }}
            whileHover={reduced ? undefined : { backgroundColor: "rgba(252,128,25,0.03)" }}
            className={`grid grid-cols-7 px-6 py-4 transition-colors ${i < INSURERS.length - 1 ? "border-b border-surface-line/40" : ""}`}
          >
            <div className="font-semibold text-ink text-sm flex items-center gap-2">
              {i === 0 && <span className="w-5 h-5 rounded-full bg-pine text-white text-[10px] font-bold flex items-center justify-center">1</span>}
              {ins.name}
            </div>
            <div className="text-sm text-emerald-600 font-semibold">{ins.csr}</div>
            <div className="text-sm text-ink-soft">{ins.speed}</div>
            <div className="text-sm text-ink-soft flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{ins.rating}
            </div>
            <div className="text-sm text-ink-soft">{ins.hospitals}</div>
            <div className="text-sm text-ink-soft">{ins.digital}</div>
            <div className="text-sm font-semibold text-pine">{ins.transparency}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {INSURERS.map((ins, i) => (
          <motion.div
            key={ins.name}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reduced ? { duration: 0.01 } : { delay: i * 0.07 }}
            className="rounded-2xl border border-surface-line/60 bg-surface/90 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-ink">{ins.name}</span>
              <span className="font-mono text-[11px] text-pine bg-pine/8 px-2 py-1 rounded-full">{ins.csr} CSR</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Speed", ins.speed], ["Rating", ins.rating], ["Hospitals", ins.hospitals], ["Transparency", ins.transparency]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="text-[11px] font-mono uppercase tracking-wide text-ink-soft">{k}</div>
                  <div className="text-sm text-ink font-medium mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
