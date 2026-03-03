import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const ResourcesPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Resources</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Access templates, downloads, and additional resources
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-muted-foreground">
          Your resources will appear here.
        </p>
      </ShellBody>
    </>
  )
}

export default ResourcesPage
