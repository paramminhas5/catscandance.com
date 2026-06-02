/**
 * /artists — Artists listing page
 *
 * Server Component that pre-fetches all artists.
 * Client island handles search, filter, sort interactivity.
 *
 * Sections:
 *  1. PageHero
 *  2. Marquee
 *  3. Filter bar + artist grid (client)
 *  4. "Are you an artist?" CTA
 */

import { buildMetadata } from "@/lib/seo";
import { listArtists } from "@/lib/db/queries";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { ArtistsClient } from "./artists-client";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Artists — Cats Can Dance | India's Electronic Music Directory",
  description:
    "Discover India's top electronic music artists. Browse DJs, producers, and live acts from Bangalore, Mumbai, Delhi and beyond.",
  path: "/artists",
});

export default async function ArtistsPage() {
  // Fetch all artists server-side (up to 200) — client filters in memory
  const artists = await listArtists({ limit: 200 });

  const serialised = artists.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    primaryCity: a.primaryCity ?? "",
    genres: a.genres ?? [],
    bio: a.bio ?? "",
    photoUrl: a.photoUrl ?? null,
    isFeatured: a.isFeatured,
    isVerified: a.isVerified,
    socials: a.socials as Record<string, string> | null,
  }));

  return (
    <main className="bg-background text-foreground">
      <Nav />

      {/* 1. HERO */}
      <PageHero
        eyebrow="ARTISTS"
        title={
          <>
            THE
            <br />
            ROSTER.
          </>
        }
        bg="bg-electric-blue"
        textColor="text-cream"
        eyebrowColor="text-acid-yellow"
        shadowColor="hsl(var(--ink))"
      />

      {/* 2. MARQUEE */}
      <Marquee
        bg="bg-ink"
        items={[
          "DJS · PRODUCERS · LIVE ACTS",
          "BANGALORE · MUMBAI · DELHI · GOA",
          "HOUSE · TECHNO · JUNGLE · GARAGE",
          "BOOK AN ARTIST",
        ]}
      />

      {/* 3. FILTER + GRID (client) */}
      <ArtistsClient artists={serialised} />

      <Footer />
    </main>
  );
}
