'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { Notification03Icon, ArrowDown01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/config'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSidebar } from './shell-context'

const SIDEBAR_WIDTH = 240

const ShellSidebar = ({ children }: { children: React.ReactNode }) => {
  const { isPanelOpen } = useSidebar()
  const utilities = siteConfig.dashboard.sidebar.utilities

  return (
    <aside
      className="sticky top-0 z-40 hidden h-screen transition-[width] duration-300 md:block"
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

const OrganizationSwitcher = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-accent" />
        }
      >
        <span className="flex-1 truncate text-sm font-medium text-foreground">
          {siteConfig.name}
        </span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{siteConfig.name}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
          Create organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const NotificationBell = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto size-8 text-muted-foreground hover:bg-accent"
      aria-label="Notifications"
    >
      <HugeiconsIcon icon={Notification03Icon} size={16} />
    </Button>
  )
}

export { ShellSidebar }
