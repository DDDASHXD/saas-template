"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface ToggleProps {
  enabled: boolean
  onToggle: () => void
}

const Toggle = ({ enabled, onToggle }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
    className={cn(
      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      enabled ? "bg-primary" : "bg-input",
    )}
  >
    <span
      className={cn(
        "pointer-events-none block size-4 rounded-full bg-background shadow-sm ring-0 transition-transform",
        enabled ? "translate-x-4" : "translate-x-0",
      )}
    />
  </button>
)

const NotificationsPage = () => {
  const [email, setEmail] = React.useState(true)
  const [push, setPush] = React.useState(false)
  const [marketing, setMarketing] = React.useState(false)
  const [security, setSecurity] = React.useState(true)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4">
        <div>
          <Label>Notification Preferences</Label>
          <p className="text-xs text-muted-foreground">
            Choose which notifications you would like to receive.
          </p>
        </div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between rounded-t-lg border p-3">
            <div>
              <p className="text-sm font-medium">Email notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Toggle enabled={email} onToggle={() => setEmail(!email)} />
          </div>
          <div className="flex items-center justify-between border-x border-b p-3">
            <div>
              <p className="text-sm font-medium">Push notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive push notifications in your browser
              </p>
            </div>
            <Toggle enabled={push} onToggle={() => setPush(!push)} />
          </div>
          <div className="flex items-center justify-between border-x border-b p-3">
            <div>
              <p className="text-sm font-medium">Marketing emails</p>
              <p className="text-xs text-muted-foreground">
                Receive emails about new features and updates
              </p>
            </div>
            <Toggle enabled={marketing} onToggle={() => setMarketing(!marketing)} />
          </div>
          <div className="flex items-center justify-between rounded-b-lg border-x border-b p-3">
            <div>
              <p className="text-sm font-medium">Security alerts</p>
              <p className="text-xs text-muted-foreground">
                Get notified about security events on your account
              </p>
            </div>
            <Toggle enabled={security} onToggle={() => setSecurity(!security)} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div>
          <Label>Quiet Hours</Label>
          <p className="text-xs text-muted-foreground">
            Set times when you don&apos;t want to receive notifications.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">From</span>
          <input
            type="time"
            defaultValue="22:00"
            className="rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="time"
            defaultValue="08:00"
            className="rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export { NotificationsPage }
