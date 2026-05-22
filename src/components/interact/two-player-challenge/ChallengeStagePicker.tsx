import { STAGE_ORDER, stageLabels } from '../../../features/two-player-challenge'
import type { StageKey } from '../../../features/two-player-challenge'

interface ChallengeStagePickerProps {
  currentStageKey: StageKey
  onSelectStage: (stageKey: StageKey) => void
}

const stageDescriptions: Record<StageKey, string> = {
  beginner: '调情',
  intermediate: '前戏',
  advanced: '深入',
  finale: '最终',
}

export function ChallengeStagePicker({ currentStageKey, onSelectStage }: ChallengeStagePickerProps) {
  return (
    <section className="pixel-card p-3">
      <div className="grid grid-cols-4 gap-2">
        {STAGE_ORDER.map(stageKey => {
          const isActive = stageKey === currentStageKey

          return (
            <button
              key={stageKey}
              type="button"
              onClick={() => onSelectStage(stageKey)}
              className={`min-h-[58px] rounded-2xl border px-2 py-2 text-center active:scale-[0.99] ${isActive ? 'border-warm-500 bg-warm-500 text-white shadow-sm' : 'border-warm-100 bg-white text-text-muted'}`}
              aria-pressed={isActive}
            >
              <span className="block text-sm font-black">{stageLabels[stageKey]}</span>
              <span className={`mt-1 block text-[11px] font-bold ${isActive ? 'text-white/85' : 'text-text-muted'}`}>{stageDescriptions[stageKey]}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
