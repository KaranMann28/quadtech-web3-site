import type { Job as JobRow, Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import { nextJobId, slugFromTitle } from "@/lib/jobs/ids";
import { assertPublishable, parseJob } from "@/lib/jobs/load";
import {
  jobSchema,
  toPublicJob,
  type Job,
  type JobFormInput,
  type PublicJob,
} from "@/lib/jobs/schema";
import { closedPostState } from "@/lib/jobs/visibility";

export type JobRecord = Job & {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  publishedAt: Date | null;
  closedAt: Date | null;
  archived: boolean;
  slugLocked: boolean;
  previousSlugs: string[];
  applicationCount?: number;
};

export type PublicHit =
  | { kind: "published"; job: PublicJob; updatedAt: Date; publishedAt: Date | null }
  | { kind: "closed"; job: PublicJob; updatedAt: Date; closedAt: Date }
  | { kind: "redirect"; slug: string }
  | { kind: "gone" }
  | { kind: "missing" };

type JobWrite = {
  content: JobFormInput;
  slug: string;
  status: Job["status"];
  actor: string;
  slugLocked?: boolean;
  previousSlugs?: string[];
  publishedAt?: Date | null;
  closedAt?: Date | null;
  archived?: boolean;
};

function jsonList(value: string[] | undefined): string | null {
  if (!value || value.length === 0) return null;
  return JSON.stringify(value);
}

function parseList(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed) || parsed.length === 0) return undefined;
  return parsed.map(String);
}

export function rowToRecord(row: JobRow, applicationCount?: number): JobRecord {
  const content = jobSchema.parse({
    slug: row.slug,
    jobId: row.jobId,
    title: row.title,
    serviceLine: row.serviceLine,
    industry: row.industry,
    location: {
      city: row.city,
      region: row.region,
      country: row.country,
      mode: row.mode,
    },
    workCountries: parseList(row.workCountries),
    type: row.engagementType,
    durationWeeks: row.durationWeeks ?? undefined,
    payRange:
      row.payMin != null && row.payMax != null && row.payCurrency && row.payUnit
        ? {
            min: row.payMin,
            max: row.payMax,
            currency: row.payCurrency,
            unit: row.payUnit,
          }
        : undefined,
    postedDate: row.postedDate,
    closingDate: row.closingDate ?? undefined,
    summary: row.summary,
    responsibilities: JSON.parse(row.responsibilities) as string[],
    requirements: JSON.parse(row.requirements) as string[],
    niceToHave: parseList(row.niceToHave),
    travel: row.travel ?? undefined,
    internalNote: row.internalNote ?? undefined,
    status: row.status,
  });
  return {
    ...content,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    createdBy: row.createdBy,
    updatedBy: row.updatedBy,
    publishedAt: row.publishedAt,
    closedAt: row.closedAt,
    archived: row.archived,
    slugLocked: row.slugLocked,
    previousSlugs: parseList(row.previousSlugs) ?? [],
    applicationCount,
  };
}

function contentData(input: JobWrite): Prisma.JobUpdateInput {
  const job = input.content;
  return {
    slug: input.slug,
    title: job.title,
    serviceLine: job.serviceLine,
    industry: job.industry,
    city: job.location.city,
    region: job.location.region,
    country: job.location.country,
    mode: job.location.mode,
    workCountries: jsonList(job.workCountries),
    engagementType: job.type,
    durationWeeks: job.durationWeeks ?? null,
    payMin: job.payRange?.min ?? null,
    payMax: job.payRange?.max ?? null,
    payCurrency: job.payRange?.currency ?? null,
    payUnit: job.payRange?.unit ?? null,
    postedDate: job.postedDate,
    closingDate: job.closingDate ?? null,
    summary: job.summary,
    responsibilities: JSON.stringify(job.responsibilities),
    requirements: JSON.stringify(job.requirements),
    niceToHave: jsonList(job.niceToHave),
    travel: job.travel ?? null,
    internalNote: job.internalNote ?? null,
    status: input.status,
    slugLocked: input.slugLocked,
    previousSlugs: JSON.stringify(input.previousSlugs ?? []),
    publishedAt: input.publishedAt,
    closedAt: input.closedAt,
    archived: input.archived,
    updatedBy: input.actor,
  };
}

async function slugTaken(slug: string, exceptJobId?: string): Promise<boolean> {
  const existing = await getPrisma().job.findUnique({ where: { slug }, select: { jobId: true } });
  if (!existing) return false;
  return existing.jobId !== exceptJobId;
}

export async function listJobs(): Promise<JobRecord[]> {
  const rows = await getPrisma().job.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: { _count: { select: { applications: true } } },
  });
  return rows.map((row) => rowToRecord(row, row._count.applications));
}

