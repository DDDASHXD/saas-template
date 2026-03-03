import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import type { Adapter, AdapterUser } from "next-auth/adapters"

import { siteConfig } from "@/config"
import { consumeEmailOtp } from "@/lib/auth-tokens"
import authConfig from "@/lib/auth.config"
import clientPromise, { getDb } from "@/lib/mongodb"
import { ensureUserHasOrganization } from "@/lib/organizations"
import { normalizeEmail } from "@/lib/auth-validation"

interface AuthUserDocument {
  _id?: {
    toString: () => string
  }
  name?: string | null
  email?: string | null
  image?: string | null
  password?: string
  emailVerified?: Date | null
  needsOnboarding?: boolean
  currentOrganizationId?: {
    toString: () => string
  } | string | null
  createdAt?: Date
  updatedAt?: Date
}

const getDefaultNameFromEmail = (email: string) => {
  const [namePart] = email.split("@")
  return namePart || "User"
}

const credentialsProvider = Credentials({
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
    otp: { label: "One-time code", type: "text" },
  },
  async authorize(credentials) {
    const rawEmail = credentials?.email as string | undefined
    const email = rawEmail ? normalizeEmail(rawEmail) : ""

    if (!email) {
      return null
    }

    const db = await getDb()
    const usersCollection = db.collection<AuthUserDocument>("users")

    if (siteConfig.auth.genericLoginType === "emailOTP") {
      const otp = (credentials?.otp as string | undefined)?.trim()

      if (!otp || !/^\d{6}$/.test(otp)) {
        return null
      }

      const isValidOtp = await consumeEmailOtp(email, otp)
      if (!isValidOtp) {
        return null
      }

      const existingUser = await usersCollection.findOne({ email })

      if (!existingUser) {
        const name = getDefaultNameFromEmail(email)
        const now = new Date()
        const createdUser = await usersCollection.insertOne({
          name,
          email,
          image: null,
          emailVerified: now,
          needsOnboarding: true,
          createdAt: now,
          updatedAt: now,
        })

        const currentOrganizationId = await ensureUserHasOrganization({
          userId: createdUser.insertedId.toString(),
          name,
          email,
        })

        return {
          id: createdUser.insertedId.toString(),
          name,
          email,
          image: null,
          needsOnboarding: true,
          currentOrganizationId,
        }
      }

      if (!existingUser.emailVerified) {
        await usersCollection.updateOne(
          { _id: existingUser._id },
          { $set: { emailVerified: new Date(), updatedAt: new Date() } }
        )
      }

      const currentOrganizationId = await ensureUserHasOrganization({
        userId: existingUser._id!.toString(),
        name: existingUser.name,
        email,
      })

      return {
        id: existingUser._id!.toString(),
        name: existingUser.name ?? getDefaultNameFromEmail(email),
        email,
        image: existingUser.image ?? null,
        currentOrganizationId,
      }
    }

    if (siteConfig.auth.genericLoginType !== "emailAndPassword") {
      return null
    }

    const password = credentials?.password as string | undefined

    if (!password) {
      return null
    }

    const user = await usersCollection.findOne({ email })

    if (!user || !user.password) {
      return null
    }

    if (siteConfig.auth.requireEmailConfirmation && !user.emailVerified) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }

    const currentOrganizationId = await ensureUserHasOrganization({
      userId: user._id!.toString(),
      name: user.name,
      email: user.email,
    })

    return {
      id: user._id!.toString(),
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      currentOrganizationId,
    }
  },
})

const oauthProviders = authConfig.providers.filter(
  (provider: { type?: string }) => provider.type !== "credentials"
)

const providers = [
  ...(siteConfig.auth.genericLoginType !== "none" ? [credentialsProvider] : []),
  ...oauthProviders,
]

if (providers.length === 0) {
  providers.push(
    Credentials({
      credentials: {},
      authorize() {
        return null
      },
    })
  )
}

const baseAdapter = MongoDBAdapter(clientPromise) as Adapter

const adapter: Adapter = {
  ...baseAdapter,
  async createUser(data: AdapterUser) {
    const user = await baseAdapter.createUser!(data)

    const db = await getDb()
    const updateFields = {
      needsOnboarding: true,
      updatedAt: new Date(),
    }

    await db
      .collection("users")
      .updateOne({ email: data.email }, { $set: updateFields })

    const currentOrganizationId = await ensureUserHasOrganization({
      userId: user.id,
      name: user.name,
      email: user.email,
    })

    return { ...user, needsOnboarding: true, currentOrganizationId }
  },
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter,
  providers,
})
