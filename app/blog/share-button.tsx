"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch { /* user cancelled or not supported */ }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent */ }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 border-4 border-ink bg-cream font-display text-sm px-5 py-3 chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-magenta" />
          LINK COPIED
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          SHARE
        </>
      )}
    </button>
  );
}
