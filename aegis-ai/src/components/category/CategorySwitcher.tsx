"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Car, HeartPulse, Home as HomeIcon, Plane, Shield, Briefcase, PawPrint } from "lucide-react";
import { getAllCategorySlugs, CATEGORIES } from "@/lib/category-data";
import { cn } from "@/lib/utils";

const ICONS = {
  pet: PawPrint,
  life: Shield,
  vehicle: Car,
  health: HeartPulse,
  home: HomeIcon,
  travel: Plane,
  business: Briefcase,
};

export function CategorySwitcher({ activeSlug }: { activeSlug?: string }) {
  const slugs = getAllCategorySlugs();

  return (
    <div className="sticky top-[57px] z-30 bg-paper/80 backdrop-blur-xl border-b border-surface-line/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
          {slugs.map((slug) => {
            const cat = CATEGORIES[slug];
            const Icon = ICONS[cat.accentIcon];
            const isActive = slug === activeSlug;
            return (
              <Link
                key={slug}
                href={`/protection/${slug}`}
                className="relative shrink-0 px-4 py-2 rounded-full flex items-center gap-1.5"
              >
                {isActive && (
                  <motion.div
                    layoutId="category-pill"
                    className="absolute inset-0 bg-pine rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 relative z-10 transition-colors",
                    isActive ? "text-paper" : "text-sage"
                  )}
                  strokeWidth={1.75}
                />
                <span
                  className={cn(
                    "relative z-10 text-sm font-medium whitespace-nowrap transition-colors",
                    isActive ? "text-paper" : "text-ink-soft"
                  )}
                >
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
