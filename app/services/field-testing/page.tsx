import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { QuoteCta } from "@/components/quote-cta";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/page-meta";
import { serviceJsonLd } from "@/lib/service-schema";

const title = "Field testing";
const description =
  "Drive, walk, and CW testing for carriers, ISPs, and integrators. Rural broadband acceptance testing, private 5G and neutral-host surveys as a subcontractor, and venue benchmark collection.";

export const metadata = pageMeta({
  title,
  description,
  path: "/services/field-testing",
});

export default function FieldTestingPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: title,
          description,
          path: "/services/field-testing",
          serviceType: "Wireless field testing",
        })}
      />
      <PageHero eyebrow="Services" title={title}>
        <p>
          Measured coverage work: drive testing, walk testing, and continuous-wave testing. Crews
          collect data for carriers, ISPs, OEMs, and the integrators that subcontract field days.
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
            <li aria-current="page">Field testing</li>
          </ol>
        </nav>
        <section className="space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Who it is for</h2>
          <p>
            Wireless carriers and OEMs, rural and regional ISPs, and integrator or OEM programs
            that need a subcontractor for survey, CW, or acceptance days. Field teams work from
            California, the Greater Toronto Area, Montreal, and Calgary, coordinated from
            Baltimore and Mississauga.
          </p>
        </section>
        <section className="mt-10 space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">What we deliver</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Carrier drive and walk testing with XCAL data collection</li>
            <li>Continuous-wave (CW) testing to check a coverage design in the field</li>
            <li>Stationary or speed checks and single-site verification when the plan calls for them</li>
            <li>Benchmark collection for venues, plus airport and transit-tunnel test programs</li>
            <li>Rural broadband acceptance testing for ISPs that need a measured coverage check</li>
            <li>
              Private 5G and neutral-host survey, CW, and commissioning days sold as a
              subcontractor to the integrator or OEM
            </li>
          </ul>
        </section>
        <section className="mt-10 space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Reports</h2>
          <p>
            Daily and closeout packages list the fields in the test plan. A field-name sample —
            with no invented measurements — is on{" "}
            <Link href="/work" className="text-accent">
              How we work
            </Link>
            .
          </p>
        </section>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <QuoteCta topic="field-testing" />
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/services">All services</Link>
          </Button>
        </div>
      </article>
    </>
  );
}
