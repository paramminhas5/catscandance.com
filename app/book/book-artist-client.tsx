"use client";

import { useState } from "react";
import { Music, MapPin, Search, X } from "lucide-react";

type Artist = {
  id: string;
  slug: string;
  name: string;
  primaryCity: string;
  genres: string[];
  photoUrl: string | null;
  isFeatured: boolean;
};

type BookingFormData = {
  requesterName: string;
  requesterEmail: string;
  eventTitle: string;
  eventCity: string;
  eventDate: string;
  message: string;
};

const ACCENTS = ["bg-acid-yellow text-ink", "bg-electric-blue text-cream", "bg-magenta text-cream", "bg-orange text-ink"];

export function BookArtistClient({ artists }: { artists: Artist[] }) {
  const [selected, setSelected] = useState<Artist | null>(null);
  const [q, setQ] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState<BookingFormData>({
    requesterName: "", requesterEmail: "", eventTitle: "", eventCity: "", eventDate: "", message: ""
  });

  const filtered = q.trim()
    ? artists.filter((a) =>
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.primaryCity.toLowerCase().includes(q.toLowerCase()) ||
        a.genres.join(" ").toLowerCase().includes(q.toLowerCase())
      )
    : artists;

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setFormStatus("loading");
    try {
      const res = await fetch("/api/booking-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistSlug: selected.slug, ...form }),
      });
      setFormStatus(res.ok ? "success" : "error");
    } catch { setFormStatus("error"); }
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pb-16">
      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search artists…"
          className="w-full pl-9 pr-8 py-3 border-4 border-ink bg-cream font-sans focus:outline-none focus:bg-acid-yellow/20 transition-colors"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Artist grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {filtered.slice(0, 16).map((a, i) => {
          const accent = ACCENTS[i % ACCENTS.length] ?? "bg-acid-yellow text-ink";
          const isSelected = selected?.id === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setSelected(isSelected ? null : a)}
              className={`group relative aspect-square border-4 overflow-hidden transition-transform ${
                isSelected
                  ? "border-magenta translate-x-[3px] translate-y-[3px] shadow-none"
                  : "border-ink chunk-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              }`}
            >
              {a.photoUrl ? (
                <>
                  <img src={a.photoUrl} alt={a.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent ${isSelected ? "from-magenta/80" : ""}`} />
                </>
              ) : (
                <div className={`absolute inset-0 ${accent} flex items-center justify-center`}>
                  <Music className="w-10 h-10 opacity-20" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-display text-cream text-xs leading-tight">{a.name.toUpperCase()}</p>
                {a.primaryCity && (
                  <p className="text-cream/60 text-[10px] flex items-center gap-0.5 mt-0.5">
                    <MapPin className="w-2.5 h-2.5" />{a.primaryCity}
                  </p>
                )}
              </div>
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-magenta/30">
                  <span className="font-display text-white text-3xl drop-shadow-lg">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Booking form — shows when artist is selected */}
      {selected && (
        <div className="border-4 border-ink bg-cream chunk-shadow p-6 md:p-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b-4 border-ink">
            <div className="w-14 h-14 border-4 border-ink overflow-hidden shrink-0">
              {selected.photoUrl ? (
                <img src={selected.photoUrl} alt={selected.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-acid-yellow flex items-center justify-center">
                  <Music className="w-6 h-6 text-ink/30" />
                </div>
              )}
            </div>
            <div>
              <p className="font-display text-ink text-xl">{selected.name.toUpperCase()}</p>
              {selected.primaryCity && <p className="text-ink/50 text-sm">{selected.primaryCity}</p>}
            </div>
            <button onClick={() => setSelected(null)} className="ml-auto text-ink/40 hover:text-ink transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {formStatus === "success" ? (
            <div>
              <p className="font-display text-ink text-2xl mb-2">✓ INQUIRY SENT</p>
              <p className="text-ink/70">We&apos;ll connect you with {selected.name} within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-4">
              <p className="font-display text-ink text-lg mb-4">BOOKING INQUIRY</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Your Name *</label>
                  <input value={form.requesterName} onChange={(e) => setForm(f => ({ ...f, requesterName: e.target.value }))} required className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20" />
                </div>
                <div>
                  <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Your Email *</label>
                  <input type="email" value={form.requesterEmail} onChange={(e) => setForm(f => ({ ...f, requesterEmail: e.target.value }))} required className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Event Name</label>
                  <input value={form.eventTitle} onChange={(e) => setForm(f => ({ ...f, eventTitle: e.target.value }))} placeholder="Your event" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20" />
                </div>
                <div>
                  <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">City</label>
                  <input value={form.eventCity} onChange={(e) => setForm(f => ({ ...f, eventCity: e.target.value }))} placeholder="Event city" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20" />
                </div>
              </div>
              <div>
                <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Event Date</label>
                <input type="date" value={form.eventDate} onChange={(e) => setForm(f => ({ ...f, eventDate: e.target.value }))} className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20" />
              </div>
              <div>
                <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Message</label>
                <textarea value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder="Tell the artist about your event, budget, set length…" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 resize-none" />
              </div>
              <button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full bg-magenta text-cream font-display text-sm px-8 py-4 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform disabled:opacity-50"
              >
                {formStatus === "loading" ? "SENDING…" : `SEND INQUIRY TO ${selected.name.toUpperCase()} →`}
              </button>
              {formStatus === "error" && <p className="text-red-600 font-display text-sm">Something went wrong. Try emailing hello@catscandance.com.</p>}
            </form>
          )}
        </div>
      )}
    </section>
  );
}
