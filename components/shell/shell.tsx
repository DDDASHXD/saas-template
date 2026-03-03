"use client"

import * as React from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Logout03Icon } from "@hugeicons/core-free-icons"

import { siteConfig } from "@/config"
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
import { Separator } from "@/components/ui/separator"
import { SettingsProvider, SettingsModal, useSettings } from "@/components/settings"
import { useUser } from "@/hooks/use-user"
import { SidebarProvider } from "./shell-context"
import { ShellRail } from "./shell-rail"

const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <SettingsProvider>
      <SidebarProvider>
        <div
          className="flex h-screen flex-col overflow-hidden bg-[var(--shell-chrome)]"
          style={
            {
              "--shell-panel":
                "color-mix(in oklch, var(--background) 94%, var(--foreground))",
              "--shell-chrome":
                "color-mix(in oklch, var(--background) 88%, var(--foreground))",
            } as React.CSSProperties
          }
        >
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary">
                <img
                  src={siteConfig.logo.icon}
                  alt={siteConfig.name}
                  className="size-6 text-primary-foreground invert dark:invert-0"
                />
              </div>
            </Link>
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <div className="shrink-0 text-sm font-medium">
              {siteConfig.name}
            </div>
            <div className="ml-auto">
              <MobileUserMenu />
            </div>
          </header>

          <div className="flex min-h-0 flex-1 md:grid md:grid-cols-[4rem_min-content_minmax(0,1fr)]">
            <ShellRail />
            {children}
          </div>
        </div>
        <SettingsModal />
      </SidebarProvider>
    </SettingsProvider>
  )
}

const MobileUserMenu = () => {
  const { open } = useSettings()
  const { name, email, image, initials } = useUser()
  const settingsSections = siteConfig.dashboard.settings
  const topItems = settingsSections[0]?.items.slice(0, 3) ?? []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="flex size-8 items-center justify-center rounded-lg outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Account"
          />
        }
      >
        <Avatar className="size-7">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {email}
              </p>
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

export { Shell }
