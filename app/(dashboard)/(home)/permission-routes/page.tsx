import Link from "next/link"

import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"
import { Badge } from "@/components/ui/badge"
import { hasServerPermission } from "@/lib/organization-access"
import { permissionRoutes } from "@/lib/permission-routes"

const PermissionRoutesPage = async () => {
  const evaluations = await Promise.all(
    permissionRoutes.map(async (route) => ({
      route,
      allowed: await hasServerPermission(route.permissionId),
    }))
  )

  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Permission Routes</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Routes below are guarded by permissions and redirect to /forbidden when denied.
        </ShellContentHeaderDescription>
      </ShellContentHeader>

      <ShellBody className="gap-8">
        <section className="overflow-hidden rounded-xl border bg-[var(--shell-panel)]">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Route</th>
                <th className="px-4 py-2">Permission</th>
                <th className="px-4 py-2">Access</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map(({ route, allowed }) => (
                <tr key={route.id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium">{route.title}</p>
                    <p className="text-xs text-muted-foreground">{route.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{route.permissionId}</code>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={allowed ? "default" : "outline"}>
                      {allowed ? "Allowed" : "Denied"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={route.href}
                      className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted"
                    >
                      Open route
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </ShellBody>
    </>
  )
}

export default PermissionRoutesPage
