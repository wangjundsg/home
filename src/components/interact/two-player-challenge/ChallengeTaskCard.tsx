import type { RenderedTask } from '../../../features/two-player-challenge'

interface ChallengeTaskCardProps {
  task: RenderedTask | null
  error: string | null
  onComplete: () => void
  onReroll?: () => void
  canReroll?: boolean
  rerollsLeft?: number
  retryAfterRemedy?: boolean
  onSkip?: () => void
}

export function ChallengeTaskCard({ task, error, onComplete, onReroll, canReroll = false, rerollsLeft = 0, retryAfterRemedy = false, onSkip }: ChallengeTaskCardProps) {
  if (error) {
    return (
      <section className="pixel-card p-4">
        <p className="text-sm font-black text-text-primary">任务暂时没准备好</p>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{error}</p>
      </section>
    )
  }

  if (!task) return null

  return (
    <section className="pixel-card p-5" style={{ animation: 'scaleIn 0.18s ease' }}>
      <p className="text-xs font-black text-pink-600">{task.kind === 'remedy-task' ? '补救任务' : task.triggerLabel}</p>
      <p className="mt-2 text-lg font-black leading-relaxed text-text-primary">{task.text}</p>
      <p className="mt-3 text-xs leading-relaxed text-text-muted">{task.triggerReason}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {onReroll ? (
          <button
            type="button"
            onClick={onReroll}
            disabled={!canReroll}
            className="min-h-[48px] rounded-2xl border border-warm-200 bg-white/70 px-4 py-3 text-sm font-black text-text-muted active:scale-[0.99] disabled:opacity-45"
          >
            换温和一点 {rerollsLeft}
          </button>
        ) : null}
        {onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="min-h-[48px] rounded-2xl border border-warm-200 bg-white/70 px-4 py-3 text-sm font-black text-text-muted active:scale-[0.99]"
          >
            跳过此卡
          </button>
        ) : null}
        <button
          type="button"
          onClick={onComplete}
          className={`${onReroll || onSkip ? 'col-span-2' : 'col-span-2'} min-h-[48px] rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99]`}
        >
          {task.kind === 'remedy-task'
            ? retryAfterRemedy ? '完成补救，再开 Boss' : '完成补救，继续'
            : '完成结果任务，进入下一轮'}
        </button>
      </div>
    </section>
  )
}
