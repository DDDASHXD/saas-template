import { ObjectId } from "mongodb"

import { getDb } from "@/lib/mongodb"

export type NotificationAction =
  | {
      kind: "route"
      href: string
    }
  | {
      kind: "url"
      url: string
      target?: "_self" | "_blank"
    }
  | {
      kind: "open_settings"
      scope?: "account" | "organization"
      pageId?: string
    }
  | {
      kind: "accept_invitation"
      token: string
    }
  | {
      kind: "alert_dialog"
      title: string
      description: string
      confirmLabel?: string
      cancelLabel?: string
      confirmAction: Exclude<NotificationAction, { kind: "alert_dialog" }>
    }

export interface NotificationDocument {
  _id?: ObjectId
  type: string
  title: string
  body: string
  data?: Record<string, unknown>
  actions?: NotificationAction[]
  createdAt: Date
}

interface NotificationDeliveryDocument {
  _id?: ObjectId
  notificationId: ObjectId
  userId: ObjectId
  deliveredAt: Date
  seenAt: Date | null
  readAt: Date | null
  archivedAt: Date | null
  deletedAt: Date | null
}

export interface UserNotification {
  deliveryId: string
  notificationId: string
  type: string
  title: string
  body: string
  data: Record<string, unknown>
  actions: NotificationAction[]
  deliveredAt: string
  seenAt: string | null
  readAt: string | null
  archivedAt: string | null
  deletedAt: string | null
  createdAt: string
}

export interface NotificationFeed {
  notifications: UserNotification[]
  unreadCount: number
  unseenCount: number
}

const NOTIFICATIONS_COLLECTION = "notifications"
const NOTIFICATION_DELIVERIES_COLLECTION = "notification_deliveries"

let ensureIndexesPromise: Promise<void> | null = null

const ensureNotificationIndexes = async () => {
  if (!ensureIndexesPromise) {
    ensureIndexesPromise = (async () => {
      const db = await getDb()
      await db
        .collection<NotificationDocument>(NOTIFICATIONS_COLLECTION)
        .createIndex({ createdAt: -1 })
      await db
        .collection<NotificationDeliveryDocument>(NOTIFICATION_DELIVERIES_COLLECTION)
        .createIndex({ userId: 1, deliveredAt: -1 })
      await db
        .collection<NotificationDeliveryDocument>(NOTIFICATION_DELIVERIES_COLLECTION)
        .createIndex({ userId: 1, archivedAt: 1, deletedAt: 1, deliveredAt: -1 })
      await db
        .collection<NotificationDeliveryDocument>(NOTIFICATION_DELIVERIES_COLLECTION)
        .createIndex({ notificationId: 1, userId: 1 }, { unique: true })
    })().catch((error) => {
      ensureIndexesPromise = null
      throw error
    })
  }

  return ensureIndexesPromise
}

const notificationsCollection = async () =>
  (await getDb()).collection<NotificationDocument>(NOTIFICATIONS_COLLECTION)

const deliveriesCollection = async () =>
  (await getDb()).collection<NotificationDeliveryDocument>(NOTIFICATION_DELIVERIES_COLLECTION)

const toObjectId = (value: string | ObjectId) =>
  value instanceof ObjectId ? value : new ObjectId(value)

const toISOString = (value: Date | null | undefined) => (value ? value.toISOString() : null)

export const createNotification = async ({
  type,
  title,
  body,
  data,
  actions,
  recipientUserIds,
}: {
  type: string
  title: string
  body: string
  data?: Record<string, unknown>
  actions?: NotificationAction[]
  recipientUserIds: Array<string | ObjectId>
}) => {
  await ensureNotificationIndexes()

  const uniqueRecipients = [...new Set(recipientUserIds.map((userId) => toObjectId(userId).toString()))]

  if (uniqueRecipients.length === 0) {
    return null
  }

  const notifications = await notificationsCollection()
  const deliveries = await deliveriesCollection()

  const now = new Date()
  const notificationInsert = await notifications.insertOne({
    type,
    title,
    body,
    ...(data ? { data } : {}),
    ...(actions ? { actions } : {}),
    createdAt: now,
  })

  const notificationId = notificationInsert.insertedId

  await deliveries.insertMany(
    uniqueRecipients.map((userId) => ({
      notificationId,
      userId: new ObjectId(userId),
      deliveredAt: now,
      seenAt: null,
      readAt: null,
      archivedAt: null,
      deletedAt: null,
    }))
  )

  return notificationId.toString()
}

