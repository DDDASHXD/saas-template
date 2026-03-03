import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  OrganizationError,
  getCurrentOrganizationStateForUser,
  kickMemberFromCurrentOrganization,
  leaveCurrentOrganization,
  updateMemberRoleInCurrentOrganization,
} from "@/lib/organizations"
import { getRoleIds } from "@/roles"

const VALID_ROLES = getRoleIds()

const handleOrganizationError = (error: unknown) => {
  if (error instanceof OrganizationError) {
    switch (error.code) {
      case "forbidden":
      case "owner_required":
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
      case "last_owner":
      case "cannot_leave_home_org":
      case "cannot_remove_home_org":
      case "invalid_operation":
        return NextResponse.json({ error: error.message }, { status: 400 })
      default:
        return NextResponse.json({ error: error.message }, { status: 422 })
    }
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

export const PATCH = async (req: Request) => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await req.json().catch(() => null)
    const memberUserId = String(payload?.memberUserId ?? "").trim()
    const requestedRole = String(payload?.role ?? "").trim()
    const role = VALID_ROLES.find((roleId) => roleId === requestedRole)

    if (!memberUserId || !role) {
      return NextResponse.json(
        { error: "memberUserId and valid role are required" },
        { status: 400 }
      )
    }

    await updateMemberRoleInCurrentOrganization({
      userId: session.user.id,
      memberUserId,
      role,
    })

    const state = await getCurrentOrganizationStateForUser(session.user.id)

    return NextResponse.json(
      {
        role: state.role,
        members: state.members,
        invitations: state.invitations,
        isHomeForCurrentUser: state.isHomeForCurrentUser,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleOrganizationError(error)
  }
}

export const DELETE = async (req: Request) => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await req.json().catch(() => null)
    const memberUserId = String(payload?.memberUserId ?? "").trim()

    if (memberUserId && memberUserId !== session.user.id) {
      await kickMemberFromCurrentOrganization({
        userId: session.user.id,
        memberUserId,
      })
    } else {
      await leaveCurrentOrganization({
        userId: session.user.id,
      })
    }

    const state = await getCurrentOrganizationStateForUser(session.user.id)

    return NextResponse.json(
      {
        role: state.role,
        members: state.members,
        invitations: state.invitations,
        isHomeForCurrentUser: state.isHomeForCurrentUser,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleOrganizationError(error)
  }
}
