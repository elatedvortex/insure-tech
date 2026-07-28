import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function AuthHeader() {
  return (
    <header className="px-6 py-6 border-b border-surface-line/70 bg-surface/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-pine flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-ink">BestPolicy</span>
        </Link>
        <p className="hidden sm:block text-sm text-ink-soft max-w-xl">
          Securely manage your Health, Motor and Life protection in one place.
        </p>
      </div>
    </header>
  );
}
