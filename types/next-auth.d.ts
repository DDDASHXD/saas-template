import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    needsOnboarding?: boolean
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      needsOnboarding?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    needsOnboarding?: boolean
  }
}
