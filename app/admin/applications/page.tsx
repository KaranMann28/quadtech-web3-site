import Link from "next/link";
import { requireAdmin, redirectIfDenied } from "@/lib/admin/guard";
import { listApplications } from "@/lib/applications/store";
import { listJobs } from "@/lib/jobs/store";

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    redirectIfDenied(error);
    throw error;
  }
  const params = await searchParams;
  const status = first(params.status);
  const jobId = first(params.jobId);
  const [applications, jobs] = await Promise.all([
    listApplications({ status, jobId: jobId === "none" ? null : jobId }),
    listJobs(),
  ]);
  const exportQuery = new URLSearchParams();
  if (status) exportQuery.set("status", status);
  if (jobId) exportQuery.set("jobId", jobId);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <a
          className="inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm"
          href={`/api/admin/applications/export?${exportQuery.toString()}`}
        >
          Export CSV
        </a>
      </div>
      <form className="flex flex-wrap gap-3" action="/admin/applications">
        <label className="grid gap-1 text-sm">
          Status
          <select name="status" defaultValue={status} className="h-11 rounded-lg border border-border bg-background px-3">
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Job
          <select name="jobId" defaultValue={jobId} className="h-11 max-w-xs rounded-lg border border-border bg-background px-3">
            <option value="">All jobs</option>
            <option value="none">Talent network</option>
            {jobs.map((job) => (
              <option key={job.jobId} value={job.jobId}>
                {job.jobId} · {job.title}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="mt-6 h-11 rounded-lg border border-border px-4 text-sm">
          Filter
        </button>
      </form>
      {applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No applications match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-3">Applicant</th>
                <th className="py-2 pr-3">Job</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-3 pr-3">
                    <Link href={`/admin/applications/${item.id}`} className="hover:text-accent">
                      {item.fullName}
                    </Link>
                  </td>
                  <td className="py-3 pr-3">{item.jobTitle ?? "Talent network"}</td>
                  <td className="py-3 pr-3">{item.submittedAt.toISOString().slice(0, 10)}</td>
                  <td className="py-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
