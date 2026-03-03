import {
  Shell,
  ShellContent,
  ShellSidebar,
  MdxSidebarTree,
} from "@/components/shell"
import { getMdxSidebarTree } from "@/lib/mdx-docs"

const DocsLayout = async ({ children }: { children: React.ReactNode }) => {
  const nodes = await getMdxSidebarTree("/docs")

  return (
    <Shell>
      <ShellSidebar>
        <div className="px-2 pb-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Documentation
          </p>
        </div>
        {nodes.length > 0 ? (
          <MdxSidebarTree nodes={nodes} />
        ) : (
          <p className="px-2 text-sm text-muted-foreground">
            No documentation files found.
          </p>
        )}
      </ShellSidebar>
      <ShellContent>{children}</ShellContent>
    </Shell>
  )
}

export default DocsLayout
