"use server";
import { z } from "zod";
import { Resend } from "resend";

const REASONS = [
  "Brand collab",
  "Venue partnership",
  "Press / interview",
  "RSVP help",
  "Other",
] as const;

const Schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
  reason: z.enum(REASONS),
  website: z.string().max(0).optional(), // honeypot
});

export async function submitContact(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    reason: formData.get("reason"),
    website: formData.get("website") ?? "",
  };

  if (raw.website) return { ok: false, error: "invalid" };

  const parsed = Schema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "validation" };

  const { name, email, message, reason } = parsed.data;

  if (!process.env.RESEND_API_KEY) {
    console.warn("[contact] RESEND_API_KEY not set — email not sent");
    return { ok: true }; // Succeed silently in dev
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "hi@catscandance.com",
      to: ["hello@catscandance.com"],
      replyTo: email,
      subject: `[${reason}] ${name} — CCD Contact`,
      text: `From: ${name} <${email}>\nReason: ${reason}\n\n${message}`,
    });
    return { ok: true };
  } catch (err) {
    console.error("[contact] send failed:", err);
    return { ok: false, error: "send_failed" };
  }
}
