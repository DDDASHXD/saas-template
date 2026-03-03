# SaaS Template

## Feature Breakdown

- Marketing site with responsive nav, hero, feature grid/carousel, and footer
- Auth system powered by NextAuth v5 (credentials + optional OAuth)
- Three login modes: `emailAndPassword`, `emailOTP`, or `none`
- Optional required email confirmation before credentials sign-in
- Password reset flow (request reset link + token-based password update)
- Email OTP flow with automatic user creation on first successful code login
- MongoDB integration for users/auth data (via `@auth/mongodb-adapter`)
- Resend integration for confirmation emails, OTP codes, and reset links
- Protected dashboard route groups with custom sidebars and a shared app shell
- Config-driven rail navigation, footer links/socials, branding, and settings sections
- Config-driven MDX documentation area with generated sidebar tree + in-page table of contents
- Reusable UI system based on shadcn + Base UI + HugeIcons + Tailwind CSS v4
- Dark mode support via `next-themes`
- TypeScript strict mode + ESLint core-web-vitals config
- Prebuilt error experiences (`403`, `404`, `500`) and global error boundary

## What This Template Is

This repository is a Next.js App Router starter for SaaS products. It gives you:

- a public-facing landing page (`/`)
- auth pages (`/login`, `/register`, `/forgot-password`, `/reset-password`)
- authenticated dashboard sections (`/overview`, `/projects`, `/pages`, `/docs`, etc.)
- centralized project customization through [`config.ts`](./config.ts)

## Tech Stack

- Next.js `16.1.6` (App Router)
- React `19.2.3`
- TypeScript `strict: true`
- Tailwind CSS v4
- shadcn/ui + Base UI primitives
- HugeIcons
- NextAuth `5.0.0-beta.30`
- MongoDB + `@auth/mongodb-adapter`
- Framer Motion
- `next-mdx-remote` + `remark-gfm`
- `bcryptjs`

## Requirements

- Node.js version compatible with Next.js 16 (current LTS recommended)
- `pnpm`
- MongoDB instance (local or cloud)
- Resend account/API key if you use any email-delivered auth flows

## Quick Start

1. Install dependencies.

```bash
pnpm install
```

2. Create local environment file.

```bash
cp .env.example .env.local
```

3. Fill required environment variables (see full matrix below).

4. Run development server.

```bash
pnpm dev
```

5. Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - start local dev server
- `pnpm build` - production build
- `pnpm start` - run production server
- `pnpm lint` - run ESLint

## Environment Variables

### Complete Reference

| Variable                                      | Required    | Purpose                                                                                                                                          |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MONGODB_URI`                                 | Yes         | Required at startup. Missing value throws immediately from [`lib/mongodb.ts`](./lib/mongodb.ts).                                                 |
| `NEXTAUTH_SECRET`                             | Yes         | Secret for NextAuth JWT/session security.                                                                                                        |
| `NEXTAUTH_URL`                                | Recommended | NextAuth base URL, especially important in production.                                                                                           |
| `NEXT_PUBLIC_APP_URL`                         | Recommended | Used by [`config.ts`](./config.ts) as `siteConfig.url`; drives metadata base URL and email link generation. Defaults to `http://localhost:3000`. |
| `RESEND_API_KEY`                              | Conditional | Required for email confirmation, email OTP, and forgot-password email delivery.                                                                  |
| `RESEND_FROM_EMAIL`                           | No          | Custom sender address. Falls back to `${siteConfig.name} <noreply@mail.skxv.dev>`.                                                               |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`   | Optional    | Enables Google OAuth button/provider.                                                                                                            |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`   | Optional    | Enables GitHub OAuth button/provider.                                                                                                            |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Optional    | Enables Discord OAuth button/provider.                                                                                                           |
| `TWITTER_CLIENT_ID` / `TWITTER_CLIENT_SECRET` | Optional    | Enables Twitter/X OAuth button/provider.                                                                                                         |

### Auth Mode Requirements Matrix

| `siteConfig.auth.genericLoginType` | Credentials Login | OTP Login                           | Register Form                                      | Resend Needed?                                                   |
| ---------------------------------- | ----------------- | ----------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| `emailAndPassword`                 | Yes               | No                                  | Enabled                                            | Only if `requireEmailConfirmation=true` or using forgot-password |
| `emailOTP`                         | No password login | Yes (`/api/auth/request-email-otp`) | Disabled (users auto-created on first OTP success) | Yes                                                              |
| `none`                             | Disabled          | Disabled                            | Disabled                                           | No (unless you use custom email features)                        |

