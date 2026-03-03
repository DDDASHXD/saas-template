import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { siteConfig } from "@/config"
import { consumeEmailLinkToken } from "@/lib/auth-tokens"
import { getDb } from "@/lib/mongodb"

export const POST = async (req: Request) => {
  try {
    if (siteConfig.auth.genericLoginType !== "emailAndPassword") {
      return NextResponse.json(
        { error: "Password reset is only available for email/password login" },
        { status: 400 }
      )
    }

    const { token, password } = await req.json()

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "A valid reset token is required" },
        { status: 400 }
      )
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const email = await consumeEmailLinkToken({
      type: "passwordReset",
      token,
    })

    if (!email) {
      return NextResponse.json(
        { error: "Reset link is invalid or has expired" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const hashedPassword = await bcrypt.hash(password, 10)

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
