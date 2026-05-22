import type { RenderedTask } from '../../../features/two-player-challenge'

interface ChallengeTaskCardProps {
  task: RenderedTask | null
  error: string | null
  onContinue: () => void
}

export function ChallengeTaskCard({ task, error, onContinue }: ChallengeTaskCardProps) {
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
      <p className="text-xs font-black text-pink-600">{task.triggerLabel}</p>
      <p className="mt-2 text-lg font-black leading-relaxed text-text-primary">{task.text}</p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-5 min-h-[48px] w-full rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99]"
      >
        再同步一次
      </button>
    </section>
  )
}
