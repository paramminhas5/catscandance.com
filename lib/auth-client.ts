"use client";
/**
 * Better Auth — React client. Use these from Client Components only.
 *   const { data: session, isPending } = useSession();
 */
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
