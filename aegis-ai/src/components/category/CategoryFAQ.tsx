"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaqItem } from "@/lib/category-data";

export function CategoryFAQ({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto">
      <p className="font-mono text-xs tracking-widest uppercase text-sage mb-3">Questions</p>
      <h2 className="font-display text-2xl sm:text-3xl text-ink mb-8">Before you decide.</h2>
      <div className="divide-y divide-surface-line">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="py-4">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between text-left gap-4"
              >
                <span className="font-display text-base sm:text-lg text-ink">{f.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sage text-2xl leading-none shrink-0"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-ink-soft leading-relaxed pt-3 pr-8">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
