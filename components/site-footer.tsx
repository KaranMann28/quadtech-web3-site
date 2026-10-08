import Link from "next/link";
import { Logo } from "@/components/logo";
import { company } from "@/lib/company";
import { industries } from "@/lib/industries";
import { services } from "@/lib/services";
import { WORDMARK } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="mb-4 flex items-center gap-3">
            <Logo className="size-8 text-accent" />
            <span className="gradient-text text-lg font-bold">{WORDMARK}</span>
          </Link>
          <p className="max-w-md text-sm text-muted-foreground">
            Unleashing the potential of Telecom. Wireless and wireline network design, optimization,
            and field engineering for clients in the United States and Canada.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider uppercase">Quick links</h2>
          <ul className="space-y-2">
            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/services", "Services"],
              ["/industries", "Industries"],
              ["/why-us", "Why Us"],
              ["/careers", "Careers"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-muted-foreground hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider uppercase">Services</h2>
          <ul className="space-y-2">
            {services.slice(0, 8).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services#${service.slug}`}
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  {service.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="text-sm text-accent">
                All services
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider uppercase">Offices</h2>
          {/* TODO [CONFIRM] street addresses for Baltimore and Mississauga. */}
          <address className="space-y-3 text-sm text-muted-foreground not-italic">
            {company.offices.map((office) => (
              <p key={office.city}>
                {office.city}, {office.region}
                <span className="block">{office.countryName}</span>
              </p>
            ))}
          </address>
          <h2 className="mt-6 mb-3 text-sm font-semibold tracking-wider uppercase">Industries</h2>
          <ul className="space-y-2">
            {industries.map((industry) => (
              <li key={industry.slug}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  {industry.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
          © {year} {company.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
