# Contractor portal — phase 2

`/portal` is a public “coming soon” page. It is not in the main navigation, it is not indexed, and it does not authenticate anyone. Do not build sign-in in phase 1.

The later area is for contractors who already have an assignment:

- Onboarding documents
- Timesheets
- Assignment status

## Auth decision still open

Pick one before writing login code. Both options assume Quad does not store passwords.

### Microsoft Entra ID

Choose this if contractors will be guest users in the Quad tenant, or if IT already manages access there.

- Company devices, conditional access, and group membership can mark someone as a contractor.
- Setup is an app registration, redirect URLs, and a claim or group for portal access.
- People who are not in the tenant cannot sign in until someone invites them.

### Email magic link

Choose this if contractors should sign in with the email they used on the application, without a tenant account.

- A mail provider has to exist first. Application email is still `TODO [CONFIRM]` (`APPLY_SMTP_*` / `APPLY_TO_EMAIL`).
- Phase 1 has no database. Magic links need a session store (or a hosted auth product) chosen at the same time. Do not put sessions or résumés in git.
- The same careers inbox should not be the only place assignment data lives.

## After the choice

- Keep résumé delivery on the phase 1 path: email plus the optional Zapier catch hook for Teams and SharePoint.
- Assignment records and timesheets belong in that external system, not in this repository.
- Do not add a password form.
