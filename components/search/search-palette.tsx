"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Loading03Icon,
  SearchIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SearchAction } from "./search-types"

interface GroupedActions {
  key: string
  label?: string
  items: SearchAction[]
}

interface SearchPaletteProps {
  open: boolean
  query: string
  onQueryChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  actions: SearchAction[]
  breadcrumbTitles: string[]
  inputPlaceholder: string
  emptyTitle: string
  emptyDescription: string
  canGoBack: boolean
  onGoBack: () => void
  onSelectAction: (action: SearchAction) => void
  pendingAction: SearchAction | null
  onPendingActionChange: (action: SearchAction | null) => void
  onConfirmPendingAction: () => Promise<void>
  isExecuting: boolean
}

const normalize = (value: string) => value.trim().toLowerCase()

const scoreAction = (action: SearchAction, query: string) => {
  if (!query) {
    return 1
  }

  const title = action.title.toLowerCase()
  const description = action.description?.toLowerCase() ?? ""
  const keywords = action.keywords?.join(" ").toLowerCase() ?? ""

  if (title === query) {
    return 300
  }

  if (title.startsWith(query)) {
    return 200
  }

  if (title.includes(query)) {
    return 120
  }

  if (keywords.includes(query)) {
    return 90
  }

  if (description.includes(query)) {
    return 60
  }

  return 0
}

const groupActions = (actions: SearchAction[]) => {
  const groups = new Map<string, GroupedActions>()

  for (const action of actions) {
    const key = action.section ?? "__default__"
    const current = groups.get(key)

    if (current) {
      current.items.push(action)
      continue
    }

    groups.set(key, {
      key,
      label: action.section,
      items: [action],
    })
  }

  return Array.from(groups.values())
}

const flattenGroupedActions = (groups: GroupedActions[]) =>
  groups.flatMap((group) => group.items)

