import { BookOpen, CheckCircle2, HeartHandshake, ListChecks, PackageCheck, PlayCircle } from 'lucide-react'
import type { PrivateOfflineGameGuide } from '../../data/private-offline-games'

interface PrivateGameGuideProps {
  guide: PrivateOfflineGameGuide
  navigate: (route: string) => void
}

const sectionIcons = {
  safety: HeartHandshake,
  props: PackageCheck,
  setup: ListChecks,
  play: PlayCircle,
}

function GuideList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map(item => (
        <li key={item} className="flex gap-2 text-xs font-semibold leading-relaxed text-text-secondary">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-warm-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function PrivateGameGuide({ guide, navigate }: PrivateGameGuideProps) {
  const SafetyIcon = sectionIcons.safety
  const PropsIcon = sectionIcons.props
  const SetupIcon = sectionIcons.setup
  const PlayIcon = sectionIcons.play

  return (
    <article className="pixel-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-pink-500">{guide.duration}</p>
          <h3 className="mt-1 text-lg font-black text-text-primary">{guide.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{guide.summary}</p>
        </div>
      </div>

      <section className="mt-4 rounded-2xl bg-pink-50/80 p-3">
        <h4 className="flex items-center gap-2 text-xs font-black text-pink-700">
          <SafetyIcon size={15} />
          安全规则
        </h4>
        <GuideList items={guide.safetyRules} />
      </section>

      <div className="mt-3 grid gap-3">
        <section className="rounded-2xl border border-warm-100 bg-white/70 p-3">
          <h4 className="flex items-center gap-2 text-xs font-black text-text-primary">
            <PropsIcon size={15} className="text-warm-500" />
            准备物品
          </h4>
          <GuideList items={guide.props} />
        </section>

        <section className="rounded-2xl border border-warm-100 bg-white/70 p-3">
          <h4 className="flex items-center gap-2 text-xs font-black text-text-primary">
            <SetupIcon size={15} className="text-warm-500" />
            开始前设置
          </h4>
          <GuideList items={guide.setupSteps} />
        </section>

        <section className="rounded-2xl border border-warm-100 bg-white/70 p-3">
          <h4 className="flex items-center gap-2 text-xs font-black text-text-primary">
            <PlayIcon size={15} className="text-warm-500" />
            玩法步骤
          </h4>
          <GuideList items={guide.playSteps} />
        </section>
      </div>

      {guide.materialRoute ? (
        <button
          type="button"
          onClick={() => navigate(guide.materialRoute!)}
          className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white shadow-sm active:scale-[0.99]"
        >
          <BookOpen size={16} />
          打开互动素材库
        </button>
      ) : null}
    </article>
  )
}
