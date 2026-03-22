# Search System

This app now has a global command palette opened with `Cmd + K` on macOS and `Ctrl + K` elsewhere.

It is intentionally built as a small plugin system:

- `components/search/search-provider.tsx`
  Owns global state, keyboard shortcut handling, submenu navigation, confirmation flow, and action execution.
- `components/search/search-palette.tsx`
  Pure-ish UI for rendering and navigating actions.
- `components/search/search-types.ts`
  The contract for plugins and actions.
- `components/search/plugins/*`
  The default action sources. Add new behavior here instead of bloating the provider.
- `components/search/search-launcher.tsx`
  Reusable visible trigger button used by the shell.

## Mental Model

The palette is a tree of `SearchAction` objects.

- An action with `perform` is executable.
- An action with `children` is a submenu.
- An action with `confirm` automatically gets a built-in confirmation dialog before `perform` runs.

The provider rebuilds the action tree on every render from the active plugin list plus the current runtime context. Because of that, actions can safely depend on live app state like:

- current query text
- current route
- current organization
- available organizations
- current theme
- sidebar state
- server-provided docs tree

## API

Main types live in `components/search/search-types.ts`.

```ts
export interface SearchAction {
  id: string
  title: string
  description?: string
  section?: string
  keywords?: string[]
  icon?: IconSvgElement
  badge?: string
  shortcut?: string
  disabled?: boolean
  keepOpen?: boolean
  confirm?: {
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "default" | "destructive"
  }
  view?: {
    inputPlaceholder?: string
    emptyTitle?: string
    emptyDescription?: string
    queryOnOpen?: "preserve" | "clear" | string
  }
  children?: SearchAction[]
  perform?: (helpers: { close: () => void }) => void | Promise<void>
}

export interface SearchPlugin {
  id: string
  getActions: (context: SearchRuntimeContext) => SearchAction[]
}
```

## Runtime Context

Each plugin receives `SearchRuntimeContext`, which currently exposes:

- user input: `query`
- routing helpers: `navigate`, `openUrl`
- settings helpers: `openSettings`, `openScopedSettings`
- workspace helpers: `toggleSidebar`, `setTheme`, `signOut`
- organization state and switching: `organizations`, `currentOrganizationId`, `switchOrganization`
- docs data: `docsNodes`
- permission access: `hasPermission`

If a future plugin needs more app state, add it to `SearchRuntimeContext` in one place and then thread it through `search-provider.tsx`.

## Adding A New Plugin

1. Create a new file in `components/search/plugins/`.
2. Export a `SearchPlugin`.
3. Add it to `defaultSearchPlugins` in `components/search/plugins/index.ts`.

Example:

```ts
import { Rocket01Icon } from "@hugeicons/core-free-icons"
import type { SearchPlugin } from "../search-types"
import { defineSearchPlugin } from "../search-helpers"

export const billingPlugin: SearchPlugin = defineSearchPlugin({
  id: "billing",
  getActions: (context) => [
    {
      id: "billing:overview",
      title: "Billing Overview",
      description: "Open billing settings",
      section: "Billing",
      icon: Rocket01Icon,
      keywords: ["billing", "payments", "stripe"],
      perform: ({ close }) => {
        context.navigate("/billing")
        close()
      },
    },
  ],
})
```

If you want a plugin that reacts to what the user typed, read `context.query`. The built-in weather example plugin does exactly that.

```ts
if (context.query.trim().length >= 2) {
  return [
    {
      id: `weather:${context.query}`,
      title: `Weather in "${context.query}"`,
      perform: async ({ close }) => {
        // fetch data for the typed city
        close()
      },
    },
  ]
}
```

If you want a plugin to return direct global-search results instead of opening a submenu, just emit normal actions from `getActions(context)` based on async state already exposed on the runtime context. The built-in names API example works this way.

```ts
if (context.query.trim().length >= 2) {
  return context.nameSearch.items.map((name) => ({
    id: `name:${name}`,
    title: name,
    section: "API Examples",
    perform: ({ close }) => {
      close()
    },
  }))
}
```

If you want an action to open a tool-like submenu and take over the input field, add `children` plus `view`.

```ts
{
  id: "weather:check",
  title: "Check weather",
  view: {
    inputPlaceholder: "Enter a city name...",
    emptyTitle: "Type a city name",
    emptyDescription: "This view uses the top input as tool input.",
    queryOnOpen: "clear",
  },
  children: [
    // submenu actions built from context.query
  ],
}
```

## Adding A Submenu

Submenus are just nested `children`.

```ts
{
  id: "reports",
  title: "Reports",
  children: [
    {
      id: "reports:weekly",
      title: "Weekly Report",
      perform: ({ close }) => {
        context.navigate("/reports/weekly")
        close()
      },
    },
  ],
}
```

The provider stores submenu path by action id, so nested menus stay stable without hard-coding routes in the UI layer.

## Adding A Built-In Confirm Dialog

Add `confirm` plus `perform`.

```ts
{
  id: "danger:reset-demo",
  title: "Reset Demo Data",
  confirm: {
    title: "Reset demo data?",
    description: "This will remove the current demo records.",
    confirmLabel: "Reset",
    cancelLabel: "Cancel",
    variant: "destructive",
  },
  perform: async ({ close }) => {
    await fetch("/api/demo/reset", { method: "POST" })
    close()
  },
}
```

The palette will show the shared alert dialog automatically.

## Search Behavior

Filtering is local to the current menu.

- `title` matches rank highest
- `keywords` help synonyms
- `description` is used as a lower-priority fallback
- `section` controls group headings in the result list

If you want an action to be easy to find, spend most effort on `title` and `keywords`.
If you generate query-specific actions, include the typed query in `keywords` and usually in the `title` too.

## Docs Integration

The documentation submenu is built from the MDX sidebar tree.

- Each dashboard layout loads `getMdxSidebarTree("/docs")`
- The tree is passed into `Shell`
- `Shell` passes it into `SearchProvider`
- the navigation plugin turns that tree into nested actions

If docs search ever needs richer metadata like descriptions or tags, extend the docs tree shape at the server boundary first, then map that data inside `navigation-plugin.ts`.

## UI Notes

The palette should continue to feel like the rest of the app:

- use Hugeicons for every action icon
- keep chrome soft and layered like the shell/settings modal
- prefer grouped actions over one giant flat list
- prefer plugin modules over giant conditionals in `search-provider.tsx`

## Good Extension Patterns

- Add one plugin per domain area.
- Keep actions declarative.
- Use `keywords` for discoverability instead of clever titles.
- Use `keepOpen` only for actions like toggles where staying inside the palette is useful.
- Prefer `context.navigate(...)` over manual URL mutation.

## Bad Extension Patterns

- Do not hard-code new actions directly inside `search-palette.tsx`.
- Do not put business logic in the renderer if it can live in a plugin.
- Do not make plugins fetch asynchronously inside `getActions`.
  If async data is needed, load it in a hook/provider first and expose it through `SearchRuntimeContext`.
