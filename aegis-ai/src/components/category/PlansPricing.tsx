"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Star } from "lucide-react";
import { PlanTier } from "@/lib/category-data";
import { cn } from "@/lib/utils";

export function PlansPricing({
  plans,
  heroPrompt,
}: {
  plans: PlanTier[];
  heroPrompt: string;
}) {
  const router = useRouter();

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <p className="font-mono text-xs tracking-widest uppercase text-sage mb-3">Pricing</p>
      <h2 className="font-display text-2xl sm:text-3xl text-ink mb-10 max-w-md">
        Plans that scale with what you need.
      </h2>
      <div className={cn("grid gap-5", plans.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              "rounded-3xl border p-6 flex flex-col",
              plan.recommended ? "border-pine bg-pine/5" : "border-surface-line bg-surface/40"
            )}
          >
            {plan.recommended && (
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3 h-3 text-clay fill-clay" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-clay">
                  Most popular
                </span>
              </div>
            )}
            <h3 className="font-display text-xl text-ink mb-1">{plan.name}</h3>
            <div className="font-mono text-2xl text-ink mb-5">
              ${plan.monthlyFrom}
              <span className="text-xs text-sage font-sans">/mo from</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Check className="w-3.5 h-3.5 text-pine mt-0.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push(`/advisor?q=${encodeURIComponent(heroPrompt)}`)}
              className={cn(
                "w-full py-2.5 rounded-full text-sm font-medium transition-colors",
                plan.recommended
                  ? "bg-pine text-paper hover:bg-pine-deep"
                  : "border border-surface-line text-ink hover:border-pine hover:text-pine"
              )}
            >
              Get this plan
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
