import {
  File02Icon,
  SecurityCheckIcon,
  HelpCircleIcon,
  Notification03Icon,
} from '@hugeicons/core-free-icons'

import {
  Shell,
  ShellContent,
  ShellSidebar,
  ShellSidebarGroup,
  ShellSidebarItem,
} from '@/components/shell'
import { getInitialOrganizationData } from '@/lib/organization-server'

const PagesLayout = async ({ children }: { children: React.ReactNode }) => {
  const initialOrganizationData = await getInitialOrganizationData()

  return (
    <Shell initialOrganizationData={initialOrganizationData}>
      <ShellSidebar>
        <ShellSidebarGroup>
          <ShellSidebarItem icon={File02Icon} href="/pages">
            All Pages
          </ShellSidebarItem>
        </ShellSidebarGroup>

        <ShellSidebarGroup label="Errors">
          <ShellSidebarItem icon={SecurityCheckIcon} href="/pages/errors/403">
            403 Forbidden
          </ShellSidebarItem>
          <ShellSidebarItem icon={HelpCircleIcon} href="/pages/errors/404">
            404 Not Found
          </ShellSidebarItem>
          <ShellSidebarItem icon={Notification03Icon} href="/pages/errors/500">
            500 Server Error
          </ShellSidebarItem>
        </ShellSidebarGroup>
      </ShellSidebar>

      <ShellContent>{children}</ShellContent>
    </Shell>
  )
}

export default PagesLayout
