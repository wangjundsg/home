import { BookOpen, ChevronRight, Flame, HeartHandshake, Trophy } from 'lucide-react'
import { MATERIAL_LEVEL_META, getMaterialCounts, type MaterialLevel } from '../data/interact-materials'

interface InteractionMaterialsPageProps {
  navigate: (route: string) => void
}

const levelIcons: Record<MaterialLevel, typeof BookOpen> = {
  beginner: HeartHandshake,
  intermediate: Flame,
  advanced: Trophy,
  finale: BookOpen,
}

const levelRoutes: Record<MaterialLevel, string> = {
  beginner: '/interact/materials/beginner',
  intermediate: '/interact/materials/intermediate',
  advanced: '/interact/materials/advanced',
  finale: '/interact/materials/finale',
}

export function InteractionMaterialsPage({ navigate }: InteractionMaterialsPageProps) {
  const counts = getMaterialCounts()

  return (
    <div className="pixel-page flex min-h-full flex-col gap-3 px-4 pt-4 pb-8">
      <section className="pixel-hero shrink-0 p-4">
        <div className="relative z-10">
          <p className="text-xs font-semibold leading-[1.45] text-white/75">线下互动素材抽取</p>
          <h2 className="mt-1 text-xl font-black leading-tight tracking-tight">互动素材库</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">按当前氛围选择初级、中级、高级或最终阶段，在对应层级里随机抽取素材。</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        {MATERIAL_LEVEL_META.map(level => {
          const Icon = levelIcons[level.key]
          return (
            <button
              key={level.key}
              type="button"
              onClick={() => navigate(levelRoutes[level.key])}
              className="pixel-card card-pressable ui-touch-target flex min-h-[148px] flex-col items-start p-4 text-left"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-warm-100 text-warm-600">
                <Icon size={18} />
              </span>
              <h3 className="mt-3 text-sm font-black text-text-primary">{level.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">{level.description}</p>
              <span className="mt-auto pt-2 text-[10px] font-black text-warm-500">{counts.byLevel[level.key]} 条</span>
            </button>
          )
        })}
      </section>

      <button
        type="button"
        onClick={() => navigate('/interact/private')}
        className="pixel-card card-pressable ui-touch-target flex items-center gap-3 p-4 text-left"
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
          <HeartHandshake size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-text-primary">想玩完整游戏流程</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">去私密见面游戏中心，素材库这里只负责按层级抽卡。</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-text-muted" />
      </button>
    </div>
  )
}
