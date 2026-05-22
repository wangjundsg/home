import { getGateType, getStageGateCount, stageLabels } from '../../../features/two-player-challenge'
import type { GateProfile, RouteState } from '../../../features/two-player-challenge'

interface ChallengeProgressHeaderProps {
  routeState: RouteState
  gateProfile: GateProfile | null
}

export function ChallengeProgressHeader({ routeState, gateProfile }: ChallengeProgressHeaderProps) {
  const gateType = getGateType(routeState.stageKey, routeState.gateIndex)
  const gateCount = getStageGateCount(routeState.stageKey)

  return (
    <section className="pixel-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-warm-500">{stageLabels[routeState.stageKey]}</p>
          <h2 className="mt-1 text-lg font-black text-text-primary">心动门 {routeState.gateIndex + 1}/{gateCount}</h2>
        </div>
        <span className={`rounded-2xl px-3 py-2 text-xs font-black ${gateType === 'boss' ? 'bg-pink-100 text-pink-600' : 'bg-warm-100 text-warm-600'}`}>
          {gateType === 'boss' ? 'Boss 压力门' : '普通门'}
        </span>
      </div>
      {gateProfile ? (
        <p className="mt-2 text-xs font-black text-warm-500">{gateProfile.pressureLabel}</p>
      ) : null}
    </section>
  )
}
