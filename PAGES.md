# Pages Guide

This guide explains how dashboard pages are built in this template and how to add:

1. Top-level pages (shell rail entries)
2. Subpages (sidebar navigation inside a section)

This is based on the current implementation in `app/(dashboard)` and intentionally excludes the permission test pages.

## How Dashboard Pages Are Composed

Every dashboard route group uses the same shell building blocks:

- `Shell` wraps providers + rail + settings modal
- `ShellSidebar` renders the expandable panel
- `ShellContent` renders the main content area
- `ShellContentHeader` / `ShellContentHeaderTitle` / `ShellContentHeaderDescription` build page headers
- `ShellBody` wraps page content with consistent spacing/scroll behavior

### Typical page pattern

```tsx
import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"

const MyPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>My Page</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Description for this page
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        {/* page content */}
      </ShellBody>
    </>
  )
}

export default MyPage
```

## Route Groups and Ownership

Route groups are used for structure, not URL path segments.

- `app/(dashboard)/(home)/layout.tsx` owns:
  - `/overview`
  - `/lists`
  - `/tables`
  - `/documentation`
  - `/documents`
  - `/messages`
  - `/guides`
  - `/resources`
  - `app/(dashboard)/(home)/page.tsx` redirects `/` -> `/overview`
- `app/(dashboard)/(projects)/layout.tsx` owns:
  - `/projects`
  - `/projects/recent`
  - `/projects/starred`
- `app/(dashboard)/(pages)/layout.tsx` owns:
  - `/pages`
  - `/pages/errors/403`
  - `/pages/errors/403/live`
  - `/pages/errors/404`
  - `/pages/errors/404/live`
  - `/pages/errors/500`
  - `/pages/errors/500/live`
- `app/(dashboard)/(docs)/layout.tsx` owns:
  - `/docs`
  - `/docs/*` via `app/(dashboard)/(docs)/docs/[[...slug]]/page.tsx`

## Top-Level Pages (Shell Rail)

Top-level entries are defined in `config.ts` under:

- `siteConfig.dashboard.sidebar.items`

The rail UI reads directly from config in `components/shell/shell-rail.tsx`.

### Add a new top-level page with its own sidebar

1. Add a rail item in `config.ts`:

```ts
{
  title: "Billing",
  href: "/billing",
  icon: CoinsDollarIcon,
  type: "default",
}
```

2. Create a new route group layout:

`app/(dashboard)/(billing)/layout.tsx`

Use:
- `Shell`
- `ShellSidebar`
- `ShellSidebarGroup`
- `ShellSidebarItem`
- `ShellContent`

3. Create the page file:

`app/(dashboard)/(billing)/billing/page.tsx`

4. If this section has subpages, add those route files and matching sidebar items in that layout.

5. Protect the route in `lib/auth.config.ts` by adding `"/billing"` to `protectedRoutes`.

### Important behavior

- Rail active state uses `pathname.startsWith(item.href)`.
- If rail item href is `/billing`, then `/billing/invoices` keeps that rail icon active.

## Subpages (Sidebar Nav)

Subpages are controlled by each route-group `layout.tsx`, not by `config.ts`.

Example from projects section:

- Layout: `app/(dashboard)/(projects)/layout.tsx`
- Sidebar links in that layout:
  - `/projects`
  - `/projects/recent`
  - `/projects/starred`

### Add a subpage to an existing section

1. Add page file, for example:

`app/(dashboard)/(projects)/projects/archived/page.tsx`

2. Add a sidebar item in the same layout:

```tsx
<ShellSidebarItem icon={ArchiveIcon} href="/projects/archived">
  Archived
</ShellSidebarItem>
```

3. If needed, include the route prefix in `protectedRoutes` (often already covered by a parent prefix such as `/projects`).

### Important behavior

- Sidebar item active state in `ShellSidebarItem` is exact match (`pathname === href`).
- For nested highlighting behavior, you would need to extend `ShellSidebarItem` logic.

## Docs/MDX Pages

The docs section is a special top-level page:

- Rail item in `config.ts` uses `type: "mdx"` and `folder`.
- Layout (`app/(dashboard)/(docs)/layout.tsx`) calls `getMdxSidebarTree("/docs")`.
- Page (`app/(dashboard)/(docs)/docs/[[...slug]]/page.tsx`) calls `getMdxDocument("/docs", slug)`.

For normal docs updates, add files under `content/docs`.

Examples:

- `content/docs/index.mdx` -> `/docs`
- `content/docs/getting-started/index.mdx` -> `/docs/getting-started`
- `content/docs/getting-started/installation.mdx` -> `/docs/getting-started/installation`

## Where Navigation Comes From

- Rail icons (left thin column): `config.ts` -> `dashboard.sidebar.items`
- Sidebar utilities (bottom of panel): `config.ts` -> `dashboard.sidebar.utilities`
- Section sidebar links (main panel nav): each dashboard group `layout.tsx`

## Checklist for New Pages

1. Create route file(s) in `app/(dashboard)/...`.
2. Ensure there is a route-group `layout.tsx` with `ShellSidebar` + `ShellContent`.
3. Add/update shell rail item in `config.ts` for top-level sections.
4. Add/update sidebar subpage links in the relevant layout.
5. Add protected route prefix in `lib/auth.config.ts`.
6. Verify active states:
   - rail icon active for all nested routes under that top-level href
   - sidebar item active on exact match
7. Run and validate navigation manually.

## Common Pitfalls

- Added page file but forgot to link it in the group layout sidebar.
- Added rail item but no route exists at that `href`.
- Added route but forgot `protectedRoutes` in `lib/auth.config.ts`.
- Expected sidebar highlight on nested paths, but `ShellSidebarItem` is exact-match only.
