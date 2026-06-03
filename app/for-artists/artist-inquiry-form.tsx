"use client";

import { useState } from "react";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Goa", "Hyderabad", "Pune", "Other"];
const GENRES = ["House", "Techno", "D&B", "Jungle", "Garage", "Disco", "Bass", "Breaks", "Ambient", "Downtempo", "Other"];

export function ArtistInquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const body = {
      type: "artist",
      name: fd.get("name"),
      email: fd.get("email"),
      city: fd.get("city"),
      genre: fd.get("genre"),
      instagram: fd.get("instagram"),
      soundcloud: fd.get("soundcloud"),
      message: fd.get("message"),
    };
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-8">
        <p className="font-display text-ink text-2xl mb-2">✓ SUBMISSION RECEIVED</p>
        <p className="text-ink/70 font-medium">We&apos;ll review your profile and get back to you within a week.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Name / Alias *</label>
          <input type="text" name="name" required placeholder="Your DJ name" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 transition-colors" />
        </div>
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Email *</label>
          <input type="email" name="email" required placeholder="you@email.com" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 transition-colors" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">City</label>
          <select name="city" className="w-full px-4 py-3 border-4 border-ink bg-cream font-display text-sm focus:outline-none focus:bg-acid-yellow/20 transition-colors">
            <option value="">Select city</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Primary Genre</label>
          <select name="genre" className="w-full px-4 py-3 border-4 border-ink bg-cream font-display text-sm focus:outline-none focus:bg-acid-yellow/20 transition-colors">
            <option value="">Select genre</option>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Instagram</label>
        <div className="flex items-center border-4 border-ink bg-cream focus-within:bg-acid-yellow/20 transition-colors">
          <span className="pl-4 font-display text-ink/40 text-sm">@</span>
          <input type="text" name="instagram" placeholder="yourhandle" className="flex-1 px-3 py-3 bg-transparent focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">SoundCloud / Mix Link</label>
        <input type="url" name="soundcloud" placeholder="https://soundcloud.com/you" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 transition-colors" />
      </div>
      <div>
        <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Anything else?</label>
        <textarea name="message" rows={3} placeholder="Tell us about your sound, experience, or why you want to be on CCD…" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 transition-colors resize-none" />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-magenta text-cream font-display text-sm px-8 py-4 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform disabled:opacity-50"
      >
        {status === "loading" ? "SUBMITTING…" : "SUBMIT PROFILE →"}
      </button>
      {status === "error" && <p className="text-red-600 font-display text-sm">Something went wrong. Try again or email hello@catscandance.com.</p>}
    </form>
  );
}
