import type { IconSvgElement } from "@hugeicons/react"

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
      items: SidebarItem[]
      utilities: SidebarItem[]
    }
    settings: SettingsSection[]
  }
}
