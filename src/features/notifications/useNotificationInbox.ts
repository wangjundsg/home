import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Identity } from '../../hooks/useIdentity'
import { useRealtime } from '../../hooks/useRealtime'
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from './api'
import type { NotificationRecord } from './types'

export function useNotificationInbox(recipient: Identity) {
  const [items, setItems] = useState<NotificationRecord[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!recipient) {
      setItems([])
      setUnreadCount(0)
      return
    }

    setLoading(true)
    try {
      const [nextItems, nextUnreadCount] = await Promise.all([
        fetchNotifications(recipient),
        fetchUnreadNotificationCount(recipient),
      ])
      setItems(nextItems)
      setUnreadCount(nextUnreadCount)
    } finally {
      setLoading(false)
    }
  }, [recipient])

  useEffect(() => {
    void load()
  }, [load])

  const { onChange } = useRealtime<NotificationRecord>('notifications', {
    enabled: Boolean(recipient),
  })

  useEffect(() => {
    if (!recipient) return
    return onChange(() => {
      void load()
    })
  }, [load, onChange, recipient])

  const openNotification = useCallback(async (notification: NotificationRecord) => {
    if (recipient && notification.recipient === recipient) {
      await markNotificationAsRead(notification.id, recipient)
    }
    if (recipient) {
      const [nextItems, nextUnreadCount] = await Promise.all([
        fetchNotifications(recipient),
        fetchUnreadNotificationCount(recipient),
      ])
      setItems(nextItems)
      setUnreadCount(nextUnreadCount)
    }
  }, [recipient])

  const markAllRead = useCallback(async () => {
    if (!recipient) return
    await markAllNotificationsAsRead(recipient)
    await load()
  }, [load, recipient])

  return useMemo(() => ({
    items,
    unreadCount,
    loading,
    refresh: load,
    openNotification,
    markAllRead,
  }), [items, load, loading, markAllRead, openNotification, unreadCount])
}
