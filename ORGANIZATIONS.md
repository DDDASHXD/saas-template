# Organizations, Permissions, and Notifications Guide

This document is the source of truth for how this template handles:

1. Organizations (multi-tenancy)
2. Roles and permissions
3. Notifications and invitation delivery

Use this before editing any related code.

## Core Principles

1. A user must always have at least one organization.
2. Each user has a `currentOrganizationId`.
3. A user has one **home organization** (`organizations.personalForUserId === userId`) that cannot be left or kicked from by others.
4. Access decisions should be permission-based, not hardcoded role-name checks.
5. Notifications are split into:
   - Shared notification content (`notifications`)
   - Per-user delivery state (`notification_deliveries`)

## Files to Know

### Organization Domain
- `lib/organizations.ts`

### Roles and Permissions
- `permissions.ts`
- `roles.ts`
- `hooks/use-permission.ts` (client permission hooks)
- `lib/organization-access.ts` (server permission helpers)

### Notification System
- `lib/notifications.ts`
- `hooks/use-notifications.ts`
- `app/api/notifications/route.ts`

### Invitation + Notification Integration
- `app/api/organizations/current/invitations/route.ts`
- `app/api/organizations/invitations/accept/route.ts`
- `app/invitation/accept/page.tsx`

### UI Integration
- `components/providers/organization-provider.tsx`
- `components/shell/shell-sidebar.tsx` (organization switcher + notification bell)
- `components/settings/settings-context.tsx`
- `components/settings/settings-modal.tsx`
- `components/settings/pages/organization-general-page.tsx`
- `components/settings/pages/organization-members-page.tsx`

### Permission-based Route Guards
- `lib/permission-route-guards.ts`
- `lib/permission-routes.ts`
- `app/(dashboard)/(home)/permission-routes/page.tsx`
- `app/(dashboard)/(home)/permission-routes/[routeId]/page.tsx`

---

## Data Model (MongoDB Collections)

## `users`
- Existing auth user collection.
- Key multi-tenant fields:
  - `currentOrganizationId: ObjectId | string | null`
  - `needsOnboarding: boolean`

## `organizations`
- Organization records.
- Fields:
  - `_id`
  - `name`
  - `slug` (unique)
  - `createdByUserId`
  - `personalForUserId?` (home org marker; unique sparse)
  - `createdAt`, `updatedAt`

## `organization_memberships`
- User membership in org.
- Fields:
  - `_id`
  - `organizationId`
  - `userId`
  - `role` (string from `roles.ts`)
  - `createdAt`, `updatedAt`
- Unique index: `{ organizationId, userId }`

## `invitations`
- Invitation records (renamed from `organization_invitations`).
- Fields:
  - `_id`
  - `organizationId`
  - `email`, `emailNormalized`
  - `role`
  - `invitedByUserId`
  - `tokenHash` (unique)
  - `expiresAt`
  - `acceptedAt?`, `acceptedByUserId?`
  - `revokedAt?`, `revokedByUserId?`
  - `createdAt`, `updatedAt`

## `notifications`
- Shared notification payload.
- Fields:
  - `_id`
  - `type`
  - `title`
  - `body`
  - `data?: Record<string, unknown>`
  - `actions?: NotificationAction[]`
  - `createdAt`

## `notification_deliveries`
- Per-user notification state.
- Fields:
  - `_id`
  - `notificationId`
  - `userId`
  - `deliveredAt`
  - `seenAt`
  - `readAt`
  - `archivedAt`
  - `deletedAt`

---

## Organization Lifecycle

## User creation / first login
Source: `ensureUserHasOrganization(...)` in `lib/organizations.ts`.

Behavior:
1. If user already has valid `currentOrganizationId` membership, keep it.
2. Else fallback to earliest membership and set `currentOrganizationId`.
3. Else if personal/home org exists, ensure membership and set current.
4. Else create new personal/home org and owner membership.

This is called from:
- `lib/auth.ts` (credentials + adapter create user)
- `app/api/auth/register/route.ts`
- `app/api/auth/complete-onboarding/route.ts`

## Current organization switching
- `switchCurrentOrganization(...)` updates `users.currentOrganizationId` only if user is a member.

## Leaving/kicking rules
- Home org cannot be left (`cannot_leave_home_org`).
- Home org cannot be kicked (`cannot_remove_home_org`).
- Last owner cannot be demoted/removed (`last_owner`).

---

## Roles and Permissions

## Permission catalog
- Defined in `permissions.ts`.
- Add new permissions there first.

