import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const ProjectsPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>All Projects</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Browse and manage all your projects
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-muted-foreground">
          Your projects will appear here.
        </p>
      </ShellBody>
    </>
  )
}

export default ProjectsPage
