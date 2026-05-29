import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __ccd_db_client: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // We only throw at first use; this lets `next build` work in CI without DB.
  console.warn("[db] DATABASE_URL is not set — DB calls will fail at runtime.");
}

/**
 * Singleton postgres-js client.
 *  - `prepare: false` is required for Supabase's pgBouncer transaction pooler.
 *  - `max: 1` for serverless cold starts; bump for long-running workers.
 */
const sql =
  globalThis.__ccd_db_client ??
  postgres(connectionString ?? "postgresql://placeholder", {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__ccd_db_client = sql;
}

export const db = drizzle(sql, { schema, casing: "snake_case" });
export type Database = typeof db;
export { schema };
