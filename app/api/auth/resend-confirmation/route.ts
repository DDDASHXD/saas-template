import { NextResponse } from "next/server"

import { siteConfig } from "@/config"
import { sendAccountConfirmationEmail } from "@/lib/auth-emails"
import { createEmailConfirmationToken } from "@/lib/auth-tokens"
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation"
import { isResendConfigured } from "@/lib/email"
import { getDb } from "@/lib/mongodb"

export const POST = async (req: Request) => {
  try {
    if (!siteConfig.auth.requireEmailConfirmation) {
      return NextResponse.json(
        { error: "Email confirmation is disabled" },
        { status: 400 }
      )
    }

    if (!isResendConfigured()) {
      return NextResponse.json(
        { error: "RESEND_API_KEY environment variable is not set" },
        { status: 503 }
      )
    }

    const { email } = await req.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)
    const db = await getDb()
    const user = await db.collection("users").findOne({ email: normalizedEmail })

    if (!user || user.emailVerified) {
      return NextResponse.json(
        { message: "If your account needs confirmation, a new email has been sent." },
        { status: 200 }
      )
    }

    const token = await createEmailConfirmationToken(normalizedEmail)
    await sendAccountConfirmationEmail({
      email: normalizedEmail,
      token,
    })

    return NextResponse.json(
      { message: "If your account needs confirmation, a new email has been sent." },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
