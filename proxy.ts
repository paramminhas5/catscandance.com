/**
 * Next.js 16 Proxy (formerly "middleware") — optimistic auth gate.
 * Checks for a session cookie's presence (no DB hit) and redirects
 * unauthenticated traffic away from /admin and /dashboard.
 *
 * The authoritative role check happens in the route's RSC layout via
 * requireAdmin() / requireRole(). This proxy just keeps anonymous
 * users out before they hit the server.
 */
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED = ["/admin", "/dashboard", "/my-tickets", "/submit-event"] as const;

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("redirect", path);
    return NextResponse.redirect(signIn);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/my-tickets/:path*", "/submit-event"],
};
