# Jobs

This folder is seed history. It is superseded by the admin UI at `/admin/jobs`.

To post a job, sign in at `/admin` and use **Create post**. JSON files here are imported once by `jobId` and are not overwritten on later runs.

The two Phase 1 field/RF files stay drafts. `project-administrator-contractor.json` (`QT-JOB-2026-003`) is the first published contractor role.

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

`location.country` is a single `US` or `CA` value. If the role is open in both countries, set `workCountries` to `["US", "CA"]`. The board country filter matches either value. Say which currency applies in `payRange.currency` (`USD` or `CAD`).

## Seed files

Two draft roles are checked in so the shape is real. They stay drafts until the owner confirms pay, dates, and opening status:

- `field-test-engineer-drive-walk-xcal.json` — `QT-JOB-2026-001` (draft)
- `rf-design-engineer-ibwave-atoll.json` — `QT-JOB-2026-002` (draft)
- `project-administrator-contractor.json` — `QT-JOB-2026-003` (published). Schema defaults: Remote / Canada / CA, Contract, Project Management, industry `wireless-carriers-oems`. Pay and duration omitted.
