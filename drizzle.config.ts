import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  // Allow drizzle-kit generate without a live connection.
  // db:push and db:migrate will fail fast below if the URL is missing.
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  casing: "snake_case",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder",
  },
});
