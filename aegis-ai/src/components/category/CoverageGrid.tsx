"use client";

import { motion } from "framer-motion";
import { CoverageItem } from "@/lib/category-data";

export function CoverageGrid({ items, label }: { items: CoverageItem[]; label: string }) {
  return (
    <section id="coverage" className="px-6 py-16 max-w-5xl mx-auto scroll-mt-20">
      <p className="font-mono text-xs tracking-widest uppercase text-sage mb-3">
        What&apos;s covered
      </p>
      <h2 className="font-display text-2xl sm:text-3xl text-ink mb-10 max-w-md">
        {label} coverage, laid out plainly.
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-surface-line bg-surface/50 p-5 transition-colors hover:border-pine/40"
          >
            <h3 className="font-display text-base text-ink mb-1.5">{item.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
