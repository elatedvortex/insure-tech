"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Presence } from "../Presence";

export function CategoryCTA({ label, prompt }: { label: string; prompt: string }) {
  const router = useRouter();

  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center rounded-[32px] bg-pine-deep text-paper px-8 py-16"
      >
        <div className="flex justify-center mb-5">
          <Presence size="md" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl leading-tight">
          Ready to talk {label.toLowerCase()} coverage?
        </h2>
        <p className="text-paper/70 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
          No forms — just tell Aegis your situation and get a real recommendation in minutes.
        </p>
        <button
          onClick={() => router.push(`/advisor?q=${encodeURIComponent(prompt)}`)}
          className="mt-8 px-7 py-3.5 rounded-full bg-paper text-pine-deep font-medium hover:bg-paper-dim transition-colors"
        >
          Talk to Aegis
        </button>
      </motion.div>
    </section>
  );
}
