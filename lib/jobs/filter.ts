import type { PublicJob } from "@/lib/jobs/schema";
import { countryName, type CountryCode } from "@/lib/taxonomy";

export function jobCountries(job: PublicJob): CountryCode[] {
  return job.workCountries?.length ? job.workCountries : [job.location.country];
}

export type JobLineGroup = { heading?: string; items: string[] };

/**
 * Split a bullet list into groups when an item is a heading (ends with ":"
 * and has no period). Ungrouped lists stay a single section with no heading.
 */
export function groupedLines(items: string[]): JobLineGroup[] {
  const groups: JobLineGroup[] = [];
  for (const item of items) {
    const heading = headingFromLine(item);
    if (heading) {
      groups.push({ heading, items: [] });
      continue;
    }
    const last = groups[groups.length - 1];
    if (!last) groups.push({ items: [item] });
    else last.items.push(item);
  }
  return groups.filter((group) => group.items.length > 0);
}

function headingFromLine(item: string): string | undefined {
  if (!item.endsWith(":")) return undefined;
  const heading = item.slice(0, -1).trim();
  if (!heading || heading.includes(".")) return undefined;
  return heading;
}

export function formatLocation(job: PublicJob): string {
  const names = jobCountries(job).map(countryName);
  const countryLabel = names.join(" & ");
  if (job.location.mode === "Remote") {
    return `Remote · ${countryLabel}`;
  }
  const cityCoversCountries = names.every((name) =>
    job.location.city.toLowerCase().includes(name.toLowerCase()),
  );
  if (cityCoversCountries) {
    return `${job.location.mode}, ${job.location.city}`;
  }
  return `${job.location.city}, ${job.location.region} · ${countryLabel} · ${job.location.mode}`;
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
