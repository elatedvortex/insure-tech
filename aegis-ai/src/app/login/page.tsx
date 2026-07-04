"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Fingerprint } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { Presence } from "@/components/Presence";
import { authApi, ApiError } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const router = useRouter();

  async function continueWithEmail() {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return;

    setLoading(true);
    setError(null);

    try {
      await authApi.requestOtp(trimmed);
      router.push(`/login/verify?email=${encodeURIComponent(trimmed)}`);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("Couldn't reach Aegis — please try again.");
      }
      setLoading(false);
    }
  }

  function continueWithOAuth(provider: "Google" | "Apple") {
    setLoadingProvider(provider);
    // OAuth not yet wired — redirect to login for now
    setTimeout(() => setLoadingProvider(null), 1200);
  }

  return (
    <>
      <AuthHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="flex justify-center mb-6">
            <Presence size="lg" active={loading} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink text-center leading-tight">
            Let&apos;s get you protected.
          </h1>
          <p className="text-sm text-ink-soft text-center mt-2 mb-9">
            Sign in to pick up right where you left off.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <OAuthButton
              provider="Google"
              onClick={() => continueWithOAuth("Google")}
              loading={loadingProvider === "Google"}
            />
            <OAuthButton
              provider="Apple"
              onClick={() => continueWithOAuth("Apple")}
              loading={loadingProvider === "Apple"}
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-surface-line" />
            <span className="text-xs text-sage font-mono">or</span>
            <div className="h-px flex-1 bg-surface-line" />
          </div>

          <div className="rounded-full border border-surface-line bg-surface/60 flex items-center pl-5 pr-1.5 py-1.5 focus-within:border-pine transition-colors">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && continueWithEmail()}
              placeholder="you@email.com"
              disabled={loading}
              className="flex-1 bg-transparent text-sm py-2 placeholder:text-sage/70 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={continueWithEmail}
              disabled={!email.trim() || loading}
              aria-label="Continue with email"
              className="w-10 h-10 rounded-full bg-pine text-paper flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Error state */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-clay text-center mt-3"
            >
              {error}
            </motion.p>
          )}

          <button
            disabled
            title="Coming soon on supported devices"
            className="w-full flex items-center justify-center gap-2 mt-4 text-sm text-sage/70 py-2 cursor-not-allowed"
          >
            <Fingerprint className="w-4 h-4" />
            Face ID / Touch ID — coming soon
          </button>

          <p className="text-[11px] text-sage text-center mt-8 leading-relaxed">
            By continuing, you agree to Aegis&apos;s Terms and Privacy Policy.
            <br />
            Your data is encrypted end to end.
          </p>
        </motion.div>
      </main>
    </>
  );
}
