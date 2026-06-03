/**
 * /dashboard — User home page
 * Shows greeting, RSVPs, profile completeness, quick links
 */
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { signups, events } from "@/lib/db/schema";
import { and, eq, like, inArray } from "drizzle-orm";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Footer } from "@/components/site/footer";
import { Calendar, User, Music, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Dashboard — Cats Can Dance",
  description: "Your CCD account dashboard.",
  path: "/dashboard",
});

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null; // layout handles redirect

  const user = session.user;

  // Get user's RSVPs
  const rsvpSignups = await db.query.signups.findMany({
    where: and(
      eq(signups.email, user.email),
      like(signups.tag, "event:%")
    ),
    orderBy: (s, { desc }) => [desc(s.createdAt)],
    limit: 10,
  });

  // Resolve event slugs to event objects
  const eventSlugs = rsvpSignups.map((r) => r.tag.replace("event:", ""));
  const rsvpEvents = eventSlugs.length > 0
    ? await db.query.events.findMany({
        where: inArray(events.slug, eventSlugs),
        with: { venue: true },
      })
    : [];

  const upcomingRsvps = rsvpEvents.filter(
    (e) => e.status === "upcoming" || e.status === "live"
  );

  // Profile completeness
  const userWithExtra = user as typeof user & { city?: string; bio?: string };
  const profileFields = [
    { label: "Name", filled: !!user.name },
    { label: "City", filled: !!(userWithExtra.city) },
    { label: "Bio", filled: !!(userWithExtra.bio) },
  ];
  const completedCount = profileFields.filter((f) => f.filled).length;
  const completenessPercent = Math.round((completedCount / profileFields.length) * 100);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "GOOD MORNING";
    if (h < 17) return "GOOD AFTERNOON";
    if (h < 22) return "GOOD EVENING";
    return "GOOD NIGHT";
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />

      {/* Greeting */}
      <div className="mb-10">
        <p className="font-display text-magenta text-base mb-2">/ WELCOME BACK</p>
        <h1 className="font-display text-ink text-4xl md:text-6xl leading-none">
          {greeting()},<br/>
          <span className="text-magenta">{(user.name ?? user.email).split(" ")[0]?.toUpperCase() ?? "DANCER"}.</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* RSVPs */}
        <div className="md:col-span-2 space-y-4">
          <div className="border-4 border-ink chunk-shadow">
            <div className="bg-magenta border-b-4 border-ink p-4 flex items-center justify-between">
              <p className="font-display text-cream text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Your Upcoming RSVPs
              </p>
              <Link href="/dashboard/rsvps" className="font-display text-xs text-cream/70 hover:text-acid-yellow transition-colors">All →</Link>
            </div>
            {upcomingRsvps.length > 0 ? (
              <div className="divide-y-4 divide-ink">
                {upcomingRsvps.map((e) => (
                  <Link key={e.id} href={`/events/${e.slug}`} className="flex items-center justify-between p-4 bg-cream hover:bg-acid-yellow transition-colors group">
                    <div>
                      <p className="font-display text-ink text-base group-hover:text-magenta transition-colors">{e.title.toUpperCase()}</p>
                      <p className="text-ink/60 text-xs mt-0.5">{formatDate(e.startsAt)} · {e.city}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-magenta transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-cream p-8 text-center">
                <p className="font-display text-ink/50 text-sm mb-3">No upcoming RSVPs yet.</p>
                <Link
                  href="/events"
                  className="inline-block bg-magenta text-cream font-display text-sm px-5 py-2 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
                >
                  BROWSE EVENTS →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile completeness */}
          <div className="border-4 border-ink chunk-shadow">
            <div className="bg-acid-yellow border-b-4 border-ink p-4">
              <p className="font-display text-ink text-base flex items-center gap-2">
                <User className="w-4 h-4" /> Profile
              </p>
            </div>
            <div className="bg-cream p-5">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-display text-ink text-sm">Completeness</p>
                  <p className="font-display text-magenta text-sm">{completenessPercent}%</p>
                </div>
                <div className="h-3 border-2 border-ink bg-cream overflow-hidden">
                  <div
                    className="h-full bg-magenta transition-all"
                    style={{ width: `${completenessPercent}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {profileFields.map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <span className={`w-4 h-4 border-2 border-ink flex items-center justify-center text-xs ${f.filled ? "bg-magenta text-cream" : "bg-cream"}`}>
                      {f.filled ? "✓" : ""}
                    </span>
                    <span className={`font-display text-xs uppercase ${f.filled ? "text-ink" : "text-ink/40"}`}>{f.label}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard/profile"
                className="block text-center bg-ink text-cream font-display text-xs px-4 py-2 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
              >
                EDIT PROFILE →
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="border-4 border-ink chunk-shadow">
            <div className="bg-electric-blue border-b-4 border-ink p-4">
              <p className="font-display text-cream text-base">Quick Links</p>
            </div>
            <div className="divide-y-2 divide-ink/10">
              {[
                { href: "/events", label: "Browse Events", icon: <Calendar className="w-4 h-4" /> },
                { href: "/artists", label: "Discover Artists", icon: <Music className="w-4 h-4" /> },
                { href: "/discover", label: "Explore Scenes", icon: <span className="font-display text-sm">⌖</span> },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 p-3 bg-cream hover:bg-acid-yellow transition-colors group"
                >
                  <span className="text-ink/50 group-hover:text-ink transition-colors">{l.icon}</span>
                  <span className="font-display text-sm text-ink">{l.label}</span>
                  <ArrowRight className="w-3 h-3 text-ink/30 group-hover:text-ink transition-colors ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
