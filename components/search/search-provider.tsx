"use client"

import * as React from "react"
import { signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { usePermissionChecker } from "@/hooks/use-permission"
import { useUser } from "@/hooks/use-user"
import { useOrganizations } from "@/components/providers/organization-provider"
import { useSettings } from "@/components/settings"
import type { MdxDocsSidebarNode } from "@/types/docs"
import { useSidebar } from "@/components/shell/shell-context"
import { defaultSearchPlugins } from "./plugins"
import { getCurrentWeather } from "./plugins/weather-example-plugin"
import { SearchPalette } from "./search-palette"
import type {
  SearchAction,
  SearchPlugin,
  SearchRuntimeContext,
  SearchWeatherExampleResult,
} from "./search-types"

const SEARCH_SHORTCUT_KEY = "k"

interface SearchProviderProps {
  children: React.ReactNode
  docsNodes?: MdxDocsSidebarNode[]
  plugins?: SearchPlugin[]
}

interface SearchContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const SearchContext = React.createContext<SearchContextValue | null>(null)

const resolveActionPath = (actions: SearchAction[], path: string[]) => {
  const breadcrumbTitles: string[] = []
  let currentActions = actions
  const nextPath: string[] = []
  let currentView: SearchAction | null = null

  for (const segment of path) {
    const matchingAction = currentActions.find((action) => action.id === segment && action.children)

    if (!matchingAction?.children) {
      break
    }

    breadcrumbTitles.push(matchingAction.title)
    nextPath.push(segment)
    currentView = matchingAction
    currentActions = matchingAction.children
  }

  return {
    breadcrumbTitles,
    currentActions,
    currentView,
    normalizedPath: nextPath,
  }
}

const useSearch = () => {
  const context = React.useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }

  return context
}

const useWeatherExampleState = ({
  path,
  query,
}: {
  path: string[]
  query: string
}) => {
  const city = query.trim()
  const isActive = path[0] === "weather-example:check" || path[0]?.startsWith("weather-example:search:")
  const [result, setResult] = React.useState<SearchWeatherExampleResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [refreshToken, setRefreshToken] = React.useState(0)

  const refresh = React.useCallback(() => {
    setRefreshToken((current) => current + 1)
  }, [])

  React.useEffect(() => {
    if (!isActive || city.length < 2) {
      setResult(null)
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true)
      setError(null)

      void getCurrentWeather(city, controller.signal)
        .then((nextResult) => {
          setResult(nextResult)
          setError(null)
        })
        .catch((nextError) => {
          if (controller.signal.aborted) {
            return
          }

          setResult(null)
          setError(nextError instanceof Error ? nextError.message : "Could not load weather")
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false)
          }
        })
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [city, isActive, refreshToken])

  return {
    isActive,
    isLoading,
    error,
    result,
    refreshToken,
    refresh,
  }
}

