import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { QuoteCta } from "@/components/quote-cta";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/page-meta";
import { serviceJsonLd } from "@/lib/service-schema";

const title = "Public-safety radio (ERRCS)";
const description =
  "In-building emergency responder radio coverage testing and commissioning for municipalities, building owners, and integrators. Ontario fire and building-code requirements are treated as project criteria, not as a claimed certification.";

export const metadata = pageMeta({
  title,
  description,
  path: "/services/public-safety-radio",
});

export default function PublicSafetyRadioPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: title,
          description,
          path: "/services/public-safety-radio",
          serviceType: "Emergency responder radio coverage testing",
        })}
      />
      <PageHero eyebrow="Services" title={title}>
        <p>
          In-building public-safety radio coverage testing and commissioning so fire and other
          emergency services can talk inside a structure. Work is sold to municipalities, building
          owners, and integrators.
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
            <li aria-current="page">Public-safety radio</li>
          </ol>
        </nav>
        <section className="space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Who it is for</h2>
          <p>
            Municipal fire and emergency-communications leads, building owners and property
            managers, and the integrators or general contractors they hire. Typical sites are
            civic buildings, hospitals, transit spaces, and other indoor structures where radio
            coverage is part of occupancy or retrofit work.
          </p>
        </section>
        <section className="mt-10 space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">What we deliver</h2>
          <p>
            Emergency responder radio coverage system (ERRCS) testing and commissioning, including
            walk testing, coverage checks against the project&apos;s written criteria, and
            commissioning support after installation. In-building public-safety design is produced
            in iBwave when the scope includes a designed system. Related DAS work is described on
            the{" "}
            <Link href="/services/das" className="text-accent">
              DAS page
            </Link>
            .
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Walk testing and coverage collection inside the building</li>
            <li>Comparison to the acceptance criteria the buyer or authority supplies</li>
            <li>Commissioning support and an exception list for punch items</li>
            <li>Coordination with the installer or integrator when Quad is not the installer</li>
          </ul>
        </section>
        <section className="mt-10 space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Ontario codes, stated plainly</h2>
          <p>
            Many Ontario municipalities and building owners require in-building radio coverage so
            emergency responders can communicate inside a structure. Those requirements usually
            come from the fire and building codes that apply to the site, and from the authority
            having jurisdiction for that building.
          </p>
          <p>
            Quad tests and commissions coverage against the criteria written into the project. This
            page does not claim a specific certification, listing, or approval. If a bid needs a
            named credential, ask for it in the quote request so the team can confirm what is held
            before a proposal goes out.
          </p>
        </section>
        <section className="mt-10 space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">What we will not invent</h2>
          <p>
            No client names, pass rates, or sample floor maps are published here. A description of
            the report fields we use is on the{" "}
            <Link href="/work" className="text-accent">
              How we work
            </Link>{" "}
            page.
          </p>
        </section>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <QuoteCta topic="public-safety" />
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/services/das">In-building DAS</Link>
          </Button>
        </div>
      </article>
    </>
  );
}
