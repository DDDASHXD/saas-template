import crypto from "crypto"
import { ObjectId } from "mongodb"

import { normalizeEmail, isValidEmail } from "@/lib/auth-validation"
import { getDb } from "@/lib/mongodb"
import type { PermissionId } from "@/permissions"
import { hasRolePermission, roles, type RoleId } from "@/roles"

export type OrganizationRole = RoleId

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired"

export interface OrganizationSummary {
  id: string
  name: string
  slug: string
}

export interface UserOrganization extends OrganizationSummary {
  role: OrganizationRole
  isCurrent: boolean
}

export interface OrganizationMember {
  id: string
  userId: string
  name: string
  email: string
  image: string | null
  role: OrganizationRole
  joinedAt: string
}

export interface OrganizationInvitationView {
  id: string
  email: string
  role: OrganizationRole
  status: InvitationStatus
  invitedAt: string
  expiresAt: string
  acceptedAt: string | null
  invitedByName: string | null
  acceptedByName: string | null
}

export interface CurrentOrganizationState {
  organization: OrganizationSummary
  role: OrganizationRole
  isHomeForCurrentUser: boolean
  members: OrganizationMember[]
  invitations: OrganizationInvitationView[]
}

interface OrganizationDocument {
  _id?: ObjectId
  name: string
  slug: string
  createdByUserId: ObjectId
  personalForUserId?: ObjectId
  createdAt: Date
  updatedAt: Date
}

interface OrganizationMembershipDocument {
  _id?: ObjectId
  organizationId: ObjectId
  userId: ObjectId
  role: OrganizationRole
  createdAt: Date
  updatedAt: Date
}

interface OrganizationInvitationDocument {
  _id?: ObjectId
  organizationId: ObjectId
  email: string
  emailNormalized: string
  role: OrganizationRole
  invitedByUserId: ObjectId
  tokenHash: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  acceptedAt?: Date
  acceptedByUserId?: ObjectId
  revokedAt?: Date
  revokedByUserId?: ObjectId
}

interface UserDocument {
  _id?: ObjectId
  name?: string | null
  email?: string | null
  image?: string | null
  currentOrganizationId?: ObjectId | string | null
}

const ORGANIZATIONS_COLLECTION = "organizations"
const MEMBERSHIPS_COLLECTION = "organization_memberships"
const INVITATIONS_COLLECTION = "invitations"

const RESERVED_SLUGS = new Set(["api", "app", "admin", "settings", "new", "www"])

const ROLE_PRIORITY = new Map<string, number>(
  roles.map((role, index) => [role.id, index])
)

class OrganizationError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = "OrganizationError"
    this.code = code
  }
}

let ensureIndexesPromise: Promise<void> | null = null

const ensureOrganizationIndexes = async () => {
  if (!ensureIndexesPromise) {
    ensureIndexesPromise = (async () => {
      const db = await getDb()
      await db
        .collection<OrganizationDocument>(ORGANIZATIONS_COLLECTION)
        .createIndex({ slug: 1 }, { unique: true })
      await db
        .collection<OrganizationDocument>(ORGANIZATIONS_COLLECTION)
        .createIndex({ personalForUserId: 1 }, { unique: true, sparse: true })
      await db
        .collection<OrganizationMembershipDocument>(MEMBERSHIPS_COLLECTION)
        .createIndex({ organizationId: 1, userId: 1 }, { unique: true })
      await db
        .collection<OrganizationMembershipDocument>(MEMBERSHIPS_COLLECTION)
        .createIndex({ userId: 1, createdAt: 1 })
      await db
        .collection<OrganizationInvitationDocument>(INVITATIONS_COLLECTION)
        .createIndex({ tokenHash: 1 }, { unique: true })
      await db
        .collection<OrganizationInvitationDocument>(INVITATIONS_COLLECTION)
        .createIndex({ organizationId: 1, emailNormalized: 1, createdAt: -1 })
    })().catch((error) => {
      ensureIndexesPromise = null
      throw error
    })
  }

  return ensureIndexesPromise
}

const usersCollection = async () => (await getDb()).collection<UserDocument>("users")

