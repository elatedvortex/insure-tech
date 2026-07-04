export interface CoverageItem {
  title: string;
  detail: string;
}

export interface StoryItem {
  name: string;
  context: string;
  situation: string;
  outcome: string;
}

export interface PlanTier {
  name: string;
  monthlyFrom: number;
  bullets: string[];
  recommended?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CategoryConfig {
  slug: string;
  label: string;
  tagline: string;
  subhead: string;
  heroPrompt: string;
  accentIcon: "pet" | "life" | "vehicle" | "health" | "home" | "travel" | "business";
  valueProps: { title: string; detail: string }[];
  coverage: CoverageItem[];
  stories: StoryItem[];
  plans: PlanTier[];
  faqs: FaqItem[];
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  pet: {
    slug: "pet",
    label: "Pet",
    tagline: "Vet bills shouldn't be a decision.",
    subhead: "Coverage for accidents and illness, so the only question at the vet is what's best for them.",
    heroPrompt: "I want to insure my pet.",
    accentIcon: "pet",
    valueProps: [
      { title: "Any licensed vet", detail: "No network to worry about — go wherever you already trust." },
      { title: "Fast reimbursement", detail: "Submit a bill, get money back — most claims move in days, not weeks." },
      { title: "Built with vets", detail: "Coverage shaped around what actually happens in a vet visit." },
    ],
    coverage: [
      { title: "Diagnostics", detail: "Bloodwork, x-rays, ultrasounds, and lab work." },
      { title: "Procedures", detail: "Surgery, hospitalization, and emergency care." },
      { title: "Medication", detail: "Prescriptions and injections tied to a covered condition." },
      { title: "Chronic conditions", detail: "Ongoing care for conditions that don't resolve in one visit." },
    ],
    stories: [
      { name: "Nala", context: "3-year-old Labrador", situation: "Swallowed a sock, needed emergency surgery to remove it.", outcome: "Most of the $2,400 bill came back within a week." },
      { name: "Miso", context: "1-year-old tabby", situation: "Sudden limp turned out to be a small fracture.", outcome: "Cast, follow-ups, and medication all covered." },
      { name: "Bruno", context: "6-year-old beagle", situation: "Developed a skin condition that needed ongoing treatment.", outcome: "Monthly vet visits stopped being a budgeting problem." },
    ],
    plans: [
      { name: "Essential", monthlyFrom: 14, bullets: ["Accidents & injuries", "Emergency care", "Any licensed vet"] },
      { name: "Complete", monthlyFrom: 26, bullets: ["Everything in Essential", "Illness & chronic conditions", "Prescription medication"], recommended: true },
      { name: "Complete + Wellness", monthlyFrom: 38, bullets: ["Everything in Complete", "Annual checkups", "Vaccines & preventative care"] },
    ],
    faqs: [
      { q: "Is my pet's breed covered?", a: "Yes — coverage isn't limited by breed. Premiums may vary based on breed, age, and location." },
      { q: "What about conditions my pet already has?", a: "Pre-existing conditions aren't covered under a new policy, but any new accident or illness is, from day one for accidents." },
      { q: "Can I use my regular vet?", a: "Yes. There's no network — go anywhere licensed to practice, including emergency and specialty clinics." },
    ],
  },

  life: {
    slug: "life",
    label: "Life",
    tagline: "Coverage for the people who depend on you.",
    subhead: "A straightforward term policy, sized to your actual situation — not a generic multiple of your salary.",
    heroPrompt: "I need life insurance.",
    accentIcon: "life",
    valueProps: [
      { title: "No generic multiples", detail: "Sized to your income, dependents, and debts — not a rule of thumb." },
      { title: "Fast decisions", detail: "Most applicants get an answer in minutes, not weeks of underwriting." },
      { title: "Term, not confusion", detail: "A fixed payout if something happens, for a fixed term — nothing more to explain." },
    ],
    coverage: [
      { title: "Income replacement", detail: "Enough for dependents to maintain their standard of living." },
      { title: "Debt payoff", detail: "Mortgage, loans, and other obligations that shouldn't fall to your family." },
      { title: "Future costs", detail: "Education and major life costs you'd otherwise have covered." },
      { title: "Final expenses", detail: "Costs that come immediately, before an estate settles." },
    ],
    stories: [
      { name: "A new parent", context: "32, first child on the way", situation: "Realized their employer coverage alone wouldn't be enough.", outcome: "Set up a policy sized to their mortgage and their child's future costs in one sitting." },
      { name: "A small business owner", context: "45, two employees depend on the business", situation: "Needed coverage that protected the business, not just the family.", outcome: "Structured a policy that covers both without overpaying for either." },
    ],
    plans: [
      { name: "10-year term", monthlyFrom: 18, bullets: ["Fixed premium", "Level payout", "No medical exam for most applicants"] },
      { name: "20-year term", monthlyFrom: 27, bullets: ["Fixed premium for 20 years", "Level payout", "Convertible to permanent coverage"], recommended: true },
      { name: "30-year term", monthlyFrom: 39, bullets: ["Longest fixed-rate option", "Level payout", "Good fit for a new mortgage"] },
    ],
    faqs: [
      { q: "How much coverage do I actually need?", a: "It depends on income, dependents, and debt — not a flat multiple. The advisor walks through your specific numbers rather than guessing." },
      { q: "Do I need a medical exam?", a: "Most applicants qualify without one, based on health questions and available records." },
      { q: "What happens at the end of the term?", a: "Coverage ends unless you renew or convert to a permanent policy — you're never auto-charged for something you didn't choose." },
    ],
  },

  vehicle: {
    slug: "vehicle",
    label: "Vehicle",
    tagline: "Coverage that matches how you actually drive.",
    subhead: "Daily commuter or weekend driver — the right policy looks different depending on which one you are.",
    heroPrompt: "I need motor insurance.",
    accentIcon: "vehicle",
    valueProps: [
      { title: "Priced for your usage", detail: "Occasional drivers shouldn't pay commuter rates." },
      { title: "24/7 roadside help", detail: "One call, day or night, wherever you are." },
      { title: "Photo-based claims", detail: "Send photos of the damage — most estimates come back same-day." },
    ],
    coverage: [
      { title: "Collision", detail: "Damage to your own vehicle, regardless of fault." },
      { title: "Liability", detail: "Damage or injury you cause to others." },
      { title: "Theft & fire", detail: "Replacement or repair if your vehicle is stolen or damaged by fire." },
      { title: "Roadside assistance", detail: "Towing, jump-starts, and flat tire help." },
    ],
    stories: [
      { name: "A daily commuter", context: "Drives 40 miles a day", situation: "Rear-ended in traffic, needed a full repair.", outcome: "Estimate came back within hours of sending photos from the scene." },
      { name: "A weekend driver", context: "Uses the car twice a week", situation: "Realized their comprehensive plan was overpriced for their usage.", outcome: "Switched to a usage-based plan and cut their premium significantly." },
    ],
    plans: [
      { name: "Third-Party Plus", monthlyFrom: 34, bullets: ["Liability coverage", "Fire & theft", "Good for occasional drivers"] },
      { name: "Comprehensive", monthlyFrom: 58, bullets: ["Own-damage coverage", "24/7 roadside assistance", "Zero-depreciation on parts"], recommended: true },
    ],
    faqs: [
      { q: "Does my premium depend on how much I drive?", a: "It can — usage is one of the factors, alongside vehicle type, location, and driving history." },
      { q: "What's not covered?", a: "Wear and tear, mechanical breakdown unrelated to an accident, and driving outside policy terms (e.g. unlicensed use) generally aren't covered." },
      { q: "How fast are claims paid?", a: "Straightforward claims with clear photo evidence are often estimated same-day; payment timing depends on repair shop scheduling." },
    ],
  },

  health: {
    slug: "health",
    label: "Health",
    tagline: "Coverage for you, or your whole family.",
    subhead: "One plan for yourself, or a family plan that accounts for everyone's different needs — priced honestly either way.",
    heroPrompt: "I need health insurance.",
    accentIcon: "health",
    valueProps: [
      { title: "Individual or family", detail: "One plan structure, sized to who's actually covered." },
      { title: "Pre-existing conditions considered", detail: "Clear answers up front, not surprises at claim time." },
      { title: "Direct billing where possible", detail: "Fewer out-of-pocket moments at partner facilities." },
    ],
    coverage: [
      { title: "Hospitalization", detail: "Inpatient care, surgery, and related costs." },
      { title: "Outpatient care", detail: "Consultations, diagnostics, and minor procedures." },
      { title: "Prescription drugs", detail: "Medication tied to a covered condition." },
      { title: "Preventative checkups", detail: "Annual screenings to catch things early." },
    ],
    stories: [
      { name: "A young professional", context: "Single, no dependents", situation: "Wanted coverage beyond a bare-minimum employer plan.", outcome: "Found a plan with better outpatient coverage for a small premium difference." },
      { name: "A family of four", context: "Two kids, one with a minor ongoing condition", situation: "Needed a plan that didn't treat the whole family as one risk profile.", outcome: "Got a family plan priced around each member's actual needs." },
    ],
    plans: [
      { name: "Individual", monthlyFrom: 45, bullets: ["Hospitalization & outpatient", "Annual checkup included", "Nationwide network"] },
      { name: "Family", monthlyFrom: 142, bullets: ["Covers up to 5 members", "Individual sub-limits per member", "Maternity option available"], recommended: true },
    ],
    faqs: [
      { q: "Are pre-existing conditions covered?", a: "Often yes, after a waiting period — the exact terms depend on the condition and plan, and are explained clearly before you buy." },
      { q: "Can I add family members later?", a: "Yes, family plans can typically be adjusted at renewal or after a qualifying life event." },
      { q: "Is there a network of hospitals?", a: "Most plans include a network for direct billing, but out-of-network care is usually still reimbursable." },
    ],
  },

  home: {
    slug: "home",
    label: "Home",
    tagline: "Protection for the place you actually live.",
    subhead: "Structure, belongings, and liability — covered in plain terms, without a 40-page policy to decode.",
    heroPrompt: "I need home insurance.",
    accentIcon: "home",
    valueProps: [
      { title: "Structure + belongings", detail: "Both covered in one policy, not two separate purchases." },
      { title: "Liability included", detail: "Protection if someone's hurt on your property." },
      { title: "Fast damage assessment", detail: "Photo-based claims for straightforward incidents." },
    ],
    coverage: [
      { title: "Structure", detail: "Damage from fire, storms, and other covered events." },
      { title: "Belongings", detail: "Furniture, electronics, and personal items inside the home." },
      { title: "Liability", detail: "Injuries to others that happen on your property." },
      { title: "Temporary housing", detail: "Costs if your home becomes temporarily unlivable." },
    ],
    stories: [
      { name: "A first-time homeowner", context: "Just closed on their first house", situation: "Wasn't sure how much coverage they actually needed.", outcome: "Got a policy sized to the home's rebuild cost, not its market price." },
      { name: "A renovating homeowner", context: "Mid-renovation", situation: "Needed coverage that accounted for construction risk.", outcome: "Adjusted their policy for the renovation period without starting over." },
    ],
    plans: [
      { name: "Essentials", monthlyFrom: 22, bullets: ["Structure coverage", "Basic liability", "Fire & storm damage"] },
      { name: "Complete", monthlyFrom: 34, bullets: ["Everything in Essentials", "Belongings coverage", "Temporary housing costs"], recommended: true },
    ],
    faqs: [
      { q: "Is flood damage covered?", a: "Standard policies typically exclude flood — it's usually a separate add-on depending on your location's risk." },
      { q: "How is my coverage amount decided?", a: "Based on rebuild cost, not market value — the two can differ significantly." },
      { q: "Are my belongings covered outside the house?", a: "Many policies extend limited coverage to belongings temporarily away from home, like a laptop that's stolen while traveling." },
    ],
  },

  travel: {
    slug: "travel",
    label: "Travel",
    tagline: "One less thing to think about before you go.",
    subhead: "Trip delays, medical emergencies abroad, lost luggage — covered for the length of your trip, nothing more.",
    heroPrompt: "I am travelling next week.",
    accentIcon: "travel",
    valueProps: [
      { title: "Priced by trip, not by year", detail: "Pay for the days you're actually away." },
      { title: "Medical coverage abroad", detail: "Emergency care where your regular health plan may not reach." },
      { title: "Instant policy", detail: "Buy minutes before you fly if you need to." },
    ],
    coverage: [
      { title: "Trip cancellation", detail: "Reimbursement for covered reasons you can't travel." },
      { title: "Medical emergencies", detail: "Treatment and evacuation while abroad." },
      { title: "Lost or delayed baggage", detail: "Compensation while you wait, and if it doesn't turn up." },
      { title: "Trip delay", detail: "Costs from missed connections and delays." },
    ],
    stories: [
      { name: "A solo backpacker", context: "6-week trip through Southeast Asia", situation: "Needed treatment for a minor injury abroad.", outcome: "Care was covered without draining the trip budget." },
      { name: "A family on a booked vacation", context: "Two weeks in Europe", situation: "Flight got cancelled the day before departure.", outcome: "Rebooking costs were reimbursed under trip delay coverage." },
    ],
    plans: [
      { name: "Single trip", monthlyFrom: 8, bullets: ["Covers one trip", "Medical & baggage", "Trip cancellation"] },
      { name: "Annual multi-trip", monthlyFrom: 12, bullets: ["Unlimited trips per year", "Each trip up to 45 days", "Best for frequent travelers"], recommended: true },
    ],
    faqs: [
      { q: "Does it cover pre-existing conditions?", a: "Some plans do with conditions disclosed upfront — this varies and is worth confirming before you buy." },
      { q: "What counts as a covered cancellation reason?", a: "Typically illness, injury, or specific covered events — the fine print differs by plan and is explained before purchase." },
      { q: "Can I buy this after I've already left?", a: "No — travel coverage needs to be purchased before departure." },
    ],
  },

  business: {
    slug: "business",
    label: "Business",
    tagline: "The two risks every new business faces first.",
    subhead: "Liability and cyber exposure hit early-stage businesses before anything else does — bundled coverage for both.",
    heroPrompt: "I started a business.",
    accentIcon: "business",
    valueProps: [
      { title: "Bundled, not stacked", detail: "Liability and cyber together typically costs less than buying separately." },
      { title: "Sized to your stage", detail: "Coverage that fits a 2-person team, not a 200-person company." },
      { title: "Plain-language policy", detail: "No legal team required to understand what's covered." },
    ],
    coverage: [
      { title: "General liability", detail: "Claims from customers, vendors, or third parties." },
      { title: "Cyber breach response", detail: "Costs from a data or payment breach." },
      { title: "Business property", detail: "Equipment and physical assets your business depends on." },
      { title: "Business interruption", detail: "Lost income if a covered event stops operations." },
    ],
    stories: [
      { name: "A two-person startup", context: "Early-stage SaaS company", situation: "Handled customer payment data without a dedicated security team.", outcome: "Bundled cyber coverage meant a breach response was already funded." },
      { name: "A local retail shop", context: "Physical storefront, 3 employees", situation: "A customer was injured on the premises.", outcome: "Liability coverage handled the claim without threatening the business." },
    ],
    plans: [
      { name: "Liability only", monthlyFrom: 29, bullets: ["$1M general liability", "Third-party claims", "Good for service businesses"] },
      { name: "Liability + Cyber", monthlyFrom: 64, bullets: ["Everything in Liability only", "$250k cyber breach response", "Bundled discount applied"], recommended: true },
    ],
    faqs: [
      { q: "Do I need this if I'm a solo founder?", a: "Often yes — liability exposure doesn't depend on headcount, and cyber risk applies to any business handling customer data." },
      { q: "What counts as a covered cyber incident?", a: "Typically data breaches, ransomware, and payment system compromises — specifics vary by plan." },
      { q: "Can coverage grow with the business?", a: "Yes, most plans can be adjusted as headcount, revenue, or risk profile changes." },
    ],
  },
};

export function getCategory(slug: string): CategoryConfig | undefined {
  return CATEGORIES[slug];
}

export function getAllCategorySlugs(): string[] {
  return Object.keys(CATEGORIES);
}

export interface ShapeDef {
  type: "circle" | "ring" | "square" | "pill";
  color: string;
  size: number;
  startX: string;
  startY: string;
  scrollMultiplier: number;
  rotationSpeed?: number;
}

export function getCategoryShapes(kind: CategoryConfig["accentIcon"]): ShapeDef[] {
  const palettes: Record<CategoryConfig["accentIcon"], ShapeDef[]> = {
    pet: [
      { type: "circle", color: "var(--clay)", size: 140, startX: "12%", startY: "8%", scrollMultiplier: 0.8 },
      { type: "ring", color: "var(--pine-bright)", size: 90, startX: "70%", startY: "20%", scrollMultiplier: -0.6, rotationSpeed: 1 },
      { type: "pill", color: "var(--sage)", size: 120, startX: "50%", startY: "75%", scrollMultiplier: 1.1, rotationSpeed: -0.5 },
    ],
    life: [
      { type: "square", color: "var(--pine)", size: 130, startX: "15%", startY: "10%", scrollMultiplier: 0.7, rotationSpeed: 0.5 },
      { type: "ring", color: "var(--pine-bright)", size: 80, startX: "72%", startY: "18%", scrollMultiplier: -0.5 },
      { type: "circle", color: "var(--clay)", size: 160, startX: "45%", startY: "78%", scrollMultiplier: 1.2 },
    ],
    vehicle: [
      { type: "pill", color: "var(--sage)", size: 150, startX: "10%", startY: "12%", scrollMultiplier: 0.9, rotationSpeed: 1 },
      { type: "square", color: "var(--pine)", size: 100, startX: "75%", startY: "22%", scrollMultiplier: -0.8, rotationSpeed: -0.8 },
      { type: "ring", color: "var(--pine-bright)", size: 120, startX: "50%", startY: "75%", scrollMultiplier: 1.4 },
    ],
    health: [
      { type: "circle", color: "var(--clay)", size: 140, startX: "14%", startY: "10%", scrollMultiplier: 0.6 },
      { type: "pill", color: "var(--pine)", size: 130, startX: "70%", startY: "18%", scrollMultiplier: -0.4, rotationSpeed: 0.7 },
      { type: "ring", color: "var(--pine-bright)", size: 110, startX: "48%", startY: "76%", scrollMultiplier: 1.3 },
    ],
    home: [
      { type: "square", color: "var(--pine)", size: 160, startX: "12%", startY: "8%", scrollMultiplier: 0.8, rotationSpeed: 0.3 },
      { type: "ring", color: "var(--sage)", size: 90, startX: "72%", startY: "20%", scrollMultiplier: -0.7 },
      { type: "circle", color: "var(--clay)", size: 120, startX: "50%", startY: "78%", scrollMultiplier: 1.1 },
    ],
    travel: [
      { type: "pill", color: "var(--pine-bright)", size: 140, startX: "10%", startY: "10%", scrollMultiplier: 0.9, rotationSpeed: -1 },
      { type: "circle", color: "var(--sage)", size: 100, startX: "74%", startY: "18%", scrollMultiplier: -0.6 },
      { type: "square", color: "var(--clay)", size: 130, startX: "48%", startY: "76%", scrollMultiplier: 1.2, rotationSpeed: 0.6 },
    ],
    business: [
      { type: "ring", color: "var(--pine)", size: 150, startX: "14%", startY: "10%", scrollMultiplier: 0.7, rotationSpeed: 0.4 },
      { type: "pill", color: "var(--pine-bright)", size: 120, startX: "72%", startY: "20%", scrollMultiplier: -0.5, rotationSpeed: -0.5 },
      { type: "square", color: "var(--sage)", size: 110, startX: "50%", startY: "78%", scrollMultiplier: 1.0, rotationSpeed: 0.8 },
    ],
  };
  return palettes[kind];
}
