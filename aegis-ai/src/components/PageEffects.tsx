"use client";

import { AnimatedBackground } from "./AnimatedBackground";
import { AnimatedIconField } from "./AnimatedIconField";

export default function PageEffects() {
  return (
    <>
      <AnimatedBackground />
      <AnimatedIconField kind="mixed" count={6} opacity={0.05} />
    </>
  );
}
