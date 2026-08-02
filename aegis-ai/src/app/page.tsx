import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { TrustBar } from "@/components/TrustBar";
import { InsuranceCategories } from "@/components/InsuranceCategories";
import { AIAdvisorSection } from "@/components/AIAdvisorSection";
import { ClaimSettlementSection } from "@/components/ClaimSettlementSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { CustomerJourneySection } from "@/components/CustomerJourneySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PodcastSection } from "@/components/PodcastSection";
import { KnowledgeCentreSection } from "@/components/KnowledgeCentreSection";
import { AIFeaturesSection, FinalCTASection } from "@/components/AIFeaturesSection";

export const metadata = {
  title: "theBestPolicy — India's Smartest Insurance Platform",
  description:
    "Choose the right insurance policy using AI, transparency and expert guidance. Compare Health, Life & Motor Insurance with IRDAI-backed claim settlement data. India's #1 AI Insurance Advisor.",
  keywords: [
    "best health insurance india",
    "best term insurance",
    "motor insurance comparison",
    "health insurance claims",
    "top insurance companies",
    "insurance claim ratio",
    "best policy",
    "insurance advisor",
    "AI insurance",
    "insurance comparison india",
  ],
  openGraph: {
    title: "theBestPolicy — Choose Smart. Claim Better. Live Protected.",
    description:
      "India's AI-powered insurance decision platform. We help you choose the right policy — not just the cheapest one.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader showLogin />
      <main className="flex-1">
        <HeroSection />
        <div className="section-white">
          <TrustBar />
          <InsuranceCategories />
        </div>
        <div className="section-orange">
          <AIAdvisorSection />
        </div>
        <div className="section-white">
          <ClaimSettlementSection />
        </div>
        <div className="section-orange">
          <WhyChooseSection />
        </div>
        <div className="section-white">
          <CustomerJourneySection />
        </div>
        <div className="section-orange">
          <TestimonialsSection />
        </div>
        <div className="section-white">
          <AIFeaturesSection />
        </div>
        <div className="section-orange">
          <PodcastSection />
        </div>
        <div className="section-white">
          <KnowledgeCentreSection />
        </div>
        <div className="section-orange">
          <FinalCTASection />
        </div>
      </main>
    </>
  );
}
