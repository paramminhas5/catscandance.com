/**
 * Sample data for local development. Idempotent — safe to re-run.
 *
 *   npm run db:seed
 */
import { eq } from "drizzle-orm";
import { db } from "./client";
import {
  artists,
  eventLineups,
  events,
  posts,
  promoters,
  siteContent,
  venues,
} from "./schema";

const days = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(21, 0, 0, 0);
  return d;
};

async function upsertVenue(slug: string, data: Partial<typeof venues.$inferInsert>) {
  const [existing] = await db.select().from(venues).where(eq(venues.slug, slug)).limit(1);
  if (existing) return existing;
  const [row] = await db
    .insert(venues)
    .values({ slug, name: data.name ?? slug, city: data.city ?? "Bangalore", ...data })
    .returning();
  return row!;
}

async function upsertArtist(slug: string, data: Partial<typeof artists.$inferInsert>) {
  const [existing] = await db.select().from(artists).where(eq(artists.slug, slug)).limit(1);
  if (existing) return existing;
  const [row] = await db
    .insert(artists)
    .values({ slug, name: data.name ?? slug, ...data })
    .returning();
  return row!;
}

async function upsertPromoter(slug: string, data: Partial<typeof promoters.$inferInsert>) {
  const [existing] = await db.select().from(promoters).where(eq(promoters.slug, slug)).limit(1);
  if (existing) return existing;
  const [row] = await db
    .insert(promoters)
    .values({ slug, name: data.name ?? slug, city: data.city ?? "Bangalore", ...data })
    .returning();
  return row!;
}

async function upsertEvent(slug: string, data: Partial<typeof events.$inferInsert>) {
  const [existing] = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  if (existing) return existing;
  const [row] = await db
    .insert(events)
    .values({
      slug,
      title: data.title ?? slug,
      city: data.city ?? "Bangalore",
      startsAt: data.startsAt ?? days(7),
      ...data,
    })
    .returning();
  return row!;
}

