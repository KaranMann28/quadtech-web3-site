import { z } from "zod";
import {
  COUNTRIES,
  ENGAGEMENT_TYPES,
  INDUSTRY_SLUGS,
  LOCATION_MODES,
  SERVICE_LINES,
} from "@/lib/taxonomy";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date (YYYY-MM-DD).")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Date is not a real calendar day.");

export const JOB_STATUSES = ["draft", "published", "closed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

const jobContentShape = {
  title: z.string().trim().min(3, "Enter a title.").max(160),
  serviceLine: z.enum(SERVICE_LINES, { error: "Select a service line." }),
  industry: z.enum(INDUSTRY_SLUGS, { error: "Select an industry." }),
  location: z.object({
    city: z.string().trim().min(1, "Enter a city.").max(80),
    region: z.string().trim().min(1, "Enter a region.").max(80),
    country: z.enum(COUNTRIES, { error: "Select the United States or Canada." }),
    mode: z.enum(LOCATION_MODES, { error: "Select a location mode." }),
  }),
  /**
   * Optional extra countries for roles open in both the US and Canada.
   * location.country stays the primary country for postal address data.
   * TODO [CONFIRM] how dual-country remote roles should be labeled once a role is published.
   */
  workCountries: z.array(z.enum(COUNTRIES)).min(1).optional(),
  type: z.enum(ENGAGEMENT_TYPES, { error: "Select an engagement type." }),
  durationWeeks: z.number().int().positive().optional(),
  payRange: z
    .object({
      min: z.number().positive("Enter a pay minimum."),
      max: z.number().positive("Enter a pay maximum."),
      currency: z.enum(["USD", "CAD"]),
      unit: z.enum(["hour", "day"]),
    })
    .refine((pay) => pay.max >= pay.min, "Pay max must be greater than or equal to min.")
    .optional(),
  postedDate: isoDate,
  closingDate: isoDate.optional(),
  summary: z.string().trim().min(20, "Summary must be at least 20 characters.").max(600),
  responsibilities: z.array(z.string().trim().min(3)).min(1, "Add at least one responsibility.").max(12),
  requirements: z.array(z.string().trim().min(3)).min(1, "Add at least one requirement.").max(16),
  niceToHave: z.array(z.string().trim().min(3)).max(12).optional(),
  travel: z.string().trim().min(3).max(400).optional(),
  /** Never rendered. Holds owner notes, including TODO [CONFIRM] items, on draft roles. */
  internalNote: z.string().trim().max(2000).optional(),
};

const slugField = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case.");

function withDateOrder<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).refine(
    (job) => {
      const closing = "closingDate" in job ? job.closingDate : undefined;
      const posted = "postedDate" in job ? job.postedDate : undefined;
      return typeof closing !== "string" || typeof posted !== "string" || closing >= posted;
    },
    { message: "Closing date must be on or after the posted date.", path: ["closingDate"] },
  );
}

/** Single validation source for stored jobs and the admin form. */
export const jobSchema = withDateOrder({
  slug: slugField,
  jobId: z.string().regex(/^QT-JOB-\d{4}-\d{3}$/, "Job ID must look like QT-JOB-2026-001."),
  ...jobContentShape,
  status: z.enum(JOB_STATUSES),
});

/** Admin create/edit fields. jobId, slug, and status are assigned by the server. */
export const jobFormSchema = withDateOrder({
  ...jobContentShape,
  slug: slugField.optional().or(z.literal("")),
});

export type Job = z.infer<typeof jobSchema>;
export type JobFormInput = z.infer<typeof jobFormSchema>;

export type PublicJob = Omit<Job, "status" | "internalNote">;

export function toPublicJob(job: Job): PublicJob {
  const { status, internalNote, ...rest } = job;
  void status;
  void internalNote;
  return rest;
}

/** Phase-1 JSON files used `draft: boolean`. Map that onto status before parsing. */
export function normalizeJobInput(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const record = { ...(raw as Record<string, unknown>) };
  if (typeof record.status !== "string" && typeof record.draft === "boolean") {
    record.status = record.draft ? "draft" : "published";
  }
  delete record.draft;
  return record;
}
