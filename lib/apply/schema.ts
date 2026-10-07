import { z } from "zod";
import type { Screener } from "@/lib/jobs/screeners";
import { COUNTRIES, WORK_AUTH } from "@/lib/taxonomy";

const phonePattern = /^[+()0-9.\-\s]{7,40}$/;

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.email("Enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((value) => phonePattern.test(value) && value.replace(/\D/g, "").length >= 7, {
      message: "Enter a phone number with at least 7 digits.",
    }),
  cityRegion: z.string().trim().min(2, "Enter your city and region.").max(120),
  country: z.enum(COUNTRIES, { error: "Select the United States or Canada." }),
  workAuthorization: z.enum(WORK_AUTH, {
    error: "Select your work authorization.",
  }),
  linkedin: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https:\/\/([a-z0-9-]+\.)*linkedin\.com\/.+/i.test(value), {
      message: "LinkedIn must be an https://linkedin.com URL, or leave it blank.",
    }),
  referral: z.string().trim().max(200),
  message: z.string().trim().max(4000),
  consent: z.literal(true, { error: "Consent is required." }),
});

export type ApplicationFields = z.infer<typeof applicationSchema>;

export type FieldErrors = Record<string, string>;

export function issuesToFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function validateScreeners(
  screeners: Screener[],
  answers: Record<string, string>,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const screener of screeners) {
    const value = (answers[screener.id] ?? "").trim();
    const key = `screener__${screener.id}`;
    if (screener.required && !value) {
      errors[key] = "This answer is required.";
      continue;
    }
    if (!value) continue;
    if (value.length > 2000) {
      errors[key] = "Keep this answer under 2,000 characters.";
      continue;
    }
    if (screener.type === "number") {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 60) {
        errors[key] = "Enter a number from 0 to 60.";
      }
    }
  }
  return errors;
}
