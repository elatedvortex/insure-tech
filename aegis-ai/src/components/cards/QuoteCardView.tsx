import { QuoteCard } from "@/lib/types";
import { Check } from "lucide-react";

export function QuoteCardView({ card }: { card: QuoteCard }) {
  return (
    <div className="rounded-2xl border border-pine/30 bg-paper p-5 max-w-md shadow-[0_4px_24px_-8px_rgba(61,90,80,0.2)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-display text-xl text-ink">{card.planName}</h4>
          <p className="text-xs text-sage mt-0.5">${card.deductible} deductible</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl text-pine">${card.monthlyPremium}</div>
          <div className="text-[11px] text-sage">/month</div>
        </div>
      </div>
      <ul className="space-y-2 mb-2">
        {card.coverageHighlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-ink-soft">
            <Check className="w-3.5 h-3.5 text-pine mt-0.5 shrink-0" />
            {h}
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-sage mt-3 font-mono">${card.annualPremium}/year if paid annually</p>
    </div>
  );
}
