# Admin Microsoft Entra sign-in

Quad administrators open `/admin` and sign in with Microsoft Entra ID (Microsoft 365), single tenant. Email magic link is only the fallback (`AUTH_PROVIDER=email`).

App registration: **QuadTech Admin Portal**, accounts in this organizational directory only. Do not use `/common`.

## Redirect URIs

Register the app as **Web**. Auth.js uses `/api/auth/callback/microsoft-entra-id`.

| Environment | Redirect URI |
| --- | --- |
| Production domain | `https://quadtechsolutions.io/api/auth/callback/microsoft-entra-id` |
| Vercel project alias | `https://quadtech-web3-site-kams-projects-e9588e2f.vercel.app/api/auth/callback/microsoft-entra-id` |
| Local production-style server | `http://127.0.0.1:43124/api/auth/callback/microsoft-entra-id` |
| Local `next dev` | `http://127.0.0.1:3000/api/auth/callback/microsoft-entra-id` |

Unique preview URLs (`*-kams-projects-e9588e2f.vercel.app`) are behind Vercel SSO. Add a preview callback only if you will sign in on that host.

Front-channel logout URL (optional): `https://quadtechsolutions.io/admin/signin`

## Vercel environment variables

Set Entra secrets on **Production**, **Preview**, and **Development**. `AUTH_URL` is **Production only**.

| Name | Value |
| --- | --- |
| `AUTH_SECRET` | Long random string. Already set; rotate if it leaked. |
| `AUTH_URL` | `https://quadtechsolutions.io` — Production only. Preview must omit this so Auth.js infers the host (`trustHost: true`). |
| `AUTH_PROVIDER` | `entra` |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | Application (client) ID |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | Client secret **Value** |
| `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID` | Directory (tenant) ID |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | `https://login.microsoftonline.com/<tenant>/v2.0` (never `/common`) |
| `ADMIN_UPNS` | `karan.mann@quadtechsolutions.com` (comma-separated if more admins are added) |

Ignore Neon Auth (`NEON_AUTH_BASE_URL`, `VITE_NEON_AUTH_URL`).

## Email fallback

Set `AUTH_PROVIDER=email` only if the app registration is blocked. Magic links use `APPLY_SMTP_*` and the same `ADMIN_UPNS` list. `APPLY_SMTP_HOST=json` is local only.

## First sign-in (Karan)

1. Confirm the Entra app has the two production redirect URIs above.
2. Open [https://quadtechsolutions.io/admin](https://quadtechsolutions.io/admin).
3. Sign in with `karan.mann@quadtechsolutions.com`.
4. If Azure returns `AADSTS50011` (redirect URI), add the exact `redirect_uri` from the authorize URL to the app registration.
