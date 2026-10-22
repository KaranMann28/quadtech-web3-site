import type { PublicJob } from "@/lib/jobs/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { countryName } from "@/lib/taxonomy";
import { groupedLines, jobCountries } from "@/lib/jobs/filter";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function employmentType(job: PublicJob): string {
  if (job.type === "Full-Time") return "FULL_TIME";
  if (job.type === "Contract-to-Hire") return "TEMPORARY";
  return "CONTRACTOR";
}

function htmlList(title: string, items: string[]): string {
  const groups = groupedLines(items);
  const parts = [`<h2>${escapeHtml(title)}</h2>`];
  for (const group of groups) {
    if (group.heading) parts.push(`<h3>${escapeHtml(group.heading)}</h3>`);
    parts.push("<ul>");
    for (const item of group.items) parts.push(`<li>${escapeHtml(item)}</li>`);
    parts.push("</ul>");
  }
  return parts.join("");
}

export function jobPostingJsonLd(job: PublicJob) {
  const countries = jobCountries(job);
  const description = [
    `<p>${escapeHtml(job.summary)}</p>`,
    htmlList("Responsibilities", job.responsibilities),
    htmlList("Requirements", job.requirements),
    job.niceToHave?.length ? htmlList("Nice to have", job.niceToHave) : "",
  ].join("");

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: job.postedDate,
    directApply: true,
    employmentType: employmentType(job),
    identifier: {
      "@type": "PropertyValue",
      name: SITE_NAME,
      value: job.jobId,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
    url: `${SITE_URL}/careers/${job.slug}`,
    applicantLocationRequirements: countries.map((code) => ({
      "@type": "Country",
      name: countryName(code),
    })),
  };

  if (job.closingDate) data.validThrough = job.closingDate;

  if (job.location.mode === "Remote") {
    data.jobLocationType = "TELECOMMUTE";
  }

  data.jobLocation = {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: job.location.city === "Remote" ? undefined : job.location.city,
      addressRegion: job.location.region,
      addressCountry: job.location.country,
    },
  };

  if (job.payRange) {
    data.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.payRange.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: job.payRange.min,
        maxValue: job.payRange.max,
        unitText: job.payRange.unit === "hour" ? "HOUR" : "DAY",
      },
    };
  }

  return data as {
    "@type": string;
    identifier: { value: string };
    baseSalary: { currency: string; value: { unitText: string } };
  } & Record<string, unknown>;
}