async function main() {
  console.log("→ Seeding venues…");
  const v1 = await upsertVenue("the-warehouse-bangalore", {
    name: "The Warehouse",
    city: "Bangalore",
    capacity: 400,
    description: "An industrial-grade dance floor in HSR. Function-1 sound system, no photos policy.",
    isPartner: true,
  });
  const v2 = await upsertVenue("antisocial-mumbai", {
    name: "antiSOCIAL",
    city: "Mumbai",
    capacity: 350,
    description: "Khar West basement institution.",
    isPartner: true,
  });
  const v3 = await upsertVenue("hilltop-vagator", {
    name: "Hilltop",
    city: "Goa",
    capacity: 1200,
    description: "Open-air, north Goa, sunset-into-sunrise.",
  });

  console.log("→ Seeding promoters…");
  const p1 = await upsertPromoter("ccd-bangalore", {
    name: "Cats Can Dance",
    city: "Bangalore",
    bio: "House parents.",
    isVerified: true,
  });

  console.log("→ Seeding artists…");
  const a1 = await upsertArtist("malfnktion", {
    name: "MALFNKTION",
    primaryCity: "Bangalore",
    cities: ["Bangalore", "Mumbai", "Goa"],
    genres: ["bass", "breaks", "footwork"],
    bio: "Bangalore's bass weight ambassador. Two decades of selecting, producing, mentoring.",
    isFeatured: true,
    isVerified: true,
    socials: { instagram: "https://instagram.com/malfnktion" },
  });
  const a2 = await upsertArtist("kaleekarma", {
    name: "Kaleekarma",
    primaryCity: "Bangalore",
    cities: ["Bangalore"],
    genres: ["techno", "house", "minimal"],
    bio: "Bangalore selector with a taste for the deep end.",
    isFeatured: true,
  });
  const a3 = await upsertArtist("sickflip", {
    name: "Sickflip",
    primaryCity: "Mumbai",
    cities: ["Mumbai", "Bangalore", "Delhi"],
    genres: ["bass", "halftime", "experimental"],
    bio: "India's bass music architect.",
    isFeatured: true,
  });
  const a4 = await upsertArtist("zequenx", {
    name: "Zequenx",
    primaryCity: "Goa",
    cities: ["Goa", "Mumbai"],
    genres: ["techno", "minimal"],
    bio: "Goa-based techno producer.",
  });

  console.log("→ Seeding events…");
  const e1 = await upsertEvent("episode-01-bangalore", {
    title: "EPISODE 01 — BANGALORE",
    blurb: "MALFNKTION × Kaleekarma. Function-1. No photos.",
    description:
      "Our first episode. A 6-hour journey from breaks to bass to techno. RSVP only — venue revealed 24h before.",
    city: "Bangalore",
    venueId: v1.id,
    promoterId: p1.id,
    status: "upcoming",
    source: "own",
    startsAt: days(7),
    endsAt: days(8),
    genres: ["bass", "breaks", "techno"],
    rsvpEnabled: true,
    aiScore: 10,
    sortOrder: 1,
  });
  const e2 = await upsertEvent("episode-02-mumbai", {
    title: "EPISODE 02 — MUMBAI",
    blurb: "Sickflip headlines. Bombay's first proper bass night.",
    city: "Mumbai",
    venueId: v2.id,
    promoterId: p1.id,
    status: "upcoming",
    source: "own",
    startsAt: days(21),
    genres: ["bass", "halftime"],
    aiScore: 9,
    sortOrder: 2,
  });
  const e3 = await upsertEvent("sunset-sessions-goa", {
    title: "SUNSET SESSIONS",
    blurb: "Open-air techno on the cliff.",
    city: "Goa",
    venueId: v3.id,
    status: "upcoming",
    source: "curated",
    startsAt: days(14),
    genres: ["techno", "minimal"],
    aiScore: 8,
    sortOrder: 3,
  });

  console.log("→ Seeding lineups…");
  await db
    .insert(eventLineups)
    .values([
      { eventId: e1.id, artistId: a1.id, role: "headliner", position: 0 },
      { eventId: e1.id, artistId: a2.id, role: "support", position: 1 },
      { eventId: e2.id, artistId: a3.id, role: "headliner", position: 0 },
      { eventId: e3.id, artistId: a4.id, role: "headliner", position: 0 },
    ])
    .onConflictDoNothing();

  console.log("→ Seeding posts…");
  await db
    .insert(posts)
    .values([
      {
        slug: "what-is-cats-can-dance",
        title: "What is Cats Can Dance?",
        excerpt: "An ode to the underground we wish we had growing up.",
        body:
          "# What is Cats Can Dance?\n\nWe're a Bangalore-born culture company building India's underground electronic music platform...",
        status: "published",
        publishedAt: new Date(),
        tags: ["manifesto"],
      },
      {
        slug: "bangalore-underground-2026",
        title: "The state of Bangalore's underground in 2026",
        excerpt: "Function-1 systems, basement nights, and a generation that doesn't film.",
        body: "# Bangalore underground in 2026\n\nA scene report...",
        status: "published",
        publishedAt: new Date(),
        tags: ["scene-report", "bangalore"],
      },
    ])
    .onConflictDoNothing();

  console.log("→ Seeding site content…");
  await db
    .insert(siteContent)
    .values([
      {
        key: "homepage.hero",
        value: {
          eyebrow: "INDIA · UNDERGROUND · SINCE 2024",
          headline: "Cats Can Dance",
          subhead:
            "Underground electronic music, parties, and culture across India. Discover artists, events, and scenes.",
          ctas: [
            { label: "Find a party", href: "/events", variant: "primary" },
            { label: "Discover artists", href: "/artists", variant: "accent" },
            { label: "Explore scenes", href: "/discover", variant: "outline" },
          ],
        },
        description: "Homepage hero section.",
      },
      {
        key: "homepage.marquees",
        value: {
          above_about: {
            variant: "yellow",
            size: "md",
            items: ["WHO WE ARE", "BANGALORE UNDERGROUND", "A CULTURE BRAND", "DANCE · PETS · STREETWEAR"],
          },
          above_events: {
            variant: "pink",
            size: "sm",
            reverse: true,
            items: ["EPISODE 01", "EPISODE 02", "CATCH US LIVE", "BANGALORE", "RSVP NOW"],
          },
        },
        description: "Marquee strips on the homepage.",
      },
    ])
    .onConflictDoNothing();

  console.log("✓ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
