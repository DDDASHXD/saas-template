'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { DiscordIcon, GithubIcon, NewTwitterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

import type { GenericLoginType } from '@/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'

interface LoginFormProps {
  enabledProviders: string[]
  genericLoginType: GenericLoginType
  requireEmailConfirmation: boolean
}

const providerConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  google: {
    label: 'Google',
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
    label: 'Discord',
    icon: <HugeiconsIcon icon={DiscordIcon} className="size-5" />,
  },
  github: {
    label: 'GitHub',
    icon: <HugeiconsIcon icon={GithubIcon} className="size-5" />,
  },
  twitter: {
    label: 'X',
    icon: <HugeiconsIcon icon={NewTwitterIcon} className="size-5" />,
  },
}

const LoginForm = ({
  enabledProviders,
  genericLoginType,
  requireEmailConfirmation,
}: LoginFormProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrlParam = searchParams.get("callbackUrl")
  const callbackUrl =
    callbackUrlParam && callbackUrlParam.startsWith("/") ? callbackUrlParam : "/overview"
  const callbackQuery =
    callbackUrl !== "/overview" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [otp, setOtp] = React.useState('')
  const [isOtpStep, setIsOtpStep] = React.useState(false)
  const [error, setError] = React.useState('')
  const [info, setInfo] = React.useState('')
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isResendingConfirmation, setIsResendingConfirmation] = React.useState(false)

  const confirmationSuccess = searchParams.get('confirmed') === '1'
  const resetSuccess = searchParams.get('reset') === 'success'
  const queryError = searchParams.get('error')

  const queryErrorMessage =
    queryError === 'invalid_confirmation_token'
      ? 'Confirmation link is invalid or expired.'
      : queryError === 'confirmation_failed'
        ? 'Could not confirm email. Please request a new confirmation email.'
        : ''

  const handlePasswordSignIn = async () => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      if (requireEmailConfirmation) {
        setPendingConfirmationEmail(email)
        setError('Invalid credentials or your email has not been confirmed yet.')
        return
      }

      setError('Invalid email or password.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  const requestOtpCode = async () => {
    const response = await fetch('/api/auth/request-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      setError(data?.error ?? 'Could not send sign-in code.')
      return
    }

    setIsOtpStep(true)
    setInfo('We sent a 6-digit sign-in code to your email.')
  }

  const handleOtpSignIn = async () => {
    const result = await signIn('credentials', {
      email,
      otp,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid or expired code.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setIsLoading(true)

    try {
      if (genericLoginType === 'emailAndPassword') {
        await handlePasswordSignIn()
      }

      if (genericLoginType === 'emailOTP') {
        if (!isOtpStep) {
          await requestOtpCode()
        } else {
          await handleOtpSignIn()
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl })
  }

  const handleResendConfirmation = async () => {
    if (!pendingConfirmationEmail) {
      return
    }

    setIsResendingConfirmation(true)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingConfirmationEmail }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? 'Could not resend confirmation email.')
        return
      }

      setInfo('If your account needs confirmation, a new email has been sent.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsResendingConfirmation(false)
    }
  }

  const title = genericLoginType === 'emailOTP' ? 'Sign In with Email Code' : 'Sign In'

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">{title}</h1>

      {confirmationSuccess && (
        <div className="w-full rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          Email confirmed. You can now sign in.
        </div>
      )}

      {resetSuccess && (
        <div className="w-full rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          Password reset complete. Sign in with your new password.
        </div>
      )}

      {queryErrorMessage && (
        <div className="w-full rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {queryErrorMessage}
        </div>
      )}

      {info && (
        <div className="w-full rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {info}
        </div>
      )}

      {error && (
        <div className="w-full rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {genericLoginType !== 'none' && (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isOtpStep}
            />
          </div>

          {genericLoginType === 'emailAndPassword' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          {genericLoginType === 'emailOTP' && isOtpStep && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="otp">6-digit code</Label>
              <InputOTP
                id="otp"
                inputMode="numeric"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={otp}
                onChange={setOtp}
                containerClassName="justify-center sm:justify-start mx-auto w-full"
                required
                disabled={isLoading}
              >
                <InputOTPGroup className="w-full">
                  <InputOTPSlot index={0} className="w-full" />
                  <InputOTPSlot index={1} className="w-full" />
                  <InputOTPSlot index={2} className="w-full" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="w-full">
                  <InputOTPSlot index={3} className="w-full" />
                  <InputOTPSlot index={4} className="w-full" />
                  <InputOTPSlot index={5} className="w-full" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? 'Please wait...'
              : genericLoginType === 'emailOTP' && !isOtpStep
                ? 'Send Code'
                : 'Sign In'}
          </Button>

          {genericLoginType === 'emailOTP' && isOtpStep && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={requestOtpCode}
              disabled={isLoading}
            >
              Resend Code
            </Button>
          )}

          {genericLoginType === 'emailOTP' && isOtpStep && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsOtpStep(false)
                setOtp('')
                setInfo('')
                setError('')
              }}
              disabled={isLoading}
            >
              Use another email
            </Button>
          )}
        </form>
      )}

      {requireEmailConfirmation && pendingConfirmationEmail && (
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={handleResendConfirmation}
          disabled={isResendingConfirmation}
        >
          {isResendingConfirmation
            ? 'Resending confirmation email...'
            : 'Resend confirmation email'}
        </Button>
      )}

      {enabledProviders.length > 0 && (
        <>
          <div className="flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              {genericLoginType === 'none' ? 'continue with' : 'or'}
            </span>
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

      {genericLoginType === 'none' && enabledProviders.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No login providers are configured.
        </p>
      )}

      {genericLoginType === 'emailAndPassword' && (
        <div className="flex justify-center gap-1 text-sm text-muted-foreground">
          <p>Don&apos;t have an account?</p>
          <Link href={`/register${callbackQuery}`} className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      )}

      {genericLoginType === 'emailOTP' && (
        <p className="text-center text-sm text-muted-foreground">
          Your account is created automatically after successful email verification.
        </p>
      )}
    </div>
  )
}

export { LoginForm }
