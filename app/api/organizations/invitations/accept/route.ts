import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { acceptOrganizationInvitation, OrganizationError } from "@/lib/organizations"

export const POST = async (req: Request) => {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await req.json().catch(() => null)
  const token = String(payload?.token ?? "").trim()

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 })
  }

  try {
    const result = await acceptOrganizationInvitation({
      token,
      userId: session.user.id,
    })

    return NextResponse.json(
      {
        message: "Invitation accepted",
        organization: result.organization,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof OrganizationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
