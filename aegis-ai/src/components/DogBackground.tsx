"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, MotionValue } from "framer-motion";

export function DogBackground() {
  // Always start at 0 — SSR safe, no window reads at render time
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Scroll-driven rise
  const { scrollYProgress } = useScroll();
  const scrollY = useTransform(scrollYProgress, [0, 0.35], [0, -280]);

  useEffect(() => {
    // Set to screen centre once mounted so eyes start looking forward
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const springCfg = { damping: 30, stiffness: 120 };
  const smX = useSpring(mouseX, springCfg);
  const smY = useSpring(mouseY, springCfg);

  // Use a fixed generous range — no window reads during render
  const pupilDx = useTransform(smX, [0, 2000], [-7, 7]);
  const pupilDy = useTransform(smY, [0, 1200], [-5, 5]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      {/* Soft radial glow behind dog */}
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.08] bg-[radial-gradient(circle,var(--pine)_0%,transparent_70%)] translate-x-1/4 translate-y-1/4 pointer-events-none" />

      {/* Dog — starts peeking from below, rises as you scroll */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "-200px", y: scrollY }}
      >
        <DogSVG pupilDx={pupilDx} pupilDy={pupilDy} />
      </motion.div>
    </div>
  );
}

function DogSVG({
  pupilDx,
  pupilDy,
}: {
  pupilDx: MotionValue<number>;
  pupilDy: MotionValue<number>;
}) {
  return (
    <svg
      width="500"
      height="460"
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 -16px 48px var(--pine))" }}
    >
      {/* Left ear */}
      <ellipse
        cx="78"
        cy="135"
        rx="38"
        ry="55"
        fill="var(--pine)"
        transform="rotate(-18 78 135)"
        opacity="0.9"
      />
      {/* Right ear */}
      <ellipse
        cx="202"
        cy="135"
        rx="38"
        ry="55"
        fill="var(--pine)"
        transform="rotate(18 202 135)"
        opacity="0.9"
      />

      {/* Head */}
      <ellipse cx="140" cy="168" rx="102" ry="92" fill="var(--sage)" opacity="0.55" />

      {/* Snout / muzzle */}
      <ellipse cx="140" cy="215" rx="52" ry="36" fill="var(--paper-dim)" opacity="0.7" />

      {/* Nose */}
      <ellipse cx="140" cy="205" rx="17" ry="11" fill="var(--ink)" opacity="0.8" />
      {/* Nose highlight */}
      <ellipse cx="135" cy="201" rx="5" ry="3" fill="white" opacity="0.35" />

      {/* Mouth left */}
      <path
        d="M 127 220 Q 120 230 113 225"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Mouth right */}
      <path
        d="M 153 220 Q 160 230 167 225"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* Left eye socket */}
      <ellipse cx="107" cy="163" rx="24" ry="26" fill="white" opacity="0.9" />
      {/* Right eye socket */}
      <ellipse cx="173" cy="163" rx="24" ry="26" fill="white" opacity="0.9" />

      {/* Left pupil — animated */}
      <motion.g style={{ x: pupilDx, y: pupilDy }}>
        <circle cx="107" cy="163" r="13" fill="var(--ink)" opacity="0.85" />
        <circle cx="111" cy="158" r="4" fill="white" opacity="0.55" />
        <circle cx="102" cy="167" r="2" fill="white" opacity="0.25" />
      </motion.g>

      {/* Right pupil — animated */}
      <motion.g style={{ x: pupilDx, y: pupilDy }}>
        <circle cx="173" cy="163" r="13" fill="var(--ink)" opacity="0.85" />
        <circle cx="177" cy="158" r="4" fill="white" opacity="0.55" />
        <circle cx="168" cy="167" r="2" fill="white" opacity="0.25" />
      </motion.g>

      {/* Left eyebrow */}
      <path
        d="M 88 138 Q 107 128 126 136"
        stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {/* Right eyebrow */}
      <path
        d="M 154 136 Q 173 128 192 138"
        stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Collar */}
      <rect x="90" y="248" width="100" height="14" rx="7" fill="var(--clay)" opacity="0.6" />
      {/* Collar tag */}
      <circle cx="140" cy="262" r="8" fill="var(--clay-soft)" opacity="0.7" />
    </svg>
  );
}
