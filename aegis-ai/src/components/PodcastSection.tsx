"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mic2, Play, Clock, Users } from "lucide-react";

const EPISODES = [
  { title: "Health Insurance Explained", guest: "Dr. Priya Mehta, Cardiologist", duration: "32 min", listeners: "12.4K", category: "Health" },
  { title: "Life Insurance Myths Debunked", guest: "Rajesh Kumar, CFP", duration: "28 min", listeners: "9.8K", category: "Life" },
  { title: "How Claims Really Work", guest: "Anita Sood, Claims Expert", duration: "41 min", listeners: "14.2K", category: "Claims" },
  { title: "How Much Insurance Do You Need?", guest: "Vikram Nair, Financial Planner", duration: "36 min", listeners: "11.7K", category: "Planning" },
  { title: "Motor Insurance Tips & Tricks", guest: "Suresh Pillai, Motor Specialist", duration: "24 min", listeners: "8.3K", category: "Motor" },
  { title: "AI & The Future of Insurance", guest: "Deepa Krishnan, InsurTech CEO", duration: "45 min", listeners: "16.1K", category: "AI" },
];

const categoryColors: Record<string, string> = {
  Health: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  Life: "bg-pine/10 text-pine border-pine/20",
  Claims: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Planning: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  Motor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  AI: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
};

export function PodcastSection() {
  const reduced = useReducedMotion();

  return (
    <section id="podcast" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
        className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-6"
      >
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">Insurance Simplified</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-ink leading-tight">
            Learn from Experts,
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine-deep via-pine to-pine-bright">
              In Plain Language
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pine/5 border border-pine/20">
          <Mic2 className="w-4 h-4 text-pine" />
          <span className="text-sm font-semibold text-pine">New episodes weekly</span>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {EPISODES.map((ep, i) => (
          <motion.div
            key={ep.title}
            initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.07 }}
            whileHover={reduced ? undefined : { y: -6, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[24px] border border-surface-line/60 bg-surface/90 backdrop-blur-xl p-6 shadow-[0_14px_42px_-24px_rgba(18,24,38,0.12)] cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pine/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[24px]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[11px] px-3 py-1 rounded-full border font-semibold tracking-wide ${categoryColors[ep.category]}`}>
                  {ep.category}
                </span>
                <motion.div
                  whileHover={reduced ? undefined : { scale: 1.1 }}
                  className="w-9 h-9 rounded-full bg-pine flex items-center justify-center shadow-[0_4px_16px_-8px_rgba(252,128,25,0.5)]"
                >
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </motion.div>
              </div>

              <h3 className="font-display font-semibold text-ink text-base leading-snug mb-2">{ep.title}</h3>
              <p className="text-ink-soft text-[13px] mb-4">{ep.guest}</p>

              <div className="flex items-center gap-4 text-[12px] text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />{ep.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />{ep.listeners} listeners
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reduced ? { duration: 0.01 } : { delay: 0.4 }}
        className="text-center mt-10"
      >
        <button
          className="btn-primary px-8 py-3.5"
          id="podcast-all-episodes"
        >
          <Mic2 className="w-4 h-4" />
          Browse All Episodes
        </button>
      </motion.div>
    </section>
  );
}
