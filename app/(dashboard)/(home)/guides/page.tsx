import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const GuidesPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Guides</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Browse tutorials and getting started guides
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-muted-foreground">
          Your guides will appear here.
        </p>
      </ShellBody>
    </>
  )
}

export default GuidesPage
