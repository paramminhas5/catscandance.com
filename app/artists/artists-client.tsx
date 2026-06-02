"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Music, X, AlertTriangle } from "lucide-react";

type Artist = {
  id: string;
  slug: string;
  name: string;
  primaryCity: string;
  genres: string[];
  bio: string;
  photoUrl: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  socials: Record<string, string> | null;
};

type SortMode = "az" | "city" | "genre";

const CARD_ACCENTS = [
  "bg-acid-yellow text-ink",
  "bg-electric-blue text-cream",
  "bg-magenta text-cream",
  "bg-orange text-ink",
  "bg-lime text-ink",
];

export function ArtistsClient({ artists }: { artists: Artist[] }) {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");
  const [activeGenres, setActiveGenres] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortMode>("az");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const allCities = useMemo(() => {
    const s = new Set<string>();
    for (const a of artists) {
      if (a.primaryCity) s.add(a.primaryCity.split(",")[0].trim());
    }
    return Array.from(s).sort();
  }, [artists]);

  const allGenres = useMemo(() => {
    const s = new Set<string>();
    for (const a of artists) for (const g of a.genres) s.add(g);
    return Array.from(s).sort();
  }, [artists]);

  const toggleGenre = (g: string) => {
    setActiveGenres((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    let rows = artists.filter((a) => {
      if (city !== "All" && !a.primaryCity.toLowerCase().includes(city.toLowerCase()))
        return false;
      if (activeGenres.size > 0 && !a.genres.some((g) => activeGenres.has(g))) return false;
      if (featuredOnly && !a.isFeatured) return false;
      if (!ql) return true;
      return (
        a.name.toLowerCase().includes(ql) ||
        a.genres.join(" ").toLowerCase().includes(ql) ||
        a.primaryCity.toLowerCase().includes(ql) ||
        a.bio.toLowerCase().includes(ql)
      );
    });

    if (sort === "city")
      rows = [...rows].sort(
        (a, b) => a.primaryCity.localeCompare(b.primaryCity) || a.name.localeCompare(b.name)
      );
    else if (sort === "genre")
      rows = [...rows].sort(
        (a, b) =>
          (a.genres[0] ?? "").localeCompare(b.genres[0] ?? "") || a.name.localeCompare(b.name)
      );
    else rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));

    return rows;
  }, [artists, q, city, activeGenres, sort, featuredOnly]);

  const hasFilters = q || city !== "All" || activeGenres.size > 0 || featuredOnly;
  const clearAll = () => {
    setQ("");
    setCity("All");
    setActiveGenres(new Set());
    setFeaturedOnly(false);
  };

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="sticky top-0 z-30 bg-cream border-b-4 border-ink">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search artists…"
                className="w-full pl-9 pr-8 py-2 border-4 border-ink bg-cream font-sans text-ink placeholder:text-ink/40 focus:outline-none focus:bg-acid-yellow/20 transition-colors"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-2 border-4 border-ink bg-cream font-display text-sm text-ink focus:outline-none focus:bg-acid-yellow/20 transition-colors"
            >
              <option value="All">ALL CITIES</option>
              {allCities.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="px-3 py-2 border-4 border-ink bg-cream font-display text-sm text-ink focus:outline-none focus:bg-acid-yellow/20 transition-colors"
            >
              <option value="az">A → Z</option>
              <option value="city">CITY</option>
              <option value="genre">GENRE</option>
            </select>

            {/* Featured toggle */}
            <button
              onClick={() => setFeaturedOnly((b) => !b)}
              className={`px-3 py-2 border-4 border-ink font-display text-xs uppercase whitespace-nowrap transition-colors ${
                featuredOnly ? "bg-magenta text-cream" : "bg-transparent text-ink hover:bg-acid-yellow"
              }`}
            >
              {featuredOnly ? "◉ FEATURED ×" : "◉ FEATURED"}
            </button>
          </div>

          {/* Genre pills */}
          {allGenres.length > 0 && (
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              {allGenres.map((g) => {
                const active = activeGenres.has(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1 border-2 border-ink font-display text-xs whitespace-nowrap transition-colors ${
                      active ? "bg-ink text-cream" : "bg-transparent text-ink hover:bg-acid-yellow"
                    }`}
                  >
                    {g.toUpperCase()}
                  </button>
                );
              })}
              {activeGenres.size > 0 && (
                <button
                  onClick={() => setActiveGenres(new Set())}
                  className="px-3 py-1 border-2 border-ink/40 font-display text-xs text-ink/50 hover:border-ink hover:text-ink transition-colors whitespace-nowrap"
                >
                  CLEAR ×
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <section className="bg-cream border-b-4 border-ink py-10 md:py-16 min-h-[60vh]">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          {artists.length === 0 ? (
            <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-8 inline-block">
              <Music className="w-10 h-10 text-ink mb-3" />
              <p className="font-display text-2xl text-ink mb-2">NO ARTISTS YET</p>
              <p className="text-ink/70 text-sm">
                The roster is being built. Check back soon.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-8 inline-block">
              <Music className="w-10 h-10 text-ink mb-3" />
              <p className="font-display text-2xl text-ink mb-2">NO ARTISTS MATCH</p>
              <p className="text-ink/70 text-sm mb-4">Try adjusting your filters.</p>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="bg-ink text-cream font-display px-5 py-2 border-4 border-ink hover:bg-ink/80 transition-colors"
                >
                  CLEAR FILTERS
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="font-display text-sm text-ink/50 mb-4">
                {filtered.length} ARTIST{filtered.length !== 1 ? "S" : ""}
                {activeGenres.size > 0 && " · FILTERED BY GENRE"}
                {featuredOnly && " · FEATURED ONLY"}
              </p>

              {/* Improvement #3: first featured artist gets intentional large card,
                  then a clean uniform 4-col grid — no random breakpoints */}
              <div className="space-y-4">
                {(() => {
                  // Separate the first featured artist (if any) from the rest
                  const featuredIdx = filtered.findIndex((a) => a.isFeatured);
                  const hero = featuredIdx >= 0 ? filtered[featuredIdx] : null;
                  const rest = hero
                    ? filtered.filter((_, i) => i !== featuredIdx)
                    : filtered;

                  return (
                    <>
                      {/* Featured hero card — full width */}
                      {hero && (
                        <Link
                          href={`/artists/${hero.slug}`}
                          className="group relative flex flex-col md:flex-row border-4 border-ink chunk-shadow overflow-hidden bg-ink text-cream hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform"
                        >
                          {/* Photo half */}
                          <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto min-h-[260px] bg-acid-yellow overflow-hidden">
                            {hero.photoUrl ? (
                              <img
                                src={hero.photoUrl}
                                alt={hero.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="eager"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-acid-yellow">
                                <Music className="w-24 h-24 text-ink/20" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/40 hidden md:block" />
                          </div>

                          {/* Info half */}
                          <div className="flex-1 p-7 md:p-10 flex flex-col justify-end bg-ink">
                            <span className="inline-block self-start bg-acid-yellow text-ink font-display text-xs px-3 py-1 border-2 border-cream uppercase tracking-widest mb-4">
                              ✦ FEATURED ARTIST
                            </span>
                            <h3 className="font-display text-5xl md:text-7xl leading-[0.85] break-words mb-3 drop-shadow-[4px_4px_0_hsl(var(--magenta))]">
                              {hero.name.toUpperCase()}
                            </h3>
                            {hero.primaryCity && (
                              <p className="font-display text-acid-yellow text-sm tracking-widest mb-3">
                                / {hero.primaryCity.toUpperCase()}
                              </p>
                            )}
                            {hero.genres.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {hero.genres.slice(0, 4).map((g) => (
                                  <span key={g} className="text-[10px] px-2 py-1 font-display border-2 border-cream/30 text-cream/70 uppercase">
                                    {g}
                                  </span>
                                ))}
                              </div>
                            )}
                            {hero.bio && (
                              <p className="text-cream/70 font-medium text-base leading-snug max-w-md">
                                {hero.bio.slice(0, 140)}{hero.bio.length > 140 ? "…" : ""}
                              </p>
                            )}
                            <p className="mt-4 font-display text-xs text-acid-yellow tracking-widest">
                              VIEW PROFILE →
                            </p>
                          </div>
                        </Link>
                      )}

                      {/* Uniform 4-col grid for the rest */}
                      {rest.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {rest.map((a, i) => {
                            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
                            const textIsInk = accent.includes("text-ink");
                            return (
                              <Link
                                key={a.id}
                                href={`/artists/${a.slug}`}
                                className="group relative aspect-square border-4 border-ink overflow-hidden chunk-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform"
                              >
                                {a.photoUrl ? (
                                  <>
                                    <img src={a.photoUrl} alt={a.name}
                                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                                  </>
                                ) : (
                                  <div className={`absolute inset-0 ${accent} flex items-center justify-center`}>
                                    <Music className="w-12 h-12 opacity-10" />
                                  </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  {a.isFeatured && (
                                    <span className="inline-block mb-1 text-[9px] font-display bg-acid-yellow text-ink px-1.5 py-0.5 border border-ink uppercase tracking-widest">
                                      ✦
                                    </span>
                                  )}
                                  <p className={`font-display text-sm leading-tight truncate ${a.photoUrl ? "text-cream" : textIsInk ? "text-ink" : "text-cream"}`}>
                                    {a.name.toUpperCase()}
                                  </p>
                                  {a.primaryCity && (
                                    <p className={`text-xs flex items-center gap-0.5 mt-0.5 ${a.photoUrl ? "text-cream/60" : textIsInk ? "text-ink/60" : "text-cream/60"}`}>
                                      <MapPin className="w-3 h-3 shrink-0" />{a.primaryCity}
                                    </p>
                                  )}
                                  {a.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {a.genres.slice(0, 2).map((g) => (
                                        <span key={g} className="text-[10px] px-1.5 py-0.5 font-display border border-ink bg-acid-yellow text-ink">
                                          {g.toUpperCase()}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* CTA */}
              <div className="mt-12 border-4 border-ink bg-orange chunk-shadow p-6 inline-block">
                <p className="font-display text-2xl text-ink mb-2">ARE YOU AN ARTIST?</p>
                <p className="text-ink/70 text-sm mb-4">
                  Get listed in the CCD artist directory.
                </p>
                <Link
                  href="/for-artists"
                  className="inline-block bg-ink text-cream font-display px-5 py-2 border-4 border-ink hover:bg-ink/80 transition-colors"
                >
                  JOIN THE ROSTER →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
