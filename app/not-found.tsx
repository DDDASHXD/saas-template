import Link from 'next/link'

import {
  ErrorScene,
  errorActionPrimaryClass,
  errorActionSecondaryClass,
} from '@/components/errors/error-scene'

const NotFoundPage = () => {
  return (
    <ErrorScene
      code="404"
      title="Page Not Found"
      description="The page you requested does not exist, has moved, or is no longer available."
      actions={
        <>
          <Link href="/" className={errorActionPrimaryClass}>
            Back Home
          </Link>
          <Link href="/overview" className={errorActionSecondaryClass}>
            Open Dashboard
          </Link>
        </>
      }
    />
  )
}

export default NotFoundPage
