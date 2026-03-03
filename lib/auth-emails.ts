import { siteConfig } from "@/config"
import { sendEmail } from "@/lib/email"

const baseUrl = siteConfig.url.replace(/\/$/, "")

export const sendAccountConfirmationEmail = async ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  const confirmUrl = `${baseUrl}/api/auth/confirm-email?token=${encodeURIComponent(token)}`

  await sendEmail({
    to: email,
    subject: `Confirm your ${siteConfig.name} account`,
    html: `<p>Hi there,</p><p>Please confirm your email by clicking the link below:</p><p><a href="${confirmUrl}">Confirm email address</a></p><p>This link expires in 24 hours.</p>`,
    text: `Confirm your email for ${siteConfig.name}: ${confirmUrl} (expires in 24 hours).`,
  })
}

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`

  await sendEmail({
    to: email,
    subject: `Reset your ${siteConfig.name} password`,
    html: `<p>Hi there,</p><p>You requested a password reset.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>`,
    text: `Reset your ${siteConfig.name} password: ${resetUrl} (expires in 1 hour).`,
  })
}

export const sendEmailOtpCode = async ({
  email,
  otp,
}: {
  email: string
  otp: string
}) => {
  await sendEmail({
    to: email,
    subject: `Your ${siteConfig.name} sign-in code`,
    html: `<p>Use this one-time code to sign in:</p><p style="font-size: 24px; letter-spacing: 0.25em; font-weight: 600;">${otp}</p><p>This code expires in 10 minutes.</p>`,
    text: `Your ${siteConfig.name} sign-in code is ${otp}. It expires in 10 minutes.`,
  })
}
