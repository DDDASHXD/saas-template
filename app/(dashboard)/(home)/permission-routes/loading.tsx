import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const PermissionRoutesLoading = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Permission Routes</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Loading permission checks...
        </ShellContentHeaderDescription>
      </ShellContentHeader>

      <ShellBody className="gap-8">
        <section className="overflow-hidden rounded-xl border bg-[var(--shell-panel)]">
          <div className="space-y-2 p-4">
            <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
          </div>
        </section>
      </ShellBody>
    </>
  )
}

export default PermissionRoutesLoading
