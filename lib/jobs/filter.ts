import type { PublicJob } from "@/lib/jobs/schema";
import { countryName, type CountryCode } from "@/lib/taxonomy";

export function jobCountries(job: PublicJob): CountryCode[] {
  return job.workCountries?.length ? job.workCountries : [job.location.country];
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
