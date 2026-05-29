import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Cats Can Dance.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ redirect?: string }> };

/** Static shell prerenders. Only the form streams in (it depends on ?redirect). */
export default function SignInPage({ searchParams }: Props) {
  return (
    <div className="border-2 border-ink chunk-shadow bg-cream p-8 md:p-10">
      <div className="inline-block bg-acid-yellow text-ink border-2 border-ink chunk-shadow-sm px-3 py-1 mb-6 font-display uppercase text-xs">
        / Members
      </div>
      <h1 className="font-display uppercase text-4xl md:text-5xl mb-2">Sign in</h1>
      <p className="text-ink/70 mb-8">Welcome back to the underground.</p>

      <Suspense fallback={<FormSkeleton />}>
        <SignInFormIsland searchParams={searchParams} />
      </Suspense>

      <p className="mt-6 text-sm text-ink/70">
        New here?{" "}
        <Link href="/sign-up" className="font-bold underline hover:text-hot-pink">
          Create an account
        </Link>
      </p>
    </div>
  );
}

async function SignInFormIsland({ searchParams }: Props) {
  const { redirect } = await searchParams;
  return <SignInForm redirectTo={redirect ?? "/dashboard"} />;
}

function FormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-12 border-2 border-ink/20 bg-ink/5 rounded-md" />
      <div className="h-12 border-2 border-ink/20 bg-ink/5 rounded-md" />
      <div className="h-14 border-2 border-ink/20 bg-ink/5 rounded-md" />
    </div>
  );
}
