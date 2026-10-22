import Link from "next/link";
import { ApplyForm } from "@/components/apply-form";
import { getIndustry } from "@/lib/industries";
import { formatLocation, formatPay, formatPosted, groupedLines } from "@/lib/jobs/filter";
import { jobPostingJsonLd } from "@/lib/jobs/jsonld";
import type { PublicJob } from "@/lib/jobs/schema";

function GroupedList({
  title,
  items,
  className,
}: {
  title: string;
  items: string[];
  className: string;
}) {
  const groups = groupedLines(items);
  return (
    <section className={className}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {groups.map((group) => (
        <div key={group.heading ?? title}>
          {group.heading ? <h3 className="mt-4 text-base font-semibold">{group.heading}</h3> : null}
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function JobArticle({
  job,
  mode,
  updatedLabel,
}: {
  job: PublicJob;
  mode: "live" | "preview" | "closed";
  updatedLabel?: string;
}) {
  const industry = getIndustry(job.industry);
  const pay = formatPay(job);
  const jsonLd = mode === "live" ? jobPostingJsonLd(job) : null;

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      {mode === "closed" ? (
        <p className="mb-6 rounded-lg border border-border bg-card px-4 py-3 text-sm" role="status">
          This role is no longer accepting applications.
        </p>
      ) : null}
      {mode === "preview" ? (
        <p className="mb-6 rounded-lg border border-border bg-card px-4 py-3 text-sm" role="status">
          Preview. This is how the public page will look. Applications are not sent from this pane.
        </p>
      ) : null}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/careers" className="hover:text-accent">
              Careers
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{job.title || "Untitled role"}</li>
        </ol>
      </nav>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{job.jobId}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{job.title}</h1>
          <p className="mt-4 text-muted-foreground">{job.summary}</p>
          {mode === "live" ? (
            <p className="mt-6 lg:hidden">
              <a
                href="#apply"
                className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                Apply for this job
              </a>
            </p>
          ) : null}
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd>{formatLocation(job)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Type</dt>
              <dd>
                {job.type}
                {job.durationWeeks ? ` · ${job.durationWeeks} weeks` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Service line</dt>
              <dd>{job.serviceLine}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Industry</dt>
              <dd>
                {industry ? (
                  <Link href={`/industries/${industry.slug}`} className="text-accent">
                    {industry.name}
                  </Link>
                ) : (
                  job.industry
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Posted</dt>
              <dd>{formatPosted(job.postedDate)}</dd>
            </div>
            {job.closingDate ? (
              <div>
                <dt className="text-muted-foreground">Closing</dt>
                <dd>{formatPosted(job.closingDate)}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted-foreground">Pay</dt>
              <dd>{pay ?? "Pay is not listed on this posting."}</dd>
            </div>
            {updatedLabel ? (
              <div>
                <dt className="text-muted-foreground">Last updated</dt>
                <dd>{updatedLabel}</dd>
              </div>
            ) : null}
          </dl>
          <GroupedList title="Responsibilities" items={job.responsibilities} className="mt-10" />
          <GroupedList title="Requirements" items={job.requirements} className="mt-8" />
          {job.niceToHave && job.niceToHave.length > 0 ? (
            <GroupedList title="Nice to have" items={job.niceToHave} className="mt-8" />
          ) : null}
          {job.travel ? (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Travel</h2>
              <p className="mt-3 text-muted-foreground">{job.travel}</p>
            </section>
          ) : null}
        </div>
        <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          {mode === "live" ? (
            <ApplyForm kind="job" job={job} />
          ) : (
            <fieldset disabled className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              <legend className="px-1 text-base font-semibold text-foreground">Apply</legend>
              <p className="mt-2">
                {mode === "closed"
                  ? "Applications are closed for this role."
                  : "The apply form appears here on the public page."}
              </p>
            </fieldset>
          )}
        </div>
      </div>
    </article>
  );
}
