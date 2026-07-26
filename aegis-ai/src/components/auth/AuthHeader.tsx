import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function AuthHeader() {
  return (
    <header className="px-6 py-5">
      <Link href="/" className="inline-flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-pine flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-bold text-lg tracking-tight text-ink">BestPolicy</span>
      </Link>
    </header>
  );
}
