import * as React from 'react'

import { cn } from '@/lib/utils'

interface ErrorSceneProps {
  code: '403' | '404' | '500'
  title: string
  description: string
  details?: React.ReactNode
  actions?: React.ReactNode
  fullHeight?: boolean
}

export const errorActionPrimaryClass =
  'inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'

export const errorActionSecondaryClass =
  'inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent'

const ErrorScene = ({
  code,
  title,
  description,
  details,
  actions,
  fullHeight = true,
}: ErrorSceneProps) => {
  return (
    <main
      className={cn(
        'relative isolate overflow-hidden bg-background',
        fullHeight ? 'min-h-screen' : 'min-h-[34rem] rounded-2xl border border-border',
      )}
    >
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-4xl flex-col justify-center px-6 py-16 md:px-12',
          fullHeight && 'min-h-screen',
        )}
      >
        <div className="mb-8 text-7xl leading-none font-black tracking-tight text-foreground/15 md:text-9xl">
          {code}
        </div>

        <div className="space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>

          {details && <div className="max-w-2xl text-sm text-muted-foreground">{details}</div>}

          {actions && <div className="flex flex-wrap gap-3 pt-2">{actions}</div>}
        </div>
      </div>
    </main>
  )
}

export { ErrorScene }
