import { z } from "zod";
import { DeliveryError, isEmailConfigured, jsonMailAllowed } from "@/lib/apply/deliver";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.email("Enter a valid email address.").max(200),
  phone: z.string().trim().max(40),
  message: z.string().trim().min(10, "Enter a message of at least 10 characters.").max(4000),
});

export type ContactResult =
  | { ok: true }
  | { ok: false; status: number; message: string; fieldErrors?: Record<string, string> };

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function contactInbox(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || process.env.CONTACT_EMAIL?.trim() || process.env.APPLY_TO_EMAIL?.trim() || "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendViaResend(input: { subject: string; text: string; replyTo: string; html: string }): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim() ?? "";
  const to = contactInbox();
  const from = process.env.RESEND_FROM?.trim() || "Quad Tech Solutions <onboarding@resend.dev>";
  if (!key || !to) {
    throw new DeliveryError("Contact email is not configured.", "not-configured");
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
  if (error) {
    throw new DeliveryError(error.message || "Resend failed.", "send-failed");
  }
}

async function sendContactEmail(input: {
  subject: string;
  text: string;
  replyTo: string;
  html: string;
}): Promise<void> {
  if (process.env.RESEND_API_KEY?.trim()) {
    await sendViaResend(input);
    return;
  }
  const host = process.env.APPLY_SMTP_HOST?.trim() ?? "";
  const to = contactInbox();
  const from = process.env.APPLY_SMTP_FROM?.trim() ?? "";
  if (!to || !isEmailConfigured()) {
    throw new DeliveryError("Contact email is not configured.", "not-configured");
  }
  if (host === "json") {
    if (!jsonMailAllowed()) {
      throw new DeliveryError("The JSON mail transport cannot be used in production.", "not-configured");
    }
    const transporter = nodemailer.createTransport({ jsonTransport: true });
    await transporter.sendMail({ from, to, replyTo: input.replyTo, subject: input.subject, text: input.text });
    return;
  }
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.APPLY_SMTP_PORT || 587),
    secure: process.env.APPLY_SMTP_SECURE === "true",
    auth: {
      user: process.env.APPLY_SMTP_USER?.trim() ?? "",
      pass: process.env.APPLY_SMTP_PASS ?? "",
    },
  });
  await transporter.sendMail({
    from,
    to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
  });
}

export async function handleContact(form: FormData): Promise<ContactResult> {
  if (text(form, "company_website").trim() !== "") return { ok: true };
  const parsed = contactSchema.safeParse({
    name: text(form, "name"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    message: text(form, "message"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, status: 400, message: "Check the highlighted fields.", fieldErrors };
  }
  const body = [
    `Name: ${parsed.data.name}`,
    `Email: ${parsed.data.email}`,
    `Phone: ${parsed.data.phone || "(not provided)"}`,
    "",
    parsed.data.message,
  ].join("\n");
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(parsed.data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(parsed.data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(parsed.data.phone || "(not provided)")}</p>
    <pre>${escapeHtml(parsed.data.message)}</pre>
  `;
  try {
    await sendContactEmail({
      subject: `Website inquiry — ${parsed.data.name}`,
      text: body,
      replyTo: parsed.data.email,
      html,
    });
  } catch (error) {
    if (error instanceof DeliveryError && error.code === "not-configured") {
      return {
        ok: false,
        status: 503,
        message:
          "This inbox is not configured, so the message was not sent. TODO [CONFIRM] a contact address before launch.",
      };
    }
    return { ok: false, status: 502, message: "The message could not be sent. Try again shortly." };
  }
  return { ok: true };
}
