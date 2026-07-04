"use client";

import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1 },
};

function Paw() {
  return (
    <>
      <motion.circle cx="60" cy="78" r="16" stroke="currentColor" strokeWidth="3" fill="none" variants={draw} />
      <motion.circle cx="38" cy="52" r="9" stroke="currentColor" strokeWidth="3" fill="none" variants={draw} />
      <motion.circle cx="60" cy="40" r="9" stroke="currentColor" strokeWidth="3" fill="none" variants={draw} />
      <motion.circle cx="82" cy="52" r="9" stroke="currentColor" strokeWidth="3" fill="none" variants={draw} />
    </>
  );
}

function Heartbeat() {
  return (
    <motion.path
      d="M20 60 H45 L52 40 L64 82 L74 55 L80 60 H100"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={draw}
    />
  );
}

function Car() {
  return (
    <>
      <motion.path
        d="M28 68 L34 48 Q37 42 45 42 H75 Q83 42 86 48 L92 68"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        variants={draw}
      />
      <motion.path
        d="M22 68 H98 V78 H22 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
        variants={draw}
      />
      <motion.circle cx="38" cy="78" r="7" stroke="currentColor" strokeWidth="3" fill="none" variants={draw} />
      <motion.circle cx="82" cy="78" r="7" stroke="currentColor" strokeWidth="3" fill="none" variants={draw} />
    </>
  );
}

function HomeShape() {
  return (
    <>
      <motion.path
        d="M22 58 L60 28 L98 58"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
      />
      <motion.path
        d="M32 52 V88 H88 V52"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
        variants={draw}
      />
      <motion.path d="M52 88 V66 H68 V88" stroke="currentColor" strokeWidth="3" fill="none" variants={draw} />
    </>
  );
}

function Plane() {
  return (
    <motion.path
      d="M20 70 L92 45 Q98 43 96 49 L78 66 L82 82 L72 78 L66 66 L48 72 L50 82 L42 80 L38 68 L20 70 Z"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
      variants={draw}
    />
  );
}

function Briefcase() {
  return (
    <>
      <motion.path
        d="M46 42 V34 Q46 30 50 30 H70 Q74 30 74 34 V42"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
        variants={draw}
      />
      <motion.path
        d="M24 42 H96 V80 H24 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
        variants={draw}
      />
      <motion.path d="M24 58 H96" stroke="currentColor" strokeWidth="3" variants={draw} />
    </>
  );
}

function Shield() {
  return (
    <>
      <motion.path
        d="M60 26 L92 38 V60 Q92 84 60 96 Q28 84 28 60 V38 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
        variants={draw}
      />
      <motion.path
        d="M46 60 L56 70 L76 48"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
      />
    </>
  );
}

const MAP = {
  pet: Paw,
  health: Heartbeat,
  vehicle: Car,
  home: HomeShape,
  travel: Plane,
  business: Briefcase,
  life: Shield,
};

export function CategoryIcon({
  kind,
  className,
}: {
  kind: keyof typeof MAP;
  className?: string;
}) {
  const Shape = MAP[kind];
  return (
    <motion.svg
      viewBox="0 0 120 120"
      className={className}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
    >
      <motion.circle
        cx="60"
        cy="60"
        r="52"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1.5"
        fill="none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.g transition={{ duration: 1, ease: "easeInOut" }}>
        <Shape />
      </motion.g>
    </motion.svg>
  );
}
