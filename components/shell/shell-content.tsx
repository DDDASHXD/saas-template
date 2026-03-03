"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useSidebar } from "./shell-context"

const ShellContent = ({ children }: { children: React.ReactNode }) => {
  const { isPanelOpen } = useSidebar()

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background md:bg-[var(--shell-chrome)] md:py-2 md:pr-2">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "absolute top-0 -left-2 z-0 hidden h-3 w-5 bg-[var(--shell-panel)] transition-opacity duration-300 md:block",
            isPanelOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 -left-2 z-0 hidden h-3 w-5 bg-[var(--shell-panel)] transition-opacity duration-300 md:block",
            isPanelOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <main className="z-10 flex min-h-0 flex-1 flex-col overflow-y-auto bg-background md:rounded-xl">
          {children}
        </main>
      </div>
    </div>
  )
}

export { ShellContent }
