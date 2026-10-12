import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/apply/rate-limit";
import { handleApplication } from "@/lib/apply/process";

export const runtime = "nodejs";

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { ok: false, message: "Cross-site submissions are not accepted." },
      { status: 403 },
    );
  }
  const ip = clientIp(request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip"));
  if (!rateLimit(`apply:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, message: "Too many applications from this network. Try again later." },
      { status: 429 },
    );
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not read the form. Keep the résumé at or under 5 MB." },
      { status: 400 },
    );
  }
  const result = await handleApplication(form);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.message, fieldErrors: result.fieldErrors },
      { status: result.status },
    );
  }
  return NextResponse.json({ ok: true });
}
