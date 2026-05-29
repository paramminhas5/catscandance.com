"use client";
/**
 * Nav — direct port of CCD v1's <Nav>.
 * Substitutions:
 *   - react-router NavLink/useLocation → next/link + usePathname
 *   - Clerk hooks → Better Auth (Pass 2 wiring; for now, Sign In links to /sign-in)
 *   - DiscoButton/DiscoMute/DiscoHint → temporarily disabled (Pass 2)
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { to: "/about", label: "About" },
  { to: "/discover", label: "Discover" },
  { to: "/events", label: "Events" },
  { to: "/ccdxsocial", label: "Series" },
  { to: "/artists", label: "Artists" },
  { to: "/shop", label: "Shop" },
];

const partnersLinks = [
  { to: "/talent", label: "Talent Directory" },
  { to: "/for-venues", label: "For Venues" },
  { to: "/for-artists", label: "For Artists" },
  { to: "/for-investors", label: "For Investors" },
  { to: "/book", label: "Book an Artist" },
  { to: "/promoters", label: "Promoters" },
];

const moreLinks: { to: string; label: string; external?: boolean }[] = [
  { to: "/care", label: "Cats Can Care" },
  { to: "/videos", label: "Videos" },
  { to: "/playlists", label: "Playlists" },
  { to: "/pets", label: "Pets" },
  { to: "/blog", label: "Blog" },
  { to: "https://learn.catscandance.com", label: "Learn", external: true },
];

const lightBgRoutes = ["/about", "/blog", "/media", "/press", "/playlists", "/videos", "/cat-studio"];

function Dropdown({
  label,
  links,
  scrolled,
}: {
  label: string;
  links: { to: string; label: string; external?: boolean }[];
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const pathname = usePathname() ?? "/";
  const isActive = links.some((l) => pathname.startsWith(l.to));

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const activeColor = scrolled ? "text-magenta" : "text-acid-yellow";
  const baseColor = scrolled ? "text-ink" : "text-cream";

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "font-display text-base transition-colors inline-flex items-baseline gap-1",
          isActive ? activeColor : baseColor,
          `hover:${activeColor}`
        )}
      >
        {label} <ChevronDown className="w-4 h-4 self-center" />
      </button>
      {open ? (
        <div className="absolute top-full right-0 pt-2 min-w-[180px] z-50">
          <ul className="py-1 bg-cream border-4 border-ink chunk-shadow">
            {links.map((l) => (
              <li key={l.to}>
                {l.external ? (
                  <a
                    href={l.to}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 font-display text-base text-ink hover:bg-acid-yellow"
                  >
                    {l.label} ↗
                  </a>
                ) : (
                  <Link
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-4 py-2 font-display text-base text-ink hover:bg-acid-yellow",
                      pathname === l.to && "bg-acid-yellow"
                    )}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const forceScrolledStyle = lightBgRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const goToEarlyAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const scroll = () => {
      document.getElementById("early-access")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    if (pathname === "/") {
      scroll();
    } else {
      router.push("/#early-access");
      setTimeout(scroll, 120);
    }
  };

  const effectiveScrolled = scrolled || forceScrolledStyle;
  const baseColor = effectiveScrolled ? "text-ink" : "text-cream";
  const activeColor = effectiveScrolled ? "text-magenta" : "text-acid-yellow";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all",
        effectiveScrolled
          ? "bg-cream/95 backdrop-blur border-b-4 border-ink"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex items-center justify-between py-3 md:py-4 gap-3 md:gap-4">
        <Link
          href="/"
          className={cn(
            "group flex items-center gap-2 font-display text-xl md:text-2xl leading-none shrink-0",
            baseColor
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/ccd-logo.png"
            alt="Cats Can Dance logo"
            style={{ filter: effectiveScrolled ? "none" : "invert(1) brightness(1.2)" }}
            className="h-9 md:h-11 w-auto transition-transform duration-700 group-hover:rotate-[360deg]"
          />
          <span className="hidden sm:inline">
            CATS<span className="text-magenta">.</span>CAN
            <span className="text-magenta">.</span>DANCE
          </span>
          <span className="sm:hidden">CCD</span>
        </Link>

        <ul className="hidden lg:flex items-baseline gap-4">
          {primaryLinks.map((l) => {
            const isActive = pathname === l.to || pathname.startsWith(l.to + "/");
            return (
              <li key={l.to}>
                <Link
                  href={l.to}
                  className={cn(
                    "font-display text-base transition-colors",
                    isActive ? activeColor : baseColor,
                    `hover:${activeColor}`
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <Dropdown label="Work With Us" links={partnersLinks} scrolled={effectiveScrolled} />
          <Dropdown label="More" links={moreLinks} scrolled={effectiveScrolled} />
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/discover"
            aria-label="Search"
            className={cn("transition-colors", `hover:${activeColor}`)}
          >
            <Search className={cn("w-4 h-4", baseColor)} />
          </Link>
          <Link
            href="/sign-in"
            className="font-display text-xs uppercase px-3 py-2 xl:px-4 border-4 border-ink bg-cream text-ink hover:bg-magenta hover:text-cream transition-colors chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Sign In
          </Link>
          <a
            href="/#early-access"
            onClick={goToEarlyAccess}
            className="inline-block bg-ink text-cream font-display px-3 py-2 xl:px-4 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform text-xs xl:text-sm"
          >
            Early Access
          </a>
        </div>

        <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 relative">
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 sm:w-11 sm:h-11 grid place-items-center border-4 border-ink bg-cream chunk-shadow"
          >
            <span className="font-display text-xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {open ? (
        <div className="lg:hidden bg-cream border-t-4 border-ink max-h-[85vh] overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-4 space-y-1">
            {primaryLinks.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className={cn(
                  "block font-display text-xl text-ink py-2 border-b border-ink/10",
                  pathname === l.to && "text-magenta"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2">
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-ink/40 mb-1">
                Work With Us
              </p>
              {partnersLinks.map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  className="block font-display text-lg text-ink py-1.5 border-b border-ink/5"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="pt-2">
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-ink/40 mb-1">
                More
              </p>
              {moreLinks.map((l) =>
                l.external ? (
                  <a
                    key={l.to}
                    href={l.to}
                    target="_blank"
                    rel="noreferrer"
                    className="block font-display text-lg text-ink py-1.5 border-b border-ink/5"
                  >
                    {l.label} ↗
                  </a>
                ) : (
                  <Link
                    key={l.to}
                    href={l.to}
                    className="block font-display text-lg text-ink py-1.5 border-b border-ink/5"
                  >
                    {l.label}
                  </Link>
                )
              )}
            </div>
            <div className="pt-3 border-t-2 border-ink/20 space-y-1">
              <Link href="/sign-in" className="block font-display text-xl text-magenta py-2">
                Sign In →
              </Link>
              <a
                href="/#early-access"
                onClick={goToEarlyAccess}
                className="block font-display text-xl text-magenta py-2"
              >
                Early Access →
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
