import { useState, useCallback } from 'react'

type EventCategory = 'checkin' | 'story' | 'growth' | 'period' | 'intimacy'
type NotificationType = 'toast' | 'banner' | 'modal'

interface NotificationMessage {
  category: EventCategory
  message: string
  type: NotificationType
  priority: number
}

const NOTIFICATION_CATALOG: Record<string, NotificationMessage> = {
  checkin_done: {
    category: 'checkin',
    message: '打卡完成！坚持每天互动，感情会越来越好哦~',
    type: 'toast',
    priority: 1,
  },
  story_relay: {
    category: 'story',
    message: 'TA接了一句话！快去看看你们的故事吧~',
    type: 'toast',
    priority: 1,
  },
  growth_added: {
    category: 'growth',
    message: '已记录触动瞬间，这是你们感情的珍贵养分',
    type: 'toast',
    priority: 1,
  },
  period_tracked: {
    category: 'period',
    message: '经期记录已更新，关怀从不缺席',
    type: 'toast',
    priority: 1,
  },
  intimacy_recorded: {
    category: 'intimacy',
    message: '私密时刻已记录，这是只属于你们两人的记忆',
    type: 'toast',
    priority: 2,
  },
  meeting_soon: {
    category: 'period',
    message: '距离见面只剩1天了！准备好迎接TA吧~',
    type: 'banner',
    priority: 0,
  },
  anniversary_soon: {
    category: 'period',
    message: '纪念日快到了！别忘了准备惊喜~',
    type: 'banner',
    priority: 0,
  },
}

const SESSION_KEY_PREFIX = 'qinggan_notify_session_'

function getSessionKey(category: string): string {
  return `${SESSION_KEY_PREFIX}${category}`
}

function hasNotifiedInSession(category: string): boolean {
  return sessionStorage.getItem(getSessionKey(category)) === '1'
}

function markNotifiedInSession(category: string): void {
  sessionStorage.setItem(getSessionKey(category), '1')
}

export function useNotificationSystem() {
  const [banner, setBanner] = useState<string | null>(null)

  const isIntimacyAllowed = useCallback((): boolean => {
    const v = localStorage.getItem('qinggan_allow_intimacy_notify')
    if (v === null) {
      localStorage.setItem('qinggan_allow_intimacy_notify', '1')
      return true
    }
    return v === '1'
  }, [])

  const setIntimacyNotification = useCallback((allowed: boolean) => {
    localStorage.setItem('qinggan_allow_intimacy_notify', allowed ? '1' : '0')
  }, [])

  const notify = useCallback((key: string, options?: { force?: boolean }): string | null => {
    const entry = NOTIFICATION_CATALOG[key]
    if (!entry) return null

    if (entry.category === 'intimacy' && !isIntimacyAllowed()) return null

    if (entry.type === 'toast') {
      if (!options?.force && hasNotifiedInSession(entry.category)) return null
      markNotifiedInSession(entry.category)
      return entry.message
    }

    if (entry.type === 'banner') {
      setBanner(entry.message)
      return null
    }

    return null
  }, [isIntimacyAllowed])

  const dismissBanner = useCallback(() => {
    setBanner(null)
  }, [])

  const timeDrivenCheck = useCallback((
    meetingDate: string | null,
    anniversaries: { name: string; date: string }[],
  ) => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (meetingDate) {
      const mDate = new Date(meetingDate)
      const diffMs = mDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays <= 1) {
        notify('meeting_soon', { force: true })
      }
    }

    for (const a of anniversaries) {
      const aDate = new Date(a.date)
      aDate.setFullYear(now.getFullYear())
      if (aDate < now) aDate.setFullYear(now.getFullYear() + 1)
      const diffMs = aDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays <= 1) {
        notify('anniversary_soon', { force: true })
      }
    }
  }, [notify])

  return {
    notify,
    banner,
    dismissBanner,
    isIntimacyAllowed,
    setIntimacyNotification,
    timeDrivenCheck,
  }
}
