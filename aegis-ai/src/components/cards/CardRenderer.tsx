import { AnyCard } from "@/lib/types";
import { RecommendationCardView } from "./RecommendationCardView";
import { QuoteCardView } from "./QuoteCardView";
import { ProtectionScoreCardView } from "./ProtectionScoreCardView";
import { ClaimStatusCardView } from "./ClaimStatusCardView";
import { DocumentRequestCardView } from "./DocumentRequestCardView";
import { ComparisonCardView } from "./ComparisonCardView";

export function CardRenderer({ card }: { card: AnyCard }) {
  switch (card.kind) {
    case "recommendation":
      return <RecommendationCardView card={card} />;
    case "quote":
      return <QuoteCardView card={card} />;
    case "protection-score":
      return <ProtectionScoreCardView card={card} />;
    case "claim-status":
      return <ClaimStatusCardView card={card} />;
    case "document-request":
      return <DocumentRequestCardView card={card} />;
    case "comparison":
      return <ComparisonCardView card={card} />;
    default:
      return null;
  }
}
