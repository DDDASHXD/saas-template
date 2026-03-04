import { NextResponse } from "next/server"

import { siteConfig } from "@/config"
import { sendEmailOtpCode } from "@/lib/auth-emails"
import { createEmailOtp } from "@/lib/auth-tokens"
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation"
import { isResendConfigured } from "@/lib/email"
import { getDb } from "@/lib/mongodb"

export const POST = async (req: Request) => {
  try {
    if (siteConfig.auth.genericLoginType !== "emailOTP") {
      return NextResponse.json(
        { error: "Email OTP login is disabled" },
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

    if (siteConfig.auth.disableRegistration) {
      const db = await getDb()
      const existingUser = await db.collection("users").findOne({ email: normalizedEmail })

      if (!existingUser) {
        return NextResponse.json(
          { error: "sorry, registration is currently disabled." },
          { status: 403 }
        )
      }
    }

    const otp = await createEmailOtp(normalizedEmail)
    await sendEmailOtpCode({
      email: normalizedEmail,
      otp,
    })

    return NextResponse.json(
      { message: "A sign-in code has been sent to your email." },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
