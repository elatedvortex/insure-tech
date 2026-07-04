"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertCircle, Sparkles, RefreshCw, FileCheck, ArrowRight } from "lucide-react";
import { AttentionItem } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const ICONS = {
  recommendation: Sparkles,
  task: AlertCircle,
  renewal: RefreshCw,
  claim: FileCheck,
};

const URGENCY_STYLES = {
  high: "border-clay/40 bg-clay-soft/40",
  medium: "border-surface-line bg-surface/60",
  low: "border-surface-line bg-surface/30",
};

function Skeleton() {
  return (
    <div className="rounded-2xl border border-surface-line p-5 animate-pulse">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-surface-line shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-line rounded w-3/4" />
          <div className="h-3 bg-surface-line rounded w-full" />
          <div className="h-3 bg-surface-line rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function AttentionStream({
  items,
  loading,
}: {
  items: AttentionItem[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => <Skeleton key={i} />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-line bg-surface/30 p-6 text-center">
        <p className="text-sm text-ink-soft">Nothing needs your attention right now.</p>
        <Link href="/advisor" className="inline-block text-sm text-pine font-medium mt-2">
          Ask Aegis anything →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const Icon = ICONS[item.kind];
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={cn("rounded-2xl border p-5", URGENCY_STYLES[item.urgency])}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  item.urgency === "high" ? "bg-clay/15 text-clay" : "bg-pine/10 text-pine",
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-[17px] text-ink leading-snug">{item.title}</h3>
                <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">{item.detail}</p>
                {item.reasoning && (
                  <p className="text-xs text-sage mt-2 italic">{item.reasoning}</p>
                )}
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-sm text-pine font-medium mt-3 group"
                >
                  {item.cta}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
