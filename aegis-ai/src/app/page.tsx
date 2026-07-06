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
      
    </>
  );
}
