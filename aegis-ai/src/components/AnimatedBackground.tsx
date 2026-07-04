"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

export interface ShapeDef {
  type: "circle" | "ring" | "square" | "pill";
  color: string;
  size: number;
  startX: string;
  startY: string;
  scrollMultiplier: number;
  rotationSpeed?: number;
}

const DEFAULT_SHAPES: ShapeDef[] = [
  { type: "circle", color: "var(--pine)", size: 140, startX: "15%", startY: "10%", scrollMultiplier: 0.8 },
  { type: "ring", color: "var(--clay)", size: 80, startX: "80%", startY: "25%", scrollMultiplier: -0.5, rotationSpeed: 1 },
  { type: "pill", color: "var(--pine-bright)", size: 120, startX: "60%", startY: "65%", scrollMultiplier: 1.2, rotationSpeed: -0.5 },
  { type: "circle", color: "var(--sage)", size: 40, startX: "20%", startY: "85%", scrollMultiplier: -0.9 },
  { type: "ring", color: "var(--ink)", size: 180, startX: "45%", startY: "40%", scrollMultiplier: 1.5, rotationSpeed: 0.2 },
];

export function AnimatedBackground({
  shapes = DEFAULT_SHAPES,
}: {
  shapes?: ShapeDef[];
}) {
  const [reduced, setReduced] = useState(false);
  const { scrollYProgress } = useScroll();

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
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(var(--ink)_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {shapes.map((s, i) => (
        <ShapeLayer key={i} shape={s} scrollYProgress={scrollYProgress} reduced={reduced} />
      ))}
    </div>
  );
}

function ShapeLayer({ shape, scrollYProgress, reduced }: { shape: ShapeDef; scrollYProgress: MotionValue<number>; reduced: boolean }) {
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, shape.scrollMultiplier * 800]);
  const rotateOffset = useTransform(scrollYProgress, [0, 1], [0, (shape.rotationSpeed || 0) * 360 * shape.scrollMultiplier]);

  let shapeClasses = "absolute ";
  let style: React.CSSProperties = {
    width: shape.size,
    height: shape.type === "pill" ? shape.size / 2 : shape.size,
    borderColor: shape.color,
    opacity: 0.15,
  };

  if (shape.type === "circle") {
    shapeClasses += "rounded-full bg-current";
    style.color = shape.color;
  } else if (shape.type === "ring") {
    shapeClasses += "rounded-full border-[8px] bg-transparent";
  } else if (shape.type === "square") {
    shapeClasses += "rounded-2xl border-[8px] bg-transparent";
  } else if (shape.type === "pill") {
    shapeClasses += "rounded-full bg-current";
    style.color = shape.color;
  }

  return (
    <motion.div
      className="absolute"
      style={{
        left: shape.startX,
        top: shape.startY,
        y: yOffset,
        rotate: rotateOffset,
      }}
    >
      <motion.div
        className={shapeClasses}
        style={{
          ...style,
          marginLeft: -shape.size / 2,
          marginTop: -(shape.type === "pill" ? shape.size / 4 : shape.size / 2),
        }}
        animate={
          reduced || !shape.rotationSpeed
            ? undefined
            : {
                rotate: [0, 360 * Math.sign(shape.rotationSpeed)],
              }
        }
        transition={{
          duration: 20 / Math.abs(shape.rotationSpeed || 1),
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}
