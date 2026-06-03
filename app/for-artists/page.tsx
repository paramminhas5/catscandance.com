/**
 * /for-artists — Artist portal landing + inquiry form
 */
import { buildMetadata } from "@/lib/seo";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArtistInquiryForm } from "./artist-inquiry-form";

export const metadata = buildMetadata({
  title: "For Artists — Cats Can Dance | Get Listed & Get Booked",
  description:
    "Get listed in the CCD artist directory, receive booking inquiries, and build your profile in India's underground music platform.",
  path: "/for-artists",
});

const BENEFITS = [
  { num: "01", title: "PROFILE PAGE", desc: "A full artist profile with your bio, genres, discography, audio embeds, and city." },
  { num: "02", title: "BOOKING INQUIRIES", desc: "Promoters and fans can send you booking requests directly through your profile." },
  { num: "03", title: "GIGOGRAPHY", desc: "Your CCD shows appear on your profile — building your public track record." },
  { num: "04", title: "EDITORIAL FEATURES", desc: "Get featured in CCD's blog, playlists, and social channels." },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "SUBMIT YOUR PROFILE",
    desc: "Fill in the form below with your name, city, genre, and links. We review every submission.",
    bg: "bg-acid-yellow",
    text: "text-ink",
  },
  {
    step: "02",
    title: "WE BUILD YOUR PAGE",
    desc: "Our team creates your artist profile page at catscandance.com/artists/[your-name].",
    bg: "bg-electric-blue",
    text: "text-cream",
  },
  {
    step: "03",
    title: "GET DISCOVERED",
    desc: "Your profile is searchable and visible to promoters, bookers, and fans across India.",
    bg: "bg-magenta",
    text: "text-cream",
  },
];

export default function ForArtistsPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <PageHero
        eyebrow="FOR ARTISTS"
        title={<>A PLATFORM,<br/>NOT JUST<br/>A SET TIME.</>}
        bg="bg-orange"
        textColor="text-ink"
        eyebrowColor="text-ink/60"
        shadow={false}
      />

      <Marquee bg="bg-magenta" items={["GET LISTED", "GET BOOKED", "BUILD YOUR PROFILE", "CCD ROSTER"]} />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For Artists" }]} />
      </section>

      {/* Value prop */}
      <section className="bg-cream border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <p className="font-display text-magenta text-base mb-3">/ WHAT YOU GET</p>
            <h2 className="font-display text-ink text-3xl md:text-5xl leading-[0.9] mb-6">
              BUILD AN<br/>AUDIENCE,<br/>NOT JUST<br/>A NIGHT.
            </h2>
            <p className="text-ink/80 text-lg font-medium leading-relaxed">
              Most gigs are transactional. CCD turns each set into a content drop, a community moment, and something people want to experience again.
            </p>
          </div>
          <div className="space-y-3">
            {BENEFITS.map((b) => (
              <div key={b.num} className="border-4 border-ink bg-orange chunk-shadow p-5 flex gap-4">
                <span className="font-display text-ink/40 text-lg shrink-0">{b.num}</span>
                <div>
                  <p className="font-display text-ink text-lg mb-1">{b.title}</p>
                  <p className="text-ink/70 text-sm font-medium">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink border-b-4 border-ink py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <p className="font-display text-acid-yellow text-base mb-3">/ HOW IT WORKS</p>
          <h2 className="font-display text-cream text-3xl md:text-5xl leading-[0.9] mb-8">THREE STEPS.</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className={`border-4 border-ink chunk-shadow p-6 ${step.bg}`}>
                <p className={`font-display text-5xl mb-3 ${step.text} opacity-30`}>{step.step}</p>
                <p className={`font-display text-xl mb-2 ${step.text}`}>{step.title}</p>
                <p className={`text-sm font-medium ${step.text} opacity-70`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section className="bg-cream border-b-4 border-ink py-12 md:py-20" id="submit">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="font-display text-magenta text-base mb-3">/ APPLY</p>
              <h2 className="font-display text-ink text-3xl md:text-5xl leading-[0.9] mb-4">SUBMIT YOUR PROFILE</h2>
              <p className="text-ink/70 font-medium">
                We listen to everything. We&apos;re building the most comprehensive directory of India&apos;s underground electronic music artists.
              </p>
              <p className="text-ink/50 text-sm mt-4">
                Already booked with CCD? Email <a href="mailto:hello@catscandance.com" className="text-magenta hover:underline">hello@catscandance.com</a> to claim your existing profile.
              </p>
            </div>
            <ArtistInquiryForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
