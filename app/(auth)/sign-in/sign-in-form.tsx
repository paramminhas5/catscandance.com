"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await signIn.email({ email, password, callbackURL: redirectTo });
      if (result.error) {
        setError(result.error.message ?? "Could not sign you in.");
        return;
      }
      toast.success("Welcome back.");
      router.push(redirectTo);
      router.refresh();
    });
  }

  async function handleGoogle() {
    await signIn.social({ provider: "google", callbackURL: redirectTo });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@catscandance.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
        />
      </div>

      {error ? (
        <p className="border-2 border-ink bg-bubblegum px-3 py-2 text-sm text-ink">{error}</p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-ink/20" />
        <span className="text-xs uppercase font-display text-ink/50">or</span>
        <hr className="flex-1 border-ink/20" />
      </div>

      <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleGoogle}>
        Continue with Google
      </Button>
    </form>
  );
}
