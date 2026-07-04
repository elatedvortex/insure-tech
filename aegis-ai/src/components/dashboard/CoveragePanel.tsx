import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Policy } from "@/lib/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-line/60 ${className}`} />;
}

export function CoveragePanel({
  policies,
  loading,
}: {
  policies: Policy[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-surface-line bg-surface/50 p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-sage mb-4">
        Current coverage
      </p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
          ))}
        </div>
      ) : policies.length === 0 ? (
        <p className="text-xs text-ink-soft">
          No policies yet.{" "}
          <Link href="/advisor?q=What insurance do I need?" className="text-pine">
            Ask Aegis
          </Link>
        </p>
      ) : (
        <div className="divide-y divide-surface-line">
          {policies.map((p) => (
            <div key={p.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-ink font-medium truncate">{p.name}</p>
                  <p className="text-xs text-sage mt-0.5">{p.category}</p>
                </div>
                <span className="font-mono text-sm text-ink shrink-0">
                  ${p.monthly_premium}/mo
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    p.status === "Active" && "bg-pine",
                    p.status === "Renewing soon" && "bg-clay",
                    p.status === "Lapsed" && "bg-sage",
                  )}
                />
                <span className="text-[11px] text-sage">
                  {p.status}
                  {p.renews_on ? ` · renews ${new Date(p.renews_on).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/advisor?q=Show me all my policies"
        className="inline-block text-sm text-pine font-medium mt-4"
      >
        Review all coverage
      </Link>
    </div>
  );
}
