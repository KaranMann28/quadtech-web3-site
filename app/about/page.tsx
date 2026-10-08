import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "Quad Tech Solutions Inc. was founded in 2012. Offices in Baltimore, Maryland and Mississauga, Ontario, with teams in California, the Greater Toronto Area, Montreal, and Calgary.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="About Quad Tech Solutions">
        <p>
          {company.legalName} is a telecom and IT company delivering engineering infrastructure
          solutions and services since {company.founded}.
        </p>
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:px-8">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="text-sm text-muted-foreground">Founded</dt>
            <dd className="mt-1 text-2xl font-semibold">{company.founded}</dd>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="text-sm text-muted-foreground">Clients</dt>
            <dd className="mt-1 text-2xl font-semibold">United States and Canada</dd>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="text-sm text-muted-foreground">Offices</dt>
            <dd className="mt-1 text-2xl font-semibold">Baltimore and Mississauga</dd>
          </div>
        </dl>
        <section className="max-w-3xl space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Our story</h2>
          <p>
            Established in {company.founded}, Quad Tech Solutions Inc. delivers engineering
            infrastructure solutions and services. The company serves clients across the United
            States and Canada.
          </p>
          <p>
            Offices are in Baltimore, Maryland and Mississauga, Ontario. Field and engineering teams
            also work in California, the Greater Toronto Area, Montreal, and Calgary.
          </p>
          <p>
            Within the telecom group, the work is wireless and wireline network design, optimization,
            and troubleshooting, plus the field services listed on the services page: RF engineering,
            DAS and public safety, drive and walk testing, sweep and PIM, fiber testing, and related
            lines.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Offices and teams</h2>
          {/* TODO [CONFIRM] street addresses. Previously published lines are recorded in lib/company.ts and are not shown here. */}
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {company.offices.map((office) => (
              <li key={office.city} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-lg font-semibold">
                  {office.city}, {office.regionName}
                </h3>
                <p className="text-sm text-muted-foreground">{office.countryName}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-lg font-semibold">Team locations</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {company.teams.map((team) => (
              <li key={team} className="rounded-full border border-border px-3 py-1 text-sm">
                {team}
              </li>
            ))}
          </ul>
        </section>
        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold">What the company is here to do</h2>
          <p className="text-muted-foreground">
            The stated vision is straightforward: build networks that perform flawlessly. The stated
            mission is to be a trusted partner for video, voice, and data networks in North America,
            with reliable, competitively priced engineering.
          </p>
        </section>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 px-4">
            <Link href="/contact">Contact the team</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/services">View services</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
