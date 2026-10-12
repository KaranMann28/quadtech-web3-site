import nodemailer from "nodemailer";
import type { ResumeFile } from "@/lib/apply/files";

export type ApplicationEmail = {
  subject: string;
  text: string;
  applicantName: string;
  applicantEmail: string;
};

export type WebhookBody = Record<string, unknown>;

export class DeliveryError extends Error {
  constructor(
    message: string,
    readonly code: "not-configured" | "send-failed",
  ) {
    super(message);
  }
}

function smtpConfig() {
  return {
    host: process.env.APPLY_SMTP_HOST?.trim() ?? "",
    port: Number(process.env.APPLY_SMTP_PORT || 587),
    secure: process.env.APPLY_SMTP_SECURE === "true",
    user: process.env.APPLY_SMTP_USER?.trim() ?? "",
    pass: process.env.APPLY_SMTP_PASS ?? "",
    from: process.env.APPLY_SMTP_FROM?.trim() ?? "",
    to: process.env.APPLY_TO_EMAIL?.trim() ?? "",
  };
}

export function isEmailConfigured(): boolean {
  const cfg = smtpConfig();
  if (process.env.RESEND_API_KEY?.trim() && cfg.to) return true;
  if (cfg.host === "json") return Boolean(cfg.from && cfg.to) && jsonMailAllowed();
  return Boolean(cfg.host && cfg.from && cfg.to && cfg.user && cfg.pass);
}

/**
 * JSON transport writes the message locally and does not deliver mail.
 * `next start` sets NODE_ENV=production, so a loopback AUTH_URL is still allowed.
 * A public origin is refused.
 */
export function jsonMailAllowed(): boolean {
  if ((process.env.APPLY_SMTP_HOST?.trim() ?? "") !== "json") return false;
  if (process.env.NODE_ENV !== "production") return true;
  const raw = process.env.AUTH_URL?.trim() ?? "";
  try {
    const host = new URL(raw).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

export async function sendApplicationEmail(
  mail: ApplicationEmail,
  resume: ResumeFile,
): Promise<{ message?: string }> {
  const cfg = smtpConfig();
  if (!isEmailConfigured()) {
    throw new DeliveryError(
      "Application email is not configured. The careers inbox is HR@quadtechsolutions.com. TODO [CONFIRM] the SMTP provider or RESEND_API_KEY.",
      "not-configured",
    );
  }

  if (process.env.RESEND_API_KEY?.trim() && cfg.to) {
    const { Resend } = await import("resend");
    const from = process.env.RESEND_FROM?.trim() || cfg.from || "Quad Tech Solutions <onboarding@resend.dev>";
    const resend = new Resend(process.env.RESEND_API_KEY.trim());
    const { error } = await resend.emails.send({
      from,
      to: cfg.to,
      replyTo: mail.applicantEmail,
      subject: mail.subject,
      text: mail.text,
      attachments: [
        {
          filename: resume.filename,
          content: resume.bytes,
          contentType: resume.contentType,
        },
      ],
    });
    if (error) {
      throw new DeliveryError(error.message || "Resend failed.", "send-failed");
    }
    return { message: "resend" };
  }

  const jsonTransport = cfg.host === "json";
  if (jsonTransport && !jsonMailAllowed()) {
    throw new DeliveryError("The JSON mail transport cannot be used in production.", "not-configured");
  }

  const transporter = jsonTransport
    ? nodemailer.createTransport({ jsonTransport: true })
    : nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: { user: cfg.user, pass: cfg.pass },
      });

  try {
    const info = await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      replyTo: mail.applicantEmail,
      subject: mail.subject,
      text: mail.text,
      attachments: [
        {
          filename: resume.filename,
          content: resume.bytes,
          contentType: resume.contentType,
        },
      ],
    });
    return { message: typeof info.message === "string" ? info.message : undefined };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown mail error";
    console.error("Application email failed:", detail);
    throw new DeliveryError("The application email could not be sent.", "send-failed");
  }
}

const MAX_WEBHOOK_BASE64 = 5 * 1024 * 1024;

export function resumeForWebhook(resume: ResumeFile): { included: boolean; base64?: string; note: string } {
  const base64 = resume.bytes.toString("base64");
  if (Buffer.byteLength(base64) > MAX_WEBHOOK_BASE64) {
    return {
      included: false,
      note: "Résumé omitted from the webhook because base64 exceeded 5 MB. The file is on the email.",
    };
  }
  return { included: true, base64, note: "Résumé included as base64." };
}

export async function postWebhook(
  body: WebhookBody,
  fetchImpl: typeof fetch = fetch,
): Promise<"sent" | "skipped" | "failed"> {
  const url = process.env.ZAPIER_HOOK_URL?.trim();
  if (!url) return "skipped";
  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error(`Zapier webhook returned ${response.status}. Submission was still accepted.`);
      return "failed";
    }
    return "sent";
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown webhook error";
    console.error("Zapier webhook failed. Submission was still accepted.", detail);
    return "failed";
  }
}
