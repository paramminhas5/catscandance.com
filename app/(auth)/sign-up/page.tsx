import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Join Cats Can Dance.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ redirect?: string }> };

export default function SignUpPage({ searchParams }: Props) {
  return (
    <div className="border-2 border-ink chunk-shadow bg-cream p-8 md:p-10">
      <div className="inline-block bg-hot-pink text-cream border-2 border-ink chunk-shadow-sm px-3 py-1 mb-6 font-display uppercase text-xs">
        / Join CCD
      </div>
      <h1 className="font-display uppercase text-4xl md:text-5xl mb-2">Create account</h1>
      <p className="text-ink/70 mb-8">RSVPs, drops, and the occasional secret address.</p>

      <Suspense fallback={<FormSkeleton />}>
        <SignUpFormIsland searchParams={searchParams} />
      </Suspense>

      <p className="mt-6 text-sm text-ink/70">
        Already a member?{" "}
        <Link href="/sign-in" className="font-bold underline hover:text-hot-pink">
          Sign in
        </Link>
      </p>
    </div>
  );
}

async function SignUpFormIsland({ searchParams }: Props) {
  const { redirect } = await searchParams;
  return <SignUpForm redirectTo={redirect ?? "/dashboard"} />;
}

function FormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-12 border-2 border-ink/20 bg-ink/5 rounded-md" />
      <div className="h-12 border-2 border-ink/20 bg-ink/5 rounded-md" />
      <div className="h-12 border-2 border-ink/20 bg-ink/5 rounded-md" />
      <div className="h-14 border-2 border-ink/20 bg-ink/5 rounded-md" />
    </div>
  );
}
