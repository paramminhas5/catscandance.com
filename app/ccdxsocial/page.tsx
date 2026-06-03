/**
 * /ccdxsocial — Series explainer page
 */
import Link from "next/link";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { listUpcomingEvents } from "@/lib/db/queries";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Calendar, MapPin } from "lucide-react";

export const metadata = buildMetadata({
  title: "CCD × SOCIAL — Cats Can Dance | India's First Pet Lifestyle Dance Series",
  description:
    "CCD × SOCIAL is India's first curated pet lifestyle meets underground dance music series. 3 shows + a grand finale in Bengaluru.",
  path: "/ccdxsocial",
});

const SERIES_DATA = [
  {
    num: "01",
    date: "29 JUN 2026",
    slug: "ccdxsocial-01",
    name: "THE DEBUT",
    tag: "BROAD · WELCOMING · FIRST IMPRESSION",
    desc: "The introduction — widest possible appeal. Vendor edit covers food, accessories, grooming, photography. 2–3 curated brands. Energy is curious and excited.",
    activities: ["Pet Portrait Booth", "Lookalike Contest"],
    bg: "bg-electric-blue",
    text: "text-cream",
    accent: "text-acid-yellow",
  },
  {
    num: "02",
    date: "27 JUL 2026",
    slug: "ccdxsocial-02",
    name: "THE HEAT",
    tag: "STYLE · FASHION · MIDSUMMER ENERGY",
    desc: "All about looking good — pets and parents alike. Fashion, grooming, accessories. Vendor edit leans into apparel and grooming brands.",
    activities: ["Live Grooming Demo", "Best Dressed Contest", "Style Booth"],
    bg: "bg-magenta",
    text: "text-cream",
    accent: "text-acid-yellow",
  },
  {
    num: "03",
    date: "30 AUG 2026",
    slug: "ccdxsocial-03",
    name: "LOOSE ENDS",
    tag: "AGILITY · FINALE PREVIEW · ONE MORE",
    desc: "The most physical show of the season. Agility, competition, raw energy. Grand Finale tickets drop exclusively here.",
    activities: ["Agility Courses", "Speed Run", "Exclusive Finale Drop"],
    bg: "bg-orange",
    text: "text-ink",
    accent: "text-ink/60",
  },
  {
    num: "04",
    date: "OCT 2026",
    slug: "mega",
    name: "GRAND FINALE",
    tag: "2,000+ PAX · THE GATHERING",
    desc: "The season finale — runway, cat showcase, agility finals, vendors, DJ, and more. CCD goes large.",
    activities: ["Runway Show", "Cat Showcase", "Agility Finals", "DJ"],
    bg: "bg-acid-yellow",
    text: "text-ink",
    accent: "text-ink/50",
  },
];

const WHAT_TO_EXPECT = [
  { emoji: "🎧", title: "Underground Music", desc: "Curated DJ sets throughout — House, Disco, Garage." },
  { emoji: "🐾", title: "Pets Welcome", desc: "Bring your dog or cat. Designated pet zones with water and pee areas." },
  { emoji: "🛍️", title: "Curated Vendors", desc: "2–3 carefully selected pet lifestyle brands at every show." },
  { emoji: "🏆", title: "Activities & Contests", desc: "Rotating activities per show — different every time." },
  { emoji: "📸", title: "Content Worth Keeping", desc: "Photographer and videographer on-site. Assets shared post-event." },
  { emoji: "🎟️", title: "RSVP Only", desc: "Capped capacity. RSVP is free. First come, first in." },
];

async function NextEventCTA() {
  const upcoming = await listUpcomingEvents({ limit: 1 });
  const next = upcoming[0];
  if (!next) return null;

  return (
    <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div>
        <p className="font-display text-ink/60 text-sm mb-2">/ NEXT UP</p>
        <p className="font-display text-ink text-2xl md:text-3xl">{next.title.toUpperCase()}</p>
        <p className="text-ink/70 font-medium text-sm mt-1 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {new Date(next.startsAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}
          {(next.venueLabel ?? next.venue?.name) && (
            <><MapPin className="w-3 h-3 ml-2" />{next.venueLabel ?? next.venue?.name}</>
          )}
        </p>
      </div>
      <Link
        href={`/events/${next.slug}`}
        className="bg-ink text-cream font-display px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform whitespace-nowrap"
      >
        RSVP →
      </Link>
    </div>
  );
}

