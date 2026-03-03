import * as React from "react"

interface ShellSidebarGroupProps {
  label?: string
  children: React.ReactNode
}

const ShellSidebarGroup = ({ label, children }: ShellSidebarGroupProps) => {
  return (
    <div>
      {label && (
        <div className="mb-2 pl-3 text-sm text-muted-foreground">{label}</div>
      )}
      <nav className="flex flex-col gap-0.5">{children}</nav>
    </div>
  )
}

export { ShellSidebarGroup }