### `requireEmailConfirmation` Behavior

When `siteConfig.auth.requireEmailConfirmation` is `true`:

- Email/password sign-in blocks unverified users in [`lib/auth.ts`](./lib/auth.ts)
- Registration requires `RESEND_API_KEY`; otherwise `/api/auth/register` returns `503`
- Confirm email link uses `/api/auth/confirm-email?token=...`
- Login form exposes a "Resend confirmation email" action after failed credentials login

## Authentication Architecture

### Providers

Provider wiring happens in two places:

- [`lib/auth.config.ts`](./lib/auth.config.ts): base provider list + route authorization callback
- [`lib/auth.ts`](./lib/auth.ts): injects real credentials provider depending on `genericLoginType`, and keeps OAuth providers from `auth.config`

If both credentials and OAuth are effectively disabled, a no-op credentials provider is added to keep NextAuth configuration valid.

### Route Protection

Protected route logic lives in `callbacks.authorized` inside [`lib/auth.config.ts`](./lib/auth.config.ts).

Protected prefixes:

- `/overview`
- `/lists`
- `/tables`
- `/documentation`
- `/documents`
- `/messages`
- `/guides`
- `/resources`
- `/projects`
- `/pages`
- `/docs`

Auth routes (redirect authenticated users to `/overview`):

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

Middleware matcher in [`middleware.ts`](./middleware.ts) excludes API routes, Next static/image assets, `favicon.ico`, `/assets`, and file-extension requests.

## Auth API Endpoints

| Endpoint                        | Method     | Purpose                     | Important Rules                                                                                  |
| ------------------------------- | ---------- | --------------------------- | ------------------------------------------------------------------------------------------------ |
| `/api/auth/[...nextauth]`       | `GET/POST` | NextAuth handlers           | Exported from `lib/auth.ts`.                                                                     |
| `/api/auth/register`            | `POST`     | Create email/password user  | Only active in `emailAndPassword` mode; password min length 8; optional email confirmation flow. |
| `/api/auth/confirm-email`       | `GET`      | Verify confirmation token   | Consumes token, sets `users.emailVerified`, redirects to login with query status.                |
| `/api/auth/resend-confirmation` | `POST`     | Re-issue confirmation email | Requires `requireEmailConfirmation=true` and `RESEND_API_KEY`.                                   |
| `/api/auth/forgot-password`     | `POST`     | Send password reset link    | Only in `emailAndPassword`; returns generic success message to avoid account enumeration.        |
| `/api/auth/reset-password`      | `POST`     | Apply new password          | Requires valid unexpired reset token + password length >= 8.                                     |
| `/api/auth/request-email-otp`   | `POST`     | Send 6-digit OTP code       | Only in `emailOTP`; requires `RESEND_API_KEY`.                                                   |

## Token and Email Rules

In [`lib/auth-tokens.ts`](./lib/auth-tokens.ts):

- Tokens are SHA-256 hashed before storage
- Any existing token of same `email + type` is deleted before issuing a new one
- Expiry durations:
  - Email confirmation token: 24 hours
  - Password reset token: 60 minutes
  - Email OTP: 10 minutes
- Tokens are single-use (consumed then deleted)

In [`lib/auth-emails.ts`](./lib/auth-emails.ts):

- Email links are built from `siteConfig.url`
- If `siteConfig.url` is wrong in production, confirmation/reset links will point to the wrong origin

## Database Notes

### Collections Used Directly in This Repo

- `users`
- `auth_tokens`

### User Document Shape (App-Level)

Fields used by app logic:

- `name`
- `email`
- `password` (for credentials users)
- `emailVerified`
- `image`
- `createdAt`
- `updatedAt`

In `emailOTP` mode, a missing user is created after successful OTP verification with:

- `name` derived from email local-part
- `emailVerified` set immediately

## Config System (`config.ts`)

All major product-level customization is centralized in [`config.ts`](./config.ts).

### Top-Level Fields

| Field                         | Used In                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `name`                        | Metadata title template, branding in shell/footer/nav, default email sender name |
| `description`                 | Metadata description                                                             |
| `url`                         | Metadata base URL + email link origin                                            |
| `auth`                        | Login mode + email-confirmation requirements                                     |
| `logo.full`                   | Landing nav/footer branding                                                      |
| `logo.icon`                   | Auth layout + dashboard shell branding                                           |
| `nav`                         | Landing navigation links                                                         |
| `footer.categories`           | Footer link columns                                                              |
| `footer.socials`              | Footer social icons/links                                                        |
| `dashboard.sidebar.items`     | Left rail icons + MDX rail mapping                                               |
| `dashboard.sidebar.utilities` | Bottom utility links in sidebar panel                                            |
| `dashboard.settings`          | Settings modal sections/items and account menu shortcuts                         |

