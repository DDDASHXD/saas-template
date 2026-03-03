"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, File02Icon, FolderLibraryIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { MdxDocsSidebarNode } from "@/types/docs"

interface MdxSidebarTreeProps {
  nodes: MdxDocsSidebarNode[]
}

const isPathActive = (pathname: string, href?: string) => {
  if (!href) {
    return false
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

const hasActiveDescendant = (pathname: string, node: MdxDocsSidebarNode): boolean => {
  if (isPathActive(pathname, node.href)) {
    return true
  }

  if (node.kind !== "folder" || !node.children) {
    return false
  }

  return node.children.some((child) => hasActiveDescendant(pathname, child))
}

const MdxSidebarTree = ({ nodes }: MdxSidebarTreeProps) => {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Documentation">
      {nodes.map((node) => (
        <MdxSidebarNodeItem key={`${node.kind}-${node.href ?? node.title}`} node={node} depth={0} pathname={pathname} />
      ))}
    </nav>
  )
}

const MdxSidebarNodeItem = ({
  node,
  depth,
  pathname,
}: {
  node: MdxDocsSidebarNode
  depth: number
  pathname: string
}) => {
  if (node.kind === "file") {
    return <MdxSidebarFileNode node={node} depth={depth} pathname={pathname} />
  }

  return <MdxSidebarFolderNode node={node} depth={depth} pathname={pathname} />
}

const MdxSidebarFileNode = ({
  node,
  depth,
  pathname,
}: {
  node: MdxDocsSidebarNode
  depth: number
  pathname: string
}) => {
  const isActive = isPathActive(pathname, node.href)

  return (
    <Link
      href={node.href ?? "#"}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-lg pr-2 text-sm leading-none transition-[background-color,color,font-weight] duration-75",
        isActive ? "bg-primary/10 font-medium text-primary" : "text-foreground hover:bg-accent"
      )}
      style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}
    >
      <HugeiconsIcon icon={File02Icon} size={14} className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
      <span className="truncate">{node.title}</span>
    </Link>
  )
}

const MdxSidebarFolderNode = ({
  node,
  depth,
  pathname,
}: {
  node: MdxDocsSidebarNode
  depth: number
  pathname: string
}) => {
  const isActiveBranch = hasActiveDescendant(pathname, node)
  const [isOpen, setIsOpen] = React.useState(isActiveBranch)

  React.useEffect(() => {
    if (isActiveBranch) {
      setIsOpen(true)
    }
  }, [isActiveBranch])

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          "flex h-8 items-center rounded-lg pr-1 text-sm",
          isActiveBranch ? "bg-primary/5 text-foreground" : "text-muted-foreground hover:bg-accent"
        )}
        style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
          <HugeiconsIcon icon={FolderLibraryIcon} size={14} className="shrink-0" />
          {node.href ? (
            <Link href={node.href} className="truncate text-sm text-foreground hover:underline">
              {node.title}
            </Link>
          ) : (
            <span className="truncate text-sm text-foreground">{node.title}</span>
          )}
        </div>
        <CollapsibleTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-background/70">
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            className={cn("transition-transform duration-150", isOpen ? "rotate-0" : "-rotate-90")}
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="mt-0.5 flex flex-col gap-0.5">
          {(node.children ?? []).map((child) => (
            <MdxSidebarNodeItem
              key={`${child.kind}-${child.href ?? child.title}`}
              node={child}
              depth={depth + 1}
              pathname={pathname}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { MdxSidebarTree }
