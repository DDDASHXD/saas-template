const DocsLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-5xl space-y-4 rounded-xl border bg-background p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        <div className="h-28 w-full animate-pulse rounded bg-muted" />
        <div className="h-28 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export default DocsLoading
