"use client"

import { Loading03Icon, UserIcon } from "@hugeicons/core-free-icons"

import { defineSearchPlugin } from "../search-helpers"
import type { SearchAction, SearchPlugin } from "../search-types"

const namesApiExamplePlugin: SearchPlugin = defineSearchPlugin({
  id: "names-api-example",
  getActions: (context): SearchAction[] => {
    const query = context.query.trim()

    if (query.length < 2 || context.nameSearch.error) {
      return []
    }

    if (context.nameSearch.isLoading) {
      return [
        {
          id: `names-api-example:loading:${query.toLowerCase()}`,
          title: `Searching names for "${query}"`,
          description: "Waiting for the custom names API...",
          section: "API Examples",
          icon: Loading03Icon,
          loading: true,
          disabled: true,
          keywords: [query, "name", "api", "search", "loading"],
        },
      ]
    }

    if (context.nameSearch.items.length === 0) {
      return []
    }

    return context.nameSearch.items.map((name) => ({
      id: `names-api-example:${name.toLowerCase()}`,
      title: name,
      description: "From the custom first-name search API",
      section: "API Examples",
      icon: UserIcon,
      keywords: [name, "name", "api", "search", "example"],
      perform: ({ close }) => {
        void navigator.clipboard?.writeText(name)
        close()
      },
    }))
  },
})

export { namesApiExamplePlugin }
