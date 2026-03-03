import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"

interface ShellSidebarButtonProps {
  icon: IconSvgElement
  children: React.ReactNode
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link"
  onClick?: () => void
}

const ShellSidebarButton = ({
  icon,
  children,
  variant = "default",
  onClick,
}: ShellSidebarButtonProps) => {
  return (
    <Button
      variant={variant}
      className="w-full justify-start gap-2"
      onClick={onClick}
    >
      <HugeiconsIcon icon={icon} size={16} />
      {children}
    </Button>
  )
}

export { ShellSidebarButton }
