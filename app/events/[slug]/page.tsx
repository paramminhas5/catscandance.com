/**
 * /events/[slug] — Event detail page (Server Component + Client islands)
 *
 * Sections:
 *  1. Hero            — title, status pill, date/venue/city, RSVP CTA, poster
 *  2. Countdown       — live countdown strip (upcoming only)
 *  3. Marquee
 *  4. The Night       — blurb + description
 *  5. Lineup          — artist cards
 *  6. Media           — photo/video gallery
 *  7. Venue           — address + map
 *  8. Series          — sibling events
 *  9. Sticky RSVP bar (mobile)
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getEventBySlug, getRelatedEvents } from "@/lib/db/queries";
import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { events, type EventLineup, type Artist } from "@/lib/db/schema";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { EventPosterPlaceholder } from "@/components/site/event-poster-placeholder";
import { EventVenueCard } from "@/components/site/event-venue-card";
import { EventLineupCard } from "@/components/site/event-lineup-card";
import { EventDetailClient } from "./event-detail-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return buildMetadata({
    title: `${event.title} — Cats Can Dance`,
    description: event.blurb ?? `${event.title} at ${event.venueLabel ?? event.venue?.name ?? event.city}`,
    path: `/events/${slug}`,
    image: event.posterUrl ?? undefined,
  });
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

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const isUpcoming = event.status === "upcoming" || event.status === "live";
  const venueName = event.venueLabel ?? event.venue?.name ?? event.city;
  const dateStr = formatDate(event.startsAt);
  const headingShadow = isUpcoming
    ? "drop-shadow-[6px_6px_0_hsl(var(--ink))]"
    : "drop-shadow-[6px_6px_0_hsl(var(--magenta))]";

  // Fetch sibling events if in a series (by shared promoter + same city, as a proxy)
  const related = await getRelatedEvents(event.id, event.city, event.genres ?? [], 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `Cats Can Dance — ${event.title}`,
    description: event.blurb,
    startDate: event.startsAt,
    eventStatus: isUpcoming
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventMovedOnline",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.addressLine ?? venueName,
        addressLocality: event.city,
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
    image: event.posterUrl ? [event.posterUrl] : undefined,
    performer: (event.lineup ?? []).map((l: any) => ({
      "@type": "PerformingGroup",
      name: l.artist?.name ?? "TBA",
    })),
    organizer: {
      "@type": "Organization",
      name: "Cats Can Dance",
      url: "https://catscandance.com",
    },
    offers: {
      "@type": "Offer",
      url: `https://catscandance.com/events/${slug}`,
      price: (event.tickets ?? []).length > 0 ? String((event.tickets![0] as any).price) : "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    url: `https://catscandance.com/events/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-background text-foreground min-h-screen pb-20 md:pb-0">
        <Nav />

        {/* 1. HERO */}
        <section
          className={`pt-28 md:pt-36 pb-12 md:pb-16 border-b-4 border-ink ${
            isUpcoming ? "bg-magenta text-cream" : "bg-cream text-ink"
          }`}
        >
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
            <Breadcrumbs
              light={isUpcoming}
              items={[
                { label: "Home", href: "/" },
                { label: "Events", href: "/events" },
                { label: event.title },
              ]}
            />

            <div className="mt-6 grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-end">
              {/* Title block */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 border-2 border-ink uppercase tracking-widest ${
                      isUpcoming ? "bg-acid-yellow text-ink" : "bg-ink text-cream"
                    }`}
                  >
                    {isUpcoming ? "UPCOMING · RSVP OPEN" : "PAST EPISODE"}
                  </span>
                  {event.tags?.includes("pet-friendly") && (
                    <span className="inline-block text-xs font-bold px-3 py-1 border-2 border-ink uppercase tracking-widest bg-electric-blue text-cream">
                      🐾 PET-FRIENDLY
                    </span>
                  )}
                </div>

                <h1
                  className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] mb-6 break-words ${headingShadow}`}
                >
                  {event.title.toUpperCase()}
                </h1>

                <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-xl mb-6">
                  {[
                    { label: "DATE", value: dateStr },
                    { label: "VENUE", value: venueName },
                    { label: "CITY", value: event.city },
                  ].map(({ label, value }) => (
                    <div key={label} className="min-w-0">
                      <p
                        className={`font-display text-xs md:text-sm tracking-widest mb-1 ${
                          isUpcoming ? "text-acid-yellow" : "text-magenta"
                        }`}
                      >
                        / {label}
                      </p>
                      <p className="font-display text-lg md:text-2xl break-words leading-tight">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Client island handles RSVP dialog + share button */}
                <EventDetailClient
                  eventSlug={event.slug}
                  eventTitle={event.title}
                  eventDate={event.startsAt.toISOString()}
                  eventVenue={venueName}
                  isUpcoming={isUpcoming}
                  rsvpEnabled={event.rsvpEnabled}
                />
              </div>

              {/* Poster */}
              <div className="lg:max-w-md w-full justify-self-end">
                {event.posterUrl ? (
                  <img
                    src={event.posterUrl}
                    alt={`${event.title} — Cats Can Dance event in ${event.city}`}
                    loading="eager"
                    decoding="async"
                    className="w-full aspect-[3/4] object-cover border-4 border-ink chunk-shadow-lg"
                  />
                ) : (
                  <EventPosterPlaceholder
                    title={event.title}
                    date={dateStr}
                    city={event.city}
                    lineup={
                      event.lineup?.length
                        ? event.lineup.map((l: any) => l.artist?.name ?? "TBA").join(" · ")
                        : undefined
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. COUNTDOWN (client island — needs live timer) */}
        {isUpcoming && (
          <EventDetailClient
            eventSlug={event.slug}
            eventTitle={event.title}
            eventDate={event.startsAt.toISOString()}
            eventVenue={venueName}
            isUpcoming={isUpcoming}
            rsvpEnabled={event.rsvpEnabled}
            countdownOnly
          />
        )}

        {/* 3. MARQUEE */}
        <Marquee
          bg="bg-acid-yellow"
          items={[
            "DOORS OPEN LATE",
            "BRING YOUR PACK",
            "NO DRESS CODE — MOVE",
            "RSVP IS A LOVE LANGUAGE",
          ]}
        />

        {/* 4. THE NIGHT */}
        <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-12 md:py-20">
          <p className="font-display text-magenta text-base md:text-lg mb-3">/ THE NIGHT</p>
          <h2 className="font-display text-ink text-4xl md:text-6xl leading-[0.9] mb-8 max-w-4xl">
            WHAT TO LOOK FORWARD TO.
          </h2>
          <p className="text-ink/85 font-medium text-lg md:text-xl leading-relaxed max-w-3xl">
            {event.description ?? event.blurb ?? "Details dropping soon. Stay tuned."}
          </p>
        </section>

        {/* 5. LINEUP — improvement #2: headliner full-width, supports in 3-col grid */}
        {event.lineup && event.lineup.length > 0 && (() => {
          const sorted = [...event.lineup].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
          const headliner = sorted.find((l) => l.role === "headliner") ?? sorted[0];
          if (!headliner) return null;
          const supports = sorted.filter((l) => l !== headliner);
          return (
            <section className="bg-cream border-y-4 border-ink py-12 md:py-20">
              <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
                <p className="font-display text-magenta text-base md:text-lg mb-3">/ LINEUP</p>
                <h2 className="font-display text-ink text-4xl md:text-6xl leading-[0.9] mb-8 max-w-4xl">
                  WHO&apos;S ON.
                </h2>

                {/* Headliner — full-width feature card */}
                <div className="mb-4 md:mb-6">
                  <div className="relative bg-ink text-cream border-4 border-ink chunk-shadow-lg overflow-hidden">
                    {headliner.artist?.photoUrl && (
                      <>
                        <img
                          src={headliner.artist.photoUrl}
                          alt={headliner.artist.name ?? ""}
                          className="absolute inset-0 w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
                      </>
                    )}
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 p-7 md:p-10">
                      <div className="flex-1">
                        <span className="inline-block bg-acid-yellow text-ink font-display text-xs px-3 py-1 border-2 border-ink uppercase tracking-widest mb-4">
                          ★ HEADLINER
                        </span>
                        <h3 className="font-display text-5xl md:text-7xl leading-[0.85] break-words drop-shadow-[4px_4px_0_hsl(var(--magenta))]">
                          {(headliner.artist?.name ?? "TBA").toUpperCase()}
                        </h3>
                        {headliner.note && (
                          <p className="font-display text-acid-yellow text-base tracking-widest mt-3">
                            / {headliner.note}
                          </p>
                        )}
                        {headliner.artist?.bio && (
                          <p className="text-cream/75 font-medium text-base leading-snug mt-3 max-w-xl">
                            {headliner.artist.bio.slice(0, 160)}{headliner.artist.bio.length > 160 ? "…" : ""}
                          </p>
                        )}
                      </div>
                      {headliner.artist?.slug && (
                        <a
                          href={`/artists/${headliner.artist.slug}`}
                          className="shrink-0 self-start md:self-auto bg-acid-yellow text-ink font-display text-base px-5 py-3 border-4 border-cream chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform whitespace-nowrap"
                        >
                          ARTIST PROFILE →
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Support acts — 3-col grid */}
                {supports.length > 0 && (
                  <>
                    <p className="font-display text-ink/50 text-xs tracking-widest mb-3">/ SUPPORT</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {supports.map((l: any, i: number) => (
                        <div key={`${l.artistId}-${i}`}>
                          <EventLineupCard
                            artist={{
                              name: l.artist?.name ?? "TBA",
                              slug: l.artist?.slug ?? null,
                              role: l.role,
                              note: l.note,
                              bio: l.artist?.bio ?? null,
                              photoUrl: l.artist?.photoUrl ?? null,
                              socials: l.artist?.socials as any,
                            }}
                            index={i}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {isUpcoming && event.rsvpEnabled && (
                  <div className="mt-10">
                    <EventDetailClient
                      eventSlug={event.slug}
                      eventTitle={event.title}
                      eventDate={event.startsAt.toISOString()}
                      eventVenue={venueName}
                      isUpcoming={isUpcoming}
                      rsvpEnabled={event.rsvpEnabled}
                      ctaOnly
                    />
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        {/* 6. MEDIA GALLERY */}
        {event.media && (event.media as any[]).length > 0 && (
          <section className="bg-background py-12 md:py-16">
            <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
              <p className="font-display text-magenta text-base md:text-lg mb-3">/ LOOK &amp; FEEL</p>
              <h2 className="font-display text-ink text-4xl md:text-6xl leading-[0.9] mb-2">
                WHAT THE NIGHT LOOKS LIKE.
              </h2>
              <p className="text-ink/70 font-medium text-base md:text-lg mb-8 max-w-2xl">
                Photos and clips from CCD episodes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(event.media as any[]).map((item, i) => (
                  <figure key={i} className="bg-ink border-4 border-ink chunk-shadow">
                    {item.type === "video" ? (
                      <video
                        src={item.url}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full aspect-video object-cover bg-ink"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.caption || `${event.title} photo ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full aspect-video object-cover"
                      />
                    )}
                    {item.caption && (
                      <figcaption className="bg-cream text-ink px-3 py-2 text-sm font-medium border-t-4 border-ink">
                        {item.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. VENUE */}
        <EventVenueCard
          venue={venueName}
          city={event.city}
          address={event.addressLine ?? event.venue?.addressLine}
          capacity={event.capacity ?? event.venue?.capacity}
        />

        {/* 8. RELATED / SERIES */}
        {related.length > 0 && (
          <section className="bg-ink border-y-4 border-ink py-12 md:py-16">
            <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
              <p className="font-display text-acid-yellow text-base md:text-lg mb-2">
                / MORE IN {event.city.toUpperCase()}
              </p>
              <h2 className="font-display text-cream text-3xl md:text-5xl leading-tight mb-6">
                YOU MIGHT ALSO LIKE
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((e: any) => (
                  <Link
                    key={e.slug}
                    href={`/events/${e.slug}`}
                    className="block border-4 border-ink chunk-shadow p-5 bg-acid-yellow text-ink hover:-translate-y-1 hover:translate-x-1 transition-transform"
                  >
                    <p className="font-display text-[10px] tracking-widest mb-2 text-magenta">
                      / {e.status === "past" ? "PAST" : "UPCOMING"}
                    </p>
                    <h3 className="font-display text-2xl leading-none mb-2 break-words">
                      {e.title.toUpperCase()}
                    </h3>
                    <p className="text-sm font-medium opacity-80">
                      {formatDate(e.startsAt)}
                    </p>
                    <p className="text-sm font-medium opacity-60">
                      {e.venueLabel ?? e.venue?.name ?? e.city}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>

      {/* 9. STICKY RSVP BAR — rendered via client island */}
      {isUpcoming && event.rsvpEnabled && (
        <EventDetailClient
          eventSlug={event.slug}
          eventTitle={event.title}
          eventDate={event.startsAt.toISOString()}
          eventVenue={venueName}
          isUpcoming={isUpcoming}
          rsvpEnabled={event.rsvpEnabled}
          stickyOnly
        />
      )}
    </>
  );
}
