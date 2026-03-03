import "server-only"

import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

import type { PermissionId } from "@/permissions"
import { hasServerPermission } from "@/lib/organization-access"

export const requirePagePermission = async (permissionId: PermissionId) => {
  const allowed = await hasServerPermission(permissionId)

  if (!allowed) {
    redirect("/forbidden")
  }
}

export const requireApiPermission = async (permissionId: PermissionId) => {
  const allowed = await hasServerPermission(permissionId)

  if (!allowed) {
    return NextResponse.json(
      { error: `Missing required permission: ${permissionId}` },
      { status: 403 }
    )
  }

  return null
}
