"use client"

import * as React from "react"

import { useOrganizations } from "@/components/providers/organization-provider"
import { usePermission } from "@/hooks/use-permission"
import { useUser } from "@/hooks/use-user"
import type { OrganizationRole } from "@/lib/organizations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getRoleById, roles, type RoleId } from "@/roles"

const parseEmails = (value: string) =>
  value
    .split(/[\n,;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)

const statusClassNames: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  accepted: "bg-emerald-100 text-emerald-900",
  revoked: "bg-muted text-muted-foreground",
  expired: "bg-muted text-muted-foreground",
}

const OrganizationMembersPage = () => {
  const { id: currentUserId } = useUser()
  const canInvite = usePermission("organization.members.invite")
  const canUpdateMemberRoles = usePermission("organization.members.role.update")
  const canKickMembers = usePermission("organization.members.kick")
  const {
    isCurrentOrganizationHome,
    members,
    invitations,
    isMutating,
    inviteMembers,
    revokeInvitation,
    updateMemberRole,
    kickMember,
    leaveCurrentOrganization,
  } = useOrganizations()

  const [inviteInput, setInviteInput] = React.useState("")
  const invitableRoles = React.useMemo(() => roles.filter((role) => role.id !== "owner"), [])
  const memberRoles = React.useMemo(() => roles, [])
  const [inviteRole, setInviteRole] = React.useState<RoleId>(() => invitableRoles[0]?.id ?? "member")
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!invitableRoles.some((role) => role.id === inviteRole) && invitableRoles[0]) {
      setInviteRole(invitableRoles[0].id)
    }
  }, [inviteRole, invitableRoles])

  const handleInvite = async () => {
    setError(null)
    setSuccess(null)

    const emails = [...new Set(parseEmails(inviteInput))]

    if (emails.length === 0) {
      setError("Enter at least one email address")
      return
    }

    const result = await inviteMembers({ emails, role: inviteRole as OrganizationRole })

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.failed.length > 0) {
      const firstFailure = result.failed[0]
      setError(`Some invites failed. ${firstFailure.email}: ${firstFailure.error}`)
    }

    if (result.invited.length > 0) {
      setSuccess(
        result.invited.length === 1
          ? "Invitation sent"
          : `Invitations sent to ${result.invited.length} people`
      )
      setInviteInput("")
    }
  }

  const handleRevoke = async (invitationId: string) => {
    setError(null)
    const result = await revokeInvitation(invitationId)

    if (result.error) {
      setError(result.error)
    }
  }

  const handleRoleChange = async (memberUserId: string, role: RoleId) => {
    setError(null)
    setSuccess(null)

    const result = await updateMemberRole({ memberUserId, role })

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess("Member role updated")
  }

  const handleKickMember = async (memberUserId: string) => {
    setError(null)
    setSuccess(null)

    const result = await kickMember(memberUserId)

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess("Member removed from organization")
  }

  const handleLeaveOrganization = async () => {
    setError(null)
    setSuccess(null)

    const result = await leaveCurrentOrganization()

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess("You left the organization")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold">Invite people to your workspace</h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email them an invitation to join your workspace.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          {success}
        </div>
      )}

      <div className="grid gap-3 rounded-lg border p-4">
        <div className="grid gap-2">
          <Label htmlFor="invite-emails">Invite users</Label>
          <Input
            id="invite-emails"
            placeholder="jane@example.com, john@example.com"
            value={inviteInput}
            onChange={(event) => setInviteInput(event.target.value)}
            disabled={!canInvite || isMutating}
          />
          <p className="text-xs text-muted-foreground">
            Add one or multiple emails separated by comma, semicolon, or newline.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="grid gap-2 sm:w-44">
            <Label>Role</Label>
            <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as RoleId)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {invitableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={handleInvite}
            disabled={!canInvite || isMutating || !inviteInput.trim()}
          >
            {isMutating ? "Inviting..." : "Invite users"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-3">
        <h3 className="text-sm font-medium">Current members</h3>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const isCurrentUser = member.userId === currentUserId
                return (
                  <tr key={member.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span>{member.name}</span>
                        {isCurrentUser ? (
                          <Badge variant="outline">You</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{member.email}</td>
                    <td className="px-4 py-2">
                      {canUpdateMemberRoles && !isCurrentUser ? (
                        <Select
                          value={member.role}
                          disabled={isMutating}
                          onValueChange={(value) =>
                            handleRoleChange(member.userId, value as RoleId)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberRoles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className="capitalize">
                          {getRoleById(member.role)?.name ?? member.role}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {canKickMembers && !isCurrentUser ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isMutating}
                          onClick={() => handleKickMember(member.userId)}
                        >
                          Kick
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3">
        <h3 className="text-sm font-medium">Invitations</h3>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="border-t">
                  <td className="px-4 py-2">{invitation.email}</td>
                  <td className="px-4 py-2">{getRoleById(invitation.role)?.name ?? invitation.role}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant="outline"
                      className={statusClassNames[invitation.status] ?? statusClassNames.pending}
                    >
                      {invitation.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    {invitation.status === "pending" ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={!canInvite || isMutating}
                        onClick={() => handleRevoke(invitation.id)}
                      >
                        Revoke
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {invitations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    No invitations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!canInvite && (
        <p className="text-xs text-muted-foreground">
          You don&apos;t have permission to invite or revoke members in this workspace.
        </p>
      )}

      <Separator />

      <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-destructive">Leave organization</p>
          <p className="text-xs text-muted-foreground">
            You can leave this organization unless it is your home organization.
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isMutating || isCurrentOrganizationHome}
          onClick={handleLeaveOrganization}
        >
          Leave
        </Button>
      </div>
      {isCurrentOrganizationHome && (
        <p className="text-xs text-muted-foreground">
          This is your home organization and cannot be left.
        </p>
      )}
    </div>
  )
}

export { OrganizationMembersPage }
