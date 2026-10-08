import { randomUUID } from "node:crypto";
import type { Application as ApplicationRow } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import type { ApplicationFields } from "@/lib/apply/schema";
import { storeResume, readResume } from "@/lib/resumes/storage";
import { startOfUtcWeek } from "@/lib/jobs/visibility";

export const APPLICATION_STATUSES = ["new", "reviewed", "contacted", "archived"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ScreenerAnswer = { id: string; label: string; answer: string };

export type ApplicationRecord = {
  id: string;
  jobId: string | null;
  jobTitle: string | null;
  jobSlug: string | null;
  kind: string;
  fullName: string;
  email: string;
  phone: string;
  cityRegion: string;
  country: string;
  workAuthorization: string;
  linkedin: string;
  referral: string;
  message: string;
  serviceLine: string;
  screeners: ScreenerAnswer[];
  resumeFilename: string;
  resumeContentType: string;
  status: ApplicationStatus;
  submittedAt: Date;
};

function toRecord(
  row: ApplicationRow & { job?: { title: string; slug: string } | null },
): ApplicationRecord {
  return {
    id: row.id,
    jobId: row.jobId,
    jobTitle: row.job?.title ?? null,
    jobSlug: row.job?.slug ?? null,
    kind: row.kind,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    cityRegion: row.cityRegion,
    country: row.country,
    workAuthorization: row.workAuthorization,
    linkedin: row.linkedin,
    referral: row.referral,
    message: row.message,
    serviceLine: row.serviceLine,
    screeners: JSON.parse(row.screeners) as ScreenerAnswer[],
    resumeFilename: row.resumeFilename,
    resumeContentType: row.resumeContentType,
    status: row.status as ApplicationStatus,
    submittedAt: row.submittedAt,
  };
}

export async function recordApplication(input: {
  jobId: string | null;
  kind: "job" | "talent-network";
  fields: ApplicationFields;
  serviceLine: string;
  screeners: ScreenerAnswer[];
  resume: { filename: string; contentType: string; bytes: Buffer };
}): Promise<string> {
  const id = randomUUID();
  const resumeKey = await storeResume(id, input.resume.bytes, input.resume.contentType);
  await getPrisma().application.create({
    data: {
      id,
      jobId: input.jobId,
      kind: input.kind,
      fullName: input.fields.fullName,
      email: input.fields.email,
      phone: input.fields.phone,
      cityRegion: input.fields.cityRegion,
      country: input.fields.country,
      workAuthorization: input.fields.workAuthorization,
      linkedin: input.fields.linkedin,
      referral: input.fields.referral,
      message: input.fields.message,
      serviceLine: input.serviceLine,
      screeners: JSON.stringify(input.screeners),
      resumeKey,
      resumeFilename: input.resume.filename,
      resumeContentType: input.resume.contentType,
      resumeBytes: resumeKey.startsWith("db:") ? Uint8Array.from(input.resume.bytes) : undefined,
      status: "new",
    },
  });
  return id;
}

export async function listApplications(filters: {
  status?: string;
  jobId?: string | null;
}): Promise<ApplicationRecord[]> {
  const rows = await getPrisma().application.findMany({
    where: {
      status: filters.status || undefined,
      jobId: filters.jobId === null ? null : filters.jobId || undefined,
    },
    include: { job: { select: { title: true, slug: true } } },
    orderBy: { submittedAt: "desc" },
  });
  return rows.map(toRecord);
}

export async function getApplication(id: string): Promise<(ApplicationRecord & { resumeKey: string }) | null> {
  const row = await getPrisma().application.findUnique({
    where: { id },
    include: { job: { select: { title: true, slug: true } } },
  });
  if (!row) return null;
  return { ...toRecord(row), resumeKey: row.resumeKey };
}

export async function setApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  await getPrisma().application.update({ where: { id }, data: { status } });
}

export async function applicationResume(id: string): Promise<{
  filename: string;
  contentType: string;
  bytes: Buffer;
} | null> {
  const row = await getPrisma().application.findUnique({ where: { id } });
  if (!row) return null;
  const bytes = await readResume(row.resumeKey, row.resumeBytes);
  return { filename: row.resumeFilename, contentType: row.resumeContentType, bytes };
}

export async function countApplicationsSince(since: Date): Promise<number> {
  return getPrisma().application.count({ where: { submittedAt: { gte: since } } });
}

export async function newestApplications(limit = 5): Promise<ApplicationRecord[]> {
  const rows = await getPrisma().application.findMany({
    include: { job: { select: { title: true, slug: true } } },
    orderBy: { submittedAt: "desc" },
    take: limit,
  });
  return rows.map(toRecord);
}

export async function applicationsThisWeek(now = new Date()): Promise<number> {
  return countApplicationsSince(startOfUtcWeek(now));
}