export const getNotificationFeedForUser = async ({
  userId,
  limit = 25,
  includeArchived = false,
}: {
  userId: string | ObjectId
  limit?: number
  includeArchived?: boolean
}): Promise<NotificationFeed> => {
  await ensureNotificationIndexes()

  const parsedUserId = toObjectId(userId)
  const deliveries = await deliveriesCollection()
  const notifications = await notificationsCollection()

  const deliveryDocs = await deliveries
    .find({
      userId: parsedUserId,
      deletedAt: null,
      ...(includeArchived ? {} : { archivedAt: null }),
    })
    .sort({ deliveredAt: -1 })
    .limit(limit)
    .toArray()

  if (deliveryDocs.length === 0) {
    return {
      notifications: [],
      unreadCount: 0,
      unseenCount: 0,
    }
  }

  const notificationIds = deliveryDocs.map((delivery) => delivery.notificationId)
  const notificationDocs = await notifications.find({ _id: { $in: notificationIds } }).toArray()
  const notificationMap = new Map(
    notificationDocs
      .filter((notification): notification is NotificationDocument & { _id: ObjectId } =>
        Boolean(notification._id)
      )
      .map((notification) => [notification._id.toString(), notification])
  )

  const feedNotifications = deliveryDocs
    .map((delivery) => {
      const notification = notificationMap.get(delivery.notificationId.toString())

      if (!notification?._id) {
        return null
      }

      return {
        deliveryId: delivery._id?.toString() ?? "",
        notificationId: notification._id.toString(),
        type: notification.type,
        title: notification.title,
        body: notification.body,
        data: notification.data ?? {},
        actions: notification.actions ?? [],
        deliveredAt: delivery.deliveredAt.toISOString(),
        seenAt: toISOString(delivery.seenAt),
        readAt: toISOString(delivery.readAt),
        archivedAt: toISOString(delivery.archivedAt),
        deletedAt: toISOString(delivery.deletedAt),
        createdAt: notification.createdAt.toISOString(),
      } satisfies UserNotification
    })
    .filter((notification): notification is UserNotification => Boolean(notification))

  const unreadCount = await deliveries.countDocuments({
    userId: parsedUserId,
    deletedAt: null,
    archivedAt: null,
    readAt: null,
  })

  const unseenCount = await deliveries.countDocuments({
    userId: parsedUserId,
    deletedAt: null,
    archivedAt: null,
    seenAt: null,
  })

  return {
    notifications: feedNotifications,
    unreadCount,
    unseenCount,
  }
}

const updateDeliveryTimestamps = async ({
  userId,
  deliveryIds,
  operation,
}: {
  userId: string | ObjectId
  deliveryIds: string[]
  operation: "seen" | "read" | "archive" | "delete"
}) => {
  if (deliveryIds.length === 0) {
    return
  }

  await ensureNotificationIndexes()

  const parsedUserId = toObjectId(userId)
  const deliveries = await deliveriesCollection()

  const validDeliveryIds = deliveryIds.filter((deliveryId) => ObjectId.isValid(deliveryId))

  if (validDeliveryIds.length === 0) {
    return
  }

  const now = new Date()
  const filter = {
    _id: { $in: validDeliveryIds.map((deliveryId) => new ObjectId(deliveryId)) },
    userId: parsedUserId,
  }

  if (operation === "seen") {
    await deliveries.updateMany(
      {
        ...filter,
        seenAt: null,
      },
      {
        $set: {
          seenAt: now,
        },
      }
    )
    return
  }

  if (operation === "read") {
    await deliveries.updateMany(
      {
        ...filter,
        readAt: null,
      },
      {
        $set: {
          readAt: now,
          seenAt: now,
        },
      }
    )
    return
  }

  if (operation === "archive") {
    await deliveries.updateMany(
      filter,
      {
        $set: {
          archivedAt: now,
          seenAt: now,
          readAt: now,
        },
      }
    )
    return
  }

  await deliveries.updateMany(
    filter,
    {
      $set: {
        deletedAt: now,
        archivedAt: now,
        seenAt: now,
        readAt: now,
      },
    }
  )
}

export const markNotificationDeliveriesSeen = async ({
  userId,
  deliveryIds,
}: {
  userId: string | ObjectId
  deliveryIds: string[]
}) => {
  await updateDeliveryTimestamps({ userId, deliveryIds, operation: "seen" })
}

export const markNotificationDeliveriesRead = async ({
  userId,
  deliveryIds,
}: {
  userId: string | ObjectId
  deliveryIds: string[]
}) => {
  await updateDeliveryTimestamps({ userId, deliveryIds, operation: "read" })
}

export const archiveNotificationDeliveries = async ({
  userId,
  deliveryIds,
}: {
  userId: string | ObjectId
  deliveryIds: string[]
}) => {
  await updateDeliveryTimestamps({ userId, deliveryIds, operation: "archive" })
}

export const deleteNotificationDeliveries = async ({
  userId,
  deliveryIds,
}: {
  userId: string | ObjectId
  deliveryIds: string[]
}) => {
  await updateDeliveryTimestamps({ userId, deliveryIds, operation: "delete" })
}
