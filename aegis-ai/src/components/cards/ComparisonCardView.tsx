import { ComparisonCard } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Star } from "lucide-react";

export function ComparisonCardView({ card }: { card: ComparisonCard }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
      {card.options.map((opt) => (
        <div
          key={opt.name}
          className={cn(
            "rounded-2xl border p-5",
            opt.recommended
              ? "border-pine bg-pine/5"
              : "border-surface-line bg-surface/60"
          )}
        >
          {opt.recommended && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 text-clay fill-clay" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-clay">
                Recommended
              </span>
            </div>
          )}
          <h4 className="font-display text-lg text-ink mb-1">{opt.name}</h4>
          <div className="font-mono text-xl text-ink mb-3">
            ${opt.monthlyPremium}
            <span className="text-xs text-sage">/mo</span>
          </div>
          <ul className="space-y-1.5">
            {opt.highlights.map((h) => (
              <li key={h} className="flex items-start gap-1.5 text-xs text-ink-soft">
                <Check className="w-3 h-3 text-pine mt-0.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
