/**
 * Static fallback while <HomeEventsIsland> streams in.
 * Matches the brutalist visual rhythm of the lime section so the layout
 * doesn't shift when the dynamic content arrives.
 */
export function EventsStripSkeleton() {
  return (
    <section className="relative bg-lime py-12 md:py-20 border-b-4 border-ink">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-display text-magenta text-lg md:text-xl mb-2">/ EVENTS</p>
            <h2 className="font-display text-ink text-4xl md:text-6xl leading-[0.85]">
              CATCH
              <br />
              US LIVE
            </h2>
          </div>
        </div>
        <div className="bg-magenta/30 border-4 border-ink chunk-shadow-lg p-6 md:p-10 mb-12 animate-pulse min-h-[280px]" />
      </div>
    </section>
  );
}
