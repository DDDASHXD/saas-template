import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  archiveNotificationDeliveries,
  deleteNotificationDeliveries,
  getNotificationFeedForUser,
  markNotificationDeliveriesRead,
  markNotificationDeliveriesSeen,
} from "@/lib/notifications"

type NotificationMutationOperation = "seen" | "read" | "archive" | "delete"

const parseDeliveryIds = (value: unknown): string[] => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(Boolean)
  }

  return []
}

export const GET = async (req: Request) => {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(req.url)
  const limit = Number(url.searchParams.get("limit") ?? "25")
  const includeArchived = url.searchParams.get("includeArchived") === "1"

  const feed = await getNotificationFeedForUser({
    userId: session.user.id,
    limit: Number.isFinite(limit) ? Math.max(1, Math.min(100, limit)) : 25,
    includeArchived,
  })

  return NextResponse.json(feed, { status: 200 })
}

export const PATCH = async (req: Request) => {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await req.json().catch(() => null)
  const operation = String(payload?.operation ?? "") as NotificationMutationOperation
  const deliveryIds = parseDeliveryIds(payload?.deliveryIds)

  if (!operation || !["seen", "read", "archive", "delete"].includes(operation)) {
    return NextResponse.json(
      { error: "Valid operation is required" },
      { status: 400 }
    )
  }

  if (deliveryIds.length === 0) {
    return NextResponse.json({ error: "deliveryIds is required" }, { status: 400 })
  }

  if (operation === "seen") {
    await markNotificationDeliveriesSeen({ userId: session.user.id, deliveryIds })
  }

  if (operation === "read") {
    await markNotificationDeliveriesRead({ userId: session.user.id, deliveryIds })
  }

  if (operation === "archive") {
    await archiveNotificationDeliveries({ userId: session.user.id, deliveryIds })
  }

  if (operation === "delete") {
    await deleteNotificationDeliveries({ userId: session.user.id, deliveryIds })
  }

  const feed = await getNotificationFeedForUser({ userId: session.user.id })

  return NextResponse.json(feed, { status: 200 })
}
