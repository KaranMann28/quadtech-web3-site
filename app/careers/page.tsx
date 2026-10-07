import type { Metadata } from "next";
import { JobBoard } from "@/components/job-board";
import { PageHero } from "@/components/page-hero";
import { getPublishedJobs } from "@/lib/jobs/store";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open telecom field and engineering roles at Quad Tech Solutions Inc. Contract, contract-to-hire, and full-time work in the United States and Canada. Pay, when listed, is shown in USD or CAD.",
};

export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await getPublishedJobs();
  return (
    <>
      <PageHero eyebrow="Careers" title="Open roles">
        <p>
          Telecom field and engineering assignments. A posting shows country, location mode, and
          engagement type. When pay is confirmed, it is shown in USD or CAD, per hour or per day.
          Work authorization is collected for the United States or Canada on the application.
        </p>
      </PageHero>
      <JobBoard jobs={jobs} />
    </>
  );
}
