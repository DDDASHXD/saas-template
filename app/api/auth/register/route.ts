import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { siteConfig } from "@/config"
import { sendAccountConfirmationEmail } from "@/lib/auth-emails"
import { createEmailConfirmationToken } from "@/lib/auth-tokens"
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation"
import { isResendConfigured } from "@/lib/email"
import { getDb } from "@/lib/mongodb"
import { ensureUserHasOrganization } from "@/lib/organizations"

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json()

    if (
      siteConfig.auth.genericLoginType !== "emailAndPassword" ||
      siteConfig.auth.disableRegistration
    ) {
      return NextResponse.json(
        { error: "Registration is disabled" },
        { status: 400 }
      )
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const normalizedName = String(name).trim()
    if (!normalizedName) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)
    const db = await getDb()
    const existingUser = await db.collection("users").findOne({ email: normalizedEmail })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      )
    }

    if (siteConfig.auth.requireEmailConfirmation && !isResendConfigured()) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is required when requireEmailConfirmation is enabled" },
        { status: 503 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const now = new Date()
    const createdUser = await db.collection("users").insertOne({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: siteConfig.auth.requireEmailConfirmation ? null : now,
      needsOnboarding: false,
      createdAt: now,
      updatedAt: now,
    })

    await ensureUserHasOrganization({
      userId: createdUser.insertedId.toString(),
      name: normalizedName,
      email: normalizedEmail,
    })

    if (siteConfig.auth.requireEmailConfirmation) {
      try {
        const token = await createEmailConfirmationToken(normalizedEmail)
        await sendAccountConfirmationEmail({
          email: normalizedEmail,
          token,
        })
      } catch {
        return NextResponse.json(
          {
            error:
              "Account was created, but confirmation email could not be sent. Please use resend confirmation on the sign-in page.",
            accountCreated: true,
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          message: "User created. Please confirm your email before signing in.",
          requiresEmailConfirmation: true,
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      { message: "User created", requiresEmailConfirmation: false },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
