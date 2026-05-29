import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/site/marquee";

export default function HomePage() {
  return (
    <main>
      {/* HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative px-4 md:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="inline-block bg-acid-yellow text-ink border-2 border-ink chunk-shadow-sm px-3 py-1 mb-6 font-display uppercase text-sm">
            India · Underground · Since 2024
          </div>

          <h1 className="font-display headline-responsive uppercase text-ink">
            Cats Can <span className="text-hot-pink ink-stroke">Dance</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg md:text-xl text-ink/80 leading-relaxed">
            Underground electronic music, parties, and culture across India.
            Discover artists, events, and scenes in Bombay, Bangalore, Goa,
            Delhi and beyond.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" variant="primary">
              <Link href="/events">Find a party</Link>
            </Button>
            <Button asChild size="lg" variant="accent">
              <Link href="/artists">Discover artists</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/discover">Explore scenes</Link>
            </Button>
          </div>
        </div>
      </section>

      <Marquee
        variant="yellow"
        size="md"
        items={["WHO WE ARE", "BANGALORE UNDERGROUND", "A CULTURE BRAND", "DANCE · PETS · STREETWEAR"]}
      />

      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-4xl md:text-6xl uppercase text-ink mb-2">
            What's coming up
          </h2>
          <p className="text-ink/60 mb-10">
            Curated by humans. Scored by AI. Real underground only.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-2 border-ink chunk-shadow bg-cream p-6 transition-transform duration-[var(--duration-cruise)] ease-[var(--ease-glide)] hover:-translate-x-1 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-bubblegum border-2 border-ink mb-4" />
                <p className="font-display uppercase text-sm text-ink/60">
                  FRI · 06 JUN · 9PM
                </p>
                <h3 className="font-display text-2xl uppercase mt-1">
                  Episode {i.toString().padStart(2, "0")}
                </h3>
                <p className="text-ink/70 mt-2">
                  Bombay · Warehouse — TBA on RSVP
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="default" size="lg">
              <Link href="/events">All events →</Link>
            </Button>
          </div>
        </div>
      </section>

      <Marquee
        variant="pink"
        size="sm"
        reverse
        items={["EPISODE 01", "EPISODE 02", "CATCH US LIVE", "BANGALORE", "RSVP NOW"]}
      />

      <footer className="px-4 md:px-8 py-12 border-t-2 border-ink">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <p className="font-display uppercase text-xl">
            © Cats Can Dance · India
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/for-artists" className="hover:underline">For artists</Link>
            <Link href="/for-venues" className="hover:underline">For venues</Link>
            <Link href="/for-investors" className="hover:underline">For investors</Link>
            <Link href="/legal" className="hover:underline">Legal</Link>
            <a href="mailto:hi@catscandance.com" className="hover:underline">hi@catscandance.com</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