## Roles
- Defined in `roles.ts`.
- Supports:
  - `permissions: ['*']` wildcard
  - `nonPermissions` deny-list override

## Dynamic role behavior
- Role IDs are not hardcoded in role selectors anymore.
- UI/API now derives valid roles from `roles.ts`.
- If a role is added in `roles.ts`, role selection UIs should reflect it automatically.

## Permission checks

### Client
- `usePermission(permissionId)`
- `usePermissionChecker()`
- `useAnyPermission([...])`
- `useAllPermissions([...])`

### Server
- `hasServerPermission(permissionId)`
- `requireServerPermission(permissionId)`
- `getServerPermissionContext()`

## Important
Do not gate features using `role === 'owner'` style checks unless you explicitly want strict role identity behavior. Prefer permission checks.

---

## Notification System

## Notification actions
Current `NotificationAction` union in `lib/notifications.ts` supports:

1. `route` → `{ kind: 'route', href }`
2. `url` → `{ kind: 'url', url, target? }`
3. `open_settings` → `{ kind: 'open_settings', scope?, pageId? }`
4. `accept_invitation` → `{ kind: 'accept_invitation', token }`
5. `alert_dialog` → wrapper action with nested `confirmAction`

This is intentionally extensible; add new `kind` in the union and implement execution in notification UI.

## Server helper functions
In `lib/notifications.ts`:

- `createNotification(...)`
- `getNotificationFeedForUser(...)`
- `markNotificationDeliveriesSeen(...)`
- `markNotificationDeliveriesRead(...)`
- `archiveNotificationDeliveries(...)`
- `deleteNotificationDeliveries(...)`

## API
- `GET /api/notifications` → feed (with unread/unseen counts)
- `PATCH /api/notifications` with `operation` in:
  - `seen`
  - `read`
  - `archive`
  - `delete`

---

## Invitation Flow (Email + In-App)

## Create invitations
- Endpoint: `POST /api/organizations/current/invitations`
- Always creates invitation in `invitations`.
- Also tries to create in-app notification **if invited email maps to an existing user** (`invitedUserId`).
- Email is sent if Resend is configured, but notifications are created regardless of email config.

## Accept invitations
Two acceptance paths:

1. Link path:
   - `/invitation/accept?token=...`
2. In-app action path:
   - `POST /api/organizations/invitations/accept` with `{ token }`

Both call `acceptOrganizationInvitation(...)`.

---

## Notification Bell UI

Source: `components/shell/shell-sidebar.tsx`

Behavior:
1. Dropdown fetches notifications via `useNotifications`.
2. Opening dropdown marks unseen notifications as seen.
3. Clicking notification runs first action (if any), else marks read.
4. Supports archive/delete per notification.
5. `alert_dialog` actions open shadcn alert dialog and execute nested confirm action.

---

## Permission-based Routes

## Config
- `lib/permission-routes.ts` maps route IDs to required permissions.

## Guards
- `requirePagePermission(permissionId)` for server pages.
- `requireApiPermission(permissionId)` for API handlers.

## Demo pages
- `/permission-routes`
- `/permission-routes/[routeId]`

Use these patterns for future permission-gated sections.

---

## API Endpoints Summary

Organizations:
- `GET/POST /api/organizations`
- `GET/PATCH /api/organizations/current`
- `GET/POST/DELETE /api/organizations/current/invitations`
- `PATCH/DELETE /api/organizations/current/members`
- `POST /api/organizations/invitations/accept`

Notifications:
- `GET/PATCH /api/notifications`

---

## Common Extension Tasks

## Add a new permission
1. Add to `permissions.ts`.
2. Add to role definitions in `roles.ts`.
3. Use in UI via `usePermission(...)`.
4. Use in server code via `hasServerPermission` or permission-aware domain checks.

## Add a new role
1. Add role in `roles.ts`.
2. Ensure permissions and optional `nonPermissions` are set.
3. Role should appear in UI selectors automatically.

## Add a new notification type
1. Define payload + actions when calling `createNotification(...)`.
2. If action kind is new, extend `NotificationAction` union and client executor in bell UI.

## Add a permission-protected page
1. Decide required permission ID.
2. Call `await requirePagePermission(permissionId)` in page component.
3. Add route to navigation if needed.

---

## Invariants to Keep

1. Never leave user without an organization.
2. Never allow deleting/demoting the last owner.
3. Never allow leaving/kicking home org membership.
4. Prefer permission checks over role-name checks.
5. Keep `notifications` (shared content) and `notification_deliveries` (per-user state) split.

