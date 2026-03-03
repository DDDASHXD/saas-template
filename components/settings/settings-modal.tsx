'use client'

import * as React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  Edit02Icon,
  InformationCircleIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/config'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useUser } from '@/hooks/use-user'
import { useOrganizations } from '@/components/providers/organization-provider'
import { useSettings } from './settings-context'
import { AccountPage } from './pages/account-page'
import { AppearancePage } from './pages/appearance-page'
import { ConnectionsPage } from './pages/connections-page'
import { NotificationsPage } from './pages/notifications-page'
import { OrganizationGeneralPage } from './pages/organization-general-page'
import { OrganizationMembersPage } from './pages/organization-members-page'
import { PlaceholderPage } from './pages/placeholder-page'

const pageComponents: Record<string, React.ReactNode> = {
  account: <AccountPage />,
  appearance: <AppearancePage />,
  connections: <ConnectionsPage />,
  notifications: <NotificationsPage />,
  'organization-general': <OrganizationGeneralPage />,
  'organization-members': <OrganizationMembersPage />,
}

const organizationSections = [
  {
    label: 'Organization',
    items: [
      { id: 'organization-general', label: 'General', icon: InformationCircleIcon },
      { id: 'organization-members', label: 'Members & Invitations', icon: UserGroupIcon },
    ],
  },
]

const getPageTitle = ({
  pageId,
  scope,
}: {
  pageId: string
  scope: 'account' | 'organization'
}): string => {
  const sections = scope === 'organization' ? organizationSections : siteConfig.dashboard.settings

  for (const section of sections) {
    const item = section.items.find((i) => i.id === pageId)
    if (item) return item.label
  }
  return pageId
}

const SettingsModal = () => {
  const { isOpen, close, activePage, setActivePage, scope } = useSettings()
  const { name, email, image, initials } = useUser()
  const { currentOrganization } = useOrganizations()
  const sections = scope === 'organization' ? organizationSections : siteConfig.dashboard.settings
  const title = getPageTitle({ pageId: activePage, scope })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogPortal>
        <DialogOverlay className="data-closed:animate-none" />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl text-sm ring-1 ring-foreground/10 outline-none sm:max-w-3xl md:max-w-4xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          style={
            {
              '--settings-chrome': 'color-mix(in oklch, var(--background) 95%, var(--foreground))',
            } as React.CSSProperties
          }
        >
          <div
            className="grid h-[min(80vh,680px)] min-h-0 grid-cols-1 sm:grid-cols-[240px_1fr]"
            style={{ background: 'var(--settings-chrome)' }}
          >
            <aside className="hidden min-h-0 flex-col sm:flex">
              <div className="flex items-center gap-2.5 p-4">
                {scope === 'account' ? (
                  <>
                    <Avatar className="size-9">
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{name}</p>
                      <p className="truncate text-xs text-muted-foreground">{email}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                      {currentOrganization?.name?.slice(0, 2).toUpperCase() || 'OR'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {currentOrganization?.name ?? 'Organization'}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {currentOrganization?.slug
                          ? `/${currentOrganization.slug}`
                          : 'Organization settings'}
                      </p>
                    </div>
                  </>
                )}
                <Button
                  variant="outline"
                  size="icon-xs"
                  aria-label={scope === 'account' ? 'Edit profile' : 'Edit organization'}
                  onClick={() =>
                    setActivePage(scope === 'account' ? 'account' : 'organization-general')
                  }
                >
                  <HugeiconsIcon icon={Edit02Icon} size={12} />
                </Button>
              </div>

              <ScrollArea className="min-h-0 flex-1">
                <nav className="flex flex-col gap-4 p-3">
                  {sections.map((section) => (
                    <div key={section.label ?? 'default'} className="flex flex-col gap-0.5">
                      {section.label && (
                        <p className="mb-1 px-2 text-[11px] font-medium text-muted-foreground">
                          {section.label}
                        </p>
                      )}
                      {section.items.map((item) => {
                        const isActive = activePage === item.id
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={cn(
                              'flex h-8 items-center gap-2.5 rounded-lg px-2 text-left text-sm transition-colors duration-75',
                              isActive
                                ? 'bg-primary/10 font-medium text-primary'
                                : 'text-foreground hover:bg-accent active:bg-accent/80',
                            )}
                          >
                            <HugeiconsIcon
                              icon={item.icon}
                              size={16}
                              className={cn(
                                'shrink-0',
                                isActive ? 'text-primary' : 'text-muted-foreground',
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </nav>
              </ScrollArea>
            </aside>

            <div className="flex min-h-0 flex-col p-2 pl-0 sm:pl-0">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background">
                <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
                  <DialogTitle className="text-base font-medium">{title}</DialogTitle>
                  <DialogPrimitive.Close
                    render={<Button variant="ghost" size="icon-sm" aria-label="Close" />}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
                  </DialogPrimitive.Close>
                </div>

                <ScrollArea className="min-h-0 flex-1">
                  <div className="p-5">
                    {pageComponents[activePage] ?? <PlaceholderPage title={title} />}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}

export { SettingsModal }
