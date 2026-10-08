import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { jsonMailAllowed } from "@/lib/apply/deliver";

function smtp() {
  return {
    host: process.env.APPLY_SMTP_HOST?.trim() ?? "",
    port: Number(process.env.APPLY_SMTP_PORT || 587),
    secure: process.env.APPLY_SMTP_SECURE === "true",
    user: process.env.APPLY_SMTP_USER?.trim() ?? "",
    pass: process.env.APPLY_SMTP_PASS ?? "",
    from: process.env.APPLY_SMTP_FROM?.trim() ?? "",
  };
}

export function magicLinkConfigured(): boolean {
  const cfg = smtp();
  if (cfg.host === "json") return Boolean(cfg.from) && jsonMailAllowed();
  return Boolean(cfg.host && cfg.from && cfg.user && cfg.pass);
}

/** Dev-only mailbox so a local magic link can be opened without a real SMTP server. */
export function rememberMagicLink(email: string, url: string): void {
  if (process.env.NODE_ENV === "production" && process.env.APPLY_SMTP_HOST !== "json") return;
  if (process.env.APPLY_SMTP_HOST !== "json") return;
  const file = path.join(process.cwd(), "data", "auth-links.log");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${new Date().toISOString()}\t${email}\t${url}\n`);
}

export async function sendAdminMagicLink(email: string, url: string): Promise<void> {
  const cfg = smtp();
  if (!magicLinkConfigured()) {
    throw new Error(
      "Admin email sign-in is not configured. TODO [CONFIRM] APPLY_SMTP_* or use Entra ID.",
    );
  }
  rememberMagicLink(email, url);
  const jsonTransport = cfg.host === "json";
  if (jsonTransport && !jsonMailAllowed()) {
    throw new Error("The JSON mail transport cannot be used in production.");
  }
  const transporter = jsonTransport
    ? nodemailer.createTransport({ jsonTransport: true })
    : nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: { user: cfg.user, pass: cfg.pass },
      });
  await transporter.sendMail({
    from: cfg.from,
    to: email,
    subject: "Quad Tech Solutions admin sign-in",
    text: `Open this link to sign in to the Quad admin area. It expires in 30 minutes.\n\n${url}\n`,
  });
}