const useNameSearchState = ({ query }: { query: string }) => {
  const normalizedQuery = query.trim()
  const [items, setItems] = React.useState<string[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (normalizedQuery.length < 2) {
      setItems([])
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true)
      setError(null)

      void fetch(`/api/example-names?q=${encodeURIComponent(normalizedQuery)}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Could not search names")
          }

          return (await response.json()) as { items?: string[] }
        })
        .then((payload) => {
          if (!controller.signal.aborted) {
            setItems(payload.items ?? [])
            setError(null)
          }
        })
        .catch((nextError) => {
          if (controller.signal.aborted) {
            return
          }

          setItems([])
          setError(nextError instanceof Error ? nextError.message : "Could not search names")
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false)
          }
        })
    }, 150)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [normalizedQuery])

  return {
    isLoading,
    error,
    items,
  }
}

const SearchProvider = ({
  children,
  docsNodes = [],
  plugins = defaultSearchPlugins,
}: SearchProviderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { open: openSettings } = useSettings()
  const {
    organizations,
    currentOrganization,
    isLoading: organizationsLoading,
    isMutating: organizationsMutating,
    switchOrganization,
  } = useOrganizations()
  const { currentOrganizationId } = useUser()
  const { isPanelOpen, togglePanel } = useSidebar()
  const hasPermission = usePermissionChecker()
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [path, setPath] = React.useState<string[]>([])
  const [pendingAction, setPendingAction] = React.useState<SearchAction | null>(null)
  const [isExecuting, setIsExecuting] = React.useState(false)
  const weatherExample = useWeatherExampleState({ path, query })
  const nameSearch = useNameSearchState({ query })

  const runtime = React.useMemo<SearchRuntimeContext>(
    () => ({
      pathname,
      path,
      query,
      docsNodes,
      theme,
      currentOrganizationId,
      currentOrganizationName: currentOrganization?.name ?? null,
      organizations,
      organizationsLoading,
      organizationsMutating,
      isSidebarOpen: isPanelOpen,
      weatherExample,
      nameSearch,
      hasPermission,
      navigate: (href: string) => {
        router.push(href)
      },
      openUrl: (href, target = "_blank") => {
        if (target === "_blank") {
          window.open(href, "_blank", "noopener,noreferrer")
          return
        }

        window.location.href = href
      },
      openSettings: (pageId) => openSettings(pageId),
      openScopedSettings: (scope, pageId) => openSettings({ scope, pageId }),
      switchOrganization,
      toggleSidebar: togglePanel,
      setTheme,
      signOut: () => signOut({ callbackUrl: "/" }),
    }),
    [
      currentOrganization?.name,
      currentOrganizationId,
      docsNodes,
      hasPermission,
      isPanelOpen,
      nameSearch,
      openSettings,
      organizations,
      organizationsLoading,
      organizationsMutating,
      path,
      pathname,
      query,
      router,
      setTheme,
      switchOrganization,
      theme,
      togglePanel,
      weatherExample,
    ],
  )

  const rootActions = React.useMemo(
    () => plugins.flatMap((plugin) => plugin.getActions(runtime)),
    [plugins, runtime],
  )

  const resolvedPath = React.useMemo(
    () => resolveActionPath(rootActions, path),
    [path, rootActions],
  )

  React.useEffect(() => {
    if (resolvedPath.normalizedPath.join("|") !== path.join("|")) {
      setPath(resolvedPath.normalizedPath)
    }
  }, [path, resolvedPath.normalizedPath])

  const close = React.useCallback(() => {
    setIsOpen(false)
    setQuery("")
    setPath([])
    setPendingAction(null)
    setIsExecuting(false)
  }, [])

  const open = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const toggle = React.useCallback(() => {
    setIsOpen((current) => {
      if (current) {
        setQuery("")
        setPath([])
        setPendingAction(null)
      }

      return !current
    })
  }, [])

  const executeAction = React.useCallback(
    async (action: SearchAction) => {
      if (action.disabled || isExecuting) {
        return
      }

      if (action.children?.length) {
        setPath((current) => [...current, action.id])
        const nextQuery = action.view?.queryOnOpen

        if (nextQuery === "preserve") {
          setQuery((current) => current)
        } else if (typeof nextQuery === "string" && nextQuery !== "clear") {
          setQuery(nextQuery)
        } else {
          setQuery("")
        }
        return
      }

      if (action.confirm) {
        setPendingAction(action)
        return
      }

      if (!action.perform) {
        return
      }

      setIsExecuting(true)

      try {
        await action.perform({ close })

        if (!action.keepOpen) {
          close()
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Action failed")
      } finally {
        setIsExecuting(false)
      }
    },
    [close, isExecuting],
  )

  const confirmPendingAction = React.useCallback(async () => {
    const action = pendingAction
    const perform = action?.perform

    if (!action || !perform) {
      setPendingAction(null)
      return
    }

    setPendingAction(null)
    setIsExecuting(true)

    try {
      await perform({ close })

      if (!action.keepOpen) {
        close()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed")
    } finally {
      setIsExecuting(false)
    }
  }, [close, pendingAction])

  const handleKeyDown = React.useEffectEvent((event: KeyboardEvent) => {
    if (event.isComposing) {
      return
    }

    if (event.key.toLowerCase() !== SEARCH_SHORTCUT_KEY) {
      return
    }

    if (!event.metaKey && !event.ctrlKey) {
      return
    }

    event.preventDefault()
    toggle()
  })

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  React.useEffect(() => {
    setIsOpen(false)
    setQuery("")
    setPath([])
    setPendingAction(null)
  }, [pathname])

  const value = React.useMemo<SearchContextValue>(
    () => ({
      isOpen,
      open,
      close,
      toggle,
    }),
    [close, isOpen, open, toggle],
  )

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchPalette
        open={isOpen}
        query={query}
        onQueryChange={setQuery}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            close()
            return
          }

          open()
        }}
        actions={resolvedPath.currentActions}
        breadcrumbTitles={resolvedPath.breadcrumbTitles}
        inputPlaceholder={
          resolvedPath.currentView?.view?.inputPlaceholder ??
          (resolvedPath.normalizedPath.length > 0
            ? "Filter this menu..."
            : "Search routes, settings, and actions...")
        }
        emptyTitle={
          resolvedPath.currentView?.view?.emptyTitle ?? "No matches found"
        }
        emptyDescription={
          resolvedPath.currentView?.view?.emptyDescription ??
          "Try a different keyword or step back into another menu."
        }
        canGoBack={resolvedPath.normalizedPath.length > 0}
        onGoBack={() => {
          setPath((current) => current.slice(0, -1))
          setQuery("")
        }}
        onSelectAction={(action) => {
          void executeAction(action)
        }}
        pendingAction={pendingAction}
        onPendingActionChange={setPendingAction}
        onConfirmPendingAction={confirmPendingAction}
        isExecuting={isExecuting}
      />
    </SearchContext.Provider>
  )
}

export { SearchProvider, useSearch }
