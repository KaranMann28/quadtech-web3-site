export const SERVICE_LINES = [
  "RF Engineering",
  "Wireless Network Design",
  "DAS & Public Safety Systems",
  "Drive & Walk Testing",
  "CW Testing",
  "Commissioning & Integration",
  "Optimization",
  "Field Services",
  "Cable Sweep & PIM Testing",
  "Fiber Testing",
  "Equipment Rental",
  "Project Management",
  "Engineering Staffing",
] as const;

export type ServiceLine = (typeof SERVICE_LINES)[number];

export const SERVICE_SLUGS = {
  "RF Engineering": "rf-engineering",
  "Wireless Network Design": "wireless-network-design",
  "DAS & Public Safety Systems": "das-public-safety",
  "Drive & Walk Testing": "drive-walk-testing",
  "CW Testing": "cw-testing",
  "Commissioning & Integration": "commissioning-integration",
  Optimization: "optimization",
  "Field Services": "field-services",
  "Cable Sweep & PIM Testing": "cable-sweep-pim",
  "Fiber Testing": "fiber-testing",
  "Equipment Rental": "equipment-rental",
  "Project Management": "project-management",
  "Engineering Staffing": "engineering-staffing",
} as const satisfies Record<ServiceLine, string>;

export type ServiceSlug = (typeof SERVICE_SLUGS)[ServiceLine];

export const INDUSTRY_SLUGS = [
  "wireless-carriers-oems",
  "neutral-host-das",
  "general-contractors-integrators",
  "public-sector-transit",
  "enterprise-venues",
  "data-centers",
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

export const COUNTRIES = ["US", "CA"] as const;
export type CountryCode = (typeof COUNTRIES)[number];

export const LOCATION_MODES = ["Field", "On-site", "Hybrid", "Remote"] as const;
export type LocationMode = (typeof LOCATION_MODES)[number];

export const ENGAGEMENT_TYPES = [
  "Contract",
  "Contract-to-Hire",
  "Full-Time",
] as const;
export type EngagementType = (typeof ENGAGEMENT_TYPES)[number];

export const WORK_AUTH = [
  "citizen-pr",
  "work-permit",
  "needs-sponsorship",
] as const;
export type WorkAuth = (typeof WORK_AUTH)[number];

export const WORK_AUTH_LABELS: Record<WorkAuth, string> = {
  "citizen-pr": "Citizen or permanent resident",
  "work-permit": "Work permit",
  "needs-sponsorship": "Needs sponsorship",
};

const serviceSlugToLine = Object.fromEntries(
  Object.entries(SERVICE_SLUGS).map(([line, slug]) => [slug, line]),
) as Record<ServiceSlug, ServiceLine>;

export function serviceSlug(line: ServiceLine): ServiceSlug {
  return SERVICE_SLUGS[line];
}

export function serviceLineFromSlug(slug: string): ServiceLine | undefined {
  return serviceSlugToLine[slug as ServiceSlug];
}

export function countryName(code: CountryCode): string {
  return code === "US" ? "United States" : "Canada";
}

export function modeSlug(mode: LocationMode): string {
  switch (mode) {
    case "Field":
      return "field";
    case "On-site":
      return "on-site";
    case "Hybrid":
      return "hybrid";
    case "Remote":
      return "remote";
  }
}

export function modeFromSlug(slug: string): LocationMode | undefined {
  const match = LOCATION_MODES.find((mode) => modeSlug(mode) === slug);
  return match;
}

export function typeSlug(type: EngagementType): string {
  switch (type) {
    case "Contract":
      return "contract";
    case "Contract-to-Hire":
      return "contract-to-hire";
    case "Full-Time":
      return "full-time";
  }
}

export function typeFromSlug(slug: string): EngagementType | undefined {
  const match = ENGAGEMENT_TYPES.find((type) => typeSlug(type) === slug);
  return match;
}
