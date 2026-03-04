import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const PermissionsLabLoading = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Permissions Lab</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Loading role and permission data...
        </ShellContentHeaderDescription>
      </ShellContentHeader>

      <ShellBody className="gap-8">
        <section className="rounded-xl border bg-[var(--shell-panel)] p-5">
          <div className="space-y-3">
            <div className="h-8 w-44 animate-pulse rounded bg-muted" />
            <div className="h-8 w-44 animate-pulse rounded bg-muted" />
            <div className="h-28 w-full animate-pulse rounded bg-muted" />
          </div>
        </section>
      </ShellBody>
    </>
  )
}

export default PermissionsLabLoading
