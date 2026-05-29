/**
 * Better Auth route handler — mounted at /api/auth/*.
 * All sign-in / sign-up / OAuth callback / session traffic flows through here.
 */
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth.handler);
