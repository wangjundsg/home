import { BookOpen, Dice5, Gamepad2, Library, ScrollText, SlidersHorizontal, Spade, Utensils } from 'lucide-react'
import type { Identity } from '../hooks/useIdentity'

interface InteractPageProps {
  identity: Identity
  partnerName: string
  navigate: (route: string) => void
}

export function InteractPage({ navigate, partnerName }: InteractPageProps) {
  return (
    <div className="pixel-page main-grid-page flex h-full min-h-0 flex-col gap-2 overflow-hidden px-3 pt-3 pb-2">
      <section className="pixel-hero shrink-0 p-4">
        <div className="relative z-10">
          <p className="text-xs font-semibold leading-[1.45] text-white/75">给你和{partnerName || 'TA'}的互动入口</p>
          <h2 className="mt-1 text-xl font-black leading-tight tracking-tight">互动中心</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">线上和线下游戏都直接开。</p>
        </div>
      </section>

      <section className="grid shrink-0 grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => navigate('/interact/private/two-player-challenge')}
          className="pixel-card card-pressable ui-touch-target min-h-[112px] p-3 text-left"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
            <SlidersHorizontal size={19} />
          </span>
          <span className="mt-2 block text-sm font-black text-text-primary">心动调温台</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">公开放筹码调出互动。</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/interact/private/flying-chess')}
          className="pixel-card card-pressable ui-touch-target min-h-[112px] p-3 text-left"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
            <Gamepad2 size={19} />
          </span>
          <span className="mt-2 block text-sm font-black text-text-primary">双人心跳棋</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">掷骰走格抽任务。</span>
        </button>
      </section>

      <section className="grid shrink-0 grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => navigate('/interact/offline-games/heart-cards')}
          className="pixel-card card-pressable ui-touch-target min-h-[112px] p-3 text-left"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-warm-100 text-warm-600">
            <Spade size={19} />
          </span>
          <span className="mt-2 block text-sm font-black text-text-primary">心动花色牌</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">扑克牌四阶段玩法。</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/interact/offline-games/prop-banquet')}
          className="pixel-card card-pressable ui-touch-target min-h-[112px] p-3 text-left"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Dice5 size={19} />
          </span>
          <span className="mt-2 block text-sm font-black text-text-primary">秘密道具宴</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">骰子和道具推进。</span>
        </button>
      </section>

      <button
        type="button"
        onClick={() => navigate('/interact/food')}
        className="pixel-card card-pressable ui-touch-target flex shrink-0 items-center gap-3 p-3 text-left"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
          <Utensils size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-text-primary">今天吃什么</span>
          <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">先给正餐答案，满意后再配甜品或喝的。</span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => navigate('/interact/materials')}
        className="pixel-card card-pressable ui-touch-target flex shrink-0 items-center gap-3 p-3 text-left"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-warm-100 text-warm-600">
          <Library size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-text-primary">互动素材库</span>
          <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">按初级、中级、高级和最终阶段抽取素材。</span>
        </span>
      </button>

      <section className="min-h-0 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-sm font-black text-text-primary">异地记录</h3>
            <p className="text-xs leading-relaxed text-text-muted">把日常和小剧场留下来。</p>
          </div>
          <BookOpen size={17} className="shrink-0 text-warm-500" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => navigate('/interact/diary')}
            className="pixel-card card-pressable ui-touch-target min-h-[92px] p-3 text-left"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <BookOpen size={17} />
            </span>
            <span className="mt-2 block text-sm font-black text-text-primary">共同日记</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">今天也留一页。</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/interact/story')}
            className="pixel-card card-pressable ui-touch-target min-h-[92px] p-3 text-left"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
              <ScrollText size={17} />
            </span>
            <span className="mt-2 block text-sm font-black text-text-primary">接力故事</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">轮流写一段。</span>
          </button>
        </div>
      </section>
    </div>
  )
}
