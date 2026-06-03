"use client";

import { useState } from "react";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Goa", "Hyderabad", "Pune", "Other"];
const CAPACITIES = ["50–100", "100–200", "200–500", "500+"];

export function VenueInquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const body = {
      type: "venue",
      name: fd.get("name"),
      email: fd.get("email"),
      city: fd.get("city"),
      venueName: fd.get("venueName"),
      capacity: fd.get("capacity"),
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
        <p className="font-display text-ink text-2xl mb-2">✓ ENQUIRY SENT</p>
        <p className="text-ink/70 font-medium">We&apos;ll get back to you within a few days to discuss your venue.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Your Name *</label>
          <input type="text" name="name" required placeholder="Contact person" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 transition-colors" />
        </div>
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Email *</label>
          <input type="email" name="email" required placeholder="you@email.com" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 transition-colors" />
        </div>
      </div>
      <div>
        <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Venue Name *</label>
        <input type="text" name="venueName" required placeholder="What's the venue called?" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 transition-colors" />
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
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Capacity</label>
          <select name="capacity" className="w-full px-4 py-3 border-4 border-ink bg-cream font-display text-sm focus:outline-none focus:bg-acid-yellow/20 transition-colors">
            <option value="">Approx capacity</option>
            {CAPACITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">Tell us about your space</label>
        <textarea name="message" rows={4} placeholder="Outdoor area, sound system, pet-friendly, usual crowd…" className="w-full px-4 py-3 border-4 border-ink bg-cream focus:outline-none focus:bg-acid-yellow/20 transition-colors resize-none" />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-electric-blue text-cream font-display text-sm px-8 py-4 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform disabled:opacity-50"
      >
        {status === "loading" ? "SENDING…" : "SEND ENQUIRY →"}
      </button>
      {status === "error" && <p className="text-red-600 font-display text-sm">Something went wrong. Try again or email hello@catscandance.com.</p>}
    </form>
  );
}
