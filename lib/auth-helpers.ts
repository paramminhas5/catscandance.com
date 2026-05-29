/**
 * Server-side auth helpers — use from RSC, Server Actions, and Route Handlers.
 *
 *   const user = await getCurrentUser();
 *   const user = await requireUser();
 *   const admin = await requireAdmin();
 *   const promoter = await requireRole("promoter");
 */
import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  role: "fan" | "artist" | "promoter" | "admin";
  city?: string | null;
  bio?: string | null;
};

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session?.user) return null;
  return session.user as AuthUser;
}

export async function requireUser(returnTo?: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const path = returnTo ?? "/dashboard";
    redirect(`/sign-in?redirect=${encodeURIComponent(path)}`);
  }
  return user;
}

export async function requireRole(
  role: AuthUser["role"] | AuthUser["role"][],
  returnTo?: string
): Promise<AuthUser> {
  const user = await requireUser(returnTo);
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user.role)) {
    redirect("/");
  }
  return user;
}

export async function requireAdmin(returnTo?: string): Promise<AuthUser> {
  return requireRole("admin", returnTo);
}
