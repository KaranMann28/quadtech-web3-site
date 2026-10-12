import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { company } from "@/lib/company";
import { services } from "@/lib/services";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const facts = [
  { label: "Founded", value: String(company.founded) },
  { label: "Clients", value: "United States & Canada" },
  { label: "Offices", value: "Baltimore, MD · Mississauga, ON" },
  { label: "Field teams", value: company.teams.join(", ") },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    foundingDate: String(company.founded),
    address: company.offices.map((office) => ({
      "@type": "PostalAddress",
      addressLocality: office.city,
      addressRegion: office.region,
      addressCountry: office.country,
    })),
    areaServed: company.markets,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-medium tracking-wider text-accent uppercase">Since {company.founded}</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Unleashing the Future <span className="gradient-text">of Telecom</span>
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-muted-foreground">
            Wireless and wireline engineering for carriers, venues, transit, and data centers. RF
            design, DAS, drive and walk testing, sweep and PIM, and field services across the United
            States and Canada.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-5">
              <Link href="/contact">Contact Quad</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5">
              <Link href="/services">Explore services</Link>
            </Button>
          </div>
          <dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-border bg-card/80 p-4">
                <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 text-sm font-semibold leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold md:text-5xl">Services</h2>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Field and engineering work Quad performs for telecom infrastructure clients.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <Card className="h-full text-base">
                <CardContent className="grid h-full gap-3">
                  <h3 className="text-xl font-semibold">
                    <Link href={`/services#${service.slug}`} className="hover:text-accent">
                      {service.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{service.summary}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
      <section className="border-t border-border bg-gradient-to-b from-background to-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold md:text-3xl">Talk through a scope</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Offices in Baltimore, Maryland and Mississauga, Ontario. Teams in California, the Greater
            Toronto Area, Montreal, and Calgary.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-11 px-5">
              <Link href="/contact">Contact Quad</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5">
              <Link href="/careers">View open roles</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
