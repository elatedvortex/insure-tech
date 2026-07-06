"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from "framer-motion";

export type BackgroundTheme = "default" | "pet" | "life" | "vehicle" | "health" | "home" | "travel" | "business";

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
  theme = "default",
}: {
  shapes?: ShapeDef[];
  theme?: BackgroundTheme;
}) {
  const reducedMotion = useReducedMotion();
  const [reduced, setReduced] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const effectiveReduced = Boolean(reduced || reducedMotion);
  const scene = useMemo(() => getScene(theme), [theme]);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (effectiveReduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      onMouseMove={handleMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(var(--ink)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: scene.background,
          opacity: scene.opacity,
        }}
      />
      {!effectiveReduced ? (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(480px circle at ${pointer.x}px ${pointer.y}px, ${scene.glow}, transparent 60%)`,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 22 }}
        />
      ) : null}
      {scene.orbs.map((orb, index) => (
        <motion.div
          key={`${scene.name}-${index}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            background: orb.color,
            opacity: orb.opacity,
          }}
          animate={effectiveReduced ? undefined : { x: [0, orb.driftX, 0, -orb.driftX, 0], y: [0, orb.driftY, 0, -orb.driftY, 0] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {scene.lines.map((line, index) => (
        <motion.div
          key={`${scene.name}-line-${index}`}
          className="absolute rounded-full"
          style={{
            left: line.left,
            top: line.top,
            width: line.width,
            height: line.height,
            border: `1px solid ${line.color}`,
            opacity: line.opacity,
            transform: line.rotate,
          }}
          animate={effectiveReduced ? undefined : { x: [0, line.driftX, 0, -line.driftX, 0], y: [0, line.driftY, 0, -line.driftY, 0] }}
          transition={{ duration: line.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {shapes.map((s, i) => (
        <ShapeLayer key={`${theme}-${i}`} shape={s} scrollYProgress={scrollYProgress} reduced={effectiveReduced} />
      ))}
    </div>
  );
}

function getScene(theme: BackgroundTheme) {
  const base = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.25), transparent 60%)",
    glow: "rgba(16, 185, 129, 0.16)",
    opacity: 0.8,
    orbs: [] as Array<{ size: number; left: string; top: string; color: string; opacity: number; driftX: number; driftY: number; duration: number }>,
    lines: [] as Array<{ left: string; top: string; width: string; height: string; color: string; opacity: number; rotate: string; driftX: number; driftY: number; duration: number }>,
  };

  switch (theme) {
    case "pet":
      return {
        ...base,
        name: "pet",
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(250,250,250,0.2) 45%, rgba(16, 185, 129, 0.1))",
        glow: "rgba(99, 102, 241, 0.18)",
        orbs: [
          { size: 220, left: "14%", top: "14%", color: "rgba(99, 102, 241, 0.24)", opacity: 0.7, driftX: 16, driftY: 10, duration: 18 },
          { size: 300, left: "70%", top: "65%", color: "rgba(16, 185, 129, 0.16)", opacity: 0.8, driftX: -20, driftY: -14, duration: 24 },
        ],
        lines: [
          { left: "24%", top: "36%", width: "180px", height: "1px", color: "rgba(99,102,241,0.35)", opacity: 0.7, rotate: "rotate(10deg)", driftX: 12, driftY: 8, duration: 16 },
          { left: "54%", top: "72%", width: "120px", height: "1px", color: "rgba(16,185,129,0.32)", opacity: 0.6, rotate: "rotate(-16deg)", driftX: -8, driftY: 6, duration: 14 },
        ],
      };
    case "life":
      return {
        ...base,
        name: "life",
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(255,255,255,0.2) 48%, rgba(99, 102, 241, 0.08))",
        glow: "rgba(16, 185, 129, 0.16)",
        orbs: [
          { size: 260, left: "12%", top: "16%", color: "rgba(16, 185, 129, 0.2)", opacity: 0.8, driftX: 12, driftY: 8, duration: 20 },
          { size: 220, left: "72%", top: "58%", color: "rgba(99, 102, 241, 0.16)", opacity: 0.7, driftX: -14, driftY: -10, duration: 18 },
        ],
        lines: [
          { left: "24%", top: "28%", width: "220px", height: "1px", color: "rgba(16,185,129,0.3)", opacity: 0.7, rotate: "rotate(-8deg)", driftX: 8, driftY: 6, duration: 15 },
          { left: "54%", top: "72%", width: "170px", height: "1px", color: "rgba(99,102,241,0.26)", opacity: 0.6, rotate: "rotate(14deg)", driftX: -8, driftY: 5, duration: 13 },
        ],
      };
    case "vehicle":
      return {
        ...base,
        name: "vehicle",
        background: "linear-gradient(135deg, rgba(113, 113, 122, 0.12), rgba(255,255,255,0.2) 42%, rgba(16, 185, 129, 0.12))",
        glow: "rgba(113, 113, 122, 0.2)",
        orbs: [
          { size: 240, left: "15%", top: "18%", color: "rgba(113, 113, 122, 0.18)", opacity: 0.8, driftX: 14, driftY: 12, duration: 19 },
          { size: 280, left: "70%", top: "62%", color: "rgba(16, 185, 129, 0.16)", opacity: 0.7, driftX: -16, driftY: -12, duration: 22 },
        ],
        lines: [
          { left: "18%", top: "40%", width: "260px", height: "2px", color: "rgba(113,113,122,0.25)", opacity: 0.7, rotate: "rotate(8deg)", driftX: 10, driftY: 6, duration: 16 },
          { left: "58%", top: "70%", width: "150px", height: "2px", color: "rgba(16,185,129,0.25)", opacity: 0.6, rotate: "rotate(-10deg)", driftX: -6, driftY: 5, duration: 14 },
        ],
      };
    case "health":
      return {
        ...base,
        name: "health",
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(255,255,255,0.2) 46%, rgba(16, 185, 129, 0.1))",
        glow: "rgba(99, 102, 241, 0.16)",
        orbs: [
          { size: 240, left: "12%", top: "16%", color: "rgba(99, 102, 241, 0.2)", opacity: 0.75, driftX: 12, driftY: 10, duration: 18 },
          { size: 260, left: "74%", top: "64%", color: "rgba(16, 185, 129, 0.16)", opacity: 0.75, driftX: -16, driftY: -10, duration: 20 },
        ],
        lines: [
          { left: "28%", top: "34%", width: "170px", height: "1px", color: "rgba(99,102,241,0.32)", opacity: 0.7, rotate: "rotate(12deg)", driftX: 9, driftY: 6, duration: 14 },
          { left: "56%", top: "74%", width: "140px", height: "1px", color: "rgba(16,185,129,0.3)", opacity: 0.6, rotate: "rotate(-12deg)", driftX: -7, driftY: 5, duration: 16 },
        ],
      };
    case "home":
      return {
        ...base,
        name: "home",
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(255,255,255,0.2) 50%, rgba(113, 113, 122, 0.08))",
        glow: "rgba(16, 185, 129, 0.18)",
        orbs: [
          { size: 280, left: "12%", top: "16%", color: "rgba(16, 185, 129, 0.18)", opacity: 0.8, driftX: 10, driftY: 8, duration: 17 },
          { size: 240, left: "72%", top: "62%", color: "rgba(113, 113, 122, 0.16)", opacity: 0.75, driftX: -14, driftY: -10, duration: 20 },
        ],
        lines: [
          { left: "20%", top: "33%", width: "200px", height: "2px", color: "rgba(16,185,129,0.28)", opacity: 0.7, rotate: "rotate(7deg)", driftX: 8, driftY: 6, duration: 15 },
          { left: "56%", top: "74%", width: "150px", height: "2px", color: "rgba(113,113,122,0.24)", opacity: 0.6, rotate: "rotate(-10deg)", driftX: -7, driftY: 5, duration: 14 },
        ],
      };
    case "travel":
      return {
        ...base,
        name: "travel",
        background: "linear-gradient(135deg, rgba(52, 211, 153, 0.12), rgba(255,255,255,0.2) 45%, rgba(99, 102, 241, 0.1))",
        glow: "rgba(52, 211, 153, 0.16)",
        orbs: [
          { size: 250, left: "14%", top: "15%", color: "rgba(52, 211, 153, 0.2)", opacity: 0.75, driftX: 16, driftY: 8, duration: 18 },
          { size: 220, left: "70%", top: "62%", color: "rgba(99, 102, 241, 0.16)", opacity: 0.75, driftX: -14, driftY: -10, duration: 20 },
        ],
        lines: [
          { left: "22%", top: "31%", width: "220px", height: "1px", color: "rgba(52,211,153,0.3)", opacity: 0.7, rotate: "rotate(10deg)", driftX: 10, driftY: 6, duration: 15 },
          { left: "56%", top: "72%", width: "140px", height: "1px", color: "rgba(99,102,241,0.26)", opacity: 0.6, rotate: "rotate(-12deg)", driftX: -6, driftY: 5, duration: 13 },
        ],
      };
    case "business":
      return {
        ...base,
        name: "business",
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(255,255,255,0.2) 48%, rgba(113, 113, 122, 0.08))",
        glow: "rgba(16, 185, 129, 0.14)",
        orbs: [
          { size: 250, left: "12%", top: "18%", color: "rgba(16, 185, 129, 0.2)", opacity: 0.75, driftX: 10, driftY: 8, duration: 18 },
          { size: 240, left: "72%", top: "60%", color: "rgba(113, 113, 122, 0.16)", opacity: 0.7, driftX: -12, driftY: -8, duration: 19 },
        ],
        lines: [
          { left: "22%", top: "35%", width: "220px", height: "2px", color: "rgba(16,185,129,0.26)", opacity: 0.7, rotate: "rotate(6deg)", driftX: 7, driftY: 5, duration: 14 },
          { left: "56%", top: "74%", width: "170px", height: "2px", color: "rgba(113,113,122,0.24)", opacity: 0.6, rotate: "rotate(-10deg)", driftX: -6, driftY: 4, duration: 13 },
        ],
      };
    default:
      return {
        ...base,
        name: "default",
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255,255,255,0.25) 55%, rgba(99, 102, 241, 0.08))",
        glow: "rgba(16, 185, 129, 0.16)",
        orbs: [
          { size: 260, left: "16%", top: "12%", color: "rgba(16, 185, 129, 0.18)", opacity: 0.8, driftX: 18, driftY: 10, duration: 20 },
          { size: 300, left: "72%", top: "64%", color: "rgba(99, 102, 241, 0.16)", opacity: 0.8, driftX: -20, driftY: -14, duration: 24 },
        ],
        lines: [
          { left: "24%", top: "34%", width: "180px", height: "1px", color: "rgba(16,185,129,0.24)", opacity: 0.7, rotate: "rotate(8deg)", driftX: 10, driftY: 7, duration: 16 },
          { left: "56%", top: "70%", width: "140px", height: "1px", color: "rgba(99,102,241,0.24)", opacity: 0.6, rotate: "rotate(-12deg)", driftX: -8, driftY: 6, duration: 14 },
        ],
      };
  }
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
