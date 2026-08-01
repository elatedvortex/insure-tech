"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Brain, Users, EyeOff, BarChart2, LifeBuoy, RefreshCw, FileText, Users2, Badge, Zap } from "lucide-react";

const FEATURES = [
  { icon: Brain, title: "AI-Powered Recommendations", desc: "Unbiased analysis of 140+ plans tailored to your life stage.", badge: null },
  { icon: Users, title: "Human Insurance Experts", desc: "Licensed advisors available when you need a real conversation.", badge: null },
  { icon: EyeOff, title: "No Hidden Costs", desc: "Zero consultation fees. Full transparency on what we earn.", badge: null },
  { icon: BarChart2, title: "Transparent Comparisons", desc: "Honest data sourced from IRDAI public reports.", badge: null },
  { icon: LifeBuoy, title: "Lifetime Claim Support", desc: "We guide you through every claim — from filing to settlement.", badge: null },
  { icon: RefreshCw, title: "Renewal Assistance", desc: "AI reminders and smart renewal options before you lapse.", badge: null },
  { icon: FileText, title: "Annual Policy Review", desc: "Your cover reviewed yearly as your life changes.", badge: null },
  { icon: Users2, title: "Family Insurance Planning", desc: "One dashboard for every member of your family.", badge: "Coming Soon" },
];

export function WhyChooseSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="why-choose"
      className="px-6 py-20 mx-4 sm:mx-6 rounded-[40px] my-10"
      style={{ background: "linear-gradient(135deg, #1a0a00 0%, #2d1100 50%, #1a0a00 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 22 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">Our promise</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-white leading-tight">
            Why Choose theBestPolicy
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto text-base leading-relaxed">
            Eight reasons the smartest insurance buyers trust us.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: i * 0.06 }}
              whileHover={reduced ? undefined : { y: -6, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pine/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[24px]" />
              {feat.badge && (
                <div className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full bg-pine/20 text-pine border border-pine/30 font-semibold tracking-wide">
                  {feat.badge}
                </div>
              )}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-pine/15 flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5 text-pine" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
