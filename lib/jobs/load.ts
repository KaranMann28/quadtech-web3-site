import fs from "node:fs";
import path from "node:path";
import { jobSchema, normalizeJobInput, toPublicJob, type Job, type PublicJob } from "@/lib/jobs/schema";

const PLACEHOLDER_POSTED_DATE = "2026-01-01";

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
}

export function assertPublishable(job: Job, source: string): void {
  if (job.status !== "published") return;
  const strings: string[] = [];
  collectStrings(job, strings);
  if (strings.some((value) => value.includes("TODO [CONFIRM]"))) {
    throw new Error(
      `${source} is published but still contains TODO [CONFIRM]. Resolve those notes before publishing.`,
    );
  }
  if (job.postedDate === PLACEHOLDER_POSTED_DATE) {
    throw new Error(
      `${source} uses the placeholder posted date ${PLACEHOLDER_POSTED_DATE}. Set a confirmed date before publishing.`,
    );
  }
}

export function parseJob(raw: unknown, source: string): Job {
  const parsed = jobSchema.safeParse(normalizeJobInput(raw));
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new Error(`${source}: ${detail}`);
  }
  assertPublishable(parsed.data, source);
  return parsed.data;
}

export function loadJobsFromDir(dir: string): Job[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`Jobs directory not found: ${dir}`);
  }
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json") && !name.startsWith("_"))
    .sort();

  const jobs: Job[] = [];
  for (const name of files) {
    const full = path.join(dir, name);
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      throw new Error(`${name}: ${message}`);
    }
    jobs.push(parseJob(raw, name));
  }

  const slugs = new Set<string>();
  const ids = new Set<string>();
  for (const job of jobs) {
    if (slugs.has(job.slug)) throw new Error(`Duplicate job slug: ${job.slug}`);
    if (ids.has(job.jobId)) throw new Error(`Duplicate job ID: ${job.jobId}`);
    slugs.add(job.slug);
    ids.add(job.jobId);
  }
  return jobs;
}

export function jobsDir(): string {
  return path.join(process.cwd(), "content", "jobs");
}

export function loadSeedJobs(): Job[] {
  return loadJobsFromDir(jobsDir());
}

export { toPublicJob, type Job, type PublicJob };
