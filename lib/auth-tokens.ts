import crypto from "crypto"

import { getDb } from "@/lib/mongodb"

export type AuthTokenType = "emailConfirmation" | "passwordReset" | "emailOtp"

interface AuthTokenDocument {
  email: string
  type: AuthTokenType
  tokenHash: string
  expiresAt: Date
  createdAt: Date
}

const AUTH_TOKENS_COLLECTION = "auth_tokens"

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex")

const saveToken = async ({
  email,
  type,
  token,
  expiresInMinutes,
}: {
  email: string
  type: AuthTokenType
  token: string
  expiresInMinutes: number
}) => {
  const db = await getDb()
  const collection = db.collection<AuthTokenDocument>(AUTH_TOKENS_COLLECTION)

  await collection.deleteMany({ email, type })
  await collection.insertOne({
    email,
    type,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    createdAt: new Date(),
  })
}

export const createEmailConfirmationToken = async (email: string) => {
  const token = crypto.randomBytes(32).toString("hex")
  await saveToken({ email, type: "emailConfirmation", token, expiresInMinutes: 24 * 60 })
  return token
}

export const createPasswordResetToken = async (email: string) => {
  const token = crypto.randomBytes(32).toString("hex")
  await saveToken({ email, type: "passwordReset", token, expiresInMinutes: 60 })
  return token
}

export const createEmailOtp = async (email: string) => {
  const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0")
  await saveToken({ email, type: "emailOtp", token: otp, expiresInMinutes: 10 })
  return otp
}

export const consumeEmailLinkToken = async ({
  type,
  token,
}: {
  type: "emailConfirmation" | "passwordReset"
  token: string
}) => {
  const db = await getDb()
  const collection = db.collection<AuthTokenDocument>(AUTH_TOKENS_COLLECTION)

  const tokenDoc = await collection.findOne({
    type,
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  })

  if (!tokenDoc) {
    return null
  }

  await collection.deleteMany({ email: tokenDoc.email, type })
  return tokenDoc.email
}

export const consumeEmailOtp = async (email: string, otp: string) => {
  const db = await getDb()
  const collection = db.collection<AuthTokenDocument>(AUTH_TOKENS_COLLECTION)

  const tokenDoc = await collection.findOne({
    email,
    type: "emailOtp",
    tokenHash: hashToken(otp),
    expiresAt: { $gt: new Date() },
  })

  if (!tokenDoc) {
    return false
  }

  await collection.deleteMany({ email, type: "emailOtp" })
  return true
}
