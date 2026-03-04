"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Logout03Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { signOut } from "next-auth/react"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/config"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSettings } from "@/components/settings"
import { useUser } from "@/hooks/use-user"
import { usePermissionChecker } from "@/hooks/use-permission"
import { useSidebar } from "./shell-context"

const ShellRail = () => {
  const pathname = usePathname()
  const { isPanelOpen, togglePanel } = useSidebar()
  const items = siteConfig.dashboard.sidebar.items
  const hasPermission = usePermissionChecker()
  const visibleItems = items.filter((item) =>
    item.visible ? hasPermission(item.visible) : true
  )

  return (
    <TooltipProvider>
      <div className="hidden h-full w-16 flex-col items-center justify-between md:flex">
        <div className="flex flex-col items-center gap-3 p-2">
          <div className="pt-2 pb-1">
            <Link
              href="/"
              className="flex items-center justify-center rounded-lg transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex size-8 items-center justify-center rounded-sm bg-primary">
                <img
                  src={siteConfig.logo.icon}
                  alt={siteConfig.name}
                  className="size-5 invert dark:invert-0"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-3">
            {visibleItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger
                    render={
                      <Link
                        href={item.href}
                        aria-label={item.title}
                        className={cn(
                          "relative flex size-11 items-center justify-center rounded-lg transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive
                            ? "bg-background text-foreground"
                            : "text-muted-foreground hover:bg-accent active:bg-accent/80",
                        )}
                      />
                    }
                  >
                    <HugeiconsIcon icon={item.icon} size={20} />
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 py-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11 text-muted-foreground hover:bg-accent active:bg-accent/80"
                  onClick={togglePanel}
                  aria-label={isPanelOpen ? "Collapse sidebar" : "Expand sidebar"}
                  aria-expanded={isPanelOpen}
                />
              }
            >
              <HugeiconsIcon
                icon={isPanelOpen ? PanelLeftCloseIcon : PanelLeftOpenIcon}
                size={16}
              />
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              <span>{isPanelOpen ? "Collapse" : "Expand"}</span>
              <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {"\u2318"}B
              </kbd>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <div className="flex size-11 items-center justify-center" />
              }
            >
              <RailUserMenu />
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Account
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

const RailUserMenu = () => {
  const { open, openOrganization } = useSettings()
  const { name, email, image, initials } = useUser()
  const settingsSections = siteConfig.dashboard.settings
  const topItems = settingsSections[0]?.items.slice(0, 3) ?? []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="flex size-11 items-center justify-center rounded-lg hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring active:bg-accent/80"
            aria-label="Account"
          />
        }
      >
        <Avatar className="size-7">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {topItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => open(item.id)}
          >
            <HugeiconsIcon icon={item.icon} size={16} className="text-muted-foreground" />
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={() => openOrganization("organization-general")}>
          <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-muted-foreground" />
          Organization settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-destructive"
        >
          <HugeiconsIcon icon={Logout03Icon} size={16} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ShellRail }
