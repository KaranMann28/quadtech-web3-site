import Link from "next/link";
import { lifecycleAction } from "@/lib/admin/actions";
import { requireAdmin, redirectIfDenied } from "@/lib/admin/guard";
import { listJobs, type JobRecord } from "@/lib/jobs/store";
import { SERVICE_LINES, serviceSlug } from "@/lib/taxonomy";

type Search = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function sortJobs(jobs: JobRecord[], sort: string, dir: "asc" | "desc"): JobRecord[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...jobs].sort((a, b) => {
    const left =
      sort === "title"
        ? a.title
        : sort === "service"
          ? a.serviceLine
          : sort === "closing"
            ? a.closingDate ?? ""
            : sort === "published"
              ? a.publishedAt?.toISOString() ?? ""
              : a.jobId;
    const right =
      sort === "title"
        ? b.title
        : sort === "service"
          ? b.serviceLine
          : sort === "closing"
            ? b.closingDate ?? ""
            : sort === "published"
              ? b.publishedAt?.toISOString() ?? ""
              : b.jobId;
    return left.localeCompare(right) * factor;
  });
}

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    redirectIfDenied(error);
    throw error;
  }
  const params = await searchParams;
  const status = first(params.status);
  const service = first(params.service);
  const sort = first(params.sort) || "jobId";
  const dir = first(params.dir) === "asc" ? "asc" : "desc";
  const jobs = sortJobs(
    (await listJobs()).filter((job) => {
      if (status === "archived") return job.archived;
      if (job.archived) return false;
      if (status && job.status !== status) return false;
      if (service && serviceSlug(job.serviceLine) !== service) return false;
      return true;
    }),
    sort,
    dir,
  );

  function href(next: Record<string, string>) {
    const query = new URLSearchParams();
    const merged = { status, service, sort, dir, ...next };
    for (const [key, value] of Object.entries(merged)) {
      if (value) query.set(key, value);
    }
    const text = query.toString();
    return text ? `/admin/jobs?${text}` : "/admin/jobs";
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <Link href="/admin/jobs/new" className="inline-flex h-11 items-center rounded-lg bg-primary px-4 text-sm text-primary-foreground">
          Create post
        </Link>
      </div>
      <form className="flex flex-wrap gap-3" action="/admin/jobs">
        <label className="grid gap-1 text-sm">
          Status
          <select name="status" defaultValue={status} className="h-11 rounded-lg border border-border bg-background px-3">
            <option value="">All open records</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Service line
          <select name="service" defaultValue={service} className="h-11 rounded-lg border border-border bg-background px-3">
            <option value="">All service lines</option>
            {SERVICE_LINES.map((line) => (
              <option key={line} value={serviceSlug(line)}>
                {line}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="mt-6 h-11 rounded-lg border border-border px-4 text-sm">
          Filter
        </button>
      </form>
      {jobs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts match this filter.</p>
      ) : (
        <>
          <ul className="grid gap-3 md:hidden">
            {jobs.map((job) => (
              <li key={job.jobId} className="rounded-xl border border-border bg-card p-4">
                <JobRow job={job} />
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-3">
                    <Link href={href({ sort: "jobId", dir: dir === "asc" ? "desc" : "asc" })}>Job ID</Link>
                  </th>
                  <th className="py-2 pr-3">
                    <Link href={href({ sort: "title", dir: dir === "asc" ? "desc" : "asc" })}>Title</Link>
                  </th>
                  <th className="py-2 pr-3">Service line</th>
                  <th className="py-2 pr-3">Location</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Published</th>
                  <th className="py-2 pr-3">Closing</th>
                  <th className="py-2 pr-3">Applications</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.jobId} className="border-b border-border align-top">
                    <td className="py-3 pr-3 font-mono">{job.jobId}</td>
                    <td className="py-3 pr-3">{job.title}</td>
                    <td className="py-3 pr-3">{job.serviceLine}</td>
                    <td className="py-3 pr-3">
                      {job.location.city}, {job.location.region}
                    </td>
                    <td className="py-3 pr-3">{job.archived ? "Archived" : job.status}</td>
                    <td className="py-3 pr-3">{job.publishedAt ? job.publishedAt.toISOString().slice(0, 10) : "—"}</td>
                    <td className="py-3 pr-3">{job.closingDate ?? "—"}</td>
                    <td className="py-3 pr-3">{job.applicationCount ?? 0}</td>
                    <td className="py-3">
                      <JobActions job={job} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function JobRow({ job }: { job: JobRecord }) {
  return (
    <div className="grid gap-2 text-sm">
      <p className="font-mono text-muted-foreground">{job.jobId}</p>
      <p className="font-semibold">{job.title}</p>
      <p>
        {job.serviceLine} · {job.location.city}, {job.location.region}
      </p>
      <p>
        {job.archived ? "Archived" : job.status} · {job.applicationCount ?? 0} applications
      </p>
      <JobActions job={job} />
    </div>
  );
}

function JobActions({ job }: { job: JobRecord }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/admin/jobs/${job.jobId}`} className="hover:text-accent">
        Edit
      </Link>
      {job.status === "published" ? (
        <form action={lifecycleAction}>
          <input type="hidden" name="jobId" value={job.jobId} />
          <button name="intent" value="unpublish" className="hover:text-accent">
            Unpublish
          </button>
        </form>
      ) : (
        <details>
          <summary className="cursor-pointer hover:text-accent">Publish</summary>
          <form action={lifecycleAction} className="mt-2 grid max-w-xs gap-2">
            <input type="hidden" name="jobId" value={job.jobId} />
            <p className="text-muted-foreground">
              Public URL: /careers/{job.slug}
            </p>
            <button name="intent" value="publish" className="h-11 rounded-lg bg-primary px-3 text-primary-foreground">
              Publish
            </button>
          </form>
        </details>
      )}
      {job.status !== "closed" ? (
        <form action={lifecycleAction}>
          <input type="hidden" name="jobId" value={job.jobId} />
          <button name="intent" value="close" className="hover:text-accent">
            Close
          </button>
        </form>
      ) : null}
      {job.status === "closed" && !job.archived ? (
        <form action={lifecycleAction}>
          <input type="hidden" name="jobId" value={job.jobId} />
          <button name="intent" value="archive" className="hover:text-accent">
            Archive
          </button>
        </form>
      ) : null}
      <form action={lifecycleAction}>
        <input type="hidden" name="jobId" value={job.jobId} />
        <button name="intent" value="duplicate" className="hover:text-accent">
          Duplicate
        </button>
      </form>
    </div>
  );
}
