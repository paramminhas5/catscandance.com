/**
 * Homepage — faithful port of CCD v1's Index.tsx
 *
 * Pass 1: Nav, Hero, identity strip, CityMarquee, marquees, About, Events, Footer
 * Pass 2 (this commit): + DiscoProvider, MoonwalkCat, DiscoBall+Lasers in Hero,
 *   DiscoButton+DiscoMute+DiscoHint in Nav, SectionReveal wrapping every section,
 *   SectionDots, ScrollPaw, Stats, EarlyAccess (Server Action), Contact (Server Action),
 *   platform stats strip, smooth scroll, Confetti.
 *
 * Pass 3 (next): CcdxSocialHomeStrip, Videos, Playlist, Drops, Instagram,
 *   GenreWheel, ArtistSpotlight, SceneSnapshot.
 */
import { Suspense } from "react";
import { buildMetadata, JsonLd, organizationSchema, websiteSchema } from "@/lib/seo";
import { HomepageProviders } from "@/components/site/homepage-providers";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { HeroUrgencyStrip } from "@/components/site/hero-urgency-strip";
import { CityMarquee } from "@/components/site/city-marquee";
import { Marquee } from "@/components/site/marquee";
import { About } from "@/components/site/about";
import { HomeEventsIsland } from "@/components/site/home-events-island";
import { EventsStripSkeleton } from "@/components/site/events-strip-skeleton";
import { Footer } from "@/components/site/footer";
import { SectionReveal } from "@/components/site/section-reveal";
import { SectionDots } from "@/components/site/section-dots";
import { MoonwalkCat } from "@/components/site/moonwalk-cat";
import { ScrollPaw } from "@/components/site/scroll-paw";
import { Stats } from "@/components/site/stats";

import { Contact } from "@/components/site/contact";
import { PlatformStatsStrip } from "@/components/site/platform-stats";
import { EarlyAccessIsland } from "@/components/site/early-access-island";

export const metadata = buildMetadata({
  title: "Cats Can Dance — India's Underground Electronic Music Scene",
  description:
    "Discover India's underground electronic music scene. Events in Bengaluru, Mumbai, Delhi & Goa. Artist directory, genre guides, global scene origins and limited apparel drops.",
  path: "/",
  keywords: [
    "india electronic music",
    "bangalore underground",
    "mumbai techno",
    "delhi house",
    "goa trance",
    "electronic music india",
    "cats can dance",
    "jungle drum bass india",
  ],
});

const HOMEPAGE_FAQ = [
  {
    "@type": "Question",
    name: "What is Cats Can Dance?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Cats Can Dance is a Bengaluru-based underground dance music event series and streetwear collective, hosting House, Disco, Jungle, Garage, and Drum & Bass nights across Bengaluru venues, and producing limited-edition streetwear drops rooted in dance music culture.",
    },
  },
  {
    "@type": "Question",
    name: "Where does Cats Can Dance host events in Bangalore?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Cats Can Dance hosts RSVP-only underground dance music episodes at venues across Bengaluru. All upcoming events are listed at catscandance.com/events.",
    },
  },
  {
    "@type": "Question",
    name: "What music genres does Cats Can Dance play?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Cats Can Dance events feature House, Disco, Jungle, Garage, and Drum & Bass — underground dance music genres curated by resident and guest selectors in Bengaluru.",
    },
  },
  {
    "@type": "Question",
    name: "Does Cats Can Dance sell streetwear?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Yes. Cats Can Dance produces limited-edition streetwear drops rooted in underground dance music culture, screen-printed in Bangalore. Available at catscandance.com/shop.",
    },
  },
  {
    "@type": "Question",
    name: "How do I RSVP to a Cats Can Dance event?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "RSVP to upcoming Cats Can Dance events at catscandance.com/events. Capacity is limited — RSVP early. Most episodes are free entry with name on the door.",
    },
  },
];

export default async function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: HOMEPAGE_FAQ },
        ]}
      />

      <HomepageProviders>
        {/* Fixed chrome */}
        <SectionDots />
        <MoonwalkCat />
        <ScrollPaw />

      <main className="bg-background text-foreground">
        <Nav />

        {/* ── Hero — full viewport, electric-blue ── */}
        <Hero>
          <Suspense fallback={null}>
            <HeroUrgencyStrip />
          </Suspense>
        </Hero>

        {/* ── Identity strip ── */}
        <div className="bg-ink border-b-4 border-ink py-3 px-4">
          <p className="mx-auto w-full max-w-[1200px] font-display text-cream text-xs md:text-sm uppercase tracking-[0.18em] text-center">
            Bengaluru underground crew · Dance music episodes · Limited streetwear drops
          </p>
        </div>

        {/* ── Platform social proof (streams in from DB) ── */}
        <Suspense fallback={null}>
          <PlatformStatsStrip />
        </Suspense>

        <CityMarquee />

        {/* ── Marquee: above-about ── */}
        <Marquee
          bg="bg-acid-yellow"
          size="lg"
          items={["WHO WE ARE", "BANGALORE UNDERGROUND", "A CULTURE BRAND", "DANCE · PETS · STREETWEAR"]}
        />

        <SectionReveal>
          <About />
        </SectionReveal>

        {/* ── Early Access — email capture is the #1 conversion action ── */}
        <SectionReveal>
          <Suspense fallback={null}>
            <EarlyAccessIsland />
          </Suspense>
        </SectionReveal>

        {/* ── Marquee: above-events ── */}
        <Marquee
          bg="bg-orange"
          size="sm"
          reverse
          items={["EPISODE 01", "EPISODE 02", "CATCH US LIVE", "BANGALORE", "RSVP NOW"]}
        />

        <SectionReveal>
          <Suspense fallback={<EventsStripSkeleton />}>
            <HomeEventsIsland />
          </Suspense>
        </SectionReveal>

        {/* ── Stats ── */}
        <SectionReveal>
          <Stats />
        </SectionReveal>

        {/* ── Contact ── */}
        <SectionReveal>
          <Contact />
        </SectionReveal>

        <Footer />
      </main>
      </HomepageProviders>
    </>
  );
}
