"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ProtectionScore } from "@/lib/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-line/60 ${className}`} />;
}

export function ScorePanel({
  overall,
  breakdown,
  loading,
}: ProtectionScore & { loading?: boolean }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overall / 100) * circumference;
  const weakest = breakdown.length
    ? [...breakdown].sort((a, b) => a.score - b.score)[0]
    : null;

  return (
    <div className="rounded-3xl border border-surface-line bg-surface/50 p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-sage mb-5">
        Protection score
      </p>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="w-24 h-24 rounded-full mx-auto" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-4/5" />
          <Skeleton className="h-2 w-3/5" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 108 108" className="w-24 h-24 -rotate-90">
                <circle cx="54" cy="54" r={radius} fill="none" stroke="var(--surface-line)" strokeWidth="7" />
                <motion.circle
                  cx="54" cy="54" r={radius}
                  fill="none" stroke="var(--pine)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl text-ink">{overall}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {breakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-soft w-12 shrink-0 truncate">{b.label}</span>
                  <div className="flex-1 h-1 rounded-full bg-surface-line overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-pine-bright"
                      initial={{ width: 0 }}
                      animate={{ width: `${b.score}%` }}
                      transition={{ duration: 0.7, delay: 0.15 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {weakest && (
            <>
              <p className="text-xs text-ink-soft mt-5 leading-relaxed">
                {weakest.label} is your weakest area at {weakest.score}.
              </p>
              <Link
                href={`/advisor?q=${encodeURIComponent(`How do I improve my ${weakest.label} protection score?`)}`}
                className="inline-block text-sm text-pine font-medium mt-2"
              >
                Ask how to improve it
              </Link>
            </>
          )}

          {breakdown.length === 0 && (
            <p className="text-xs text-ink-soft mt-4">
              No policies yet.{" "}
              <Link href="/advisor?q=What should I insure first?" className="text-pine">
                Ask Aegis what to cover first
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
