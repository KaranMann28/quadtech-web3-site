# Deployment

Live production is the Vercel project **quadtech-web3-site** (`prj_nezJGcFXWd2ZFy9HG9I9fjTpLOE6`), domain [https://quadtechsolutions.io](https://quadtechsolutions.io). Team slug `kams-projects-e9588e2f`.

The GitHub default / Vercel Git production branch is **`feature/ai-chatbot`**. That branch still held the older Pages Router marketing site when this portal was first deployed by uploading source to Vercel. Merging the older branch over production **will wipe** `/careers` and `/admin`. Land portal work through a pull request into `feature/ai-chatbot`, then merge only after the PR is the portal tree (not the old chatbot) and the build is green.

Do not create paid stores. Neon Hobby (`quadtech-portal`, iad1) is attached via the Vercel Marketplace.

## Source of truth

- App Router site in this repository: marketing pages, `/careers`, `/admin`, apply APIs.
- Contact form: Resend when `RESEND_API_KEY` is set (same pattern as the previous GitHub site), otherwise `APPLY_SMTP_*`.
- Applications are written to Neon first. HR email is sent when `APPLY_SMTP_*` or `RESEND_API_KEY` is set. Missing mail config no longer blocks the inbox row.
- The Gemini chatbot from the previous Pages Router site is ported as `components/ai-chatbot.tsx` plus `app/api/chat/route.ts` (REST call, no SDK). It reads `GEMINI_API_KEY` (already set on the Vercel project) and optional `GEMINI_MODEL` (default `gemini-flash-latest`; the old `gemini-1.5-flash` is retired). The prompt states only the confirmed facts in `lib/company.ts` and `lib/services.ts` and points visitors at `/contact` — the old prompt's placeholder phone number and unconfirmed inbox were dropped.
- Ignore Neon Auth vars (`NEON_AUTH_BASE_URL`, `VITE_NEON_AUTH_URL`). Admin sign-in is Entra via Auth.js.

## Postgres (Neon)

Production must use Postgres. `scripts/prepare-database.mjs` fails the Vercel build if no `postgres://` / `postgresql://` URL exists. Runtime (`lib/db.ts`) prefers `POSTGRES_PRISMA_URL`, then `POSTGRES_URL`, then `DATABASE_URL` only if it is Postgres. A leftover `file:` value is ignored. SQLite is local-only.

Marketplace store **quadtech-portal** already injected:

- `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED`
- `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_PRISMA_URL`
- host/user/password names and `NEON_PROJECT_ID`

Build: `prisma migrate deploy` on `prisma/postgres` plus `import-jobs` (idempotent by `jobId`).

Local SQLite remains `DATABASE_URL="file:./data/portal.db"`. Do not point local `.env` at production Postgres.

## Contact (Microsoft 365 Graph, then Resend, then SMTP)

The contact form sends through Microsoft Graph when `GRAPH_MAIL_*` is set, otherwise Resend, otherwise `APPLY_SMTP_*`. Careers applications are unchanged (Resend or SMTP). Setup: [graph-mail-setup.md](graph-mail-setup.md).

| Name | Purpose |
| --- | --- |
| `GRAPH_MAIL_TENANT_ID` | Optional. Defaults to `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID` |
| `GRAPH_MAIL_CLIENT_ID` | Application (client) ID of the "QuadTech Website Mailer" Entra app |
| `GRAPH_MAIL_CLIENT_SECRET` | Client secret of that app (sensitive) |
| `GRAPH_MAIL_SENDER` | Mailbox the app sends as: `info@quadtechsolutions.com` (the only mailbox in its Exchange RBAC scope) |
| `RESEND_API_KEY` | Send contact form mail via Resend; also used for application mail when SMTP is unset |
| `RESEND_FROM` | Optional verified sender. Default is Resend’s onboarding address until the domain is verified |
| `CONTACT_EMAIL` or `CONTACT_TO_EMAIL` | Inbox that receives the contact message. Careers applications use `APPLY_TO_EMAIL=HR@quadtechsolutions.com` |

`info@quadtechsolutions.com` was on the old site and is still unconfirmed. Set the contact inbox explicitly.

## Admin Entra

See [ADMIN-ENTRA.md](ADMIN-ENTRA.md). `AUTH_URL` is Production only (`https://quadtechsolutions.io`). Preview omits it; Auth.js `trustHost` uses the request host.

## Seed jobs

`npm run import-jobs` is idempotent by `jobId`.

| ID | Status |
| --- | --- |
| `QT-JOB-2026-001` | Draft field test engineer |
| `QT-JOB-2026-002` | Draft RF design engineer |
| `QT-JOB-2026-003` | **Published** Project Administrator (Contractor) |
