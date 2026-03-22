"use client"

import {
  ArrowRight01Icon,
  BookOpen01Icon,
  File02Icon,
  FolderLibraryIcon,
} from "@hugeicons/core-free-icons"

import { siteConfig } from "@/config"
import type { MdxDocsSidebarNode } from "@/types/docs"
import { defineSearchPlugin } from "../search-helpers"
import type {
  SearchAction,
  SearchActionHelpers,
  SearchPlugin,
  SearchRuntimeContext,
} from "../search-types"

const createDocNodeAction = (
  node: MdxDocsSidebarNode,
  context: SearchRuntimeContext,
): SearchAction => {
  if (node.kind === "file") {
    return {
      id: `doc:${node.href ?? node.title}`,
      title: node.title,
      description: node.href,
      icon: File02Icon,
      keywords: [node.href ?? "", "docs", "documentation"],
      perform: ({ close }: SearchActionHelpers) => {
        if (node.href) {
          context.navigate(node.href)
          close()
        }
      },
    }
  }

  return {
    id: `doc-folder:${node.href ?? node.title}`,
    title: node.title,
    description: node.href ? `Browse ${node.title}` : "Documentation section",
    icon: FolderLibraryIcon,
    keywords: [node.href ?? "", "docs", "documentation", "folder"],
    children: [
      ...(node.href
        ? [
            {
              id: `doc-folder-open:${node.href}`,
              title: `Open ${node.title}`,
              description: node.href,
              icon: ArrowRight01Icon,
              keywords: [node.href, "overview", "open"],
              perform: ({ close }: SearchActionHelpers) => {
                context.navigate(node.href!)
                close()
              },
            } satisfies SearchAction,
          ]
        : []),
      ...(node.children ?? []).map((child) => createDocNodeAction(child, context)),
    ],
  }
}

const navigationPlugin: SearchPlugin = defineSearchPlugin({
  id: "navigation",
  getActions: (context) => {
    const primaryActions: SearchAction[] = siteConfig.dashboard.sidebar.items
      .filter((item) => (item.visible ? context.hasPermission(item.visible) : true))
      .map((item) => ({
        id: `nav:${item.href}`,
        title: item.title,
        description: item.href,
        section: "Navigation",
        icon: item.icon,
        keywords: [item.href, item.type],
        perform: ({ close }: SearchActionHelpers) => {
          if (item.href.startsWith("http")) {
            context.openUrl(item.href, "_blank")
          } else {
            context.navigate(item.href)
          }
          close()
        },
      }))

    const utilityActions: SearchAction[] = siteConfig.dashboard.sidebar.utilities.map((item) => ({
      id: `utility:${item.href}`,
      title: item.title,
      description: item.href,
      section: "Navigation",
      icon: item.icon,
      keywords: [item.href, "utility"],
      perform: ({ close }: SearchActionHelpers) => {
        context.navigate(item.href)
        close()
      },
    }))

    const documentationAction: SearchAction | null =
      context.docsNodes.length > 0
        ? {
            id: "submenu:documentation",
            title: "Documentation",
            description: "Browse documentation pages",
            section: "Navigation",
            icon: BookOpen01Icon,
            keywords: ["docs", "documentation", "guides", "reference"],
            children: context.docsNodes.map((node) => createDocNodeAction(node, context)),
          }
        : null

    return [...primaryActions, ...utilityActions, ...(documentationAction ? [documentationAction] : [])]
  },
})

export { navigationPlugin }
