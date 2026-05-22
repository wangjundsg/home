import type { LocksByPlayer, PlayerKey, TargetZone } from '../../../features/two-player-challenge'

interface ChallengeHeartMeterProps {
  pointerValue: number
  targetZone: TargetZone
  locksByPlayer: LocksByPlayer
  canLock: boolean
  playerLabels: Record<PlayerKey, string>
  onLock: (playerKey: PlayerKey) => void
}

export function ChallengeHeartMeter({ pointerValue, targetZone, locksByPlayer, canLock, playerLabels, onLock }: ChallengeHeartMeterProps) {
  return (
    <section className="pixel-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black text-warm-500">心跳同步条</p>
        <div className="text-right text-xs font-black text-text-muted">
          <p>A {locksByPlayer.A === null ? '等待' : '已锁定'}</p>
          <p>B {locksByPlayer.B === null ? '等待' : '已锁定'}</p>
        </div>
      </div>

      <div className="relative mt-4 h-9 rounded-full bg-warm-100 shadow-inner">
        <div
          className="absolute top-1/2 h-7 -translate-y-1/2 rounded-full bg-pink-200/80 ring-2 ring-pink-300/50"
          style={{ left: `${targetZone.low}%`, width: `${targetZone.width}%` }}
        />
        <div
          className="absolute top-1/2 h-11 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warm-500 shadow-[0_8px_20px_rgba(240,133,115,0.3)]"
          style={{ left: `${pointerValue}%` }}
          aria-label={`当前指针 ${Math.round(pointerValue)}`}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {(['A', 'B'] as PlayerKey[]).map(playerKey => {
          const locked = locksByPlayer[playerKey] !== null
          return (
            <button
              key={playerKey}
              type="button"
              disabled={!canLock || locked}
              onClick={() => onLock(playerKey)}
              className={`min-h-[50px] rounded-2xl px-3 py-3 text-sm font-black active:scale-[0.99] disabled:active:scale-100 ${locked ? 'bg-pink-100 text-pink-600' : 'bg-warm-500 text-white disabled:bg-warm-100 disabled:text-text-muted'}`}
            >
              {playerKey} · {playerLabels[playerKey]} {locked ? '已锁' : '锁定'}
            </button>
          )
        })}
      </div>
    </section>
  )
}
