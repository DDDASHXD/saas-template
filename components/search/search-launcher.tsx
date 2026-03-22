"use client"

import * as React from "react"
import { SearchIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useSearch } from "./search-provider"

interface SearchLauncherProps {
  variant?: "sidebar" | "icon"
  className?: string
}

const SearchLauncher = ({
  variant = "sidebar",
  className,
}: SearchLauncherProps) => {
  const { open } = useSearch()

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label="Open search"
        className={cn(
          "flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <HugeiconsIcon icon={SearchIcon} size={18} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "group flex h-9 w-full items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3 text-left text-sm outline-none transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <HugeiconsIcon icon={SearchIcon} size={16} className="text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate text-foreground">Search actions</span>
      <span className="rounded-md border border-border/80 bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        Cmd K
      </span>
    </button>
  )
}

export { SearchLauncher }
