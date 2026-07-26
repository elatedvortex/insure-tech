import { SiteHeader } from "@/components/SiteHeader";
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
