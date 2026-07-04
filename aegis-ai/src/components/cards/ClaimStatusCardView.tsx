import { ClaimStatusCard } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAGES: ClaimStatusCard["stage"][] = [
  "Filed",
  "Reviewing",
  "Assessing damage",
  "Approved",
  "Paid",
];

export function ClaimStatusCardView({ card }: { card: ClaimStatusCard }) {
  const currentIndex = STAGES.indexOf(card.stage);

  return (
    <div className="rounded-2xl border border-surface-line bg-surface/60 p-5 max-w-md">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[11px] text-sage">{card.claimId}</span>
        {card.estimate && (
          <span className="font-mono text-sm text-pine">${card.estimate}</span>
        )}
      </div>
      <h4 className="font-display text-lg text-ink mb-4">{card.incident}</h4>

      <div className="flex items-center mb-4">
        {STAGES.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full shrink-0",
                i <= currentIndex ? "bg-pine" : "bg-surface-line"
              )}
            />
            {i < STAGES.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1",
                  i < currentIndex ? "bg-pine" : "bg-surface-line"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-sage mb-3">{card.stage}</p>

      <div className="rounded-xl bg-paper/70 border border-surface-line p-3.5">
        <p className="text-xs text-ink-soft leading-relaxed">{card.nextStep}</p>
      </div>
    </div>
  );
}
