"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { OtpInput } from "@/components/auth/OtpInput";
import { Presence } from "@/components/Presence";
import { authApi, ApiError, tokens } from "@/lib/api";

export default function VerifyClient() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") || "";

  const [status, setStatus] = useState<"idle" | "verifying" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("That code didn't work — try again.");
  const [cooldown, setCooldown] = useState(30);
  const [sending, setSending] = useState(false);

  // Redirect if email param is missing
  useEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleComplete(code: string) {
    if (status === "verifying") return;
    setStatus("verifying");
    setErrorMsg("That code didn't work — try again.");

    try {
      const data = await authApi.verifyOtp(email, code);
      tokens.set(data.access_token, data.refresh_token);
      setStatus("success");
      // Small delay so user sees the "Verified" state
      setTimeout(() => router.replace("/dashboard"), 600);
    } catch (e) {
      if (e instanceof ApiError) {
        setErrorMsg(e.message);
      }
      setStatus("error");
    }
  }

  async function resend() {
    if (cooldown > 0 || sending) return;
    setSending(true);
    try {
      await authApi.requestOtp(email);
      setCooldown(30);
    } catch {
      // silently fail — the user can try again
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <AuthHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm text-center"
        >
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-1.5 text-xs text-sage hover:text-pine transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Use a different email
          </button>

          <div className="flex justify-center mb-6">
            <Presence size="lg" active={status === "verifying"} />
          </div>

          <h1 className="font-display text-2xl text-ink leading-tight">
            Check your email
          </h1>
          <p className="text-sm text-ink-soft mt-2 mb-9">
            We sent a 6-digit code to <span className="text-ink">{email}</span>
          </p>

          <OtpInput onComplete={handleComplete} key={status === "error" ? "error" : "normal"} />

          <div className="h-6 mt-4">
            {status === "verifying" && (
              <p className="text-xs text-sage">Verifying…</p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-clay"
              >
                {errorMsg}
              </motion.p>
            )}
            {status === "success" && (
              <p className="text-xs text-pine">Verified — taking you in…</p>
            )}
          </div>

          <button
            onClick={resend}
            disabled={cooldown > 0 || sending}
            className="text-sm text-pine font-medium mt-6 disabled:text-sage disabled:font-normal transition-colors"
          >
            {sending
              ? "Sending…"
              : cooldown > 0
              ? `Resend code in ${cooldown}s`
              : "Resend code"}
          </button>
        </motion.div>
      </main>
    </>
  );
}
