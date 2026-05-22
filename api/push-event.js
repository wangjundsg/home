import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const timezone = 'Asia/Shanghai'

const eventCopy = {
  checkin: {
    title: 'TA刚刚打卡啦',
    body: 'TA在小花园里认真完成了一点日常，记得回来接住这份在意。',
  },
  diary: {
    title: 'TA留下了今天的心情',
    body: '小花园收到了一点来自TA的心情，等你回来轻轻回应。',
  },
  interaction: {
    title: 'TA完成了一次互动',
    body: '你们的小花园又多了一点回声，有空回来看看TA写下了什么。',
  },
  story: {
    title: 'TA接上了你们的故事',
    body: '故事又往前走了一小步，轮到你把温柔接下去了。',
  },
}

const getLocalDateText = () => {
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const pick = (type) => formatted.find((item) => item.type === type)?.value ?? ''
  return `${pick('year')}-${pick('month')}-${pick('day')}`
}

const createSupabase = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!url || !serviceRole) {
    throw new Error('SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 未配置')
  }

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

const setupWebPush = () => {
  const publicKey = process.env.WEB_PUSH_VAPID_PUBLIC_KEY || process.env.VITE_WEB_PUSH_PUBLIC_KEY || ''
  const privateKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY || ''
  const subject = process.env.WEB_PUSH_VAPID_SUBJECT || 'mailto:team@qinggan-weihu.local'

  if (!publicKey || !privateKey) {
    throw new Error('VAPID 密钥未配置')
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
}

const insertDeliveryGuard = async (supabase, key, author, category, payload) => {
  const { error } = await supabase.from('push_delivery_logs').insert({
    delivery_key: key,
    author,
    category,
    payload,
  })

  if (!error) return true
  if (error.code === '23505') return false
  throw error
}

const sendNotifications = async (supabase, subscriptions, notification) => {
  let delivered = 0
  let cleaned = 0

  await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        JSON.stringify(notification),
      )
      delivered += 1
    } catch (error) {
      const statusCode = Number(error?.statusCode || 0)
      if (statusCode === 404 || statusCode === 410) {
        await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint)
        cleaned += 1
      }
    }
  }))

  return { delivered, cleaned }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method Not Allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const author = typeof body.author === 'string' ? body.author.trim() : ''
    const category = typeof body.category === 'string' ? body.category : ''
    const copy = eventCopy[category]

    if (!author || author.length > 64 || !copy) {
      res.status(400).json({ ok: false, message: 'Invalid push event' })
      return
    }

    setupWebPush()
    const supabase = createSupabase()
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('author,endpoint,p256dh,auth')
      .neq('author', author)

    if (error) throw error
    if (!subscriptions || subscriptions.length === 0) {
      res.status(200).json({ ok: true, delivered: 0, cleaned: 0, skipped: true })
      return
    }

    const dateText = getLocalDateText()
    const key = `activity-${category}-${dateText}-${author}`
    const isFirst = await insertDeliveryGuard(supabase, key, author, `activity-${category}`, { date: dateText, author })

    if (!isFirst) {
      res.status(200).json({ ok: true, delivered: 0, cleaned: 0, skippedDuplicated: true })
      return
    }

    const outcome = await sendNotifications(supabase, subscriptions, {
      title: copy.title,
      body: copy.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      url: '/',
    })

    res.status(200).json({ ok: true, ...outcome })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'push event failed',
    })
  }
}
