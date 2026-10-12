import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JobArticle } from "@/components/job-article";
import { getPublishedJobs, resolvePublicSlug, type PublicHit } from "@/lib/jobs/store";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const jobs = await getPublishedJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const hit = await resolvePublicSlug(slug);
  if (hit.kind !== "published" && hit.kind !== "closed") return { title: "Role" };
  return {
    title: hit.job.title,
    description: hit.job.summary,
    robots: hit.kind === "closed" ? { index: false, follow: true } : undefined,
    openGraph: { title: hit.job.title, description: hit.job.summary },
  };
}

function updatedLabel(hit: PublicHit): string | undefined {
  if (hit.kind !== "published" || !hit.publishedAt) return undefined;
  if (hit.updatedAt.getTime() - hit.publishedAt.getTime() < 60_000) return undefined;
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(hit.updatedAt);
  return `${formatted} UTC`;
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const hit = await resolvePublicSlug(slug);
  if (hit.kind === "redirect") permanentRedirect(`/careers/${hit.slug}`);
  if (hit.kind === "gone") notFound();
  if (hit.kind !== "published" && hit.kind !== "closed") notFound();
  return <JobArticle job={hit.job} mode={hit.kind === "closed" ? "closed" : "live"} updatedLabel={updatedLabel(hit)} />;
}
