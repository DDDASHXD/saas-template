import Link from 'next/link'

import {
  ErrorScene,
  errorActionPrimaryClass,
  errorActionSecondaryClass,
} from '@/components/errors/error-scene'

const ForbiddenPage = () => {
  return (
    <ErrorScene
      code="403"
      title="Access Forbidden"
      description="You are signed in, but your account does not have permission to view this resource."
      actions={
        <>
          <Link href="/overview" className={errorActionPrimaryClass}>
            Go to Overview
          </Link>
          <Link href="/login" className={errorActionSecondaryClass}>
            Switch Account
          </Link>
        </>
      }
    />
  )
}

export default ForbiddenPage
