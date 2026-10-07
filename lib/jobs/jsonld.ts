import type { PublicJob } from "@/lib/jobs/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { countryName } from "@/lib/taxonomy";
import { jobCountries } from "@/lib/jobs/filter";

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

export function jobPostingJsonLd(job: PublicJob) {
  const countries = jobCountries(job);
  const description = [
    `<p>${escapeHtml(job.summary)}</p>`,
    "<h2>Responsibilities</h2><ul>",
    ...job.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`),
    "</ul><h2>Requirements</h2><ul>",
    ...job.requirements.map((item) => `<li>${escapeHtml(item)}</li>`),
    "</ul>",
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
