"use client";

import { useState } from "react";
import Link from "next/link";
import { RsvpDialog } from "@/components/site/rsvp-dialog";
import { EventPosterPlaceholder } from "@/components/site/event-poster-placeholder";

type Props = {
  event: {
    slug: string;
    title: string;
    blurb: string;
    startsAt: string;
    city: string;
    venueName: string;
    posterUrl: string | null;
    rsvpEnabled: boolean;
    tags: string[];
  };
};

export function EventsRsvpClient({ event }: Props) {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const dateStr = new Date(event.startsAt).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <article className="bg-magenta text-cream border-4 border-ink chunk-shadow-lg">
        <div className={`grid ${event.posterUrl ? "md:grid-cols-[0.85fr_1.15fr]" : ""}`}>
          {/* Poster */}
          {event.posterUrl ? (
            <div className="relative bg-ink border-b-4 md:border-b-0 md:border-r-4 border-ink overflow-hidden min-h-[280px]">
              <img
                src={event.posterUrl}
                alt={`${event.title} poster`}
                loading="eager"
                className="w-full h-full object-cover aspect-[3/4] md:aspect-auto"
              />
            </div>
          ) : (
            <div className="border-b-4 md:border-b-0 md:border-r-4 border-ink">
              <EventPosterPlaceholder
                title={event.title}
                date={dateStr}
                city={event.city}
              />
            </div>
          )}

          {/* Info */}
          <div className="p-7 md:p-10 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags?.includes("pet-friendly") && (
                <span className="text-[10px] font-bold px-2 py-1 border-2 border-cream uppercase tracking-widest bg-electric-blue text-cream">
                  🐾 PET-FRIENDLY
                </span>
              )}
              {event.rsvpEnabled && (
                <span className="text-[10px] font-bold px-2 py-1 border-2 border-acid-yellow uppercase tracking-widest bg-acid-yellow text-ink">
                  ▶ RSVP OPEN
                </span>
              )}
            </div>

            <h3 className="font-display text-5xl md:text-7xl leading-[0.85] mb-5 break-words drop-shadow-[4px_4px_0_hsl(var(--ink))]">
              {event.title.toUpperCase()}
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: "DATE", value: dateStr },
                { label: "VENUE", value: event.venueName },
                { label: "CITY", value: event.city },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-display text-acid-yellow text-xs tracking-widest mb-1">
                    / {label}
                  </p>
                  <p className="font-display text-lg md:text-xl leading-tight break-words">{value}</p>
                </div>
              ))}
            </div>

            {event.blurb && (
              <p className="text-cream/85 font-medium text-base md:text-lg leading-relaxed mb-6 max-w-xl">
                {event.blurb}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {event.rsvpEnabled && (
                <button
                  type="button"
                  onClick={() => setRsvpOpen(true)}
                  className="bg-acid-yellow text-ink font-display text-lg md:text-xl px-7 py-4 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
                >
                  RSVP NOW →
                </button>
              )}
              <Link
                href={`/events/${event.slug}`}
                className="bg-cream text-ink font-display text-lg md:text-xl px-7 py-4 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform text-center"
              >
                VIEW DETAILS
              </Link>
            </div>
          </div>
        </div>
      </article>

      <RsvpDialog
        open={rsvpOpen}
        onOpenChange={setRsvpOpen}
        eventSlug={event.slug}
        eventTitle={`Cats Can Dance — ${event.title}`}
        eventDate={event.startsAt}
        eventVenue={event.venueName}
      />
    </>
  );
}
