import type { IndustrySlug, ServiceSlug } from "@/lib/taxonomy";

export type Industry = {
  slug: IndustrySlug;
  name: string;
  summary: string;
  paragraphs: string[];
  serviceSlugs: ServiceSlug[];
};

export const industries: Industry[] = [
  {
    slug: "wireless-carriers-oems",
    name: "Wireless Carriers & OEMs",
    summary:
      "Drive and walk testing, benchmarking, optimization, and C-band / NSA-SA conversion support.",
    paragraphs: [
      "Quad Tech Solutions supports wireless carriers and OEMs with drive and walk testing, benchmarking, optimization, and C-band / NSA-SA conversion support.",
      "Field teams collect carrier data with XCAL. Engineering support includes ATOLL RF design.",
      "Work in this category has included carrier drive and walk testing programs and benchmark data collection for major venues.",
      "Assignments are staffed from offices in Baltimore, Maryland and Mississauga, Ontario, and from teams in California, the Greater Toronto Area, Montreal, and Calgary. Clients are in the United States and Canada.",
    ],
    serviceSlugs: [
      "drive-walk-testing",
      "optimization",
      "wireless-network-design",
      "rf-engineering",
      "cw-testing",
    ],
  },
  {
    slug: "neutral-host-das",
    name: "Neutral Host & DAS Operators",
    summary: "iBwave DAS design, CBRS, ODAS, and commissioning.",
    paragraphs: [
      "Quad designs distributed antenna systems for neutral-host and DAS operators, including iBwave DAS design, CBRS, ODAS, and commissioning.",
      "The same design practice includes venue, stadium, and hospital DAS produced in iBwave.",
      "Commissioning and integration are part of the scope when Quad is engaged through that phase.",
      "Delivery is for clients in the United States and Canada, from the Baltimore and Mississauga offices and from teams in California, the Greater Toronto Area, Montreal, and Calgary.",
    ],
    serviceSlugs: [
      "das-public-safety",
      "commissioning-integration",
      "rf-engineering",
      "wireless-network-design",
    ],
  },
  {
    slug: "general-contractors-integrators",
    name: "General Contractors & Systems Integrators",
    summary: "Venue surveys, cable sweep and PIM testing, and field services.",
    paragraphs: [
      "Quad supports general contractors and systems integrators with venue surveys, cable sweep and PIM testing, and field services.",
      "Sweep and PIM testing of this kind is also used on data center and transit sites.",
      "Fiber testing is available when the scope includes wireline infrastructure, and project management covers multi-site field programs.",
      "Crews work from offices in Baltimore, Maryland and Mississauga, Ontario, and from teams in California, the Greater Toronto Area, Montreal, and Calgary.",
    ],
    serviceSlugs: [
      "field-services",
      "cable-sweep-pim",
      "fiber-testing",
      "project-management",
    ],
  },
  {
    slug: "public-sector-transit",
    name: "Public Sector & Transit",
    summary:
      "Tunnel testing programs, public safety (ERRCS) design, and government facility work.",
    paragraphs: [
      "Public-sector and transit work includes tunnel testing programs, public safety (ERRCS) design, and government facility assignments.",
      "Airport and transit-tunnel testing programs sit in this practice, along with PIM and sweep testing on transit sites.",
      "In-building public safety design is produced in iBwave when the scope is a DAS or ERRCS system.",
      "Teams are in the United States and Canada, with offices in Baltimore, Maryland and Mississauga, Ontario, and field coverage in California, the Greater Toronto Area, Montreal, and Calgary.",
    ],
    serviceSlugs: [
      "das-public-safety",
      "drive-walk-testing",
      "cable-sweep-pim",
      "cw-testing",
      "field-services",
    ],
  },
  {
    slug: "enterprise-venues",
    name: "Enterprise & Venues",
    summary:
      "In-building coverage design and validation for stadiums, hospitals, hotels, and campuses.",
    paragraphs: [
      "For enterprises and venues — stadiums, hospitals, hotels, and campuses — Quad designs and validates in-building coverage.",
      "That work includes venue and stadium DAS design in iBwave, hospital DAS design, and benchmark data collection for major venues.",
      "Drive and walk testing and commissioning are used when a project needs a measured check after design.",
      "Clients are across the United States and Canada. Field teams are in California, the Greater Toronto Area, Montreal, and Calgary.",
    ],
    serviceSlugs: [
      "das-public-safety",
      "wireless-network-design",
      "drive-walk-testing",
      "commissioning-integration",
    ],
  },
  {
    slug: "data-centers",
    name: "Data Centers",
    summary:
      "RF coaxial and sweep testing, site investigation, and monitoring transitions.",
    paragraphs: [
      "Data-center work covers RF coaxial and sweep testing, site investigation, and monitoring transitions.",
      "PIM and sweep testing for data centers is part of the field practice, alongside fiber testing when the scope includes fiber.",
      "Site investigation is carried out by field teams rather than as a published monitoring product.",
      "Crews are in California, the Greater Toronto Area, Montreal, and Calgary, coordinated from offices in Baltimore, Maryland and Mississauga, Ontario.",
    ],
    serviceSlugs: ["cable-sweep-pim", "fiber-testing", "field-services"],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}
