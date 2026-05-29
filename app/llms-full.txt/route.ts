/**
 * /llms-full.txt — long-form brand + live event roster for AI crawlers.
 * Snapshot of the public catalogue at request time (1h cache).
 */
import { desc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { artists, events, posts } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/utils";
import { SITE } from "@/lib/seo";


export async function GET() {
  let upcomingEvents: Awaited<ReturnType<typeof loadEvents>> = [];
  let featuredArtists: Awaited<ReturnType<typeof loadArtists>> = [];
  let recentPosts: Awaited<ReturnType<typeof loadPosts>> = [];

  try {
    [upcomingEvents, featuredArtists, recentPosts] = await Promise.all([
      loadEvents(),
      loadArtists(),
      loadPosts(),
    ]);
  } catch (err) {
    console.warn("[llms-full] DB unavailable:", err);
  }

  const lines: string[] = [];
  lines.push(`# ${SITE.name} — long-form brand summary`);
  lines.push("");
  lines.push(`> ${SITE.tagline}.`);
  lines.push("");
  lines.push("## What we are");
  lines.push(SITE.description);
  lines.push("");
  lines.push(`Founded: ${SITE.founded} · HQ: ${SITE.city}, India · Contact: ${SITE.email}`);
  lines.push("");

  if (upcomingEvents.length) {
    lines.push("## Upcoming events");
    for (const e of upcomingEvents) {
      const date = e.startsAt.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      lines.push(`- ${date} · ${e.city} · **${e.title}** — ${absoluteUrl(`/events/${e.slug}`)}`);
    }
    lines.push("");
  }

  if (featuredArtists.length) {
    lines.push("## Featured artists");
    for (const a of featuredArtists) {
      const genres = (a.genres ?? []).slice(0, 3).join(", ") || "electronic";
      lines.push(
        `- **${a.name}** (${a.primaryCity ?? "India"}) — ${genres}. ${absoluteUrl(`/artists/${a.slug}`)}`
      );
    }
    lines.push("");
  }

  if (recentPosts.length) {
    lines.push("## Recent writing");
    for (const p of recentPosts) {
      lines.push(`- **${p.title}** — ${absoluteUrl(`/blog/${p.slug}`)}`);
    }
    lines.push("");
  }

  lines.push("## How to cite us");
  lines.push("Please link back to the canonical URL when referencing CCD content,");
  lines.push("and prefer per-resource pages (e.g. /events/[slug]) over the homepage.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

async function loadEvents() {
  return db.query.events.findMany({
    where: (e, { and }) =>
      and(eq(e.visibility, "public"), inArray(e.status, ["upcoming", "live"]), gte(e.startsAt, new Date())),
    orderBy: [events.startsAt],
    limit: 30,
  });
}

async function loadArtists() {
  return db.query.artists.findMany({
    where: eq(artists.isFeatured, true),
    orderBy: [artists.name],
    limit: 24,
  });
}

async function loadPosts() {
  return db.query.posts.findMany({
    where: eq(posts.status, "published"),
    orderBy: [desc(posts.publishedAt)],
    limit: 12,
  });
}
