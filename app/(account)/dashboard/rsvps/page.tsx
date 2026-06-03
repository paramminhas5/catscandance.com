/**
 * /dashboard/rsvps — RSVP history
 */
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { signups, events } from "@/lib/db/schema";
import { and, eq, like, inArray } from "drizzle-orm";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Calendar, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "My RSVPs — Cats Can Dance",
  description: "Your RSVP history.",
  path: "/dashboard/rsvps",
});

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });
}

export default async function RsvpsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const rsvpSignups = await db.query.signups.findMany({
    where: and(
      eq(signups.email, session.user.email),
      like(signups.tag, "event:%")
    ),
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  });

  const eventSlugs = rsvpSignups.map((r) => r.tag.replace("event:", ""));
  const rsvpEvents = eventSlugs.length > 0
    ? await db.query.events.findMany({
        where: inArray(events.slug, eventSlugs),
        with: { venue: true },
      })
    : [];

  const now = new Date();

  const enriched = rsvpSignups.map((rsvp) => {
    const slug = rsvp.tag.replace("event:", "");
    const event = rsvpEvents.find((e) => e.slug === slug);
    return { rsvp, event, slug };
  });

  const upcoming = enriched.filter((r) => r.event && new Date(r.event.startsAt) > now);
  const past = enriched.filter((r) => !r.event || new Date(r.event.startsAt) <= now);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "My RSVPs" }]} />

      <div className="mb-8">
        <p className="font-display text-magenta text-base mb-2">/ HISTORY</p>
        <h1 className="font-display text-ink text-3xl md:text-5xl leading-none">MY RSVPS</h1>
      </div>

      {rsvpSignups.length === 0 ? (
        <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-10 text-center">
          <p className="font-display text-ink text-2xl mb-3">NO RSVPS YET</p>
          <p className="text-ink/70 mb-6 font-medium">You haven&apos;t RSVP&apos;d to any events. Find your next night.</p>
          <Link
            href="/events"
            className="inline-block bg-ink text-cream font-display px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
          >
            BROWSE EVENTS →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <p className="font-display text-ink text-xl mb-4 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-magenta border-2 border-ink" />
                UPCOMING ({upcoming.length})
              </p>
              <div className="space-y-3">
                {upcoming.map(({ rsvp, event, slug }) => (
                  <div
                    key={rsvp.id}
                    className="border-4 border-ink bg-cream chunk-shadow grid md:grid-cols-3 overflow-hidden"
                  >
                    <div className="p-5 md:col-span-2">
                      {event ? (
                        <>
                          <Link href={`/events/${slug}`} className="font-display text-ink text-xl hover:text-magenta transition-colors">
                            {event.title.toUpperCase()}
                          </Link>
                          <div className="flex flex-wrap gap-4 mt-2 text-ink/60 text-sm">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(event.startsAt)}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.city}</span>
                          </div>
                          {(event.venueLabel ?? event.venue?.name) && (
                            <p className="text-ink/50 text-xs mt-1">{event.venueLabel ?? event.venue?.name}</p>
                          )}
                        </>
                      ) : (
                        <p className="font-display text-ink/50 text-base">{slug.toUpperCase()}</p>
                      )}
                    </div>
                    <div className="bg-acid-yellow border-t-4 md:border-t-0 md:border-l-4 border-ink p-5 flex items-center justify-between md:flex-col md:justify-center md:text-center gap-3">
                      <span className="font-display text-ink text-sm uppercase bg-magenta text-cream px-3 py-1 border-2 border-ink">
                        ✓ RSVP&apos;D
                      </span>
                      {event && (
                        <Link href={`/events/${slug}`} className="font-display text-xs text-ink/60 hover:text-ink transition-colors uppercase">
                          View event →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <p className="font-display text-ink/50 text-xl mb-4 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-ink/30 border-2 border-ink" />
                PAST ({past.length})
              </p>
              <div className="space-y-3">
                {past.map(({ rsvp, event, slug }) => (
                  <div
                    key={rsvp.id}
                    className="border-4 border-ink/30 bg-cream/50 grid md:grid-cols-3 overflow-hidden opacity-60"
                  >
                    <div className="p-4 md:col-span-2">
                      {event ? (
                        <>
                          <p className="font-display text-ink text-base">{event.title.toUpperCase()}</p>
                          <p className="text-ink/50 text-xs mt-1">{formatDate(event.startsAt)} · {event.city}</p>
                        </>
                      ) : (
                        <p className="font-display text-ink/50 text-base">{slug.toUpperCase()}</p>
                      )}
                    </div>
                    <div className="p-4 flex items-center md:justify-center border-t-2 md:border-t-0 md:border-l-2 border-ink/20">
                      <span className="font-display text-ink/40 text-xs uppercase">PAST</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
