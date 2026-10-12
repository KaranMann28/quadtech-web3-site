import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Quad Tech Solutions Inc. Offices in Baltimore, Maryland and Mississauga, Ontario.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Contact Quad Tech Solutions">
        <p>
          Send a note about a project. A monitored public inbox is still being confirmed, so this
          form delivers only after that inbox is connected.
        </p>
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section>
          <h2 className="text-2xl font-semibold">Send a message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Offices</h2>
          {/* TODO [CONFIRM] street addresses, phone numbers, and a public contact email. */}
          <ul className="mt-4 grid gap-4">
            {company.offices.map((office) => (
              <li key={office.city} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">
                  {office.city}, {office.region}
                </h3>
                <p className="text-sm text-muted-foreground">{office.countryName}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-semibold">Teams</h3>
          <p className="mt-2 text-sm text-muted-foreground">{company.teams.join(" · ")}</p>
        </section>
      </div>
    </>
  );
}
