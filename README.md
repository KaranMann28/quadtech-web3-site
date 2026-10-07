# Quad Tech Solutions

Website for Quad Tech Solutions Inc., a telecom and IT infrastructure engineering company founded in 2012. Offices in Baltimore, Maryland and Mississauga, Ontario. Field and engineering teams in California, the Greater Toronto Area, Montreal, and Calgary.

This app includes the public marketing pages, an industries section, and a contractor careers board with résumé applications.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Other commands:

```bash
npm test
npm run lint
npm run build
```

Copy `.env.example` to `.env`. Local SQLite is `DATABASE_URL="file:./data/portal.db"`. Production on Vercel uses Neon Postgres; a leftover `file:` URL is ignored when any `postgres://` URL is present.

Applications are stored in the database even when SMTP is not set. HR email is sent when `APPLY_SMTP_*` or `RESEND_API_KEY` is configured. Résumés go to `data/resumes/` locally, to the Application row on Vercel, or to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.

```bash
npx prisma migrate deploy
npm run import-jobs
```

`import-jobs` loads `content/jobs/*.json` into the database. Run it once. A second run skips job IDs that already exist.

Admin sign-in is documented in [docs/admin-auth-setup.md](docs/admin-auth-setup.md). `/admin` is not linked in the public nav.

`APPLY_SMTP_HOST=json` writes the message through Nodemailer’s JSON transport instead of a real server. That mode is refused when `NODE_ENV` is `production` unless `AUTH_URL` is a loopback address.

If `ZAPIER_HOOK_URL` is set, a successful application is also POSTed as JSON. The résumé is base64 only when that encoding is 5 MB or smaller. A webhook failure is logged and does not fail the submission.

## Post a job

See [content/jobs/README.md](content/jobs/README.md). Roles with `draft: true` are validated at build time and are not shown, linked, or open for applications.

## Routes

| Path | Purpose |
| --- | --- |
| `/` `/about` `/services` `/why-us` `/contact` | Existing public pages |
| `/industries` and `/industries/[slug]` | Six customer categories |
| `/careers` | Job board. Filters sync to the query string. |
| `/careers/[slug]` | Role detail and application |
| `/careers/talent-network` | General application |
| `/careers/thanks` | Confirmation after a successful submit |
| `/admin` | Job posts and applications. Requires an allowlisted admin sign-in. |
| `/portal` | Coming soon. Not linked in the nav. See [docs/portal-phase2.md](docs/portal-phase2.md). |
| `/blog` and `/resources/*` | Kept so older links resolve. No material is published. |

## Before launch

Every item below is marked `TODO [CONFIRM]` in the source. Do not publish a role, a street address, a phone number, or a mailbox until the owner confirms it.

- Street addresses for Baltimore, MD and Mississauga, ON
- SMTP for the confirmed careers inbox `HR@quadtechsolutions.com` (`APPLY_TO_EMAIL` and `APPLY_SMTP_*`)
- Hosted Postgres (`POSTGRES_URL`). Do not keep production admin on SQLite. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
- Admin list (`ADMIN_UPNS`)
- Entra app registration ([docs/ADMIN-ENTRA.md](docs/ADMIN-ENTRA.md))
- Résumé storage (local `data/resumes/` or private Vercel Blob)
- Public contact inbox (`CONTACT_TO_EMAIL`)
- SMTP or other mail provider (`APPLY_SMTP_*`)
- Optional Zapier catch hook (`ZAPIER_HOOK_URL`) for Teams and SharePoint
- Virus-scanning provider for résumés (type and size are checked today)
- Phone numbers
- Business hours and any response-time commitment
- Social profile URLs
- Newsletter, if one is wanted
- Equipment rental catalog and rates
- Case studies (no client names on public pages)
- Whether `/blog` and `/resources/*` should remain
- The two draft roles: pay, currency (USD or CAD), dates, duration, certification level, service line, and permission to set `draft` to `false`
- Portal auth: Microsoft Entra ID or email magic link ([docs/portal-phase2.md](docs/portal-phase2.md))
