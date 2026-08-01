"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ramesh Iyer",
    city: "Chennai",
    rating: 5,
    text: "theBestPolicy helped me find a health plan that actually covered my pre-existing condition. The AI advisor was more helpful than any broker I've spoken to.",
    policy: "Health Insurance",
  },
  {
    name: "Sneha Kulkarni",
    city: "Pune",
    rating: 5,
    text: "My claim was settled in 2 days with their guidance. I had no idea what to submit — they walked me through every document.",
    policy: "Motor Insurance",
  },
  {
    name: "Arjun Menon",
    city: "Kochi",
    rating: 5,
    text: "Finally understood term insurance without being sold to. The coverage gap analysis showed I was dangerously under-insured for my family size.",
    policy: "Term Life Insurance",
  },
  {
    name: "Pooja Aggarwal",
    city: "Delhi",
    rating: 5,
    text: "The comparison was transparent — showed CSR, exclusions, everything. Bought a ₹1Cr term plan in 20 minutes.",
    policy: "Term Life Insurance",
  },
];

const PARTNERS = [
  "PolicyBazaar",
  "Turtlemint",
  "InsuranceDekho",
  "TATA AIG",
];

export function TestimonialsSection() {
  const reduced = useReducedMotion();

  return (
    <>
      <section id="testimonials" className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">Real stories</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
            Customers Who Made
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine-deep via-pine to-pine-bright">
              Smarter Decisions
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.08 }}
              whileHover={reduced ? undefined : { y: -6, scale: 1.015 }}
              className="group relative overflow-hidden rounded-[24px] border border-surface-line/60 bg-surface/90 backdrop-blur-xl p-6 shadow-[0_14px_42px_-24px_rgba(18,24,38,0.12)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pine/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[24px]" />
              <div className="relative z-10">
                <Quote className="w-6 h-6 text-pine/30 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-ink-soft text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                <div className="border-t border-surface-line/60 pt-4">
                  <div className="font-semibold text-ink text-sm">{t.name}</div>
                  <div className="text-[12px] text-ink-soft">{t.city} · {t.policy}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partner Section */}
      <section id="partners" className="px-6 py-16 max-w-5xl mx-auto text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        >
          <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft/50 mb-6">
            Works with India&apos;s leading insurance brokers & insurers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {PARTNERS.map((p, i) => (
              <motion.div
                key={p}
                initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={reduced ? { duration: 0.01 } : { delay: i * 0.08 }}
                className="px-6 py-3 rounded-2xl border border-surface-line/60 bg-surface/70 text-ink-soft text-sm font-semibold hover:border-pine/30 hover:text-pine transition-colors"
              >
                {p}
              </motion.div>
            ))}
            <span className="text-ink-soft/40 text-sm font-medium">+ more</span>
          </div>
          <p className="mt-6 text-[12px] text-ink-soft/50 max-w-lg mx-auto">
            Partner logos are displayed only where authorized. Lead sharing is disclosed transparently per IRDAI guidelines.
          </p>
        </motion.div>
      </section>
    </>
  );
}