export async function getJobByJobId(jobId: string): Promise<JobRecord | null> {
  const row = await getPrisma().job.findUnique({
    where: { jobId },
    include: { _count: { select: { applications: true } } },
  });
  return row ? rowToRecord(row, row._count.applications) : null;
}

export async function getPublishedJobs(): Promise<PublicJob[]> {
  const rows = await getPrisma().job.findMany({
    where: { status: "published", archived: false },
  });
  return rows
    .map((row) => toPublicJob(rowToRecord(row)))
    .sort((a, b) => b.postedDate.localeCompare(a.postedDate) || b.jobId.localeCompare(a.jobId));
}

export async function getPublishedJob(slug: string): Promise<PublicJob | undefined> {
  const hit = await resolvePublicSlug(slug);
  if (hit.kind !== "published") return undefined;
  return hit.job;
}

export async function resolvePublicSlug(slug: string, now = new Date()): Promise<PublicHit> {
  const prisma = getPrisma();
  const direct = await prisma.job.findUnique({ where: { slug } });
  if (direct) return hitForRow(direct, now);

  const rows = await prisma.job.findMany({
    select: { slug: true, previousSlugs: true, status: true, archived: true, closedAt: true },
  });
  for (const row of rows) {
    const previous = parseList(row.previousSlugs) ?? [];
    if (!previous.includes(slug)) continue;
    if (row.archived || row.status === "draft") return { kind: "missing" };
    if (row.status === "closed") {
      if (!row.closedAt || closedPostState(row.closedAt, now, false) !== "closed") {
        return { kind: "gone" };
      }
    }
    return { kind: "redirect", slug: row.slug };
  }
  return { kind: "missing" };
}

function hitForRow(row: JobRow, now: Date): PublicHit {
  if (row.archived || row.status === "draft") return { kind: "missing" };
  const record = rowToRecord(row);
  if (row.status === "published") {
    return {
      kind: "published",
      job: toPublicJob(record),
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt,
    };
  }
  if (!row.closedAt) return { kind: "missing" };
  const state = closedPostState(row.closedAt, now, false);
  if (state === "gone") return { kind: "gone" };
  return { kind: "closed", job: toPublicJob(record), updatedAt: row.updatedAt, closedAt: row.closedAt };
}

export async function createJob(content: JobFormInput, actor: string, now = new Date()): Promise<JobRecord> {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const existing = await tx.job.findMany({ select: { jobId: true } });
    const jobId = nextJobId(
      existing.map((row) => row.jobId),
      now,
    );
    const slug = content.slug?.trim() || slugFromTitle(content.title, jobId);
    const taken = await tx.job.findUnique({ where: { slug }, select: { jobId: true } });
    if (taken) throw new Error("That slug is already used.");
    const full = jobSchema.parse({ ...content, slug, jobId, status: "draft" });
    const row = await tx.job.create({
      data: {
        jobId,
        slug,
        title: full.title,
        serviceLine: full.serviceLine,
        industry: full.industry,
        city: full.location.city,
        region: full.location.region,
        country: full.location.country,
        mode: full.location.mode,
        workCountries: jsonList(full.workCountries),
        engagementType: full.type,
        durationWeeks: full.durationWeeks ?? null,
        payMin: full.payRange?.min ?? null,
        payMax: full.payRange?.max ?? null,
        payCurrency: full.payRange?.currency ?? null,
        payUnit: full.payRange?.unit ?? null,
        postedDate: full.postedDate,
        closingDate: full.closingDate ?? null,
        summary: full.summary,
        responsibilities: JSON.stringify(full.responsibilities),
        requirements: JSON.stringify(full.requirements),
        niceToHave: jsonList(full.niceToHave),
        travel: full.travel ?? null,
        internalNote: full.internalNote ?? null,
        status: "draft",
        createdBy: actor,
        updatedBy: actor,
        previousSlugs: "[]",
      },
    });
    return rowToRecord(row, 0);
  });
}

