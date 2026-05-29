/**
 * HeroUrgencyStrip — async RSC island wrapped in <Suspense> by the homepage.
 * Renders the absolutely-positioned countdown strip above the Hero when an
 * event is ≤60 days away; otherwise renders nothing.
 */
import Link from "next/link";
import { connection } from "next/server";
import { and, asc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { events as eventsTable } from "@/lib/db/schema";

export async function HeroUrgencyStrip() {
  await connection(); // mark this island as dynamic; allows `new Date()`.

  let next: { slug: string; title: string; venue?: string; daysAway: number } | null = null;
  try {
    const [row] = await db
      .select()
      .from(eventsTable)
      .where(
        and(
          eq(eventsTable.visibility, "public"),
          inArray(eventsTable.status, ["upcoming", "live"]),
          gte(eventsTable.startsAt, new Date())
        )
      )
      .orderBy(asc(eventsTable.startsAt))
      .limit(1);
    if (row) {
      const daysAway = Math.ceil((row.startsAt.getTime() - Date.now()) / 86_400_000);
      if (daysAway > 0 && daysAway <= 60) {
        next = {
          slug: row.slug,
          title: row.title,
          venue: row.venueLabel ?? undefined,
          daysAway,
        };
      }
    }
  } catch (err) {
    console.warn("[hero-urgency-strip] DB unavailable:", err);
    return null;
  }

  if (!next) return null;

  return (
    <div className="absolute top-[72px] md:top-[80px] inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <Link
        href={`/events/${next.slug}`}
        className="pointer-events-auto inline-flex items-center gap-3 bg-acid-yellow text-ink border-4 border-ink px-4 py-2 font-display text-xs md:text-sm uppercase tracking-widest chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
      >
        <span
          className="inline-block w-2 h-2 bg-magenta rounded-full animate-pulse shrink-0"
          aria-hidden
        />
        <span>
          ▶ {next.title} — {next.daysAway === 1 ? "TOMORROW" : `${next.daysAway} DAYS`}
        </span>
        {next.venue ? (
          <span className="hidden sm:inline text-ink/60">· {next.venue}</span>
        ) : null}
        <span className="bg-ink text-acid-yellow px-2 py-0.5 text-[10px] font-display uppercase">
          RSVP →
        </span>
      </Link>
    </div>
  );
}
