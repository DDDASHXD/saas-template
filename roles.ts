import type { PermissionId } from '@/permissions'

export type RoleId = string

export interface RoleDefinition {
  name: string
  id: string
  permissions: Array<PermissionId | '*'>
  nonPermissions?: PermissionId[]
}

export const roles = [
  {
    name: 'Owner',
    id: 'owner',
    permissions: ['*'],
  },
  {
    name: 'Admin',
    id: 'admin',
    permissions: ['*'],
    nonPermissions: ['organization.delete'],
  },
  {
    name: 'Member',
    id: 'member',
    permissions: ['example.permission', 'organization.leave'],
  },
] as const satisfies readonly RoleDefinition[]

const roleMap = new Map<RoleId, RoleDefinition>(roles.map((role) => [role.id, role]))
const roleIdSet = new Set<RoleId>(roles.map((role) => role.id))

export const getRoleById = (roleId: RoleId | null | undefined) =>
  roleId ? (roleMap.get(roleId) ?? null) : null

export const isRoleId = (roleId: string): roleId is RoleId => roleIdSet.has(roleId)

export const getRoleIds = () => roles.map((role) => role.id)

export const getInvitableRoleIds = () =>
  roles.filter((role) => role.id !== 'owner').map((role) => role.id)

export const hasRolePermission = (
  roleId: RoleId | null | undefined,
  permissionId: PermissionId,
): boolean => {
  const role = getRoleById(roleId)

  if (!role) {
    return false
  }

  const isAllowed = role.permissions.includes('*') || role.permissions.includes(permissionId)

  if (!isAllowed) {
    return false
  }

  return !(role.nonPermissions?.includes(permissionId) ?? false)
}

export const getRolePermissions = (roleId: RoleId | null | undefined) => {
  const role = getRoleById(roleId)

  if (!role) {
    return []
  }

  return role.permissions
}
