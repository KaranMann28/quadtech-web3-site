# Deployment Guide

## Custom domain (Vercel)

1. Purchase the domain in the Vercel dashboard: [Search quadtechsolutions.io](https://vercel.com/domains/search?q=quadtechsolutions.io) (price shown at checkout; verify current pricing there).
2. In your Vercel project, open **Settings → Domains** and add `quadtechsolutions.io` and `www.quadtechsolutions.io` if you use both.
3. Vercel provisions DNS and SSL automatically for domains bought through Vercel.

### Microsoft 365 and the website domain

- **Website only on `.io`:** No change to Microsoft 365 is required. The contact form sends mail **to** your existing Microsoft inbox via Resend (see below).
- **Mailboxes at `@quadtechsolutions.io`:** Add the domain in [Microsoft 365 admin center](https://admin.microsoft.com) → **Settings → Domains**, then copy the required **MX**, **TXT (SPF)**, **DKIM**, and **Autodiscover** records into **Vercel → Domains → your domain → DNS**. Microsoft’s wizard lists exact values.

---

## Environment variables

### Production (Vercel)

In **Project → Settings → Environment Variables**, add each variable for **Production**, **Preview**, and **Development** as needed:

| Name | Purpose |
|------|---------|
| `GEMINI_API_KEY` | Powers the AI chatbot (`/api/chat`). |
| `RESEND_API_KEY` | Sends contact form email via [Resend](https://resend.com). Create a free account and an API key. |
| `CONTACT_EMAIL` | **Microsoft 365 (or any) inbox** that receives contact form submissions — e.g. `info@quadtechsolutions.com` or your work email. |
| `RESEND_FROM` | *(Optional)* Verified sender, e.g. `QuadTech Solutions <noreply@your-verified-domain.com>`. Until you verify a domain in Resend, omit this; the default `QuadTech Solutions <onboarding@resend.dev>` is used for testing. |

After changing variables, trigger a **Redeploy** so serverless functions pick up new values.

### Local development

Create `.env.local` in the project root (never commit it):

```bash
GEMINI_API_KEY=your_gemini_key
RESEND_API_KEY=your_resend_key
CONTACT_EMAIL=you@yourcompany.com
# Optional after verifying a domain in Resend:
# RESEND_FROM="QuadTech Solutions <noreply@yourdomain.com>"
```

---

## AI chatbot (Gemini)

### Get an API key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key into `GEMINI_API_KEY` in Vercel or `.env.local`

### Troubleshooting

If the chatbot shows a generic error:

- `GEMINI_API_KEY` is missing or invalid in Vercel
- Network issue reaching Google’s API
- Check **Functions** logs in the Vercel deployment

---

## Contact form email (Resend → Microsoft 365)

The contact form posts to `/api/contact`, which uses Resend to deliver email **to** `CONTACT_EMAIL`. Set `CONTACT_EMAIL` to the Outlook / Microsoft 365 mailbox where your team reads inquiries.

1. Sign up at [resend.com](https://resend.com) and create an API key.
2. Add `RESEND_API_KEY` and `CONTACT_EMAIL` in Vercel (and redeploy).
3. Submit the contact form on the live site and confirm delivery in Outlook.

When you verify your domain in Resend, optionally set `RESEND_FROM` for branded sender addresses.

---

## Security notes

- Never commit API keys.
- Use environment variables only.
- Rotate keys periodically.

## References

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google AI Studio](https://ai.google.dev/docs)
- [Resend Docs](https://resend.com/docs)
