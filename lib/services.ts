import { serviceSlug, type ServiceLine, type ServiceSlug } from "@/lib/taxonomy";

export type Service = {
  slug: ServiceSlug;
  name: ServiceLine;
  summary: string;
  body: string[];
};

/**
 * Service copy uses the confirmed service list and the confirmed work examples.
 * TODO [CONFIRM] Equipment rental catalog and rates — not listed here.
 */
export const services: Service[] = [
  {
    slug: serviceSlug("RF Engineering"),
    name: "RF Engineering",
    summary:
      "Radio-frequency engineering, including ATOLL RF design support for carrier and venue projects.",
    body: [
      "Quad Tech Solutions provides RF engineering for wireless networks in the United States and Canada.",
      "The work includes ATOLL RF design support alongside drive-test and in-building programs.",
      "Engineering is coordinated from offices in Baltimore, Maryland and Mississauga, Ontario, with teams in California, the Greater Toronto Area, Montreal, and Calgary.",
    ],
  },
  {
    slug: serviceSlug("Wireless Network Design"),
    name: "Wireless Network Design",
    summary:
      "Wireless network design, including C-band and NSA-SA conversion support for carriers and OEMs.",
    body: [
      "Wireless network design covers carrier and OEM programs, including C-band and NSA-SA conversion support.",
      "Design work sits next to optimization, drive and walk testing, and ATOLL RF design support.",
      "Projects are delivered for clients across the United States and Canada.",
    ],
  },
  {
    slug: serviceSlug("DAS & Public Safety Systems"),
    name: "DAS & Public Safety Systems",
    summary:
      "iBwave DAS design for venues and hospitals, plus CBRS, ODAS, public safety (ERRCS), and commissioning.",
    body: [
      "DAS work includes iBwave design for venues, stadiums, and hospitals, and public safety (ERRCS) design.",
      "For neutral-host operators, the scope includes CBRS, ODAS, and commissioning.",
      "Benchmark data collection for major venues is part of how designs are checked in the field.",
    ],
  },
  {
    slug: serviceSlug("Drive & Walk Testing"),
    name: "Drive & Walk Testing",
    summary:
      "Carrier drive and walk testing with XCAL, plus benchmark collection for major venues.",
    body: [
      "Drive and walk testing is performed for carriers with XCAL data collection.",
      "The same practice includes benchmark data collection for major venues and airport and transit-tunnel testing programs.",
      "Field assignments include venue shifts and are staffed from Quad's US and Canada teams.",
    ],
  },
  {
    slug: serviceSlug("CW Testing"),
    name: "CW Testing",
    summary:
      "Continuous-wave testing used to check wireless coverage designs on field projects.",
    body: [
      "CW testing is a field measurement service on Quad wireless projects.",
      "It is used with drive and walk testing and in-building validation when a design needs a measured check.",
      "Crews work across the United States and Canada.",
    ],
  },
  {
    slug: serviceSlug("Commissioning & Integration"),
    name: "Commissioning & Integration",
    summary:
      "Commissioning and integration for DAS and wireless systems, including neutral-host scopes.",
    body: [
      "Commissioning and integration follow design and installation on DAS and wireless systems.",
      "Neutral-host scopes include commissioning of CBRS and ODAS systems.",
      "The work is coordinated with iBwave design and field test teams.",
    ],
  },
  {
    slug: serviceSlug("Optimization"),
    name: "Optimization",
    summary:
      "Optimization of wireless networks after deployment, paired with carrier testing programs.",
    body: [
      "Optimization is delivered with carrier testing and RF design support.",
      "It applies to the wireless networks Quad designs, tests, and commissions in the United States and Canada.",
      "C-band and NSA-SA conversion programs are one place this work shows up.",
    ],
  },
  {
    slug: serviceSlug("Field Services"),
    name: "Field Services",
    summary:
      "On-site crews for surveys, testing, and venue work across Quad's US and Canada markets.",
    body: [
      "Field services cover venue surveys, test assignments, and on-site support for contractors and operators.",
      "Teams are in California, the Greater Toronto Area, Montreal, and Calgary.",
      "Offices in Baltimore, Maryland and Mississauga, Ontario coordinate that work.",
    ],
  },
  {
    slug: serviceSlug("Cable Sweep & PIM Testing"),
    name: "Cable Sweep & PIM Testing",
    summary:
      "Cable sweep and PIM testing for data centers, transit, and venue construction scopes.",
    body: [
      "Sweep and PIM testing is performed for data centers and transit sites.",
      "General contractors and systems integrators also use Quad for venue sweep and PIM testing.",
      "The work is a field service, separate from iBwave design and XCAL drive testing.",
    ],
  },
  {
    slug: serviceSlug("Fiber Testing"),
    name: "Fiber Testing",
    summary:
      "Fiber testing on wireline infrastructure scopes that sit alongside Quad's wireless field work.",
    body: [
      "Fiber testing supports wireline infrastructure on projects that also carry wireless or DAS scope.",
      "It is staffed as a field service from Quad's US and Canada teams.",
      "It is listed separately from RF coaxial sweep and PIM testing.",
    ],
  },
  {
    slug: serviceSlug("Equipment Rental"),
    name: "Equipment Rental",
    summary:
      "Rental of test equipment for field and engineering assignments. A public catalog is not posted yet.",
    body: [
      "Quad rents test equipment for field and engineering assignments.",
      "A model list and rates are not published on this site.",
      "Rental questions go through the contact form until a catalog is confirmed.",
    ],
  },
  {
    slug: serviceSlug("Project Management"),
    name: "Project Management",
    summary:
      "Project management for multi-site testing, DAS, and other telecom field programs.",
    body: [
      "Project management covers telecom field and engineering programs Quad already performs.",
      "That includes multi-site testing, DAS design and commissioning, and venue or transit scopes.",
      "Managers work with the field teams in California, the Greater Toronto Area, Montreal, and Calgary.",
    ],
  },
  {
    slug: serviceSlug("Engineering Staffing"),
    name: "Engineering Staffing",
    summary:
      "Staffing for the engineering and field service lines Quad delivers in the US and Canada.",
    body: [
      "Engineering staffing supplies people for the service lines on this page.",
      "Open roles, when confirmed, are posted on the careers board as contract, contract-to-hire, or full-time.",
      "A general application is open on the talent network when a specific role is not posted.",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/** Old /services hash links, mapped to the closest confirmed service. */
export const legacyServiceAnchors: Record<string, ServiceSlug> = {
  "network-design": "wireless-network-design",
  wireless: "wireless-network-design",
  wireline: "fiber-testing",
  optimization: "optimization",
  troubleshooting: "field-services",
  consulting: "project-management",
};