const organizationsCollection = async () =>
  (await getDb()).collection<OrganizationDocument>(ORGANIZATIONS_COLLECTION)

const membershipsCollection = async () =>
  (await getDb()).collection<OrganizationMembershipDocument>(MEMBERSHIPS_COLLECTION)

const invitationsCollection = async () =>
  (await getDb()).collection<OrganizationInvitationDocument>(INVITATIONS_COLLECTION)

const toObjectId = (value: string | ObjectId) => {
  if (value instanceof ObjectId) {
    return value
  }

  if (!ObjectId.isValid(value)) {
    throw new OrganizationError("invalid_id", "Invalid identifier")
  }

  return new ObjectId(value)
}

const safeObjectId = (value: unknown) => {
  if (typeof value !== "string" || !ObjectId.isValid(value)) {
    return null
  }

  return new ObjectId(value)
}

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex")

export const normalizeOrganizationName = (name: string) => name.trim().replace(/\s+/g, " ")

const toSlug = (value: string) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)

  if (!slug || RESERVED_SLUGS.has(slug)) {
    return "workspace"
  }

  return slug
}

const getDefaultOrganizationName = (name?: string | null, email?: string | null) => {
  const trimmedName = name?.trim()

  if (trimmedName) {
    return `${trimmedName}'s Workspace`
  }

  const localPart = (email ?? "").split("@")[0]?.trim()

  if (localPart) {
    return `${localPart}'s Workspace`
  }

  return "My Workspace"
}

const generateUniqueSlug = async ({
  desired,
  excludeOrganizationId,
}: {
  desired: string
  excludeOrganizationId?: ObjectId
}) => {
  const organizations = await organizationsCollection()
  const base = toSlug(desired)

  for (let suffix = 0; suffix < 500; suffix += 1) {
    const candidate = suffix === 0 ? base : `${base}-${suffix + 1}`
    const existing = await organizations.findOne({
      slug: candidate,
      ...(excludeOrganizationId ? { _id: { $ne: excludeOrganizationId } } : {}),
    })

    if (!existing) {
      return candidate
    }
  }

  throw new OrganizationError("slug_unavailable", "Could not allocate an organization slug")
}

const serializeDate = (value: Date) => value.toISOString()

export const canManageOrganization = (role: OrganizationRole | null) =>
  hasRolePermission(role, "organization.members.invite")

const assertHasPermission = (role: OrganizationRole | null, permissionId: PermissionId) => {
  if (!hasRolePermission(role, permissionId)) {
    throw new OrganizationError(
      "forbidden",
      `You do not have permission: ${permissionId}`
    )
  }
}

const assertRoleUpdatePermission = (role: OrganizationRole | null) => {
  if (!hasRolePermission(role, "organization.members.role.update")) {
    throw new OrganizationError(
      "owner_required",
      "Only organization owners can manage member roles and removals"
    )
  }
}

const assertKickPermission = (role: OrganizationRole | null) => {
  if (!hasRolePermission(role, "organization.members.kick")) {
    throw new OrganizationError(
      "owner_required",
      "Only organization owners can manage member roles and removals"
    )
  }
}

const createOrganizationRecord = async ({
  ownerUserId,
  name,
  slug,
  personalForUserId,
}: {
  ownerUserId: ObjectId
  name: string
  slug?: string
  personalForUserId?: ObjectId
}) => {
  await ensureOrganizationIndexes()

  const organizations = await organizationsCollection()
  const memberships = await membershipsCollection()
  const users = await usersCollection()

  const normalizedName = normalizeOrganizationName(name)

  if (!normalizedName) {
    throw new OrganizationError("invalid_name", "Organization name is required")
  }

  const organizationSlug = await generateUniqueSlug({ desired: slug ?? normalizedName })
  const now = new Date()

  const organizationPayload: OrganizationDocument = {
    name: normalizedName,
    slug: organizationSlug,
    createdByUserId: ownerUserId,
    ...(personalForUserId ? { personalForUserId } : {}),
    createdAt: now,
    updatedAt: now,
  }

  const inserted = await organizations.insertOne(organizationPayload)
  const organizationId = inserted.insertedId

  await memberships.insertOne({
    organizationId,
    userId: ownerUserId,
    role: "owner",
    createdAt: now,
    updatedAt: now,
  })

  await users.updateOne(
    { _id: ownerUserId },
    {
      $set: {
        currentOrganizationId: organizationId,
      },
    }
  )

  return {
    id: organizationId.toString(),
    name: normalizedName,
    slug: organizationSlug,
  }
}

