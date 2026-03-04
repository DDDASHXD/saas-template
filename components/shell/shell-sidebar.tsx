'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Notification03Icon,
  ArrowDown01Icon,
  PlusSignIcon,
  Tick02Icon,
  UserSettingsIcon,
} from '@hugeicons/core-free-icons'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/config'
import { useNotifications } from '@/hooks/use-notifications'
import { usePermissionChecker } from '@/hooks/use-permission'
import { useOrganizations } from '@/components/providers/organization-provider'
import type { NotificationAction } from '@/lib/notifications'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettings } from '@/components/settings'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useSidebar } from './shell-context'

const SIDEBAR_WIDTH = 240

const ShellSidebar = ({ children }: { children: React.ReactNode }) => {
  const { isPanelOpen, isMobileSidebarOpen, setMobileSidebarOpen } = useSidebar()
  const utilities = siteConfig.dashboard.sidebar.utilities

  const handleMobileNavigationCapture = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      if (target.closest('a[href]')) {
        setMobileSidebarOpen(false)
      }
    },
    [setMobileSidebarOpen]
  )

  return (
    <>
      <aside
        className="sticky top-0 z-40 hidden h-dvh transition-[width] duration-300 md:block"
        style={{ width: isPanelOpen ? SIDEBAR_WIDTH : 0 }}
        data-panel-state={isPanelOpen ? 'expanded' : 'collapsed'}
      >
        <div
          className={cn(
            'relative size-full overflow-hidden py-2 transition-all duration-300',
            isPanelOpen
              ? 'scale-100 opacity-100 translate-x-0 blur-none'
              : 'origin-left scale-95 opacity-0 translate-x-6 blur-sm',
          )}
        >
          <div
            className="relative flex h-full flex-col overflow-hidden rounded-l-xl bg-[var(--shell-panel)]"
            style={{ width: SIDEBAR_WIDTH }}
          >
            <div className="shrink-0 p-3">
              <div className="mb-2 flex items-center gap-2">
                <OrganizationSwitcher />
                <NotificationBell />
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <div className="flex flex-col gap-5 px-3 pb-3">{children}</div>
            </ScrollArea>

            {utilities.length > 0 && (
              <div className="shrink-0 border-t border-border/50 px-3 pt-1 pb-3">
                <SidebarUtilities />
              </div>
            )}
          </div>
        </div>
      </aside>

      <Sheet open={isMobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[min(86vw,400px)] gap-0 border-r-0 bg-transparent p-0 shadow-none md:hidden"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <div className="flex h-full min-h-0">
            <div
              className="flex h-full w-[4.5rem] shrink-0 flex-col items-center border-r border-black/5 px-2 py-3"
              style={{
                background: 'color-mix(in oklch, var(--background) 88%, var(--foreground) 8%)',
              }}
            >
              <Link
                href="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center justify-center rounded-lg transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
                  <img
                    src={siteConfig.logo.icon}
                    alt={siteConfig.name}
                    className="size-5 invert dark:invert-0"
                  />
                </div>
              </Link>
              <MobileRailNavigation onNavigate={() => setMobileSidebarOpen(false)} />
            </div>

            <div
              className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-r-[1.7rem]"
              style={{
                background: 'color-mix(in oklch, var(--background) 94%, var(--foreground) 4%)',
              }}
            >
              <div className="shrink-0 border-b border-black/5 p-3">
                <div className="flex items-center gap-2">
                  <OrganizationSwitcher onNavigate={() => setMobileSidebarOpen(false)} />
                  <NotificationBell />
                </div>
              </div>

              <ScrollArea className="min-h-0 flex-1">
                <div
                  className="flex flex-col gap-5 px-3 py-3"
                  onClickCapture={handleMobileNavigationCapture}
                >
                  {children}
                </div>
              </ScrollArea>

              {utilities.length > 0 && (
                <div
                  className="shrink-0 border-t border-black/5 px-3 pt-1 pb-3"
                  onClickCapture={handleMobileNavigationCapture}
                >
                  <SidebarUtilities />
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

const MobileRailNavigation = ({ onNavigate }: { onNavigate: () => void }) => {
  const pathname = usePathname()
  const hasPermission = usePermissionChecker()
  const items = siteConfig.dashboard.sidebar.items.filter((item) =>
    item.visible ? hasPermission(item.visible) : true
  )

  return (
    <nav className="mt-4 flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto">
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex size-11 items-center justify-center rounded-2xl transition-colors duration-75 outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:bg-accent active:bg-accent/80',
            )}
            aria-label={item.title}
          >
            <HugeiconsIcon
              icon={item.icon}
              size={20}
              className={cn('shrink-0', isActive ? 'text-foreground' : 'text-muted-foreground')}
            />
            <span className="sr-only">{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}

const SidebarUtilities = () => {
  const pathname = usePathname()
  const utilities = siteConfig.dashboard.sidebar.utilities

  return (
    <nav className="flex flex-col gap-0.5">
      {utilities.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex h-8 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors duration-75',
              isActive
                ? 'bg-primary/10 font-medium text-primary hover:bg-primary/15'
                : 'text-foreground hover:bg-accent active:bg-accent/80',
            )}
          >
            <HugeiconsIcon
              icon={item.icon}
              size={16}
              className={cn('shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}
            />
            <span className="truncate">{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}

const OrganizationSwitcher = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { openOrganization } = useSettings()
  const {
    organizations,
    currentOrganization,
    isLoading,
    isMutating,
    switchOrganization,
    createOrganization,
  } = useOrganizations()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [slug, setSlug] = React.useState('')

  const handleSwitchOrganization = async (organizationId: string) => {
    const result = await switchOrganization(organizationId)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Organization switched')
    onNavigate?.()
  }

  const handleCreateOrganization = async () => {
    const trimmedName = name.trim()
    const trimmedSlug = slug.trim()

    if (!trimmedName) {
      toast.error('Organization name is required')
      return
    }

    const result = await createOrganization({
      name: trimmedName,
      ...(trimmedSlug ? { slug: trimmedSlug } : {}),
    })

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Organization created')
    setIsCreateDialogOpen(false)
    setName('')
    setSlug('')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-accent" />
          }
        >
          <span className="flex-1 truncate text-sm font-medium text-foreground">
            {isLoading ? 'Loading...' : (currentOrganization?.name ?? siteConfig.name)}
          </span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {organizations.map((organization) => (
            <DropdownMenuItem
              key={organization.id}
              onClick={() => handleSwitchOrganization(organization.id)}
              disabled={isMutating}
              className="justify-between gap-3"
            >
              <span className="truncate">
                {organization.name}
              </span>
              {organization.isCurrent ? (
                <HugeiconsIcon icon={Tick02Icon} size={16} className="text-primary" />
              ) : null}
            </DropdownMenuItem>
          ))}
          {organizations.length === 0 && (
            <DropdownMenuItem disabled>No organizations found</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
            Create organization
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              openOrganization('organization-general')
              onNavigate?.()
            }}
          >
            <HugeiconsIcon icon={UserSettingsIcon} size={16} className="mr-2" />
            Organization settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Create a new workspace and become its owner.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="new-organization-name">Name</Label>
              <Input
                id="new-organization-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Acme Inc"
                disabled={isMutating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-organization-slug">Slug (optional)</Label>
              <Input
                id="new-organization-slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="acme"
                disabled={isMutating}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrganization} disabled={isMutating || !name.trim()}>
              {isMutating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const NotificationBell = () => {
  const router = useRouter()
  const { open: openSettings } = useSettings()
  const { refresh: refreshOrganizations } = useOrganizations()
  const {
    notifications,
    unseenCount,
    isLoading,
    isMutating,
    markSeen,
    markRead,
    archive,
    remove,
    refresh,
    error,
  } = useNotifications()
  const [isOpen, setIsOpen] = React.useState(false)
  const [pendingDialog, setPendingDialog] = React.useState<{
    deliveryId: string
    title: string
    description: string
    confirmLabel: string
    cancelLabel: string
    confirmAction: Exclude<NotificationAction, { kind: 'alert_dialog' }>
  } | null>(null)

  const executeNotificationAction = React.useCallback(
    async (action: NotificationAction, deliveryId: string) => {
      if (action.kind === 'alert_dialog') {
        setPendingDialog({
          deliveryId,
          title: action.title,
          description: action.description,
          confirmLabel: action.confirmLabel ?? 'Continue',
          cancelLabel: action.cancelLabel ?? 'Cancel',
          confirmAction: action.confirmAction,
        })
        return
      }

      if (action.kind === 'route') {
        router.push(action.href)
      }

      if (action.kind === 'url') {
        if (action.target === '_blank') {
          window.open(action.url, '_blank', 'noopener,noreferrer')
        } else {
          window.location.href = action.url
        }
      }

      if (action.kind === 'open_settings') {
        openSettings({
          scope: action.scope ?? 'account',
          pageId: action.pageId,
        })
      }

      if (action.kind === 'accept_invitation') {
        const response = await fetch('/api/organizations/invitations/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: action.token }),
        })

        const payload = await response.json().catch(() => null)

        if (!response.ok) {
          toast.error(payload?.error ?? 'Could not accept invitation')
          return
        }

        toast.success('Invitation accepted')
        await refreshOrganizations()
        router.refresh()
      }

      await markRead([deliveryId])
    },
    [markRead, openSettings, refreshOrganizations, router]
  )

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open)

    if (open && unseenCount > 0) {
      const unseenDeliveryIds = notifications
        .filter((notification) => !notification.seenAt)
        .map((notification) => notification.deliveryId)

      if (unseenDeliveryIds.length > 0) {
        await markSeen(unseenDeliveryIds)
      }
    }
  }

  const handleConfirmDialogAction = async () => {
    if (!pendingDialog) {
      return
    }

    const { confirmAction, deliveryId } = pendingDialog
    setPendingDialog(null)
    await executeNotificationAction(confirmAction, deliveryId)
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger
          render={
            <button
              className="relative ml-auto flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
              aria-label="Notifications"
            />
          }
        >
          <HugeiconsIcon icon={Notification03Icon} size={16} />
          {unseenCount > 0 ? (
            <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
          ) : null}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => refresh()}
                disabled={isLoading || isMutating}
              >
                Refresh
              </Button>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.deliveryId} className="border-b last:border-b-0">
                <DropdownMenuItem
                  onClick={() =>
                    notification.actions[0]
                      ? executeNotificationAction(notification.actions[0], notification.deliveryId)
                      : markRead([notification.deliveryId])
                  }
                  className="flex flex-col items-start gap-1.5 p-2"
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span className="text-sm font-medium">{notification.title}</span>
                    {!notification.readAt ? (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{notification.body}</p>
                </DropdownMenuItem>
                <div className="flex gap-1 px-2 pb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => archive([notification.deliveryId])}
                    disabled={isMutating}
                  >
                    Archive
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => remove([notification.deliveryId])}
                    disabled={isMutating}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {!isLoading && notifications.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                No notifications yet.
              </div>
            ) : null}
            {isLoading ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                Loading notifications...
              </div>
            ) : null}
            {error ? (
              <div className="px-3 pb-3 text-xs text-destructive">{error}</div>
            ) : null}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={Boolean(pendingDialog)} onOpenChange={(open) => !open && setPendingDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pendingDialog?.title ?? 'Confirm action'}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDialog?.description ?? ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{pendingDialog?.cancelLabel ?? 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDialogAction}>
              {pendingDialog?.confirmLabel ?? 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export { ShellSidebar }
