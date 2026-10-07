import Link from "next/link";
import { notFound } from "next/navigation";
import { applicationStatusAction } from "@/lib/admin/actions";
import { requireAdmin, redirectIfDenied } from "@/lib/admin/guard";
import { APPLICATION_STATUSES, getApplication } from "@/lib/applications/store";
import { countryName, WORK_AUTH_LABELS, type WorkAuth } from "@/lib/taxonomy";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (error) {
    redirectIfDenied(error);
    throw error;
  }
  const { id } = await params;
  const application = await getApplication(id);
  if (!application) notFound();
  const auth = application.workAuthorization as WorkAuth;

  return (
    <article className="grid max-w-3xl gap-6">
      <p className="text-sm text-muted-foreground">
        <Link href="/admin/applications" className="hover:text-accent">
          Applications
        </Link>
      </p>
      <h1 className="text-3xl font-bold tracking-tight">{application.fullName}</h1>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{application.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Phone</dt>
          <dd>{application.phone}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">City / region</dt>
          <dd>{application.cityRegion}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Country</dt>
          <dd>{countryName(application.country as "US" | "CA")}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Work authorization</dt>
          <dd>{WORK_AUTH_LABELS[auth] ?? application.workAuthorization}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Job</dt>
          <dd>{application.jobTitle ? `${application.jobId} · ${application.jobTitle}` : "Talent network"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Service line</dt>
          <dd>{application.serviceLine}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Submitted</dt>
          <dd>{application.submittedAt.toISOString()}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">LinkedIn</dt>
          <dd>{application.linkedin || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">How they heard</dt>
          <dd>{application.referral || "—"}</dd>
        </div>
      </dl>
      <section>
        <h2 className="text-xl font-semibold">Screening answers</h2>
        <ul className="mt-2 grid gap-2 text-sm">
          {application.screeners.map((item) => (
            <li key={item.id}>
              <span className="text-muted-foreground">{item.label}: </span>
              {item.answer || "—"}
            </li>
          ))}
        </ul>
      </section>
      {application.message ? (
        <section>
          <h2 className="text-xl font-semibold">Message</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm">{application.message}</p>
        </section>
      ) : null}
      <p>
        <a className="text-accent" href={`/api/admin/resumes/${application.id}`}>
          Download résumé ({application.resumeFilename})
        </a>
      </p>
      <form action={applicationStatusAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="id" value={application.id} />
        {APPLICATION_STATUSES.map((status) => (
          <button
            key={status}
            name="status"
            value={status}
            className="h-11 rounded-lg border border-border px-3 text-sm capitalize aria-current:bg-card"
            aria-current={application.status === status ? "true" : undefined}
          >
            {status}
          </button>
        ))}
      </form>
      <p className="text-sm text-muted-foreground">Status changes stay in this inbox. No email is sent to the applicant.</p>
    </article>
  );
}
