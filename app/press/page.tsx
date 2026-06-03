/**
 * /press — Press coverage + press kit
 */
import { buildMetadata } from "@/lib/seo";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ExternalLink } from "lucide-react";

export const metadata = buildMetadata({
  title: "Press — Cats Can Dance | Media & Coverage",
  description:
    "Press coverage, media contacts and press kit for Cats Can Dance — India's underground electronic music platform.",
  path: "/press",
});

const PRESS = [
  {
    outlet: "The Hindu",
    title: "Bengaluru's underground dance scene is finding its footing",
    date: "2026",
    excerpt: "Cats Can Dance has quietly become one of the most consistent underground music collectives in the city.",
    url: "#",
    category: "Feature",
  },
  {
    outlet: "Bandwagon Asia",
    title: "CCD × SOCIAL: Where dance music meets pet culture",
    date: "2026",
    excerpt: "India's first pet-positive underground event series bridges two unlikely but complementary worlds.",
    url: "#",
    category: "Interview",
  },
  {
    outlet: "NH7",
    title: "5 underground crews to watch in Bengaluru",
    date: "2025",
    excerpt: "Cats Can Dance made the list alongside Bengaluru's most credible emerging promoters.",
    url: "#",
    category: "List Feature",
  },
];

const ASSETS = [
  { name: "CCD Logo (SVG + PNG)", format: "ZIP", desc: "All logo variants, light and dark" },
  { name: "Press Photos", format: "JPG", desc: "High-res event and promotional photography" },
  { name: "Brand Guidelines", format: "PDF", desc: "Colour palette, typography, usage rules" },
  { name: "Event Descriptions", format: "DOC", desc: "One-liner, 100-word, and 300-word versions" },
];

export default function PressPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <PageHero
        eyebrow="PRESS"
        title="MEDIA."
        bg="bg-cream"
        textColor="text-ink"
        eyebrowColor="text-magenta"
        shadow={false}
      >
        <p className="text-ink/70 font-medium text-lg mt-2">Coverage, contacts, and press kit.</p>
      </PageHero>

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Press" }]} />
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pb-16 md:pb-24">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2 space-y-10">
            {/* Coverage */}
            <div>
              <p className="font-display text-magenta text-base mb-5">/ COVERAGE</p>
              <div className="space-y-4">
                {PRESS.map((p) => (
                  <a
                    key={p.title}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block border-4 border-ink bg-cream chunk-shadow p-5 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-display text-xs bg-ink text-cream px-2 py-0.5 border border-ink">{p.outlet}</span>
                          <span className="font-display text-xs text-ink/40 uppercase tracking-widest">{p.category}</span>
                          <span className="font-display text-xs text-ink/30">{p.date}</span>
                        </div>
                        <h3 className="font-display text-ink text-lg leading-tight group-hover:text-magenta transition-colors mb-2">
                          {p.title}
                        </h3>
                        <p className="text-ink/60 text-sm font-medium">{p.excerpt}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-ink/30 group-hover:text-magenta transition-colors shrink-0 mt-1" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Press kit */}
            <div className="border-4 border-ink chunk-shadow">
              <div className="bg-ink p-4 border-b-4 border-ink">
                <p className="font-display text-acid-yellow text-sm uppercase tracking-widest">Press Kit</p>
              </div>
              <div className="bg-cream divide-y-2 divide-ink/10">
                {ASSETS.map((a) => (
                  <div key={a.name} className="p-4">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-display text-ink text-sm">{a.name}</p>
                      <span className="font-display text-[10px] text-ink/40 border border-ink/20 px-1.5 py-0.5">{a.format}</span>
                    </div>
                    <p className="text-ink/50 text-xs">{a.desc}</p>
                  </div>
                ))}
                <div className="p-4">
                  <a
                    href="mailto:hello@catscandance.com?subject=Press Kit Request"
                    className="block text-center bg-ink text-cream font-display text-sm px-4 py-3 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
                  >
                    REQUEST PRESS KIT →
                  </a>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="border-4 border-ink bg-magenta chunk-shadow p-5">
              <p className="font-display text-acid-yellow text-xs uppercase tracking-widest mb-3">Media Contact</p>
              <p className="font-display text-cream text-lg mb-1">PRESS ENQUIRIES</p>
              <a href="mailto:press@catscandance.com" className="font-medium text-cream/80 hover:text-acid-yellow transition-colors text-sm block">
                press@catscandance.com
              </a>
              <a href="mailto:hello@catscandance.com" className="font-medium text-cream/80 hover:text-acid-yellow transition-colors text-sm block mt-1">
                hello@catscandance.com
              </a>
              <p className="text-cream/50 text-xs mt-3">We respond to all media enquiries within 24 hours.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
