"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type AudioEmbed = { platform: string; url: string; title?: string };
type Appearance = {
  eventId: string; eventTitle: string; eventSlug: string;
  venue: string; city: string; startsAt: string | null; role: string; note: string | null;
};
type ArtistData = {
  id: string; slug: string; name: string; bio: string | null;
  primaryCity: string | null; genres: string[]; photoUrl: string | null;
  socials: Record<string, string>; isFeatured: boolean; isVerified: boolean;
  audioEmbeds: AudioEmbed[]; milestones: any[]; press: any[];
  discography: any[]; socialStats: any;
};

type Props = {
  artist: ArtistData;
  appearances: Appearance[];
  upcomingGigs: Appearance[];
};

// Tab ids — labels are computed dynamically with counts in the component
const TAB_IDS = ["home", "gigography", "stats", "book"] as const;
type TabId = typeof TAB_IDS[number];

const ROLE_COLOURS: Record<string, string> = {
  headliner: "bg-acid-yellow text-ink",
  support:   "bg-electric-blue text-cream",
  b2b:       "bg-magenta text-cream",
  host:      "bg-lime text-ink",
  selector:  "bg-ink text-cream",
};

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function GigRow({ g }: { g: Appearance }) {
  const dateStr = g.startsAt
    ? new Date(g.startsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "TBA";
  const roleClass = ROLE_COLOURS[g.role] ?? "bg-ink text-cream";
  return (
    <Link
      href={g.eventSlug ? `/events/${g.eventSlug}` : "#"}
      className="group flex items-start gap-4 border-b-4 border-ink p-4 hover:bg-acid-yellow transition-colors"
    >
      <div className="shrink-0 w-24 font-display text-xs text-ink/60 pt-1">{dateStr}</div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-lg text-ink leading-tight group-hover:text-magenta transition-colors truncate">
          {g.eventTitle.toUpperCase()}
        </p>
        <p className="text-ink/60 text-sm mt-0.5">{[g.venue, g.city].filter(Boolean).join(" · ")}</p>
        {g.note && <p className="text-ink/50 text-xs mt-0.5 italic">{g.note}</p>}
      </div>
      <span className={`shrink-0 self-start text-[10px] font-bold px-2 py-0.5 border-2 border-ink uppercase tracking-widest ${roleClass}`}>
        {g.role}
      </span>
    </Link>
  );
}


function BookingForm({ artist }: { artist: ArtistData }) {
  const [form, setForm] = useState({
    requester_name: "", requester_email: "", requester_phone: "",
    purpose: "", event_date: "", venue: "", budget: "", notes: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f: typeof form) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true); setError(null);
    try {
      const res = await fetch("/api/booking-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist_slug: artist.slug, artist_name: artist.name, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send. Try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-8 text-center max-w-lg">
        <div className="w-16 h-16 border-4 border-ink bg-cream flex items-center justify-center mx-auto mb-4">
          <span className="font-display text-2xl text-ink">✓</span>
        </div>
        <h3 className="font-display text-2xl text-ink uppercase mb-2">Request Sent</h3>
        <p className="text-ink/70">
          Your booking inquiry for <strong>{artist.name}</strong> is in. They&apos;ll reply via your email.
        </p>
      </div>
    );
  }

  const inputClass = "w-full border-4 border-ink bg-cream px-3 py-2 font-sans text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:bg-acid-yellow/30 transition-colors";
  const selectClass = "w-full border-4 border-ink bg-cream px-3 py-2 font-display text-xs uppercase text-ink focus:outline-none";

  return (
    <form onSubmit={submit} className="border-4 border-ink bg-cream chunk-shadow p-5 md:p-7 space-y-5 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-display text-xs uppercase text-ink/60 tracking-widest mb-1">Your Name *</label>
          <input required value={form.requester_name} onChange={set("requester_name")} placeholder="Venue / promoter / company" className={inputClass} />
        </div>
        <div>
          <label className="block font-display text-xs uppercase text-ink/60 tracking-widest mb-1">Email *</label>
          <input required type="email" value={form.requester_email} onChange={set("requester_email")} placeholder="your@email.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block font-display text-xs uppercase text-ink/60 tracking-widest mb-1">Phone (optional)</label>
        <input value={form.requester_phone} onChange={set("requester_phone")} placeholder="+91 98765 43210" className={inputClass} />
      </div>
      <div className="border-t-4 border-ink pt-4">
        <p className="font-display text-xs uppercase text-ink/60 tracking-widest mb-3">Event details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-display text-xs uppercase text-ink/60 tracking-widest mb-1">Event type *</label>
            <select required value={form.purpose} onChange={set("purpose")} className={selectClass}>
              <option value="">Select…</option>
              <option value="Club night">Club night</option>
              <option value="Festival">Festival</option>
              <option value="Rooftop party">Rooftop party</option>
              <option value="Warehouse rave">Warehouse rave</option>
              <option value="Corporate event">Corporate event</option>
              <option value="Private party">Private party</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-display text-xs uppercase text-ink/60 tracking-widest mb-1">Event date</label>
            <input type="date" value={form.event_date} onChange={set("event_date")} className={inputClass} />
          </div>
          <div>
            <label className="block font-display text-xs uppercase text-ink/60 tracking-widest mb-1">Venue / city</label>
            <input value={form.venue} onChange={set("venue")} placeholder="e.g. Bar Wild, Bengaluru" className={inputClass} />
          </div>
          <div>
            <label className="block font-display text-xs uppercase text-ink/60 tracking-widest mb-1">Budget (INR)</label>
            <select value={form.budget} onChange={set("budget")} className={selectClass}>
              <option value="">Not specified</option>
              <option value="Under ₹10,000">Under ₹10,000</option>
              <option value="₹10,000–₹25,000">₹10,000–₹25,000</option>
              <option value="₹25,000–₹50,000">₹25,000–₹50,000</option>
              <option value="₹50,000–₹1,00,000">₹50,000–₹1,00,000</option>
              <option value="₹1,00,000+">₹1,00,000+</option>
              <option value="Negotiable">Negotiable</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="block font-display text-xs uppercase text-ink/60 tracking-widest mb-1">Notes</label>
        <textarea value={form.notes} onChange={set("notes")} rows={3} placeholder="Crowd size, set length, anything else…" className={`${inputClass} resize-none`} />
      </div>
      {error && <p className="text-sm text-cream bg-magenta border-2 border-ink px-3 py-2 font-display">{error}</p>}
      <button type="submit" disabled={sending}
        className="w-full flex items-center justify-center gap-2 py-3 border-4 border-ink bg-ink text-cream font-display text-sm uppercase chunk-shadow hover:bg-magenta hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60">
        {sending ? "Sending…" : "Send booking request →"}
      </button>
    </form>
  );
}


export function ArtistDetailClient({ artist, appearances, upcomingGigs }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [expandedBio, setExpandedBio] = useState(false);
  const [yearFilter, setYearFilter] = useState("all");
  const tabsRef = useRef<HTMLDivElement>(null);

  const totalGigs = appearances.length;
  const uniqueCities = new Set(appearances.map((a) => a.city).filter(Boolean)).size;
  const uniqueVenues = new Set(appearances.map((a) => a.venue).filter(Boolean)).size;
  const years = [...new Set(appearances.map((a) => a.startsAt ? new Date(a.startsAt).getFullYear() : null).filter(Boolean) as number[])].sort((a, b) => b - a);
  const filteredAppearances = yearFilter === "all" ? appearances : appearances.filter((a) => a.startsAt && new Date(a.startsAt).getFullYear() === parseInt(yearFilter));

  const goToTab = (id: TabId) => {
    setActiveTab(id);
    setTimeout(() => tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const BIO_THRESHOLD = 300;
  const bioShort = (artist.bio ?? "").slice(0, BIO_THRESHOLD);
  const bioLong = artist.bio ?? "";
  const hasBioOverflow = bioLong.length > BIO_THRESHOLD;

  return (
    <div>
      {/* Improvement #4: Tab nav with count badges so users know what's in each tab */}
      <div ref={tabsRef} className="sticky top-0 z-30 bg-cream border-b-4 border-ink">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {(
              [
                { id: "home" as TabId,       label: "HOME",  badge: null },
                { id: "gigography" as TabId, label: "GIGS",  badge: totalGigs > 0 ? totalGigs : null },
                { id: "stats" as TabId,      label: "STATS", badge: null },
                { id: "book" as TabId,       label: "BOOK",  badge: null },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => goToTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 font-display text-sm md:text-base px-4 md:px-6 py-4 border-r-4 border-ink transition-colors ${
                  activeTab === tab.id
                    ? "bg-ink text-cream"
                    : "bg-cream text-ink hover:bg-acid-yellow"
                }`}
              >
                {tab.label}
                {tab.badge !== null && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] font-bold border-2 border-ink rounded-none leading-none ${
                      activeTab === tab.id
                        ? "bg-acid-yellow text-ink border-cream"
                        : "bg-ink text-cream"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-12 md:py-16">

        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="space-y-12">
            {/* Bio */}
            {artist.bio && (
              <div>
                <p className="font-display text-magenta text-base md:text-lg mb-3">/ ABOUT</p>
                <p className="text-ink/85 font-medium text-lg md:text-xl leading-relaxed max-w-3xl">
                  {hasBioOverflow && !expandedBio ? `${bioShort}…` : bioLong}
                </p>
                {hasBioOverflow && (
                  <button
                    onClick={() => setExpandedBio((v: boolean) => !v)}
                    className="mt-3 font-display text-sm text-magenta hover:underline"
                  >
                    {expandedBio ? "READ LESS ↑" : "READ MORE ↓"}
                  </button>
                )}
              </div>
            )}

            {/* Audio embeds */}
            {artist.audioEmbeds.length > 0 && (
              <div>
                <p className="font-display text-magenta text-base md:text-lg mb-3">/ LISTEN</p>
                <div className="space-y-3">
                  {artist.audioEmbeds.slice(0, 3).map((e, i) => (
                    <a
                      key={i}
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 border-4 border-ink bg-cream chunk-shadow p-4 hover:bg-acid-yellow transition-colors group"
                    >
                      <span className="font-display text-2xl">
                        {e.platform === "soundcloud" ? "☁" : e.platform === "spotify" ? "●" : "▶"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-ink text-base truncate">
                          {e.title ?? e.url}
                        </p>
                        <p className="font-display text-xs text-ink/50 uppercase tracking-widest">
                          {e.platform}
                        </p>
                      </div>
                      <span className="font-display text-sm text-magenta group-hover:text-ink">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming gigs snapshot */}
            {upcomingGigs.length > 0 && (
              <div>
                <p className="font-display text-magenta text-base md:text-lg mb-3">/ UPCOMING GIGS</p>
                <div className="border-4 border-ink">
                  {upcomingGigs.slice(0, 5).map((g: Appearance) => (
                    <div key={g.eventId}><GigRow g={g} /></div>
                  ))}
                </div>
                {upcomingGigs.length > 5 && (
                  <button
                    onClick={() => goToTab("gigography")}
                    className="mt-3 font-display text-sm text-magenta hover:underline"
                  >
                    VIEW ALL {upcomingGigs.length} GIGS →
                  </button>
                )}
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "TOTAL GIGS", value: totalGigs },
                { label: "CITIES", value: uniqueCities },
                { label: "VENUES", value: uniqueVenues },
                { label: "GENRES", value: artist.genres.length },
              ].map((s) => (
                <div key={s.label} className="border-4 border-ink bg-acid-yellow p-4 chunk-shadow">
                  <p className="font-display text-3xl md:text-4xl text-ink leading-none">{s.value}</p>
                  <p className="font-display text-[10px] tracking-widest text-ink/60 mt-1">/ {s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA to book tab */}
            <div className="border-4 border-ink bg-magenta chunk-shadow p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-display text-acid-yellow text-lg mb-1">/ BOOK THIS ARTIST</p>
                <p className="text-cream/80 font-medium">Send a booking enquiry directly.</p>
              </div>
              <button
                onClick={() => goToTab("book")}
                className="shrink-0 bg-acid-yellow text-ink font-display text-base px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform whitespace-nowrap"
              >
                BOOK NOW →
              </button>
            </div>
          </div>
        )}

        {/* GIGOGRAPHY TAB */}
        {activeTab === "gigography" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="font-display text-magenta text-base md:text-lg mb-1">/ GIGOGRAPHY</p>
                <h2 className="font-display text-ink text-3xl md:text-5xl leading-tight">
                  {totalGigs} SHOWS
                </h2>
              </div>
              {years.length > 1 && (
                <select
                  value={yearFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setYearFilter(e.target.value)}
                  className="px-3 py-2 border-4 border-ink bg-cream font-display text-sm text-ink focus:outline-none"
                >
                  <option value="all">ALL YEARS</option>
                  {years.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              )}
            </div>
            {filteredAppearances.length === 0 ? (
              <p className="text-ink/50 font-medium">No gigs found for this filter.</p>
            ) : (
              <div className="border-4 border-ink">
                {filteredAppearances.map((g: Appearance) => (
                  <div key={`${g.eventId}-${g.role}`}><GigRow g={g} /></div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div>
            <p className="font-display text-magenta text-base md:text-lg mb-3">/ STATS</p>
            <h2 className="font-display text-ink text-3xl md:text-5xl leading-tight mb-8">BY THE NUMBERS</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {[
                { label: "TOTAL GIGS",  value: totalGigs },
                { label: "CITIES",      value: uniqueCities },
                { label: "VENUES",      value: uniqueVenues },
                { label: "GENRES",      value: artist.genres.length },
                { label: "DISCOGRAPHY", value: artist.discography.length },
                { label: "PRESS HITS",  value: artist.press.length },
              ].map((s) => (
                <div key={s.label} className="border-4 border-ink bg-cream chunk-shadow p-5 md:p-6">
                  <p className="font-display text-4xl md:text-5xl text-ink leading-none mb-2">{s.value}</p>
                  <p className="font-display text-[10px] tracking-widest text-ink/50">/ {s.label}</p>
                </div>
              ))}
            </div>
            {artist.socialStats && (
              <div>
                <p className="font-display text-magenta text-base mb-3">/ SOCIAL REACH</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {artist.socialStats.instagram_followers && (
                    <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-5">
                      <p className="font-display text-3xl text-ink">{fmt(artist.socialStats.instagram_followers)}</p>
                      <p className="font-display text-[10px] tracking-widest text-ink/60 mt-1">/ INSTAGRAM</p>
                    </div>
                  )}
                  {artist.socialStats.soundcloud_followers && (
                    <div className="border-4 border-ink bg-electric-blue chunk-shadow p-5">
                      <p className="font-display text-3xl text-cream">{fmt(artist.socialStats.soundcloud_followers)}</p>
                      <p className="font-display text-[10px] tracking-widest text-cream/60 mt-1">/ SOUNDCLOUD</p>
                    </div>
                  )}
                  {artist.socialStats.spotify_listeners && (
                    <div className="border-4 border-ink bg-magenta chunk-shadow p-5">
                      <p className="font-display text-3xl text-cream">{fmt(artist.socialStats.spotify_listeners)}</p>
                      <p className="font-display text-[10px] tracking-widest text-cream/60 mt-1">/ SPOTIFY / MONTH</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOOK TAB */}
        {activeTab === "book" && (
          <div>
            <p className="font-display text-magenta text-base md:text-lg mb-3">/ BOOK</p>
            <h2 className="font-display text-ink text-3xl md:text-5xl leading-tight mb-2">
              BOOK {artist.name.toUpperCase()}
            </h2>
            <p className="text-ink/70 font-medium mb-8 max-w-xl">
              Send a direct booking enquiry. {artist.name} or their team will reply to your email.
            </p>
            <BookingForm artist={artist} />
          </div>
        )}
      </div>
    </div>
  );
}
