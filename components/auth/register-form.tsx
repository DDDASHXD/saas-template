"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { DiscordIcon, GithubIcon, NewTwitterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { GenericLoginType } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterFormProps {
  enabledProviders: string[]
  genericLoginType: GenericLoginType
  requireEmailConfirmation: boolean
}

const providerConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  google: {
    label: "Google",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="size-5"
        aria-hidden="true"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
    ),
  },
  discord: {
    label: "Discord",
    icon: <HugeiconsIcon icon={DiscordIcon} className="size-5" />,
  },
  github: {
    label: "GitHub",
    icon: <HugeiconsIcon icon={GithubIcon} className="size-5" />,
  },
  twitter: {
    label: "X",
    icon: <HugeiconsIcon icon={NewTwitterIcon} className="size-5" />,
  },
}

const RegisterForm = ({
  enabledProviders,
  genericLoginType,
  requireEmailConfirmation,
}: RegisterFormProps) => {
  const router = useRouter()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? "Registration failed. Please try again.")

        if (data?.accountCreated) {
          setSuccess("Your account exists. Sign in and request a new confirmation email.")
        }
        return
      }

      if (data?.requiresEmailConfirmation || requireEmailConfirmation) {
        setSuccess("Account created. Check your email to confirm your account before signing in.")
        return
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        setSuccess("Account created. Please sign in manually.")
        router.push("/login")
        return
      }

      router.push("/overview")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/overview" })
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">Create Account</h1>

      {error && (
        <div className="w-full rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="w-full rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {success}
        </div>
      )}

      {genericLoginType === "emailAndPassword" ? (
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
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      ) : (
        <div className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          {genericLoginType === "emailOTP"
            ? "Email/password sign-up is disabled. Use the email code flow on the sign-in page."
            : "Direct email sign-up is disabled. Use an OAuth provider to continue."}
        </div>
      )}

      {enabledProviders.length > 0 && (
        <>
          <div className="flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex w-full flex-col gap-2">
            {enabledProviders.map((provider) => {
              const config = providerConfig[provider]
              if (!config) return null

              return (
                <Button
                  key={provider}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthSignIn(provider)}
                  disabled={isLoading}
                >
                  {config.icon}
                  {config.label}
                </Button>
              )
            })}
          </div>
        </>
      )}

      <div className="flex justify-center gap-1 text-sm text-muted-foreground">
        <p>Already have an account?</p>
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export { RegisterForm }
