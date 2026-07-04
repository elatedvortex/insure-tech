"use client";

import { motion } from "framer-motion";

export function ValueProps({
  items,
}: {
  items: { title: string; detail: string }[];
}) {
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <div className="grid sm:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-pine mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 300 }}
            />
            <h3 className="font-display text-lg text-ink mb-1.5">{item.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
