import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { QuoteCta } from "@/components/quote-cta";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/content/case-studies";
import {
  dailyTestReportFields,
  engagementSteps,
  kpiSummaryFields,
  sampleDeliverables,
} from "@/content/how-we-work";
import { pageMeta } from "@/lib/page-meta";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "How Quad Tech Solutions scopes, plans, collects, and reports telecom field and design work. Sample report fields and deliverables — no invented case studies, metrics, or testimonials.";

export const metadata = pageMeta({
  title: "How we work",
  description,
  path: "/work",
});

export default function WorkPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How we work",
    description,
    url: `${SITE_URL}/work`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero eyebrow="Proof" title="How we work">
        <p>
          The engagement sequence and the fields that appear in a typical report. Confirmed case
          studies are not published yet. Nothing on this page invents a client, a metric, or a
          testimonial.
        </p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <h2 className="text-2xl font-semibold">Engagement process</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {engagementSteps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm font-medium tracking-wider text-accent uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Sample deliverables</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            A closeout package usually contains the items below. Exact files follow the test or
            design plan written for that job.
          </p>
          <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-muted-foreground">
            {sampleDeliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Sample report fields</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Field names only. No sample rows, maps, or invented KPI values. When a consented
            anonymized report is approved, it can replace this list.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Daily test report</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {dailyTestReportFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">KPI summary</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {kpiSummaryFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Case studies</h2>
          {caseStudies.length === 0 ? (
            <p className="mt-3 max-w-3xl text-muted-foreground">
              No case studies are published. The page is wired to{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">content/case-studies.ts</code>
              , which holds an empty list and a commented template. A write-up appears here only
              after the facts are confirmed and the client consents to an anonymized description.
              Client names, rates, and metrics stay out.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {caseStudies.map((study) => (
                <li key={study.slug} className="rounded-xl border border-border bg-card p-6">
                  <p className="text-sm text-accent">{study.sector}</p>
                  <h3 className="mt-2 text-lg font-semibold">{study.title}</h3>
                  {study.year ? (
                    <p className="mt-1 text-sm text-muted-foreground">{study.year}</p>
                  ) : null}
                  <p className="mt-3 text-sm text-muted-foreground">{study.challenge}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{study.approach}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{study.outcome}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <QuoteCta topic="capabilities" />
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/capabilities">Capabilities one-pager</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href="/services">Services</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
