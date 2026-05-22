import { useCallback, useState } from 'react'
import { supabase } from '../supabase'
import type { Identity } from './useIdentity'

const vapidPublicKey = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY || ''

const getPushSupport = () => {
  if (typeof window === 'undefined') {
    return { supported: false, reason: '当前环境暂不支持系统推送。' }
  }

  const userAgent = navigator.userAgent || ''
  const isAppleMobile = /iPhone|iPad|iPod/i.test(userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)

  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: '当前浏览器不支持离线推送需要的 Service Worker。' }
  }

  if (!('Notification' in window)) {
    return { supported: false, reason: '当前浏览器没有开放系统通知能力，请换 Safari、Chrome 或 Edge 再试。' }
  }

  if (!('PushManager' in window)) {
    if (isAppleMobile && !isStandalone) {
      return { supported: false, reason: '苹果手机需要先用 Safari 将小花园添加到主屏幕，再从桌面图标打开后开启推送。' }
    }
    return { supported: false, reason: '当前浏览器不支持 Web Push。华为手机建议换 Chrome、Edge，或使用支持标准推送的浏览器。' }
  }

  return { supported: true, reason: '' }
}

const base64ToUint8Array = (base64: string) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(normalized)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i)
  }
  return output
}

export function usePushSubscription(identity: Identity) {
  const support = getPushSupport()
  const supported = support.supported
  const unsupportedReason = support.reason

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (!supported) return 'default'
    return Notification.permission
  })
  const [enabled, setEnabled] = useState(() => {
    if (!supported) return false
    return localStorage.getItem('qinggan_push_enabled') === '1'
  })
  const [loading, setLoading] = useState(false)
  const [statusText, setStatusText] = useState('')

  const enablePush = useCallback(async () => {
    if (!identity) {
      setStatusText('请先设置你的昵称，再开启暖心推送。')
      return false
    }
    if (!supported) {
      setStatusText(unsupportedReason || '当前设备暂不支持系统推送。')
      return false
    }
    if (!vapidPublicKey) {
      setStatusText('推送配置未完成，请先补充 VAPID 公钥。')
      return false
    }

    setLoading(true)
    try {
      const result = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
      setPermission(result)
      if (result !== 'granted') {
        setStatusText('你还没授权通知权限，开启后才能在离线时收到提醒。')
        return false
      }

      const registration = await navigator.serviceWorker.ready
      const existing = await registration.pushManager.getSubscription()
      const subscription = existing ?? await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(vapidPublicKey),
      })

      const payload = subscription.toJSON()
      const endpoint = payload.endpoint
      const p256dh = payload.keys?.p256dh
      const auth = payload.keys?.auth

      if (!endpoint || !p256dh || !auth) {
        setStatusText('推送订阅创建失败，请稍后再试。')
        return false
      }

      const { error } = await supabase.from('push_subscriptions').upsert(
        { author: identity, endpoint, p256dh, auth },
        { onConflict: 'endpoint' },
      )

      if (error) {
        setStatusText('订阅已创建，但写入云端失败，请稍后再试。')
        return false
      }

      localStorage.setItem('qinggan_push_enabled', '1')
      setEnabled(true)
      setStatusText('已开启离线暖心推送，早晚问候和重要提醒会准时送达。')
      return true
    } catch {
      setStatusText('开启推送失败，请检查网络后重试。')
      return false
    } finally {
      setLoading(false)
    }
  }, [identity, supported, unsupportedReason])

  const disablePush = useCallback(async () => {
    if (!supported) {
      setStatusText(unsupportedReason || '当前设备暂不支持系统推送。')
      return false
    }

    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        const endpoint = subscription.endpoint
        await subscription.unsubscribe()
        if (endpoint) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
        }
      }

      localStorage.removeItem('qinggan_push_enabled')
      setEnabled(false)
      setStatusText('已关闭系统推送。')
      return true
    } catch {
      setStatusText('关闭推送失败，请稍后再试。')
      return false
    } finally {
      setLoading(false)
    }
  }, [supported, unsupportedReason])

  const togglePush = useCallback(async () => {
    if (loading) return
    if (enabled) {
      await disablePush()
      return
    }
    await enablePush()
  }, [disablePush, enablePush, enabled, loading])

  return {
    supported,
    unsupportedReason,
    permission,
    enabled,
    loading,
    statusText,
    togglePush,
    enablePush,
    disablePush,
  }
}
