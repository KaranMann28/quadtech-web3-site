import type { QuoteTopic } from "@/lib/quote-topics";

export type BuyerServiceLink = {
  href: string;
  label: string;
};

export type BuyerService = {
  slug: string;
  name: string;
  summary: string;
  audience: string;
  deliverables: string;
  topic: QuoteTopic;
  links: BuyerServiceLink[];
};

/**
 * Buyer-facing service lines for the public hub and home page.
 * Copy is limited to capabilities already listed on the site, plus the
 * plain-language groupings in the opportunity scan. No client names, rates,
 * certifications, or metrics.
 *
 * TODO [CONFIRM] with Karan: Salesforce as a staff-augmentation line;
 * project administration (order management and cutovers) as a public offer;
 * rural broadband, private 5G, and neutral-host survey wording on field testing.
 */
export const buyerServices: BuyerService[] = [
  {
    slug: "rf-design",
    name: "RF design and optimization",
    summary:
      "Radio-frequency design support and post-build optimization for wireless networks.",
    audience:
      "Carriers, OEMs, and integrators that need RF design support or optimization after construction.",
    deliverables:
      "ATOLL RF design support, wireless design including C-band and NSA-to-SA conversion support, and optimization after the network is built.",
    topic: "rf-design",
    links: [{ href: "/services#rf-engineering", label: "RF engineering notes" }],
  },
  {
    slug: "field-testing",
    name: "Drive, walk, and CW testing",
    summary:
      "Measured coverage collection for carrier, ISP, venue, and private-network programs.",
    audience:
      "Carriers, ISPs, OEMs, and integrator field programs that need drive, walk, or continuous-wave measurements.",
    deliverables:
      "XCAL drive and walk testing, CW testing, venue benchmark collection, rural broadband acceptance testing, and private 5G or neutral-host surveys as a subcontractor.",
    topic: "field-testing",
    links: [{ href: "/services/field-testing", label: "Field testing" }],
  },
  {
    slug: "in-building",
    name: "In-building DAS and public-safety radio",
    summary:
      "Indoor coverage design and commissioning for commercial DAS and emergency-responder radio systems.",
    audience:
      "Building owners, general contractors, integrators, and municipalities that need indoor commercial or public-safety coverage.",
    deliverables:
      "iBwave DAS design and commissioning, plus emergency responder radio coverage (ERRCS) testing and commissioning against the project's written criteria.",
    topic: "das",
    links: [
      { href: "/services/das", label: "DAS" },
      { href: "/services/public-safety-radio", label: "Public-safety radio" },
    ],
  },
  {
    slug: "sweep-pim-fiber",
    name: "Sweep, PIM, and fiber testing",
    summary: "Coaxial plant and fiber measurements on construction and upgrade scopes.",
    audience:
      "General contractors, data-center and transit builders, and tower or venue programs.",
    deliverables:
      "Cable sweep and PIM testing, and fiber testing on wireline scopes that sit beside wireless or DAS work.",
    topic: "sweep-pim-fiber",
    links: [{ href: "/services#cable-sweep-pim", label: "Sweep and PIM notes" }],
  },
  {
    slug: "project-management",
    name: "Project management and administration",
    summary:
      "Coordination for multi-site telecom programs, including order management and cutover support.",
    audience:
      "Carriers, integrators, and delivery leads who need program coordination or contractor project administration.",
    deliverables:
      "Project management for multi-site testing and DAS programs, plus project administration covering order management, cutover coordination, and closeout reporting.",
    topic: "project-management",
    links: [{ href: "/services#project-management", label: "Project management notes" }],
  },
  {
    slug: "staffing",
    name: "Staff augmentation",
    summary:
      "Contract engineers, field technicians, and Salesforce delivery roles on client programs.",
    audience:
      "Carriers, systems integrators, and program leads who need named people on an existing delivery team.",
    deliverables:
      "Engineering and field staffing across the service lines on this site, including Salesforce functional, technical, and data-migration roles when those seats are open.",
    topic: "staffing",
    links: [
      { href: "/careers", label: "Open roles" },
      { href: "/services#engineering-staffing", label: "Staffing notes" },
    ],
  },
];

export function getBuyerService(slug: string): BuyerService | undefined {
  return buyerServices.find((service) => service.slug === slug);
}
