/**
 * /book — Artist booking hub
 * Browse artists from DB, select → booking inquiry form
 */
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { listArtists } from "@/lib/db/queries";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BookArtistClient } from "./book-artist-client";

export const metadata = buildMetadata({
  title: "Book an Artist — Cats Can Dance",
  description:
    "Book artists from the CCD roster for your event. Send a booking inquiry directly through CCD.",
  path: "/book",
});

async function ArtistList() {
  const artists = await listArtists({ limit: 48 });
  const serialized = artists.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    primaryCity: a.primaryCity ?? "",
    genres: a.genres ?? [],
    photoUrl: a.photoUrl ?? null,
    isFeatured: a.isFeatured,
  }));
  return <BookArtistClient artists={serialized} />;
}

export default function BookPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <PageHero
        eyebrow="BOOKING"
        title={<>BOOK AN<br/>ARTIST.</>}
        bg="bg-orange"
        textColor="text-ink"
        eyebrowColor="text-ink/60"
        shadow={false}
      >
        <p className="text-ink/70 font-medium text-lg mt-2 max-w-xl">
          Browse the CCD roster and send a booking inquiry. We&apos;ll connect you with the artist.
        </p>
      </PageHero>

      <Marquee bg="bg-ink" items={["BOOKING", "ENQUIRIES", "CCD ROSTER", "UNDERGROUND ARTISTS", "INDIA"]} />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Book an Artist" }]} />
      </section>

      <Suspense fallback={
        <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="aspect-square bg-ink/10 animate-pulse border-4 border-ink" />
            ))}
          </div>
        </section>
      }>
        <ArtistList />
      </Suspense>

      {/* Can't find CTA */}
      <section className="bg-acid-yellow border-y-4 border-ink py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-ink/60 text-base mb-2">/ NOT LISTED?</p>
            <h3 className="font-display text-ink text-2xl md:text-4xl leading-[0.9]">
              CAN&apos;T FIND WHO<br/>YOU&apos;RE LOOKING FOR?
            </h3>
            <p className="text-ink/70 font-medium mt-2">Tell us who you want to book and we&apos;ll do our best to help.</p>
          </div>
          <a
            href="mailto:hello@catscandance.com?subject=Booking Inquiry"
            className="shrink-0 bg-ink text-cream font-display px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform whitespace-nowrap"
          >
            EMAIL US →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
