"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      const result = await signUp.email({ name, email, password, callbackURL: redirectTo });
      if (result.error) {
        setError(result.error.message ?? "Could not create your account.");
        return;
      }
      toast.success("You're in.");
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" autoComplete="name" required minLength={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
        <p className="text-xs text-ink/60">Minimum 8 characters.</p>
      </div>

      {error ? (
        <p className="border-2 border-ink bg-bubblegum px-3 py-2 text-sm text-ink">{error}</p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Creating…" : "Create account"}
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
