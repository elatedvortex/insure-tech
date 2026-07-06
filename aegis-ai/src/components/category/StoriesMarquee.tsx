"use client";

import { motion } from "framer-motion";
import { StoryItem } from "@/lib/category-data";

export function StoriesMarquee({ stories }: { stories: StoryItem[] }) {
  const loop = [...stories, ...stories];

  return (
    <section className="py-16 overflow-hidden">
      <div className="px-6 max-w-5xl mx-auto mb-8">
        <p className="font-mono text-xs tracking-widest uppercase text-sage mb-3">
          In practice
        </p>
        <h2 className="font-display text-2xl sm:text-3xl text-ink max-w-md">
          What this actually looks like.
        </h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-paper to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-paper to-transparent z-10" />

        <motion.div
          className="flex gap-4 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: stories.length * 8, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((s, i) => (
            <div
              key={i}
              className="shrink-0 w-72 rounded-2xl border border-surface-line bg-surface/50 p-5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-pine/10 flex items-center justify-center">
                  <span className="font-display text-sm text-pine">{s.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm text-ink font-medium leading-none">{s.name}</p>
                  <p className="text-[11px] text-sage mt-1">{s.context}</p>
                </div>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed mb-2.5">{s.situation}</p>
              <p className="text-sm text-pine leading-relaxed">{s.outcome}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
