"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groupJobsByServiceLine, searchJobs } from "@/lib/jobs/search";
import type { PublicJob } from "@/lib/jobs/schema";
import { formatLocation } from "@/lib/jobs/filter";

export function JobBoard({ jobs }: { jobs: PublicJob[] }) {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => groupJobsByServiceLine(searchJobs(jobs, query)), [jobs, query]);
  const matches = groups.reduce((count, group) => count + group.jobs.length, 0);

  return (
    <div className="mx-auto grid max-w-3xl gap-6 px-4 py-10 sm:px-6">
      {jobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">No open roles</h2>
          <p className="mt-2 text-muted-foreground">
            Nothing is posted right now. Join the talent network and Quad can contact you when a
            matching assignment is confirmed.
          </p>
          <Button asChild className="mt-4 h-11 px-4">
            <Link href="/careers/talent-network">Join the talent network</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-2">
            <label htmlFor="job-search" className="sr-only">
              Search roles
            </label>
            <Input
              id="job-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or location…"
              className="h-11"
            />
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {matches} open {matches === 1 ? "role" : "roles"}
            </p>
          </div>
          {matches === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">No roles match “{query.trim()}”</h2>
              <p className="mt-2 text-muted-foreground">
                Try a different search, or join the talent network to be considered for later
                assignments.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" variant="outline" className="h-11" onClick={() => setQuery("")}>
                  Clear search
                </Button>
                <Button asChild className="h-11 px-4">
                  <Link href="/careers/talent-network">Join the talent network</Link>
                </Button>
              </div>
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.serviceLine} aria-labelledby={`group-${group.serviceLine}`}>
                <h2
                  id={`group-${group.serviceLine}`}
                  className="border-b border-border pb-2 text-sm font-semibold tracking-wide text-accent uppercase"
                >
                  {group.serviceLine}
                </h2>
                <ul>
                  {group.jobs.map((job) => (
                    <li key={job.jobId} className="border-b border-border/60">
                      <Link
                        href={`/careers/${job.slug}`}
                        className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                      >
                        <span className="grid gap-1">
                          <span className="font-medium">{job.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatLocation(job)} · {job.type}
                          </span>
                        </span>
                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
          <p className="text-sm text-muted-foreground">
            Don’t see a fit?{" "}
            <Link href="/careers/talent-network" className="text-accent">
              Join the talent network
            </Link>{" "}
            and Quad can reach out when a matching assignment opens.
          </p>
        </>
      )}
    </div>
  );
}
