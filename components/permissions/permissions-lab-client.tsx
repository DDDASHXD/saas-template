"use client"

import * as React from "react"

import { useOrganizations } from "@/components/providers/organization-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { permissions, type PermissionId } from "@/permissions"
import { usePermission } from "@/hooks/use-permission"

interface ServerPermissionCheck {
  id: PermissionId
  allowed: boolean
}

interface PermissionsLabClientProps {
  serverRole: string | null
  serverOrganizationName: string | null
  serverChecks: ServerPermissionCheck[]
}

const ClientPermissionRow = ({
  permissionId,
  label,
  description,
}: {
  permissionId: PermissionId
  label: string
  description: string
}) => {
  const hasPermission = usePermission(permissionId)

  return (
    <tr className="border-t">
      <td className="px-4 py-3">
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </td>
      <td className="px-4 py-3">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{permissionId}</code>
      </td>
      <td className="px-4 py-3">
        <Badge variant={hasPermission ? "default" : "outline"}>
          {hasPermission ? "Allowed" : "Denied"}
        </Badge>
      </td>
    </tr>
  )
}

const PermissionsLabClient = ({
  serverRole,
  serverOrganizationName,
  serverChecks,
}: PermissionsLabClientProps) => {
  const [activeTab, setActiveTab] = React.useState<"server" | "client">("server")
  const { currentRole, currentOrganization } = useOrganizations()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Button
          variant={activeTab === "server" ? "default" : "outline"}
          onClick={() => setActiveTab("server")}
        >
          Server Checks
        </Button>
        <Button
          variant={activeTab === "client" ? "default" : "outline"}
          onClick={() => setActiveTab("client")}
        >
          Client Checks
        </Button>
      </div>

      {activeTab === "server" ? (
        <section className="rounded-xl border bg-[var(--shell-panel)] p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Server permission context</h2>
            <p className="text-xs text-muted-foreground">
              Organization: {serverOrganizationName ?? "None"} | Role: {serverRole ?? "None"}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Permission</th>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => {
                  const check = serverChecks.find((entry) => entry.id === permission.id)
                  const allowed = check?.allowed ?? false

                  return (
                    <tr key={permission.id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium">{permission.label}</p>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{permission.id}</code>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={allowed ? "default" : "outline"}>
                          {allowed ? "Allowed" : "Denied"}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border bg-[var(--shell-panel)] p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Client permission checks</h2>
            <p className="text-xs text-muted-foreground">
              Organization: {currentOrganization?.name ?? "None"} | Role: {currentRole ?? "None"}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Permission</th>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <ClientPermissionRow
                    key={permission.id}
                    permissionId={permission.id}
                    label={permission.label}
                    description={permission.description}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export { PermissionsLabClient }
