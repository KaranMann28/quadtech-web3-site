import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { industries } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Quad Tech Solutions works with wireless carriers and OEMs, neutral-host and DAS operators, general contractors, public sector and transit, enterprise venues, and data centers.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Who Quad works for">
        <p>Telecom field and engineering work for six customer categories in the United States and Canada.</p>
      </PageHero>
      <ul className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 xl:grid-cols-3">
        {industries.map((industry) => (
          <li key={industry.slug}>
            <Card className="h-full text-base">
              <CardContent className="grid h-full gap-3">
                <h2 className="text-xl font-semibold">
                  <Link href={`/industries/${industry.slug}`} className="hover:text-accent">
                    {industry.name}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">{industry.summary}</p>
                <Link href={`/careers?industry=${industry.slug}`} className="text-sm text-accent">
                  Roles in this industry
                </Link>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
