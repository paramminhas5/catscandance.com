"use server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { signups } from "@/lib/db/schema";

const Schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  source: z.string().max(50).default("home"),
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export async function submitEarlyAccess(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    source: formData.get("source") ?? "home",
    website: formData.get("website") ?? "",
  };

  // Honeypot — bot filled the hidden field
  if (raw.website) return { ok: false, duplicate: false, error: "invalid" };

  const parsed = Schema.safeParse(raw);
  if (!parsed.success) return { ok: false, duplicate: false, error: "invalid_email" };

  try {
    await db
      .insert(signups)
      .values({ email: parsed.data.email, tag: "early_access" })
      .onConflictDoNothing();

    return { ok: true, duplicate: false };
  } catch {
    return { ok: false, duplicate: false, error: "server_error" };
  }
}
