import type { ServiceLine, ServiceSlug } from "@/lib/taxonomy";
import { serviceSlug } from "@/lib/taxonomy";

export type ScreenerType = "text" | "number" | "textarea";

export type Screener = {
  id: string;
  label: string;
  type: ScreenerType;
  required: boolean;
};

const travel: Screener = {
  id: "travel_radius",
  label: "Travel radius you can cover",
  type: "text",
  required: true,
};

const ownEquipment: Screener = {
  id: "own_equipment",
  label: "Own test equipment? (list)",
  type: "textarea",
  required: true,
};

export const screenersBySlug: Record<ServiceSlug | "general", Screener[]> = {
  "rf-engineering": [
    {
      id: "atoll_years",
      label: "Years of ATOLL experience",
      type: "number",
      required: true,
    },
    {
      id: "rf_tools",
      label: "Other RF tools you use",
      type: "text",
      required: true,
    },
  ],
  "wireless-network-design": [
    {
      id: "design_years",
      label: "Years of wireless network design",
      type: "number",
      required: true,
    },
    {
      id: "design_tools",
      label: "Design tools you use (ATOLL, iBwave, other)",
      type: "text",
      required: true,
    },
  ],
  "das-public-safety": [
    {
      id: "ibwave_years",
      label: "Years of iBwave experience",
      type: "number",
      required: true,
    },
    {
      id: "ibwave_cert",
      label: "iBwave certification level, if any",
      type: "text",
      required: false,
    },
    {
      id: "das_types",
      label: "DAS or public-safety systems you have designed",
      type: "textarea",
      required: true,
    },
  ],
  "drive-walk-testing": [
    {
      id: "xcal_years",
      label: "Years of XCAL experience",
      type: "number",
      required: true,
    },
    ownEquipment,
    travel,
  ],
  "cw-testing": [
    {
      id: "cw_years",
      label: "Years of CW testing",
      type: "number",
      required: true,
    },
    ownEquipment,
    travel,
  ],
  "commissioning-integration": [
    {
      id: "commissioning_years",
      label: "Years of commissioning or integration",
      type: "number",
      required: true,
    },
    {
      id: "systems_commissioned",
      label: "Systems you have commissioned (DAS, CBRS, ODAS, other)",
      type: "textarea",
      required: true,
    },
    travel,
  ],
  optimization: [
    {
      id: "optimization_years",
      label: "Years of wireless optimization",
      type: "number",
      required: true,
    },
    {
      id: "optimization_tools",
      label: "Tools you use",
      type: "text",
      required: true,
    },
  ],
  "field-services": [
    {
      id: "field_years",
      label: "Years of telecom field work",
      type: "number",
      required: true,
    },
    ownEquipment,
    {
      id: "license_vehicle",
      label: "Valid driver's license and vehicle?",
      type: "text",
      required: true,
    },
    travel,
  ],
  "cable-sweep-pim": [
    {
      id: "pim_years",
      label: "Years of sweep or PIM testing",
      type: "number",
      required: true,
    },
    ownEquipment,
    travel,
  ],
  "fiber-testing": [
    {
      id: "fiber_years",
      label: "Years of fiber testing",
      type: "number",
      required: true,
    },
    ownEquipment,
    travel,
  ],
  "equipment-rental": [
    {
      id: "rental_equipment",
      label: "Equipment you can deploy or maintain",
      type: "textarea",
      required: true,
    },
    travel,
  ],
  "project-management": [
    {
      id: "pm_years",
      label: "Years of telecom project management",
      type: "number",
      required: true,
    },
    {
      id: "pm_types",
      label: "Project types you have led",
      type: "textarea",
      required: true,
    },
  ],
  "engineering-staffing": [
    {
      id: "staffing_disciplines",
      label: "Disciplines you staff or practice",
      type: "text",
      required: true,
    },
    {
      id: "staffing_years",
      label: "Years in telecom staffing or engineering",
      type: "number",
      required: true,
    },
  ],
  general: [
    {
      id: "general_years",
      label: "Years of telecom field or engineering experience",
      type: "number",
      required: true,
    },
    {
      id: "general_tools",
      label: "Tools you use (XCAL, iBwave, ATOLL, PIM/sweep, fiber, other)",
      type: "textarea",
      required: true,
    },
    travel,
  ],
};

export function screenersForService(line: ServiceLine): Screener[] {
  return screenersBySlug[serviceSlug(line)];
}

export function screenersForKey(key: ServiceSlug | "general"): Screener[] {
  return screenersBySlug[key];
}
