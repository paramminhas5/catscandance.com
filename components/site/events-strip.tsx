"use client";
/**
 * EventsStrip — direct port of CCD v1's <Events> homepage section.
 *
 * Differences from v1:
 *   - Data fed in from the RSC parent (no client-side Supabase fetch)
 *   - RSVP dialog stub for now (full port in Pass 2)
 */
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export type EventStripItem = {
  slug: string;
  title: string;
  date: string;
  city: string;
  venue: string;
  blurb: string | null;
  posterUrl: string | null;
  status: "upcoming" | "past" | "live" | "draft" | "cancelled";
  seriesLabel?: string | null;
  petFriendly?: boolean;
};

export function EventsStrip({ events }: { events: EventStripItem[] }) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const upcoming = events.filter((e) => e.status === "upcoming" || e.status === "live");
  const past = events.filter((e) => e.status === "past");
  const nextUp = upcoming[0] ?? events[0];

  return (
    <section
      id="events"
      className="relative bg-lime py-12 md:py-20 border-b-4 border-ink overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-display text-magenta text-lg md:text-xl mb-2">/ EVENTS</p>
            <h2 className="font-display text-ink text-4xl md:text-6xl leading-[0.85]">
              CATCH
              <br />
              US LIVE
            </h2>
          </div>
          <Link
            href="/events"
            className="font-display text-ink text-base underline decoration-4 decoration-magenta underline-offset-4 hover:text-magenta transition"
          >
            All events →
          </Link>
        </div>

        {nextUp ? (
          <motion.article
            initial={{ opacity: 0, y: 60, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="bg-magenta text-cream border-4 border-ink chunk-shadow-lg p-6 md:p-10 mb-12"
          >
            <div className={`flex flex-col ${nextUp.posterUrl ? "md:flex-row" : ""} gap-6 md:gap-10`}>
              {nextUp.posterUrl ? (
                <div className="md:w-[40%] shrink-0">
                  <div className="aspect-[3/4] bg-ink border-4 border-ink overflow-hidden chunk-shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={nextUp.posterUrl}
                      alt={`${nextUp.title} poster`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-acid-yellow text-ink text-xs font-bold px-3 py-1 border-2 border-ink uppercase">
                    ▶ NEXT UP
                  </span>
                  {nextUp.seriesLabel ? (
                    <span className="bg-cream/20 text-cream text-xs font-bold px-3 py-1 border-2 border-cream/30 uppercase">
                      {nextUp.seriesLabel}
                    </span>
                  ) : null}
                  {nextUp.petFriendly ? (
                    <span className="bg-electric-blue text-cream text-xs font-bold px-3 py-1 border-2 border-cream/30 uppercase">
                      🐾 PETS WELCOME
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display text-4xl md:text-6xl mb-4 leading-[0.9]">
                  {nextUp.title.toUpperCase()}
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 my-4">
                  <div>
                    <p className="font-display text-acid-yellow text-sm mb-1">/ DATE</p>
                    <p className="font-display text-xl">{nextUp.date}</p>
                  </div>
                  <div>
                    <p className="font-display text-acid-yellow text-sm mb-1">/ CITY</p>
                    <p className="font-display text-xl">{nextUp.city}</p>
                  </div>
                  <div>
                    <p className="font-display text-acid-yellow text-sm mb-1">/ VENUE</p>
                    <p className="font-display text-xl">{nextUp.venue}</p>
                  </div>
                </div>
                {nextUp.blurb ? (
                  <p className="text-cream/90 text-base md:text-lg max-w-2xl mb-6 font-medium">
                    {nextUp.blurb}
                  </p>
                ) : null}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setRsvpOpen(true)}
                    className="bg-acid-yellow text-ink font-display text-xl px-8 py-4 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
                  >
                    RSVP NOW →
                  </button>
                  <Link
                    href={`/events/${nextUp.slug}`}
                    className="bg-cream text-ink font-display text-xl px-8 py-4 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform text-center"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        ) : null}

        {past.length > 0 ? (
          <div className="mt-6">
            <p className="font-display text-ink text-xl mb-4">/ PAST EPISODES</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map((e) => (
                <Link
                  key={e.slug}
                  href={`/events/${e.slug}`}
                  className="bg-cream border-4 border-ink chunk-shadow overflow-hidden hover:-translate-y-1 hover:translate-x-1 transition-transform block"
                >
                  <div className="relative aspect-video bg-ink border-b-4 border-ink overflow-hidden">
                    {e.posterUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.posterUrl}
                        alt={`${e.title} poster`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-lime text-ink font-display text-3xl">
                        ★ {e.title}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="bg-ink text-cream text-xs font-bold px-2 py-1 inline-block mb-2">
                      {e.title}
                    </span>
                    <p className="font-display text-2xl text-magenta">{e.city}</p>
                    <p className="text-ink/70 font-medium text-sm">
                      {e.venue} · {e.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* RSVP dialog stub — Pass 2 ports the full <RsvpDialog> with Server Action. */}
      {rsvpOpen ? (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-[100] bg-ink/80 grid place-items-center px-4"
          onClick={() => setRsvpOpen(false)}
        >
          <div
            className="bg-cream border-4 border-ink chunk-shadow-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl mb-2">RSVP coming soon</h3>
            <p className="text-ink/70 mb-4 text-sm">
              Full RSVP flow ships in Pass 2. For now,{" "}
              <a className="underline" href="mailto:hi@catscandance.com">
                email us
              </a>
              .
            </p>
            <button
              onClick={() => setRsvpOpen(false)}
              className="bg-ink text-cream font-display px-4 py-2 border-4 border-ink"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
