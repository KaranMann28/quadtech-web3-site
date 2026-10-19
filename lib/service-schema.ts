import { company } from "@/lib/company";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export type ServiceSchemaInput = {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
};

/** schema.org Service JSON-LD for a public service page. */
export function serviceJsonLd({ name, description, path, serviceType }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType ?? name,
    url: `${SITE_URL}${path}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: company.markets.map((market) => ({
      "@type": "Country",
      name: market,
    })),
  };
}

export function serviceCatalogJsonLd(
  services: Array<{ name: string; description: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Telecom engineering and field services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: serviceJsonLd(service),
    })),
  };
}
