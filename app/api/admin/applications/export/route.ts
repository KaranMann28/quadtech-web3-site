import { NextResponse } from "next/server";
import { AdminError, requireAdmin } from "@/lib/admin/guard";
import { listApplications } from "@/lib/applications/store";

export const runtime = "nodejs";

function cell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    const status = error instanceof AdminError ? error.status : 401;
    return NextResponse.json({ ok: false, message: "Sign in required." }, { status });
  }
  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "";
  const jobId = url.searchParams.get("jobId") ?? "";
  const rows = await listApplications({
    status,
    jobId: jobId === "none" ? null : jobId,
  });
  const header = [
    "submittedAt",
    "status",
    "fullName",
    "email",
    "phone",
    "cityRegion",
    "country",
    "workAuthorization",
    "jobId",
    "jobTitle",
    "serviceLine",
    "linkedin",
    "referral",
    "message",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.submittedAt.toISOString(),
        row.status,
        row.fullName,
        row.email,
        row.phone,
        row.cityRegion,
        row.country,
        row.workAuthorization,
        row.jobId ?? "",
        row.jobTitle ?? "Talent network",
        row.serviceLine,
        row.linkedin,
        row.referral,
        row.message,
      ]
        .map(cell)
        .join(","),
    ),
  ];
  return new NextResponse(lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=\"applications.csv\"",
      "cache-control": "private, no-store",
    },
  });
}
