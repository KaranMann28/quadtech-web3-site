import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Why Us",
  description:
    "Quad Tech Solutions Inc., founded in 2012, staffs telecom engineering and field work from Baltimore, Mississauga, California, the Greater Toronto Area, Montreal, and Calgary.",
};

const pillars = [
  {
    title: "Field and design tools",
    body: "Day-to-day work uses iBwave for DAS design, ATOLL for RF design support, XCAL for drive and walk testing, and sweep and PIM gear for coaxial plant.",
  },
  {
    title: "People who do the work",
    body: "Engineers and field technicians staff the service lines directly: design, commissioning, optimization, and on-site testing.",
  },
  {
    title: "United States and Canada",
    body: `Offices in Baltimore, Maryland and Mississauga, Ontario. Teams in ${company.teams.join(", ")}. Clients on both sides of the border.`,
  },
];

export default function WhyUsPage() {
  return (
    <>
      <PageHero eyebrow="Why Quad" title="Why choose Quad Tech Solutions">
        <p>
          A telecom engineering company, founded in {company.founded}, working wireless and wireline
          infrastructure for clients in the United States and Canada.
        </p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <li key={pillar.title} className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">{pillar.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{pillar.body}</p>
            </li>
          ))}
        </ul>
        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-semibold">Where the work is</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Founded in {company.founded}.</li>
            <li>Clients in the United States and Canada.</li>
            <li>Offices in Baltimore, Maryland and Mississauga, Ontario.</li>
            <li>Field and engineering teams in {company.teams.join(", ")}.</li>
            <li>Wireless and wireline design, testing, commissioning, and field services.</li>
          </ul>
        </section>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 px-4">
            <Link href="/contact">Start a project</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/services">Explore services</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
