"use client"

import * as React from "react"

import { useOrganizations } from "@/components/providers/organization-provider"
import type { PermissionId } from "@/permissions"
import { hasRolePermission } from "@/roles"

export const usePermission = (permissionId: PermissionId) => {
  const { currentRole } = useOrganizations()

  return hasRolePermission(currentRole, permissionId)
}

export const usePermissionChecker = () => {
  const { currentRole } = useOrganizations()

  return React.useCallback(
    (permissionId: PermissionId) => hasRolePermission(currentRole, permissionId),
    [currentRole]
  )
}

export const useAnyPermission = (permissionIds: PermissionId[]) => {
  const hasPermission = usePermissionChecker()

  return permissionIds.some((permissionId) => hasPermission(permissionId))
}

export const useAllPermissions = (permissionIds: PermissionId[]) => {
  const hasPermission = usePermissionChecker()

  return permissionIds.every((permissionId) => hasPermission(permissionId))
}
