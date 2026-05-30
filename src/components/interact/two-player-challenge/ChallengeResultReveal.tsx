import { challengeOutcomeLabels, taskModeLabels } from '../../../features/two-player-challenge'
import type { GateResult } from '../../../features/two-player-challenge'

interface ChallengeResultRevealProps {
  gateResult: GateResult | null
}

export function ChallengeResultReveal({ gateResult }: ChallengeResultRevealProps) {
  if (!gateResult) return null

  const resultTone = gateResult.passed ? 'border-pink-100 bg-pink-50/80' : 'border-warm-200 bg-warm-50/90'

  return (
    <section className={`pixel-card p-4 ${resultTone}`}>
      <p className="text-xs font-black text-pink-500">小门揭晓 · {challengeOutcomeLabels[gateResult.outcomeKey]}</p>
      <h3 className="mt-1 text-xl font-black text-text-primary">{gateResult.feedbackTitle}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{gateResult.feedbackText}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-black">
        <div className="rounded-2xl bg-white/75 px-2 py-2 text-text-muted">
          {gateResult.isBoss ? 'Boss 收束' : '路线推进'}
        </div>
        <div className="rounded-2xl bg-white/75 px-2 py-2 text-text-muted">
          {taskModeLabels[gateResult.taskBranch]}
        </div>
      </div>
      {!gateResult.passed ? (
        <p className="mt-3 rounded-2xl bg-white/75 px-3 py-2 text-xs font-black text-pink-600">
          没有惩罚和倒退，完成补救后继续往前。
        </p>
      ) : null}
    </section>
  )
}
