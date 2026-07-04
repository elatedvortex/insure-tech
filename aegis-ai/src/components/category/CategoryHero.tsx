"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CategoryIcon } from "./CategoryIcon";
import { CategoryConfig } from "@/lib/category-data";

export function CategoryHero({ category }: { category: CategoryConfig }) {
  const router = useRouter();

  return (
    <section className="relative px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-24 h-24 sm:w-28 sm:h-28 text-pine mb-6"
        >
          <CategoryIcon kind={category.accentIcon} className="w-full h-full" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-mono text-xs tracking-widest uppercase text-sage mb-4"
        >
          {category.label} protection
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-3xl sm:text-5xl text-ink leading-[1.1] max-w-xl"
        >
          {category.tagline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-ink-soft mt-4 max-w-lg text-[15px] leading-relaxed"
        >
          {category.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="flex flex-col sm:flex-row gap-3 mt-9"
        >
          <button
            onClick={() => router.push(`/advisor?q=${encodeURIComponent(category.heroPrompt)}`)}
            className="px-7 py-3.5 rounded-full bg-pine text-paper font-medium hover:bg-pine-deep transition-colors"
          >
            Get a quote from Aegis
          </button>
          <button
            onClick={() =>
              document.getElementById("coverage")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3.5 rounded-full border border-surface-line text-ink-soft hover:border-pine hover:text-pine transition-colors"
          >
            See what&apos;s covered
          </button>
        </motion.div>
      </div>
    </section>
  );
}
