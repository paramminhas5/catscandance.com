"use client";

import { useState } from "react";

type Props = {
  artistId: string;
  isFeatured: boolean;
  isVerified: boolean;
  field: "isFeatured" | "isVerified";
};

export function ArtistToggles({ artistId, isFeatured, isVerified, field }: Props) {
  const initialValue = field === "isFeatured" ? isFeatured : isVerified;
  const [active, setActive] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      await fetch("/api/admin/toggle-artist-featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId, field, value: !active }),
      });
      setActive((v) => !v);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-10 h-6 border-2 relative transition-colors disabled:opacity-50 ${
        active ? "bg-acid-yellow border-acid-yellow" : "bg-ink/40 border-cream/20"
      }`}
      title={`Toggle ${field}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 transition-all ${
          active ? "left-[calc(100%-1.125rem)] bg-ink" : "left-0.5 bg-cream/40"
        }`}
      />
    </button>
  );
}
