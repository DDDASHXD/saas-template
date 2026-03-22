"use client"

import type { IconSvgElement } from "@hugeicons/react"
import type { MdxDocsSidebarNode } from "@/types/docs"
import type { SettingsScope } from "@/components/settings"
import type { UserOrganization } from "@/lib/organizations"
import type { PermissionId } from "@/permissions"

export interface SearchActionConfirmation {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
}

export interface SearchActionHelpers {
  close: () => void
}

export interface SearchWeatherExampleResult {
  location: string
  summary: string
  temperature: string
  apparentTemperature: string | null
  wind: string | null
}

export interface SearchActionView {
  inputPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  queryOnOpen?: "preserve" | "clear" | string
}

export interface SearchAction {
  id: string
  title: string
  description?: string
  section?: string
  keywords?: string[]
  icon?: IconSvgElement
  badge?: string
  shortcut?: string
  disabled?: boolean
  loading?: boolean
  keepOpen?: boolean
  confirm?: SearchActionConfirmation
  view?: SearchActionView
  children?: SearchAction[]
  perform?: (helpers: SearchActionHelpers) => void | Promise<void>
}

export interface SearchRuntimeContext {
  pathname: string
  path: string[]
  query: string
  docsNodes: MdxDocsSidebarNode[]
  theme: string | undefined
  currentOrganizationId: string | null
  currentOrganizationName: string | null
  organizations: UserOrganization[]
  organizationsLoading: boolean
  organizationsMutating: boolean
  isSidebarOpen: boolean
  weatherExample: {
    isActive: boolean
    isLoading: boolean
    error: string | null
    result: SearchWeatherExampleResult | null
    refreshToken: number
    refresh: () => void
  }
  nameSearch: {
    isLoading: boolean
    error: string | null
    items: string[]
  }
  hasPermission: (permissionId: PermissionId) => boolean
  navigate: (href: string) => void
  openUrl: (href: string, target?: "_self" | "_blank") => void
  openSettings: (pageId?: string) => void
  openScopedSettings: (scope: SettingsScope, pageId?: string) => void
  switchOrganization: (organizationId: string) => Promise<{ error?: string }>
  toggleSidebar: () => void
  setTheme: (theme: string) => void
  signOut: () => Promise<void>
}

export interface SearchPlugin {
  id: string
  getActions: (context: SearchRuntimeContext) => SearchAction[]
}
