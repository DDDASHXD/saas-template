"use client"

import * as React from "react"

import type { NotificationAction, UserNotification } from "@/lib/notifications"

interface NotificationFeedResponse {
  notifications: UserNotification[]
  unreadCount: number
  unseenCount: number
}

interface UseNotificationsResult {
  notifications: UserNotification[]
  unreadCount: number
  unseenCount: number
  isLoading: boolean
  isMutating: boolean
  error: string | null
  refresh: () => Promise<void>
  markSeen: (deliveryIds: string[]) => Promise<void>
  markRead: (deliveryIds: string[]) => Promise<void>
  archive: (deliveryIds: string[]) => Promise<void>
  remove: (deliveryIds: string[]) => Promise<void>
}

const parseResponse = async (response: Response): Promise<NotificationFeedResponse> => {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error?: string }).error)
        : "Request failed"

    throw new Error(message)
  }

  return payload as NotificationFeedResponse
}

const useNotifications = (): UseNotificationsResult => {
  const [notifications, setNotifications] = React.useState<UserNotification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [unseenCount, setUnseenCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isMutating, setIsMutating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const applyFeed = React.useCallback((feed: NotificationFeedResponse) => {
    setNotifications(feed.notifications)
    setUnreadCount(feed.unreadCount)
    setUnseenCount(feed.unseenCount)
  }, [])

  const refresh = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/notifications", { cache: "no-store" })
      const feed = await parseResponse(response)
      applyFeed(feed)
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Could not load notifications")
    } finally {
      setIsLoading(false)
    }
  }, [applyFeed])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const mutate = React.useCallback(
    async (operation: "seen" | "read" | "archive" | "delete", deliveryIds: string[]) => {
      if (deliveryIds.length === 0) {
        return
      }

      setIsMutating(true)
      setError(null)

      try {
        const response = await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ operation, deliveryIds }),
        })

        const feed = await parseResponse(response)
        applyFeed(feed)
      } catch (mutationError) {
        setError(mutationError instanceof Error ? mutationError.message : "Notification update failed")
      } finally {
        setIsMutating(false)
      }
    },
    [applyFeed]
  )

  const markSeen = React.useCallback(
    async (deliveryIds: string[]) => mutate("seen", deliveryIds),
    [mutate]
  )

  const markRead = React.useCallback(
    async (deliveryIds: string[]) => mutate("read", deliveryIds),
    [mutate]
  )

  const archive = React.useCallback(
    async (deliveryIds: string[]) => mutate("archive", deliveryIds),
    [mutate]
  )

  const remove = React.useCallback(
    async (deliveryIds: string[]) => mutate("delete", deliveryIds),
    [mutate]
  )

  return {
    notifications,
    unreadCount,
    unseenCount,
    isLoading,
    isMutating,
    error,
    refresh,
    markSeen,
    markRead,
    archive,
    remove,
  }
}

export { useNotifications }
export type { NotificationAction }
