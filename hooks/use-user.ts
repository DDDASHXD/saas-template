"use client"

import { useSession } from "next-auth/react"

const useUser = () => {
  const { data: session, status } = useSession()
  const user = session?.user

  const id = user?.id ?? ""
  const name = user?.name ?? "User"
  const email = user?.email ?? ""
  const image = user?.image ?? `https://vercel.com/api/www/avatar?s=64&u=${encodeURIComponent(email)}`
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return {
    id,
    name,
    email,
    image,
    initials,
    currentOrganizationId: user?.currentOrganizationId ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  }
}

export { useUser }
