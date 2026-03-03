import * as React from "react"

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <span className="text-lg text-muted-foreground">
          {title[0]?.toUpperCase()}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          This page is under construction. Content coming soon.
        </p>
      </div>
    </div>
  )
}

export { PlaceholderPage }
