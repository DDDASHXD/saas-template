"use client"

import * as React from "react"

const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface SidebarContextValue {
  isPanelOpen: boolean
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  panelState: "expanded" | "collapsed"
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  defaultOpen?: boolean
  children: React.ReactNode
}

const SidebarProvider = ({
  defaultOpen = true,
  children,
}: SidebarProviderProps) => {
  const [isPanelOpen, setIsPanelOpen] = React.useState(defaultOpen)

  const setPanelOpen = React.useCallback((open: boolean) => {
    setIsPanelOpen(open)
  }, [])

  const togglePanel = React.useCallback(() => {
    setPanelOpen(!isPanelOpen)
  }, [isPanelOpen, setPanelOpen])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        togglePanel()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [togglePanel])

  const panelState = isPanelOpen ? "expanded" : "collapsed"

  const value = React.useMemo<SidebarContextValue>(
    () => ({ isPanelOpen, setPanelOpen, togglePanel, panelState }),
    [isPanelOpen, setPanelOpen, togglePanel, panelState],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export { SidebarProvider, useSidebar }
export type { SidebarContextValue }
