import type { MetadataRoute } from "next";
import { desc, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { artists, events, posts, venues } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/utils";
import { CITIES, GENRES } from "@/lib/scenes";


// Note: with cacheComponents, this is enforced via Cache-Control on the response.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    "/", "/events", "/artists", "/discover", "/blog", "/playlists",
    "/for-artists", "/for-venues", "/for-investors",
    "/cat-studio", "/pets", "/ccdxsocial", "/legal",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1.0 : 0.7,
  }));

  // Programmatic SEO matrix — city scenes + city×genre + global genre.
  const sceneEntries: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: absoluteUrl(`/scenes/${city}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));
  const cityGenreEntries: MetadataRoute.Sitemap = CITIES.flatMap((city) =>
    GENRES.map((genre) => ({
      url: absoluteUrl(`/scenes/${city}/${genre}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );
  const genreEntries: MetadataRoute.Sitemap = GENRES.map((genre) => ({
    url: absoluteUrl(`/sounds/${genre}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Wrap DB calls so a missing DATABASE_URL doesn't break sitemap regen.
  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const [allEvents, allArtists, allPosts, allVenues] = await Promise.all([
      db
        .select({ slug: events.slug, updatedAt: events.updatedAt, startsAt: events.startsAt })
        .from(events)
        .where(eq(events.visibility, "public"))
        .orderBy(desc(events.startsAt)),
      db.select({ slug: artists.slug, updatedAt: artists.updatedAt }).from(artists),
      db
        .select({ slug: posts.slug, updatedAt: posts.updatedAt })
        .from(posts)
        .where(eq(posts.status, "published"))
        .orderBy(desc(posts.publishedAt)),
      db.select({ slug: venues.slug, updatedAt: venues.updatedAt }).from(venues),
    ]);

    dynamicEntries = [
      ...allEvents.map((e) => ({
        url: absoluteUrl(`/events/${e.slug}`),
        lastModified: e.updatedAt,
        changeFrequency: e.startsAt > now ? ("daily" as const) : ("monthly" as const),
        priority: 0.9,
      })),
      ...allArtists.map((a) => ({
        url: absoluteUrl(`/artists/${a.slug}`),
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...allPosts.map((p) => ({
        url: absoluteUrl(`/blog/${p.slug}`),
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...allVenues.map((v) => ({
        url: absoluteUrl(`/venues/${v.slug}`),
        lastModified: v.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch (err) {
    console.warn("[sitemap] DB unavailable, returning static-only sitemap:", err);
  }

  return [...staticEntries, ...sceneEntries, ...cityGenreEntries, ...genreEntries, ...dynamicEntries];
}
