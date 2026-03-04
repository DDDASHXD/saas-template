"use client"

import * as React from "react"

const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface SidebarContextValue {
  isPanelOpen: boolean
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  panelState: "expanded" | "collapsed"
  isMobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)

  const setPanelOpen = React.useCallback((open: boolean) => {
    setIsPanelOpen(open)
  }, [])

  const togglePanel = React.useCallback(() => {
    setIsPanelOpen((current) => !current)
  }, [])

  const setMobileSidebarOpen = React.useCallback((open: boolean) => {
    setIsMobileSidebarOpen(open)
  }, [])

  const toggleMobileSidebar = React.useCallback(() => {
    setIsMobileSidebarOpen((current) => !current)
  }, [])

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
    () => ({
      isPanelOpen,
      setPanelOpen,
      togglePanel,
      panelState,
      isMobileSidebarOpen,
      setMobileSidebarOpen,
      toggleMobileSidebar,
    }),
    [
      isPanelOpen,
      setPanelOpen,
      togglePanel,
      panelState,
      isMobileSidebarOpen,
      setMobileSidebarOpen,
      toggleMobileSidebar,
    ],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export { SidebarProvider, useSidebar }
export type { SidebarContextValue }
