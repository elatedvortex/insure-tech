export type AttentionKind = "recommendation" | "task" | "renewal" | "claim";

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  title: string;
  detail: string;
  reasoning?: string;
  cta: string;
  href: string;
  urgency: "high" | "medium" | "low";
}

export interface CoveragePolicy {
  id: string;
  category: "Health" | "Vehicle" | "Home" | "Life" | "Travel" | "Business";
  name: string;
  monthlyPremium: number;
  status: "Active" | "Renewing soon" | "Lapsed";
  renewsOn: string;
}

export interface RecentConversation {
  id: string;
  summary: string;
  timeAgo: string;
  prompt: string;
}

export interface WorkspaceDocument {
  id: string;
  name: string;
  type: "Identity" | "Vehicle" | "Medical" | "Policy" | "Bill";
  uploadedAgo: string;
}

export interface ClaimSummary {
  id: string;
  incident: string;
  stage: string;
  amount?: number;
}

export const USER = {
  name: "Aditi",
  overallScore: 82,
  scoreBreakdown: [
    { label: "Health", score: 90 },
    { label: "Vehicle", score: 85 },
    { label: "Home", score: 78 },
    { label: "Life", score: 60 },
    { label: "Travel", score: 95 },
    { label: "Business", score: 0 },
  ],
};

export const ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "att-1",
    kind: "renewal",
    title: "Your vehicle policy renews in 9 days",
    detail: "Comprehensive Motor Cover — $58/month, no changes needed unless your usage changed.",
    reasoning: "Renewing now locks in your current rate before the annual review.",
    cta: "Review & renew",
    href: "/advisor?q=I want to review my vehicle policy renewal",
    urgency: "high",
  },
  {
    id: "att-2",
    kind: "recommendation",
    title: "Your life coverage looks light for your income",
    detail: "Based on your income and dependents, most people in your situation carry roughly 3x more life coverage.",
    reasoning: "This is the single biggest gap in your Protection Score right now.",
    cta: "See recommendation",
    href: "/advisor?q=Why is my life insurance coverage too low?",
    urgency: "medium",
  },
  {
    id: "att-3",
    kind: "claim",
    title: "Your bike accident claim was approved",
    detail: "$340 payment is scheduled to reach your account within 2 business days.",
    cta: "View claim",
    href: "/advisor?q=Check my claim status",
    urgency: "low",
  },
  {
    id: "att-4",
    kind: "task",
    title: "Upload your driving licence to finish setup",
    detail: "One document left to fully activate your motor policy discount.",
    cta: "Upload now",
    href: "/advisor?q=I want to upload my driving licence",
    urgency: "medium",
  },
];

export const COVERAGE: CoveragePolicy[] = [
  { id: "pol-1", category: "Vehicle", name: "Comprehensive Motor Cover", monthlyPremium: 58, status: "Renewing soon", renewsOn: "Jul 12, 2026" },
  { id: "pol-2", category: "Health", name: "Family Health Plan", monthlyPremium: 142, status: "Active", renewsOn: "Nov 3, 2026" },
  { id: "pol-3", category: "Travel", name: "Annual Travel Cover", monthlyPremium: 12, status: "Active", renewsOn: "Feb 18, 2027" },
  { id: "pol-4", category: "Home", name: "Homeowner Essentials", monthlyPremium: 34, status: "Active", renewsOn: "Sep 22, 2026" },
];

export const RECENT_CONVERSATIONS: RecentConversation[] = [
  { id: "c-1", summary: "Talked through renewing your motor policy", timeAgo: "2h ago", prompt: "I want to review my vehicle policy renewal" },
  { id: "c-2", summary: "Filed a claim for your bike accident", timeAgo: "3d ago", prompt: "Check my claim status" },
  { id: "c-3", summary: "Discussed adding cyber cover for your business", timeAgo: "1w ago", prompt: "I started a business." },
];

export const DOCUMENTS: WorkspaceDocument[] = [
  { id: "d-1", name: "Driving licence.jpg", type: "Vehicle", uploadedAgo: "Not uploaded" },
  { id: "d-2", name: "Vehicle registration.pdf", type: "Vehicle", uploadedAgo: "2h ago" },
  { id: "d-3", name: "Health policy schedule.pdf", type: "Policy", uploadedAgo: "3mo ago" },
  { id: "d-4", name: "Passport.jpg", type: "Identity", uploadedAgo: "3mo ago" },
];

export const CLAIMS: ClaimSummary[] = [
  { id: "CLM-88213", incident: "Bike accident, front wheel damage", stage: "Approved", amount: 340 },
];
