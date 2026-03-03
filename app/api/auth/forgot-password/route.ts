import { NextResponse } from "next/server"

import { siteConfig } from "@/config"
import { sendPasswordResetEmail } from "@/lib/auth-emails"
import { createPasswordResetToken } from "@/lib/auth-tokens"
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation"
import { isResendConfigured } from "@/lib/email"
import { getDb } from "@/lib/mongodb"

const FORGOT_PASSWORD_RESPONSE = {
  message: "If an account with that email exists, a reset link has been sent.",
}

export const POST = async (req: Request) => {
  try {
    if (siteConfig.auth.genericLoginType !== "emailAndPassword") {
      return NextResponse.json(
        { error: "Password reset is only available for email/password login" },
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

    if (!user || !user.password) {
      return NextResponse.json(FORGOT_PASSWORD_RESPONSE, { status: 200 })
    }

    const token = await createPasswordResetToken(normalizedEmail)
    try {
      await sendPasswordResetEmail({
        email: normalizedEmail,
        token,
      })
    } catch (error) {
      // Do not fail the request for delivery/provider issues.
      console.error("Failed to send password reset email", error)
    }

    return NextResponse.json(FORGOT_PASSWORD_RESPONSE, { status: 200 })
  } catch (error) {
    console.error("Forgot password route failed", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
