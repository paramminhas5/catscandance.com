/**
 * PlatformStatsStrip — server island that shows a social-proof ticker when
 * at least one stat is non-zero. Wrapped in <Suspense> by the homepage so
 * the static shell prerenders without it.
 *
 * Reads directly from the DB — no client-side fetch, no race condition.
 */
import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { artists, events, interactions, signups } from "@/lib/db/schema";

export async function PlatformStatsStrip() {
  await connection();

  let stats = {
    total_signups: 0,
    total_artists: 0,
    total_rsvps: 0,
    cities: 0,
  };

  try {
    const [signupRow, artistRow, rsvpRow, cityRow] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(signups),
      db.select({ count: sql<number>`count(*)::int` }).from(artists),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(interactions)
        .where(sql`${interactions.kind} = 'rsvp'`),
      db
        .select({ count: sql<number>`count(distinct city)::int` })
        .from(events),
    ]);

    stats = {
      total_signups: signupRow[0]?.count ?? 0,
      total_artists: artistRow[0]?.count ?? 0,
      total_rsvps: rsvpRow[0]?.count ?? 0,
      cities: cityRow[0]?.count ?? 0,
    };
  } catch {
    // DB not available — render nothing.
    return null;
  }

  const hasData =
    stats.total_signups > 0 || stats.total_artists > 0 || stats.total_rsvps > 0;
  if (!hasData) return null;

  return (
    <div className="bg-acid-yellow border-b-4 border-ink py-3 px-4">
      <div className="mx-auto w-full max-w-[1200px] flex flex-wrap justify-center gap-x-8 gap-y-1">
        {stats.total_signups > 0 && (
          <span className="font-display text-ink text-xs uppercase tracking-widest">
            ✦ {stats.total_signups.toLocaleString("en-IN")} on the list
          </span>
        )}
        {stats.total_artists > 0 && (
          <span className="font-display text-ink text-xs uppercase tracking-widest">
            ✦ {stats.total_artists.toLocaleString("en-IN")} artists
          </span>
        )}
        {stats.total_rsvps > 0 && (
          <span className="font-display text-ink text-xs uppercase tracking-widest">
            ✦ {stats.total_rsvps.toLocaleString("en-IN")} RSVPs this season
          </span>
        )}
        {stats.cities > 0 && (
          <span className="font-display text-ink text-xs uppercase tracking-widest">
            ✦ {stats.cities} cities
          </span>
        )}
      </div>
    </div>
  );
}

/** RSC island that loads signup count for EarlyAccess section */
export async function SignupCountIsland() {
  await connection();
  try {
    const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(signups);
    return row?.count ?? null;
  } catch {
    return null;
  }
}
