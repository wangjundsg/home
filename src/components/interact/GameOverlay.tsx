import type { ReactNode } from 'react'
import { ChevronLeft, X } from 'lucide-react'

interface GameOverlayProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function GameOverlay({ title, onClose, children }: GameOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-warm-50 flex flex-col"
      style={{ animation: 'slideUp 0.25s ease' }}
    >
      <div className="flex items-center justify-between px-4 h-12 border-b border-warm-100 bg-white shrink-0">
        <button
          onClick={onClose}
          className="text-text-secondary text-sm min-h-[44px] min-w-[44px] flex items-center gap-0.5"
        >
          <ChevronLeft size={18} />
          <span>返回</span>
        </button>
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        <button
          onClick={onClose}
          className="text-text-muted text-sm min-h-[44px] min-w-[44px] flex items-center justify-end gap-0.5"
        >
          <span>关闭</span>
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {children}
      </div>
    </div>
  )
}
