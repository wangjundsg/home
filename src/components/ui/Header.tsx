import { Menu, Settings, ChevronLeft, Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  showMenu?: boolean
  onMenu?: () => void
  showSettings?: boolean
  onSettings?: () => void
  showNotifications?: boolean
  unreadCount?: number
  onNotifications?: () => void
}

export function Header({ title, showBack, onBack, showMenu, onMenu, showSettings, onSettings, showNotifications, unreadCount = 0, onNotifications }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-warm-100/65 bg-[#fffaf7]/85 shadow-[0_10px_24px_rgba(61,44,46,0.04)] backdrop-blur-xl">
      <div className="flex h-12 items-center justify-between px-2">
        <div className="flex min-w-[80px] items-center">
          {showBack && (
            <button onClick={onBack} className="flex min-h-[44px] min-w-[44px] items-center justify-start gap-0.5 rounded-xl pl-2 text-sm text-text-secondary active:text-warm-600">
              <ChevronLeft size={18} />
              <span>返回</span>
            </button>
          )}
          {showMenu && (
            <button type="button" aria-label="打开菜单" onClick={onMenu} className="ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-warm-100/80 bg-white/60 text-text-secondary shadow-[0_8px_16px_rgba(61,44,46,0.045)] active:text-warm-600">
              <Menu size={20} />
            </button>
          )}
        </div>
        <h1 className="rounded-full border border-white/70 bg-white/52 px-4 py-1 text-base font-bold text-text-primary shadow-[0_6px_14px_rgba(61,44,46,0.035)]">{title}</h1>
        <div className="flex min-w-[80px] items-center justify-end">
          {showNotifications && (
            <button type="button" aria-label="打开消息中心" onClick={onNotifications} className="mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-warm-100/80 bg-white/60 text-text-secondary shadow-[0_8px_16px_rgba(61,44,46,0.045)] active:text-warm-600">
              <span className="relative">
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-warm-500 ring-2 ring-white" />}
              </span>
            </button>
          )}
          {showSettings && (
            <button type="button" aria-label="打开设置" onClick={onSettings} className="mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-warm-100/80 bg-white/60 text-text-secondary shadow-[0_8px_16px_rgba(61,44,46,0.045)] active:text-warm-600">
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
