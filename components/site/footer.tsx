/**
 * Footer — direct port of CCD v1's <Footer>.
 * Substitutions:
 *   - Newsletter form: Pass 2 wires the Server Action; for now disabled with mailto fallback.
 *   - 'Discover' helper that pulls a featured post: Pass 3 (post layer not built yet).
 */
import Link from "next/link";

const groups: { title: string; links: { to: string; label: string; external?: boolean }[] }[] = [
  {
    title: "EXPLORE",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/discover", label: "Discover" },
      { to: "/events", label: "Events" },
      { to: "/shop", label: "Shop" },
    ],
  },
  {
    title: "SCENES",
    links: [
      { to: "/scenes/bangalore", label: "Bengaluru" },
      { to: "/scenes/bombay", label: "Mumbai" },
      { to: "/scenes/delhi", label: "Delhi" },
      { to: "/scenes/goa", label: "Goa" },
      { to: "/scenes/hyderabad", label: "Hyderabad" },
      { to: "/scenes/pune", label: "Pune" },
    ],
  },
  {
    title: "GENRES",
    links: [
      { to: "/sounds/techno", label: "Techno" },
      { to: "/sounds/house", label: "House" },
      { to: "/sounds/dnb", label: "Jungle / D&B" },
      { to: "/sounds/garage", label: "UK Garage" },
      { to: "/sounds/downtempo", label: "Disco" },
      { to: "/sounds/ambient", label: "Ambient" },
    ],
  },
  {
    title: "GLOBAL ORIGINS",
    links: [
      { to: "/scenes/detroit-techno", label: "Detroit Techno" },
      { to: "/scenes/chicago-house", label: "Chicago House" },
      { to: "/scenes/london-jungle", label: "London Jungle" },
      { to: "/scenes/berlin-techno", label: "Berlin Techno" },
      { to: "/scenes/goa-trance", label: "Goa Trance" },
    ],
  },
  {
    title: "WATCH & LISTEN",
    links: [
      { to: "/videos", label: "Videos" },
      { to: "/playlists", label: "Playlists" },
    ],
  },
  {
    title: "READ",
    links: [
      { to: "/blog", label: "Blog" },
      { to: "/press", label: "Press" },
      { to: "/media", label: "Media" },
      { to: "/pets", label: "Pets" },
    ],
  },
  {
    title: "PLAY",
    links: [{ to: "/cat-studio", label: "Cat Studio ✦" }],
  },
  {
    title: "PARTNERS",
    links: [
      { to: "/for-venues", label: "Venue Partners" },
      { to: "/for-artists", label: "For Artists" },
      { to: "/for-investors", label: "For Investors" },
      { to: "/book", label: "Book an Artist" },
      { to: "/promoters", label: "Promoters" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { to: "/legal#privacy", label: "Privacy" },
      { to: "/legal#terms", label: "Terms" },
      { to: "/legal#cookies", label: "Cookies" },
    ],
  },
];

const followLinks = [
  { href: "https://instagram.com/catscan.dance", label: "Instagram" },
  { href: "https://www.youtube.com/@thesecatscandance", label: "YouTube" },
  { href: "/rss.xml", label: "RSS" },
  { href: "mailto:hello@catscandance.com", label: "Email" },
];

// Captured at module load (build time) — Cache Components disallows new Date() during render.
const COPYRIGHT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <section className="relative bg-ink text-cream py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute top-8 right-8 w-14 h-14 rounded-full bg-cream border-2 border-ink chunk-shadow grid place-items-center transition-transform duration-700 hover:rotate-[-360deg]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/ccd-logo.png" alt="" loading="lazy" className="w-9" />
      </div>
      <div
        aria-hidden
        className="absolute bottom-16 left-8 w-12 h-12 rounded-full bg-cream border-2 border-ink chunk-shadow grid place-items-center transition-transform duration-700 hover:rotate-[-360deg]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/ccd-logo.png" alt="" loading="lazy" className="w-7" />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <p className="font-display text-acid-yellow text-2xl md:text-3xl mb-6 text-center">
          / JOIN THE PARTY
        </p>
        <h2 className="font-display text-5xl md:text-[8rem] leading-[0.9] text-cream text-center">
          WE'RE
          <br />
          JUST
          <br />
          <span className="text-magenta">GETTING</span>
          <br />
          <span className="text-acid-yellow ink-stroke">STARTED.</span>
        </h2>

        <a
          href="mailto:hello@catscandance.com"
          className="block w-fit mx-auto mt-10 bg-acid-yellow text-ink font-display text-2xl md:text-3xl px-10 py-5 border-4 border-cream rounded-full chunk-shadow-lg hover:-translate-y-1 transition-transform"
        >
          GET IN TOUCH →
        </a>

        <div className="mt-20 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-10 max-w-6xl mx-auto">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="font-display text-acid-yellow text-lg mb-3">{g.title}</p>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      href={l.to}
                      className="font-medium text-cream/80 hover:text-acid-yellow transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="font-display text-acid-yellow text-lg mb-3">FOLLOW</p>
            <ul className="space-y-2">
              {followLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-medium text-cream/80 hover:text-acid-yellow transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 text-cream/70 text-sm font-display text-center tracking-wide">BANGALORE</p>
        <p className="mt-2 text-cream/50 text-sm font-medium text-center">
          © {COPYRIGHT_YEAR} Cats Can Dance — so can you.
        </p>
        <nav
          aria-label="Legal"
          className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-cream/60"
        >
          <Link href="/legal#privacy" className="hover:text-acid-yellow transition-colors">
            Privacy
          </Link>
          <span aria-hidden>·</span>
          <Link href="/legal#terms" className="hover:text-acid-yellow transition-colors">
            Terms
          </Link>
          <span aria-hidden>·</span>
          <Link href="/legal#cookies" className="hover:text-acid-yellow transition-colors">
            Cookies
          </Link>
          <span aria-hidden>·</span>
          <a href="mailto:hello@catscandance.com" className="hover:text-acid-yellow transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </section>
  );
}
