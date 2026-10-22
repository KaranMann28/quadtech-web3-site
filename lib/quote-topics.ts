/**
 * Contact-form topic keys used by "Request a quote" links.
 * Prefill is client-side only (`?topic=`). Server contact handling is unchanged.
 */
export const QUOTE_TOPICS = [
  "rf-design",
  "field-testing",
  "das",
  "public-safety",
  "sweep-pim-fiber",
  "project-management",
  "staffing",
  "capabilities",
] as const;

export type QuoteTopic = (typeof QUOTE_TOPICS)[number];

const TOPIC_SET = new Set<string>(QUOTE_TOPICS);

export function isQuoteTopic(value: string | null | undefined): value is QuoteTopic {
  return Boolean(value && TOPIC_SET.has(value));
}

export function quoteHref(topic: QuoteTopic): string {
  return `/contact?topic=${topic}`;
}

const DRAFTS: Record<QuoteTopic, string> = {
  "rf-design":
    "I would like a quote for RF design and optimization.\n\nSite or market:\nTechnology / bands:\nTimeline:\n",
  "field-testing":
    "I would like a quote for drive, walk, or CW field testing.\n\nSite or market:\nTest type:\nTimeline:\n",
  das: "I would like a quote for in-building DAS design or commissioning.\n\nBuilding type:\nCarriers / bands if known:\nTimeline:\n",
  "public-safety":
    "I would like a quote for in-building public-safety radio (ERRCS) testing or commissioning.\n\nBuilding / municipality:\nAuthority or code reference if known:\nTimeline:\n",
  "sweep-pim-fiber":
    "I would like a quote for sweep, PIM, or fiber testing.\n\nSite type:\nScope:\nTimeline:\n",
  "project-management":
    "I would like a quote for telecom project management or project administration.\n\nProgram type:\nLocations:\nTimeline:\n",
  staffing:
    "I would like to discuss staff augmentation, including engineering, field, or Salesforce delivery roles.\n\nRoles needed:\nLocation:\nTimeline:\n",
  capabilities:
    "I would like to discuss a telecom engineering or field-services engagement. I reviewed the capabilities one-pager.\n\nScope:\nTimeline:\n",
};

/** Empty string when the query param is missing or unknown. */
export function messageForTopic(topic: string | null | undefined): string {
  if (!isQuoteTopic(topic)) return "";
  return DRAFTS[topic];
}

export function topicLabel(topic: QuoteTopic): string {
  switch (topic) {
    case "rf-design":
      return "RF design and optimization";
    case "field-testing":
      return "Drive, walk, and CW testing";
    case "das":
      return "In-building DAS";
    case "public-safety":
      return "Public-safety radio (ERRCS)";
    case "sweep-pim-fiber":
      return "Sweep, PIM, and fiber testing";
    case "project-management":
      return "Project management and administration";
    case "staffing":
      return "Staff augmentation";
    case "capabilities":
      return "Capabilities inquiry";
  }
}
