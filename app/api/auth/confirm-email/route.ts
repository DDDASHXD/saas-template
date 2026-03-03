import { NextResponse } from "next/server"

import { consumeEmailLinkToken } from "@/lib/auth-tokens"
import { getDb } from "@/lib/mongodb"

export const GET = async (req: Request) => {
  const { searchParams, origin } = new URL(req.url)
  const token = searchParams.get("token")?.trim()

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid_confirmation_token", origin))
  }

  try {
    const email = await consumeEmailLinkToken({
      type: "emailConfirmation",
      token,
    })

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=invalid_confirmation_token", origin))
    }

    const db = await getDb()
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          emailVerified: new Date(),
        },
      }
    )

    return NextResponse.redirect(new URL("/login?confirmed=1", origin))
  } catch {
    return NextResponse.redirect(new URL("/login?error=confirmation_failed", origin))
  }
}
