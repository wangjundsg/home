import { Archive, BookOpen, Box, Disc3, Flame, Gamepad2, Library, Palette, ScrollText, ShieldCheck, Users, Wifi, Map } from 'lucide-react'
import type { Identity } from '../hooks/useIdentity'

interface InteractPageProps {
  identity: Identity
  partnerName: string
  navigate: (route: string) => void
}

interface OldEntry {
  key: string
  title: string
  Icon: typeof Box
}

const oldEntries: OldEntry[] = [
  { key: 'truth', title: '真心话盲盒', Icon: Box },
  { key: 'match', title: '默契大考验', Icon: Users },
  { key: 'doodle', title: '心情大涂鸦', Icon: Palette },
  { key: 'dice', title: '掷骰子比大小', Icon: Gamepad2 },
  { key: 'truthdare', title: '真心话大冒险', Icon: Flame },
  { key: 'wheel', title: '奖惩转盘', Icon: Disc3 },
]

export function InteractPage({ navigate, partnerName }: InteractPageProps) {
  return (
    <div className="pixel-page main-grid-page flex h-full min-h-0 flex-col gap-2 overflow-hidden px-3 pt-3 pb-2">
      <section className="pixel-hero shrink-0 p-4">
        <div className="relative z-10">
          <p className="text-xs font-semibold leading-[1.45] text-white/75">给你和{partnerName || 'TA'}的互动入口</p>
          <h2 className="mt-1 text-xl font-black leading-tight tracking-tight">互动中心</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">线上游戏和线下游戏分开进入，日常记录留在下面慢慢写。</p>
        </div>
      </section>

      <section className="grid shrink-0 grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => navigate('/interact/online-games')}
          className="pixel-card card-pressable ui-touch-target min-h-[112px] p-3 text-left"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
            <Wifi size={19} />
          </span>
          <span className="mt-2 block text-sm font-black text-text-primary">线上游戏</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">双人默契闯关和心跳棋。</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/interact/offline-games')}
          className="pixel-card card-pressable ui-touch-target min-h-[112px] p-3 text-left"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-warm-100 text-warm-600">
            <Map size={19} />
          </span>
          <span className="mt-2 block text-sm font-black text-text-primary">线下游戏</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">规则和玩法后续重新规划。</span>
        </button>
      </section>

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

      <details className="pixel-card overflow-hidden p-0">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-3 px-4 py-3 text-sm font-black text-text-secondary">
          <Archive size={17} className="text-text-muted" />
          旧版小游戏入口
          <span className="ml-auto text-[10px] font-black text-text-muted">低优先级</span>
        </summary>
        <div className="grid max-h-[92px] grid-cols-2 gap-2 overflow-y-auto border-t border-warm-100 p-2">
          {oldEntries.map(({ key, title, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigate(`/interact/${key}`)}
              className="flex min-h-[44px] items-center gap-2 rounded-2xl bg-warm-50 px-3 py-2 text-left text-xs font-black text-text-secondary active:scale-[0.99]"
            >
              <Icon size={15} className="shrink-0 text-warm-500" />
              <span className="min-w-0 flex-1 truncate">{title}</span>
            </button>
          ))}
        </div>
      </details>

      <p className="flex shrink-0 items-start gap-2 px-1 text-[11px] font-semibold leading-relaxed text-text-muted">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-green-600" />
        两个人都可以随时暂停、跳过或结束，按当下舒服的节奏来。
      </p>
    </div>
  )
}
