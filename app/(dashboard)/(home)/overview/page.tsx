import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const OverviewPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Overview</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>Welcome to your dashboard</ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-muted-foreground">
          This is your overview page. Start building your application here.
        </p>
        hello world
      </ShellBody>
    </>
  )
}

export default OverviewPage
