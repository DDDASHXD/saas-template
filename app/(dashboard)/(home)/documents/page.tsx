import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const DocumentsPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Documents</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Manage your documents and files
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-muted-foreground">
          Your documents will appear here.
        </p>
      </ShellBody>
    </>
  )
}

export default DocumentsPage
