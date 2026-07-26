import { SiteHeader } from "@/components/SiteHeader";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { DogBackground } from "@/components/DogBackground";
import { AnimatedIconField } from "@/components/AnimatedIconField";
import { ConversationalHero } from "@/components/ConversationalHero";
import {
  HowItWorks,
  ProtectionCategories,
  TrustSection,
  FAQSection,
  ClosingCTA,
} from "@/components/HomeSections";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <DogBackground />
      <AnimatedIconField kind="mixed" count={10} opacity={0.07} />
      <SiteHeader showLogin />
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
