/**
 * /admin — Dashboard with live stats
 * UX improvement: Color-coded stat cards with large font-display numbers for instant scanning
 */
import { buildMetadata } from "@/lib/seo";
import { db } from "@/lib/db/client";
import { events, artists, signups, user, bookings } from "@/lib/db/schema";
import { eq, like, sql, desc } from "drizzle-orm";

export const metadata = buildMetadata({
  title: "Admin — Cats Can Dance",
  description: "CCD admin dashboard.",
  path: "/admin",
  noIndex: true,
});

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminDashboard() {
  // Live counts
  const [
    upcomingRows,
    artistRows,
    signupRows,
    userRows,
    bookingRows,
    recentRsvps,
    recentBookings,
  ] = await Promise.all([
    db.select({ upcomingCount: sql<number>`count(*)::int` }).from(events)
      .where(sql`${events.status} IN ('upcoming','live')`),
    db.select({ artistCount: sql<number>`count(*)::int` }).from(artists),
    db.select({ signupCount: sql<number>`count(*)::int` }).from(signups)
      .where(like(signups.tag, "event:%")),
    db.select({ userCount: sql<number>`count(*)::int` }).from(user),
    db.select({ bookingCount: sql<number>`count(*)::int` }).from(bookings),
    db.query.signups.findMany({
      orderBy: [desc(signups.createdAt)],
      limit: 10,
    }),
    db.query.bookings.findMany({
      orderBy: [desc(bookings.createdAt)],
      limit: 5,
      with: { artist: true },
    }),
  ]);

  const upcomingCount = upcomingRows[0]?.upcomingCount ?? 0;
  const artistCount = artistRows[0]?.artistCount ?? 0;
  const signupCount = signupRows[0]?.signupCount ?? 0;
  const userCount = userRows[0]?.userCount ?? 0;
  const bookingCount = bookingRows[0]?.bookingCount ?? 0;

  const STATS = [
    { label: "Upcoming Events", value: upcomingCount, bg: "bg-electric-blue", text: "text-cream" },
    { label: "Artists", value: artistCount, bg: "bg-orange", text: "text-ink" },
    { label: "RSVPs", value: signupCount, bg: "bg-magenta", text: "text-cream" },
    { label: "Users", value: userCount, bg: "bg-acid-yellow", text: "text-ink" },
    { label: "Bookings", value: bookingCount, bg: "bg-cream", text: "text-ink" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-display text-acid-yellow text-base mb-2">/ OVERVIEW</p>
        <h1 className="font-display text-cream text-4xl md:text-6xl leading-none">ADMIN DASHBOARD</h1>
      </div>

      {/* Live stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className={`border-4 border-acid-yellow chunk-shadow p-5 ${s.bg}`}>
            <p className={`font-display text-5xl md:text-6xl leading-none mb-1 ${s.text}`}>{s.value}</p>
            <p className={`font-display text-xs uppercase tracking-widest ${s.text} opacity-60`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent RSVPs */}
        <div className="border-4 border-acid-yellow/20 overflow-hidden">
          <div className="bg-magenta border-b-4 border-acid-yellow/20 p-4">
            <p className="font-display text-cream text-base">Recent RSVPs (last 10)</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b-4 border-acid-yellow/10">
                <th className="text-left px-4 py-2 font-display text-xs text-cream/50 uppercase tracking-widest">Email</th>
                <th className="text-left px-4 py-2 font-display text-xs text-cream/50 uppercase tracking-widest">Event</th>
                <th className="text-left px-4 py-2 font-display text-xs text-cream/50 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRsvps.map((r) => (
                <tr key={r.id} className="border-b border-acid-yellow/5 hover:bg-cream/5 transition-colors">
                  <td className="px-4 py-2 text-xs text-cream/80 font-medium truncate max-w-[150px]">{r.email}</td>
                  <td className="px-4 py-2 font-display text-xs text-acid-yellow/80">{r.tag.replace("event:", "")}</td>
                  <td className="px-4 py-2 text-xs text-cream/40">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent bookings */}
        <div className="border-4 border-acid-yellow/20 overflow-hidden">
          <div className="bg-electric-blue border-b-4 border-acid-yellow/20 p-4">
            <p className="font-display text-cream text-base">Recent Bookings (last 5)</p>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-display text-cream/30 text-sm">No bookings yet.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-acid-yellow/10">
                  <th className="text-left px-4 py-2 font-display text-xs text-cream/50 uppercase tracking-widest">Artist</th>
                  <th className="text-left px-4 py-2 font-display text-xs text-cream/50 uppercase tracking-widest">From</th>
                  <th className="text-left px-4 py-2 font-display text-xs text-cream/50 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-acid-yellow/5 hover:bg-cream/5 transition-colors">
                    <td className="px-4 py-2 font-display text-xs text-acid-yellow/80">{b.artist?.name ?? "—"}</td>
                    <td className="px-4 py-2 text-xs text-cream/80 truncate max-w-[120px]">{b.requesterEmail}</td>
                    <td className="px-4 py-2">
                      <span className="font-display text-[10px] uppercase px-2 py-0.5 border border-acid-yellow/40 text-acid-yellow/60">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-3">
        {[
          { href: "/admin/events", label: "Manage Events →" },
          { href: "/admin/artists", label: "Manage Artists →" },
          { href: "/events", label: "View Site →" },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="font-display text-sm bg-acid-yellow text-ink px-5 py-3 border-4 border-acid-yellow chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
