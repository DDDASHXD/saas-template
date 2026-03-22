"use client"

import {
  Tick02Icon,
  UserGroupIcon,
  UserSettingsIcon,
} from "@hugeicons/core-free-icons"

import { toast } from "sonner"

import { defineSearchPlugin } from "../search-helpers"
import type {
  SearchAction,
  SearchActionHelpers,
  SearchPlugin,
} from "../search-types"

const organizationPlugin: SearchPlugin = defineSearchPlugin({
  id: "organizations",
  getActions: (context): SearchAction[] => [
    {
      id: "submenu:organizations",
      title: "Organizations",
      description: context.currentOrganizationName
        ? `Current workspace: ${context.currentOrganizationName}`
        : "Switch your current workspace",
      section: "Workspace",
      icon: UserGroupIcon,
      badge: context.organizationsLoading ? "Loading" : undefined,
      keywords: ["organization", "workspace", "team", "switch"],
      children: [
        {
          id: "organizations:settings",
          title: "Organization Settings",
          description: "Open organization configuration",
          icon: UserSettingsIcon,
          keywords: ["settings", "organization", "workspace"],
          perform: ({ close }: SearchActionHelpers) => {
            context.openScopedSettings("organization", "organization-general")
            close()
          },
        },
        ...context.organizations.map((organization) => ({
          id: `organization:${organization.id}`,
          title: organization.name,
          description: organization.isCurrent ? "Current organization" : "Switch organization",
          icon: organization.isCurrent ? Tick02Icon : UserGroupIcon,
          badge: organization.isCurrent ? "Current" : undefined,
          disabled:
            context.organizationsMutating ||
            organization.id === context.currentOrganizationId,
          keywords: [organization.slug ?? "", "organization", "workspace"],
          perform: async ({ close }: SearchActionHelpers) => {
            const result = await context.switchOrganization(organization.id)

            if (result.error) {
              toast.error(result.error)
              return
            }

            toast.success("Organization switched")
            close()
          },
        })),
      ],
    },
  ],
})

export { organizationPlugin }
