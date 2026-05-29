/**
 * Reusable Drizzle queries used by RSC pages.
 * Keep them small and composable — each one renders directly inside a Server
 * Component, no DTO mapping, no fetch layer.
 */
import { and, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "./client";
import { artists, eventLineups, events, posts, promoters, venues } from "./schema";

// ── Events ───────────────────────────────────────────────────────────────────

export type EventListFilters = {
  city?: string;
  genre?: string;
  from?: Date;
  to?: Date;
  limit?: number;
  cursor?: string; // last id seen (for pagination)
};

export async function listUpcomingEvents(filters: EventListFilters = {}) {
  const { city, genre, from = new Date(), to, limit = 24 } = filters;

  return db.query.events.findMany({
    where: and(
      eq(events.visibility, "public"),
      inArray(events.status, ["upcoming", "live"]),
      gte(events.startsAt, from),
      to ? lte(events.startsAt, to) : undefined,
      city ? eq(events.city, city) : undefined,
      genre ? sql`${events.genres} @> ARRAY[${genre}]::text[]` : undefined
    ),
    orderBy: [events.startsAt, desc(events.aiScore)],
    limit,
    with: {
      venue: true,
      promoter: true,
      lineup: { with: { artist: true }, orderBy: [eventLineups.position] },
    },
  });
}

export async function getEventBySlug(slug: string) {
  return db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: {
      venue: true,
      promoter: true,
      lineup: { with: { artist: true }, orderBy: [eventLineups.position] },
    },
  });
}

export async function getRelatedEvents(eventId: string, city: string, genres: string[], limit = 4) {
  return db.query.events.findMany({
    where: and(
      eq(events.visibility, "public"),
      eq(events.status, "upcoming"),
      or(
        eq(events.city, city),
        genres.length ? sql`${events.genres} && ARRAY[${sql.join(genres, sql`, `)}]::text[]` : undefined
      ),
      sql`${events.id} != ${eventId}`
    ),
    orderBy: [events.startsAt],
    limit,
    with: { venue: true },
  });
}

// ── Artists ─────────────────────────────────────────────────────────────────

export type ArtistListFilters = {
  city?: string;
  genre?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
};

export async function listArtists(filters: ArtistListFilters = {}) {
  const { city, genre, search, featured, limit = 48 } = filters;

  return db.query.artists.findMany({
    where: and(
      city ? eq(artists.primaryCity, city) : undefined,
      genre ? sql`${artists.genres} @> ARRAY[${genre}]::text[]` : undefined,
      featured ? eq(artists.isFeatured, true) : undefined,
      search ? or(ilike(artists.name, `%${search}%`), ilike(artists.bio, `%${search}%`)) : undefined
    ),
    orderBy: [desc(artists.isFeatured), artists.name],
    limit,
  });
}

export async function getArtistBySlug(slug: string) {
  return db.query.artists.findFirst({
    where: eq(artists.slug, slug),
    with: {
      lineups: { with: { event: { with: { venue: true } } } },
    },
  });
}

// ── Posts (blog) ────────────────────────────────────────────────────────────

export async function listPublishedPosts(limit = 24) {
  return db.query.posts.findMany({
    where: eq(posts.status, "published"),
    orderBy: [desc(posts.publishedAt)],
    limit,
  });
}

export async function getPostBySlug(slug: string) {
  return db.query.posts.findFirst({ where: eq(posts.slug, slug) });
}

// ── Discover (full-text) ────────────────────────────────────────────────────

export async function search(query: string, limit = 20) {
  if (!query.trim()) return { events: [], artists: [], venues: [] };
  const pattern = `%${query}%`;
  const [foundEvents, foundArtists, foundVenues] = await Promise.all([
    db.query.events.findMany({
      where: and(
        eq(events.visibility, "public"),
        or(ilike(events.title, pattern), ilike(events.blurb, pattern), ilike(events.description, pattern))
      ),
      limit,
    }),
    db.query.artists.findMany({
      where: or(ilike(artists.name, pattern), ilike(artists.bio, pattern)),
      limit,
    }),
    db.query.venues.findMany({
      where: or(ilike(venues.name, pattern), ilike(venues.city, pattern)),
      limit,
    }),
  ]);
  return { events: foundEvents, artists: foundArtists, venues: foundVenues };
}

// ── Scenes (city × genre) ───────────────────────────────────────────────────

export async function getSceneData(city: string, genre?: string) {
  const [eventsList, artistsList, promotersList] = await Promise.all([
    db.query.events.findMany({
      where: and(
        eq(events.visibility, "public"),
        eq(events.city, city),
        inArray(events.status, ["upcoming", "live"]),
        genre ? sql`${events.genres} @> ARRAY[${genre}]::text[]` : undefined
      ),
      orderBy: [events.startsAt],
      with: { venue: true },
      limit: 12,
    }),
    db.query.artists.findMany({
      where: and(
        eq(artists.primaryCity, city),
        genre ? sql`${artists.genres} @> ARRAY[${genre}]::text[]` : undefined
      ),
      orderBy: [desc(artists.isFeatured)],
      limit: 12,
    }),
    db.query.promoters.findMany({
      where: eq(promoters.city, city),
      limit: 8,
    }),
  ]);
  return { events: eventsList, artists: artistsList, promoters: promotersList };
}
