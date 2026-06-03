/**
 * Stats — async Server Component with live DB counts
 * Displays upcoming events, artists, cities, RSVPs with Suspense skeleton
 * Phase 8: Replace hardcoded numbers with live DB queries
 */
import { Suspense } from "react";
import { db } from "@/lib/db/client";
import { events, artists, signups } from "@/lib/db/schema";
import { sql, like } from "drizzle-orm";

type Stat = {
  value: number | string;
  label: string;
  bg: string;
  text: string;
};

async function LiveStats() {
  const [
    upcomingRows,
    artistRows,
    cityRows,
    rsvpRows,
  ] = await Promise.all([
    db.select({ upcomingCount: sql<number>`count(*)::int` })
      .from(events)
      .where(sql`${events.status} IN ('upcoming','live')`),
    db.select({ artistCount: sql<number>`count(*)::int` }).from(artists),
    db.select({ cityCount: sql<number>`count(distinct ${events.city})::int` }).from(events),
    db.select({ rsvpCount: sql<number>`count(*)::int` })
      .from(signups)
      .where(like(signups.tag, "event:%")),
  ]);

  const upcomingCount = upcomingRows[0]?.upcomingCount ?? 0;
  const artistCount = artistRows[0]?.artistCount ?? 0;
  const cityCount = cityRows[0]?.cityCount ?? 0;
  const rsvpCount = rsvpRows[0]?.rsvpCount ?? 0;

  const STATS: Stat[] = [
    { value: upcomingCount, label: "UPCOMING SHOWS", bg: "bg-magenta", text: "text-cream" },
    { value: `${artistCount}+`, label: "ARTISTS", bg: "bg-acid-yellow", text: "text-ink" },
    { value: cityCount, label: "CITIES", bg: "bg-electric-blue", text: "text-cream" },
    { value: `${rsvpCount}+`, label: "RSVPS", bg: "bg-orange", text: "text-ink" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STATS.map((s) => (
        <div key={s.label} className={`border-4 border-ink chunk-shadow p-6 ${s.bg}`}>
          <p className={`font-display text-4xl md:text-5xl leading-none mb-1 ${s.text}`}>
            {s.value}
          </p>
          <p className={`font-display text-xs uppercase tracking-widest ${s.text} opacity-60`}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {["bg-magenta", "bg-acid-yellow", "bg-electric-blue", "bg-orange"].map((bg) => (
        <div key={bg} className={`border-4 border-ink chunk-shadow p-6 ${bg} animate-pulse`}>
          <div className="h-10 bg-black/10 w-16 mb-2" />
          <div className="h-3 bg-black/10 w-24" />
        </div>
      ))}
    </div>
  );
}

export function Stats() {
  return (
    <Suspense fallback={<StatsSkeleton />}>
      <LiveStats />
    </Suspense>
  );
}
