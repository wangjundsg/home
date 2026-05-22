import { Menu, Settings, ChevronLeft } from 'lucide-react'
import type { Identity } from '../../hooks/useIdentity'

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  showMenu?: boolean
  onMenu?: () => void
  showSettings?: boolean
  onSettings?: () => void
  identity: Identity
}

export function Header({ title, showBack, onBack, showMenu, onMenu, showSettings, onSettings }: HeaderProps) {
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
            <button onClick={onMenu} className="ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-warm-100/80 bg-white/60 text-text-secondary shadow-[0_8px_16px_rgba(61,44,46,0.045)] active:text-warm-600">
              <Menu size={20} />
            </button>
          )}
        </div>
        <h1 className="rounded-full border border-white/70 bg-white/52 px-4 py-1 text-base font-bold text-text-primary shadow-[0_6px_14px_rgba(61,44,46,0.035)]">{title}</h1>
        <div className="flex min-w-[80px] items-center justify-end">
          {showSettings && (
            <button onClick={onSettings} className="mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-warm-100/80 bg-white/60 text-text-secondary shadow-[0_8px_16px_rgba(61,44,46,0.045)] active:text-warm-600">
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
