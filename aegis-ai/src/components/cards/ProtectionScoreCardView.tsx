"use client";

import { ProtectionScoreCard } from "@/lib/types";
import { motion } from "framer-motion";

export function ProtectionScoreCardView({ card }: { card: ProtectionScoreCard }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (card.overall / 100) * circumference;

  return (
    <div className="rounded-2xl border border-surface-line bg-surface/60 p-6 max-w-md">
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--surface-line)" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--pine)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl text-ink">{card.overall}</span>
            <span className="text-[10px] text-sage">/ 100</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {card.breakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-xs text-ink-soft w-14 shrink-0">{b.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-surface-line overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-pine-bright"
                  initial={{ width: 0 }}
                  animate={{ width: `${b.score}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <span className="font-mono text-[11px] text-sage w-6 text-right">{b.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
