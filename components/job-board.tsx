"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { JobList } from "@/components/job-list";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { industries } from "@/lib/industries";
import { filtersToQuery, filterJobs, parseJobFilters, type JobFilters } from "@/lib/jobs/filter";
import type { PublicJob } from "@/lib/jobs/schema";
import {
  ENGAGEMENT_TYPES,
  LOCATION_MODES,
  SERVICE_LINES,
  countryName,
  modeSlug,
  serviceSlug,
  typeSlug,
} from "@/lib/taxonomy";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-9 items-center rounded-full border border-border bg-card px-3 text-sm hover:border-accent"
      aria-label={`Remove filter ${label}`}
    >
      {label}
      <span aria-hidden="true" className="ml-2">
        ×
      </span>
    </button>
  );
}

// The careers page is static. The first client render must use the same empty
// query as the server. Reading window.location.search inside getSnapshot
// mismatches hydration on /careers?industry=... The real query is published
// from subscribe, which runs after mount.
let locationSearch = "";
let locationReady = false;

function getLocationSnapshot() {
  return locationReady ? locationSearch : "";
}

function getServerLocationSnapshot() {
  return "";
}

function subscribeToLocation(onStoreChange: () => void) {
  let active = true;

  const publish = () => {
    if (!active) return;
    const next = window.location.search;
    const previous = locationReady ? locationSearch : "";
    locationReady = true;
    locationSearch = next;
    if (previous !== next) onStoreChange();
  };

  window.addEventListener("popstate", publish);
  window.addEventListener("qts-nav", publish);
  queueMicrotask(publish);

  return () => {
    active = false;
    window.removeEventListener("popstate", publish);
    window.removeEventListener("qts-nav", publish);
  };
}

export function JobBoard({ jobs }: { jobs: PublicJob[] }) {
  const pathname = usePathname();
  const search = useSyncExternalStore(subscribeToLocation, getLocationSnapshot, getServerLocationSnapshot);
  const filters = useMemo(() => parseJobFilters(new URLSearchParams(search)), [search]);
  const [draftQuery, setDraftQuery] = useState<string | null>(null);
  const filtered = filterJobs(jobs, filters);
  const searchValue = draftQuery ?? filters.q;

  useEffect(() => {
    const onPopState = () => {
      setDraftQuery(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function update(next: Partial<JobFilters>) {
    if ("q" in next) setDraftQuery(next.q ?? "");
    const query = filtersToQuery({ ...filters, ...next });
    const href = query ? `${pathname}${query}` : pathname;
    window.history.replaceState(null, "", href);
    window.dispatchEvent(new Event("qts-nav"));
  }

  const chips: { label: string; clear: Partial<JobFilters> }[] = [];
  if (filters.q) chips.push({ label: `Search: ${filters.q}`, clear: { q: "" } });
  if (filters.service) {
    const line = SERVICE_LINES.find((item) => serviceSlug(item) === filters.service);
    chips.push({ label: line ?? filters.service, clear: { service: "" } });
  }
  if (filters.industry) {
    const industry = industries.find((item) => item.slug === filters.industry);
    chips.push({ label: industry?.name ?? filters.industry, clear: { industry: "" } });
  }
  if (filters.country) chips.push({ label: countryName(filters.country), clear: { country: "" } });
  if (filters.mode) chips.push({ label: filters.mode, clear: { mode: "" } });
  if (filters.type) chips.push({ label: filters.type, clear: { type: "" } });

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8">
      <form
        className="grid content-start gap-4"
        role="search"
        aria-label="Filter roles"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid gap-2">
          <Label htmlFor="job-search">Search roles</Label>
          <Input
            id="job-search"
            type="search"
            value={searchValue}
            onChange={(event) => update({ q: event.target.value })}
            placeholder="Title or summary"
            className="h-11"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="filter-service">Service line</Label>
          <NativeSelect
            id="filter-service"
            value={filters.service}
            onChange={(event) => update({ service: event.target.value })}
          >
            <option value="">All service lines</option>
            {SERVICE_LINES.map((line) => (
              <option key={line} value={serviceSlug(line)}>
                {line}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="filter-industry">Industry</Label>
          <NativeSelect
            id="filter-industry"
            value={filters.industry}
            onChange={(event) => update({ industry: event.target.value })}
          >
            <option value="">All industries</option>
            {industries.map((industry) => (
              <option key={industry.slug} value={industry.slug}>
                {industry.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="filter-country">Country</Label>
          <NativeSelect
            id="filter-country"
            value={filters.country}
            onChange={(event) => update({ country: event.target.value as JobFilters["country"] })}
          >
            <option value="">United States and Canada</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </NativeSelect>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="filter-mode">Location mode</Label>
          <NativeSelect
            id="filter-mode"
            value={filters.mode ? modeSlug(filters.mode) : ""}
            onChange={(event) =>
              update({
                mode: LOCATION_MODES.find((mode) => modeSlug(mode) === event.target.value) ?? "",
              })
            }
          >
            <option value="">All modes</option>
            {LOCATION_MODES.map((mode) => (
              <option key={mode} value={modeSlug(mode)}>
                {mode}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="filter-type">Type</Label>
          <NativeSelect
            id="filter-type"
            value={filters.type ? typeSlug(filters.type) : ""}
            onChange={(event) =>
              update({
                type: ENGAGEMENT_TYPES.find((type) => typeSlug(type) === event.target.value) ?? "",
              })
            }
          >
            <option value="">All types</option>
            {ENGAGEMENT_TYPES.map((type) => (
              <option key={type} value={typeSlug(type)}>
                {type}
              </option>
            ))}
          </NativeSelect>
        </div>
        {chips.length > 0 ? (
          <Button type="button" variant="outline" className="h-11" onClick={() => update({ q: "", service: "", industry: "", country: "", mode: "", type: "" })}>
            Clear filters
          </Button>
        ) : null}
      </form>
      <div className="grid gap-4">
        {chips.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Active filters">
            {chips.map((chip) => (
              <li key={chip.label}>
                <Chip label={chip.label} onRemove={() => update(chip.clear)} />
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {jobs.length === 0
            ? "No roles are posted."
            : `${filtered.length} open ${filtered.length === 1 ? "role" : "roles"}`}
        </p>
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">No open roles</h2>
            <p className="mt-2 text-muted-foreground">
              Nothing is posted for applicants right now. Join the talent network and Quad can
              contact you when a matching assignment is confirmed.
            </p>
            <Button asChild className="mt-4 h-11 px-4">
              <Link href="/careers/talent-network">Join the talent network</Link>
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">No roles match these filters</h2>
            <p className="mt-2 text-muted-foreground">
              Clear the filters, or join the talent network if you want to be considered for later
              assignments.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={() => update({ q: "", service: "", industry: "", country: "", mode: "", type: "" })}
              >
                Clear filters
              </Button>
              <Button asChild className="h-11 px-4">
                <Link href="/careers/talent-network">Join the talent network</Link>
              </Button>
            </div>
          </div>
        ) : (
          <JobList jobs={filtered} />
        )}
      </div>
    </div>
  );
}
