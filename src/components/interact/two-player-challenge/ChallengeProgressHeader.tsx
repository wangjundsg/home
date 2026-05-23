import {
  challengeMechanicLabels,
  intimacyStageDescriptions,
  intimacyStageLabels,
  INTIMACY_STAGE_ORDER,
} from '../../../features/two-player-challenge'
import type { ChallengeRoundState, ChallengeStageState, GateProfile } from '../../../features/two-player-challenge'

interface ChallengeProgressHeaderProps {
  stageState: ChallengeStageState
  roundState: ChallengeRoundState
  totalCompletedRounds: number
  totalRoundCount: number
  gateProfile: GateProfile | null
}

export function ChallengeProgressHeader({
  stageState,
  roundState,
  totalCompletedRounds,
  totalRoundCount,
  gateProfile,
}: ChallengeProgressHeaderProps) {
  const stageLabel = intimacyStageLabels[stageState.stageKey]
  const stageDescription = intimacyStageDescriptions[stageState.stageKey]
  const stageProgress = Math.min(stageState.completedRounds, stageState.roundCount)
  const totalProgress = Math.min(totalCompletedRounds, totalRoundCount)
  const stagePercent = (stageProgress / stageState.roundCount) * 100
  const currentRoundLabel = roundState.isBoss ? 'Boss 机关' : `第 ${roundState.roundIndex + 1} 轮`

  return (
    <section className="pixel-card space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-warm-500">挑战机关推进</p>
          <h2 className="mt-1 text-lg font-black text-text-primary">{stageLabel} {stageProgress}/{stageState.roundCount}</h2>
        </div>
        <span className="rounded-2xl bg-pink-100 px-3 py-2 text-xs font-black text-pink-600">
          全程 {totalProgress}/{totalRoundCount}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-text-muted">{stageDescription}</p>
      <p className="rounded-2xl bg-pink-50 px-3 py-2 text-xs font-black leading-relaxed text-pink-600">
        单手机轮流玩：A 操作后交给 B，手机只做机关裁判和结果结算。
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {INTIMACY_STAGE_ORDER.map((key, index) => {
          const active = key === stageState.stageKey
          const done = index < stageState.stageIndex
          return (
            <div key={key} className={`rounded-2xl px-2 py-2 text-center text-[11px] font-black ${active ? 'bg-warm-500 text-white' : done ? 'bg-green-50 text-green-600' : 'bg-warm-50 text-text-muted'}`}>
              {intimacyStageLabels[key]}
            </div>
          )
        })}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-warm-100">
        <div className="h-full rounded-full bg-warm-500 transition-all" style={{ width: `${stagePercent}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-black">
        <div className="rounded-2xl bg-warm-50 px-3 py-2 text-text-muted">
          {currentRoundLabel} · {challengeMechanicLabels[roundState.mechanicType]}
        </div>
        <div className="rounded-2xl bg-warm-50 px-3 py-2 text-right text-text-muted">
          难度 {roundState.difficulty}{roundState.attempt > 0 ? ` · 重试 ${roundState.attempt}` : ''}
        </div>
      </div>
      {gateProfile ? (
        <p className="rounded-2xl bg-pink-50 px-3 py-2 text-xs font-black text-pink-600">
          {roundState.isBoss ? 'Boss 规则' : '机关规则'}：{gateProfile.pressureLabel}
        </p>
      ) : null}
    </section>
  )
}
