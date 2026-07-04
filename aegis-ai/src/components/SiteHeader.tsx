"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, ShieldCheck, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";

export function SiteHeader({ showLogin = false }: { showLogin?: boolean }) {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("aegis-theme");
    const isDark = stored === "dark";
    if (isDark) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("aegis-theme", next ? "dark" : "light");
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
      className={`sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-paper/80 backdrop-blur-md border-b border-surface-line/60 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-xl bg-pine flex items-center justify-center shadow-[0_2px_8px_var(--pine)/40] group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-4.5 h-4.5 text-paper" strokeWidth={2.5} />
        </div>
        <span className="font-display font-bold text-[17px] tracking-tight text-ink group-hover:text-pine transition-colors">
          Aegis
        </span>
      </Link>

      {/* Centre nav */}
      <nav className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-full border border-surface-line/70 bg-surface/50 backdrop-blur-sm">
        {[
          { href: "/advisor", label: "Talk to Aegis" },
          { href: "/dashboard", label: "Workspace" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-1.5 rounded-full text-[13px] font-medium text-ink-soft hover:text-ink hover:bg-paper transition-all duration-200"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          suppressHydrationWarning
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-pine hover:bg-pine/8 transition-all duration-200"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {!loading && user ? (
          /* Signed-in: show user email + logout */
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-[12px] text-ink-soft max-w-[140px] truncate">
              {user.name ?? user.email}
            </span>
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-clay hover:bg-clay/8 transition-all duration-200"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          showLogin && (
            <Link
              href="/login"
              className="text-[13px] px-5 py-2 rounded-full bg-ink text-paper font-medium hover:bg-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              Log in
            </Link>
          )
        )}
      </div>
    </motion.header>
  );
}
