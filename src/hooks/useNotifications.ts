import { useState, useCallback } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return 'Notification' in window ? Notification.permission : 'default'
  })

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false
    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }, [])

  const notify = useCallback((title: string, options?: { body?: string; icon?: string }) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    try {
      new Notification(title, {
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        ...options,
      })
    } catch {
      // Notification API may not be fully supported
    }
  }, [])

  return { permission, requestPermission, notify }
}