### Sidebar Rail Item Types

`dashboard.sidebar.items[].type` supports:

- `default`: normal navigation item
- `mdx`: docs item tied to a local folder

For `mdx` items:

- `folder` is required for content discovery
- `href` is the URL base (`/docs` in this template)
- folder path is resolved from project root (e.g. `/content/docs`)

### Social Platform Values

Supported `footer.socials[].platform` values are typed in [`types/index.ts`](./types/index.ts):

- `twitter`
- `github`
- `discord`
- `linkedin`
- `reddit`
- `telegram`

## MDX Documentation System

Docs rendering and tree generation live in [`lib/mdx-docs.ts`](./lib/mdx-docs.ts).

Behavior:

- Walks configured folder recursively
- Ignores dotfiles/dotfolders
- Supports `.mdx` and `.md`
- Uses `index.mdx` / `index.md` as folder landing page
- Builds left sidebar tree from file/folder structure
- Builds right-side TOC from `##` and `###` headings only
- Uses `title` and `description` frontmatter when available

Route mapping examples (with default folder `content/docs`):

- `content/docs/index.mdx` -> `/docs`
- `content/docs/getting-started/index.mdx` -> `/docs/getting-started`
- `content/docs/getting-started/installation.mdx` -> `/docs/getting-started/installation`

## Routing and Layout Structure

Key route groups:

- `(auth)` for login/register/reset flows
- `(dashboard)/(home)` for overview/lists/tables/etc.
- `(dashboard)/(projects)` for project pages
- `(dashboard)/(pages)` for reusable/error pages
- `(dashboard)/(docs)` for MDX docs section

Important implementation detail:

- The rail navigation (thin icon column) is config-driven
- Inner sidebar contents are route-group-specific components and currently hardcoded in each group layout

## Project Structure

```txt
app/
  (auth)/
  (dashboard)/
  api/auth/
components/
  auth/
  landing/
  shell/
  settings/
  ui/
content/docs/
lib/
  auth.ts
  auth.config.ts
  auth-tokens.ts
  auth-emails.ts
  mdx-docs.ts
  mongodb.ts
config.ts
types/
```

## Known Template Placeholders

Some configured links/routes are intentionally starter placeholders and are not implemented yet:

- Landing links like `/pricing`, `/blog`, `/about`, `/careers`, etc.
- Sidebar utility link `/help`
- Many settings pages are generic placeholder content

Implement these routes before production launch or adjust links in [`config.ts`](./config.ts).

## Customization Recipes

### Add a New OAuth Provider

1. Add provider env vars.
2. Add provider setup in [`lib/auth.config.ts`](./lib/auth.config.ts).
3. Ensure provider key is handled in login/register provider UI mapping if needed.

### Add a New Protected Dashboard Section

1. Add route files under `app/(dashboard)/...`.
2. Add rail item in [`config.ts`](./config.ts) if needed.
3. Add path prefix to `protectedRoutes` in [`lib/auth.config.ts`](./lib/auth.config.ts).
4. Add group-specific sidebar items in the relevant layout component.

### Add New Docs Area From Files

1. Add an `mdx` rail item in [`config.ts`](./config.ts) with `href` + `folder`.
2. Create markdown/mdx files under that folder.
3. Ensure file/folder names match desired URL slugs.

## Troubleshooting

- `MONGODB_URI environment variable is not set`
  - Add `MONGODB_URI` to `.env.local`.

- `RESEND_API_KEY environment variable is not set`
  - Required for email confirmation, OTP, and forgot-password email flows.

- Confirmation/reset links point to localhost in production
  - Set `NEXT_PUBLIC_APP_URL` (and `NEXTAUTH_URL`) to your production origin.

- Login works but new protected section is still public
  - Add the section path to `protectedRoutes` in [`lib/auth.config.ts`](./lib/auth.config.ts).

- Sidebar docs tree is empty
  - Verify `dashboard.sidebar.items` contains an `mdx` item with correct `href` and valid `folder` path.

## Production Checklist

- Set all required production env vars
- Use strong `NEXTAUTH_SECRET`
- Configure OAuth callback URLs correctly
- Set correct `siteConfig.url` / `NEXT_PUBLIC_APP_URL`
- Ensure placeholder links are replaced or implemented
- Run `pnpm build` and `pnpm lint`
- Verify auth flows for selected login mode

## License

This template is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
