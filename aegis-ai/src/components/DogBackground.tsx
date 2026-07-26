"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, MotionValue } from "framer-motion";

/**
 * BestPolicy mascot background — a child peeking from below (scrolls up)
 * and a small car floating in the bottom-right corner.
 */
export function DogBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll();
  const scrollY      = useTransform(scrollYProgress, [0, 0.35], [0, -260]);
  const carScrollY   = useTransform(scrollYProgress, [0, 0.35], [0, -120]);

  useEffect(() => {
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const springCfg = { damping: 30, stiffness: 120 };
  const smX = useSpring(mouseX, springCfg);
  const smY = useSpring(mouseY, springCfg);

  const eyeDx = useTransform(smX, [0, 2000], [-6, 6]);
  const eyeDy = useTransform(smY, [0, 1200], [-4, 4]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Soft glow behind child */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.09] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(252,128,25,0.45) 0%, transparent 68%)" }}
      />

      {/* Child — peeks up from below, rises on scroll */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "-210px", y: scrollY }}
      >
        <ChildSVG eyeDx={eyeDx} eyeDy={eyeDy} />
        <div className="mt-2 text-center text-[11px] uppercase tracking-[0.15em] text-sage/70">
          BestPolicy
        </div>
      </motion.div>

      {/* Small car — bottom right, floats up slightly on scroll */}
      <motion.div
        className="absolute right-8 sm:right-16"
        style={{ bottom: "-60px", y: carScrollY }}
      >
        <CarSVG />
      </motion.div>
    </div>
  );
}

function ChildSVG({
  eyeDx,
  eyeDy,
}: {
  eyeDx: MotionValue<number>;
  eyeDy: MotionValue<number>;
}) {
  return (
    <svg
      width="380"
      height="360"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 -12px 40px rgba(252,128,25,0.30))" }}
    >
      {/* Hair */}
      <ellipse cx="110" cy="72" rx="58" ry="38" fill="var(--ink)" opacity="0.85" />
      <ellipse cx="110" cy="58" rx="42" ry="26" fill="var(--ink)" opacity="0.9" />
      {/* Fringe */}
      <path d="M68 72 Q90 48 110 54 Q130 48 152 72" fill="var(--ink)" opacity="0.85" />

      {/* Head */}
      <ellipse cx="110" cy="106" rx="54" ry="52" fill="#FDDCB5" />

      {/* Ears */}
      <ellipse cx="58"  cy="104" rx="11" ry="13" fill="#FDDCB5" />
      <ellipse cx="162" cy="104" rx="11" ry="13" fill="#FDDCB5" />

      {/* Eye whites */}
      <ellipse cx="90"  cy="100" rx="16" ry="17" fill="white" opacity="0.95" />
      <ellipse cx="130" cy="100" rx="16" ry="17" fill="white" opacity="0.95" />

      {/* Pupils — follow mouse */}
      <motion.g style={{ x: eyeDx, y: eyeDy }}>
        <circle cx="90"  cy="100" r="9"  fill="var(--ink)" opacity="0.88" />
        <circle cx="130" cy="100" r="9"  fill="var(--ink)" opacity="0.88" />
        <circle cx="93"  cy="97"  r="3"  fill="white" opacity="0.55" />
        <circle cx="133" cy="97"  r="3"  fill="white" opacity="0.55" />
      </motion.g>

      {/* Cheeks */}
      <ellipse cx="76"  cy="114" rx="10" ry="6" fill="rgba(252,128,25,0.25)" />
      <ellipse cx="144" cy="114" rx="10" ry="6" fill="rgba(252,128,25,0.25)" />

      {/* Nose */}
      <ellipse cx="110" cy="117" rx="7" ry="5" fill="rgba(0,0,0,0.12)" />

      {/* Smile */}
      <path d="M92 130 Q110 148 128 130" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.55" />

      {/* Neck & shoulders */}
      <rect x="94" y="152" width="32" height="24" rx="8" fill="#FDDCB5" />
      <rect x="50" y="170" width="120" height="50" rx="20" fill="var(--pine)" opacity="0.90" />
      {/* Shirt collar accent */}
      <path d="M82 172 Q110 184 138 172" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

function CarSVG() {
  return (
    <svg
      width="220"
      height="120"
      viewBox="0 0 220 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 -6px 24px rgba(252,128,25,0.22))" }}
    >
      {/* Body */}
      <rect x="10" y="44" width="200" height="44" rx="14" fill="var(--pine)" />
      {/* Cabin */}
      <path d="M44 44L66 16H152L176 44Z" fill="var(--pine-bright)" opacity="0.90" />
      {/* Windows */}
      <path d="M70 40L82 20H110V40Z" fill="white" opacity="0.65" />
      <path d="M114 20H140L152 40H114Z" fill="white" opacity="0.65" />
      {/* Wheels */}
      <circle cx="54"  cy="88" r="18" fill="var(--ink)" opacity="0.85" />
      <circle cx="166" cy="88" r="18" fill="var(--ink)" opacity="0.85" />
      <circle cx="54"  cy="88" r="8"  fill="#E5E7EB" />
      <circle cx="166" cy="88" r="8"  fill="#E5E7EB" />
      {/* Headlight */}
      <ellipse cx="204" cy="60" rx="7" ry="5" fill="#FDE68A" opacity="0.9" />
      {/* Grill */}
      <rect x="196" y="64" width="14" height="6" rx="3" fill="var(--ink)" opacity="0.40" />
      {/* Stripe */}
      <rect x="10"  y="64" width="196" height="4" rx="2" fill="white" opacity="0.15" />
    </svg>
  );
}
