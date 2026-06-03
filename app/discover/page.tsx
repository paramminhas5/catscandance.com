/**
 * /discover — Hub page
 * UX improvement: Color-coded asymmetric city mosaic with live event counts,
 * full-screen search overlay with grouped results, and artist carousel.
 */
import Link from "next/link";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { listArtists } from "@/lib/db/queries";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SearchClient } from "./search-client";
import { Music, MapPin, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Discover — Cats Can Dance | Indian Electronic Music Scenes",
  description:
    "Explore India's underground electronic music scenes, genres, and artists. Find events in Bengaluru, Mumbai, Delhi, Goa and beyond.",
  path: "/discover",
});

// ── City data (India) ────────────────────────────────────────────────────────
const INDIA_CITIES = [
  {
    slug: "bangalore",
    label: "Bengaluru",
    tagline: "The underground's home base",
    bg: "bg-magenta",
    text: "text-cream",
    span: "md:col-span-2",
    activeGenres: ["House", "Disco", "Garage"],
  },
  {
    slug: "bombay",
    label: "Mumbai",
    tagline: "Bollywood meets bass",
    bg: "bg-electric-blue",
    text: "text-cream",
    span: "",
    activeGenres: ["Techno", "House", "Jungle"],
  },
  {
    slug: "delhi",
    label: "Delhi",
    tagline: "Techno capital",
    bg: "bg-acid-yellow",
    text: "text-ink",
    span: "",
    activeGenres: ["Techno", "Industrial", "Bass"],
  },
  {
    slug: "goa",
    label: "Goa",
    tagline: "Where it all began",
    bg: "bg-orange",
    text: "text-ink",
    span: "",
    activeGenres: ["Trance", "Ambient", "Psych"],
  },
  {
    slug: "hyderabad",
    label: "Hyderabad",
    tagline: "Rising wave",
    bg: "bg-cream",
    text: "text-ink",
    span: "",
    activeGenres: ["House", "Techno", "D&B"],
  },
  {
    slug: "pune",
    label: "Pune",
    tagline: "College town, serious sound",
    bg: "bg-ink",
    text: "text-cream",
    span: "",
    activeGenres: ["House", "Breaks", "Ambient"],
  },
] as const;

// ── Global origin scenes ─────────────────────────────────────────────────────
const GLOBAL_SCENES = [
  {
    slug: "detroit-techno",
    name: "Detroit Techno",
    city: "Detroit, USA",
    decade: "1980s",
    bpm: "130–150",
    tagline: "Born from the factory floor — stark, mechanical, spiritual.",
    bg: "bg-ink",
    text: "text-cream",
  },
  {
    slug: "chicago-house",
    name: "Chicago House",
    city: "Chicago, USA",
    decade: "1980s",
    bpm: "118–130",
    tagline: "Disco didn't die, it went underground and found its soul.",
    bg: "bg-electric-blue",
    text: "text-cream",
  },
  {
    slug: "london-jungle",
    name: "London Jungle",
    city: "London, UK",
    decade: "1990s",
    bpm: "160–180",
    tagline: "Rave culture collides with soundsystem — pure velocity.",
    bg: "bg-acid-yellow",
    text: "text-ink",
  },
  {
    slug: "berlin-techno",
    name: "Berlin Techno",
    city: "Berlin, Germany",
    decade: "1990s",
    bpm: "135–145",
    tagline: "Post-wall freedom made into sound. All night. Every night.",
    bg: "bg-magenta",
    text: "text-cream",
  },
  {
    slug: "goa-trance",
    name: "Goa Trance",
    city: "Goa, India",
    decade: "1990s",
    bpm: "135–145",
    tagline: "India's first contribution to the global rave circuit.",
    bg: "bg-orange",
    text: "text-ink",
  },
] as const;

