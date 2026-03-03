import { siteConfig } from "@/config"
import { AuthActionEmail, OtpEmail } from "@/lib/auth-email-templates"
import { sendEmail } from "@/lib/email"
import { render } from "@react-email/render"
import { createElement } from "react"

const baseUrl = siteConfig.url.replace(/\/$/, "")

export const sendAccountConfirmationEmail = async ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  const confirmUrl = `${baseUrl}/api/auth/confirm-email?token=${encodeURIComponent(token)}`
  const html = await render(
    createElement(AuthActionEmail, {
      previewText: `Confirm your ${siteConfig.name} account`,
      title: "Confirm your email address",
      message: "Thanks for signing up. Confirm your email address to activate your account.",
      buttonLabel: "Confirm email address",
      buttonUrl: confirmUrl,
      expiryText: "This link expires in 24 hours.",
    })
  )

  await sendEmail({
    to: email,
    subject: `Confirm your ${siteConfig.name} account`,
    html,
    text: [
      `Confirm your ${siteConfig.name} account`,
      "Confirm your email address to activate your account.",
      `Confirm email address: ${confirmUrl}`,
      "This link expires in 24 hours.",
    ].join("\n\n"),
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
  const html = await render(
    createElement(AuthActionEmail, {
      previewText: `Reset your ${siteConfig.name} password`,
      title: "Reset your password",
      message:
        "We received a request to reset your password. Use the button below to choose a new password.",
      buttonLabel: "Reset password",
      buttonUrl: resetUrl,
      expiryText: "This link expires in 1 hour.",
      safetyText: "If you did not request this, you can ignore this email.",
    })
  )

  await sendEmail({
    to: email,
    subject: `Reset your ${siteConfig.name} password`,
    html,
    text: [
      `Reset your ${siteConfig.name} password`,
      "We received a request to reset your password.",
      `Reset password: ${resetUrl}`,
      "This link expires in 1 hour.",
      "If you did not request this, you can ignore this email.",
    ].join("\n\n"),
  })
}

export const sendEmailOtpCode = async ({
  email,
  otp,
}: {
  email: string
  otp: string
}) => {
  const html = await render(createElement(OtpEmail, { otp }))

  await sendEmail({
    to: email,
    subject: `Your ${siteConfig.name} sign-in code`,
    html,
    text: [
      `Your ${siteConfig.name} sign-in code`,
      `Code: ${otp}`,
      "This code expires in 10 minutes.",
      "Never share this code with anyone.",
    ].join("\n\n"),
  })
}
