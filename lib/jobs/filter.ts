import type { PublicJob } from "@/lib/jobs/schema";
import { INDUSTRY_SLUGS } from "@/lib/taxonomy";
import {
  countryName,
  modeFromSlug,
  modeSlug,
  serviceLineFromSlug,
  serviceSlug,
  typeFromSlug,
  typeSlug,
  type CountryCode,
  type EngagementType,
  type IndustrySlug,
  type LocationMode,
} from "@/lib/taxonomy";

export type JobFilters = {
  q: string;
  service: string;
  industry: string;
  country: "" | CountryCode;
  mode: "" | LocationMode;
  type: "" | EngagementType;
};

export const emptyFilters: JobFilters = {
  q: "",
  service: "",
  industry: "",
  country: "",
  mode: "",
  type: "",
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseJobFilters(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
): JobFilters {
  const read = (key: string) => {
    if (params instanceof URLSearchParams) return params.get(key) ?? "";
    return first(params[key]);
  };
  const country = read("country");
  const service = read("service");
  const industry = read("industry");
  return {
    q: read("q").slice(0, 120),
    service: serviceLineFromSlug(service) ? service : "",
    industry: (INDUSTRY_SLUGS as readonly string[]).includes(industry)
      ? (industry as IndustrySlug)
      : "",
    country: country === "US" || country === "CA" ? country : "",
    mode: modeFromSlug(read("mode")) ?? "",
    type: typeFromSlug(read("type")) ?? "",
  };
}

export function filtersToQuery(filters: JobFilters): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.service) params.set("service", filters.service);
  if (filters.industry) params.set("industry", filters.industry);
  if (filters.country) params.set("country", filters.country);
  if (filters.mode) params.set("mode", modeSlug(filters.mode));
  if (filters.type) params.set("type", typeSlug(filters.type));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function jobCountries(job: PublicJob): CountryCode[] {
  return job.workCountries?.length ? job.workCountries : [job.location.country];
}

export function filterJobs(jobs: PublicJob[], filters: JobFilters): PublicJob[] {
  const q = filters.q.trim().toLowerCase();
  return jobs
    .filter((job) => {
      if (q && !`${job.title} ${job.summary}`.toLowerCase().includes(q)) return false;
      if (filters.service && serviceSlug(job.serviceLine) !== filters.service) return false;
      if (filters.industry && job.industry !== filters.industry) return false;
      if (filters.country && !jobCountries(job).includes(filters.country)) return false;
      if (filters.mode && job.location.mode !== filters.mode) return false;
      if (filters.type && job.type !== filters.type) return false;
      return true;
    })
    .sort((a, b) => b.postedDate.localeCompare(a.postedDate) || b.jobId.localeCompare(a.jobId));
}

export function formatLocation(job: PublicJob): string {
  const countries = jobCountries(job).map(countryName).join(" & ");
  if (job.location.mode === "Remote") {
    return `Remote · ${countries}`;
  }
  return `${job.location.city}, ${job.location.region} · ${countries} · ${job.location.mode}`;
}

export function formatPay(job: PublicJob): string | undefined {
  const pay = job.payRange;
  if (!pay) return undefined;
  const format = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: pay.currency,
      maximumFractionDigits: 0,
    }).format(value);
  const unit = pay.unit === "hour" ? "hour" : "day";
  return `${format(pay.min)}–${format(pay.max)} ${pay.currency} / ${unit}`;
}

export function formatPosted(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
