/**
 * Homepage — direct port of CCD v1's Index.tsx composition.
 *
 * Pass 1 (this commit) ports the spine: Nav, Hero, identity strip, CityMarquee,
 * marquee strips, About, EventsStrip, Footer. Dynamic data (next-event urgency
 * strip + events strip) lives in async RSC islands wrapped in <Suspense> so
 * the static shell prerenders cleanly with Cache Components.
 *
 * Pass 2 will add: Catbot, MoonwalkCat, DiscoBall + Lasers, SectionDots,
 * SectionReveal wrapper, EarlyAccess, Contact, platform stats strip.
 *
 * Pass 3 will add: CcdxSocialHomeStrip, Videos, Playlist, Drops, Instagram,
 * GenreWheel, ArtistSpotlight, SceneSnapshot.
 */
import { Suspense } from "react";
import { buildMetadata, JsonLd, organizationSchema, websiteSchema } from "@/lib/seo";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { HeroUrgencyStrip } from "@/components/site/hero-urgency-strip";
import { CityMarquee } from "@/components/site/city-marquee";
import { Marquee } from "@/components/site/marquee";
import { About } from "@/components/site/about";
import { HomeEventsIsland } from "@/components/site/home-events-island";
import { EventsStripSkeleton } from "@/components/site/events-strip-skeleton";
import { Footer } from "@/components/site/footer";

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

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: HOMEPAGE_FAQ },
        ]}
      />
      <main className="bg-background text-foreground">
        <Nav />

        <Hero>
          <Suspense fallback={null}>
            <HeroUrgencyStrip />
          </Suspense>
        </Hero>

        {/* Identity strip — one sentence for first-time visitors */}
        <div className="bg-ink border-b-4 border-ink py-3 px-4">
          <p className="mx-auto w-full max-w-[1200px] font-display text-cream text-xs md:text-sm uppercase tracking-[0.18em] text-center">
            Bengaluru underground crew · Dance music episodes · Limited streetwear drops
          </p>
        </div>

        <CityMarquee />

        {/* Marquee slot: above-about */}
        <Marquee
          bg="bg-acid-yellow"
          size="lg"
          items={[
            "WHO WE ARE",
            "BANGALORE UNDERGROUND",
            "A CULTURE BRAND",
            "DANCE · PETS · STREETWEAR",
          ]}
        />

        <About />

        {/* Marquee slot: above-events */}
        <Marquee
          bg="bg-orange"
          size="sm"
          reverse
          items={["EPISODE 01", "EPISODE 02", "CATCH US LIVE", "BANGALORE", "RSVP NOW"]}
        />

        <Suspense fallback={<EventsStripSkeleton />}>
          <HomeEventsIsland />
        </Suspense>

        <Footer />
      </main>
    </>
  );
}
