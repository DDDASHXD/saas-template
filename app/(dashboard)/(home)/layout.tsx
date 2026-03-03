import {
  Add01Icon,
  BookOpen01Icon,
  DocumentAttachmentIcon,
  FolderLibraryIcon,
  Home01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons"

import {
  Shell,
  ShellContent,
  ShellSidebar,
  ShellSidebarButton,
  ShellSidebarGroup,
  ShellSidebarItem,
} from "@/components/shell"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Shell>
      <ShellSidebar>
        <ShellSidebarButton icon={Add01Icon} variant="default">
          New
        </ShellSidebarButton>
        <ShellSidebarGroup>
          <ShellSidebarItem icon={Home01Icon} href="/overview">
            Overview
          </ShellSidebarItem>
          <ShellSidebarItem icon={DocumentAttachmentIcon} href="/documents">
            Documents
          </ShellSidebarItem>
          <ShellSidebarItem icon={Message01Icon} href="/messages">
            Messages
          </ShellSidebarItem>
        </ShellSidebarGroup>
        <ShellSidebarGroup label="Library">
          <ShellSidebarItem icon={BookOpen01Icon} href="/guides">
            Guides
          </ShellSidebarItem>
          <ShellSidebarItem icon={FolderLibraryIcon} href="/resources">
            Resources
          </ShellSidebarItem>
        </ShellSidebarGroup>
      </ShellSidebar>
      <ShellContent>{children}</ShellContent>
    </Shell>
  )
}

export default HomeLayout
