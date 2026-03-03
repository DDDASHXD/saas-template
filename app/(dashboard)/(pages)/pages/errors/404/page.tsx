import Link from 'next/link'

import {
  ErrorScene,
  errorActionPrimaryClass,
  errorActionSecondaryClass,
} from '@/components/errors/error-scene'
import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const Error404PreviewPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>404 Not Found</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Preview page and trigger route-level not found handling.
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <ErrorScene
          fullHeight={false}
          code="404"
          title="Page Not Found"
          description="The target page could not be found. It may have been moved or removed."
          actions={
            <>
              <Link href="/pages/errors/404/live" className={errorActionPrimaryClass}>
                Trigger Real 404
              </Link>
              <Link href="/pages" className={errorActionSecondaryClass}>
                Back to Pages
              </Link>
            </>
          }
        />
      </ShellBody>
    </>
  )
}

export default Error404PreviewPage
