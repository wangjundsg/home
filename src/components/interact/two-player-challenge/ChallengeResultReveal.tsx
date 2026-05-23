import { challengeOutcomeLabels } from '../../../features/two-player-challenge'
import type { GateResult } from '../../../features/two-player-challenge'

interface ChallengeResultRevealProps {
  gateResult: GateResult | null
}

export function ChallengeResultReveal({ gateResult }: ChallengeResultRevealProps) {
  if (!gateResult) return null

  const resultTone = gateResult.passed ? 'border-pink-100 bg-pink-50/80' : 'border-warm-200 bg-warm-50/90'

  return (
    <section className={`pixel-card p-4 ${resultTone}`}>
      <p className="text-xs font-black text-pink-500">机关结算 · {challengeOutcomeLabels[gateResult.outcomeKey]}</p>
      <h3 className="mt-1 text-xl font-black text-text-primary">{gateResult.feedbackTitle}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{gateResult.feedbackText}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-black">
        <div className="rounded-2xl bg-white/75 px-2 py-2 text-text-muted">A {gateResult.hitByPlayer.A ? '命中' : '偏离'}</div>
        <div className="rounded-2xl bg-white/75 px-2 py-2 text-text-muted">B {gateResult.hitByPlayer.B ? '命中' : '偏离'}</div>
        <div className="rounded-2xl bg-white/75 px-2 py-2 text-text-muted">差距 {Math.round(gateResult.gap)}</div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs font-black">
        <div className="rounded-2xl bg-white/75 px-2 py-2 text-text-muted">
          {gateResult.blocked ? '撞到障碍' : '没撞障碍'}
        </div>
        <div className="rounded-2xl bg-white/75 px-2 py-2 text-text-muted">
          {gateResult.passed ? '进入结果任务' : gateResult.retryAfterRemedy ? '补救后重试' : '补救后继续'}
        </div>
      </div>
      {gateResult.retryAfterRemedy ? (
        <p className="mt-3 rounded-2xl bg-white/75 px-3 py-2 text-xs font-black text-pink-600">
          补救后回到 Boss 重试
        </p>
      ) : null}
    </section>
  )
}
