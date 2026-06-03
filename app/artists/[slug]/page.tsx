/**
 * /artists/[slug] — Artist detail page (Server Component + Client tabs island)
 *
 * Layout:
 *   1. Cover hero  — full-bleed editorial, photo, name, genres, city, socials
 *   2. Sticky tab nav — HOME / GIGS / STATS / BOOK
 *   3. HOME tab    — bio + audio embeds + upcoming gigs snapshot
 *   4. GIGS tab    — full gigography
 *   5. STATS tab   — counters
 *   6. BOOK tab    — inline booking inquiry form
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getArtistBySlug, listArtists } from "@/lib/db/queries";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArtistDetailClient } from "./artist-detail-client";
import type { Socials } from "@/lib/db/schema";

export async function generateStaticParams() {
  try {
    const artists = await listArtists({ limit: 200 });
    return artists.map((a: { slug: string }) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return {};
  return buildMetadata({
    title: `${artist.name} — Cats Can Dance Artist`,
    description:
      artist.bio?.slice(0, 155) ??
      `${artist.name} on Cats Can Dance — ${(artist.genres ?? []).join(", ")}`,
    path: `/artists/${slug}`,
    image: artist.photoUrl ?? undefined,
  });
}

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  const socials = (artist.socials ?? {}) as Socials;

  // Build appearances from lineups join
  const appearances = (artist.lineups ?? [])
    .map((l: any) => ({
      eventId: l.eventId,
      eventTitle: l.event?.title ?? "",
      eventSlug: l.event?.slug ?? "",
      venue: l.event?.venueLabel ?? l.event?.venue?.name ?? "",
      city: l.event?.city ?? "",
      startsAt: l.event?.startsAt ? (l.event.startsAt as Date).toISOString() : null,
      role: l.role,
      note: l.note,
    }))
    .sort((a: { startsAt: string | null }, b: { startsAt: string | null }) => {
      if (!a.startsAt && !b.startsAt) return 0;
      if (!a.startsAt) return 1;
      if (!b.startsAt) return -1;
      return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
    });

  const upcomingGigs = appearances.filter(
    (a: { startsAt: string | null }) => a.startsAt && new Date(a.startsAt) > new Date()
  );

  const audioEmbeds = (artist.audioEmbeds ?? []) as {
    platform: string;
    url: string;
    title?: string;
  }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    description: artist.bio,
    genre: (artist.genres ?? []).join(", "),
    image: artist.photoUrl,
    url: `https://catscandance.com/artists/${slug}`,
    sameAs: [
      socials.instagram ? `https://instagram.com/${socials.instagram.replace("@", "")}` : null,
      (socials as any).soundcloud ?? null,
      (socials as any).spotify ?? null,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-background text-foreground">
        <Nav />

        {/* ── COVER HERO — Improvement #5: editorial split layout ── */}
        {/* Left: photo (sharp, no blur). Right: ink panel with all info. */}
        <section className="border-b-4 border-ink pt-16 md:pt-20 bg-ink overflow-hidden">
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pt-10 md:pt-14">
            <Breadcrumbs
              light
              items={[
                { label: "Home", href: "/" },
                { label: "Artists", href: "/artists" },
                { label: artist.name },
              ]}
            />
          </div>

          <div className="grid md:grid-cols-[0.85fr_1.15fr] min-h-[520px] md:min-h-[600px]">
            {/* LEFT — photo panel */}
            <div className="relative bg-acid-yellow border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-ink overflow-hidden min-h-[320px] md:min-h-0">
              {artist.photoUrl ? (
                <img
                  src={artist.photoUrl}
                  alt={artist.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-acid-yellow">
                  <span className="font-display text-ink/20 text-[12rem] leading-none select-none">♪</span>
                </div>
              )}
              {/* Bottom gradient only on mobile where text overlaps */}
              <div className="md:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
            </div>

            {/* RIGHT — info panel */}
            <div className="relative bg-ink text-cream px-7 md:px-10 py-8 md:py-12 flex flex-col justify-end">
              {/* Eyebrow + verified */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-acid-yellow text-xs uppercase tracking-[0.3em]">
                  / CCD ARTIST PROFILE
                </span>
                {artist.isVerified && (
                  <span className="font-display text-cream/40 text-xs uppercase tracking-widest">
                    ✓ VERIFIED
                  </span>
                )}
              </div>

              {/* Genre + featured chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {artist.isFeatured && (
                  <span className="inline-block bg-acid-yellow text-ink font-display text-xs px-3 py-1 border-2 border-cream">
                    ✦ FEATURED
                  </span>
                )}
                {(artist.genres ?? []).slice(0, 3).map((g: string) => (
                  <span key={g} className="inline-block bg-ink text-cream font-display text-xs px-3 py-1 border-2 border-cream/30">
                    {g.toUpperCase()}
                  </span>
                ))}
              </div>

              {/* Name */}
              <h1 className="font-display text-cream text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] mb-3 drop-shadow-[4px_4px_0_hsl(var(--magenta))]">
                {artist.name.toUpperCase()}
              </h1>

              {/* City */}
              {artist.primaryCity && (
                <p className="font-display text-acid-yellow text-base tracking-widest mb-5">
                  / {artist.primaryCity.toUpperCase()}
                </p>
              )}

              {/* Socials */}
              <div className="flex flex-wrap items-center gap-4">
                {socials.instagram && (
                  <a href={`https://instagram.com/${socials.instagram.replace("@", "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="font-display text-xs text-cream/70 hover:text-acid-yellow transition-colors uppercase tracking-widest">
                    Instagram ↗
                  </a>
                )}
                {socials.soundcloud && (
                  <a href={socials.soundcloud} target="_blank" rel="noopener noreferrer"
                    className="font-display text-xs text-cream/70 hover:text-acid-yellow transition-colors uppercase tracking-widest">
                    SoundCloud ↗
                  </a>
                )}
                {socials.spotify && (
                  <a href={socials.spotify} target="_blank" rel="noopener noreferrer"
                    className="font-display text-xs text-cream/70 hover:text-acid-yellow transition-colors uppercase tracking-widest">
                    Spotify ↗
                  </a>
                )}
                {socials.website && (
                  <a href={socials.website} target="_blank" rel="noopener noreferrer"
                    className="font-display text-xs text-cream/70 hover:text-acid-yellow transition-colors uppercase tracking-widest">
                    Website ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <Marquee
          bg="bg-acid-yellow"
          items={[
            artist.name.toUpperCase(),
            ...(artist.genres ?? []).map((g: string) => g.toUpperCase()),
            artist.primaryCity?.toUpperCase() ?? "INDIA",
            "CCD ARTIST",
          ]}
        />

        {/* ── TABS + CONTENT (client island) ── */}
        <ArtistDetailClient
          artist={{
            id: artist.id,
            slug: artist.slug,
            name: artist.name,
            bio: artist.bio ?? null,
            primaryCity: artist.primaryCity ?? null,
            genres: artist.genres ?? [],
            photoUrl: artist.photoUrl ?? null,
            socials: socials as Record<string, string>,
            isFeatured: artist.isFeatured,
            isVerified: artist.isVerified,
            audioEmbeds,
            milestones: (artist.milestones ?? []) as any[],
            press: (artist.press ?? []) as any[],
            discography: (artist.discography ?? []) as any[],
            socialStats: (artist.socialStats ?? null) as any,
          }}
          appearances={appearances}
          upcomingGigs={upcomingGigs}
        />

        <Footer />
      </main>
    </>
  );
}
