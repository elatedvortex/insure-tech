/**
 * Aegis API client
 * ------------------------------------------------------------------
 * • Reads access/refresh tokens from localStorage
 * • Automatically attaches Bearer header on every request
 * • On 401 attempts one silent token refresh, then signs the user out
 * • Exports typed helpers for every backend domain
 */

const BASE = process.env.NEXT_PUBLIC_API_URL;

// ── Token storage ──────────────────────────────────────────────────────────

const KEYS = {
  access: "aegis_access_token",
  refresh: "aegis_refresh_token",
};

/**
 * Mirror the access token into a cookie so Next.js proxy/middleware can read it
 * server-side for route protection (localStorage is not available in middleware).
 */
function syncCookie(access: string | null) {
  if (typeof document === "undefined") return;
  if (access) {
    // SameSite=Lax is safe for same-origin; Secure should be added in true production
    document.cookie = `${KEYS.access}=${access}; path=/; SameSite=Lax; max-age=86400`;
  } else {
    document.cookie = `${KEYS.access}=; path=/; SameSite=Lax; max-age=0`;
  }
}

export const tokens = {
  getAccess: () => (typeof window !== "undefined" ? localStorage.getItem(KEYS.access) : null),
  getRefresh: () => (typeof window !== "undefined" ? localStorage.getItem(KEYS.refresh) : null),
  set: (access: string, refresh: string) => {
    localStorage.setItem(KEYS.access, access);
    localStorage.setItem(KEYS.refresh, refresh);
    syncCookie(access);
  },
  clear: () => {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
    syncCookie(null);
  },
};

// ── Error class ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Core fetch wrapper ─────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function doRefresh(): Promise<string> {
  const raw = tokens.getRefresh();
  if (!raw) throw new ApiError(401, "No refresh token");

  const res = await fetch(`${BASE}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: raw }),
  });

  if (!res.ok) {
    tokens.clear();
    throw new ApiError(401, "Session expired — please log in again");
  }

  const data = await res.json();
  // The backend rotates the refresh token on every refresh — store both tokens.
  // (Previously the new refresh_token was silently discarded here.)
  const newRefresh = data.refresh_token ?? raw;
  tokens.set(data.access_token, newRefresh);
  return data.access_token;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const access = tokens.getAccess();

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (!(init.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (access) headers["Authorization"] = `Bearer ${access}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401 && retry) {
    if (isRefreshing) {
      // Queue this request until the ongoing refresh finishes
      return new Promise((resolve, reject) => {
        refreshSubscribers.push(async (newToken) => {
          try {
            resolve(await request<T>(path, init, false));
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await doRefresh();
      onRefreshed(newToken);
      isRefreshing = false;
      return request<T>(path, init, false);
    } catch (e) {
      isRefreshing = false;
      throw e;
    }
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? body.message ?? detail;
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Convenience methods ────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, form: FormData) =>
    request<T>(path, { method: "POST", body: form }),
};

// ── Domain helpers ─────────────────────────────────────────────────────────

// Auth
export const authApi = {
  register: (email: string, password: string, name?: string) =>
    api.post<{ access_token: string; refresh_token: string; token_type: string }>(
      "/api/v1/auth/register",
      { email, password, name },
    ),
  login: (email: string, password: string) =>
    api.post<{ access_token: string; refresh_token: string; token_type: string }>(
      "/api/v1/auth/login",
      { email, password },
    ),
  oauth: (provider: "google" | "apple", data: { id_token?: string; email?: string; name?: string }) =>
    api.post<{ access_token: string; refresh_token: string; token_type: string }>(
      "/api/v1/auth/oauth",
      { provider, ...data },
    ),
  forgotPassword: (email: string) =>
    api.post<{ message: string; reset_token?: string }>("/api/v1/auth/password/forgot", { email }),
  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>("/api/v1/auth/password/reset", { token, password }),
  logout: (refresh_token: string) =>
    api.post<void>("/api/v1/auth/logout", { refresh_token }),
};

// Users
export const userApi = {
  me: () => api.get<User>("/api/v1/users/me"),
  update: (data: { name?: string }) => api.patch<User>("/api/v1/users/me", data),
};

// Policies
export const policyApi = {
  list: () => api.get<Policy[]>("/api/v1/policies/"),
  get: (id: string) => api.get<Policy>(`/api/v1/policies/${id}`),
  create: (data: PolicyCreate) => api.post<Policy>("/api/v1/policies/", data),
  update: (id: string, data: Partial<PolicyCreate>) => api.patch<Policy>(`/api/v1/policies/${id}`, data),
  delete: (id: string) => api.delete<void>(`/api/v1/policies/${id}`),
};

// Claims
export const claimApi = {
  list: () => api.get<Claim[]>("/api/v1/claims/"),
  get: (id: string) => api.get<Claim>(`/api/v1/claims/${id}`),
  create: (data: ClaimCreate) => api.post<Claim>("/api/v1/claims/", data),
  advance: (id: string) => api.post<Claim>(`/api/v1/claims/${id}/advance`),
};

// Conversations
export const conversationApi = {
  list: () => api.get<Conversation[]>("/api/v1/conversations/"),
  create: () => api.post<Conversation>("/api/v1/conversations/"),
  get: (id: string) => api.get<Conversation>(`/api/v1/conversations/${id}`),
  send: (id: string, text: string) =>
    api.post<Conversation>(`/api/v1/conversations/${id}/messages`, { text }),
  /**
   * Open a Server-Sent Events stream for real-time advisor replies.
   * Returns the raw Response so the caller can read the body as a stream.
   */
  stream: async (id: string, text: string): Promise<Response> => {
    const access = tokens.getAccess();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };
    if (access) headers["Authorization"] = `Bearer ${access}`;
    return fetch(`${BASE}/api/v1/conversations/${id}/messages/stream`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text }),
    });
  },
};

