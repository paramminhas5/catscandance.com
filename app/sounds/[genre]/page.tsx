/**
 * /sounds/[genre] — Genre deep-dive page
 * UX improvement: Bold color-blocked hero with BPM + origin, family tree related genres
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { listArtists, listUpcomingEvents } from "@/lib/db/queries";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Marquee } from "@/components/site/marquee";
import { MapPin, Music, Calendar } from "lucide-react";

// ── Genre config ─────────────────────────────────────────────────────────────
type GenreConfig = {
  label: string;
  dbGenre: string;
  bpm: string;
  origin: string;
  decade: string;
  history: string;
  bg: string;
  textColor: string;
  eyebrowColor: string;
  relatedGenres: Array<{ slug: string; label: string }>;
  marqueeItems: string[];
};

const GENRE_CONFIG: Record<string, GenreConfig> = {
  techno: {
    label: "Techno",
    dbGenre: "Techno",
    bpm: "130–150",
    origin: "Detroit, USA",
    decade: "1980s",
    history:
      "Techno is the sound of machine consciousness. Born in Detroit from three young Black Americans who absorbed Kraftwerk and Parliament-Funkadelic and synthesised something new — stark, repetitive, deeply futuristic. It moved to Berlin, went minimal, went industrial, went rave, went back to its roots. Its most enduring quality: the ability to make a room feel like collective thought.",
    bg: "bg-ink",
    textColor: "text-cream",
    eyebrowColor: "text-acid-yellow",
    relatedGenres: [{ slug: "house", label: "House" }, { slug: "ambient", label: "Ambient" }, { slug: "breaks", label: "Breaks" }],
    marqueeItems: ["TECHNO", "DETROIT", "BERLIN", "130 BPM", "ALL NIGHT"],
  },
  house: {
    label: "House",
    dbGenre: "House",
    bpm: "118–130",
    origin: "Chicago, USA",
    decade: "1980s",
    history:
      "House music began in the basement of a Chicago nightclub called The Warehouse. Frankie Knuckles was the resident DJ, blending disco, soul, and European electronic music for a Black and queer crowd who had nowhere else to go. The resulting sound — four-on-the-floor kick, swinging hi-hats, gospel-inflected vocals — is still the most emotionally affecting thing you can hear in a club.",
    bg: "bg-electric-blue",
    textColor: "text-cream",
    eyebrowColor: "text-acid-yellow",
    relatedGenres: [{ slug: "garage", label: "Garage" }, { slug: "disco", label: "Disco" }, { slug: "techno", label: "Techno" }],
    marqueeItems: ["HOUSE", "CHICAGO", "DEEP", "SOULFUL", "4/4"],
  },
  dnb: {
    label: "Jungle / D&B",
    dbGenre: "D&B",
    bpm: "160–180",
    origin: "London, UK",
    decade: "1990s",
    history:
      "Drum & Bass — and its ancestor Jungle — came from the collision of reggae soundsystem culture and hardcore rave in the south London estates and pirate radio waves of the early 1990s. The breakbeat became the protagonist, doubled and manipulated into patterns of almost inhuman complexity, while the bass moved in deep sub-frequency grooves that you felt before you heard.",
    bg: "bg-acid-yellow",
    textColor: "text-ink",
    eyebrowColor: "text-ink",
    relatedGenres: [{ slug: "breaks", label: "Breaks" }, { slug: "bass", label: "Bass" }, { slug: "ambient", label: "Ambient" }],
    marqueeItems: ["JUNGLE", "D&B", "LONDON", "BREAKS", "160 BPM"],
  },
  garage: {
    label: "UK Garage",
    dbGenre: "Garage",
    bpm: "130–140",
    origin: "London, UK",
    decade: "1990s",
    history:
      "UK Garage was born from the American house and R&B records played in London's underground club circuit, then filtered through British grime culture — syncopated rhythms, pitched-up vocal samples, sub-bass. It gave birth to grime and eventually dubstep. Today&apos;s garage scene has rediscovered its roots: 2-step rhythms, vocal hooks, dancefloor euphoria.",
    bg: "bg-magenta",
    textColor: "text-cream",
    eyebrowColor: "text-acid-yellow",
    relatedGenres: [{ slug: "house", label: "House" }, { slug: "bass", label: "Bass" }, { slug: "dnb", label: "Jungle" }],
    marqueeItems: ["UK GARAGE", "2-STEP", "LONDON", "SYNCOPATED"],
  },
  disco: {
    label: "Disco",
    dbGenre: "Disco",
    bpm: "110–130",
    origin: "New York, USA",
    decade: "1970s",
    history:
      "Disco was a liberation movement that happened to have a great bassline. Born in New York City&apos;s underground Black, Latinx, and queer party circuit, it took hold of the mainstream, got burned in effigy at Comiskey Park in 1979, and went underground again — where it quietly became the foundation of house music. Every groove you hear in a club today has disco in its DNA.",
    bg: "bg-orange",
    textColor: "text-ink",
    eyebrowColor: "text-ink",
    relatedGenres: [{ slug: "house", label: "House" }, { slug: "downtempo", label: "Downtempo" }, { slug: "garage", label: "Garage" }],
    marqueeItems: ["DISCO", "NEW YORK", "GROOVE", "LIBERATION", "FUNK"],
  },
  bass: {
    label: "Bass",
    dbGenre: "Bass",
    bpm: "140–150",
    origin: "Global",
    decade: "2000s",
    history:
      "Bass music is a broad umbrella for music defined by sub-frequency dominance: footwork, juke, grime, dubstep, and hybrid forms that don&apos;t have a name yet. The bass isn&apos;t decoration — it&apos;s the architecture. These are sounds designed for systems and rooms, not headphones.",
    bg: "bg-cream",
    textColor: "text-ink",
    eyebrowColor: "text-magenta",
    relatedGenres: [{ slug: "dnb", label: "Jungle" }, { slug: "garage", label: "Garage" }, { slug: "techno", label: "Techno" }],
    marqueeItems: ["BASS", "SUB", "FREQUENCY", "SYSTEM MUSIC"],
  },
  breaks: {
    label: "Breaks",
    dbGenre: "Breaks",
    bpm: "125–145",
    origin: "USA / UK",
    decade: "1980s",
    history:
      "The breakbeat is the moment in a funk or soul record when everything drops away except the drums — and for hip-hop DJs, this was the only part that mattered. Looped and manipulated into new structures, the break became the engine of hip-hop, jungle, D&B, and a dozen varieties of electronic breaks music. The genre is defined by rhythmic complexity and physical momentum.",
    bg: "bg-electric-blue",
    textColor: "text-cream",
    eyebrowColor: "text-acid-yellow",
    relatedGenres: [{ slug: "dnb", label: "Jungle" }, { slug: "techno", label: "Techno" }, { slug: "bass", label: "Bass" }],
    marqueeItems: ["BREAKS", "BREAKBEAT", "FUNK", "RHYTHM"],
  },
  ambient: {
    label: "Ambient",
    dbGenre: "Ambient",
    bpm: "60–90",
    origin: "Germany / UK",
    decade: "1970s",
    history:
      "Brian Eno coined the term when he accidentally discovered that music played at low volume in a space could change the character of that space. Tangerine Dream and Klaus Schulze were already doing it in Germany. By the 1990s, rave culture had incorporated ambient as the comedown room — a place to breathe after the dance floor. Today&apos;s ambient artists work at the intersection of environmental sound, drone, and electronic composition.",
    bg: "bg-ink",
    textColor: "text-cream",
    eyebrowColor: "text-acid-yellow",
    relatedGenres: [{ slug: "downtempo", label: "Downtempo" }, { slug: "techno", label: "Techno" }, { slug: "breaks", label: "Breaks" }],
    marqueeItems: ["AMBIENT", "DRONE", "TEXTURE", "SPACE", "SLOW"],
  },
  downtempo: {
    label: "Downtempo",
    dbGenre: "Downtempo",
    bpm: "80–110",
    origin: "Global",
    decade: "1990s",
    history:
      "Downtempo lives in the space between dance music and listening music — too slow for the floor, too rhythmic for pure ambient. Trip-hop, nu-jazz, lo-fi, and slow house all live in this territory. It&apos;s the music for the after, for the journey, for the afternoon before the night starts. India has a rich downtempo tradition connected to its classical music modal structures.",
    bg: "bg-orange",
    textColor: "text-ink",
    eyebrowColor: "text-ink",
    relatedGenres: [{ slug: "ambient", label: "Ambient" }, { slug: "disco", label: "Disco" }, { slug: "house", label: "House" }],
    marqueeItems: ["DOWNTEMPO", "TRIP-HOP", "NU-JAZZ", "SLOW"],
  },
};

export function generateStaticParams() {
  return Object.keys(GENRE_CONFIG).map((genre) => ({ genre }));
}

type Props = { params: Promise<{ genre: string }> };

export async function generateMetadata({ params }: Props) {
  const { genre } = await params;
  const cfg = GENRE_CONFIG[genre];
  if (!cfg) return buildMetadata({ title: "Genre", path: `/sounds/${genre}` });
  return buildMetadata({
    title: `${cfg.label} — Sounds — Cats Can Dance`,
    description: `Explore ${cfg.label} music: history, key artists, upcoming events in India. ${cfg.origin}, ${cfg.decade}.`,
    path: `/sounds/${genre}`,
  });
}

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default async function SoundPage({ params }: Props) {
  const { genre } = await params;
  const cfg = GENRE_CONFIG[genre];
  if (!cfg) notFound();

  const [artists, events] = await Promise.all([
    listArtists({ genre: cfg.dbGenre, limit: 8 }),
    listUpcomingEvents({ genre: cfg.dbGenre, limit: 6 }),
  ]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <PageHero
        eyebrow={`SOUNDS / ${cfg.label.toUpperCase()}`}
        title={cfg.label.toUpperCase()}
        bg={cfg.bg}
        textColor={cfg.textColor}
        eyebrowColor={cfg.eyebrowColor}
        shadowColor="hsl(var(--ink))"
      >
        {/* BPM + Origin strip */}
        <div className={`flex flex-wrap gap-4 mt-4 font-display text-sm ${cfg.textColor}`}>
          <span className={`border-2 border-current/40 px-3 py-1 opacity-70`}>{cfg.bpm} BPM</span>
          <span className={`border-2 border-current/40 px-3 py-1 opacity-70`}>{cfg.origin}</span>
          <span className={`border-2 border-current/40 px-3 py-1 opacity-70`}>{cfg.decade}</span>
        </div>
      </PageHero>

      <Marquee bg="bg-acid-yellow" items={cfg.marqueeItems} />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Discover", href: "/discover" }, { label: cfg.label }]} />
      </section>

      {/* History */}
      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pb-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <p className="font-display text-magenta text-base mb-3">/ THE HISTORY</p>
            <p className="text-ink/80 text-lg font-medium leading-relaxed">{cfg.history}</p>

            {/* Artists */}
            {artists.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-display text-ink text-2xl md:text-3xl">ARTISTS IN THIS SOUND</p>
                  <Link href={`/artists`} className="font-display text-xs text-magenta hover:underline uppercase">All →</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {artists.map((a, i) => {
                    const accents = ["bg-acid-yellow text-ink", "bg-electric-blue text-cream", "bg-magenta text-cream", "bg-orange text-ink"];
                    const accent = accents[i % accents.length] ?? "bg-acid-yellow text-ink";
                    return (
                      <Link
                        key={a.id}
                        href={`/artists/${a.slug}`}
                        className="group relative aspect-square border-4 border-ink overflow-hidden chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
                      >
                        {a.photoUrl ? (
                          <>
                            <img src={a.photoUrl} alt={a.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                          </>
                        ) : (
                          <div className={`absolute inset-0 ${accent} flex items-center justify-center`}>
                            <Music className="w-8 h-8 opacity-20" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className={`font-display text-xs leading-tight ${a.photoUrl ? "text-cream" : ""}`}>{a.name.toUpperCase()}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            {artists.length === 0 && (
              <div className="mt-10 border-4 border-ink bg-acid-yellow chunk-shadow p-6">
                <p className="font-display text-ink text-xl mb-1">NO ARTISTS YET</p>
                <p className="text-ink/70 text-sm">Artists playing {cfg.label} are joining the CCD directory soon.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming events */}
            <div className="border-4 border-ink chunk-shadow">
              <div className="bg-magenta p-4 border-b-4 border-ink">
                <p className="font-display text-cream text-sm uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Upcoming Events
                </p>
              </div>
              {events.length > 0 ? (
                <div className="divide-y-4 divide-ink">
                  {events.map((e) => (
                    <Link key={e.id} href={`/events/${e.slug}`} className="block p-4 bg-cream hover:bg-acid-yellow transition-colors group">
                      <p className="font-display text-ink text-base leading-tight group-hover:text-magenta transition-colors">{e.title.toUpperCase()}</p>
                      <p className="text-ink/60 text-xs mt-1">{formatDate(e.startsAt)}</p>
                      <p className="text-ink/50 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{e.city}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-cream text-center">
                  <p className="font-display text-ink/50 text-sm">No upcoming events.</p>
                  <Link href="/events" className="font-display text-xs text-magenta hover:underline uppercase mt-2 block">Browse all →</Link>
                </div>
              )}
            </div>

            {/* Related genres — family tree */}
            <div className="border-4 border-ink chunk-shadow">
              <div className="bg-ink p-4 border-b-4 border-ink">
                <p className="font-display text-acid-yellow text-sm uppercase tracking-widest">Sounds Like</p>
              </div>
              <div className="p-4 bg-cream space-y-2">
                {cfg.relatedGenres.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/sounds/${r.slug}`}
                    className="flex items-center justify-between border-4 border-ink bg-cream px-4 py-3 chunk-shadow hover:bg-acid-yellow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
                  >
                    <span className="font-display text-ink text-sm">{r.label.toUpperCase()}</span>
                    <span className="font-display text-ink/40 group-hover:text-ink transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
