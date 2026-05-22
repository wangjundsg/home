import { Map, Sparkles } from 'lucide-react'

interface OfflineGamesPageProps {
  navigate: (route: string) => void
}

export function OfflineGamesPage({ navigate }: OfflineGamesPageProps) {
  return (
    <div className="pixel-page flex min-h-full flex-col gap-4 px-4 pt-4 pb-8">
      <section className="pixel-hero shrink-0 p-5">
        <div className="relative z-10">
          <p className="text-xs font-semibold leading-[1.45] text-white/75">线下玩法入口</p>
          <h2 className="mt-1 text-xl font-black leading-tight tracking-tight">线下游戏</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">这一块后面会重新规划规则、道具和场景，现在先保留独立入口。</p>
        </div>
      </section>

      <section className="pixel-card p-5 text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-warm-100 text-warm-600">
          <Map size={24} />
        </span>
        <h3 className="mt-4 text-lg font-black text-text-primary">线下游戏正在重新规划</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          旧的规则型游戏先收起来。下一版会把线下玩法拆成更清楚的场景、道具和安全边界。
        </p>
        <button
          type="button"
          onClick={() => navigate('/interact/materials')}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-warm-500 px-5 py-3 text-sm font-black text-white shadow-sm active:scale-[0.99]"
        >
          <Sparkles size={17} />
          先去素材库看看
        </button>
      </section>
    </div>
  )
}
