"use client"

import * as React from "react"

type SettingsScope = "account" | "organization"

interface SettingsOpenOptions {
  scope?: SettingsScope
  pageId?: string
}

interface SettingsContextValue {
  isOpen: boolean
  scope: SettingsScope
  open: (pageIdOrOptions?: string | SettingsOpenOptions) => void
  openAccount: (pageId?: string) => void
  openOrganization: (pageId?: string) => void
  close: () => void
  activePage: string
  setActivePage: (pageId: string) => void
  setScope: (scope: SettingsScope) => void
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null)

const useSettings = () => {
  const context = React.useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

const DEFAULT_PAGE_BY_SCOPE: Record<SettingsScope, string> = {
  account: "account",
  organization: "organization-general",
}

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scope, setScope] = React.useState<SettingsScope>("account")
  const [activePage, setActivePage] = React.useState(DEFAULT_PAGE_BY_SCOPE.account)

  const open = React.useCallback(
    (pageIdOrOptions?: string | SettingsOpenOptions) => {
      const options: SettingsOpenOptions =
        typeof pageIdOrOptions === "string"
          ? { pageId: pageIdOrOptions }
          : pageIdOrOptions ?? {}

      const nextScope = options.scope ?? "account"
      const nextPage = options.pageId ?? DEFAULT_PAGE_BY_SCOPE[nextScope]

      setScope(nextScope)
      setActivePage(nextPage)
      setIsOpen(true)
    },
    [],
  )

  const openAccount = React.useCallback(
    (pageId?: string) => {
      open({ scope: "account", ...(pageId ? { pageId } : {}) })
    },
    [open],
  )

  const openOrganization = React.useCallback(
    (pageId?: string) => {
      open({ scope: "organization", ...(pageId ? { pageId } : {}) })
    },
    [open],
  )

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = React.useMemo<SettingsContextValue>(
    () => ({
      isOpen,
      scope,
      open,
      openAccount,
      openOrganization,
      close,
      activePage,
      setActivePage,
      setScope,
    }),
    [isOpen, scope, open, openAccount, openOrganization, close, activePage],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsProvider, useSettings }
export type { SettingsScope, SettingsOpenOptions }