// ── Genre pills ──────────────────────────────────────────────────────────────
const GENRES = [
  { slug: "house", label: "House", bg: "bg-electric-blue", text: "text-cream" },
  { slug: "techno", label: "Techno", bg: "bg-ink", text: "text-cream" },
  { slug: "dnb", label: "Jungle / D&B", bg: "bg-acid-yellow", text: "text-ink" },
  { slug: "garage", label: "UK Garage", bg: "bg-magenta", text: "text-cream" },
  { slug: "disco", label: "Disco", bg: "bg-orange", text: "text-ink" },
  { slug: "bass", label: "Bass", bg: "bg-cream", text: "text-ink" },
  { slug: "breaks", label: "Breaks", bg: "bg-magenta", text: "text-cream" },
  { slug: "ambient", label: "Ambient", bg: "bg-electric-blue", text: "text-cream" },
  { slug: "downtempo", label: "Downtempo", bg: "bg-ink", text: "text-cream" },
] as const;

async function FeaturedArtists() {
  const artists = await listArtists({ featured: true, limit: 4 });
  if (!artists.length) return null;
  return (
    <section className="bg-cream border-y-4 border-ink py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-display text-magenta text-base mb-2">/ FEATURED ARTISTS</p>
            <h2 className="font-display text-ink text-4xl md:text-5xl leading-none">THE ONES TO KNOW.</h2>
          </div>
          <Link
            href="/artists"
            className="hidden md:inline-block bg-ink text-cream font-display text-sm px-5 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform whitespace-nowrap"
          >
            ALL ARTISTS →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artists.map((a, i) => {
            const accents = ["bg-magenta text-cream", "bg-acid-yellow text-ink", "bg-electric-blue text-cream", "bg-orange text-ink"];
            const accent = accents[i % accents.length] ?? "bg-acid-yellow text-ink";
            return (
              <Link
                key={a.id}
                href={`/artists/${a.slug}`}
                className="group relative aspect-square border-4 border-ink chunk-shadow overflow-hidden hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform"
              >
                {a.photoUrl ? (
                  <>
                    <img src={a.photoUrl} alt={a.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                  </>
                ) : (
                  <div className={`absolute inset-0 ${accent} flex items-center justify-center`}>
                    <Music className="w-12 h-12 opacity-20" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className={`font-display text-sm leading-tight ${a.photoUrl ? "text-cream" : ""}`}>{a.name.toUpperCase()}</p>
                  {a.primaryCity && (
                    <p className={`text-xs flex items-center gap-0.5 mt-0.5 ${a.photoUrl ? "text-cream/60" : "opacity-60"}`}>
                      <MapPin className="w-3 h-3 shrink-0" />{a.primaryCity}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 md:hidden">
          <Link href="/artists" className="inline-block bg-ink text-cream font-display text-sm px-5 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform">
            ALL ARTISTS →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function DiscoverPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <PageHero
        eyebrow="DISCOVER"
        title={<>WHAT&apos;S YOUR<br/>SCENE?</>}
        bg="bg-ink"
        textColor="text-cream"
        eyebrowColor="text-acid-yellow"
        shadowColor="hsl(var(--magenta))"
      >
        <div className="mt-6 max-w-2xl">
          <SearchClient />
          <p className="font-display text-cream/40 text-xs mt-3 tracking-wide">
            Search across 47+ artists · 5 upcoming events · venues across India
          </p>
        </div>
      </PageHero>

      <Marquee
        bg="bg-acid-yellow"
        items={["BENGALURU", "MUMBAI", "DELHI", "GOA", "HYDERABAD", "PUNE", "DETROIT TECHNO", "CHICAGO HOUSE", "LONDON JUNGLE"]}
      />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Discover" }]} />
      </section>

      {/* ── INDIAN CITIES — asymmetric mosaic ── */}
      <section className="py-12 md:py-16 border-b-4 border-ink">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-magenta text-base mb-3">/ INDIAN SCENES</p>
          <h2 className="font-display text-ink text-4xl md:text-6xl leading-none mb-8">SIX CITIES.</h2>

          {/* Improvement: asymmetric mosaic — Bengaluru spans 2 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INDIA_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/scenes/${city.slug}`}
                className={`group relative border-4 border-ink chunk-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform p-5 flex flex-col justify-between min-h-[180px] md:min-h-[220px] ${city.bg} ${city.span}`}
              >
                <div>
                  <p className={`font-display text-[10px] uppercase tracking-widest mb-1 ${city.text} opacity-60`}>India</p>
                  <h3 className={`font-display text-2xl md:text-3xl uppercase leading-tight ${city.text}`}>{city.label}</h3>
                </div>
                <div>
                  <p className={`text-sm mb-3 font-medium ${city.text} opacity-80`}>{city.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {city.activeGenres.map((g) => (
                      <span key={g} className="text-[10px] font-display uppercase px-2 py-0.5 bg-black/10 text-current border border-current/20">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`absolute top-4 right-4 font-display text-lg ${city.text} opacity-0 group-hover:opacity-100 transition-opacity`}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENRE STRIP — horizontal scroll pills ── */}
      <section className="bg-ink border-b-4 border-ink py-10 md:py-14 overflow-x-clip">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="font-display text-acid-yellow text-base mb-2">/ SOUNDS</p>
              <h2 className="font-display text-cream text-3xl md:text-5xl leading-none">PICK YOUR GENRE.</h2>
            </div>
            <Link href="/sounds" className="hidden md:inline-block font-display text-xs text-cream/50 hover:text-acid-yellow transition-colors">ALL SOUNDS →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {GENRES.map((g) => (
              <Link
                key={g.slug}
                href={`/sounds/${g.slug}`}
                className={`snap-start shrink-0 border-4 border-cream/20 chunk-shadow px-5 py-3 font-display text-sm uppercase whitespace-nowrap hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform ${g.bg} ${g.text}`}
              >
                {g.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ARTISTS ── */}
      <Suspense fallback={
        <section className="bg-cream border-b-4 border-ink py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
            <div className="h-8 bg-ink/10 animate-pulse w-48 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-ink/10 animate-pulse border-4 border-ink" />)}
            </div>
          </div>
        </section>
      }>
        <FeaturedArtists />
      </Suspense>

      {/* ── GLOBAL ORIGINS ── */}
      <section className="py-12 md:py-16 border-b-4 border-ink">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-magenta text-base mb-3">/ GLOBAL ORIGINS</p>
          <h2 className="font-display text-ink text-4xl md:text-6xl leading-none mb-2">WHERE IT<br/>STARTED.</h2>
          <p className="text-ink/60 font-medium text-base mb-8 max-w-xl">The cities and movements that shaped what plays in India&apos;s clubs today.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {GLOBAL_SCENES.map((scene) => (
              <Link
                key={scene.slug}
                href={`/scenes/${scene.slug}`}
                className={`group border-4 border-ink chunk-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform p-5 flex flex-col gap-2 ${scene.bg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-display text-[10px] uppercase tracking-widest ${scene.text} opacity-60`}>
                      {scene.city} · {scene.decade}
                    </p>
                    <h3 className={`font-display text-lg uppercase leading-tight mt-1 ${scene.text}`}>{scene.name}</h3>
                  </div>
                  <span className={`font-display text-xs px-2 py-0.5 border border-current ${scene.text} opacity-40 shrink-0`}>{scene.bpm}</span>
                </div>
                <p className={`text-sm font-medium line-clamp-2 ${scene.text} opacity-70`}>{scene.tagline}</p>
                <p className={`text-xs font-display uppercase ${scene.text} opacity-40 group-hover:opacity-100 transition-opacity mt-auto`}>Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="bg-magenta border-b-4 border-ink py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-acid-yellow text-base mb-2">/ CCD ORIGINALS</p>
            <h3 className="font-display text-cream text-3xl md:text-4xl leading-[0.95]">
              RSVP-ONLY NIGHTS.<br/>HOUSE, DISCO, JUNGLE.
            </h3>
          </div>
          <Link
            href="/events"
            className="shrink-0 bg-acid-yellow text-ink font-display text-lg px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform whitespace-nowrap"
          >
            SEE CCD EVENTS →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
