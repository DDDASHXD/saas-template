import { notFound } from "next/navigation"

import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"
import { Badge } from "@/components/ui/badge"
import { getPermissionRouteById } from "@/lib/permission-routes"
import { requirePagePermission } from "@/lib/permission-route-guards"

const PermissionRouteDetailPage = async ({
  params,
}: {
  params: Promise<{ routeId: string }>
}) => {
  const { routeId } = await params
  const route = getPermissionRouteById(routeId)

  if (!route) {
    notFound()
  }

  await requirePagePermission(route.permissionId)

  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>{route.title}</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          This page is protected by permission-based routing.
        </ShellContentHeaderDescription>
      </ShellContentHeader>

      <ShellBody className="gap-8">
        <section className="rounded-xl border bg-[var(--shell-panel)] p-6">
          <h2 className="text-sm font-semibold">Access granted</h2>
          <p className="mt-2 text-sm text-muted-foreground">{route.description}</p>
          <div className="mt-4">
            <Badge>{route.permissionId}</Badge>
          </div>
        </section>
      </ShellBody>
    </>
  )
}

export default PermissionRouteDetailPage
