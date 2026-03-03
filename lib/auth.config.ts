import type { NextAuthConfig } from "next-auth"

import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import GitHub from "next-auth/providers/github"
import Twitter from "next-auth/providers/twitter"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize() {
      return null
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  )
}

if (process.env.DISCORD_CLIENT_ID) {
  providers.push(
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    })
  )
}

if (process.env.GITHUB_CLIENT_ID) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  )
}

if (process.env.TWITTER_CLIENT_ID) {
  providers.push(
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    })
  )
}

export default {
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user

      const protectedRoutes = [
        "/overview",
        "/lists",
        "/tables",
        "/documentation",
        "/documents",
        "/messages",
        "/guides",
        "/resources",
        "/projects",
        "/pages",
        "/docs",
      ]
      const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
      const { pathname } = nextUrl

      const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
      const isAuthRoute = authRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )

      if (!isAuthenticated && isProtectedRoute) {
        return false
      }

      if (isAuthenticated && isAuthRoute) {
        return Response.redirect(new URL("/overview", nextUrl))
      }

      return true
    },
  },
} satisfies NextAuthConfig
