/**
 * /events — Events listing page
 *
 * UX improvement #1: Series cards replaced with a horizontal season timeline
 * that shows progression: Show 01 → 02 → 03 → MEGA with visual state
 * (past = muted, current/next = highlighted, future = outlined).
 */

import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { db } from "@/lib/db/client";
import { eq, inArray, asc, desc } from "drizzle-orm";
import { events } from "@/lib/db/schema";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { EventsRsvpClient } from "./events-rsvp-client";

export const metadata = buildMetadata({
  title: "Events — Cats Can Dance | Underground Dance Music in Bangalore",
  description:
    "CCD × SOCIAL series and the best curated dance music events happening across Bangalore. House, Disco, Jungle, Garage and D&B.",
  path: "/events",
});

async function getAllEvents() {
  const [upcoming, past] = await Promise.all([
    db.query.events.findMany({
      where: inArray(events.status, ["upcoming", "live"]),
      orderBy: [asc(events.sortOrder), asc(events.startsAt)],
      with: { venue: true },
    }),
    db.query.events.findMany({
      where: eq(events.status, "past"),
      orderBy: [desc(events.startsAt)],
      with: { venue: true },
      limit: 12,
    }),
  ]);
  return { upcoming, past };
}

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default async function EventsPage() {
  const { upcoming, past } = await getAllEvents();
  const allSeries = [...past, ...upcoming].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  const nextEvent = upcoming[0] ?? null;

  const jsonLd = upcoming.map((e: typeof upcoming[number]) => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `Cats Can Dance — ${e.title}`,
    startDate: e.startsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.venueLabel ?? e.venue?.name ?? "",
      address: { "@type": "PostalAddress", addressLocality: e.city, addressCountry: "IN" },
    },
    organizer: { "@type": "Organization", name: "Cats Can Dance", url: "https://catscandance.com" },
    url: `https://catscandance.com/events/${e.slug}`,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="bg-background text-foreground min-h-screen">
        <Nav />

        {/* HERO */}
        <PageHero
          eyebrow="EVENTS"
          title="NIGHTS THAT MOVE."
          bg="bg-magenta"
          textColor="text-cream"
          eyebrowColor="text-acid-yellow"
          shadowColor="hsl(var(--ink))"
        >
          <p className="text-cream/90 font-display text-2xl md:text-3xl mb-2">
            UNDERGROUND. LOUD. OURS.
          </p>
          <p className="text-cream/80 font-medium text-lg max-w-xl">
            The cult underground series — house, disco, garage, jungle &amp; D&amp;B.
            Every drop, every floor, every city.
          </p>
        </PageHero>

        <Marquee
          bg="bg-acid-yellow"
          items={["CCDXSOCIAL 01","CCDXSOCIAL 02","CCDXSOCIAL 03","MEGA SHOW","PETS WELCOME","FREE RSVP","9 PM SHARP"]}
        />

        <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6 md:py-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events" }]} />
        </section>

        {/* ── IMPROVEMENT #1: SEASON TIMELINE ── */}
        {allSeries.length > 0 && (
          <section className="bg-electric-blue border-y-4 border-ink py-12 md:py-16 overflow-x-clip">
            <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                  <p className="font-display text-acid-yellow text-base md:text-lg mb-2">/ THE SERIES</p>
                  <h2 className="font-display text-cream text-4xl md:text-6xl leading-none">
                    CCD × SOCIAL
                  </h2>
                  <p className="text-cream/80 font-medium text-base mt-3 max-w-lg">
                    India&apos;s first curated pet lifestyle series meets underground dance music.
                    Four shows. One season. The pack in one place.
                  </p>
                </div>
                <Link
                  href="/ccdxsocial"
                  className="shrink-0 bg-acid-yellow text-ink font-display text-sm px-5 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform whitespace-nowrap"
                >
                  ABOUT THE SERIES →
                </Link>
              </div>

              {/* Timeline row */}
              <div className="relative">
                {/* Connecting line */}
                <div className="hidden md:block absolute top-[2.75rem] left-0 right-0 h-1 bg-cream/20 z-0" />

                <div className="flex flex-col md:flex-row gap-4 md:gap-0">
                  {allSeries.map((e, i) => {
                    const isPast = e.status === "past";
                    const isNext = e.slug === nextEvent?.slug;
                    const isFuture = !isPast && !isNext;
                    const isLast = i === allSeries.length - 1;

                    return (
                      <div key={e.slug} className="flex md:flex-col items-start md:items-center flex-1 relative group">
                        {/* Connector dot */}
                        <div className={`
                          relative z-10 shrink-0 w-10 h-10 md:w-14 md:h-14 border-4 border-ink
                          flex items-center justify-center font-display text-sm md:text-base
                          transition-transform group-hover:scale-110
                          ${isPast ? "bg-ink/40 text-cream/50" : isNext ? "bg-acid-yellow text-ink" : "bg-cream/10 text-cream border-cream/30"}
                        `}>
                          {isPast ? "✓" : isNext ? "▶" : String(i + 1).padStart(2, "0")}
                        </div>

                        {/* Connector line between dots (desktop) */}
                        {!isLast && (
                          <div className={`hidden md:block absolute top-[1.625rem] md:top-[1.875rem] left-[calc(50%+1.75rem)] right-[calc(-50%+1.75rem)] h-0.5 z-0 ${isPast ? "bg-cream/30" : "bg-cream/10"}`} />
                        )}

                        {/* Card */}
                        <Link
                          href={`/events/${e.slug}`}
                          className={`
                            md:mt-4 ml-4 md:ml-0 flex-1 md:flex-none md:w-full border-4 border-ink p-4
                            chunk-shadow transition-transform hover:-translate-y-1 hover:translate-x-[2px]
                            ${isPast ? "bg-ink/20 text-cream/60" : isNext ? "bg-acid-yellow text-ink" : "bg-cream/5 text-cream border-cream/30"}
                          `}
                        >
                          <p className={`font-display text-[10px] tracking-widest mb-1 ${isNext ? "text-magenta" : "opacity-60"}`}>
                            {isPast ? "PAST" : isNext ? "▶ NEXT UP" : "COMING"}
                          </p>
                          <p className={`font-display text-lg leading-tight break-words ${isPast ? "" : "font-bold"}`}>
                            {e.title.toUpperCase()}
                          </p>
                          <p className={`text-xs mt-1 font-medium ${isNext ? "text-ink/70" : "opacity-50"}`}>
                            {formatShortDate(e.startsAt)}
                          </p>
                          <p className={`text-xs font-medium ${isNext ? "text-ink/60" : "opacity-40"}`}>
                            {e.venueLabel ?? e.venue?.name ?? e.city}
                          </p>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* NEXT UPCOMING EVENT HERO */}
        {nextEvent && (
          <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-12 md:py-16">
            <p className="font-display text-magenta text-base md:text-lg mb-3">/ NEXT UP</p>
            <h2 className="font-display text-ink text-3xl md:text-5xl leading-tight mb-8">
              THIS IS THE ONE.
            </h2>
            <EventsRsvpClient
              event={{
                slug: nextEvent.slug,
                title: nextEvent.title,
                blurb: nextEvent.blurb ?? "",
                startsAt: nextEvent.startsAt.toISOString(),
                city: nextEvent.city,
                venueName: nextEvent.venueLabel ?? nextEvent.venue?.name ?? nextEvent.city,
                posterUrl: nextEvent.posterUrl ?? null,
                rsvpEnabled: nextEvent.rsvpEnabled,
                tags: nextEvent.tags ?? [],
              }}
            />
          </section>
        )}

        {/* PAST EPISODES */}
        {past.length > 0 && (
          <section className="bg-cream border-y-4 border-ink py-12 md:py-16">
            <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
              <p className="font-display text-magenta text-base md:text-lg mb-3">/ RECAP</p>
              <h2 className="font-display text-ink text-3xl md:text-5xl leading-tight mb-8">
                PAST EPISODES.
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {past.map((e: typeof past[number]) => (
                  <Link
                    key={e.slug}
                    href={`/events/${e.slug}`}
                    className="group block bg-background border-4 border-ink chunk-shadow overflow-hidden hover:-translate-y-1 hover:translate-x-1 transition-transform"
                  >
                    <div className="relative bg-ink border-b-4 border-ink aspect-video overflow-hidden">
                      {e.posterUrl ? (
                        <img src={e.posterUrl} alt={`${e.title} poster`} loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full grid place-items-center bg-ink text-cream font-display text-3xl">
                          ★ {e.title}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="inline-block bg-ink text-cream text-[10px] font-bold px-2 py-0.5 border-2 border-ink uppercase tracking-widest mb-3">
                        PAST EPISODE
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl text-ink leading-tight mb-1 break-words">
                        {e.title.toUpperCase()}
                      </h3>
                      <p className="text-ink/60 font-medium text-sm">
                        {formatDate(e.startsAt)} · {e.city} · {e.venueLabel ?? e.venue?.name ?? ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HOST CTA */}
        <section className="bg-ink border-t-4 border-ink py-10 md:py-14">
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-display text-acid-yellow text-lg mb-2">/ HOST WITH US</p>
              <h3 className="font-display text-cream text-3xl md:text-5xl leading-[0.95]">
                WANT TO HOST ONE?
              </h3>
            </div>
            <Link
              href="/for-venues"
              className="bg-acid-yellow text-ink font-display text-lg px-6 py-3 border-4 border-cream chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform whitespace-nowrap"
            >
              FOR VENUES →
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
