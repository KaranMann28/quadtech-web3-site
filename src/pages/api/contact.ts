import { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@quadtechsolutions.com'
const FROM =
  process.env.RESEND_FROM ||
  'QuadTech Solutions <onboarding@resend.dev>'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured.' })
  }

  try {
    const { name, email, phone, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    const safe = {
      name: escapeHtml(String(name)),
      email: escapeHtml(String(email)),
      phone: phone ? escapeHtml(String(phone)) : '',
      message: escapeHtml(String(message)),
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: CONTACT_EMAIL,
      replyTo: String(email),
      subject: `New contact: ${safe.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
            New contact form submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 100px;">Name</td>
              <td style="padding: 8px 12px;">${safe.name}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #555;">Email</td>
              <td style="padding: 8px 12px;"><a href="mailto:${safe.email}">${safe.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #555;">Phone</td>
              <td style="padding: 8px 12px;">${safe.phone || 'Not provided'}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background-color: #f5f5f5; border-radius: 8px;">
            <p style="font-weight: bold; color: #555; margin: 0 0 8px 0;">Message</p>
            <p style="color: #1a1a1a; margin: 0; white-space: pre-wrap;">${safe.message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Sent from the QuadTech Solutions website contact form
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email. Please try again.' })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Contact API Error:', error)
    res.status(500).json({
      error:
        'Something went wrong. Please try again or email us directly at info@quadtechsolutions.com.',
    })
  }
}
