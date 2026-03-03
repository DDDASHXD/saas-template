import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { encode, decode } from "next-auth/jwt"

import { auth } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { ensureUserHasOrganization } from "@/lib/organizations"

const getSessionCookieInfo = () => {
  const isSecure = process.env.NODE_ENV === "production"
  return {
    name: isSecure ? "__Secure-authjs.session-token" : "authjs.session-token",
    secure: isSecure,
  }
}

export const POST = async (req: Request) => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name } = await req.json()
    const normalizedName = String(name ?? "").trim()

    if (!normalizedName) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: { name: normalizedName, needsOnboarding: false },
      }
    )

    await ensureUserHasOrganization({
      userId: session.user.id,
      name: normalizedName,
      email: session.user.email ?? undefined,
    })

    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? ""
    const { name: cookieName, secure } = getSessionCookieInfo()
    const cookieStore = await cookies()
    const currentToken = cookieStore.get(cookieName)?.value

    const response = NextResponse.json({ message: "Onboarding complete" }, { status: 200 })

    if (currentToken && secret) {
      const decoded = await decode({ token: currentToken, secret, salt: cookieName })

      if (decoded) {
        decoded.needsOnboarding = false
        decoded.name = normalizedName

        const newToken = await encode({ token: decoded, secret, salt: cookieName })

        response.cookies.set(cookieName, newToken, {
          httpOnly: true,
          sameSite: "lax",
          secure,
          path: "/",
        })
      }
    }

    return response
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