// Notifications
export const notificationApi = {
  list: () => api.get<Notification[]>("/api/v1/notifications/"),
  markRead: (id: string) => api.post<Notification>(`/api/v1/notifications/${id}/read`),
  markAllRead: () => api.post<{ marked_read: number }>("/api/v1/notifications/read-all"),
};

// Protection
export const protectionApi = {
  score: () => api.get<ProtectionScore>("/api/v1/protection/"),
  recalculate: () => api.post<ProtectionScore>("/api/v1/protection/recalculate"),
};

// Recommendations
export const recommendationApi = {
  list: () => api.get<Recommendation[]>("/api/v1/recommendations/"),
  generate: () => api.post<Recommendation[]>("/api/v1/recommendations/generate"),
  act: (id: string, action: "accept" | "dismiss") =>
    api.post<Recommendation>(`/api/v1/recommendations/${id}/action`, { action }),
};

// Documents
export const documentApi = {
  list: () => api.get<Document[]>("/api/v1/documents/"),
  upload: (docType: string, file: File) => {
    const form = new FormData();
    form.append("doc_type", docType);
    form.append("file", file);
    return api.upload<Document>("/api/v1/documents/", form);
  },
  delete: (id: string) => api.delete<void>(`/api/v1/documents/${id}`),
};

// ── API types (mirroring backend schemas) ──────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Policy {
  id: string;
  user_id: string;
  category: string;
  name: string;
  monthly_premium: number;
  status: string;
  coverage_summary: string | null;
  deductible: number | null;
  renews_on: string | null;
  created_at: string;
  updated_at: string;
}

export interface PolicyCreate {
  category: string;
  name: string;
  monthly_premium: number;
  status?: string;
  coverage_summary?: string;
  deductible?: number;
  renews_on?: string;
}

export interface Claim {
  id: string;
  user_id: string;
  policy_id: string | null;
  incident_description: string;
  stage: string;
  estimate: number | null;
  fraud_risk_score: number | null;
  next_step: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClaimCreate {
  policy_id?: string;
  incident_description: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  cards: unknown[] | null;
  quick_replies: string[] | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface ProtectionScore {
  id: string;
  user_id: string;
  overall: number;
  breakdown: { label: string; score: number; weight?: number }[];
  updated_at: string;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  reasoning: string;
  monthly_premium: number | null;
  dismissed: boolean;
  accepted: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  doc_type: string;
  storage_key: string;
  extracted_fields: Record<string, unknown> | null;
  status: string;
  created_at: string;
}
