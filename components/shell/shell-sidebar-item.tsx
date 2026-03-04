"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import type { PermissionId } from "@/permissions"
import { usePermissionChecker } from "@/hooks/use-permission"
import { cn } from "@/lib/utils"

interface ShellSidebarItemProps {
  icon: IconSvgElement
  href: string
  visible?: PermissionId
  children: React.ReactNode
}

const ShellSidebarItem = ({ icon, href, visible, children }: ShellSidebarItemProps) => {
  const pathname = usePathname()
  const hasPermission = usePermissionChecker()
  const isActive = pathname === href

  if (visible && !hasPermission(visible)) {
    return null
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-lg px-3 text-sm leading-none transition-[background-color,color,font-weight] duration-75",
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "text-foreground hover:bg-accent",
      )}
    >
      <HugeiconsIcon
        icon={icon}
        size={16}
        className={cn(
          "shrink-0",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      />
      <span className="truncate">{children}</span>
    </Link>
  )
}

export { ShellSidebarItem }
