import type { MetadataRoute } from "next";
import { industries } from "@/lib/industries";
import { getPublishedJobs } from "@/lib/jobs/store";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const paths = [
    "",
    "/about",
    "/services",
    "/why-us",
    "/contact",
    "/industries",
    "/careers",
    "/careers/talent-network",
    ...industries.map((industry) => `/industries/${industry.slug}`),
    ...(await getPublishedJobs()).map((job) => `/careers/${job.slug}`),
  ];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));
}
