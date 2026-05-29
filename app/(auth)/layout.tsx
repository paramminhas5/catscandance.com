import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh flex flex-col bg-background bg-grain">
      <header className="px-4 md:px-8 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-display uppercase text-2xl text-ink hover:text-hot-pink transition-colors"
        >
          Cats Can Dance
        </Link>
        <Link href="/" className="text-sm text-ink/60 hover:underline">
          ← Back to site
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      <footer className="px-4 md:px-8 py-6 border-t-2 border-ink/10 text-sm text-ink/60 flex justify-between">
        <span>© Cats Can Dance · India</span>
        <Link href="/legal" className="hover:underline">Legal</Link>
      </footer>
    </main>
  );
}
