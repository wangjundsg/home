export type NotificationKind =
  | 'checkin'
  | 'diary'
  | 'story'
  | 'interaction'
  | 'growth'
  | 'period'
  | 'intimacy'
  | 'meeting'
  | 'anniversary'
  | 'need_hug'
  | 'morning'
  | 'night'

export interface NotificationRecord extends Record<string, unknown> {
  id: string
  recipient: string
  source_author: string
  kind: NotificationKind
  title: string
  body: string
  route: string
  payload: Record<string, unknown>
  read_at: string | null
  created_at: string
}
