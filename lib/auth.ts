import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import clientPromise, { getDb } from "@/lib/mongodb"
import authConfig from "@/lib/auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        const db = await getDb()
        const user = await db.collection("users").findOne({ email })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        }
      },
    }),
    ...authConfig.providers.filter(
      (p: { type?: string }) => p.type !== "credentials"
    ),
  ],
})
