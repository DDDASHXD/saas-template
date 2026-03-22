import {
  Add01Icon,
  DocumentAttachmentIcon,
  Calendar03Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"

import {
  Shell,
  ShellContent,
  ShellSidebar,
  ShellSidebarButton,
  ShellSidebarGroup,
  ShellSidebarItem,
} from "@/components/shell"
import { getMdxSidebarTree } from "@/lib/mdx-docs"
import { getInitialOrganizationData } from "@/lib/organization-server"

const ProjectsLayout = async ({ children }: { children: React.ReactNode }) => {
  const initialOrganizationData = await getInitialOrganizationData()
  const docsNodes = await getMdxSidebarTree("/docs")

  return (
    <Shell initialOrganizationData={initialOrganizationData} docsNodes={docsNodes}>
      <ShellSidebar>
        <ShellSidebarButton icon={Add01Icon} variant="default">
          New Project
        </ShellSidebarButton>
        <ShellSidebarGroup>
          <ShellSidebarItem icon={DocumentAttachmentIcon} href="/projects">
            All Projects
          </ShellSidebarItem>
          <ShellSidebarItem icon={Calendar03Icon} href="/projects/recent">
            Recent
          </ShellSidebarItem>
          <ShellSidebarItem icon={StarIcon} href="/projects/starred">
            Starred
          </ShellSidebarItem>
        </ShellSidebarGroup>
      </ShellSidebar>
      <ShellContent>{children}</ShellContent>
    </Shell>
  )
}

export default ProjectsLayout
