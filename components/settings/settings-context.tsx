"use client"

import * as React from "react"

interface SettingsContextValue {
  isOpen: boolean
  open: (pageId?: string) => void
  close: () => void
  activePage: string
  setActivePage: (pageId: string) => void
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null)

const useSettings = () => {
  const context = React.useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activePage, setActivePage] = React.useState("account")

  const open = React.useCallback(
    (pageId?: string) => {
      if (pageId) setActivePage(pageId)
      setIsOpen(true)
    },
    [],
  )

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = React.useMemo<SettingsContextValue>(
    () => ({ isOpen, open, close, activePage, setActivePage }),
    [isOpen, open, close, activePage],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsProvider, useSettings }
