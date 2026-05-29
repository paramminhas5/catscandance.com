import type { Metadata, Viewport } from "next";
import { Bowlby_One, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bowlbyOne = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bowlby",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: "Cats Can Dance — India's Underground Electronic Music Platform",
    template: "%s · Cats Can Dance",
  },
  description:
    "Underground electronic music, parties, and culture across India. Discover artists, events, scenes, and drops in Bombay, Bangalore, Goa, Delhi and beyond.",
  keywords: [
    "underground electronic music india",
    "techno bangalore",
    "house music mumbai",
    "goa rave",
    "delhi underground",
    "indian electronic artists",
    "ccd",
    "cats can dance",
  ],
  authors: [{ name: "Cats Can Dance" }],
  creator: "Cats Can Dance",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: absoluteUrl(),
    siteName: "Cats Can Dance",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@catscandanceco",
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6e3df" },
    { media: "(prefers-color-scheme: dark)", color: "#06070a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${spaceGrotesk.variable} ${bowlbyOne.variable}`}>
      <body className="bg-background text-foreground antialiased bg-grain">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "border-2 border-ink chunk-shadow-sm bg-background font-sans",
          }}
        />
      </body>
    </html>
  );
}
