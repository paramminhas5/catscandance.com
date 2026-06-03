"use client";

import { useState } from "react";
import { updateProfile } from "./actions";

type Props = {
  initialName: string;
  initialCity: string;
  initialBio: string;
  cities: string[];
};

export function ProfileForm({ initialName, initialCity, initialBio, cities }: Props) {
  const [name, setName] = useState(initialName);
  const [city, setCity] = useState(initialCity);
  const [bio, setBio] = useState(initialBio);
  const [instagram, setInstagram] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData();
    fd.set("name", name);
    fd.set("city", city);
    fd.set("bio", bio);
    fd.set("instagram", instagram);
    const result = await updateProfile(fd);
    setStatus(result.ok ? "success" : "error");
    if (result.ok) setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-4 border-ink bg-cream chunk-shadow p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name or DJ alias"
            className="w-full px-4 py-3 border-4 border-ink bg-cream font-sans text-ink placeholder:text-ink/30 focus:outline-none focus:bg-acid-yellow/20 transition-colors"
          />
        </div>

        {/* City */}
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 border-4 border-ink bg-cream font-display text-ink focus:outline-none focus:bg-acid-yellow/20 transition-colors"
          >
            <option value="">Select your city</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the pack about yourself…"
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border-4 border-ink bg-cream font-sans text-ink placeholder:text-ink/30 focus:outline-none focus:bg-acid-yellow/20 transition-colors resize-none"
          />
          <p className="text-ink/30 text-xs mt-1 text-right font-display">{bio.length}/500</p>
        </div>

        {/* Instagram */}
        <div>
          <label className="font-display text-xs text-ink/60 uppercase tracking-widest block mb-2">
            Instagram Handle
          </label>
          <div className="flex items-center border-4 border-ink bg-cream focus-within:bg-acid-yellow/20 transition-colors">
            <span className="pl-4 font-display text-ink/40 text-sm">@</span>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value.replace(/^@/, ""))}
              placeholder="yourhandle"
              className="flex-1 px-3 py-3 bg-transparent font-sans text-ink placeholder:text-ink/30 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-magenta text-cream font-display text-sm px-8 py-4 border-4 border-ink chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform disabled:opacity-50"
        >
          {status === "loading" ? "SAVING…" : "SAVE PROFILE"}
        </button>
        {status === "success" && (
          <p className="font-display text-sm text-magenta">✓ PROFILE UPDATED</p>
        )}
        {status === "error" && (
          <p className="font-display text-sm text-red-600">Something went wrong. Try again.</p>
        )}
      </div>
    </form>
  );
}
