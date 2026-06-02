import Link from "next/link";
import type { Event } from "@/lib/db/schema";

type SeriesEvent = Pick<Event, "slug" | "title" | "startsAt" | "status" | "sortOrder"> & {
  seriesLabel?: string | null;
  isFinale?: boolean;
  seriesTagline?: string | null;
};

type Props = {
  events: SeriesEvent[];
  currentSlug?: string;
  seriesLabel: string;
  variant?: "detail" | "banner";
};

export function SeriesStrip({ events, currentSlug, seriesLabel, variant = "detail" }: Props) {
  const siblings = events
    .filter((e) => e.slug !== currentSlug)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .slice(0, 4);

  if (siblings.length === 0) return null;

  if (variant === "banner") {
    return (
      <section className="bg-electric-blue border-y-4 border-ink py-10 md:py-14">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <p className="font-display text-acid-yellow text-base md:text-lg mb-2">/ A SERIES</p>
              <h2 className="font-display text-cream text-4xl md:text-6xl leading-none">
                {seriesLabel}
              </h2>
            </div>
            <Link
              href="/ccdxsocial"
              className="bg-acid-yellow text-ink font-display text-sm md:text-base px-4 py-2 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
            >
              ABOUT THE SERIES →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...events]
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
              .slice(0, 4)
              .map((e) => (
                <SeriesCard key={e.slug} event={e} />
              ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ink border-y-4 border-ink py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <p className="font-display text-acid-yellow text-base md:text-lg mb-2">
          / ALSO IN {seriesLabel.toUpperCase()}
        </p>
        <h2 className="font-display text-cream text-3xl md:text-5xl leading-tight mb-6">
          THE REST OF THE SERIES
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siblings.map((e) => (
            <SeriesCard key={e.slug} event={e} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SeriesCard({ event }: { event: SeriesEvent }) {
  const isFinale = !!(event as any).isFinale;
  const isPast = event.status === "past";
  const dateStr =
    event.startsAt instanceof Date
      ? event.startsAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : String(event.startsAt);

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`relative block border-4 border-ink chunk-shadow p-5 hover:-translate-y-1 hover:translate-x-1 transition-transform ${
        isFinale ? "bg-magenta text-cream" : isPast ? "bg-cream text-ink" : "bg-acid-yellow text-ink"
      }`}
    >
      {isFinale && (
        <span className="absolute -top-3 -right-3 rotate-6 bg-acid-yellow text-ink font-display text-[10px] tracking-widest px-2 py-1 border-4 border-ink">
          ★ FINALE
        </span>
      )}
      <p
        className={`font-display text-[10px] tracking-widest mb-2 ${
          isFinale ? "text-acid-yellow" : "text-magenta"
        }`}
      >
        {isPast ? "/ PAST" : "/ UPCOMING"}
      </p>
      <h3 className="font-display text-2xl md:text-3xl leading-none mb-2 break-words">
        {event.title.toUpperCase()}
      </h3>
      <p className="text-sm font-medium opacity-90 leading-tight">{dateStr}</p>
      {(event as any).seriesTagline && (
        <p
          className={`mt-3 text-[10px] font-display tracking-widest ${
            isFinale ? "text-acid-yellow/80" : "text-ink/60"
          }`}
        >
          {(event as any).seriesTagline}
        </p>
      )}
    </Link>
  );
}
