import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { legacyServiceAnchors, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "RF engineering, wireless network design, DAS and public safety, drive and walk testing, CW testing, commissioning, optimization, field services, sweep and PIM, fiber testing, equipment rental, project management, and engineering staffing.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Telecom and IT field engineering">
        <p>
          Thirteen service lines Quad Tech Solutions performs for clients in the United States and
          Canada. Each one links to open roles in that line when a role is posted.
        </p>
      </PageHero>
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6">
        {services.map((service) => {
          const legacy = Object.entries(legacyServiceAnchors)
            .filter(([, slug]) => slug === service.slug)
            .map(([id]) => id);
          return (
            <section key={service.slug} id={service.slug} className="scroll-mt-24">
              {legacy.map((id) => (
                <span key={id} id={id} className="absolute" />
              ))}
              <h2 className="text-2xl font-semibold">{service.name}</h2>
              {service.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              <p className="mt-4">
                <Link href={`/careers?service=${service.slug}`} className="text-accent">
                  Roles in {service.name}
                </Link>
              </p>
            </section>
          );
        })}
        <Button asChild className="h-11 px-4">
          <Link href="/contact">Contact Quad</Link>
        </Button>
      </div>
    </>
  );
}
