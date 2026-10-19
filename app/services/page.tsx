import Link from "next/link";
import { BuyerServiceCard } from "@/components/buyer-service-card";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { QuoteCta } from "@/components/quote-cta";
import { Button } from "@/components/ui/button";
import { buyerServices } from "@/content/buyer-services";
import { pageMeta } from "@/lib/page-meta";
import { serviceCatalogJsonLd } from "@/lib/service-schema";
import { legacyServiceAnchors, services } from "@/lib/services";

export const metadata = pageMeta({
  title: "Services",
  description:
    "RF design and optimization, drive walk and CW testing, in-building DAS and public-safety radio, sweep PIM and fiber testing, telecom project management, and staff augmentation for carriers, integrators, OEMs, ISPs, and municipalities.",
  path: "/services",
});

export default function ServicesPage() {
  const jsonLd = serviceCatalogJsonLd(
    buyerServices.map((service) => ({
      name: service.name,
      description: service.summary,
      path: service.links[0]?.href.startsWith("/services/") ? service.links[0].href : "/services",
    })),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero eyebrow="Services" title="Telecom engineering and field services">
        <p>
          Plain-language service lines for carriers, integrators, OEMs, ISPs, and municipalities in
          Canada and the United States. Request a quote and we will reply through the contact form.
        </p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="grid gap-4 md:grid-cols-2">
          {buyerServices.map((service) => (
            <li key={service.slug} id={service.slug} className="scroll-mt-24">
              <BuyerServiceCard service={service} />
            </li>
          ))}
        </ul>
        <section className="mt-16 rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Dedicated pages</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Longer notes for the three scopes buyers ask about most. Each page stays inside
            confirmed capabilities. No case studies or certifications are claimed there.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            <li>
              <Link href="/services/public-safety-radio" className="font-medium text-accent">
                Public-safety radio (ERRCS)
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                In-building emergency-responder coverage testing and commissioning.
              </p>
            </li>
            <li>
              <Link href="/services/das" className="font-medium text-accent">
                In-building DAS
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                Design and commissioning for venues, hospitals, and other indoor systems.
              </p>
            </li>
            <li>
              <Link href="/services/field-testing" className="font-medium text-accent">
                Field testing
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                Drive, walk, and CW testing, including ISP and private-network survey work.
              </p>
            </li>
          </ul>
        </section>
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Service catalog</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            The same lines used on the careers board. Hash links from older pages still land here.
          </p>
          <ol className="mt-8 space-y-10">
            {services.map((service) => {
              const legacy = Object.entries(legacyServiceAnchors)
                .filter(([, slug]) => slug === service.slug)
                .map(([id]) => id);
              return (
                <li key={service.slug} id={service.slug} className="scroll-mt-24">
                  {legacy.map((id) => (
                    <span key={id} id={id} className="absolute" />
                  ))}
                  <h3 className="text-xl font-semibold">{service.name}</h3>
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
                </li>
              );
            })}
          </ol>
        </section>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <QuoteCta topic="capabilities" />
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/work">How we work</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/capabilities">Capabilities one-pager</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
