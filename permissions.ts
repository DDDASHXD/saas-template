export interface PermissionDefinition {
  label: string
  description: string
  id: string
}

export const permissions = [
  {
    label: 'example permission',
    description: 'example permission description',
    id: 'example.permission',
  },
  {
    label: 'delete organization',
    description: 'delete organization description',
    id: 'organization.delete',
  },
  {
    label: 'update organization',
    description: 'Update organization settings such as name and slug',
    id: 'organization.update',
  },
  {
    label: 'invite members',
    description: 'Invite new users into an organization',
    id: 'organization.members.invite',
  },
  {
    label: 'revoke invitations',
    description: 'Revoke pending organization invitations',
    id: 'organization.members.invitation.revoke',
  },
  {
    label: 'update member roles',
    description: 'Change organization member roles',
    id: 'organization.members.role.update',
  },
  {
    label: 'kick members',
    description: 'Remove members from an organization',
    id: 'organization.members.kick',
  },
  {
    label: 'leave organization',
    description: 'Leave the current organization',
    id: 'organization.leave',
  },
] as const satisfies readonly PermissionDefinition[]

export type PermissionId = (typeof permissions)[number]['id']

const permissionIdSet = new Set<PermissionId>(permissions.map((permission) => permission.id))

export const isPermissionId = (value: string): value is PermissionId =>
  permissionIdSet.has(value as PermissionId)
