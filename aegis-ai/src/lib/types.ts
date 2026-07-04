export type Role = "user" | "assistant";

export type CardKind =
  | "recommendation"
  | "quote"
  | "protection-score"
  | "claim-status"
  | "document-request"
  | "comparison";

export interface RecommendationCard {
  kind: "recommendation";
  category: "Motor" | "Health" | "Home" | "Travel" | "Life" | "Business";
  title: string;
  reasoning: string;
  monthlyPremium: number;
  coverage: string;
}

export interface QuoteCard {
  kind: "quote";
  planName: string;
  monthlyPremium: number;
  annualPremium: number;
  coverageHighlights: string[];
  deductible: number;
}

export interface ProtectionScoreCard {
  kind: "protection-score";
  overall: number;
  breakdown: { label: string; score: number }[];
}

export interface ClaimStatusCard {
  kind: "claim-status";
  claimId: string;
  incident: string;
  stage: "Filed" | "Reviewing" | "Assessing damage" | "Approved" | "Paid";
  estimate?: number;
  nextStep: string;
}

export interface DocumentRequestCard {
  kind: "document-request";
  documents: string[];
  reason: string;
}

export interface ComparisonCard {
  kind: "comparison";
  options: {
    name: string;
    monthlyPremium: number;
    highlights: string[];
    recommended?: boolean;
  }[];
}

export type AnyCard =
  | RecommendationCard
  | QuoteCard
  | ProtectionScoreCard
  | ClaimStatusCard
  | DocumentRequestCard
  | ComparisonCard;

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  cards?: AnyCard[];
  quickReplies?: string[];
  timestamp: number;
}
