import { resultLabels } from '../../../features/two-player-challenge'
import type { GateResult } from '../../../features/two-player-challenge'

interface ChallengeResultRevealProps {
  gateResult: GateResult | null
}

export function ChallengeResultReveal({ gateResult }: ChallengeResultRevealProps) {
  if (!gateResult) return null

  return (
    <section className="pixel-card border-pink-100 bg-pink-50/80 p-4">
      <p className="text-xs font-black text-pink-500">默契结果</p>
      <h3 className="mt-1 text-xl font-black text-text-primary">{resultLabels[gateResult.resultKey]}</h3>
    </section>
  )
}