export default function CcdxSocialPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <PageHero
        eyebrow="CCD × SOCIAL"
        title={<>INDIA&apos;S FIRST<br/>PET MUSIC<br/>SERIES.</>}
        bg="bg-electric-blue"
        textColor="text-cream"
        eyebrowColor="text-acid-yellow"
        shadowColor="hsl(var(--ink))"
      >
        <p className="text-cream/80 font-display text-lg md:text-2xl mt-2">3 SHOWS + 1 GRAND FINALE · BENGALURU 2026</p>
      </PageHero>

      <Marquee
        bg="bg-acid-yellow"
        items={["CCD × SOCIAL", "PET FRIENDLY", "UNDERGROUND MUSIC", "BENGALURU 2026", "3 SHOWS + FINALE"]}
      />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "CCD × SOCIAL" }]} />
      </section>

      {/* What is CCD × SOCIAL */}
      <section className="bg-cream border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <p className="font-display text-magenta text-base mb-3">/ THE CONCEPT</p>
            <h2 className="font-display text-ink text-3xl md:text-5xl leading-[0.9] mb-6">
              WHAT IS<br/>CCD × SOCIAL?
            </h2>
            <div className="space-y-4 text-ink/80 font-medium">
              <p>India&apos;s first curated pet lifestyle meets underground dance music series. Four shows across Bengaluru — three intimate chapters and a grand season finale.</p>
              <p>Each show has a theme that goes progressively deeper into pet culture — building community and raising stakes for the next. Same DNA, different energy every time.</p>
              <p>Co-hosted with Social BLR. Pet-positive. RSVP-only. Free entry.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="border-4 border-ink bg-magenta chunk-shadow p-5 flex flex-col">
              <p className="font-display text-acid-yellow text-4xl md:text-5xl">4</p>
              <p className="font-display text-cream text-sm mt-1">Shows in Season 1</p>
            </div>
            <div className="border-4 border-ink bg-electric-blue chunk-shadow p-5 flex flex-col">
              <p className="font-display text-acid-yellow text-4xl md:text-5xl">2K+</p>
              <p className="font-display text-cream text-sm mt-1">Pax at the Finale</p>
            </div>
            <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-5 flex flex-col">
              <p className="font-display text-ink text-4xl md:text-5xl">🐾</p>
              <p className="font-display text-ink text-sm mt-1">Pets Welcome</p>
            </div>
            <div className="border-4 border-ink bg-ink chunk-shadow p-5 flex flex-col">
              <p className="font-display text-acid-yellow text-4xl md:text-5xl">FREE</p>
              <p className="font-display text-cream text-sm mt-1">RSVP (no charge)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Season timeline — 5 chapters */}
      <section className="bg-ink border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-acid-yellow text-base mb-3">/ THE SEASON</p>
          <h2 className="font-display text-cream text-3xl md:text-5xl leading-[0.9] mb-10">FOUR CHAPTERS.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERIES_DATA.map((s) => (
              <div key={s.num} className={`border-4 border-acid-yellow/30 chunk-shadow p-5 flex flex-col ${s.bg}`}>
                <div className="flex items-start justify-between mb-3">
                  <p className={`font-display text-3xl ${s.text}`}>{s.num}</p>
                  <p className={`font-display text-[10px] uppercase tracking-widest ${s.accent}`}>{s.date}</p>
                </div>
                <p className={`font-display text-lg leading-tight mb-1 ${s.text}`}>{s.name}</p>
                <p className={`font-display text-[10px] uppercase tracking-widest mb-3 ${s.accent}`}>{s.tag}</p>
                <p className={`text-sm font-medium ${s.text} opacity-70 flex-1`}>{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {s.activities.map((a) => (
                    <span key={a} className="text-[10px] font-display uppercase px-2 py-0.5 bg-black/10 text-current border border-current/20">
                      {a}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/events/${s.slug}`}
                  className={`mt-4 font-display text-xs uppercase tracking-widest ${s.accent} hover:opacity-100 opacity-60 transition-opacity`}
                >
                  View event →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-cream border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-magenta text-base mb-3">/ DETAILS</p>
          <h2 className="font-display text-ink text-3xl md:text-5xl leading-[0.9] mb-8">WHAT TO EXPECT.</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WHAT_TO_EXPECT.map((w) => (
              <div key={w.title} className="border-4 border-ink bg-cream chunk-shadow p-5">
                <p className="text-3xl mb-3">{w.emoji}</p>
                <p className="font-display text-ink text-lg mb-1">{w.title.toUpperCase()}</p>
                <p className="text-ink/70 text-sm font-medium">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pet-friendly details */}
      <section className="bg-acid-yellow border-b-4 border-ink py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-ink/60 text-base mb-3">/ PET INFO</p>
          <h2 className="font-display text-ink text-2xl md:text-4xl mb-6">BRINGING A PET? HERE&apos;S WHAT YOU NEED TO KNOW.</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Designated Pet Zone", desc: "A separate outdoor area with water stations, pee/poo corners, and easy street access." },
              { title: "Friendly Crowd", desc: "The whole event is built around pets. You won't be the only one who brought their dog." },
              { title: "All Sizes Welcome", desc: "Dogs, cats, and other companion animals. Please keep pets on a leash or in a carrier in public areas." },
            ].map((item) => (
              <div key={item.title} className="border-4 border-ink bg-cream chunk-shadow p-5">
                <p className="font-display text-ink text-lg mb-2">{item.title.toUpperCase()}</p>
                <p className="text-ink/70 text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next event RSVP CTA */}
      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-12 md:py-16">
        <p className="font-display text-magenta text-base mb-5">/ RSVP</p>
        <Suspense fallback={
          <div className="border-4 border-ink bg-acid-yellow p-8 animate-pulse">
            <div className="h-8 bg-ink/10 w-48 mb-2" />
            <div className="h-4 bg-ink/10 w-32" />
          </div>
        }>
          <NextEventCTA />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}
