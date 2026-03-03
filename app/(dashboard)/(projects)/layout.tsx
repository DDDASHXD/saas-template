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

const ProjectsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Shell>
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
