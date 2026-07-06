"use client";

import { usePathname } from "next/navigation";
import PageEffects from "./PageEffects";

export default function PageEffectsLoader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/protection/")) {
    return null;
  }

  return <PageEffects />;
}
