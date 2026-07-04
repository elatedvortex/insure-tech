import { AnyCard, ChatMessage } from "./types";

interface AdvisorResponse {
  text: string;
  cards?: AnyCard[];
  quickReplies?: string[];
}

function id() {
  return Math.random().toString(36).slice(2, 10);
}

export function makeMessage(
  role: "user" | "assistant",
  text: string,
  cards?: AnyCard[],
  quickReplies?: string[]
): ChatMessage {
  return { id: id(), role, text, cards, quickReplies, timestamp: Date.now() };
}

// Very lightweight intent classifier for the prototype's mock agent layer.
function detectIntent(input: string): string {
  const t = input.toLowerCase();
  if (/\b(car|vehicle|drive|drove|motor|auto)\b/.test(t) && /\b(bought|new|got|purchase)\b/.test(t)) return "new_car";
  if (/\b(accident|crash|dent|totaled|hit|collision|scratch)\b/.test(t)) return "claim_incident";
  if (/\b(lost|stolen|theft|missing)\b.*\b(phone|laptop|bag|wallet)\b/.test(t)) return "claim_lost_item";
  if (/\b(marry|marriage|wedding|married|fianc)\b/.test(t)) return "life_event_marriage";
  if (/\bhealth insurance\b|\bmedical coverage\b/.test(t)) return "health_new";
  if (/\b(father|mother|parent|dad|mom)\b.*\b(medical|health|coverage|insurance)\b/.test(t)) return "health_family";
  if (/\bpet\b|\bdog\b|\bcat\b/.test(t) && /\binsur/.test(t)) return "pet_new";
  if (/\btravel|trip|flight|vacation|abroad\b/.test(t)) return "travel";
  if (/\b(business|startup|company|shop|store)\b.*\b(start|open|launch|founded)\b/.test(t)) return "business";
  if (/\bscore\b|\bprotection score\b/.test(t)) return "protection_score";
  if (/\bclaim status\b|\bmy claim\b|\btrack\b.*\bclaim\b/.test(t)) return "claim_status";
  if (/\byes\b/.test(t)) return "affirm";
  if (/\bno\b/.test(t)) return "deny";
  return "unknown";
}

