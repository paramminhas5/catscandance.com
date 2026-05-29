import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Partial Prerendering / Cache Components — static shell + dynamic islands.
  cacheComponents: true,
  experimental: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // SPA → new-app redirects (filled in during cutover).
  async redirects() {
    return [
      // Consolidate three legal stubs into one page.
      { source: "/privacy", destination: "/legal#privacy", permanent: true },
      { source: "/terms", destination: "/legal#terms", permanent: true },
      { source: "/cookies", destination: "/legal#cookies", permanent: true },
      // Author profiles fold into post footers.
      { source: "/authors/:slug", destination: "/blog", permanent: true },
      // Old SPA-era patterns.
      { source: "/artist/:slug", destination: "/artists/:slug", permanent: true },
      { source: "/scene/:city", destination: "/scenes/:city", permanent: true },
    ];
  },
};

export default nextConfig;
