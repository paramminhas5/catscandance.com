/**
 * EarlyAccessIsland — async RSC wrapper that fetches the signup count and
 * renders <EarlyAccess> with it. Wrapped in <Suspense> by the homepage so
 * the static shell prerenders without blocking.
 */
import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { signups } from "@/lib/db/schema";
import { EarlyAccess } from "./early-access";

export async function EarlyAccessIsland() {
  await connection();

  let count: number | null = null;
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(signups);
    count = row?.count ?? null;
  } catch {
    // DB not yet available — render without count.
  }

  return <EarlyAccess signupCount={count} />;
}
