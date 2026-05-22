import { ChevronRight, Gamepad2, Route } from 'lucide-react'

interface PrivateOfflineGamesPageProps {
  navigate: (route: string) => void
}

export function PrivateOfflineGamesPage({ navigate }: PrivateOfflineGamesPageProps) {
  return (
    <div className="pixel-page flex min-h-full flex-col gap-3 px-4 pt-4 pb-8">
      <section className="pixel-hero shrink-0 p-4">
        <div className="relative z-10">
          <p className="text-xs font-semibold leading-[1.45] text-white/75">App 内双人游戏</p>
          <h2 className="mt-1 text-xl font-black leading-tight tracking-tight">线上游戏</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">直接进入当前已经做好的双人玩法，不再经过密码或确认入口。</p>
        </div>
      </section>

      <button
        type="button"
        onClick={() => navigate('/interact/private/two-player-challenge')}
        className="pixel-card card-pressable flex min-h-[96px] items-center gap-3 p-4 text-left"
      >
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
          <Route size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-text-primary">双人默契闯关</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">A/B 同步锁定，按结果派发本关任务。</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-text-muted" />
      </button>

      <button
        type="button"
        onClick={() => navigate('/interact/private/flying-chess')}
        className="pixel-card card-pressable flex min-h-[96px] items-center gap-3 p-4 text-left"
      >
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warm-100 text-warm-600">
          <Gamepad2 size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-text-primary">双人心跳棋</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">掷骰走格，从四层素材库派发任务。</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-text-muted" />
      </button>
    </div>
  )
}
