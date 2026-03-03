"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const connections = [
  {
    name: "Google",
    description: "Sign in with your Google account",
    connected: true,
  },
  {
    name: "GitHub",
    description: "Connect your GitHub account for code integrations",
    connected: false,
  },
  {
    name: "Discord",
    description: "Link your Discord account for community access",
    connected: false,
  },
  {
    name: "Slack",
    description: "Receive notifications in your Slack workspace",
    connected: true,
  },
]

const ConnectionsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label>Connected Accounts</Label>
        <p className="text-xs text-muted-foreground">
          Manage your connected accounts and integrations.
        </p>
      </div>

      <div className="flex flex-col gap-0">
        {connections.map((connection, i) => (
          <div
            key={connection.name}
            className={`flex items-center justify-between border p-3 ${
              i === 0 ? "rounded-t-lg" : ""
            } ${
              i === connections.length - 1 ? "rounded-b-lg" : "border-b-0"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                {connection.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{connection.name}</p>
                <p className="text-xs text-muted-foreground">
                  {connection.description}
                </p>
              </div>
            </div>
            <Button
              variant={connection.connected ? "outline" : "default"}
              size="sm"
            >
              {connection.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ConnectionsPage }
