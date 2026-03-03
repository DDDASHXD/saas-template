import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  OrganizationError,
  createOrganizationForUser,
  listUserOrganizations,
} from "@/lib/organizations"

const handleOrganizationError = (error: unknown) => {
  if (error instanceof OrganizationError) {
    switch (error.code) {
      case "forbidden":
        return NextResponse.json({ error: error.message }, { status: 403 })
      case "user_not_found":
      case "organization_not_found":
      case "invalid_id":
      case "invalid_name":
      case "slug_unavailable":
      case "invalid_email":
        return NextResponse.json({ error: error.message }, { status: 400 })
      default:
        return NextResponse.json({ error: error.message }, { status: 422 })
    }
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

export const GET = async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizations = await listUserOrganizations(session.user.id)

    return NextResponse.json(
      {
        organizations,
        currentOrganizationId: organizations.find((organization) => organization.isCurrent)?.id ?? null,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleOrganizationError(error)
  }
}

export const POST = async (req: Request) => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await req.json().catch(() => null)
    const name = String(payload?.name ?? "").trim()
    const slug = typeof payload?.slug === "string" ? payload.slug.trim() : undefined

    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 })
    }

    const organization = await createOrganizationForUser({
      userId: session.user.id,
      name,
      ...(slug ? { slug } : {}),
    })

    const organizations = await listUserOrganizations(session.user.id)

    return NextResponse.json(
      {
        organization,
        organizations,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleOrganizationError(error)
  }
}
