import "server-only"

import type { PermissionId } from "@/permissions"
import { hasRolePermission } from "@/roles"

import { auth } from "@/lib/auth"
import {
  getCurrentOrganizationStateForUser,
  OrganizationError,
  type OrganizationRole,
} from "@/lib/organizations"

interface ServerPermissionContext {
  userId: string | null
  organizationId: string | null
  organizationName: string | null
  role: OrganizationRole | null
  isAuthenticated: boolean
  isHomeOrganization: boolean
}

const getServerPermissionContext = async (): Promise<ServerPermissionContext> => {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      userId: null,
      organizationId: null,
      organizationName: null,
      role: null,
      isAuthenticated: false,
      isHomeOrganization: false,
    }
  }

  const state = await getCurrentOrganizationStateForUser(session.user.id)

  return {
    userId: session.user.id,
    organizationId: state.organization.id,
    organizationName: state.organization.name,
    role: state.role,
    isAuthenticated: true,
    isHomeOrganization: state.isHomeForCurrentUser,
  }
}

const hasServerPermission = async (permissionId: PermissionId) => {
  const context = await getServerPermissionContext()

  return hasRolePermission(context.role, permissionId)
}

const requireServerPermission = async (permissionId: PermissionId) => {
  const context = await getServerPermissionContext()

  if (!hasRolePermission(context.role, permissionId)) {
    throw new OrganizationError("forbidden", `Missing required permission: ${permissionId}`)
  }

  return context
}

export {
  getServerPermissionContext,
  hasServerPermission,
  requireServerPermission,
}
export type { ServerPermissionContext }
