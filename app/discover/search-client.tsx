"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, MapPin, Music, Globe, Zap } from "lucide-react";

type SearchResult = {
  type: "event" | "artist" | "venue";
  label: string;
  sublabel?: string;
  href: string;
};

type SearchResponse = {
  events: Array<{ slug: string; title: string; city: string }>;
  artists: Array<{ slug: string; name: string; primaryCity: string; genres: string[] }>;
  venues: Array<{ slug: string; name: string; city: string }>;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  event: <Zap className="w-3 h-3" />,
  artist: <Music className="w-3 h-3" />,
  venue: <MapPin className="w-3 h-3" />,
};
const TYPE_LABELS: Record<string, string> = {
  event: "Events",
  artist: "Artists",
  venue: "Venues",
};

export function SearchClient({ initialQ = "" }: { initialQ?: string }) {
  const [q, setQ] = useState(initialQ);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const data: SearchResponse = await res.json();
        const mapped: SearchResult[] = [
          ...data.artists.slice(0, 5).map((a) => ({
            type: "artist" as const,
            label: a.name,
            sublabel: [a.primaryCity, a.genres[0]].filter(Boolean).join(" · "),
            href: `/artists/${a.slug}`,
          })),
          ...data.events.slice(0, 5).map((e) => ({
            type: "event" as const,
            label: e.title,
            sublabel: e.city,
            href: `/events/${e.slug}`,
          })),
          ...data.venues.slice(0, 3).map((v) => ({
            type: "venue" as const,
            label: v.name,
            sublabel: v.city,
            href: `/scenes/${v.city.toLowerCase()}`,
          })),
        ];
        setResults(mapped);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onOutside); document.removeEventListener("keydown", onKey); };
  }, []);

  function handleSelect(href: string) {
    setOpen(false);
    setQ("");
    router.push(href);
  }

  const showDropdown = open && q.trim().length >= 2;
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className={`flex items-center border-4 border-ink bg-cream transition-all ${open ? "ring-2 ring-magenta ring-offset-0" : ""}`}>
        <Search className="w-5 h-5 text-ink/40 ml-4 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search artists, events, cities, genres…"
          className="flex-1 px-4 py-4 md:py-5 bg-transparent font-display text-sm md:text-base text-ink placeholder:text-ink/40 focus:outline-none"
          aria-label="Search everything"
          autoComplete="off"
        />
        {loading && <span className="mr-3 text-ink/30 font-display text-xs animate-pulse">…</span>}
        {q && !loading && (
          <button
            onClick={() => { setQ(""); setResults([]); inputRef.current?.focus(); }}
            className="mr-4 text-ink/40 hover:text-ink transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 border-4 border-ink border-t-0 bg-cream max-h-[70vh] overflow-y-auto chunk-shadow">
          {results.length === 0 && !loading && (
            <div className="p-6 text-center">
              <p className="font-display text-sm text-ink/50 uppercase">Nothing found for &ldquo;{q}&rdquo;</p>
              <p className="text-xs text-ink/40 mt-1">Try &ldquo;house&rdquo;, &ldquo;bengaluru&rdquo;, or an artist name</p>
            </div>
          )}
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div className="px-4 pt-3 pb-1 flex items-center gap-2 border-b border-ink/10">
                <span className="text-ink/40">{TYPE_ICONS[type]}</span>
                <span className="font-display text-[10px] uppercase tracking-widest text-ink/50">{TYPE_LABELS[type]}</span>
              </div>
              {items.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(r.href)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-acid-yellow transition-colors border-b border-ink/10 last:border-b-0 group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm text-ink uppercase truncate">{r.label}</p>
                    {r.sublabel && <p className="text-xs text-ink/50 truncate mt-0.5">{r.sublabel}</p>}
                  </div>
                  <span className="font-display text-xs text-ink/30 group-hover:text-ink transition-colors shrink-0">→</span>
                </button>
              ))}
            </div>
          ))}
          {results.length > 0 && (
            <div className="px-4 py-2 border-t-4 border-ink bg-ink/5">
              <p className="font-display text-[10px] uppercase text-ink/30 tracking-widest">Esc to close</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
