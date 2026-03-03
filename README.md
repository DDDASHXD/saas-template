# SaaS Template

A production-ready SaaS starter template built with Next.js 16, React 19, and Tailwind CSS v4.

## Features

- **Landing page** with responsive navigation, hero section, feature showcases, and footer
- **Application shell** with collapsible sidebar, organization switcher, and user menu
- **Authentication** via NextAuth v5 with email/password and optional OAuth (Google, GitHub, Discord, Twitter/X)
- **MongoDB** integration with adapter for user storage
- **Centralized config** (`config.ts`) for site name, logos, navigation, footer, and sidebar items
- **HugeIcons** icon system throughout
- **Dark mode** support via CSS variables
- **TypeScript** with strict mode

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Base UI primitives)
- [HugeIcons](https://hugeicons.com)
- [NextAuth v5](https://authjs.dev) (Auth.js)
- [MongoDB](https://www.mongodb.com)
- [Framer Motion](https://www.framer.com/motion)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone <your-repo-url>
cd saas-template
pnpm install
```

### Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable          | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `NEXTAUTH_SECRET` | Random secret for JWT signing. Generate with `openssl rand -base64 32` |
| `MONGODB_URI`     | MongoDB connection string                                              |

Optional OAuth variables (leave empty to disable the provider on auth pages):

| Variable                                      | Description                 |
| --------------------------------------------- | --------------------------- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`   | Google OAuth credentials    |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`   | GitHub OAuth credentials    |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Discord OAuth credentials   |
| `TWITTER_CLIENT_ID` / `TWITTER_CLIENT_SECRET` | Twitter/X OAuth credentials |

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
config.ts                       # Site-wide configuration
types/index.ts                  # Shared TypeScript types
middleware.ts                   # Auth route protection

app/
  layout.tsx                    # Root layout with fonts and providers
  page.tsx                      # Landing page
  (auth)/
    layout.tsx                  # Auth pages layout
    login/page.tsx              # Sign in page
    register/page.tsx           # Sign up page
  (dashboard)/
    layout.tsx                  # Dashboard shell layout
    overview/page.tsx           # Dashboard home
    documents/page.tsx          # Documents page
    messages/page.tsx           # Messages page
    guides/page.tsx             # Guides page
    resources/page.tsx          # Resources page
  api/auth/
    [...nextauth]/route.ts      # NextAuth API handler
    register/route.ts           # User registration endpoint

components/
  landing/                      # Landing page sections
    nav.tsx                     # Navigation bar
    hero.tsx                    # Hero section
    features.tsx                # Feature sections
    footer.tsx                  # Footer
  shell/                        # Application shell
    shell.tsx                   # Main shell wrapper
    shell-sidebar.tsx           # Sidebar panel
    shell-sidebar-button.tsx    # Sidebar action button
    shell-sidebar-group.tsx     # Sidebar item group
    shell-sidebar-item.tsx      # Sidebar nav item
    shell-content.tsx           # Content area
    shell-content-header.tsx    # Content header
    shell-body.tsx              # Content body
  auth/                         # Auth form components
    login-form.tsx
    register-form.tsx
  providers/
    session-provider.tsx        # NextAuth session wrapper
  ui/                           # shadcn/ui components

lib/
  auth.ts                       # NextAuth configuration
  auth-providers.ts             # OAuth provider detection
  mongodb.ts                    # MongoDB client
  utils.ts                      # Utility functions (cn)
```

## Configuration

Edit `config.ts` to customize:

- **Site name and description** displayed in metadata and navigation
- **Logo paths** for full logo and icon variants
- **Navigation links** shown in the landing page navbar
- **Footer categories** with grouped links
- **Social links** with platform-based icon mapping
- **Dashboard sidebar** groups and items with HugeIcons

## Customization

### Adding new dashboard pages

1. Create a new folder under `app/(dashboard)/your-page/page.tsx`
2. Use the shell components:

```tsx
import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderTitle,
  ShellContentHeaderDescription,
} from '@/components/shell'

const YourPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Your Page</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>Page description here</ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>Your content here</ShellBody>
    </>
  )
}

export default YourPage
```

3. Add the sidebar item in `app/(dashboard)/layout.tsx`

### Adding OAuth providers

1. Set the provider's client ID and secret in `.env.local`
2. The login/register pages automatically detect and show available providers

## License

MIT
