import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED = ["/dashboard", "/advisor", "/protection"];
// Routes that should redirect logged-in users away (auth pages)
const AUTH_ONLY = ["/login"];

const ACCESS_KEY = "aegis_access_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Next.js API routes and static assets — always pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read token from cookies (set by the client after login)
  // We use a cookie mirror of the localStorage token for SSR protection.
  const hasToken =
    req.cookies.has(ACCESS_KEY) ||
    req.headers.get("authorization")?.startsWith("Bearer ");

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

  if (isProtected && !hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
