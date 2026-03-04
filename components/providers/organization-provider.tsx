"use client"

import * as React from "react"

import type {
  CurrentOrganizationState,
  InitialOrganizationData,
  OrganizationInvitationView,
  OrganizationMember,
  OrganizationRole,
  OrganizationSummary,
  UserOrganization,
} from "@/lib/organizations"

interface InvitationMutationResponse {
  role: OrganizationRole
  isHomeForCurrentUser?: boolean
  members: OrganizationMember[]
  invitations: OrganizationInvitationView[]
  invited?: string[]
  failed?: { email: string; error: string }[]
}

interface OrganizationContextValue {
  organizations: UserOrganization[]
  currentOrganization: OrganizationSummary | null
  currentRole: OrganizationRole | null
  isCurrentOrganizationHome: boolean
  members: OrganizationMember[]
  invitations: OrganizationInvitationView[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  refresh: () => Promise<void>
  createOrganization: (payload: { name: string; slug?: string }) => Promise<{ error?: string }>
  switchOrganization: (organizationId: string) => Promise<{ error?: string }>
  updateCurrentOrganization: (payload: { name?: string; slug?: string }) => Promise<{ error?: string }>
  inviteMembers: (payload: {
    emails: string[]
    role: OrganizationRole
  }) => Promise<{ invited: string[]; failed: { email: string; error: string }[]; error?: string }>
  revokeInvitation: (invitationId: string) => Promise<{ error?: string }>
  updateMemberRole: (payload: {
    memberUserId: string
    role: OrganizationRole
  }) => Promise<{ error?: string }>
  kickMember: (memberUserId: string) => Promise<{ error?: string }>
  leaveCurrentOrganization: () => Promise<{ error?: string }>
}

const OrganizationContext = React.createContext<OrganizationContextValue | null>(null)

const extractError = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

const parseJsonResponse = async <T,>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error?: string }).error)
        : "Request failed"

    throw new Error(message)
  }

  return data as T
}

const useOrganizations = () => {
  const context = React.useContext(OrganizationContext)

  if (!context) {
    throw new Error("useOrganizations must be used within OrganizationProvider")
  }

  return context
}

