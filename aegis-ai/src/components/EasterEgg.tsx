"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Cat, Dog } from "lucide-react";
import { usePetState } from "./PetStateProvider";

export function EasterEgg() {
  const { scrollY } = useScroll();
  const { isCat, togglePet } = usePetState();

  // When scrolling down, peek out.
  const rawX = useTransform(
    scrollY,
    [0, 200, 400, 1200, 1500],
    [100, 100, -10, -10, 100] // 100 is hidden off-screen to the right, -10 peeks out slightly
  );

  const rawRotate = useTransform(
    scrollY,
    [200, 400, 1200, 1500],
    [45, -15, -15, 45]
  );

  const springX = useSpring(rawX, { stiffness: 200, damping: 25 });
  const springRotate = useSpring(rawRotate, { stiffness: 200, damping: 25 });

  return (
    <motion.div
      className="fixed top-1/2 right-0 -translate-y-1/2 z-100 bg-surface/80 backdrop-blur-xl border-t border-b border-l border-white/10 rounded-l-[32px] p-4 shadow-2xl origin-right cursor-pointer"
      style={{
        x: springX,
        rotate: springRotate,
      }}
      whileHover={{ scale: 1.1, x: -25, rotate: 0 }}
      whileTap={{ scale: 0.9 }}
      onClick={togglePet}
      title="Woof / Meow"
    >
      {isCat ? (
        <Cat className="w-8 h-8 text-clay" strokeWidth={1.5} />
      ) : (
        <Dog className="w-8 h-8 text-pine-bright" strokeWidth={1.5} />
      )}
    </motion.div>
  );
}
