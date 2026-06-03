/**
 * /scenes/[city] — City scene guide (India) or global origin editorial
 * UX improvement: Two-column layout — editorial left, live DB data sticky right
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getSceneData } from "@/lib/db/queries";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Marquee } from "@/components/site/marquee";
import { MapPin, Music, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

// ── Static params ────────────────────────────────────────────────────────────
const INDIA_SLUGS = ["bangalore", "bombay", "delhi", "goa", "hyderabad", "pune"] as const;
const GLOBAL_SLUGS = ["detroit-techno", "chicago-house", "london-jungle", "berlin-techno", "goa-trance"] as const;
type IndiaCitySlug = (typeof INDIA_SLUGS)[number];
type GlobalSlug = (typeof GLOBAL_SLUGS)[number];

export function generateStaticParams() {
  return [...INDIA_SLUGS, ...GLOBAL_SLUGS].map((city) => ({ city }));
}

// ── India city config ────────────────────────────────────────────────────────
type IndiaCityConfig = {
  label: string;
  dbCity: string;
  tagline: string;
  description: string;
  bg: string;
  eyebrowColor: string;
  textColor: string;
  marqueeItems: string[];
};

const INDIA_CITIES: Record<IndiaCitySlug, IndiaCityConfig> = {
  bangalore: {
    label: "Bengaluru",
    dbCity: "Bengaluru",
    tagline: "The underground&apos;s home base",
    description:
      "Bengaluru is India's ground zero for underground dance music. From the basement parties of 2015 to the CCD × SOCIAL series today, the city has quietly built the country's most consistent electronic music scene — driven by a young, design-educated crowd who actually care about the music.",
    bg: "bg-magenta",
    eyebrowColor: "text-acid-yellow",
    textColor: "text-cream",
    marqueeItems: ["HOUSE", "DISCO", "UK GARAGE", "JUNGLE", "D&B", "BENGALURU"],
  },
  bombay: {
    label: "Mumbai",
    dbCity: "Mumbai",
    tagline: "Bollywood meets bass",
    description:
      "Mumbai has always been India's entertainment capital, and the electronic music scene reflects that — larger crowds, more international bookings, higher production values. The city's warehouse scene in Bandra and Lower Parel has spawned some of the subcontinent's most important clubs and collectives.",
    bg: "bg-electric-blue",
    eyebrowColor: "text-acid-yellow",
    textColor: "text-cream",
    marqueeItems: ["TECHNO", "HOUSE", "JUNGLE", "MUMBAI", "WAREHOUSE"],
  },
  delhi: {
    label: "Delhi",
    dbCity: "Delhi",
    tagline: "Techno capital of India",
    description:
      "Delhi's proximity to power and its working-class soundsystem roots have made it India's techno capital. The city hosts the country's most internationally booked techno events, and its artists — many trained in industrial music traditions — have a distinct edge that's earned global respect.",
    bg: "bg-acid-yellow",
    eyebrowColor: "text-ink",
    textColor: "text-ink",
    marqueeItems: ["TECHNO", "INDUSTRIAL", "BASS", "DELHI"],
  },
  goa: {
    label: "Goa",
    dbCity: "Goa",
    tagline: "Where it all began",
    description:
      "Long before Berghain, long before Fabric, there was Goa — the original global rave destination where Western travellers, local musicians, and a spiritual counterculture invented a genre that influenced dance music worldwide. The spirit persists in Goa's beach parties and the growing number of domestic artists reclaiming the trance legacy.",
    bg: "bg-orange",
    eyebrowColor: "text-ink",
    textColor: "text-ink",
    marqueeItems: ["GOA TRANCE", "PSYCH", "AMBIENT", "BEACHES", "GOA"],
  },
  hyderabad: {
    label: "Hyderabad",
    dbCity: "Hyderabad",
    tagline: "The rising wave",
    description:
      "Hyderabad's tech boom brought money, cosmopolitan crowds, and a new generation of music obsessives. The scene is younger than Bengaluru's but growing fast — with a strong house and techno underground and a crop of emerging DJs who are increasingly booking nationally.",
    bg: "bg-cream",
    eyebrowColor: "text-magenta",
    textColor: "text-ink",
    marqueeItems: ["HOUSE", "TECHNO", "D&B", "HYDERABAD"],
  },
  pune: {
    label: "Pune",
    dbCity: "Pune",
    tagline: "College town, serious sound",
    description:
      "Pune punches above its weight. A dense student population, proximity to Bengaluru's scene influence, and a long history of rock music have made it a breeding ground for electronic music talent. The city's intimate venues support a regular circuit of house, breaks, and ambient events.",
    bg: "bg-ink",
    eyebrowColor: "text-acid-yellow",
    textColor: "text-cream",
    marqueeItems: ["HOUSE", "BREAKS", "AMBIENT", "PUNE"],
  },
};

// ── Global origin config ─────────────────────────────────────────────────────
type GlobalSceneConfig = {
  name: string;
  city: string;
  decade: string;
  bpmRange: string;
  bg: string;
  eyebrowColor: string;
  textColor: string;
  history: string;
  keyArtists: string[];
  indiaInfluence: string;
  marqueeItems: string[];
};

const GLOBAL_SCENES: Record<GlobalSlug, GlobalSceneConfig> = {
  "detroit-techno": {
    name: "Detroit Techno",
    city: "Detroit, USA",
    decade: "1980s",
    bpmRange: "130–150 BPM",
    bg: "bg-ink",
    eyebrowColor: "text-acid-yellow",
    textColor: "text-cream",
    history:
      "Detroit Techno was born from the collision of Black American futurism and the city's post-industrial collapse. Three kids — Juan Atkins, Derrick May, and Kevin Saunderson — synthesised Kraftwerk, Parliament-Funkadelic, and Giorgio Moroder into something the world hadn't heard. Stark, repetitive, deeply emotional. It was called 'the sound of tomorrow' and it still is.",
    keyArtists: ["Juan Atkins", "Derrick May", "Kevin Saunderson", "Jeff Mills", "Model 500", "Underground Resistance"],
    indiaInfluence: "Detroit's influence arrived in India via German techno — the Berlin underground absorbed Detroit and sent it back transformed. Indian DJs who travel internationally often cite the Detroit sound as the foundational vocabulary for what serious techno means.",
    marqueeItems: ["DETROIT", "TECHNO", "FUTURISM", "MODEL 500", "UNDERGROUND RESISTANCE"],
  },
  "chicago-house": {
    name: "Chicago House",
    city: "Chicago, USA",
    decade: "1980s",
    bpmRange: "118–130 BPM",
    bg: "bg-electric-blue",
    eyebrowColor: "text-acid-yellow",
    textColor: "text-cream",
    history:
      "Frankie Knuckles spun at The Warehouse in Chicago's South Side, mixing disco, soul, and early synthesiser records for a Black and gay crowd that was otherwise invisible to mainstream culture. The DJ was the composer. The crowd was the band. House music became the foundation of everything that followed — the chord progressions, the 4/4 kick, the vocal samples, the sense that the dancefloor was sacred.",
    keyArtists: ["Frankie Knuckles", "Larry Heard", "DJ Sprinkles", "Larry Levan", "Ron Hardy", "Marshall Jefferson"],
    indiaInfluence: "Chicago house is the DNA of Indian house music. The Bengaluru scene in particular — with its emphasis on deep, vocal, and soulful house — draws directly from Chicago's emotional blueprint. CCD's own sound is rooted here.",
    marqueeItems: ["CHICAGO", "HOUSE", "THE WAREHOUSE", "FRANKIE KNUCKLES", "SOUL"],
  },
  "london-jungle": {
    name: "London Jungle",
    city: "London, UK",
    decade: "1990s",
    bpmRange: "160–180 BPM",
    bg: "bg-acid-yellow",
    eyebrowColor: "text-ink",
    textColor: "text-ink",
    history:
      "Jungle emerged from London's multicultural rave scene when Black British producers took hardcore rave, slowed the bass, doubled the breakbeats, and added reggae soundsystem culture into the equation. It was fast, complex, and impossibly soulful. By 1994 it had evolved into Drum & Bass, but the original jungle energy — dark, rhythmically virtuosic, community-coded — has never gone away.",
    keyArtists: ["Goldie", "LTJ Bukem", "4hero", "Shy FX", "Congo Natty", "Randall"],
    indiaInfluence: "Jungle and D&B arrived in India's coastal raves in the late 1990s and never left. Goa's parties mixed it with trance; Bengaluru's underground keeps it alive in intimate club settings. CCD's programming regularly includes jungle and D&B selectors.",
    marqueeItems: ["JUNGLE", "D&B", "LONDON", "BREAKBEATS", "SOUNDSYSTEM"],
  },
  "berlin-techno": {
    name: "Berlin Techno",
    city: "Berlin, Germany",
    decade: "1990s",
    bpmRange: "135–145 BPM",
    bg: "bg-magenta",
    eyebrowColor: "text-acid-yellow",
    textColor: "text-cream",
    history:
      "The fall of the Berlin Wall in 1989 created a city full of empty buildings and a young population hungry for freedom. DJs like DJ Hell, Westbam, and later Berghain's crew filled abandoned East Berlin spaces with all-night techno — minimal, hard, relentless. The aesthetic is inseparable from the politics: no photos, no mainstream press, the music as the only important thing in the room.",
    keyArtists: ["Berghain Residents", "Ellen Allien", "Marcel Dettmann", "Ben Klock", "Surgeon", "Ostgut Ton"],
    indiaInfluence: "Berlin is the mecca for Indian DJs who travel internationally. Its influence is visible in the growing 'serious techno' circuit in Delhi and Mumbai — clubs that enforce no-photo policies, focus on sound quality, and book artists who play sets rather than hit collections.",
    marqueeItems: ["BERLIN", "TECHNO", "BERGHAIN", "ALL NIGHT", "MINIMAL"],
  },
  "goa-trance": {
    name: "Goa Trance",
    city: "Goa, India",
    decade: "1990s",
    bpmRange: "135–145 BPM",
    bg: "bg-orange",
    eyebrowColor: "text-ink",
    textColor: "text-ink",
    history:
      "In the late 1980s and early 1990s, Goa's beaches became a meeting point for Western hippies, Israeli travellers post-military service, and a loose international community who wanted to dance until dawn. DJ Goa Gil, Laurent, and Ulli synthesised new-age music, psychedelia, and early acid house into a new genre — full-moon parties at Anjuna, sound systems in the jungle, music as ritual. India's first and most globally influential contribution to electronic music.",
    keyArtists: ["Goa Gil", "Laurent", "Juno Reactor", "Hallucinogen", "Astral Projection", "Total Eclipse"],
    indiaInfluence: "Goa trance is India's only indigenous contribution to global electronic music history. Its DNA lives in the country's current psychedelic trance scene, and its communal ritual spirit influenced how Indian underground events think about the dancefloor as a space. CCD's pet-friendly, community-first ethos draws from this original spirit.",
    marqueeItems: ["GOA", "TRANCE", "FULL MOON", "ANJUNA", "RITUAL"],
  },
};

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props) {
  const { city } = await params;
  if (INDIA_SLUGS.includes(city as IndiaCitySlug)) {
    const c = INDIA_CITIES[city as IndiaCitySlug];
    return buildMetadata({
      title: `${c.label} Scene — Cats Can Dance`,
      description: `Explore the ${c.label} underground electronic music scene — upcoming events, local artists, and promoters.`,
      path: `/scenes/${city}`,
    });
  }
  if (GLOBAL_SLUGS.includes(city as GlobalSlug)) {
    const g = GLOBAL_SCENES[city as GlobalSlug];
    return buildMetadata({
      title: `${g.name} — Origin Scene — Cats Can Dance`,
      description: `The history and influence of ${g.name} on India's electronic music scene.`,
      path: `/scenes/${city}`,
    });
  }
  return buildMetadata({ title: "Scene", path: `/scenes/${city}` });
}

export default async function ScenePage({ params }: Props) {
  const { city } = await params;
  const isIndia = INDIA_SLUGS.includes(city as IndiaCitySlug);
  const isGlobal = GLOBAL_SLUGS.includes(city as GlobalSlug);

  if (!isIndia && !isGlobal) notFound();

  if (isIndia) {
    const cfg = INDIA_CITIES[city as IndiaCitySlug];
    const { events: sceneEvents, artists: sceneArtists, promoters } = await getSceneData(cfg.dbCity);

    return (
      <main className="bg-background text-foreground min-h-screen">
        <Nav />
        <PageHero
          eyebrow={`SCENE / ${cfg.label.toUpperCase()}`}
          title={cfg.label.toUpperCase()}
          bg={cfg.bg}
          textColor={cfg.textColor}
          eyebrowColor={cfg.eyebrowColor}
          shadowColor="hsl(var(--ink))"
        >
          <p className={`font-display ${cfg.textColor} opacity-80 text-xl md:text-2xl mt-2`}>{cfg.tagline}</p>
        </PageHero>

        <Marquee bg="bg-acid-yellow" items={cfg.marqueeItems} />

        <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Discover", href: "/discover" }, { label: cfg.label }]} />
        </section>

        {/* Two-column layout: editorial left, live DB right */}
        <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pb-16 md:pb-24">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Editorial column */}
            <div className="md:col-span-2 space-y-10">
              <div>
                <p className="font-display text-magenta text-base mb-3">/ THE SCENE</p>
                <p className="text-ink/80 text-lg font-medium leading-relaxed">{cfg.description}</p>
              </div>

              {/* Artists grid */}
              {sceneArtists.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-display text-ink text-2xl md:text-3xl">LOCAL ARTISTS</p>
                    <Link href={`/artists?city=${cfg.dbCity}`} className="font-display text-xs text-magenta hover:underline uppercase">All →</Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sceneArtists.map((a) => (
                      <Link
                        key={a.id}
                        href={`/artists/${a.slug}`}
                        className="group relative aspect-[4/3] border-4 border-ink overflow-hidden chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
                      >
                        {a.photoUrl ? (
                          <img src={a.photoUrl} alt={a.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="absolute inset-0 bg-acid-yellow flex items-center justify-center">
                            <Music className="w-8 h-8 text-ink/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="font-display text-cream text-xs leading-tight">{a.name.toUpperCase()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Promoters */}
              {promoters.length > 0 && (
                <div>
                  <p className="font-display text-ink text-2xl md:text-3xl mb-5">LOCAL PROMOTERS</p>
                  <div className="space-y-3">
                    {promoters.map((p) => (
                      <div key={p.id} className="border-4 border-ink bg-cream chunk-shadow p-4 flex items-center gap-4">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-12 h-12 object-cover border-2 border-ink rounded-full shrink-0" loading="lazy" />
                        ) : (
                          <div className="w-12 h-12 bg-acid-yellow border-2 border-ink rounded-full shrink-0 flex items-center justify-center">
                            <span className="font-display text-lg">{p.name[0]}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-display text-ink text-lg">{p.name}</p>
                          {p.bio && <p className="text-ink/60 text-sm line-clamp-1">{p.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sceneArtists.length === 0 && promoters.length === 0 && (
                <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-8">
                  <p className="font-display text-ink text-2xl mb-2">SCENE GROWING</p>
                  <p className="text-ink/70">Artists and promoters in {cfg.label} are joining the CCD directory soon.</p>
                </div>
              )}
            </div>

            {/* Live DB sidebar */}
            <div className="space-y-6">
              <div className="border-4 border-ink chunk-shadow">
                <div className="bg-magenta p-4 border-b-4 border-ink">
                  <p className="font-display text-cream text-sm uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Upcoming Events
                  </p>
                </div>
                {sceneEvents.length > 0 ? (
                  <div className="divide-y-4 divide-ink">
                    {sceneEvents.map((e) => (
                      <Link key={e.id} href={`/events/${e.slug}`} className="block p-4 bg-cream hover:bg-acid-yellow transition-colors group">
                        <p className="font-display text-ink text-base leading-tight group-hover:text-magenta transition-colors">{e.title.toUpperCase()}</p>
                        <p className="text-ink/60 text-xs mt-1 font-medium">{formatDate(e.startsAt)}</p>
                        {(e.venueLabel ?? e.venue?.name) && (
                          <p className="text-ink/50 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />{e.venueLabel ?? e.venue?.name}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-cream text-center">
                    <p className="font-display text-ink/50 text-sm">No upcoming events yet.</p>
                    <Link href="/events" className="font-display text-xs text-magenta hover:underline uppercase mt-2 block">Browse all events →</Link>
                  </div>
                )}
              </div>

              <Link
                href={`/artists?city=${cfg.dbCity}`}
                className="block border-4 border-ink bg-electric-blue text-cream p-5 chunk-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform"
              >
                <p className="font-display text-xs uppercase tracking-widest opacity-70 mb-2">/ ARTISTS</p>
                <p className="font-display text-2xl leading-tight mb-1">{sceneArtists.length}+ ARTISTS IN {cfg.label.toUpperCase()}</p>
                <p className="font-display text-xs text-cream/70 uppercase tracking-widest">Browse the roster →</p>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  // ── Global scene page ─────────────────────────────────────────────────────
  const cfg = GLOBAL_SCENES[city as GlobalSlug];

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <PageHero
        eyebrow={`GLOBAL ORIGIN / ${cfg.city.toUpperCase()}`}
        title={cfg.name.toUpperCase()}
        bg={cfg.bg}
        textColor={cfg.textColor}
        eyebrowColor={cfg.eyebrowColor}
        shadowColor="hsl(var(--ink))"
      >
        <p className={`font-display ${cfg.textColor} opacity-70 text-base md:text-xl mt-2`}>{cfg.city} · {cfg.decade} · {cfg.bpmRange}</p>
      </PageHero>

      <Marquee bg="bg-acid-yellow" items={cfg.marqueeItems} />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Discover", href: "/discover" }, { label: cfg.name }]} />
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pb-16 md:pb-24">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2 space-y-10">
            <div>
              <p className="font-display text-magenta text-base mb-3">/ THE HISTORY</p>
              <p className="text-ink/80 text-lg font-medium leading-relaxed">{cfg.history}</p>
            </div>
            <div>
              <p className="font-display text-magenta text-base mb-3">/ INDIA CONNECTION</p>
              <p className="text-ink/80 text-lg font-medium leading-relaxed">{cfg.indiaInfluence}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-4 border-ink chunk-shadow">
              <div className="bg-ink p-4 border-b-4 border-ink">
                <p className="font-display text-acid-yellow text-sm uppercase tracking-widest">Key Artists</p>
              </div>
              <div className="divide-y-2 divide-ink">
                {cfg.keyArtists.map((a) => (
                  <div key={a} className="px-4 py-3 bg-cream flex items-center gap-3">
                    <div className="w-2 h-2 bg-magenta border border-ink shrink-0" />
                    <p className="font-display text-ink text-sm">{a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-5">
              <p className="font-display text-ink text-xs uppercase tracking-widest mb-2">/ STATS</p>
              <div className="space-y-1">
                <p className="font-display text-ink text-2xl">{cfg.decade}</p>
                <p className="text-ink/60 text-sm">Origin decade</p>
                <p className="font-display text-ink text-2xl mt-3">{cfg.bpmRange}</p>
                <p className="text-ink/60 text-sm">Typical BPM range</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-magenta border-y-4 border-ink py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-acid-yellow text-base mb-2">/ HEAR IT IN INDIA</p>
            <h3 className="font-display text-cream text-3xl md:text-4xl leading-[0.95]">
              THIS SOUND LIVES IN<br/>INDIA&apos;S UNDERGROUND.
            </h3>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/events" className="bg-acid-yellow text-ink font-display px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform">
              SEE EVENTS →
            </Link>
            <Link href="/artists" className="bg-cream text-ink font-display px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform">
              ARTISTS →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
