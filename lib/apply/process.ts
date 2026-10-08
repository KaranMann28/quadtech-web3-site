import { postWebhook, resumeForWebhook, sendApplicationEmail, DeliveryError } from "@/lib/apply/deliver";
import { validateResume } from "@/lib/apply/files";
import {
  applicationSchema,
  issuesToFieldErrors,
  validateScreeners,
  type FieldErrors,
} from "@/lib/apply/schema";
import { recordApplication } from "@/lib/applications/store";
import { getPublishedJob } from "@/lib/jobs/store";
import { screenersForKey, screenersForService, type Screener } from "@/lib/jobs/screeners";
import type { PublicJob } from "@/lib/jobs/schema";
import {
  countryName,
  serviceLineFromSlug,
  WORK_AUTH_LABELS,
  type ServiceSlug,
  type WorkAuth,
} from "@/lib/taxonomy";

export type ApplyResult =
  | { ok: true }
  | { ok: false; status: number; message: string; fieldErrors?: FieldErrors };

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function screenerAnswers(form: FormData, screeners: Screener[]): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const screener of screeners) {
    answers[screener.id] = text(form, `screener__${screener.id}`);
  }
  return answers;
}

async function readResume(form: FormData) {
  const value = form.get("resume");
  if (!(value instanceof File)) return null;
  const bytes = Buffer.from(await value.arrayBuffer());
  return { name: value.name, type: value.type, bytes };
}

