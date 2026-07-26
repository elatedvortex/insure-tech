"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { useAuth } from "@/lib/auth";
import { authApi, ApiError, tokens } from "@/lib/api";

type Mode = "signin" | "signup" | "forgot" | "reset";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const resetToken = searchParams.get("reset") || "";
  const nextPath = searchParams.get("next") || "/dashboard";

  const initialMode: Mode = resetToken ? "reset" : "signin";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devResetToken, setDevResetToken] = useState<string | null>(resetToken || null);

  const title = useMemo(() => {
    if (mode === "signup") return "Create your BestPolicy account.";
    if (mode === "forgot") return "Reset your password.";
    if (mode === "reset") return "Choose a new password.";
    return "Welcome back.";
  }, [mode]);

  async function completeLogin(data: { access_token: string; refresh_token: string }) {
    tokens.set(data.access_token, data.refresh_token);
    await refreshUser();
    const dest = nextPath.startsWith("/") ? nextPath : "/dashboard";
    // Navigate client-side then force a full page reload so server-side
    // middleware and cookie-based protection see the updated auth state.
    await router.replace(dest);
    if (typeof window !== "undefined") {
      // small timeout to ensure navigation completes in Next.js before reload
      setTimeout(() => window.location.replace(dest), 50);
    }
  }

  function handleError(e: unknown, fallback: string) {
    if (e instanceof ApiError) setError(e.message);
    else setError(fallback);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signin") {
        completeLogin(await authApi.login(email.trim(), password));
      } else if (mode === "signup") {
        completeLogin(await authApi.register(email.trim(), password, name.trim() || undefined));
      } else if (mode === "forgot") {
        const response = await authApi.forgotPassword(email.trim());
        setMessage(response.message);
        setDevResetToken(response.reset_token || null);
      } else {
        const token = devResetToken || resetToken;
        const response = await authApi.resetPassword(token, password);
        setMessage(response.message);
        setPassword("");
        setMode("signin");
      }
    } catch (e) {
      handleError(e, "Could not complete that request. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  const passwordDisabled = mode === "forgot";
  const primaryText =
    mode === "signin"
      ? "Sign in"
      : mode === "signup"
        ? "Create account"
        : mode === "forgot"
          ? "Send reset link"
          : "Reset password";

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
          <h1 className="font-display text-2xl sm:text-3xl text-ink text-center leading-tight mb-2">
            {title}
          </h1>
          <p className="text-sm text-ink-soft text-center mt-2 mb-8">
            {mode === "signin" && "Sign in to your BestPolicy account."}
            {mode === "signup" && "Create your account to compare and manage your policies."}
            {mode === "forgot" && "Enter your account email and we will send a reset link."}
            {mode === "reset" && "Use at least 8 characters for your new password."}
          </p>

          <form onSubmit={submit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  disabled={loading}
                  className="form-input text-sm placeholder:text-sage/70 disabled:opacity-50"
                />
              </div>
            )}

            {mode !== "reset" && (
              <div>
                <label className="sr-only">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  disabled={loading}
                  required
                  className="form-input text-sm placeholder:text-sage/70 disabled:opacity-50"
                />
              </div>
            )}

            {!passwordDisabled && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={loading}
                  minLength={8}
                  required
                  className="form-input text-sm placeholder:text-sage/70 disabled:opacity-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 rounded-full text-sage hover:text-pine flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode !== "reset" && !email.trim()) || (!passwordDisabled && password.length < 8)}
              className="mt-3 w-full btn-primary"
            >
              <span className="flex items-center justify-center gap-2">
                {primaryText}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-clay text-center mt-3"
            >
              {error}
            </motion.p>
          )}

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-pine text-center mt-3 leading-relaxed"
            >
              {message}
            </motion.p>
          )}

          {devResetToken && mode === "forgot" && (
            <button
              onClick={() => {
                setMode("reset");
                setMessage(null);
              }}
              className="w-full text-sm text-pine font-medium mt-4 py-2"
            >
              Continue with development reset token
            </button>
          )}

          <div className="flex flex-col items-center gap-2 mt-6">
            {(mode === "signin" || mode === "signup") && (
              <button
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                  setMessage(null);
                }}
                className="text-sm text-pine font-medium"
              >
                {mode === "signin" ? "Create an account" : "I already have an account"}
              </button>
            )}

            {mode === "signin" && (
              <button
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                  setMessage(null);
                }}
                className="text-sm text-sage hover:text-pine transition-colors"
              >
                Forgot password?
              </button>
            )}

            {(mode === "forgot" || mode === "reset") && (
              <button
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setMessage(null);
                }}
                className="text-sm text-sage hover:text-pine transition-colors"
              >
                Back to sign in
              </button>
            )}
          </div>

          <p className="text-[11px] text-sage text-center mt-8 leading-relaxed">
            By continuing, you agree to BestPolicy&apos;s Terms and Privacy Policy.
            <br />
            Your account data is scoped to the identity you sign in with.
          </p>
        </motion.div>
      </main>
    </>
  );
}
