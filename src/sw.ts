/// <reference lib="WebWorker" />

import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import type { PrecacheEntry } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<PrecacheEntry | string> }

self.skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true }) as WindowClient[]
    await Promise.all(windows.map((client) => {
      if (!client.url || new URL(client.url).origin !== self.location.origin) return Promise.resolve(null)
      return client.navigate(client.url)
    }))
  })())
})

type PushPayload = {
  title?: string
  body?: string
  icon?: string
  badge?: string
  url?: string
}

self.addEventListener('push', (event) => {
  const fallback: PushPayload = {
    title: '小花园来信',
    body: '你们的小花园有新的温柔提醒，点开看看吧。',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    url: '/',
  }

  const show = (payload: PushPayload) => self.registration.showNotification(payload.title ?? '小花园来信', {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    data: { url: payload.url ?? '/' },
  })

  if (!event.data) {
    event.waitUntil(show(fallback))
    return
  }

  let payload: PushPayload
  try {
    const parsed = event.data.json() as PushPayload
    payload = {
      ...fallback,
      ...parsed,
    }
  } catch {
    payload = {
      ...fallback,
      body: event.data.text(),
    }
  }

  event.waitUntil(show(payload))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = typeof event.notification.data?.url === 'string' ? event.notification.data.url : '/'

  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of clients) {
      if ('focus' in client) {
        await client.focus()
        if ('navigate' in client) {
          await client.navigate(targetUrl)
        }
        return
      }
    }

    if (self.clients.openWindow) {
      await self.clients.openWindow(targetUrl)
    }
  })())
})
