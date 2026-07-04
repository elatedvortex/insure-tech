"use client";

import { motion } from "framer-motion";
import { Presence } from "../Presence";
import { AttentionItem } from "@/lib/dashboard-data";

function getDaypart() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export function WorkspaceGreeting({
  name,
  topItem,
}: {
  name: string;
  topItem?: AttentionItem;
}) {
  return (
    <div className="pt-10 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2.5 mb-4"
      >
        <Presence size="sm" />
        <span className="font-mono text-xs tracking-widest uppercase text-sage">
          Your workspace
        </span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-display text-3xl sm:text-4xl text-ink leading-tight max-w-2xl"
      >
        Good {getDaypart()}, {name}.
      </motion.h1>
      {topItem && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="text-ink-soft mt-3 max-w-xl text-[15px] leading-relaxed"
        >
          Here&apos;s what matters most right now:{" "}
          <span className="text-ink">{topItem.title.toLowerCase()}</span>.
        </motion.p>
      )}
    </div>
  );
}
