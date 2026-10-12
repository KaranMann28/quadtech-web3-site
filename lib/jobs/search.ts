import type { PublicJob } from "@/lib/jobs/schema";
import { SERVICE_LINES } from "@/lib/taxonomy";

/** Case-insensitive match on title, location, and service line. */
export function searchJobs(jobs: PublicJob[], query: string): PublicJob[] {
  const q = query.trim().toLowerCase();
  if (!q) return jobs;
  return jobs.filter((job) =>
    `${job.title} ${job.location.city} ${job.location.region} ${job.serviceLine}`
      .toLowerCase()
      .includes(q),
  );
}

export type JobGroup = { serviceLine: string; jobs: PublicJob[] };

/**
 * Greenhouse-style grouping: one section per service line (department), in the
 * taxonomy's declaration order, newest postings first within a section.
 */
export function groupJobsByServiceLine(jobs: PublicJob[]): JobGroup[] {
  const order = new Map<string, number>(SERVICE_LINES.map((line, index) => [line, index]));
  const groups = new Map<string, PublicJob[]>();
  for (const job of jobs) {
    const list = groups.get(job.serviceLine) ?? [];
    list.push(job);
    groups.set(job.serviceLine, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (order.get(a) ?? 99) - (order.get(b) ?? 99) || a.localeCompare(b))
    .map(([serviceLine, list]) => ({
      serviceLine,
      jobs: [...list].sort(
        (a, b) => b.postedDate.localeCompare(a.postedDate) || b.jobId.localeCompare(a.jobId),
      ),
    }));
}
