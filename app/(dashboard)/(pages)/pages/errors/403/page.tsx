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

const Error403PreviewPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>403 Forbidden</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Preview page and trigger route-level forbidden handling.
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <ErrorScene
          fullHeight={false}
          code="403"
          title="Access Forbidden"
          description="You are signed in, but your role does not allow access to this resource."
          actions={
            <>
              <Link href="/pages/errors/403/live" className={errorActionPrimaryClass}>
                Trigger Real 403
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

export default Error403PreviewPage
