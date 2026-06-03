/**
 * /admin/events — Event management table
 */
import { buildMetadata } from "@/lib/seo";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { EventStatusToggle } from "./event-status-toggle";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Events Admin — Cats Can Dance",
  description: "Manage CCD events.",
  path: "/admin/events",
  noIndex: true,
});

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-electric-blue text-cream",
  live: "bg-magenta text-cream",
  past: "bg-cream/20 text-cream/60",
  draft: "bg-acid-yellow text-ink",
  cancelled: "bg-red-900/50 text-red-300",
};

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminEventsPage() {
  const allEvents = await db.query.events.findMany({
    orderBy: [desc(events.startsAt)],
    with: { venue: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-acid-yellow text-base mb-2">/ ADMIN</p>
          <h1 className="font-display text-cream text-3xl md:text-5xl leading-none">EVENTS</h1>
        </div>
        <a
          href="#"
          className="font-display text-sm bg-acid-yellow text-ink px-5 py-3 border-4 border-acid-yellow chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
        >
          + CREATE EVENT
        </a>
      </div>

      <div className="border-4 border-acid-yellow/20 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b-4 border-acid-yellow/20 bg-ink/50">
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Title</th>
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Date</th>
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">City</th>
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Venue</th>
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Status</th>
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">RSVPs</th>
              <th className="px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allEvents.map((e) => (
              <tr key={e.id} className="border-b border-acid-yellow/5 hover:bg-cream/5 transition-colors">
                <td className="px-4 py-3">
                  <a href={`/events/${e.slug}`} className="font-display text-sm text-cream hover:text-acid-yellow transition-colors" target="_blank" rel="noopener">
                    {e.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-xs text-cream/60">{formatDate(e.startsAt)}</td>
                <td className="px-4 py-3 text-xs text-cream/60">{e.city}</td>
                <td className="px-4 py-3 text-xs text-cream/60">{e.venueLabel ?? e.venue?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`font-display text-[10px] uppercase px-2 py-0.5 border border-current/40 ${STATUS_COLORS[e.status] ?? "text-cream/50"}`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-cream/60 text-center">{e.rsvpCount}</td>
                <td className="px-4 py-3">
                  <EventStatusToggle eventId={e.id} currentStatus={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allEvents.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-display text-cream/30 text-lg">No events yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
