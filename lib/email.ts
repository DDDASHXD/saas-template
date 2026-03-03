import { siteConfig } from "@/config"

const RESEND_API_URL = "https://api.resend.com/emails"
const RESEND_DEFAULT_FROM = `${siteConfig.name} <noreply@mail.skxv.dev>`

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text: string
}

export const isResendConfigured = () => Boolean(process.env.RESEND_API_KEY)

export const sendEmail = async ({ to, subject, html, text }: SendEmailOptions) => {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? RESEND_DEFAULT_FROM,
      to: [to],
      subject,
      html,
      text,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Resend request failed (${response.status}): ${errorBody}`)
  }
}
