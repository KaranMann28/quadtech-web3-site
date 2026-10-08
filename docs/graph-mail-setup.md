# Contact form mail via Microsoft 365 (Graph)

`lib/mail/graph.ts` sends the contact form with Microsoft Graph `POST /users/{GRAPH_MAIL_SENDER}/sendMail`
using an app-only token (client credentials, scope `https://graph.microsoft.com/.default`). The token is cached in
memory until 5 minutes before it expires. `saveToSentItems` is on, and Reply-To is the visitor.

Order: Graph if `GRAPH_MAIL_CLIENT_ID`, `GRAPH_MAIL_CLIENT_SECRET`, `GRAPH_MAIL_SENDER` and a tenant
(`GRAPH_MAIL_TENANT_ID`, else `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID`) are set; then Resend; then SMTP.
Recipient: `CONTACT_TO_EMAIL`, else `CONTACT_EMAIL`, else the sender mailbox. Careers mail is unchanged.

Failures are logged with HTTP status, Graph error code, request-id (or AADSTS codes for token errors), never the
secret or token. One retry on 401 (fresh token) and on 429/503/504 when Retry-After is 3 s or less.

## Entra / Exchange

App registration **QuadTech Website Mailer**, single tenant, **no API permissions in Entra**. Exchange Online
RBAC for Applications grants `Application Mail.Send` with a management scope that matches only
`info@quadtechsolutions.com`. Do not add Graph `Mail.Send` in Entra: Entra grants are unscoped and would let the app
send as anyone. Check with `Test-ServicePrincipalAuthorization -Identity "QuadTech Website Mailer" -Resource <mailbox>`.
