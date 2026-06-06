import { supabase } from '../../supabase'
import type { NotificationRecord, NotificationKind } from './types'

export async function fetchNotifications(person: string, limit = 50) {
  const [receivedResult, sentResult] = await Promise.all([
    supabase
      .from('notifications')
      .select('id,recipient,source_author,kind,title,body,route,payload,read_at,created_at')
      .eq('recipient', person)
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('notifications')
      .select('id,recipient,source_author,kind,title,body,route,payload,read_at,created_at')
      .eq('source_author', person)
      .order('created_at', { ascending: false })
      .limit(limit),
  ])

  if (receivedResult.error) throw receivedResult.error
  if (sentResult.error) throw sentResult.error

  const itemsById = new Map<string, NotificationRecord>()
  ;[...(receivedResult.data || []), ...(sentResult.data || [])].forEach(item => {
    itemsById.set(item.id, item as NotificationRecord)
  })

  return [...itemsById.values()]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

export async function fetchUnreadNotificationCount(recipient: string) {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('recipient', recipient)
    .is('read_at', null)

  if (error) throw error
  return count || 0
}

export async function markNotificationAsRead(notificationId: string, recipient: string) {
  const now = new Date().toISOString()
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: now })
    .eq('id', notificationId)
    .eq('recipient', recipient)
    .is('read_at', null)

  if (error) throw error
}

export async function markAllNotificationsAsRead(recipient: string) {
  const now = new Date().toISOString()
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: now })
    .eq('recipient', recipient)
    .is('read_at', null)

  if (error) throw error
}

export async function createNotification(input: {
  delivery_key: string
  recipient: string
  source_author: string
  kind: NotificationKind
  title: string
  body: string
  route?: string
  payload?: Record<string, unknown>
}) {
  const { error } = await supabase.from('notifications').insert({
    delivery_key: input.delivery_key,
    recipient: input.recipient,
    source_author: input.source_author,
    kind: input.kind,
    title: input.title,
    body: input.body,
    route: input.route || '/',
    payload: input.payload || {},
  })

  if (error) throw error
}

export async function createNotificationsForRecipients(input: {
  delivery_key: string
  recipients: string[]
  source_author: string
  kind: NotificationKind
  title: string
  body: string
  route?: string
  payload?: Record<string, unknown>
}) {
  const uniqueRecipients = [...new Set(input.recipients.map(recipient => recipient.trim()).filter(Boolean))]
  if (uniqueRecipients.length === 0) return

  const rows = uniqueRecipients.map(recipient => ({
    delivery_key: `${input.delivery_key}:${recipient}`,
    recipient,
    source_author: input.source_author,
    kind: input.kind,
    title: input.title,
    body: input.body,
    route: input.route || '/',
    payload: input.payload || {},
  }))

  const { error } = await supabase.from('notifications').upsert(rows, { onConflict: 'delivery_key' })
  if (error) throw error
}
