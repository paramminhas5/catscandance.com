import Link from "next/link";
import type { Artist } from "@/lib/db/schema";

type LineupArtist = {
  name: string;
  slug?: string | null;
  role?: string;
  note?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  socials?: { soundcloud?: string; spotify?: string } | null;
};

type Props = {
  artist: LineupArtist;
  index: number;
};

const PALETTES = [
  { bg: "bg-magenta",       text: "text-cream", chip: "bg-acid-yellow text-ink", role: "text-acid-yellow" },
  { bg: "bg-electric-blue", text: "text-cream", chip: "bg-acid-yellow text-ink", role: "text-acid-yellow" },
  { bg: "bg-acid-yellow",   text: "text-ink",   chip: "bg-magenta text-cream",   role: "text-magenta" },
];

export function EventLineupCard({ artist, index }: Props) {
  const palette = PALETTES[index % PALETTES.length];
  const isTba = artist.name.trim().toUpperCase() === "TBA";

  const inner = (
    <div
      className={`relative border-4 border-ink chunk-shadow p-5 md:p-6 h-full flex flex-col ${
        isTba
          ? "bg-cream text-ink/70 border-dashed"
          : `${palette.bg} ${palette.text}`
      } ${!isTba && artist.slug ? "hover:-translate-y-1 hover:translate-x-1 transition-transform" : ""}`}
    >
      {artist.role && (
        <span
          className={`inline-block self-start text-[10px] font-bold px-2 py-0.5 border-2 border-ink uppercase tracking-widest mb-3 ${
            isTba ? "bg-ink text-cream" : palette.chip
          }`}
        >
          {artist.role}
        </span>
      )}

      <h3 className={`font-display text-3xl md:text-4xl leading-none mb-2 ${isTba ? "tracking-widest" : ""}`}>
        {artist.name.toUpperCase()}
      </h3>

      {artist.note && (
        <p className={`font-display text-sm tracking-widest mb-3 ${palette.role}`}>
          / {artist.note}
        </p>
      )}

      {artist.bio && (
        <p className={`text-sm font-medium leading-snug mb-3 ${isTba ? "" : "opacity-90"}`}>
          {artist.bio.slice(0, 120)}{artist.bio.length > 120 ? "…" : ""}
        </p>
      )}

      {!isTba && artist.slug && (
        <p className={`mt-auto pt-3 font-display text-xs tracking-widest ${palette.role}`}>
          / TAP TO READ MORE →
        </p>
      )}
    </div>
  );

  if (isTba || !artist.slug) {
    return <article aria-label={artist.name}>{inner}</article>;
  }

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="block focus:outline-none focus:ring-4 focus:ring-magenta"
    >
      {inner}
    </Link>
  );
}