export function getAdvisorResponse(
  userInput: string,
  history: ChatMessage[]
): AdvisorResponse {
  const intent = detectIntent(userInput);
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  const lastCardKind = lastAssistant?.cards?.[0]?.kind;

  // Follow-up flow: continuing a claim conversation
  if (lastCardKind === "document-request" || lastAssistant?.text.includes("everyone safe")) {
    if (intent === "affirm" || /safe|fine|okay|ok/i.test(userInput)) {
      return {
        text: "Good — that's what matters most. I've opened a claim and I'm reviewing the photos now. Here's where things stand.",
        cards: [
          {
            kind: "claim-status",
            claimId: "CLM-88213",
            incident: "Bike accident, front wheel damage",
            stage: "Assessing damage",
            estimate: 340,
            nextStep: "I'll confirm the repair estimate within a few hours and send it to your registered shop.",
          },
        ],
        quickReplies: ["Check claim status", "Talk to a human", "What's covered?"],
      };
    }
  }

  switch (intent) {
    case "new_car":
      return {
        text: "Congratulations on the new car. Before I recommend coverage, quick question — is it mainly for daily commuting, or occasional use?",
        quickReplies: ["Daily commuting", "Occasional use", "Just show me options"],
      };

    case "claim_incident":
      return {
        text: "I'm sorry to hear that — let's get this sorted. First: is everyone okay?",
        quickReplies: ["Yes, everyone's safe", "Someone's hurt"],
      };

    case "claim_lost_item":
      return {
        text: "That's frustrating, I know. Do you have a device protection plan already, or should I check what's covered under your current policy?",
        quickReplies: ["Check my coverage", "I don't think I'm covered"],
      };

    case "life_event_marriage":
      return {
        text: "Congratulations! Marriage is a good moment to combine and simplify coverage — often at a lower combined cost. Want me to look at merging your policies once you're married, or handle it separately for now?",
        quickReplies: ["Combine our coverage", "Keep it separate", "Tell me more first"],
      };

    case "health_new":
      return {
        text: "I can help with that. To find the right plan, tell me roughly — is this just for you, or for your family too?",
        quickReplies: ["Just me", "Me and my family"],
      };

    case "health_family":
      return {
        text: "That's a thoughtful thing to set up. For a parent's coverage, age and any existing conditions matter most for accurate pricing. Roughly what age range, and any ongoing conditions I should account for?",
        quickReplies: ["60s, generally healthy", "70s, has a condition", "Not sure yet"],
      };

    case "pet_new":
      return {
        text: "I'd love to help protect your pet. Is this for a dog, a cat, or another kind of pet?",
        quickReplies: ["Dog", "Cat", "Something else"],
      };

    case "travel":
      return {
        text: "Where are you headed, and roughly how long is the trip? That's really all I need to get you a quote.",
        quickReplies: ["1 week, Europe", "2+ weeks, Asia", "Just show me a sample plan"],
      };

    case "business":
      return {
        text: "Starting a business changes your risk picture quite a bit — mainly around liability, data, and property. Based on similar founders, here's what I'd prioritize first.",
        cards: [
          {
            kind: "recommendation",
            category: "Business",
            title: "General Liability + Cyber Bundle",
            reasoning:
              "Most early-stage businesses face two main risks first: a customer or vendor liability claim, and a data or payment breach. Bundling both is typically 30% cheaper than buying separately, and covers the two most common early claims.",
            monthlyPremium: 64,
            coverage: "$1M liability · $250k cyber breach response",
          },
        ],
        quickReplies: ["See full quote", "What about my equipment?", "Not now"],
      };

    case "protection_score":
      return {
        text: "Here's your Protection Score as of today — it reflects your current coverage against your actual risk profile, not just what you own.",
        cards: [
          {
            kind: "protection-score",
            overall: 82,
            breakdown: [
              { label: "Health", score: 90 },
              { label: "Vehicle", score: 85 },
              { label: "Home", score: 78 },
              { label: "Life", score: 60 },
              { label: "Travel", score: 95 },
              { label: "Business", score: 0 },
            ],
          },
        ],
        quickReplies: ["Why is Life at 60?", "How do I improve this?"],
      };

    case "claim_status":
      return {
        text: "Here's your most recent claim — I'm tracking it in real time.",
        cards: [
          {
            kind: "claim-status",
            claimId: "CLM-88213",
            incident: "Bike accident, front wheel damage",
            stage: "Approved",
            estimate: 340,
            nextStep: "Payment of $340 is scheduled to reach your account within 2 business days.",
          },
        ],
        quickReplies: ["When will I get paid?", "Anything else needed from me?"],
      };

    default:
      break;
  }

  // Follow-up: daily commuting / occasional use → generate a motor quote
  if (/daily commuting/i.test(userInput) || /occasional use/i.test(userInput)) {
    const daily = /daily/i.test(userInput);
    return {
      text: `Got it — ${daily ? "daily driving means more road exposure, so I'd lean toward stronger liability limits" : "occasional use keeps your risk lower, so we can trim the premium"}. Here's what I'd recommend, with the reasoning behind it.`,
      cards: [
        {
          kind: "recommendation",
          category: "Motor",
          title: daily ? "Comprehensive Motor Cover" : "Third-Party Plus Cover",
          reasoning: daily
            ? "Daily commuters are statistically exposed to more collision and theft risk. Comprehensive cover protects your own vehicle too, not just others — worth the extra cost given how often you're on the road."
            : "With occasional use, your main risk is liability to others rather than damage to your own car. Third-party plus keeps you fully protected there while avoiding paying for coverage you're less likely to need.",
          monthlyPremium: daily ? 58 : 34,
          coverage: daily ? "Own damage + theft + third-party" : "Third-party liability + fire & theft",
        },
      ],
      quickReplies: ["Get a full quote", "Compare other options"],
    };
  }

  if (/get a full quote|show me options|show me a sample/i.test(userInput)) {
    return {
      text: "Here's a full quote based on what you've told me. Nothing hidden — this is the actual monthly price.",
      cards: [
        {
          kind: "quote",
          planName: "Comprehensive Motor Cover",
          monthlyPremium: 58,
          annualPremium: 636,
          coverageHighlights: [
            "Own damage & theft protection",
            "Third-party liability up to $1M",
            "24/7 roadside assistance",
            "Zero-depreciation on parts (first 3 years)",
          ],
          deductible: 250,
        },
      ],
      quickReplies: ["Compare with a cheaper plan", "Looks good, let's proceed"],
    };
  }

  if (/compare/i.test(userInput)) {
    return {
      text: "Sure — here's how the comprehensive plan compares to a leaner option.",
      cards: [
        {
          kind: "comparison",
          options: [
            {
              name: "Third-Party Plus",
              monthlyPremium: 34,
              highlights: ["Liability only", "Fire & theft", "No own-damage cover"],
            },
            {
              name: "Comprehensive",
              monthlyPremium: 58,
              highlights: ["Full own-damage cover", "Zero-depreciation parts", "24/7 roadside assistance"],
              recommended: true,
            },
          ],
        },
      ],
      quickReplies: ["Go with Comprehensive", "Go with Third-Party Plus"],
    };
  }

  if (/proceed|go with|let's do it/i.test(userInput)) {
    return {
      text: "Great choice. I'll need your driving licence and vehicle registration to finalize this — I can pull most details from a photo automatically.",
      cards: [
        {
          kind: "document-request",
          documents: ["Driving licence", "Vehicle registration certificate"],
          reason: "Required to verify the vehicle and finalize your premium accurately.",
        },
      ],
    };
  }

  if (/someone's hurt|hurt/i.test(userInput)) {
    return {
      text: "Please prioritize getting medical help right now — call emergency services if you haven't. I'll keep this claim ready whenever you're able to continue, no rush at all.",
      quickReplies: ["Continue when ready"],
    };
  }

  // Generic graceful fallback that still feels like an advisor, not a broken bot
  return {
    text: "Tell me a bit more about what's going on, and I'll figure out the right next step — whether that's a quote, a claim, or just an answer.",
    quickReplies: ["I bought a car", "I need health insurance", "Check my protection score"],
  };
}
