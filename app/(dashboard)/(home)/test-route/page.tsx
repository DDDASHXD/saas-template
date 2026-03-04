import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const TestRoutePage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Test Route</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Use this page to test shell rail and sidebar navigation wiring.
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-sm text-muted-foreground">
          This is a basic test route page inside the home dashboard group.
        </p>
      </ShellBody>
    </>
  )
}

export default TestRoutePage
