"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const themes = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
] as const

const AppearancePage = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4">
        <div>
          <Label>Theme</Label>
          <p className="text-xs text-muted-foreground">
            Select the theme for the application.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                theme === t.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-foreground/20",
              )}
            >
              <div
                className={cn(
                  "flex h-16 w-full items-end gap-1 rounded-md border p-2",
                  t.id === "dark"
                    ? "border-zinc-700 bg-zinc-900"
                    : t.id === "light"
                      ? "border-zinc-200 bg-white"
                      : "border-zinc-300 bg-linear-to-r from-white to-zinc-900",
                )}
              >
                <div
                  className={cn(
                    "h-2 w-1/3 rounded-sm",
                    t.id === "dark" ? "bg-zinc-700" : "bg-zinc-200",
                  )}
                />
                <div
                  className={cn(
                    "h-3 w-1/3 rounded-sm",
                    t.id === "dark" ? "bg-zinc-600" : "bg-zinc-300",
                  )}
                />
              </div>
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { AppearancePage }
