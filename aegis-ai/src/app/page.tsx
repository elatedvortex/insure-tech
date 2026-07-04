import { SiteHeader } from "@/components/SiteHeader";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { DogBackground } from "@/components/DogBackground";
import { AnimatedIconField } from "@/components/AnimatedIconField";
import { CategorySwitcher } from "@/components/category/CategorySwitcher";
import { ConversationalHero } from "@/components/ConversationalHero";
import {
  HowItWorks,
  ProtectionCategories,
  TrustSection,
  FAQSection,
  ClosingCTA,
} from "@/components/HomeSections";

import { EasterEgg } from "@/components/EasterEgg";

export default function Home() {
  return (
    <>
      <EasterEgg />
      <AnimatedBackground />
      <DogBackground />
      <AnimatedIconField kind="mixed" count={10} opacity={0.07} />
      <SiteHeader showLogin />
      <CategorySwitcher />
      <main className="flex-1">
        <ConversationalHero />
        <HowItWorks />
        <ProtectionCategories />
        <TrustSection />
        <FAQSection />
        <ClosingCTA />
      </main>
      <footer className="px-6 py-10 border-t border-surface-line/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-sage">
        <span>© 2026 Aegis. Not a substitute for professional advice in a crisis.</span>
        <span className="font-mono text-xs">Prototype build</span>
      </footer>
    </>
  );
}
