import type { Metadata } from "next";
import Link from "next/link";
import { ApplyForm } from "@/components/apply-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Talent network",
  description:
    "Join the Quad Tech Solutions bench for future telecom field and engineering assignments in the United States and Canada.",
};

export default function TalentNetworkPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Join the bench">
        <p>
          A general application for people who want to be considered when a field or engineering
          assignment opens. This is not a posted job. Quad will use the email you provide if a
          hiring manager wants to continue.
        </p>
      </PageHero>
      <div className="mx-auto grid max-w-3xl gap-6 px-4 py-12 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Looking for a specific opening?{" "}
          <Link href="/careers" className="text-accent">
            Back to open roles
          </Link>
          .
        </p>
        <ApplyForm kind="talent-network" />
      </div>
    </>
  );
}
