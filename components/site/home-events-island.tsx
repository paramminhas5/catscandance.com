/**
 * HomeEventsIsland — async RSC island that loads featured upcoming + past
 * events and renders <EventsStrip>. Wrapped in <Suspense> by the homepage.
 */
import { connection } from "next/server";
import { and, asc, desc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { events as eventsTable } from "@/lib/db/schema";
import { EventsStrip, type EventStripItem } from "./events-strip";

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export async function HomeEventsIsland() {
  await connection();

  let stripEvents: EventStripItem[] = [];
  try {
    const upcoming = await db
      .select()
      .from(eventsTable)
      .where(
        and(
          eq(eventsTable.visibility, "public"),
          inArray(eventsTable.status, ["upcoming", "live"]),
          gte(eventsTable.startsAt, new Date())
        )
      )
      .orderBy(asc(eventsTable.sortOrder), asc(eventsTable.startsAt))
      .limit(1);

    const past = await db
      .select()
      .from(eventsTable)
      .where(and(eq(eventsTable.visibility, "public"), eq(eventsTable.status, "past")))
      .orderBy(desc(eventsTable.startsAt))
      .limit(6);

    stripEvents = [...upcoming, ...past].map((e) => ({
      slug: e.slug,
      title: e.title,
      date: formatDate(e.startsAt),
      city: e.city,
      venue: e.venueLabel ?? "TBA",
      blurb: e.blurb,
      posterUrl: e.posterUrl,
      status: e.status as EventStripItem["status"],
    }));
  } catch (err) {
    console.warn("[home-events-island] DB unavailable, rendering empty list:", err);
  }

  return <EventsStrip events={stripEvents} />;
}
