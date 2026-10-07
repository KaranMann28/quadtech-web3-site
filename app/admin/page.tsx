import Link from "next/link";
import { requireAdmin, redirectIfDenied } from "@/lib/admin/guard";
import { applicationsThisWeek, newestApplications } from "@/lib/applications/store";
import { listJobs } from "@/lib/jobs/store";
import { addUtcDays, utcDay } from "@/lib/jobs/visibility";

export default async function AdminHomePage() {
  try {
    await requireAdmin();
  } catch (error) {
    redirectIfDenied(error);
    throw error;
  }

  const [jobs, weekCount, newest] = await Promise.all([
    listJobs(),
    applicationsThisWeek(),
    newestApplications(5),
  ]);
  const counts = {
    draft: jobs.filter((job) => job.status === "draft" && !job.archived).length,
    published: jobs.filter((job) => job.status === "published" && !job.archived).length,
    closed: jobs.filter((job) => job.status === "closed" && !job.archived).length,
  };
  const today = utcDay();
  const horizon = addUtcDays(today, 14);
  const closingSoon = jobs.filter(
    (job) =>
      job.status === "published" &&
      !job.archived &&
      job.closingDate &&
      job.closingDate >= today &&
      job.closingDate <= horizon,
  );

  return (
    <div className="grid gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <dl className="grid gap-3 sm:grid-cols-4">
        {(
          [
            ["Draft", counts.draft],
            ["Published", counts.published],
            ["Closed", counts.closed],
            ["Applications this week", weekCount],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Newest applications</h2>
        {newest.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          <ul className="grid gap-2">
            {newest.map((item) => (
              <li key={item.id}>
                <Link href={`/admin/applications/${item.id}`} className="hover:text-accent">
                  {item.fullName}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {" "}
                  · {item.jobTitle ?? "Talent network"} · {item.submittedAt.toISOString().slice(0, 10)} · {item.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Posts closing within 14 days</h2>
        {closingSoon.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published posts close in the next 14 days.</p>
        ) : (
          <ul className="grid gap-2">
            {closingSoon.map((job) => (
              <li key={job.jobId}>
                <Link href={`/admin/jobs/${job.jobId}`} className="hover:text-accent">
                  {job.title}
                </Link>
                <span className="text-sm text-muted-foreground"> · closes {job.closingDate}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
