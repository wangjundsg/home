import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const timezone = 'Asia/Shanghai'

const morningPhrases = [
  '早安呀，今天也要被温柔对待。没来得及说的话，小花园先替你说一声。',
  '新的一天开始啦，愿你们今天也会在细节里感受到彼此的在意。',
  '早上好，小花园提醒你：再忙也别忘了给 TA 一个轻轻的问候。',
  '今天也一起好好生活、好好相爱。早安，愿你们都顺顺利利。',
]

const nightPhrases = [
  '晚安啦，今天辛苦了。愿你们在彼此的惦记里安心入睡。',
  '夜深了，小花园替你说一句：晚安，记得把温柔留给最重要的人。',
  '愿今天的疲惫被拥抱轻轻化开，晚安，明天继续并肩。',
  '结束一天的小提醒：你们都很棒，晚安，做个甜甜的梦。',
]

const getLocalParts = (date) => {
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const pick = (type) => formatted.find((item) => item.type === type)?.value ?? ''

  return {
    hour: Number(pick('hour')),
    dateText: `${pick('year')}-${pick('month')}-${pick('day')}`,
  }
}

const pickPhrase = (phrases, seed) => {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % phrases.length
  return phrases[index]
}

const authOk = (req) => {
  if (req.headers['x-vercel-cron']) return true

  const secret = process.env.PUSH_CRON_SECRET || process.env.CRON_SECRET || ''
  if (!secret) return true

  const auth = req.headers.authorization || ''
  if (auth === `Bearer ${secret}`) return true

  const url = new URL(req.url, 'https://qinggan-weihu.local')
  return url.searchParams.get('secret') === secret
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

const sendToAuthor = async (supabase, subscriptionsByAuthor, author, notification) => {
  const subscriptions = subscriptionsByAuthor.get(author) || []
  if (subscriptions.length === 0) return { delivered: 0, cleaned: 0 }

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
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method Not Allowed' })
    return
  }

  if (!authOk(req)) {
    res.status(401).json({ ok: false, message: 'Unauthorized' })
    return
  }

  try {
    setupWebPush()
    const supabase = createSupabase()
    const nowLocal = getLocalParts(new Date())
    const slot = nowLocal.hour === 7 ? 'morning' : nowLocal.hour === 22 ? 'night' : 'other'

    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('push_subscriptions')
      .select('author,endpoint,p256dh,auth')

    if (subscriptionsError) throw subscriptionsError

    const authorSet = new Set((subscriptions || []).map((row) => row.author).filter(Boolean))
    const subscriptionsByAuthor = new Map()

    for (const row of subscriptions || []) {
      if (!subscriptionsByAuthor.has(row.author)) {
        subscriptionsByAuthor.set(row.author, [])
      }
      subscriptionsByAuthor.get(row.author).push(row)
    }

    let delivered = 0
    let cleaned = 0
    let skippedDuplicated = 0

    if (slot === 'morning' || slot === 'night') {
      for (const author of authorSet) {
        const key = `daily-${slot}-${nowLocal.dateText}-${author}`
        const isFirst = await insertDeliveryGuard(supabase, key, author, `daily-${slot}`, { date: nowLocal.dateText })
        if (!isFirst) {
          skippedDuplicated += 1
          continue
        }

        const body = slot === 'morning'
          ? pickPhrase(morningPhrases, `${author}-${nowLocal.dateText}`)
          : pickPhrase(nightPhrases, `${author}-${nowLocal.dateText}`)

        const outcome = await sendToAuthor(
          supabase,
          subscriptionsByAuthor,
          author,
          {
            title: slot === 'morning' ? '早安，来自小花园' : '晚安，来自小花园',
            body,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            url: '/',
          },
        )
        delivered += outcome.delivered
        cleaned += outcome.cleaned
      }
    }

    res.status(200).json({
      ok: true,
      slot,
      date: nowLocal.dateText,
      authors: authorSet.size,
      delivered,
      cleaned,
      skippedDuplicated,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'push dispatch failed',
    })
  }
}
