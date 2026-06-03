/**
 * /admin/artists — Artist management table
 */
import { buildMetadata } from "@/lib/seo";
import { db } from "@/lib/db/client";
import { artists } from "@/lib/db/schema";
import { ArtistToggles } from "./artist-toggles";

export const metadata = buildMetadata({
  title: "Artists Admin — Cats Can Dance",
  description: "Manage CCD artists.",
  path: "/admin/artists",
  noIndex: true,
});

export default async function AdminArtistsPage() {
  const allArtists = await db.query.artists.findMany({
    orderBy: (a, { desc }) => [desc(a.isFeatured), a.name],
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-acid-yellow text-base mb-2">/ ADMIN</p>
        <h1 className="font-display text-cream text-3xl md:text-5xl leading-none">ARTISTS</h1>
        <p className="font-display text-cream/40 text-sm mt-1">{allArtists.length} total</p>
      </div>

      <div className="border-4 border-acid-yellow/20 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b-4 border-acid-yellow/20 bg-ink/50">
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Artist</th>
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">City</th>
              <th className="text-left px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Genres</th>
              <th className="text-center px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Featured</th>
              <th className="text-center px-4 py-3 font-display text-xs text-cream/50 uppercase tracking-widest">Verified</th>
            </tr>
          </thead>
          <tbody>
            {allArtists.map((a) => (
              <tr key={a.id} className="border-b border-acid-yellow/5 hover:bg-cream/5 transition-colors">
                <td className="px-4 py-3">
                  <a href={`/artists/${a.slug}`} className="font-display text-sm text-cream hover:text-acid-yellow transition-colors" target="_blank" rel="noopener">
                    {a.name}
                  </a>
                </td>
                <td className="px-4 py-3 text-xs text-cream/60">{a.primaryCity ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(a.genres ?? []).slice(0, 3).map((g: string) => (
                      <span key={g} className="font-display text-[9px] uppercase px-1.5 py-0.5 border border-acid-yellow/20 text-acid-yellow/50">
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <ArtistToggles
                    artistId={a.id}
                    isFeatured={a.isFeatured}
                    isVerified={a.isVerified}
                    field="isFeatured"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <ArtistToggles
                    artistId={a.id}
                    isFeatured={a.isFeatured}
                    isVerified={a.isVerified}
                    field="isVerified"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allArtists.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-display text-cream/30 text-lg">No artists yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
