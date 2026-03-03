'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import {
  ErrorScene,
  errorActionPrimaryClass,
  errorActionSecondaryClass,
} from '@/components/errors/error-scene'

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorScene
      code="500"
      title="Internal Server Error"
      description="Something unexpected happened while rendering this page."
      details={
        process.env.NODE_ENV === 'development' ? (
          <pre className="overflow-auto rounded-xl border bg-background/60 p-3 text-xs">{error.message}</pre>
        ) : null
      }
      actions={
        <>
          <button type="button" className={errorActionPrimaryClass} onClick={() => reset()}>
            Try Again
          </button>
          <Link href="/" className={errorActionSecondaryClass}>
            Back Home
          </Link>
        </>
      }
    />
  )
}

export default GlobalError
