import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"
import { PermissionsLabClient } from "@/components/permissions/permissions-lab-client"
import { getServerPermissionContext } from "@/lib/organization-access"
import { permissions } from "@/permissions"
import { hasRolePermission } from "@/roles"

const PermissionsLabPage = async () => {
  const context = await getServerPermissionContext()

  const serverChecks = permissions.map((permission) => ({
    id: permission.id,
    allowed: hasRolePermission(context.role, permission.id),
  }))

  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Permissions Lab</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Validate organization role permissions in server and client tabs.
        </ShellContentHeaderDescription>
      </ShellContentHeader>

      <ShellBody className="gap-8">
        <PermissionsLabClient
          serverRole={context.role}
          serverOrganizationName={context.organizationName}
          serverChecks={serverChecks}
        />
      </ShellBody>
    </>
  )
}

export default PermissionsLabPage
