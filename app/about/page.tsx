/**
 * /about — Brand story page
 */
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About — Cats Can Dance | Bangalore's Underground Crew",
  description:
    "The mission, the people and the pack behind Cats Can Dance — Bangalore's underground dance music and culture crew.",
  path: "/about",
});

const PILLARS = [
  {
    icon: "🎧",
    label: "MUSIC",
    desc: "Underground dance music parties built around sound, design and the room. House, Disco, Garage, Jungle, D&B. No flyers, no hype — just good rooms and better music.",
    bg: "bg-magenta",
    text: "text-cream",
  },
  {
    icon: "🐾",
    label: "PETS",
    desc: "India's first pet-positive dance music event series. Bring your dog, your cat, your chaos. The dancefloor is for everyone in the pack.",
    bg: "bg-acid-yellow",
    text: "text-ink",
  },
  {
    icon: "🎨",
    label: "CULTURE",
    desc: "Limited drops, wearable culture, editorial content. A brand built by and for the people who show up — dancers, designers, photographers, pet people.",
    bg: "bg-electric-blue",
    text: "text-cream",
  },
];

const TIMELINE = [
  {
    date: "APR 2025",
    label: "Bar Wild",
    desc: "The first CCD night. A basement show at Bar Wild in Indiranagar, Bengaluru. 80 people. House and Disco. The pack found each other.",
    bg: "bg-ink",
    text: "text-cream",
    accent: "text-acid-yellow",
  },
  {
    date: "JUN 2026",
    label: "CCD × SOCIAL 01",
    desc: "The debut of the CCD × SOCIAL series at Social BLR. India's first curated pet lifestyle meets underground dance music. ~200 pax.",
    bg: "bg-electric-blue",
    text: "text-cream",
    accent: "text-acid-yellow",
  },
  {
    date: "JUL 2026",
    label: "CCD × SOCIAL 02",
    desc: "Show 02 — The Heat. Style, grooming, best-dressed contests. The crowd doubles. The sound gets louder.",
    bg: "bg-magenta",
    text: "text-cream",
    accent: "text-acid-yellow",
  },
  {
    date: "AUG 2026",
    label: "CCD × SOCIAL 03",
    desc: "Loose Ends — agility courses, finale ticket drops, the season's most physical show.",
    bg: "bg-orange",
    text: "text-ink",
    accent: "text-ink/60",
  },
  {
    date: "OCT 2026",
    label: "MEGA",
    desc: "The Grand Finale. 2,000+ pax. Runway, cat showcase, agility finals. CCD goes large.",
    bg: "bg-acid-yellow",
    text: "text-ink",
    accent: "text-ink/60",
  },
];

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Cats Can Dance",
  url: "https://catscandance.com/about",
  description: "Cats Can Dance is a Bangalore underground crew. Dance music nights, limited drops, and a community built around sound and culture.",
};

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <JsonLd data={aboutLd} />
      <Nav />

      <PageHero
        eyebrow="ABOUT"
        title={<>MUSIC.<br/>PETS.<br/>CULTURE.</>}
        bg="bg-magenta"
        textColor="text-cream"
        eyebrowColor="text-acid-yellow"
        shadowColor="hsl(var(--ink))"
      >
        <p className="text-cream/80 font-display text-xl md:text-2xl mt-2">A CULTURE BRAND FROM BANGALORE.</p>
      </PageHero>

      <Marquee bg="bg-acid-yellow" items={["BENGALURU", "UNDERGROUND", "DANCE MUSIC", "PET FRIENDLY", "SINCE 2025"]} />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      </section>

      {/* Mission */}
      <section className="bg-cream border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <p className="font-display text-magenta text-base mb-3">/ MISSION</p>
              <h2 className="font-display text-ink text-4xl md:text-6xl leading-[0.9] mb-6">
                A HOME<br/>FOR PEOPLE<br/>WHO MOVE.
              </h2>
            </div>
            <div className="space-y-5 text-ink/80 text-lg font-medium">
              <p>
                Cats Can Dance started in Bangalore as a small crew obsessed with dance music, design and the
                feeling of a great room. We&apos;re building a culture brand for the people who actually show up —
                dancers, DJs, designers, pet people and the kind of crowd that travels for a night.
              </p>
              <p>
                We started in April 2025 at Bar Wild. One small basement show, 80 people, and the feeling
                that something real was being built. We make nights worth remembering, drops worth keeping
                and a community worth being part of.
              </p>
              <p>That&apos;s it. That&apos;s the brief.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="bg-ink border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-acid-yellow text-base mb-3">/ WHAT WE DO</p>
          <h2 className="font-display text-cream text-3xl md:text-5xl leading-[0.95] mb-8"
            style={{ filter: "drop-shadow(5px 5px 0 hsl(var(--magenta)))" }}>
            THREE THINGS.<br/>DONE PROPERLY.
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PILLARS.map((p) => (
              <div key={p.label} className={`border-4 border-ink chunk-shadow p-6 ${p.bg}`}>
                <p className={`text-4xl mb-3`}>{p.icon}</p>
                <p className={`font-display text-3xl md:text-4xl mb-3 ${p.text}`}>{p.label}</p>
                <p className={`font-medium leading-snug text-sm ${p.text} opacity-80`}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cream border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-magenta text-base mb-3">/ TIMELINE</p>
          <h2 className="font-display text-ink text-3xl md:text-5xl leading-[0.9] mb-10">HOW WE GOT HERE.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TIMELINE.map((t, i) => (
              <div key={t.date} className={`relative border-4 border-ink chunk-shadow p-5 ${t.bg} flex flex-col justify-between min-h-[200px]`}>
                <div>
                  <p className={`font-display text-[10px] uppercase tracking-widest mb-1 ${t.accent}`}>
                    {String(i + 1).padStart(2, "0")} / {t.date}
                  </p>
                  <p className={`font-display text-xl leading-tight mb-3 ${t.text}`}>{t.label.toUpperCase()}</p>
                </div>
                <p className={`text-sm font-medium ${t.text} opacity-70`}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team placeholder */}
      <section className="bg-ink border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-acid-yellow text-base mb-3">/ THE PACK</p>
          <h2 className="font-display text-cream text-3xl md:text-5xl leading-[0.9] mb-8">BUILT BY HUMANS WHO MOVE.</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { role: "FOUNDER & CREATIVE", name: "Cats Can Dance", city: "Bengaluru" },
              { role: "RESIDENT SELECTOR", name: "Djazz", city: "Bengaluru" },
              { role: "RESIDENT SELECTOR", name: "Hedz", city: "Bengaluru" },
            ].map((m) => (
              <div key={m.name} className="border-4 border-acid-yellow/20 bg-cream/5 p-5">
                <div className="w-12 h-12 bg-acid-yellow border-4 border-acid-yellow/40 mb-4 flex items-center justify-center">
                  <span className="font-display text-ink text-xl">{m.name[0]}</span>
                </div>
                <p className="font-display text-acid-yellow text-[10px] uppercase tracking-widest mb-1">{m.role}</p>
                <p className="font-display text-cream text-xl">{m.name}</p>
                <p className="text-cream/40 text-sm">{m.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-acid-yellow border-b-4 border-ink py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-ink/60 text-base mb-2">/ JOIN THE PACK</p>
            <h3 className="font-display text-ink text-3xl md:text-5xl leading-[0.9]">
              GET EARLY ACCESS.<br/>BE FIRST.
            </h3>
          </div>
          <a
            href="/#early-access"
            className="bg-ink text-cream font-display text-lg px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform whitespace-nowrap"
          >
            EARLY ACCESS →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
