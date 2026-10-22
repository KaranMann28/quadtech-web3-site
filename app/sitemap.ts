import type { MetadataRoute } from "next";
import { industries } from "@/lib/industries";
import { getPublishedJobs } from "@/lib/jobs/store";
import { MARKETING_PATHS } from "@/lib/marketing-paths";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const paths = [
    "",
    "/about",
    "/why-us",
    "/contact",
    "/industries",
    "/careers",
    "/careers/talent-network",
    ...MARKETING_PATHS,
    ...industries.map((industry) => `/industries/${industry.slug}`),
    ...(await getPublishedJobs()).map((job) => `/careers/${job.slug}`),
  ];
  return [...new Set(paths)].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));
}
