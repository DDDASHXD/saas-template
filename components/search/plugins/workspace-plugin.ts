"use client"

import {
  Logout03Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "@hugeicons/core-free-icons"

import { defineSearchPlugin } from "../search-helpers"
import type {
  SearchAction,
  SearchActionHelpers,
  SearchPlugin,
} from "../search-types"

const workspacePlugin: SearchPlugin = defineSearchPlugin({
  id: "workspace",
  getActions: (context): SearchAction[] => [
    {
      id: "workspace:toggle-sidebar",
      title: context.isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar",
      description: "Toggle the navigation panel",
      section: "Workspace",
      icon: context.isSidebarOpen ? PanelLeftCloseIcon : PanelLeftOpenIcon,
      shortcut: "Cmd B",
      keywords: ["sidebar", "panel", "navigation", "toggle"],
      keepOpen: true,
      perform: () => {
        context.toggleSidebar()
      },
    },
    {
      id: "workspace:logout",
      title: "Log Out",
      description: "Sign out of the current session",
      section: "Workspace",
      icon: Logout03Icon,
      keywords: ["logout", "sign out", "session"],
      confirm: {
        title: "Log out?",
        description: "You will be signed out of the current session.",
        confirmLabel: "Log out",
        cancelLabel: "Stay here",
        variant: "destructive",
      },
      perform: async ({ close }: SearchActionHelpers) => {
        close()
        await context.signOut()
      },
    },
  ],
})

export { workspacePlugin }
