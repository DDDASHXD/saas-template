import "server-only"

import { auth } from "@/lib/auth"
import {
  getCurrentOrganizationStateForUser,
  listUserOrganizations,
  type InitialOrganizationData,
} from "@/lib/organizations"

export const getInitialOrganizationData = async (): Promise<InitialOrganizationData | null> => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const [organizations, current] = await Promise.all([
    listUserOrganizations(userId),
    getCurrentOrganizationStateForUser(userId),
  ])

  return {
    organizations,
    current,
  }
}
