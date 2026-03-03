import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { sendOrganizationInvitationEmail } from "@/lib/auth-emails"
import { isResendConfigured } from "@/lib/email"
import { createNotification, type NotificationAction } from "@/lib/notifications"
import {
  OrganizationError,
  getCurrentOrganizationStateForUser,
  inviteUserToCurrentOrganization,
  revokeInvitationFromCurrentOrganization,
  type OrganizationRole,
} from "@/lib/organizations"
import { getInvitableRoleIds } from "@/roles"

const VALID_ROLES = getInvitableRoleIds()

const parseEmails = (value: unknown) => {
  if (typeof value === "string") {
    return value
      .split(/[\n,;]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(Boolean)
  }

  return []
}

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

    const state = await getCurrentOrganizationStateForUser(session.user.id)

    return NextResponse.json(
      {
        role: state.role,
        members: state.members,
        invitations: state.invitations,
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
    const emails = [...new Set(parseEmails(payload?.emails))]
    const requestedRole = String(payload?.role ?? "").trim()
    const fallbackRole = VALID_ROLES[0] ?? "member"
    const matchedRole = VALID_ROLES.find((roleId) => roleId === requestedRole)
    const role: OrganizationRole = matchedRole ?? fallbackRole
    const shouldSendEmail = isResendConfigured()

    if (emails.length === 0) {
      return NextResponse.json({ error: "At least one email is required" }, { status: 400 })
    }

    const invited: string[] = []
    const failed: { email: string; error: string }[] = []

    for (const email of emails) {
      try {
        const invitation = await inviteUserToCurrentOrganization({
          userId: session.user.id,
          email,
          role,
        })

        if (invitation.invitedUserId) {
          const actions: NotificationAction[] = [
            {
              kind: "alert_dialog",
              title: "Accept invitation",
              description: `${invitation.invitation.invitedByName ?? "A teammate"} invited you to join ${invitation.organization.name} as ${role}.`,
              confirmLabel: "Accept invitation",
              cancelLabel: "Not now",
              confirmAction: {
                kind: "accept_invitation",
                token: invitation.token,
              },
            },
          ]

          await createNotification({
            type: "organization.invitation",
            title: `Invitation to ${invitation.organization.name}`,
            body: `${invitation.invitation.invitedByName ?? "A teammate"} invited you to join ${invitation.organization.name}.`,
            data: {
              invitationId: invitation.invitation.id,
              organizationId: invitation.organization.id,
              organizationName: invitation.organization.name,
              organizationSlug: invitation.organization.slug,
              role,
              token: invitation.token,
            },
            actions,
            recipientUserIds: [invitation.invitedUserId],
          })
        }

        if (shouldSendEmail) {
          await sendOrganizationInvitationEmail({
            email,
            inviterName: invitation.invitation.invitedByName ?? "A teammate",
            organizationName: invitation.organization.name,
            token: invitation.token,
          })
        }

        invited.push(email)
      } catch (error) {
        const message =
          error instanceof OrganizationError
            ? error.message
            : "Could not create invitation"

        failed.push({
          email,
          error: message,
        })
      }
    }

    const state = await getCurrentOrganizationStateForUser(session.user.id)

    return NextResponse.json(
      {
        invited,
        failed,
        role: state.role,
        members: state.members,
        invitations: state.invitations,
      },
      { status: invited.length > 0 ? 200 : 400 }
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
    const invitationId = String(payload?.invitationId ?? "").trim()

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId is required" }, { status: 400 })
    }

    await revokeInvitationFromCurrentOrganization({
      userId: session.user.id,
      invitationId,
    })

    const state = await getCurrentOrganizationStateForUser(session.user.id)

    return NextResponse.json(
      {
        role: state.role,
        members: state.members,
        invitations: state.invitations,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleOrganizationError(error)
  }
}
