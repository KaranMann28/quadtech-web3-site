# Jobs

This folder is seed history. It is superseded by the admin UI at `/admin/jobs`.

To post a job, sign in at `/admin` and use **Create post**. JSON files here are imported once by `jobId` and are not overwritten on later runs.

The two Phase 1 field/RF files stay drafts. `project-administrator-contractor.json` (`QT-JOB-2026-003`) is the first published contractor role, the three Salesforce roles (`QT-JOB-2026-004` to `006`) are published seeds from the October 2026 vendor list, and `QT-JOB-2026-007` is the published OpenShift/OpenStack infrastructure role.

## Post a job

1. Copy `_template.json` to a new file named after the slug, for example `field-test-engineer-drive-walk-xcal.json`.
2. Files that start with `_` are ignored. The template itself is never published.
3. Fill every field. `jobId` must match `QT-JOB-YYYY-NNN` and must never be reused, including for roles that were closed.
4. `slug` is kebab-case and unique.
5. `serviceLine` must be one of the names in `lib/taxonomy.ts`. `industry` must be one of the industry slugs.
6. Set `draft` to `false` only after pay, dates, location, and requirements are confirmed.
7. Remove every `TODO [CONFIRM]` string. The build rejects a public role that still contains one, and it rejects the placeholder posted date `2026-01-01`.
8. Merge the file. The careers board and `/careers/[slug]` are generated from published (`draft: false`) files only.

`draft: true` roles are validated at build time and are not rendered, linked, or open for applications.

## Dual-country remote roles

`location.country` is a `US`, `CA`, or `IN` value. If the role is open in more than one country, set `workCountries` to those codes. The board country filter matches either value. Say which currency applies in `payRange.currency` (`USD` or `CAD`).

## Work authorization country

`workAuthorizationCountry` is the country or countries named on the apply form's yes/no question. It is independent of `location.country`. Accept a single code or an array. Omit it to default to Canada so existing roles keep asking about Canada. Set `["CA", "IN"]` to ask about Canada or India.

## Seed files

Two draft roles are checked in so the shape is real. They stay drafts until the owner confirms pay, dates, and opening status:

- `field-test-engineer-drive-walk-xcal.json` — `QT-JOB-2026-001` (draft)
- `rf-design-engineer-ibwave-atoll.json` — `QT-JOB-2026-002` (draft)
- `project-administrator-contractor.json` — `QT-JOB-2026-003` (published). Schema defaults: Remote / Canada / CA, Contract, Project Management, industry `wireless-carriers-oems`. Pay and duration omitted.
- `senior-salesforce-functional-lead.json` — `QT-JOB-2026-004` (published, Toronto)
- `senior-salesforce-technical-lead.json` — `QT-JOB-2026-005` (published, Montreal or Toronto)
- `senior-bsa-data-migration-specialist-salesforce.json` — `QT-JOB-2026-006` (published, Montreal or Toronto)
- `senior-infrastructure-cloud-platform-engineer-openshift-openstack.json` — `QT-JOB-2026-007` (published, Hybrid Canada or India). `workAuthorizationCountry` is `["CA", "IN"]`. Client and supplier names are not in the public copy. Applications use the on-page form, not a personal inbox.

The three Salesforce seeds come from an October 2026 vendor referral list that named only titles, cities, and one opening each. Editorial defaults (Hybrid, Contract, industry `enterprise-venues`) and the generic descriptions are noted in each file's `internalNote` for the owner to adjust in `/admin`. Vendor referral rewards from that list are never published.
