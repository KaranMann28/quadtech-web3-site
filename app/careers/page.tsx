import type { Metadata } from "next";
import { JobBoard } from "@/components/job-board";
import { LinkedInFollow } from "@/components/linkedin-follow";
import { PageHero } from "@/components/page-hero";
import { getPublishedJobs } from "@/lib/jobs/store";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open roles at Quad Tech Solutions Inc. Engineering, field, and delivery assignments in the United States and Canada. Applying takes under a minute.",
};

export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await getPublishedJobs();
  return (
    <>
      <PageHero eyebrow="Careers" title="Open roles">
        <p>
          Engineering, field, and delivery assignments in the United States and Canada. Applying
          takes under a minute: name, email, and résumé.
        </p>
        <p className="mt-4 text-base">
          <LinkedInFollow />
        </p>
      </PageHero>
      <JobBoard jobs={jobs} />
    </>
  );
}
