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

interface CharacterDef {
  kind: "dog" | "person" | "car" | "heart" | "house" | "plane" | "briefcase" | "spark";
  left: string;
  top: string;
  width: number;
  opacity: number;
  driftX: number;
  driftY: number;
  duration: number;
  scale?: number;
  delay?: number;
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
            background: `radial-gradient(620px circle at ${pointer.x}px ${pointer.y}px, ${scene.glow}, transparent 64%)`,
          }}
          transition={{ type: "spring", stiffness: 70, damping: 24 }}
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
      {scene.characters.map((character, index) => (
        <CharacterLayer key={`${scene.name}-character-${index}`} character={character} pointer={pointer} reduced={effectiveReduced} />
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
    characters: [] as CharacterDef[],
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
        characters: [
          { kind: "dog", left: "18%", top: "78%", width: 140, opacity: 0.82, driftX: 10, driftY: 6, duration: 14, scale: 0.95 },
          { kind: "spark", left: "82%", top: "22%", width: 88, opacity: 0.65, driftX: -8, driftY: 7, duration: 16, scale: 0.9 },
        ] as CharacterDef[],
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
        characters: [
          { kind: "person", left: "20%", top: "78%", width: 126, opacity: 0.8, driftX: 8, driftY: 5, duration: 14, scale: 0.95 },
          { kind: "heart", left: "78%", top: "24%", width: 96, opacity: 0.7, driftX: -7, driftY: 6, duration: 16, scale: 0.92 },
        ] as CharacterDef[],
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
        characters: [
          { kind: "car", left: "18%", top: "76%", width: 170, opacity: 0.8, driftX: 8, driftY: 5, duration: 13, scale: 0.95 },
          { kind: "spark", left: "80%", top: "26%", width: 92, opacity: 0.7, driftX: -8, driftY: 5, duration: 15, scale: 0.9 },
        ] as CharacterDef[],
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
        characters: [
          { kind: "heart", left: "20%", top: "78%", width: 132, opacity: 0.78, driftX: 8, driftY: 5, duration: 13, scale: 0.96 },
          { kind: "spark", left: "78%", top: "24%", width: 86, opacity: 0.72, driftX: -7, driftY: 6, duration: 15, scale: 0.9 },
        ] as CharacterDef[],
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
        characters: [
          { kind: "house", left: "19%", top: "77%", width: 150, opacity: 0.8, driftX: 8, driftY: 5, duration: 12, scale: 0.95 },
          { kind: "spark", left: "80%", top: "24%", width: 84, opacity: 0.7, driftX: -7, driftY: 6, duration: 15, scale: 0.9 },
        ] as CharacterDef[],
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
        characters: [
          { kind: "plane", left: "17%", top: "76%", width: 168, opacity: 0.8, driftX: 9, driftY: 5, duration: 13, scale: 0.95 },
          { kind: "spark", left: "80%", top: "28%", width: 86, opacity: 0.7, driftX: -7, driftY: 6, duration: 15, scale: 0.9 },
        ] as CharacterDef[],
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
        characters: [
          { kind: "briefcase", left: "18%", top: "77%", width: 148, opacity: 0.8, driftX: 7, driftY: 5, duration: 12, scale: 0.95 },
          { kind: "spark", left: "80%", top: "24%", width: 84, opacity: 0.7, driftX: -7, driftY: 6, duration: 14, scale: 0.9 },
        ] as CharacterDef[],
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
        characters: [
          { kind: "spark", left: "20%", top: "74%", width: 112, opacity: 0.72, driftX: 8, driftY: 5, duration: 14, scale: 0.9 },
          { kind: "person", left: "78%", top: "26%", width: 110, opacity: 0.68, driftX: -7, driftY: 6, duration: 16, scale: 0.9 },
        ] as CharacterDef[],
      };
  }
}

