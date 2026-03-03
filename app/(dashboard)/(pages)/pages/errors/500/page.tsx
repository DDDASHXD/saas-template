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

const Error500PreviewPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>500 Server Error</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Preview page and trigger the runtime error boundary.
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <ErrorScene
          fullHeight={false}
          code="500"
          title="Internal Server Error"
          description="An unexpected failure occurred while processing this request."
          actions={
            <>
              <Link href="/pages/errors/500/live" className={errorActionPrimaryClass}>
                Trigger Real 500
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

export default Error500PreviewPage
