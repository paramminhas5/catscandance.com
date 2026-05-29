/**
 * Better Auth — server-side configuration.
 *
 * Identity lives in our own Postgres (no vendor lock-in). Drizzle adapter
 * wires the canonical user / session / account / verification tables we
 * already declared in lib/db/schema.ts.
 *
 * Custom fields on the user table:
 *   - role (fan | artist | promoter | admin) — gates /admin and the CMS
 *   - city, bio, socials — populated post-signup from /dashboard
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db/client";
import { account, session, user, verification } from "./db/schema";

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET ?? "build-time-placeholder-replace-in-production",
  appName: "Cats Can Dance",

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
    usePlural: false,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false, // never set by users; admins promote roles
        defaultValue: "fan",
      },
      city: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh once per day
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },

  trustedOrigins: [baseURL, "http://localhost:3000"],

  plugins: [nextCookies()],
});

export type Auth = typeof auth;