function CharacterLayer({ character, pointer, reduced }: { character: CharacterDef; pointer: { x: number; y: number }; reduced: boolean }) {
  const eyeX = pointer.x === 0 ? 0 : Math.max(-8, Math.min(8, (pointer.x - 300) / 140));
  const eyeY = pointer.y === 0 ? 0 : Math.max(-7, Math.min(7, (pointer.y - 220) / 120));

  return (
    <motion.div
      className="absolute"
      style={{
        left: character.left,
        top: character.top,
        opacity: character.opacity,
        transform: `translate(-50%, -50%) scale(${character.scale ?? 1})`,
      }}
      animate={reduced ? undefined : { x: [0, character.driftX, 0, -character.driftX, 0], y: [0, character.driftY, 0, -character.driftY, 0] }}
      transition={{ duration: character.duration, repeat: Infinity, ease: "easeInOut", delay: character.delay ?? 0 }}
    >
      <svg width={character.width} height={character.width * 0.85} viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {character.kind === "dog" ? (
          <>
            <ellipse cx="74" cy="76" rx="28" ry="36" fill="var(--pine)" opacity="0.92" transform="rotate(-18 74 76)" />
            <ellipse cx="146" cy="76" rx="28" ry="36" fill="var(--pine)" opacity="0.92" transform="rotate(18 146 76)" />
            <ellipse cx="110" cy="110" rx="62" ry="58" fill="rgba(255,255,255,0.9)" />
            <ellipse cx="110" cy="138" rx="42" ry="28" fill="rgba(255,255,255,0.75)" />
            <circle cx="90" cy="112" r="8" fill="var(--ink)" opacity="0.85" />
            <circle cx="130" cy="112" r="8" fill="var(--ink)" opacity="0.85" />
            <motion.g style={{ x: eyeX, y: eyeY }}>
              <circle cx="90" cy="112" r="3.5" fill="white" opacity="0.7" />
              <circle cx="130" cy="112" r="3.5" fill="white" opacity="0.7" />
            </motion.g>
            <path d="M70 153C90 168 128 168 150 153" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
            <path d="M150 136C168 126 176 112 182 96" stroke="var(--clay)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          </>
        ) : character.kind === "person" ? (
          <>
            <circle cx="110" cy="68" r="28" fill="rgba(255,255,255,0.92)" />
            <rect x="74" y="100" width="72" height="72" rx="18" fill="rgba(255,255,255,0.9)" />
            <path d="M74 173L86 214" stroke="rgba(255,255,255,0.9)" strokeWidth="10" strokeLinecap="round" />
            <path d="M146 173L134 214" stroke="rgba(255,255,255,0.9)" strokeWidth="10" strokeLinecap="round" />
            <path d="M94 148L64 126" stroke="rgba(255,255,255,0.9)" strokeWidth="10" strokeLinecap="round" />
            <path d="M126 148L156 126" stroke="rgba(255,255,255,0.9)" strokeWidth="10" strokeLinecap="round" />
            <motion.g style={{ x: eyeX * 0.65, y: eyeY * 0.65 }}>
              <circle cx="100" cy="64" r="3.5" fill="var(--ink)" opacity="0.8" />
              <circle cx="120" cy="64" r="3.5" fill="var(--ink)" opacity="0.8" />
            </motion.g>
          </>
        ) : character.kind === "car" ? (
          <>
            <rect x="44" y="92" width="132" height="64" rx="20" fill="rgba(255,255,255,0.9)" />
            <path d="M68 92L84 66H140L156 92" fill="rgba(255,255,255,0.92)" />
            <circle cx="82" cy="154" r="20" fill="rgba(255,255,255,0.95)" />
            <circle cx="138" cy="154" r="20" fill="rgba(255,255,255,0.95)" />
            <path d="M86 82H132" stroke="var(--pine)" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
          </>
        ) : character.kind === "heart" ? (
          <>
            <path d="M110 60C84 60 62 84 62 112C62 144 90 168 110 186C130 168 158 144 158 112C158 84 136 60 110 60Z" fill="rgba(255,255,255,0.9)" />
            <path d="M110 84C122 72 138 72 148 84" stroke="var(--pine)" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
            <path d="M96 102H124" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
            <path d="M110 90V118" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
          </>
        ) : character.kind === "house" ? (
          <>
            <path d="M60 94L110 52L160 94V174H60Z" fill="rgba(255,255,255,0.9)" />
            <rect x="84" y="112" width="52" height="56" rx="8" fill="rgba(255,255,255,0.8)" />
            <rect x="102" y="126" width="16" height="42" rx="3" fill="var(--pine)" opacity="0.75" />
            <path d="M80 94H140" stroke="var(--pine)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          </>
        ) : character.kind === "plane" ? (
          <>
            <path d="M52 110L104 96L122 62L142 96L182 108L142 118L122 156L104 122L52 110Z" fill="rgba(255,255,255,0.92)" />
            <path d="M82 104L134 96" stroke="var(--pine)" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
          </>
        ) : character.kind === "briefcase" ? (
          <>
            <rect x="70" y="74" width="84" height="72" rx="14" fill="rgba(255,255,255,0.92)" />
            <rect x="76" y="62" width="72" height="24" rx="10" fill="rgba(255,255,255,0.95)" />
            <rect x="88" y="92" width="24" height="18" rx="4" fill="var(--pine)" opacity="0.75" />
            <rect x="118" y="92" width="24" height="18" rx="4" fill="var(--pine)" opacity="0.75" />
          </>
        ) : (
          <>
            <circle cx="112" cy="96" r="44" fill="rgba(255,255,255,0.92)" />
            <path d="M74 96C86 64 138 64 150 96" stroke="var(--pine)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M86 120C100 134 124 134 138 120" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
          </>
        )}
      </svg>
    </motion.div>
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
