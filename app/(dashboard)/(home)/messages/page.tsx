import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const MessagesPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Messages</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          View and manage your conversations
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <p className="text-muted-foreground">
          Your messages will appear here.
        </p>
      </ShellBody>
    </>
  )
}

export default MessagesPage