export const ensureUserHasOrganization = async ({
  userId,
  name,
  email,
}: {
  userId: string | ObjectId
  name?: string | null
  email?: string | null
}) => {
  await ensureOrganizationIndexes()

  const parsedUserId = toObjectId(userId)
  const users = await usersCollection()
  const memberships = await membershipsCollection()
  const organizations = await organizationsCollection()

  const user = await users.findOne({ _id: parsedUserId })

  if (!user) {
    throw new OrganizationError("user_not_found", "User was not found")
  }

  const currentOrganizationId =
    user.currentOrganizationId instanceof ObjectId
      ? user.currentOrganizationId
      : safeObjectId(user.currentOrganizationId)

  if (currentOrganizationId) {
    const currentMembership = await memberships.findOne({
      userId: parsedUserId,
      organizationId: currentOrganizationId,
    })

    if (currentMembership) {
      return currentOrganizationId.toString()
    }
  }

  const existingMembership = await memberships.findOne(
    { userId: parsedUserId },
    { sort: { createdAt: 1 } }
  )

  if (existingMembership) {
    await users.updateOne(
      { _id: parsedUserId },
      {
        $set: {
          currentOrganizationId: existingMembership.organizationId,
        },
      }
    )

    return existingMembership.organizationId.toString()
  }

  const personalOrganization = await organizations.findOne({
    personalForUserId: parsedUserId,
  })

  if (personalOrganization?._id) {
    await memberships.updateOne(
      {
        organizationId: personalOrganization._id,
        userId: parsedUserId,
      },
      {
        $setOnInsert: {
          role: "owner",
          createdAt: new Date(),
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    await users.updateOne(
      { _id: parsedUserId },
      {
        $set: {
          currentOrganizationId: personalOrganization._id,
        },
      }
    )

    return personalOrganization._id.toString()
  }

  try {
    const organization = await createOrganizationRecord({
      ownerUserId: parsedUserId,
      name: getDefaultOrganizationName(name ?? user.name, email ?? user.email),
      personalForUserId: parsedUserId,
    })

    return organization.id
  } catch (error) {
    const duplicateErrorCode =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: number }).code
        : undefined

    if (duplicateErrorCode === 11000) {
      const fallbackOrganization = await organizations.findOne({
        personalForUserId: parsedUserId,
      })

      if (fallbackOrganization?._id) {
        await memberships.updateOne(
          {
            organizationId: fallbackOrganization._id,
            userId: parsedUserId,
          },
          {
            $setOnInsert: {
              role: "owner",
              createdAt: new Date(),
            },
            $set: {
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        )

        await users.updateOne(
          { _id: parsedUserId },
          {
            $set: {
              currentOrganizationId: fallbackOrganization._id,
            },
          }
        )

        return fallbackOrganization._id.toString()
      }
    }

    throw error
  }
}

export const listUserOrganizations = async (userId: string | ObjectId): Promise<UserOrganization[]> => {
  await ensureOrganizationIndexes()

  const parsedUserId = toObjectId(userId)
  const users = await usersCollection()
  const memberships = await membershipsCollection()
  const organizations = await organizationsCollection()

  const user = await users.findOne({ _id: parsedUserId })

  if (!user) {
    throw new OrganizationError("user_not_found", "User was not found")
  }

  await ensureUserHasOrganization({ userId: parsedUserId, name: user.name, email: user.email })

  const userMemberships = await memberships
    .find({ userId: parsedUserId })
    .sort({ createdAt: 1 })
    .toArray()

  if (userMemberships.length === 0) {
    return []
  }

  const organizationMap = new Map<string, OrganizationDocument>()
  const organizationIds = userMemberships.map((membership) => membership.organizationId)

  const orgDocs = await organizations.find({ _id: { $in: organizationIds } }).toArray()

  for (const org of orgDocs) {
    if (org._id) {
      organizationMap.set(org._id.toString(), org)
    }
  }

  const currentOrgId =
    user.currentOrganizationId instanceof ObjectId
      ? user.currentOrganizationId.toString()
      : typeof user.currentOrganizationId === "string"
        ? user.currentOrganizationId
        : null

  return userMemberships
    .map((membership) => {
      const key = membership.organizationId.toString()
      const organization = organizationMap.get(key)

      if (!organization?._id) {
        return null
      }

      return {
        id: organization._id.toString(),
        name: organization.name,
        slug: organization.slug,
        role: membership.role,
        isCurrent: currentOrgId === organization._id.toString(),
      } satisfies UserOrganization
    })
    .filter((organization): organization is UserOrganization => Boolean(organization))
}

const getCurrentMembership = async (userId: ObjectId) => {
  const users = await usersCollection()
  const memberships = await membershipsCollection()

  const user = await users.findOne({ _id: userId })

  if (!user) {
    throw new OrganizationError("user_not_found", "User was not found")
  }

  await ensureUserHasOrganization({ userId, name: user.name, email: user.email })

  const maybeCurrentId =
    user.currentOrganizationId instanceof ObjectId
      ? user.currentOrganizationId
      : safeObjectId(user.currentOrganizationId)

  if (maybeCurrentId) {
    const currentMembership = await memberships.findOne({
      userId,
      organizationId: maybeCurrentId,
    })

    if (currentMembership) {
      return currentMembership
    }
  }

  const fallbackMembership = await memberships.findOne(
    { userId },
    { sort: { createdAt: 1 } }
  )

  if (!fallbackMembership) {
    throw new OrganizationError("organization_not_found", "No organization found")
  }

  await users.updateOne(
    { _id: userId },
    {
      $set: {
        currentOrganizationId: fallbackMembership.organizationId,
      },
    }
  )

  return fallbackMembership
}

const isHomeOrganizationForUser = (organization: OrganizationDocument, userId: ObjectId) =>
  Boolean(
    organization.personalForUserId && organization.personalForUserId.toString() === userId.toString()
  )

const ensureAtLeastOneOwnerAfterChange = async ({
  organizationId,
  userIdToDemoteOrRemove,
}: {
  organizationId: ObjectId
  userIdToDemoteOrRemove: ObjectId
}) => {
  const memberships = await membershipsCollection()

  const ownerCount = await memberships.countDocuments({
    organizationId,
    role: "owner",
  })

  if (ownerCount <= 1) {
    const membership = await memberships.findOne({
      organizationId,
      userId: userIdToDemoteOrRemove,
    })

    if (membership?.role === "owner") {
      throw new OrganizationError(
        "last_owner",
        "This organization must always have at least one owner"
      )
    }
  }
}

const setFallbackCurrentOrganizationForUser = async (userId: ObjectId) => {
  const users = await usersCollection()
  const memberships = await membershipsCollection()

  const fallbackMembership = await memberships.findOne(
    { userId },
    { sort: { createdAt: 1 } }
  )

  if (fallbackMembership?.organizationId) {
    await users.updateOne(
      { _id: userId },
      {
        $set: {
          currentOrganizationId: fallbackMembership.organizationId,
        },
      }
    )
    return fallbackMembership.organizationId.toString()
  }

  return ensureUserHasOrganization({ userId })
}

const mapInvitationStatus = (invitation: OrganizationInvitationDocument): InvitationStatus => {
  if (invitation.revokedAt) {
    return "revoked"
  }

  if (invitation.acceptedAt) {
    return "accepted"
  }

  if (invitation.expiresAt.getTime() <= Date.now()) {
    return "expired"
  }

  return "pending"
}

export const getCurrentOrganizationStateForUser = async (
  userId: string | ObjectId
): Promise<CurrentOrganizationState> => {
  const parsedUserId = toObjectId(userId)
  const memberships = await membershipsCollection()
  const organizations = await organizationsCollection()
  const users = await usersCollection()
  const invitations = await invitationsCollection()

  const currentMembership = await getCurrentMembership(parsedUserId)
  const organization = await organizations.findOne({ _id: currentMembership.organizationId })

  if (!organization?._id) {
    throw new OrganizationError("organization_not_found", "Organization was not found")
  }

  const organizationMemberships = await memberships
    .find({ organizationId: organization._id })
    .sort({ createdAt: 1 })
    .toArray()

  const memberUserIds = organizationMemberships.map((member) => member.userId)
  const memberUsers = await users.find({ _id: { $in: memberUserIds } }).toArray()
  const memberUserMap = new Map(memberUsers.map((entry) => [entry._id?.toString() ?? "", entry]))

  const members = organizationMemberships
    .map((member) => {
      const profile = memberUserMap.get(member.userId.toString())
      if (!profile?._id || !profile.email) {
        return null
      }

      return {
        id: member._id?.toString() ?? member.userId.toString(),
        userId: member.userId.toString(),
        name: profile.name?.trim() || profile.email,
        email: profile.email,
        image: profile.image ?? null,
        role: member.role,
        joinedAt: serializeDate(member.createdAt),
      } satisfies OrganizationMember
    })
    .filter((member): member is OrganizationMember => Boolean(member))
    .sort((a, b) => {
      const roleDelta =
        (ROLE_PRIORITY.get(a.role) ?? Number.MAX_SAFE_INTEGER) -
        (ROLE_PRIORITY.get(b.role) ?? Number.MAX_SAFE_INTEGER)
      if (roleDelta !== 0) {
        return roleDelta
      }

      return a.name.localeCompare(b.name)
    })

  const organizationInvitations = await invitations
    .find({ organizationId: organization._id })
    .sort({ createdAt: -1 })
    .toArray()

  const referencedUserIds: ObjectId[] = []

  for (const invitation of organizationInvitations) {
    referencedUserIds.push(invitation.invitedByUserId)
    if (invitation.acceptedByUserId) {
      referencedUserIds.push(invitation.acceptedByUserId)
    }
  }

  const invitationUsers = referencedUserIds.length
    ? await users.find({ _id: { $in: referencedUserIds } }).toArray()
    : []

  const invitationUserMap = new Map(
    invitationUsers
      .filter((entry): entry is UserDocument & { _id: ObjectId } => Boolean(entry._id))
      .map((entry) => [entry._id.toString(), entry])
  )

  const invitationViews = organizationInvitations.map((invitation) => ({
    id: invitation._id?.toString() ?? "",
    email: invitation.email,
    role: invitation.role,
    status: mapInvitationStatus(invitation),
    invitedAt: serializeDate(invitation.createdAt),
    expiresAt: serializeDate(invitation.expiresAt),
    acceptedAt: invitation.acceptedAt ? serializeDate(invitation.acceptedAt) : null,
    invitedByName: invitationUserMap.get(invitation.invitedByUserId.toString())?.name ?? null,
    acceptedByName: invitation.acceptedByUserId
      ? invitationUserMap.get(invitation.acceptedByUserId.toString())?.name ?? null
      : null,
  }))

  return {
    organization: {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    },
    role: currentMembership.role,
    isHomeForCurrentUser: isHomeOrganizationForUser(organization, parsedUserId),
    members,
    invitations: invitationViews,
  }
}

export const switchCurrentOrganization = async ({
  userId,
  organizationId,
}: {
  userId: string | ObjectId
  organizationId: string | ObjectId
}) => {
  const parsedUserId = toObjectId(userId)
  const parsedOrganizationId = toObjectId(organizationId)

  const memberships = await membershipsCollection()
  const users = await usersCollection()

  const membership = await memberships.findOne({
    userId: parsedUserId,
    organizationId: parsedOrganizationId,
  })

  if (!membership) {
    throw new OrganizationError("forbidden", "You are not a member of this organization")
  }

  await users.updateOne(
    { _id: parsedUserId },
    {
      $set: {
        currentOrganizationId: parsedOrganizationId,
      },
    }
  )
}

export const createOrganizationForUser = async ({
  userId,
  name,
  slug,
}: {
  userId: string | ObjectId
  name: string
  slug?: string
}) => {
  return createOrganizationRecord({
    ownerUserId: toObjectId(userId),
    name,
    slug,
  })
}

export const updateCurrentOrganization = async ({
  userId,
  name,
  slug,
}: {
  userId: string | ObjectId
  name?: string
  slug?: string
}) => {
  const parsedUserId = toObjectId(userId)
  const organizations = await organizationsCollection()

  const currentMembership = await getCurrentMembership(parsedUserId)
  assertHasPermission(currentMembership.role, "organization.update")

  const organization = await organizations.findOne({ _id: currentMembership.organizationId })

  if (!organization?._id) {
    throw new OrganizationError("organization_not_found", "Organization was not found")
  }

  const updates: Partial<OrganizationDocument> = {}

  if (name !== undefined) {
    const normalizedName = normalizeOrganizationName(name)
    if (!normalizedName) {
      throw new OrganizationError("invalid_name", "Organization name is required")
    }

    updates.name = normalizedName
  }

  if (slug !== undefined) {
    const normalizedSlug = await generateUniqueSlug({
      desired: slug,
      excludeOrganizationId: organization._id,
    })

    updates.slug = normalizedSlug
  }

  if (Object.keys(updates).length === 0) {
    return {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
      role: currentMembership.role,
    }
  }

  updates.updatedAt = new Date()

  await organizations.updateOne(
    { _id: organization._id },
    {
      $set: updates,
    }
  )

  const updated = await organizations.findOne({ _id: organization._id })

  if (!updated?._id) {
    throw new OrganizationError("organization_not_found", "Organization was not found")
  }

  return {
    id: updated._id.toString(),
    name: updated.name,
    slug: updated.slug,
    role: currentMembership.role,
  }
}

export const updateMemberRoleInCurrentOrganization = async ({
  userId,
  memberUserId,
  role,
}: {
  userId: string | ObjectId
  memberUserId: string | ObjectId
  role: OrganizationRole
}) => {
  const parsedUserId = toObjectId(userId)
  const parsedMemberUserId = toObjectId(memberUserId)
  const memberships = await membershipsCollection()

  const currentMembership = await getCurrentMembership(parsedUserId)
  assertRoleUpdatePermission(currentMembership.role)

  const targetMembership = await memberships.findOne({
    organizationId: currentMembership.organizationId,
    userId: parsedMemberUserId,
  })

  if (!targetMembership) {
    throw new OrganizationError("user_not_found", "Member was not found in this organization")
  }

  if (targetMembership.role === role) {
    return
  }

  if (targetMembership.role === "owner" && role !== "owner") {
    await ensureAtLeastOneOwnerAfterChange({
      organizationId: currentMembership.organizationId,
      userIdToDemoteOrRemove: parsedMemberUserId,
    })
  }

  await memberships.updateOne(
    {
      organizationId: currentMembership.organizationId,
      userId: parsedMemberUserId,
    },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    }
  )
}

export const kickMemberFromCurrentOrganization = async ({
  userId,
  memberUserId,
}: {
  userId: string | ObjectId
  memberUserId: string | ObjectId
}) => {
  const parsedUserId = toObjectId(userId)
  const parsedMemberUserId = toObjectId(memberUserId)
  const memberships = await membershipsCollection()
  const organizations = await organizationsCollection()
  const users = await usersCollection()

  const currentMembership = await getCurrentMembership(parsedUserId)
  assertKickPermission(currentMembership.role)

  if (parsedMemberUserId.toString() === parsedUserId.toString()) {
    throw new OrganizationError("invalid_operation", "Use leave organization for your own account")
  }

  const targetMembership = await memberships.findOne({
    organizationId: currentMembership.organizationId,
    userId: parsedMemberUserId,
  })

  if (!targetMembership) {
    throw new OrganizationError("user_not_found", "Member was not found in this organization")
  }

  const organization = await organizations.findOne({ _id: currentMembership.organizationId })

  if (!organization?._id) {
    throw new OrganizationError("organization_not_found", "Organization was not found")
  }

  if (isHomeOrganizationForUser(organization, parsedMemberUserId)) {
    throw new OrganizationError("cannot_remove_home_org", "A user cannot be removed from their home organization")
  }

  if (targetMembership.role === "owner") {
    await ensureAtLeastOneOwnerAfterChange({
      organizationId: currentMembership.organizationId,
      userIdToDemoteOrRemove: parsedMemberUserId,
    })
  }

  await memberships.deleteOne({
    organizationId: currentMembership.organizationId,
    userId: parsedMemberUserId,
  })

  const targetUser = await users.findOne({ _id: parsedMemberUserId })
  const targetCurrentOrganizationId =
    targetUser?.currentOrganizationId instanceof ObjectId
      ? targetUser.currentOrganizationId.toString()
      : typeof targetUser?.currentOrganizationId === "string"
        ? targetUser.currentOrganizationId
        : null

  if (targetCurrentOrganizationId === currentMembership.organizationId.toString()) {
    await setFallbackCurrentOrganizationForUser(parsedMemberUserId)
  }
}

export const leaveCurrentOrganization = async ({
  userId,
}: {
  userId: string | ObjectId
}) => {
  const parsedUserId = toObjectId(userId)
  const memberships = await membershipsCollection()
  const organizations = await organizationsCollection()

  const currentMembership = await getCurrentMembership(parsedUserId)
  const organization = await organizations.findOne({ _id: currentMembership.organizationId })

  if (!organization?._id) {
    throw new OrganizationError("organization_not_found", "Organization was not found")
  }

  assertHasPermission(currentMembership.role, "organization.leave")

  if (isHomeOrganizationForUser(organization, parsedUserId)) {
    throw new OrganizationError("cannot_leave_home_org", "You cannot leave your home organization")
  }

  if (currentMembership.role === "owner") {
    await ensureAtLeastOneOwnerAfterChange({
      organizationId: currentMembership.organizationId,
      userIdToDemoteOrRemove: parsedUserId,
    })
  }

  await memberships.deleteOne({
    organizationId: currentMembership.organizationId,
    userId: parsedUserId,
  })

  await setFallbackCurrentOrganizationForUser(parsedUserId)
}

export const inviteUserToCurrentOrganization = async ({
  userId,
  email,
  role,
}: {
  userId: string | ObjectId
  email: string
  role: OrganizationRole
}) => {
  const parsedUserId = toObjectId(userId)
  const normalized = normalizeEmail(email)

  if (!isValidEmail(normalized)) {
    throw new OrganizationError("invalid_email", "Please enter a valid email address")
  }

  const users = await usersCollection()
  const invitations = await invitationsCollection()
  const organizations = await organizationsCollection()
  const memberships = await membershipsCollection()

  const currentMembership = await getCurrentMembership(parsedUserId)
  assertHasPermission(currentMembership.role, "organization.members.invite")

  const organization = await organizations.findOne({ _id: currentMembership.organizationId })

  if (!organization?._id) {
    throw new OrganizationError("organization_not_found", "Organization was not found")
  }

  const existingMember = await users.findOne({ email: normalized })

  if (existingMember?._id) {
    const memberMatch = await memberships.findOne({
      organizationId: organization._id,
      userId: existingMember._id,
    })

    if (memberMatch) {
      throw new OrganizationError("already_member", "User is already a member of this organization")
    }
  }

  const actor = await users.findOne({ _id: parsedUserId })

  await invitations.updateMany(
    {
      organizationId: organization._id,
      emailNormalized: normalized,
      acceptedAt: { $exists: false },
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        revokedAt: new Date(),
        revokedByUserId: parsedUserId,
        updatedAt: new Date(),
      },
    }
  )

  const token = crypto.randomBytes(32).toString("hex")
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const inserted = await invitations.insertOne({
    organizationId: organization._id,
    email: normalized,
    emailNormalized: normalized,
    role,
    invitedByUserId: parsedUserId,
    tokenHash: hashToken(token),
    expiresAt,
    createdAt: now,
    updatedAt: now,
  })

  return {
    token,
    invitedUserId: existingMember?._id?.toString() ?? null,
    invitation: {
      id: inserted.insertedId.toString(),
      email: normalized,
      role,
      expiresAt: expiresAt.toISOString(),
      invitedAt: now.toISOString(),
      invitedByName: actor?.name?.trim() || actor?.email || null,
    },
    organization: {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    },
  }
}

export const revokeInvitationFromCurrentOrganization = async ({
  userId,
  invitationId,
}: {
  userId: string | ObjectId
  invitationId: string
}) => {
  const parsedUserId = toObjectId(userId)
  const parsedInvitationId = safeObjectId(invitationId)

  if (!parsedInvitationId) {
    throw new OrganizationError("invalid_invitation", "Invitation does not exist")
  }

  const invitations = await invitationsCollection()

  const currentMembership = await getCurrentMembership(parsedUserId)
  assertHasPermission(currentMembership.role, "organization.members.invitation.revoke")

  const result = await invitations.updateOne(
    {
      _id: parsedInvitationId,
      organizationId: currentMembership.organizationId,
      acceptedAt: { $exists: false },
      revokedAt: { $exists: false },
    },
    {
      $set: {
        revokedAt: new Date(),
        revokedByUserId: parsedUserId,
        updatedAt: new Date(),
      },
    }
  )

  if (!result.matchedCount) {
    throw new OrganizationError("invalid_invitation", "Invitation does not exist")
  }
}

export const acceptOrganizationInvitation = async ({
  token,
  userId,
}: {
  token: string
  userId: string | ObjectId
}) => {
  const parsedUserId = toObjectId(userId)
  const invitations = await invitationsCollection()
  const memberships = await membershipsCollection()
  const organizations = await organizationsCollection()
  const users = await usersCollection()

  const invitation = await invitations.findOne({ tokenHash: hashToken(token) })

  if (!invitation?._id) {
    throw new OrganizationError("invalid_invitation", "Invitation is invalid or expired")
  }

  if (invitation.revokedAt) {
    throw new OrganizationError("invitation_revoked", "This invitation was revoked")
  }

  if (invitation.expiresAt.getTime() <= Date.now()) {
    throw new OrganizationError("invitation_expired", "This invitation has expired")
  }

  const user = await users.findOne({ _id: parsedUserId })

  if (!user?.email) {
    throw new OrganizationError("user_not_found", "User was not found")
  }

  if (normalizeEmail(user.email) !== invitation.emailNormalized) {
    throw new OrganizationError(
      "email_mismatch",
      "This invitation was sent to a different email address"
    )
  }

  const organization = await organizations.findOne({ _id: invitation.organizationId })

  if (!organization?._id) {
    throw new OrganizationError("organization_not_found", "Organization was not found")
  }

  const existingMembership = await memberships.findOne({
    organizationId: invitation.organizationId,
    userId: parsedUserId,
  })

  if (!existingMembership) {
    await memberships.insertOne({
      organizationId: invitation.organizationId,
      userId: parsedUserId,
      role: invitation.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  await users.updateOne(
    { _id: parsedUserId },
    {
      $set: {
        currentOrganizationId: invitation.organizationId,
      },
    }
  )

  await invitations.updateOne(
    { _id: invitation._id },
    {
      $set: {
        acceptedAt: new Date(),
        acceptedByUserId: parsedUserId,
        updatedAt: new Date(),
      },
    }
  )

  return {
    organization: {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    },
  }
}

export const getInvitationPreview = async (token: string) => {
  const invitations = await invitationsCollection()
  const organizations = await organizationsCollection()

  const invitation = await invitations.findOne({ tokenHash: hashToken(token) })

  if (!invitation?._id) {
    throw new OrganizationError("invalid_invitation", "Invitation is invalid or expired")
  }

  if (invitation.revokedAt) {
    throw new OrganizationError("invitation_revoked", "This invitation was revoked")
  }

  if (invitation.expiresAt.getTime() <= Date.now()) {
    throw new OrganizationError("invitation_expired", "This invitation has expired")
  }

  const organization = await organizations.findOne({ _id: invitation.organizationId })

  if (!organization?._id) {
    throw new OrganizationError("organization_not_found", "Organization was not found")
  }

  return {
    organization: {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    },
    email: invitation.email,
    role: invitation.role,
    expiresAt: invitation.expiresAt.toISOString(),
  }
}

export { OrganizationError }
