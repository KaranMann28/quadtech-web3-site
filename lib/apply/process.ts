import { postWebhook, resumeForWebhook, sendApplicationEmail, DeliveryError } from "@/lib/apply/deliver";
import { validateResume } from "@/lib/apply/files";
import {
  applicationSchema,
  fullNameOf,
  issuesToFieldErrors,
  WORK_AUTH_NO,
  WORK_AUTH_YES,
  type FieldErrors,
} from "@/lib/apply/schema";
import { recordApplication } from "@/lib/applications/store";
import { getPublishedJob } from "@/lib/jobs/store";
import type { PublicJob } from "@/lib/jobs/schema";
import { countryName } from "@/lib/taxonomy";

export type ApplyResult =
  | { ok: true }
  | { ok: false; status: number; message: string; fieldErrors?: FieldErrors };

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

async function readResume(form: FormData) {
  const value = form.get("resume");
  if (!(value instanceof File)) return null;
  const bytes = Buffer.from(await value.arrayBuffer());
  return { name: value.name, type: value.type, bytes };
}

function buildEmail(input: {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  workAuthorization: "" | typeof WORK_AUTH_YES | typeof WORK_AUTH_NO;
  job?: PublicJob;
}) {
  const { job } = input;
  const lines = [
    job ? `Role: ${job.title}` : "Role: Talent network (no specific posting)",
    job ? `Job ID: ${job.jobId}` : null,
    job ? `Service line: ${job.serviceLine}` : null,
    "",
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "(not provided)"}`,
    `LinkedIn: ${input.linkedin || "(not provided)"}`,
    job && input.workAuthorization
      ? `Authorized to work in ${countryName(job.location.country)}: ${
          input.workAuthorization === WORK_AUTH_YES ? "Yes" : "No"
        }`
      : null,
    "",
    "Submitted from the careers site. The form states that by submitting, the applicant agrees Quad Tech Solutions Inc. may store the information for recruiting.",
    `Submitted: ${new Date().toISOString()}`,
  ].filter((line): line is string => line !== null);

  const subject = job
    ? `Application ${job.jobId} — ${job.title} — ${input.fullName}`
    : `Talent network application — ${input.fullName}`;

  return { subject, text: lines.join("\n"), applicantName: input.fullName, applicantEmail: input.email };
}

export async function handleApplication(form: FormData): Promise<ApplyResult> {
  if (text(form, "company_website").trim() !== "") {
    return { ok: true };
  }

  const kind = text(form, "kind");
  let job: PublicJob | undefined;

  if (kind === "job") {
    job = await getPublishedJob(text(form, "jobSlug"));
    if (!job) {
      return {
        ok: false,
        status: 404,
        message: "This role is not open for applications.",
      };
    }
  } else if (kind !== "talent-network") {
    return { ok: false, status: 400, message: "Unknown application type." };
  }

  const parsed = applicationSchema.safeParse({
    firstName: text(form, "firstName"),
    lastName: text(form, "lastName"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    linkedin: text(form, "linkedin"),
  });

  const fieldErrors: FieldErrors = parsed.success ? {} : issuesToFieldErrors(parsed.error);

  // The yes/no work-authorization question is asked on posted roles only,
  // for the posting's country. The talent network has no country context.
  let workAuthorization: "" | typeof WORK_AUTH_YES | typeof WORK_AUTH_NO = "";
  if (job) {
    const answer = text(form, "workAuthorization");
    if (answer === "yes") workAuthorization = WORK_AUTH_YES;
    else if (answer === "no") workAuthorization = WORK_AUTH_NO;
    else fieldErrors.workAuthorization = "Select yes or no.";
  }

  const resumeResult = validateResume(await readResume(form));
  if (!resumeResult.ok) fieldErrors.resume = resumeResult.message;

  if (!parsed.success || !resumeResult.ok || Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 400,
      message: "Check the highlighted fields.",
      fieldErrors,
    };
  }

  const fullName = fullNameOf(parsed.data);
  const mail = buildEmail({
    fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    linkedin: parsed.data.linkedin,
    workAuthorization,
    job,
  });

  const resume = resumeResult.resume;
  try {
    await recordApplication({
      jobId: job?.jobId ?? null,
      kind: kind === "job" ? "job" : "talent-network",
      fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      linkedin: parsed.data.linkedin,
      country: job?.location.country ?? "",
      workAuthorization,
      serviceLine: job?.serviceLine ?? "General",
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
    serviceLine: job?.serviceLine ?? "General",
    applicant: {
      fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      cityRegion: "",
      country: job?.location.country ?? "",
      workAuthorization,
      linkedin: parsed.data.linkedin,
      referral: "",
      message: "",
    },
    screeners: [],
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