export async function updateJob(
  jobId: string,
  content: JobFormInput,
  actor: string,
  status: Job["status"],
): Promise<JobRecord> {
  const current = await getJobByJobId(jobId);
  if (!current) throw new Error("Post not found.");
  let slug = current.slug;
  let previous = current.previousSlugs;
  if (!current.slugLocked) {
    const requested = content.slug?.trim() || slugFromTitle(content.title, jobId);
    if (requested !== current.slug) {
      if (await slugTaken(requested, jobId)) throw new Error("That slug is already used.");
      previous = [...current.previousSlugs, current.slug];
      slug = requested;
    }
  }
  const full = jobSchema.parse({ ...content, slug, jobId, status });
  if (status === "published") assertPublishable(full, jobId);
  const publishingNow = status === "published" && current.status !== "published";
  const publishedAt = publishingNow ? new Date() : current.publishedAt;
  const closingNow = status === "closed" && current.status !== "closed";
  const closedAt =
    status === "closed" ? (closingNow || !current.closedAt ? new Date() : current.closedAt) : status === "published" ? null : current.closedAt;
  const row = await getPrisma().job.update({
    where: { jobId },
    data: {
      ...(contentData({
        content,
        slug,
        status,
        actor,
        slugLocked: current.slugLocked || status === "published",
        previousSlugs: previous,
        publishedAt,
        closedAt,
        archived: status === "published" ? false : current.archived,
      }) as Prisma.JobUpdateInput),
    },
    include: { _count: { select: { applications: true } } },
  });
  return rowToRecord(row, row._count.applications);
}

export async function setJobStatus(
  jobId: string,
  status: Job["status"],
  actor: string,
): Promise<JobRecord> {
  const current = await getJobByJobId(jobId);
  if (!current) throw new Error("Post not found.");
  const { status: _ignored, internalNote, ...rest } = current;
  void _ignored;
  const form: JobFormInput = {
    ...rest,
    internalNote,
    slug: current.slug,
  };
  return updateJob(jobId, form, actor, status);
}

export async function archiveJob(jobId: string, actor: string): Promise<JobRecord> {
  const current = await getJobByJobId(jobId);
  if (!current) throw new Error("Post not found.");
  if (current.status !== "closed") {
    throw new Error("Close the post before archiving it.");
  }
  const row = await getPrisma().job.update({
    where: { jobId },
    data: {
      archived: true,
      updatedBy: actor,
      closedAt: current.closedAt ?? new Date(),
    },
    include: { _count: { select: { applications: true } } },
  });
  return rowToRecord(row, row._count.applications);
}

export async function duplicateJob(jobId: string, actor: string, now = new Date()): Promise<JobRecord> {
  const current = await getJobByJobId(jobId);
  if (!current) throw new Error("Post not found.");
  const { slug: _slug, jobId: _id, status: _status, internalNote, ...rest } = current;
  void _slug;
  void _id;
  void _status;
  return createJob({ ...rest, internalNote, slug: "" }, actor, now);
}

export async function importSeedJobs(jobs: Job[]): Promise<{ inserted: string[]; skipped: string[] }> {
  const inserted: string[] = [];
  const skipped: string[] = [];
  const prisma = getPrisma();
  for (const job of jobs) {
    const existing = await prisma.job.findUnique({ where: { jobId: job.jobId }, select: { jobId: true } });
    if (existing) {
      skipped.push(job.jobId);
      continue;
    }
    const slugOwner = await prisma.job.findUnique({ where: { slug: job.slug }, select: { jobId: true } });
    if (slugOwner) throw new Error(`Slug ${job.slug} is already used by ${slugOwner.jobId}.`);
    await prisma.job.create({
      data: {
        jobId: job.jobId,
        slug: job.slug,
        title: job.title,
        serviceLine: job.serviceLine,
        industry: job.industry,
        city: job.location.city,
        region: job.location.region,
        country: job.location.country,
        mode: job.location.mode,
        workCountries: jsonList(job.workCountries),
        engagementType: job.type,
        durationWeeks: job.durationWeeks ?? null,
        payMin: job.payRange?.min ?? null,
        payMax: job.payRange?.max ?? null,
        payCurrency: job.payRange?.currency ?? null,
        payUnit: job.payRange?.unit ?? null,
        postedDate: job.postedDate,
        closingDate: job.closingDate ?? null,
        summary: job.summary,
        responsibilities: JSON.stringify(job.responsibilities),
        requirements: JSON.stringify(job.requirements),
        niceToHave: jsonList(job.niceToHave),
        travel: job.travel ?? null,
        internalNote: job.internalNote ?? null,
        status: job.status,
        archived: false,
        slugLocked: job.status === "published",
        previousSlugs: "[]",
        createdBy: "import",
        updatedBy: "import",
        publishedAt: job.status === "published" ? new Date() : null,
        closedAt: job.status === "closed" ? new Date() : null,
      },
    });
    inserted.push(job.jobId);
  }
  return { inserted, skipped };
}

export async function revalidateJobPaths(slug: string, previous: string[] = []): Promise<void> {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/careers");
  revalidatePath(`/careers/${slug}`);
  revalidatePath("/sitemap.xml");
  for (const old of previous) revalidatePath(`/careers/${old}`);
}

export function publishCheck(job: Job): string | null {
  try {
    assertPublishable({ ...job, status: "published" }, job.jobId || "post");
    parseJob({ ...job, status: "published" }, job.jobId || "post");
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "This post cannot be published.";
  }
}
