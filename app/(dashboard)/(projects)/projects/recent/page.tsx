import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const RecentProjectsPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Recent Projects</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Projects you have worked on recently
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-muted-foreground">
          Your recent projects will appear here.
        </p>
      </ShellBody>
    </>
  )
}

export default RecentProjectsPage
