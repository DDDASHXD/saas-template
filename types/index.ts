import type { IconSvgElement } from "@hugeicons/react"
import type { PermissionId } from "@/permissions"

export type GenericLoginType = "emailAndPassword" | "emailOTP" | "none"

export interface NavLink {
  label: string
  href: string
}

export interface FooterCategory {
  label: string
  items: NavLink[]
}

export interface FooterSocial {
  platform: "twitter" | "github" | "discord" | "linkedin" | "reddit" | "telegram"
  href: string
}

export interface SidebarItem {
  title: string
  href: string
  icon: IconSvgElement
  visible?: PermissionId
}

export type DashboardRailItemType = "default" | "mdx"

export interface DashboardRailItem extends SidebarItem {
  type: DashboardRailItemType
  folder?: string
}

export interface SidebarGroup {
  label?: string
  items: SidebarItem[]
}

export interface SettingsItem {
  id: string
  label: string
  icon: IconSvgElement
}

export interface SettingsSection {
  label?: string
  items: SettingsItem[]
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  auth: {
    requireEmailConfirmation: boolean
    genericLoginType: GenericLoginType
  }
  logo: {
    full: string
    icon: string
  }
  nav: NavLink[]
  footer: {
    categories: FooterCategory[]
    socials: FooterSocial[]
  }
  dashboard: {
    sidebar: {
      items: DashboardRailItem[]
      utilities: SidebarItem[]
    }
    settings: SettingsSection[]
  }
}
