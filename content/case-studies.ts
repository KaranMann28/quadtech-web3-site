/**
 * Anonymized case-study templates for /work.
 *
 * Do not invent client names, numbers, metrics, certifications, or testimonials.
 * A write-up is published only after the owner confirms the facts and the client
 * consents to an anonymized description.
 */

export type CaseStudy = {
  slug: string;
  title: string;
  /** Buyer category, not a client name. Example: "Municipal public safety". */
  sector: string;
  year?: number;
  challenge: string;
  approach: string;
  /** Qualitative only. No percentages, traffic figures, or invented KPIs. */
  outcome: string;
};

/**
 * Published case studies rendered on /work.
 * Keep this array empty until a consented, fact-checked write-up exists.
 */
export const caseStudies: CaseStudy[] = [];

/*
  EXAMPLE — not rendered in production. Do not copy this object into
  `caseStudies` until Karan confirms the facts and the client consents.

  {
    slug: "anonymized-in-building-coverage",
    title: "In-building coverage design and walk-test validation",
    sector: "Enterprise venue",
    year: 2024,
    challenge:
      "A multi-floor building needed a designed indoor system and a measured check before acceptance.",
    approach:
      "iBwave design, followed by walk testing and commissioning against the project's written criteria.",
    outcome:
      "The project closed on the agreed acceptance criteria. No metrics are published here.",
  }
*/
