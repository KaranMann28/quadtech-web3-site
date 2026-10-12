/**
 * Facts confirmed for publication.
 * Anything else is commented and must not be rendered.
 */
export const company = {
  legalName: "Quad Tech Solutions Inc.",
  shortName: "Quad Tech Solutions",
  founded: 2012,
  offices: [
    {
      city: "Baltimore",
      region: "MD",
      regionName: "Maryland",
      country: "US" as const,
      countryName: "United States",
    },
    {
      city: "Mississauga",
      region: "ON",
      regionName: "Ontario",
      country: "CA" as const,
      countryName: "Canada",
    },
  ],
  teams: ["California", "Greater Toronto Area", "Montreal", "Calgary"],
  markets: ["United States", "Canada"],
} as const;

// TODO [CONFIRM] Street address previously published for Baltimore: 7677 Canton Center Drive, Baltimore MD 21224
// TODO [CONFIRM] Street address previously published for Mississauga: 165 Dundas Street West, Mississauga, Ontario L5B 2N6, Canada
// TODO [CONFIRM] General inbox. Previously published as info@quadtechsolutions.com — unconfirmed.
// TODO [CONFIRM] Previously published us@quadtechsolutions.com and ca@quadtechsolutions.com — unconfirmed.
// Careers inbox confirmed: HR@quadtechsolutions.com. Set APPLY_TO_EMAIL.
// TODO [CONFIRM] Phone numbers. The previous site showed placeholder telephone numbers. They are not published.
// TODO [CONFIRM] Business hours and response-time claims from the old contact page. Removed until confirmed.
// TODO [CONFIRM] Social profile URLs. The old footer linked Facebook, LinkedIn, and X to /#. Removed until confirmed.
// TODO [CONFIRM] Newsletter provider. The old subscribe form had no backend and was removed.
// TODO [CONFIRM] Mail provider for applications (APPLY_SMTP_* or a hosted provider).
// TODO [CONFIRM] Virus-scanning provider for résumé uploads. Type and size checks run now; a malware scanner is not connected.
// TODO [CONFIRM] Public equipment list and rates for Equipment Rental.
// TODO [CONFIRM] Case studies per industry. Slots exist in code comments on industry pages. Do not add client names.
