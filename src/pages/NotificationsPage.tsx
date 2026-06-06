import { ArrowRight, CheckCheck, Inbox, MailOpen, Bell } from 'lucide-react'
import type { Identity } from '../hooks/useIdentity'
import { useNotificationInbox } from '../features/notifications/useNotificationInbox'

interface NotificationsPageProps {
  identity: Identity
  navigate: (route: string) => void
}

export function NotificationsPage({ identity, navigate }: NotificationsPageProps) {
  const { items, unreadCount, loading, openNotification, markAllRead } = useNotificationInbox(identity)

  return (
    <div className="pixel-page min-h-0 flex h-full flex-col gap-2 overflow-hidden px-3 pt-3 pb-2">
      <section className="pixel-hero shrink-0 px-4 py-4">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/75">你们的提醒和留档都在这里</p>
            <h2 className="mt-1 text-xl font-black tracking-tight">消息中心</h2>
            <p className="mt-1 text-xs text-white/75">收到的提醒、发出的被哄请求，都能回来查看。</p>
          </div>
          <div className="pixel-couple scale-75 shrink-0">
            <div className="pixel-heart" />
            <div className="pixel-person pixel-person-left" />
            <div className="pixel-person pixel-person-right" />
          </div>
        </div>
      </section>

      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
          <Bell size={16} className="text-warm-500" />
          <span>{unreadCount > 0 ? `未读 ${unreadCount} 条` : '全部已读'}</span>
        </div>
        <button
          type="button"
          onClick={() => void markAllRead()}
          className="ui-touch-target inline-flex min-h-[44px] items-center gap-2 rounded-full border border-warm-100/80 bg-white/75 px-4 text-xs font-semibold text-text-secondary shadow-[0_8px_16px_rgba(61,44,46,0.045)] active:bg-warm-50"
        >
          <CheckCheck size={15} />
          全部已读
        </button>
      </div>

      <section className="min-h-0 flex-1 overflow-hidden rounded-[18px] border border-warm-100/80 bg-white/75 p-2 shadow-[0_8px_18px_rgba(61,44,46,0.04)]">
        <div className="h-full min-h-0 overflow-y-auto pr-1">
          {loading && items.length === 0 && (
            <div className="flex h-full min-h-[240px] items-center justify-center text-sm text-text-muted">
              正在加载消息...
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 text-center text-text-muted">
              <Inbox size={28} className="text-warm-300" />
              <p className="text-sm font-semibold text-text-primary">还没有消息</p>
              <p className="text-xs leading-relaxed">推送、提醒和被哄请求都会先在这里汇总。</p>
            </div>
          )}

          <div className="space-y-2">
            {items.map(item => {
              const receivedByMe = Boolean(identity && item.recipient === identity)
              const sentByMe = Boolean(identity && item.source_author === identity && item.recipient !== identity)
              const unread = receivedByMe && !item.read_at
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    void openNotification(item)
                    if (item.route) navigate(item.route)
                  }}
                  className={`ui-touch-target flex w-full min-h-[92px] items-start gap-3 rounded-2xl border p-3 text-left transition ${
                    unread
                      ? 'border-warm-200 bg-white shadow-[0_8px_18px_rgba(61,44,46,0.04)]'
                      : 'border-warm-100 bg-warm-50/70 opacity-80'
                  }`}
                >
                  <span className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    unread ? 'bg-warm-100 text-warm-600' : 'bg-white text-text-muted'
                  }`}>
                    {item.kind === 'need_hug' ? <MailOpen size={18} /> : <Bell size={18} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="block min-w-0 text-sm font-black text-text-primary">{item.title}</span>
                      {unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-warm-500" />}
                    </span>
                    <span className="mt-1 inline-flex rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                      {sentByMe ? `我发给 ${item.recipient}` : `${item.source_author || 'TA'} 发给我`}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-text-secondary">{item.body}</span>
                    <span className="mt-2 block text-[10px] font-semibold text-text-muted">
                      {new Date(item.created_at).toLocaleString('zh-CN')}
                    </span>
                  </span>
                  <ArrowRight size={16} className="mt-1 shrink-0 text-text-muted" />
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
