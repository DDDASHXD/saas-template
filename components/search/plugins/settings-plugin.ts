"use client"

import {
  ComputerIcon,
  InformationCircleIcon,
  MoonIcon,
  PaintBrushIcon,
  SunIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { siteConfig } from "@/config"
import { defineSearchPlugin } from "../search-helpers"
import type {
  SearchAction,
  SearchActionHelpers,
  SearchPlugin,
} from "../search-types"

const organizationSections = [
  {
    label: "Organization",
    items: [
      { id: "organization-general", label: "General", icon: InformationCircleIcon },
      { id: "organization-members", label: "Members & Invitations", icon: UserGroupIcon },
    ],
  },
]

const themeOptions = [
  { id: "light", label: "Light", icon: SunIcon },
  { id: "dark", label: "Dark", icon: MoonIcon },
  { id: "system", label: "System", icon: ComputerIcon },
] as const

const settingsPlugin: SearchPlugin = defineSearchPlugin({
  id: "settings",
  getActions: (context) => {
    const accountSettings: SearchAction = {
      id: "submenu:account-settings",
      title: "Account Settings",
      description: "Open account settings pages",
      section: "Settings",
      icon: siteConfig.dashboard.settings[0]?.items[0]?.icon,
      keywords: ["settings", "account", "profile", "preferences"],
      children: siteConfig.dashboard.settings.flatMap((section) =>
        section.items.map((item) => ({
          id: `settings:account:${item.id}`,
          title: item.label,
          description: section.label ? `${section.label} settings` : "Account settings",
          icon: item.icon,
          keywords: [item.id, "settings", section.label ?? "account"],
          perform: ({ close }: SearchActionHelpers) => {
            context.openScopedSettings("account", item.id)
            close()
          },
        })),
      ),
    }

    const organizationSettings: SearchAction = {
      id: "submenu:organization-settings",
      title: "Organization Settings",
      description: "Open organization settings pages",
      section: "Settings",
      icon: UserGroupIcon,
      keywords: ["settings", "organization", "team", "workspace"],
      children: organizationSections.flatMap((section) =>
        section.items.map((item) => ({
          id: `settings:organization:${item.id}`,
          title: item.label,
          description: section.label ? `${section.label} settings` : "Organization settings",
          icon: item.icon,
          keywords: [item.id, "settings", section.label ?? "organization"],
          perform: ({ close }: SearchActionHelpers) => {
            context.openScopedSettings("organization", item.id)
            close()
          },
        })),
      ),
    }

    const themeMenu: SearchAction = {
      id: "submenu:theme",
      title: "Theme",
      description: "Switch the app theme",
      section: "Settings",
      icon: PaintBrushIcon,
      keywords: ["theme", "appearance", "dark", "light"],
      children: themeOptions.map((option) => ({
        id: `theme:${option.id}`,
        title: option.label,
        description: "Update the application theme",
        icon: option.icon,
        badge: context.theme === option.id ? "Active" : undefined,
        keywords: ["theme", "appearance", option.id],
        keepOpen: false,
        perform: ({ close }: SearchActionHelpers) => {
          context.setTheme(option.id)
          close()
        },
      })),
    }

    return [accountSettings, organizationSettings, themeMenu]
  },
})

export { settingsPlugin }
