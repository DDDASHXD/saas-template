import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const StarredProjectsPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Starred Projects</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Projects you have marked as favorites
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-muted-foreground">
          Your starred projects will appear here.
        </p>
      </ShellBody>
    </>
  )
}

export default StarredProjectsPage
