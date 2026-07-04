import { RecommendationCard } from "@/lib/types";
import { Sparkles } from "lucide-react";

export function RecommendationCardView({ card }: { card: RecommendationCard }) {
  return (
    <div className="rounded-2xl border border-surface-line bg-surface/60 p-5 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-pine" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-sage">
          {card.category} · Recommended
        </span>
      </div>
      <h4 className="font-display text-lg text-ink mb-1">{card.title}</h4>
      <p className="text-sm text-ink-soft mb-4">{card.coverage}</p>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="font-mono text-2xl text-ink">${card.monthlyPremium}</span>
        <span className="text-xs text-sage">/month</span>
      </div>
      <div className="rounded-xl bg-paper/70 border border-surface-line p-3.5">
        <p className="text-xs text-ink-soft leading-relaxed">
          <span className="text-pine font-medium">Why this: </span>
          {card.reasoning}
        </p>
      </div>
    </div>
  );
}
