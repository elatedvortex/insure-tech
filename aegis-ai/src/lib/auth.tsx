"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api, authApi, userApi, tokens, type User } from "./api";

// ── Types ──────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    if (!tokens.getAccess()) {
      setLoading(false);
      return;
    }
    try {
      const me = await userApi.me();
      setUser(me);
    } catch {
      // Token invalid / expired and refresh also failed — clear state
      tokens.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Immediately sync the localStorage token into a cookie so Next.js middleware
  // can protect routes server-side — this must run before fetchUser resolves.
  useEffect(() => {
    const access = tokens.getAccess();
    if (access) {
      // Re-calling tokens.set with the same values triggers the cookie sync
      const refresh = tokens.getRefresh() ?? "";
      tokens.set(access, refresh);
    }
  }, []);

  // On mount: try to rehydrate user from stored access token
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);


  const signOut = useCallback(async () => {
    const refresh = tokens.getRefresh();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // best-effort
    } finally {
      tokens.clear();
      setUser(null);
      const dest = "/login";
      await router.push(dest);
      if (typeof window !== "undefined") {
        // give the router a tiny moment, then force a full reload so UI and
        // server-side protections see the cleared cookie/localStorage state.
        setTimeout(() => window.location.replace(dest), 50);
      }
    }
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, signOut, refreshUser: fetchUser }),
    [user, loading, signOut, fetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Use in page components that require authentication.
 * Redirects to /login if the user is not signed in after loading.
 */
export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace("/login");
    }
  }, [auth.loading, auth.user, router]);

  return auth;
}
