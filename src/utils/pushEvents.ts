import { createNotificationsForRecipients } from '../features/notifications/api'

export type PartnerActivityType = 'checkin' | 'diary' | 'interaction' | 'story' | 'need_hug'

const eventCopy: Record<PartnerActivityType, { title: string; body: string; route: string }> = {
  checkin: {
    title: 'TA刚刚打卡啦',
    body: 'TA在小花园里认真完成了一点日常，记得回来接住这份在意。',
    route: '/daily',
  },
  diary: {
    title: 'TA留下了今天的心情',
    body: '小花园收到了一点来自TA的心情，等你回来轻轻回应。',
    route: '/interact/diary',
  },
  interaction: {
    title: 'TA完成了一次互动',
    body: '你们的小花园又多了一点回声，有空回来看看TA写下了什么。',
    route: '/interact',
  },
  story: {
    title: 'TA接上了你们的故事',
    body: '故事又往前走了一小步，轮到你把温柔接下去了。',
    route: '/interact/story',
  },
  need_hug: {
    title: 'TA需要被哄一下',
    body: 'TA现在有点委屈，想要你抱抱、哄哄，快去接住TA。',
    route: '/',
  },
}

export const notifyPartnerActivity = async (author: string | null, category: PartnerActivityType, recipient?: string) => {
  if (!author) return
  const cleanRecipient = recipient?.trim()
  const copy = eventCopy[category]
  const deliveryKey = `activity-${category}-${Date.now()}-${author}`

  if (cleanRecipient && cleanRecipient !== author) {
    try {
      await createNotificationsForRecipients({
        delivery_key: deliveryKey,
        recipients: [cleanRecipient],
        source_author: author,
        kind: category,
        title: copy.title,
        body: copy.body,
        route: copy.route,
        payload: { author, category, route: copy.route },
      })
    } catch {
      // Message-center writes are best-effort and must not block saving user content.
    }
  }

  try {
    await fetch('/api/push-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, category, recipient: cleanRecipient, deliveryKey }),
    })
  } catch {
    // Push is best-effort and must not block saving user content.
  }
}
