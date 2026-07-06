"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, ShieldCheck, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/advisor", label: "Talk to Aegis" },
  { href: "/dashboard", label: "Workspace" },
];

export function SiteHeader({ showLogin = false }: { showLogin?: boolean }) {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
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
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(nextProgress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
      <div className="absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-surface-line/70 to-transparent" />
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-pine via-pine-bright to-clay"
        style={{ scaleX: scrollProgress }}
      />

      <Link href="/" className="flex items-center gap-2.5 group">
        <motion.div
          whileHover={{ scale: 1.05, rotate: -4 }}
          className="w-8 h-8 rounded-xl bg-pine flex items-center justify-center shadow-[0_2px_8px_var(--pine)/40]"
        >
          <ShieldCheck className="w-4.5 h-4.5 text-paper" strokeWidth={2.5} />
        </motion.div>
        <span className="font-display font-bold text-[17px] tracking-tight text-ink group-hover:text-pine transition-colors">
          Aegis
        </span>
      </Link>

      <nav className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-full border border-surface-line/70 bg-surface/50 backdrop-blur-sm relative">
        {navItems.map(({ href, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <motion.div key={href} className="relative">
              <Link
                href={href}
                className={`relative z-10 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {label}
              </Link>
              {active ? (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-paper shadow-[0_4px_18px_rgba(15,23,42,0.06)]"
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                />
              ) : null}
            </motion.div>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          suppressHydrationWarning
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-pine hover:bg-pine/8 transition-all duration-200"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-pine hover:bg-pine/8 transition-all duration-200"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {!loading && user ? (
          <div className="hidden sm:flex items-center gap-2">
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
              className="hidden sm:inline-flex text-[13px] px-5 py-2 rounded-full bg-ink text-paper font-medium hover:bg-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              Log in
            </Link>
          )
        )}
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.2, ease: "easeOut" }}
            className="absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-[24px] border border-surface-line/70 bg-surface/95 p-4 shadow-[0_20px_50px_-24px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map(({ href, label }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-2xl px-3 py-3 text-sm font-medium transition-colors ${
                      active ? "bg-pine/10 text-pine" : "text-ink-soft hover:bg-paper hover:text-ink"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              {showLogin && (!loading && !user) ? (
                <Link
                  href="/login"
                  className="mt-2 rounded-2xl bg-ink px-3 py-3 text-sm font-medium text-paper text-center"
                >
                  Log in
                </Link>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
