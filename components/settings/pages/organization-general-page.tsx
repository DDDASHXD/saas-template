"use client"

import * as React from "react"

import { siteConfig } from "@/config"
import { useOrganizations } from "@/components/providers/organization-provider"
import { usePermission } from "@/hooks/use-permission"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const OrganizationGeneralPage = () => {
  const {
    currentOrganization,
    isMutating,
    updateCurrentOrganization,
  } = useOrganizations()
  const canEdit = usePermission("organization.update")

  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  React.useEffect(() => {
    setName(currentOrganization?.name ?? "")
    setSlug(currentOrganization?.slug ?? "")
  }, [currentOrganization])

  const hasChanges =
    name.trim() !== (currentOrganization?.name ?? "") ||
    slug.trim() !== (currentOrganization?.slug ?? "")

  const handleSave = async () => {
    setError(null)
    setSuccess(null)

    const result = await updateCurrentOrganization({
      name: name.trim(),
      slug: slug.trim(),
    })

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess("Organization settings updated")
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          {success}
        </div>
      )}

      <div className="grid gap-4">
        <h3 className="text-xs font-medium text-muted-foreground">General</h3>

        <div className="grid gap-2">
          <Label htmlFor="organization-name">Organization Name</Label>
          <Input
            id="organization-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Workspace name"
            disabled={!canEdit || isMutating || !currentOrganization}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="organization-slug">Slug</Label>
          <Input
            id="organization-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value.toLowerCase())}
            placeholder="workspace"
            disabled={!canEdit || isMutating || !currentOrganization}
          />
          <p className="text-xs text-muted-foreground">
            URL: {siteConfig.url.replace(/\/$/, "")}/{slug || "workspace"}
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-2">
        <p className="text-xs font-medium text-muted-foreground">Permissions</p>
        <p className="text-sm text-foreground">
          {canEdit
            ? "You can edit organization settings and invite members."
            : "You do not have permission to edit these settings."}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setName(currentOrganization?.name ?? "")
            setSlug(currentOrganization?.slug ?? "")
            setError(null)
            setSuccess(null)
          }}
          disabled={isMutating || !hasChanges}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!canEdit || isMutating || !hasChanges || !name.trim() || !slug.trim()}
        >
          {isMutating ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  )
}

export { OrganizationGeneralPage }
