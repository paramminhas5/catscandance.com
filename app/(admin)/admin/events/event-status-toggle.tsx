"use client";

import { useState } from "react";

const STATUS_OPTIONS = ["draft", "upcoming", "live", "past", "cancelled"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

export function EventStatusToggle({ eventId, currentStatus }: { eventId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: Status) {
    if (newStatus === status) return;
    setLoading(true);
    try {
      await fetch("/api/admin/toggle-event-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status: newStatus }),
      });
      setStatus(newStatus);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as Status)}
      disabled={loading}
      className="bg-ink/80 border-2 border-acid-yellow/20 text-cream/70 font-display text-xs px-2 py-1 focus:outline-none focus:border-acid-yellow disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s.toUpperCase()}</option>
      ))}
    </select>
  );
}
