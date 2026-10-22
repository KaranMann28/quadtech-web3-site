import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { QuoteCta } from "@/components/quote-cta";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/page-meta";
import { serviceJsonLd } from "@/lib/service-schema";

const title = "In-building DAS";
const description =
  "In-building distributed antenna system design and commissioning for venues, hospitals, campuses, and other indoor wireless systems. iBwave design, CBRS and ODAS commissioning, and related public-safety work.";

export const metadata = pageMeta({
  title,
  description,
  path: "/services/das",
});

export default function DasPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: title,
          description,
          path: "/services/das",
          serviceType: "Distributed antenna system design",
        })}
      />
      <PageHero eyebrow="Services" title={title}>
        <p>
          Design and commissioning for indoor distributed antenna systems. The work sits with
          venues, hospitals, campuses, and the integrators or neutral-host operators that build
          those systems.
        </p>
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/services" className="hover:text-accent">
                Services
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">DAS</li>
          </ol>
        </nav>
        <section className="space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Who it is for</h2>
          <p>
            Neutral-host and DAS operators, general contractors and systems integrators, and
            enterprise or venue owners. Stadiums, hospitals, hotels, and campuses are the site
            types already listed on the industries pages.
          </p>
        </section>
        <section className="mt-10 space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">What we deliver</h2>
          <p>
            iBwave DAS design for indoor systems, plus commissioning and integration when Quad is
            engaged through that phase. Neutral-host scopes can include CBRS, outdoor DAS (ODAS),
            and commissioning. Benchmark data collection is used when a venue needs a measured
            check of the design.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>iBwave design for venues, stadiums, hospitals, and similar indoor sites</li>
            <li>Commissioning and integration after installation</li>
            <li>CBRS and ODAS commissioning on neutral-host scopes</li>
            <li>Walk testing and venue benchmark collection when the design needs a field check</li>
          </ul>
          <p>
            Public-safety (ERRCS) testing and commissioning is a related line. See{" "}
            <Link href="/services/public-safety-radio" className="text-accent">
              public-safety radio
            </Link>
            .
          </p>
        </section>
        <section className="mt-10 space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Tools, not certificates</h2>
          <p>
            Day-to-day DAS design is produced in iBwave. That is a tool statement, not a
            certification claim. Named designer credentials are confirmed on request and are not
            listed on this page.
          </p>
        </section>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <QuoteCta topic="das" />
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/services/public-safety-radio">Public-safety radio</Link>
          </Button>
        </div>
      </article>
    </>
  );
}
