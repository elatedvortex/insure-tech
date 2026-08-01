"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HeartPulse, Car, Shield, ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  {
    icon: HeartPulse,
    label: "Health Insurance",
    desc: "Protect yourself and your family from rising medical costs. Compare plans with the highest claim settlement ratios.",
    slug: "health",
    gradient: "from-rose-500/10 via-transparent to-orange-400/10",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    tag: "Most Popular",
  },
  {
    icon: Shield,
    label: "Life Insurance",
    desc: "Secure your family's future with the right term cover. Know exactly how much you need with our AI analysis.",
    slug: "life",
    gradient: "from-pine/10 via-transparent to-pine-bright/10",
    iconBg: "bg-pine/10",
    iconColor: "text-pine",
    tag: "Best Value",
  },
  {
    icon: Car,
    label: "Motor Insurance",
    desc: "Stay covered on every road. Compare comprehensive plans with zero-depreciation and cashless garage networks.",
    slug: "vehicle",
    gradient: "from-blue-500/10 via-transparent to-cyan-400/10",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    tag: "Quick Renewal",
  },
];

export function InsuranceCategories() {
  const router = useRouter();
  const reduced = useReducedMotion();

  return (
    <section id="insurance-categories" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        className="mb-12"
      >
        <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">What you can protect</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
          Choose Your Protection
        </h2>
        <p className="mt-3 text-ink-soft text-base sm:text-lg max-w-xl leading-relaxed">
          Every category is backed by IRDAI data, real claim ratios and honest AI recommendations.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={reduced ? false : { opacity: 0, y: 32, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
            whileHover={reduced ? undefined : { y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[32px] border border-surface-line/60 bg-surface/90 shadow-[0_20px_60px_-28px_rgba(18,24,38,0.14)] backdrop-blur-xl flex flex-col"
          >
            {/* Tag badge */}
            <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-pine/10 border border-pine/20 text-pine text-[11px] font-semibold tracking-wide">
              {cat.tag}
            </div>

            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-[32px]`} />

            <div className="relative z-10 p-8 flex flex-col flex-1">
              <div className={`w-14 h-14 rounded-3xl ${cat.iconBg} flex items-center justify-center mb-5 shadow-[0_10px_28px_-18px_rgba(0,0,0,0.25)] group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className={`w-7 h-7 ${cat.iconColor}`} strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-2">{cat.label}</h3>
              <p className="text-ink-soft text-sm leading-relaxed flex-1">{cat.desc}</p>

              <div className="mt-7 flex gap-3">
                <motion.button
                  whileHover={reduced ? undefined : { scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/protection/${cat.slug}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-pine text-white text-sm font-semibold hover:bg-pine-deep transition-colors"
                  id={`compare-${cat.slug}`}
                >
                  Compare Now <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
                <button
                  onClick={() => router.push(`/protection/${cat.slug}`)}
                  className="px-4 py-3 rounded-2xl border border-surface-line text-ink-soft text-sm hover:border-pine/40 hover:text-pine transition-colors flex items-center gap-1.5"
                  id={`learn-${cat.slug}`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Learn
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