const SearchPalette = ({
  open,
  query,
  onQueryChange,
  onOpenChange,
  actions,
  breadcrumbTitles,
  inputPlaceholder,
  emptyTitle,
  emptyDescription,
  canGoBack,
  onGoBack,
  onSelectAction,
  pendingAction,
  onPendingActionChange,
  onConfirmPendingAction,
  isExecuting,
}: SearchPaletteProps) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const deferredQuery = React.useDeferredValue(query)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const breadcrumbKey = React.useMemo(() => breadcrumbTitles.join("|"), [breadcrumbTitles])

  const filteredActions = React.useMemo(() => {
    const normalizedQuery = normalize(deferredQuery)

    return actions
      .map((action, index) => ({
        action,
        index,
        score: scoreAction(action, normalizedQuery),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map(({ action }) => action)
  }, [actions, deferredQuery])

  const groupedActions = React.useMemo(() => groupActions(filteredActions), [filteredActions])
  const renderedActions = React.useMemo(
    () => flattenGroupedActions(groupedActions),
    [groupedActions],
  )

  React.useEffect(() => {
    if (!open) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [open])

  React.useEffect(() => {
    setActiveIndex(0)
  }, [breadcrumbKey, deferredQuery, open])

  React.useEffect(() => {
    if (activeIndex >= renderedActions.length) {
      setActiveIndex(Math.max(renderedActions.length - 1, 0))
    }
  }, [activeIndex, renderedActions.length])

  React.useEffect(() => {
    const activeItem = itemRefs.current[activeIndex]

    if (!activeItem) {
      return
    }

    activeItem.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    })
  }, [activeIndex, renderedActions])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) =>
        renderedActions.length === 0 ? 0 : (current + 1) % renderedActions.length,
      )
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) =>
        renderedActions.length === 0
          ? 0
          : (current - 1 + renderedActions.length) % renderedActions.length,
      )
      return
    }

    if (event.key === "Enter") {
      const currentAction = renderedActions[activeIndex]

      if (currentAction) {
        event.preventDefault()
        onSelectAction(currentAction)
      }
      return
    }

    if ((event.key === "Backspace" || event.key === "ArrowLeft") && !query && canGoBack) {
      event.preventDefault()
      onGoBack()
      return
    }

    if (event.key === "Escape" && canGoBack) {
      event.preventDefault()
      event.stopPropagation()
      onGoBack()
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && canGoBack) {
            onGoBack()
            return
          }

          onOpenChange(nextOpen)
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Popup
            data-slot="dialog-content"
            onKeyDown={handleKeyDown}
            className="fixed top-1/2 left-1/2 z-50 flex h-[min(72vh,680px)] w-full max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.75rem] border border-border/60 bg-background shadow-2xl outline-none sm:max-w-2xl lg:max-w-3xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            style={
              {
                background:
                  "color-mix(in oklch, var(--background) 97%, var(--foreground) 3%)",
              } as React.CSSProperties
            }
          >
            <div className="border-b border-border/70 px-3 pt-3 pb-2 sm:px-4">
              <div className="flex items-center gap-2">
                {canGoBack ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onGoBack}
                    aria-label="Go back"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                  </Button>
                ) : null}

                <div className="relative flex-1">
                  <HugeiconsIcon
                    icon={SearchIcon}
                    size={18}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder={inputPlaceholder}
                    className="h-11 w-full rounded-2xl border border-border/60 bg-background/80 pr-24 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
                  />
                  <div className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 sm:flex">
                    <span className="rounded-md border border-border/80 bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Cmd
                    </span>
                    <span className="rounded-md border border-border/80 bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      K
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2 px-1 text-xs text-muted-foreground">
                <span>Search</span>
                {breadcrumbTitles.map((title) => (
                  <React.Fragment key={title}>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                    <span>{title}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-4 p-2 sm:p-3">
                {groupedActions.length === 0 ? (
                  <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
                    <p className="text-sm font-medium">{emptyTitle}</p>
                    <p className="max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
                  </div>
                ) : null}

                {groupedActions.map((group) => {
                  const groupIndex = groupedActions.findIndex((candidate) => candidate.key === group.key)
                  const offset = groupedActions
                    .slice(0, groupIndex)
                    .reduce((total, candidate) => total + candidate.items.length, 0)

                  return (
                    <section key={group.key} className="space-y-1">
                      {group.label ? (
                        <div className="px-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                          {group.label}
                        </div>
                      ) : null}

                      {group.items.map((action, index) => {
                        const isActive = offset + index === activeIndex
                        const itemIndex = offset + index

                        return (
                          <button
                            key={action.id}
                            ref={(node) => {
                              itemRefs.current[itemIndex] = node
                            }}
                            type="button"
                            onMouseEnter={() => setActiveIndex(itemIndex)}
                            onClick={() => onSelectAction(action)}
                            disabled={action.disabled || isExecuting}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors outline-none",
                              isActive
                                ? "border-primary/40 bg-primary/8"
                                : "border-transparent hover:border-border/70 hover:bg-background/70",
                              action.disabled && "cursor-not-allowed opacity-55",
                            )}
                          >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                              {action.icon ? (
                                <HugeiconsIcon
                                  icon={action.loading ? Loading03Icon : action.icon}
                                  size={18}
                                  className={cn(action.loading && "animate-spin")}
                                />
                              ) : (
                                <HugeiconsIcon icon={SearchIcon} size={18} />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-medium">{action.title}</p>
                                {action.badge ? (
                                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    {action.badge}
                                  </span>
                                ) : null}
                              </div>
                              {action.description ? (
                                <p className="truncate text-sm text-muted-foreground">
                                  {action.description}
                                </p>
                              ) : null}
                            </div>

                            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                              {action.shortcut ? (
                                <span className="rounded-md border border-border/70 px-1.5 py-0.5">
                                  {action.shortcut}
                                </span>
                              ) : null}
                              {action.children ? (
                                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                              ) : null}
                            </div>
                          </button>
                        )
                      })}
                    </section>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-border/70 px-1.5 py-0.5">Enter</span>
                <span>Open</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-border/70 px-1.5 py-0.5">Arrow Keys</span>
                <span>Navigate</span>
              </div>
              {canGoBack ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="rounded-md border border-border/70 px-1.5 py-0.5">Backspace</span>
                  <span>Back</span>
                </div>
              ) : null}
            </div>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>

      <AlertDialog
        open={Boolean(pendingAction)}
        onOpenChange={(nextOpen) => !nextOpen && onPendingActionChange(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.confirm?.title ?? "Confirm action"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.confirm?.description ?? ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {pendingAction?.confirm?.cancelLabel ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              variant={pendingAction?.confirm?.variant === "destructive" ? "destructive" : "default"}
              onClick={() => void onConfirmPendingAction()}
            >
              {pendingAction?.confirm?.confirmLabel ?? "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export { SearchPalette }
