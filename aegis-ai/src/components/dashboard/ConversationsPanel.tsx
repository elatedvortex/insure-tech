import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Conversation } from "@/lib/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-line/60 ${className}`} />;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ConversationsPanel({
  conversations,
  loading,
}: {
  conversations: Conversation[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-surface-line bg-surface/50 p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-sage mb-4">
        Recent conversations
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-3.5 h-3.5 rounded-full mt-1 shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-xs text-ink-soft">
          No conversations yet.{" "}
          <Link href="/advisor" className="text-pine">
            Start talking to Aegis
          </Link>
        </p>
      ) : (
        <div className="space-y-1">
          {conversations.slice(0, 5).map((c) => (
            <Link
              key={c.id}
              href={`/advisor?conv=${c.id}`}
              className="flex items-start gap-3 py-2.5 group"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sage mt-1 shrink-0" strokeWidth={1.75} />
              <div className="min-w-0">
                <p className="text-sm text-ink-soft group-hover:text-pine transition-colors leading-snug">
                  {c.summary ?? "Untitled conversation"}
                </p>
                <p className="text-[11px] text-sage mt-0.5">{timeAgo(c.created_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
