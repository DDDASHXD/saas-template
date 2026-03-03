import type { PermissionId } from "@/permissions"

interface PermissionRouteDefinition {
  id: string
  title: string
  description: string
  href: string
  permissionId: PermissionId
}

export const permissionRoutes = [
  {
    id: "example",
    title: "Example Permission Route",
    description: "Route protected by example.permission",
    href: "/permission-routes/example",
    permissionId: "example.permission",
  },
  {
    id: "organization-delete",
    title: "Organization Delete Route",
    description: "Route protected by organization.delete",
    href: "/permission-routes/organization-delete",
    permissionId: "organization.delete",
  },
] as const satisfies readonly PermissionRouteDefinition[]

export type PermissionRouteId = (typeof permissionRoutes)[number]["id"]

const permissionRouteMap = new Map(permissionRoutes.map((route) => [route.id, route]))

export const getPermissionRouteById = (routeId: string) =>
  permissionRouteMap.get(routeId as PermissionRouteId) ?? null
