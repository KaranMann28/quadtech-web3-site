import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimit, clientIp } from "@/lib/apply/rate-limit";
import { isAllowlistedUpn } from "@/lib/auth/allowlist";
import { auth } from "@/lib/auth";

export class AdminError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function requireAdmin(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? "";
  if (!email) throw new AdminError(401, "Sign in required.");
  if (!isAllowlistedUpn(email)) throw new AdminError(403, "This account is not an admin.");
  const headerList = await headers();
  const ip = clientIp(headerList.get("x-forwarded-for") ?? headerList.get("x-real-ip"));
  if (!rateLimit(`admin:${email}:${ip}`, 120, 60 * 60 * 1000)) {
    throw new AdminError(429, "Too many admin requests. Wait a few minutes and try again.");
  }
  return email;
}

export function redirectIfDenied(error: unknown): void {
  if (!(error instanceof AdminError)) return;
  if (error.status === 401) redirect("/admin/signin");
  if (error.status === 403) redirect("/admin/not-authorized");
}
