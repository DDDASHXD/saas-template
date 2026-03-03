import {
  Add01Icon,
  BookOpen01Icon,
  DatabaseExportIcon,
  DocumentAttachmentIcon,
  File02Icon,
  FolderLibraryIcon,
  Home01Icon,
  InformationCircleIcon,
  Message01Icon,
} from '@hugeicons/core-free-icons'

import {
  Shell,
  ShellContent,
  ShellSidebar,
  ShellSidebarButton,
  ShellSidebarGroup,
  ShellSidebarItem,
} from '@/components/shell'

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
          <ShellSidebarItem icon={File02Icon} href="/lists">
            Lists
          </ShellSidebarItem>
          <ShellSidebarItem icon={DatabaseExportIcon} href="/tables">
            Tables
          </ShellSidebarItem>
          <ShellSidebarItem icon={InformationCircleIcon} href="/documentation">
            Documentation
          </ShellSidebarItem>
        </ShellSidebarGroup>
        <ShellSidebarGroup label="Workspace">
          <ShellSidebarItem icon={DocumentAttachmentIcon} href="/documents">
            Documents
          </ShellSidebarItem>
          <ShellSidebarItem icon={Message01Icon} href="/messages">
            AI Chat
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
