import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Logo } from "@/components/logo";
import { PrintButton } from "@/components/print-button";
import { QuoteCta } from "@/components/quote-cta";
import { buyerServices } from "@/content/buyer-services";
import { company } from "@/lib/company";
import { pageMeta } from "@/lib/page-meta";
import { SITE_NAME, SITE_URL, WORDMARK } from "@/lib/site";

const title = "Capabilities";
const description =
  "One-page summary of Quad Tech Solutions telecom services, Canada coverage, how to engage, and contact. Print or save as PDF from the browser.";

export const metadata = pageMeta({
  title,
  description,
  path: "/capabilities",
});

const engage = [
  "Send a scope through the contact form: site type, technology, timeline, and any written criteria.",
  "We confirm whether the fit is design, field testing, commissioning, project support, or staffing.",
  "Work proceeds against the plan. Reports use the field lists described on How we work.",
  "Closeout lists exceptions against those criteria. Follow-up days are scoped when you ask.",
];

export default function CapabilitiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Capabilities one-pager",
    description,
    url: `${SITE_URL}/capabilities`,
    about: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="border-b border-border print:hidden">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-medium tracking-wider text-accent uppercase">Leave-behind</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Capabilities one-pager</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Print-friendly A4 or Letter. Use Download PDF to open the browser print dialog and
              save as PDF. No extra software is installed.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrintButton>Download PDF</PrintButton>
            <QuoteCta topic="capabilities" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0">
        <article className="capabilities-sheet rounded-xl border border-border bg-card p-6 sm:p-10 print:rounded-none print:border-0 print:bg-white print:p-0">
          <header className="flex items-start justify-between gap-4 border-b border-border pb-6 print:border-neutral-300">
            <div className="flex items-center gap-3">
              <Logo className="size-8 text-accent print:text-black" />
              <div>
                <p className="gradient-text text-lg font-bold print:bg-none print:text-black">
                  {WORDMARK}
                </p>
                <p className="text-sm text-muted-foreground print:text-neutral-600">
                  Telecom engineering and field services
                </p>
              </div>
            </div>
            <p className="text-right text-sm text-muted-foreground print:text-neutral-600">
              Founded {company.founded}
              <span className="block">quadtechsolutions.io</span>
            </p>
          </header>
          <section className="mt-6">
            <h2 className="text-sm font-semibold tracking-wider uppercase print:text-black">
              Services
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {buyerServices.map((service) => (
                <li key={service.slug}>
                  <p className="font-semibold print:text-black">{service.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground print:text-neutral-700">
                    {service.summary}
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wider uppercase print:text-black">
                Coverage
              </h2>
              <p className="mt-3 text-sm text-muted-foreground print:text-neutral-700">
                Canada. Office in Mississauga, Ontario. Field and engineering teams in the Greater
                Toronto Area, Montreal, and Calgary.
              </p>
              <p className="mt-2 text-sm text-muted-foreground print:text-neutral-700">
                Work is also staffed in the United States from Baltimore, Maryland.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wider uppercase print:text-black">
                How to engage
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground print:text-neutral-700">
                {engage.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </section>
          <section className="mt-6 border-t border-border pt-6 print:border-neutral-300">
            <h2 className="text-sm font-semibold tracking-wider uppercase print:text-black">
              Contact
            </h2>
            <p className="mt-3 text-sm text-muted-foreground print:text-neutral-700">
              Send a scope at {SITE_URL}/contact. A monitored public inbox is still being
              confirmed, so quotes start on that form.
            </p>
            <ul className="mt-3 text-sm text-muted-foreground print:text-neutral-700">
              {company.offices.map((office) => (
                <li key={office.city}>
                  {office.city}, {office.regionName}, {office.countryName}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm print:hidden">
              <Link href="/contact?topic=capabilities" className="text-accent">
                Open the contact form
              </Link>
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