function buildEmail(input: {
  fields: {
    fullName: string;
    email: string;
    phone: string;
    cityRegion: string;
    country: "US" | "CA";
    workAuthorization: WorkAuth;
    linkedin: string;
    referral: string;
    message: string;
  };
  screeners: Screener[];
  answers: Record<string, string>;
  job?: PublicJob;
  serviceLabel: string;
}) {
  const { fields, job } = input;
  const lines = [
    job
      ? `Role: ${job.title}`
      : "Role: Talent network (no specific posting)",
    job ? `Job ID: ${job.jobId}` : null,
    job ? `Service line: ${job.serviceLine}` : `Service line: ${input.serviceLabel}`,
    job ? `Industry: ${job.industry}` : null,
    "",
    `Name: ${fields.fullName}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `City / region: ${fields.cityRegion}`,
    `Country: ${countryName(fields.country)}`,
    `Work authorization (${countryName(fields.country)}): ${WORK_AUTH_LABELS[fields.workAuthorization]}`,
    `LinkedIn: ${fields.linkedin || "(not provided)"}`,
    `How they heard: ${fields.referral || "(not provided)"}`,
    "",
    "Screening answers:",
    ...input.screeners.map(
      (screener) => `- ${screener.label}: ${input.answers[screener.id]?.trim() || "(blank)"}`,
    ),
    "",
    "Message:",
    fields.message || "(none)",
    "",
    "Consent: applicant agreed the information is used for recruiting only.",
    `Submitted: ${new Date().toISOString()}`,
  ].filter((line): line is string => line !== null);

  const subject = job
    ? `Application ${job.jobId} — ${job.title} — ${fields.fullName}`
    : `Talent network application — ${fields.fullName}`;

  return { subject, text: lines.join("\n"), applicantName: fields.fullName, applicantEmail: fields.email };
}

export async function handleApplication(form: FormData): Promise<ApplyResult> {
  if (text(form, "company_website").trim() !== "") {
    return { ok: true };
  }

  const kind = text(form, "kind");
  let job: PublicJob | undefined;
  let screeners: Screener[] = [];
  let serviceLabel = "";

  if (kind === "job") {
    job = await getPublishedJob(text(form, "jobSlug"));
    if (!job) {
      return {
        ok: false,
        status: 404,
        message: "This role is not open for applications.",
      };
    }
    screeners = screenersForService(job.serviceLine);
    serviceLabel = job.serviceLine;
  } else if (kind === "talent-network") {
    const selected = text(form, "serviceLine");
    if (selected === "general") {
      screeners = screenersForKey("general");
      serviceLabel = "Multiple service lines / not sure yet";
    } else {
      const line = serviceLineFromSlug(selected);
      if (!line) {
        return {
          ok: false,
          status: 400,
          message: "Select a service line.",
          fieldErrors: { serviceLine: "Select a service line." },
        };
      }
      screeners = screenersForKey(selected as ServiceSlug);
      serviceLabel = line;
    }
  } else {
    return { ok: false, status: 400, message: "Unknown application type." };
  }

  const parsed = applicationSchema.safeParse({
    fullName: text(form, "fullName"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    cityRegion: text(form, "cityRegion"),
    country: text(form, "country"),
    workAuthorization: text(form, "workAuthorization"),
    linkedin: text(form, "linkedin"),
    referral: text(form, "referral"),
    message: text(form, "message"),
    consent: text(form, "consent") === "true",
  });

  const answers = screenerAnswers(form, screeners);
  const screenerErrors = validateScreeners(screeners, answers);
  const fieldErrors: FieldErrors = {
    ...(parsed.success ? {} : issuesToFieldErrors(parsed.error)),
    ...screenerErrors,
  };

  const resumeResult = validateResume(await readResume(form));
  if (!resumeResult.ok) fieldErrors.resume = resumeResult.message;

  if (!parsed.success || Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 400,
      message: "Check the highlighted fields.",
      fieldErrors,
    };
  }

  const mail = buildEmail({
    fields: parsed.data,
    screeners,
    answers,
    job,
    serviceLabel,
  });

  if (!resumeResult.ok) {
    return {
      ok: false,
      status: 400,
      message: "Check the highlighted fields.",
      fieldErrors,
    };
  }

  const resume = resumeResult.resume;
  try {
    await recordApplication({
      jobId: job?.jobId ?? null,
      kind: kind === "job" ? "job" : "talent-network",
      fields: parsed.data,
      serviceLine: serviceLabel,
      screeners: screeners.map((screener) => ({
        id: screener.id,
        label: screener.label,
        answer: answers[screener.id]?.trim() ?? "",
      })),
      resume,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown database error";
    console.error("The application could not be recorded.", detail);
    return {
      ok: false,
      status: 500,
      message: "The application could not be recorded. Try again shortly.",
    };
  }

  try {
    await sendApplicationEmail(mail, resume);
  } catch (error) {
    if (error instanceof DeliveryError && error.code === "not-configured") {
      console.warn(
        "Application saved to Postgres. HR email was not sent. Set APPLY_SMTP_* or RESEND_API_KEY. Inbox is HR@quadtechsolutions.com.",
      );
    } else {
      const detail = error instanceof Error ? error.message : "Unknown mail error";
      console.error("Application saved to Postgres, but the careers email failed.", detail);
    }
  }

  const webhookResume = resumeForWebhook(resume);
  const webhook = await postWebhook({
    kind,
    submittedAt: new Date().toISOString(),
    job: job
      ? { slug: job.slug, jobId: job.jobId, title: job.title, serviceLine: job.serviceLine }
      : null,
    serviceLine: serviceLabel,
    applicant: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      cityRegion: parsed.data.cityRegion,
      country: parsed.data.country,
      workAuthorization: parsed.data.workAuthorization,
      linkedin: parsed.data.linkedin,
      referral: parsed.data.referral,
      message: parsed.data.message,
    },
    screeners: screeners.map((screener) => ({
      id: screener.id,
      label: screener.label,
      answer: answers[screener.id]?.trim() ?? "",
    })),
    resume: {
      filename: resume.filename,
      contentType: resume.contentType,
      byteLength: resume.bytes.length,
      note: webhookResume.note,
      base64: webhookResume.base64,
    },
  });

  if (webhook === "failed") {
    console.error("Application was recorded and the Zapier webhook failed.");
  }

  return { ok: true };
}
