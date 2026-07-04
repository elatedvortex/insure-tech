import Link from "next/link";
import { Presence } from "../Presence";

export function AuthHeader() {
  return (
    <header className="px-6 py-5">
      <Link href="/" className="inline-flex items-center gap-2.5">
        <Presence size="sm" />
        <span className="font-display text-lg tracking-tight text-ink">Aegis</span>
      </Link>
    </header>
  );
}
