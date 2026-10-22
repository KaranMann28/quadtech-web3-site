import { z } from "zod";

const phonePattern = /^[+()0-9.\-\s]{7,40}$/;

/**
 * The application asks for the minimum a recruiter needs: name, email, résumé,
 * and (for a posted role) whether the candidate is authorized to work in the
 * posting's work-authorization country or countries (Canada unless the role
 * sets another).
 * Phone and LinkedIn are optional. City, referral, message,
 * and screening questions were dropped in the 2026-10 simplification; their
 * database columns remain for older rows.
 */
export const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(60),
  lastName: z.string().trim().min(1, "Enter your last name.").max(60),
  email: z.email("Enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine(
      (value) =>
        value === "" || (phonePattern.test(value) && value.replace(/\D/g, "").length >= 7),
      { message: "Enter a phone number with at least 7 digits, or leave it blank." },
    ),
  linkedin: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https:\/\/([a-z0-9-]+\.)*linkedin\.com\/.+/i.test(value), {
      message: "LinkedIn must be an https://linkedin.com URL, or leave it blank.",
    }),
});

export type ApplicationFields = z.infer<typeof applicationSchema>;

/** Stored values for the yes/no work-authorization question on posted roles. */
export const WORK_AUTH_YES = "authorized";
export const WORK_AUTH_NO = "not-authorized";

export type FieldErrors = Record<string, string>;

export function issuesToFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function fullNameOf(fields: Pick<ApplicationFields, "firstName" | "lastName">): string {
  return `${fields.firstName} ${fields.lastName}`.replace(/\s+/g, " ").trim();
}