const OrganizationProvider = ({
  children,
  initialData,
}: {
  children: React.ReactNode
  initialData?: InitialOrganizationData | null
}) => {
  const hasInitialData = Boolean(initialData)
  const [organizations, setOrganizations] = React.useState<UserOrganization[]>(
    initialData?.organizations ?? []
  )
  const [currentOrganization, setCurrentOrganization] = React.useState<OrganizationSummary | null>(
    initialData?.current.organization ?? null
  )
  const [currentRole, setCurrentRole] = React.useState<OrganizationRole | null>(
    initialData?.current.role ?? null
  )
  const [isCurrentOrganizationHome, setIsCurrentOrganizationHome] = React.useState(
    initialData?.current.isHomeForCurrentUser ?? false
  )
  const [members, setMembers] = React.useState<OrganizationMember[]>(
    initialData?.current.members ?? []
  )
  const [invitations, setInvitations] = React.useState<OrganizationInvitationView[]>(
    initialData?.current.invitations ?? []
  )
  const [isLoading, setIsLoading] = React.useState(!hasInitialData)
  const [isMutating, setIsMutating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const applyCurrentOrganization = React.useCallback((payload: CurrentOrganizationState) => {
    setCurrentOrganization(payload.organization)
    setCurrentRole(payload.role)
    setIsCurrentOrganizationHome(payload.isHomeForCurrentUser)
    setMembers(payload.members)
    setInvitations(payload.invitations)
  }, [])

  const refresh = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [listResponse, currentResponse] = await Promise.all([
        fetch("/api/organizations", { cache: "no-store" }),
        fetch("/api/organizations/current", { cache: "no-store" }),
      ])

      const listData = await parseJsonResponse<{
        organizations: UserOrganization[]
        currentOrganizationId: string | null
      }>(listResponse)

      const currentData = await parseJsonResponse<CurrentOrganizationState>(currentResponse)

      setOrganizations(listData.organizations)
      applyCurrentOrganization(currentData)
    } catch (refreshError) {
      setError(extractError(refreshError, "Could not load organization data"))
    } finally {
      setIsLoading(false)
    }
  }, [applyCurrentOrganization])

  React.useEffect(() => {
    if (hasInitialData) {
      return
    }

    void refresh()
  }, [hasInitialData, refresh])

  const updateList = React.useCallback(async () => {
    const response = await fetch("/api/organizations", { cache: "no-store" })
    const data = await parseJsonResponse<{ organizations: UserOrganization[] }>(response)
    setOrganizations(data.organizations)
  }, [])

  const createOrganization = React.useCallback<OrganizationContextValue["createOrganization"]>(
    async ({ name, slug }) => {
      setIsMutating(true)
      setError(null)

      try {
        const response = await fetch("/api/organizations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, ...(slug ? { slug } : {}) }),
        })

        const data = await parseJsonResponse<{
          organization: OrganizationSummary
          organizations: UserOrganization[]
        }>(response)

        setOrganizations(data.organizations)

        const currentResponse = await fetch("/api/organizations/current", { cache: "no-store" })
        const currentData = await parseJsonResponse<CurrentOrganizationState>(currentResponse)
        applyCurrentOrganization(currentData)

        return {}
      } catch (createError) {
        const message = extractError(createError, "Could not create organization")
        setError(message)
        return { error: message }
      } finally {
        setIsMutating(false)
      }
    },
    [applyCurrentOrganization]
  )

  const switchOrganization = React.useCallback<OrganizationContextValue["switchOrganization"]>(
    async (organizationId) => {
      setIsMutating(true)
      setError(null)

      try {
        const response = await fetch("/api/organizations/current", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ organizationId }),
        })

        const data = await parseJsonResponse<CurrentOrganizationState>(response)
        applyCurrentOrganization(data)
        await updateList()

        return {}
      } catch (switchError) {
        const message = extractError(switchError, "Could not switch organization")
        setError(message)
        return { error: message }
      } finally {
        setIsMutating(false)
      }
    },
    [applyCurrentOrganization, updateList]
  )

  const updateCurrentOrganization =
    React.useCallback<OrganizationContextValue["updateCurrentOrganization"]>(
      async ({ name, slug }) => {
        setIsMutating(true)
        setError(null)

        try {
          const response = await fetch("/api/organizations/current", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...(name !== undefined ? { name } : {}), ...(slug !== undefined ? { slug } : {}) }),
          })

          const data = await parseJsonResponse<CurrentOrganizationState>(response)
          applyCurrentOrganization(data)
          await updateList()

          return {}
        } catch (updateError) {
          const message = extractError(updateError, "Could not update organization")
          setError(message)
          return { error: message }
        } finally {
          setIsMutating(false)
        }
      },
      [applyCurrentOrganization, updateList]
    )

  const inviteMembers = React.useCallback<OrganizationContextValue["inviteMembers"]>(
    async ({ emails, role }) => {
      setIsMutating(true)
      setError(null)

      try {
        const response = await fetch("/api/organizations/current/invitations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emails, role }),
        })

        const data = await parseJsonResponse<InvitationMutationResponse>(response)

        setCurrentRole(data.role)
        setIsCurrentOrganizationHome(data.isHomeForCurrentUser ?? isCurrentOrganizationHome)
        setMembers(data.members)
        setInvitations(data.invitations)

        return {
          invited: data.invited ?? [],
          failed: data.failed ?? [],
        }
      } catch (inviteError) {
        const message = extractError(inviteError, "Could not send invitations")
        setError(message)

        return {
          invited: [],
          failed: [],
          error: message,
        }
      } finally {
        setIsMutating(false)
      }
    },
    [isCurrentOrganizationHome]
  )

  const revokeInvitation = React.useCallback<OrganizationContextValue["revokeInvitation"]>(
    async (invitationId) => {
      setIsMutating(true)
      setError(null)

      try {
        const response = await fetch("/api/organizations/current/invitations", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ invitationId }),
        })

        const data = await parseJsonResponse<InvitationMutationResponse>(response)

        setCurrentRole(data.role)
        setIsCurrentOrganizationHome(data.isHomeForCurrentUser ?? isCurrentOrganizationHome)
        setMembers(data.members)
        setInvitations(data.invitations)

        return {}
      } catch (revokeError) {
        const message = extractError(revokeError, "Could not revoke invitation")
        setError(message)
        return { error: message }
      } finally {
        setIsMutating(false)
      }
    },
    [isCurrentOrganizationHome]
  )

  const updateMemberRole = React.useCallback<OrganizationContextValue["updateMemberRole"]>(
    async ({ memberUserId, role }) => {
      setIsMutating(true)
      setError(null)

      try {
        const response = await fetch("/api/organizations/current/members", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memberUserId, role }),
        })

        const data = await parseJsonResponse<InvitationMutationResponse>(response)
        setCurrentRole(data.role)
        setIsCurrentOrganizationHome(data.isHomeForCurrentUser ?? isCurrentOrganizationHome)
        setMembers(data.members)
        setInvitations(data.invitations)

        return {}
      } catch (mutationError) {
        const message = extractError(mutationError, "Could not update member role")
        setError(message)
        return { error: message }
      } finally {
        setIsMutating(false)
      }
    },
    [isCurrentOrganizationHome]
  )

  const kickMember = React.useCallback<OrganizationContextValue["kickMember"]>(
    async (memberUserId) => {
      setIsMutating(true)
      setError(null)

      try {
        const response = await fetch("/api/organizations/current/members", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memberUserId }),
        })

        const data = await parseJsonResponse<InvitationMutationResponse>(response)
        setCurrentRole(data.role)
        setIsCurrentOrganizationHome(data.isHomeForCurrentUser ?? isCurrentOrganizationHome)
        setMembers(data.members)
        setInvitations(data.invitations)

        return {}
      } catch (mutationError) {
        const message = extractError(mutationError, "Could not remove member")
        setError(message)
        return { error: message }
      } finally {
        setIsMutating(false)
      }
    },
    [isCurrentOrganizationHome]
  )

  const leaveCurrentOrganization =
    React.useCallback<OrganizationContextValue["leaveCurrentOrganization"]>(
      async () => {
        setIsMutating(true)
        setError(null)

        try {
          const response = await fetch("/api/organizations/current/members", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          })

          const data = await parseJsonResponse<InvitationMutationResponse>(response)
          setCurrentRole(data.role)
          setIsCurrentOrganizationHome(data.isHomeForCurrentUser ?? false)
          setMembers(data.members)
          setInvitations(data.invitations)
          await updateList()

          return {}
        } catch (mutationError) {
          const message = extractError(mutationError, "Could not leave organization")
          setError(message)
          return { error: message }
        } finally {
          setIsMutating(false)
        }
      },
      [updateList]
    )

  const value = React.useMemo<OrganizationContextValue>(
    () => ({
      organizations,
      currentOrganization,
      currentRole,
      isCurrentOrganizationHome,
      members,
      invitations,
      isLoading,
      isMutating,
      error,
      refresh,
      createOrganization,
      switchOrganization,
      updateCurrentOrganization,
      inviteMembers,
      revokeInvitation,
      updateMemberRole,
      kickMember,
      leaveCurrentOrganization,
    }),
    [
      organizations,
      currentOrganization,
      currentRole,
      isCurrentOrganizationHome,
      members,
      invitations,
      isLoading,
      isMutating,
      error,
      refresh,
      createOrganization,
      switchOrganization,
      updateCurrentOrganization,
      inviteMembers,
      revokeInvitation,
      updateMemberRole,
      kickMember,
      leaveCurrentOrganization,
    ]
  )

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}

export { OrganizationProvider, useOrganizations }
