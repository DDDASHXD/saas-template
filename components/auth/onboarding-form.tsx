"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const OnboardingForm = () => {
  const [name, setName] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.")
        setIsLoading(false)
        return
      }

      window.location.href = "/overview"
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold">Welcome! What's your name?</h1>
        <p className="text-sm text-muted-foreground">
          Let us know what to call you.
        </p>
      </div>

      {error && (
        <div className="w-full rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            autoFocus
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !name.trim()}>
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </div>
  )
}

export { OnboardingForm }
