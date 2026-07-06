"use client";

import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ReactNode> = {
  Google: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  Apple: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.36 1.43c0 1.14-.42 2.2-1.24 3.06-.84.9-2.14 1.58-3.24 1.5-.14-1.1.42-2.24 1.2-3.06.84-.88 2.28-1.54 3.28-1.5zm3.72 16.6c-.4.9-.6 1.3-1.1 2.1-.7 1.1-1.7 2.5-2.94 2.5-1.1 0-1.4-.72-2.9-.7-1.52.02-1.86.72-2.96.7-1.24-.02-2.18-1.26-2.88-2.36-1.98-3.02-2.18-6.58-.96-8.48.86-1.36 2.24-2.16 3.52-2.16 1.3 0 2.12.72 3.2.72 1.04 0 1.68-.72 3.2-.72 1.14 0 2.34.62 3.2 1.7-2.82 1.54-2.36 5.54.62 6.7z" />
    </svg>
  ),
};

export function OAuthButton({
  provider,
  onClick,
  loading,
}: {
  provider: "Google" | "Apple";
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
          "w-full flex items-center justify-center gap-2.5 px-5 py-3 text-sm font-medium transition-colors disabled:opacity-60",
          provider === "Google" ? "btn-primary" : "rounded-full border border-surface-line bg-paper text-ink"
        )}
    >
      {ICONS[provider]}
      Continue with {provider}
    </button>
  );
}
