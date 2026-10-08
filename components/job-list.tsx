import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatLocation, formatPay, formatPosted } from "@/lib/jobs/filter";
import type { PublicJob } from "@/lib/jobs/schema";

export function JobList({ jobs }: { jobs: PublicJob[] }) {
  if (jobs.length === 0) return null;
  return (
    <ul className="grid gap-4">
      {jobs.map((job) => {
        const pay = formatPay(job);
        return (
          <li key={job.jobId}>
            <Card className="text-base">
              <CardContent className="grid gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">
                    <Link href={`/careers/${job.slug}`} className="hover:text-accent">
                      {job.title}
                    </Link>
                  </h2>
                  <Badge variant="outline">{job.serviceLine}</Badge>
                </div>
                <p className="font-mono text-sm text-muted-foreground">{job.jobId}</p>
                <p className="text-sm text-muted-foreground">{formatLocation(job)}</p>
                <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div>
                    <dt className="sr-only">Type</dt>
                    <dd>{job.type}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Location mode</dt>
                    <dd>{job.location.mode}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Posted</dt>
                    <dd>Posted {formatPosted(job.postedDate)}</dd>
                  </div>
                  {pay ? (
                    <div>
                      <dt className="sr-only">Pay</dt>
                      <dd>{pay}</dd>
                    </div>
                  ) : null}
                </dl>
                <p className="text-sm text-muted-foreground">{job.summary}</p>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
