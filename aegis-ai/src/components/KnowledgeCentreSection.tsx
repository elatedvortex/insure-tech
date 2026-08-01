"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, ArrowRight, Tag } from "lucide-react";

const ARTICLES = [
  { tag: "Health", title: "Best Health Insurance Plans in India 2024", read: "8 min", href: "#" },
  { tag: "IRDAI", title: "Latest IRDAI Guidelines: What They Mean for You", read: "5 min", href: "#" },
  { tag: "Tax", title: "Save ₹1.5L in Tax with the Right Insurance Plan", read: "6 min", href: "#" },
  { tag: "Claims", title: "How to File a Health Insurance Claim — Step by Step", read: "9 min", href: "#" },
  { tag: "Life", title: "How Much Term Insurance Does Your Family Need?", read: "7 min", href: "#" },
  { tag: "Motor", title: "Zero Depreciation vs Comprehensive: What to Choose", read: "5 min", href: "#" },
  { tag: "Retirement", title: "ULIP vs Mutual Fund: Which is Right for You?", read: "10 min", href: "#" },
  { tag: "Health", title: "Top 5 Cashless Hospital Networks in India (2024)", read: "4 min", href: "#" },
];

const TAGS = ["All", "Health", "Life", "Motor", "IRDAI", "Claims", "Tax", "Retirement"];

const tagStyles: Record<string, string> = {
  Health: "bg-rose-500/10 text-rose-600",
  IRDAI: "bg-pine/10 text-pine",
  Tax: "bg-emerald-500/10 text-emerald-600",
  Claims: "bg-amber-500/10 text-amber-600",
  Life: "bg-violet-500/10 text-violet-600",
  Motor: "bg-blue-500/10 text-blue-600",
  Retirement: "bg-cyan-500/10 text-cyan-600",
  All: "bg-ink/10 text-ink",
};

export function KnowledgeCentreSection() {
  const [activeTag, setActiveTag] = useState("All");
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();

  const filtered = ARTICLES.filter((a) =>
    (activeTag === "All" || a.tag === activeTag) &&
    (query === "" || a.title.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <section id="knowledge-centre" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        className="text-center mb-10"
      >
        <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">Knowledge Centre</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
          Insurance Intelligence,
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine-deep via-pine to-pine-bright">
            Always Free
          </span>
        </h2>
        <p className="mt-4 text-ink-soft max-w-xl mx-auto text-base leading-relaxed">
          Expert guides, IRDAI updates, and tax tips — written in plain language.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reduced ? { duration: 0.01 } : { delay: 0.12 }}
        className="relative max-w-lg mx-auto mb-8"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-soft" />
        <input
          type="search"
          placeholder="Search articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-input pl-11 rounded-2xl"
          id="knowledge-search"
          aria-label="Search knowledge centre articles"
        />
      </motion.div>

      {/* Tag Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`text-[13px] px-4 py-2 rounded-full border transition-all duration-200 font-medium ${
              activeTag === tag
                ? "border-pine bg-pine text-white shadow-[0_4px_16px_-8px_rgba(252,128,25,0.4)]"
                : "border-surface-line text-ink-soft hover:border-pine/40 hover:text-pine"
            }`}
            id={`filter-${tag.toLowerCase()}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((article, i) => (
          <motion.a
            key={article.title}
            href={article.href}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reduced ? { duration: 0.01 } : { delay: i * 0.06 }}
            whileHover={reduced ? undefined : { y: -5, scale: 1.015 }}
            className="group relative overflow-hidden rounded-[22px] border border-surface-line/60 bg-surface/90 backdrop-blur-xl p-5 shadow-[0_12px_36px_-24px_rgba(18,24,38,0.12)] flex flex-col"
            id={`article-${i}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pine/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[22px]" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${tagStyles[article.tag]}`}>
                  <Tag className="w-3 h-3 inline mr-1" />{article.tag}
                </span>
                <span className="text-[11px] text-ink-soft font-mono">{article.read} read</span>
              </div>
              <h3 className="font-display font-semibold text-ink text-sm leading-snug flex-1 mb-4 group-hover:text-pine transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-1 text-pine text-[13px] font-semibold">
                Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-ink-soft">
          No articles found for &quot;{query}&quot;. Try a different search.
        </div>
      )}
    </section>
  );
}
