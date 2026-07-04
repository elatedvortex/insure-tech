import { FileText } from "lucide-react";
import type { Document } from "@/lib/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-line/60 ${className}`} />;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const TYPE_COLORS: Record<string, string> = {
  Identity: "bg-pine/10 text-pine",
  Vehicle: "bg-clay/10 text-clay",
  Medical: "bg-sage/20 text-sage",
  Policy: "bg-pine/10 text-pine",
  Bill: "bg-surface-line text-ink-soft",
};

export function DocumentsPanel({
  documents,
  loading,
}: {
  documents: Document[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-surface-line bg-surface/50 p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-sage mb-4">
        Documents
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <p className="text-xs text-ink-soft">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {documents.slice(0, 5).map((d) => (
            <div key={d.id} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[d.doc_type] ?? "bg-surface-line text-ink-soft"}`}
              >
                <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink truncate">{d.filename}</p>
                <p className="text-[11px] text-sage">{d.doc_type} · {timeAgo(d.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
