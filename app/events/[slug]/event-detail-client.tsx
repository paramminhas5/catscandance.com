"use client";

import { useState } from "react";
import { RsvpDialog } from "@/components/site/rsvp-dialog";
import { EventCountdown } from "@/components/site/event-countdown";
import { StickyRsvpBar } from "@/components/site/sticky-rsvp-bar";

type Props = {
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  isUpcoming: boolean;
  rsvpEnabled: boolean;
  /** Render mode flags — only one should be true at a time (except default) */
  countdownOnly?: boolean;
  ctaOnly?: boolean;
  stickyOnly?: boolean;
};

export function EventDetailClient({
  eventSlug,
  eventTitle,
  eventDate,
  eventVenue,
  isUpcoming,
  rsvpEnabled,
  countdownOnly,
  ctaOnly,
  stickyOnly,
}: Props) {
  const [open, setOpen] = useState(false);

  const dateLabel = new Date(eventDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Countdown strip
  if (countdownOnly) {
    return <EventCountdown startsAt={eventDate} />;
  }

  // Just the CTA button (after lineup section)
  if (ctaOnly) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-magenta text-cream font-display text-lg md:text-xl px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
        >
          RSVP NOW →
        </button>
        <RsvpDialog
          open={open}
          onOpenChange={setOpen}
          eventSlug={eventSlug}
          eventTitle={`Cats Can Dance — ${eventTitle}`}
          eventDate={eventDate}
          eventVenue={eventVenue}
        />
      </>
    );
  }

  // Sticky mobile bar
  if (stickyOnly) {
    return (
      <>
        <StickyRsvpBar
          label="RSVP NOW →"
          meta={`${dateLabel} · Free RSVP`}
          onClick={() => setOpen(true)}
        />
        <RsvpDialog
          open={open}
          onOpenChange={setOpen}
          eventSlug={eventSlug}
          eventTitle={`Cats Can Dance — ${eventTitle}`}
          eventDate={eventDate}
          eventVenue={eventVenue}
        />
      </>
    );
  }

  // Default: RSVP + Share buttons (hero section)
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {isUpcoming && rsvpEnabled && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-acid-yellow text-ink font-display text-lg md:text-xl px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
          >
            RSVP NOW →
          </button>
        )}
        <button
          type="button"
          onClick={async () => {
            const url = `${window.location.origin}/events/${eventSlug}`;
            if (typeof navigator.share === "function") {
              try {
                await navigator.share({ title: `Cats Can Dance — ${eventTitle}`, url });
                return;
              } catch { /* user cancel */ }
            }
            try {
              await navigator.clipboard.writeText(url);
            } catch { /* ignore */ }
          }}
          className={`inline-flex items-center gap-2 font-display px-4 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform ${
            isUpcoming ? "bg-cream text-ink" : "bg-ink text-cream"
          }`}
          aria-label="Share event"
        >
          ↗ SHARE
        </button>
      </div>

      <RsvpDialog
        open={open}
        onOpenChange={setOpen}
        eventSlug={eventSlug}
        eventTitle={`Cats Can Dance — ${eventTitle}`}
        eventDate={eventDate}
        eventVenue={eventVenue}
      />
    </>
  );
}
