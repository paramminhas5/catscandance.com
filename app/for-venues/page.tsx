/**
 * /for-venues — Venue partner landing + inquiry form
 */
import { buildMetadata } from "@/lib/seo";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { VenueInquiryForm } from "./venue-inquiry-form";

export const metadata = buildMetadata({
  title: "For Venues — Cats Can Dance | Host a CCD Night",
  description:
    "Partner with CCD to host an underground dance music night. We bring the audience, curation, promotion, and sound knowledge.",
  path: "/for-venues",
});

const WHAT_CCD_BRINGS = [
  {
    num: "01",
    title: "THE AUDIENCE",
    desc: "A curated RSVP crowd — 24-45, culture-obsessed, high-repeat. Not randoms. Our crowd knows what they came for.",
    bg: "bg-acid-yellow",
    text: "text-ink",
  },
  {
    num: "02",
    title: "THE CURATION",
    desc: "We handle the lineup, the DJ booking, the sound requirements and the creative direction. You focus on the venue.",
    bg: "bg-electric-blue",
    text: "text-cream",
  },
  {
    num: "03",
    title: "THE PROMOTION",
    desc: "RSVP-only format means no door anxiety. Our email list, Instagram, and community generates pre-filled rooms.",
    bg: "bg-magenta",
    text: "text-cream",
  },
  {
    num: "04",
    title: "THE CONTENT",
    desc: "Photographer and videographer on-site. Full set recordings. Assets delivered to you within a week of the show.",
    bg: "bg-orange",
    text: "text-ink",
  },
];

const REQUIREMENTS = [
  "Capacity 100+ (outdoor or indoor)",
  "Sound system (or we bring ours)",
  "Bar service operational during the show",
  "Outdoor space preferred — pet-positive is a plus",
  "Permits for DJ/live music",
  "Easy access — walk-in and RSVP check-in friendly",
];

export default function ForVenuesPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <PageHero
        eyebrow="FOR VENUES"
        title={<>HOST THE<br/>NIGHT.</>}
        bg="bg-electric-blue"
        textColor="text-cream"
        eyebrowColor="text-acid-yellow"
        shadowColor="hsl(var(--ink))"
      >
        <p className="text-cream/80 font-display text-lg md:text-2xl mt-2">
          PARTNER WITH CCD. WE BRING EVERYTHING ELSE.
        </p>
      </PageHero>

      <Marquee bg="bg-acid-yellow" items={["VENUE PARTNERS", "CCD NIGHTS", "FULL SERVICE", "BENGALURU + BEYOND"]} />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For Venues" }]} />
      </section>

      {/* What CCD brings */}
      <section className="bg-cream border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-magenta text-base mb-3">/ WHAT WE BRING</p>
          <h2 className="font-display text-ink text-3xl md:text-5xl leading-[0.9] mb-8">
            YOU PROVIDE THE SPACE.<br/>WE DO THE REST.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHAT_CCD_BRINGS.map((w) => (
              <div key={w.num} className={`border-4 border-ink chunk-shadow p-6 ${w.bg}`}>
                <p className={`font-display text-5xl mb-3 opacity-20 ${w.text}`}>{w.num}</p>
                <p className={`font-display text-2xl mb-2 ${w.text}`}>{w.title}</p>
                <p className={`text-sm font-medium ${w.text} opacity-75`}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-ink border-b-4 border-ink py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <p className="font-display text-acid-yellow text-base mb-3">/ REQUIREMENTS</p>
            <h2 className="font-display text-cream text-3xl md:text-5xl leading-[0.9] mb-6">
              WHAT WE NEED FROM YOU.
            </h2>
            <p className="text-cream/70 font-medium">
              We work with venues of all sizes. The key requirement is a space that takes music seriously and a team that cares about the crowd&apos;s experience.
            </p>
          </div>
          <div>
            <ul className="space-y-3">
              {REQUIREMENTS.map((r, i) => (
                <li key={r} className="flex items-start gap-3 border-4 border-acid-yellow/20 bg-cream/5 p-4">
                  <span className="font-display text-acid-yellow text-sm shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-cream/80 font-medium text-sm">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section className="bg-cream border-b-4 border-ink py-12 md:py-20" id="enquire">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <p className="font-display text-magenta text-base mb-3">/ GET IN TOUCH</p>
            <h2 className="font-display text-ink text-3xl md:text-5xl leading-[0.9] mb-4">
              INTERESTED IN HOSTING?
            </h2>
            <p className="text-ink/70 font-medium mb-4">
              Tell us about your space. We&apos;ll get back to you within a few days to talk through what a CCD night at your venue could look like.
            </p>
            <p className="text-ink/50 text-sm">
              Or email us directly: <a href="mailto:hello@catscandance.com" className="text-magenta hover:underline">hello@catscandance.com</a>
            </p>
          </div>
          <VenueInquiryForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
