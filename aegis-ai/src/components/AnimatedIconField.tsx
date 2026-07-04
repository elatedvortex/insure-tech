"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LucideIcon, Dog, Cat, Car, HeartPulse, Home as HomeIcon, Plane, Shield, Briefcase, Bone } from "lucide-react";

export type IconFieldKind = "pet" | "life" | "vehicle" | "health" | "home" | "travel" | "business" | "mixed";

const ICON_SETS: Record<IconFieldKind, LucideIcon[]> = {
  pet: [Dog, Cat, Bone],
  life: [Shield],
  vehicle: [Car],
  health: [HeartPulse],
  home: [HomeIcon],
  travel: [Plane],
  business: [Briefcase],
  mixed: [Dog, Car, HeartPulse, HomeIcon, Plane, Shield, Briefcase, Cat],
};

interface Placement {
  Icon: LucideIcon;
  size: number;
  left: string;
  top: string;
  rotateFrom: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}

function seededPlacements(kind: IconFieldKind, count: number): Placement[] {
  const icons = ICON_SETS[kind];
  const positions = [
    { left: "6%", top: "12%" },
    { left: "82%", top: "8%" },
    { left: "15%", top: "68%" },
    { left: "78%", top: "62%" },
    { left: "45%", top: "20%" },
    { left: "50%", top: "80%" },
    { left: "90%", top: "40%" },
    { left: "4%", top: "42%" },
  ];
  return Array.from({ length: count }).map((_, i) => ({
    Icon: icons[i % icons.length],
    size: 60 + ((i * 37) % 60),
    left: positions[i % positions.length].left,
    top: positions[i % positions.length].top,
    rotateFrom: (i * 23) % 30 - 15,
    driftX: 18 + (i % 3) * 10,
    driftY: 14 + (i % 4) * 8,
    duration: 14 + (i % 5) * 3,
    delay: i * 0.6,
  }));
}

export function AnimatedIconField({
  kind,
  count = 7,
  opacity = 0.09,
}: {
  kind: IconFieldKind;
  count?: number;
  opacity?: number;
}) {
  const [reduced, setReduced] = useState(false);
  const placements = useMemo(() => seededPlacements(kind, count), [kind, count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden text-pine"
      style={{ opacity }}
    >
      {placements.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: p.left, top: p.top }}
          initial={{ rotate: p.rotateFrom }}
          animate={
            reduced
              ? undefined
              : {
                  x: [0, p.driftX, 0, -p.driftX, 0],
                  y: [0, -p.driftY, 0, p.driftY, 0],
                  rotate: [p.rotateFrom, p.rotateFrom + 8, p.rotateFrom, p.rotateFrom - 8, p.rotateFrom],
                }
          }
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        >
          <p.Icon size={p.size} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
