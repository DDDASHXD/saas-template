import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  OrganizationError,
  getCurrentOrganizationStateForUser,
  switchCurrentOrganization,
  updateCurrentOrganization,
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
      case "invalid_invitation":
      case "invitation_expired":
      case "invitation_revoked":
      case "email_mismatch":
      case "already_member":
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

    const current = await getCurrentOrganizationStateForUser(session.user.id)

    return NextResponse.json(current, { status: 200 })
  } catch (error) {
    return handleOrganizationError(error)
  }
}

export const PATCH = async (req: Request) => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await req.json().catch(() => null)

    if (typeof payload?.organizationId === "string" && payload.organizationId.trim()) {
      await switchCurrentOrganization({
        userId: session.user.id,
        organizationId: payload.organizationId,
      })
    } else {
      const hasName = typeof payload?.name === "string"
      const hasSlug = typeof payload?.slug === "string"

      if (!hasName && !hasSlug) {
        return NextResponse.json(
          { error: "organizationId, name, or slug is required" },
          { status: 400 }
        )
      }

      await updateCurrentOrganization({
        userId: session.user.id,
        ...(hasName ? { name: payload.name } : {}),
        ...(hasSlug ? { slug: payload.slug } : {}),
      })
    }

    const current = await getCurrentOrganizationStateForUser(session.user.id)

    return NextResponse.json(current, { status: 200 })
  } catch (error) {
    return handleOrganizationError(error)
  }
}
