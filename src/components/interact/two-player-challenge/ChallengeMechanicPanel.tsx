import type {
  ChallengeRoundState,
  LocksByPlayer,
  PlayerKey,
  TargetZone,
} from '../../../features/two-player-challenge'

interface ChoiceOption {
  id: string
  label: string
}

interface PlayerRhythmState {
  A: number
  B: number
}

interface ChallengeMechanicPanelProps {
  roundState: ChallengeRoundState
  screenState: string
  activePlayer: PlayerKey
  handoffVisible: boolean
  pointerValue: number
  targetZone: TargetZone | null
  locksByPlayer: LocksByPlayer
  playerLabels: Record<PlayerKey, string>
  rhythmHits: PlayerRhythmState
  rhythmRequiredHits: number
  choiceOptions: ChoiceOption[]
  choiceSelections: Record<PlayerKey, string | null>
  isBlocked: boolean
  onStart: () => void
  onHandoffReady: () => void
  onResolveReaction: () => void
  onChoice: (choiceId: string) => void
  onResolveChoice: () => void
  onRhythmHit: () => void
  onResolveRhythm: () => void
  onLock: (value: number, blocked: boolean) => void
}

export function ChallengeMechanicPanel({
  roundState,
  screenState,
  activePlayer,
  handoffVisible,
  pointerValue,
  targetZone,
  locksByPlayer,
  playerLabels,
  rhythmHits,
  rhythmRequiredHits,
  choiceOptions,
  choiceSelections,
  isBlocked,
  onStart,
  onHandoffReady,
  onResolveReaction,
  onChoice,
  onResolveChoice,
  onRhythmHit,
  onResolveRhythm,
  onLock,
}: ChallengeMechanicPanelProps) {
  if (!targetZone) return null

  const canPlay = screenState === 'challenge-running' && !handoffVisible
  const isReady = screenState === 'challenge-ready'
  const mechanicCopy = getMechanicCopy(roundState)
  const lockedCount = Number(locksByPlayer.A !== null) + Number(locksByPlayer.B !== null)
  const activeLabel = playerLabels[activePlayer]
  const currentPlayerDone = getCurrentPlayerDone()

  return (
    <section className="pixel-card overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-warm-500">{mechanicCopy.eyebrow}</p>
          <h3 className="mt-1 text-lg font-black text-text-primary">{mechanicCopy.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">{mechanicCopy.description}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-warm-50 px-3 py-2 text-right text-[11px] font-black text-text-muted">
          <p>{roundState.isBoss ? 'Boss' : `第 ${roundState.roundIndex + 1} 轮`}</p>
          <p>难度 {roundState.difficulty}</p>
          {roundState.attempt > 0 ? <p>重试 {roundState.attempt}</p> : null}
        </div>
      </div>

      <FlowGuide activePlayer={activePlayer} screenState={screenState} />

      {isReady ? (
        <div className="mt-4 rounded-2xl bg-pink-50 px-3 py-3 text-xs font-bold leading-relaxed text-pink-700">
          单手机轮流玩：先把手机给 A，A 操作后遮住结果交给 B，B 操作后再揭晓结算。
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-warm-50 px-3 py-3 text-xs font-bold leading-relaxed text-text-muted">
          当前：{activePlayer} 路 {activeLabel} 操作。{mechanicCopy.standard}
        </div>
      )}

      <div className="relative mt-4">
        {renderMechanicBody(targetZone)}
        {handoffVisible ? (
          <HandoffOverlay
            activePlayer={activePlayer}
            playerLabels={playerLabels}
            onHandoffReady={onHandoffReady}
          />
        ) : null}
      </div>

      {isReady ? (
        <button
          type="button"
          onClick={onStart}
          className="mt-5 min-h-[52px] w-full rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white shadow-sm active:scale-[0.99]"
        >
          开始 A 路操作
        </button>
      ) : null}
    </section>
  )

  function renderMechanicBody(currentTargetZone: TargetZone) {
    if (roundState.mechanicType === 'reaction-stop') {
      const readyToReveal = locksByPlayer.A !== null && locksByPlayer.B !== null
      return (
        <div>
          <LinearTrack
            pointerValue={pointerValue}
            targetZone={currentTargetZone}
            locksByPlayer={locksByPlayer}
            isBlocked={false}
            hideLockedValues={handoffVisible || activePlayer === 'B'}
          />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-black">
            <LegendItem label="粉色目标区" tone="pink" />
            <LegendItem label="橙色指针" tone="warm" />
          </div>
          <button
            type="button"
            disabled={!canPlay || currentPlayerDone}
            onClick={() => onLock(pointerValue, false)}
            className="mt-5 min-h-[50px] w-full rounded-2xl bg-pink-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99] disabled:bg-warm-100 disabled:text-text-muted"
          >
            {readyToReveal ? '等待揭晓' : `${activePlayer} 锁定停点`}
          </button>
          {readyToReveal ? (
            <button
              type="button"
              onClick={onResolveReaction}
              className="mt-2 min-h-[50px] w-full rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99]"
            >
              揭晓结果
            </button>
          ) : null}
        </div>
      )
    }

    if (roundState.mechanicType === 'choice-sync') {
      const selected = choiceSelections[activePlayer]
      const readyToReveal = Boolean(choiceSelections.A && choiceSelections.B)
      return (
        <div className="space-y-4">
          <div className="rounded-2xl bg-warm-50 p-3">
            <p className="text-xs font-black text-text-muted">{activePlayer} 路 · {activeLabel} 隐藏选择</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {choiceOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  disabled={!canPlay || Boolean(selected)}
                  onClick={() => onChoice(option.id)}
                  className={`min-h-[44px] rounded-2xl px-2 py-2 text-xs font-black active:scale-[0.99] disabled:opacity-45 ${selected === option.id ? 'bg-warm-500 text-white' : 'bg-white text-text-muted'}`}
                >
                  {selected === option.id ? '已选择' : option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-black">
            <StatusPill label="A 已选择" active={Boolean(choiceSelections.A)} />
            <StatusPill label="B 已选择" active={Boolean(choiceSelections.B)} />
          </div>
          <button
            type="button"
            disabled={!readyToReveal}
            onClick={onResolveChoice}
            className="min-h-[50px] w-full rounded-2xl bg-pink-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99] disabled:bg-warm-100 disabled:text-text-muted"
          >
            揭晓默契
          </button>
        </div>
      )
    }

    if (roundState.mechanicType === 'rhythm-chain') {
      const currentHits = rhythmHits[activePlayer]
      const totalHits = rhythmHits.A + rhythmHits.B
      const totalRequired = rhythmRequiredHits * 2
      const readyToReveal = rhythmHits.A >= rhythmRequiredHits && rhythmHits.B >= rhythmRequiredHits
      const partialReady = activePlayer === 'B' && totalHits > 0
      return (
        <div>
          <div className="rounded-2xl bg-warm-50 p-4 text-center">
            <p className="text-xs font-black text-text-muted">每人各自完成 {rhythmRequiredHits} 个节奏点</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(['A', 'B'] as PlayerKey[]).map(playerKey => (
                <div key={playerKey} className="rounded-2xl bg-white/75 p-3">
                  <p className="text-[11px] font-black text-text-muted">{playerKey} 路</p>
                  <div className="mt-2 flex justify-center gap-1.5">
                    {Array.from({ length: rhythmRequiredHits }, (_, index) => (
                      <span
                        key={index}
                        className={`h-5 w-5 rounded-full ${index < rhythmHits[playerKey] ? 'bg-pink-500 shadow-[0_0_18px_rgba(236,72,153,0.28)]' : 'bg-warm-100'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] font-bold text-text-muted">满连击 {totalRequired}/{totalRequired} 成功，半数以上会触发回应任务。</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!canPlay || currentHits >= rhythmRequiredHits}
              onClick={onRhythmHit}
              className="min-h-[50px] rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99] disabled:bg-warm-100 disabled:text-text-muted"
            >
              {activePlayer} 命中节奏点
            </button>
            <button
              type="button"
              disabled={!readyToReveal && !partialReady}
              onClick={onResolveRhythm}
              className="min-h-[50px] rounded-2xl bg-pink-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99] disabled:bg-warm-100 disabled:text-text-muted"
            >
              结算连击
            </button>
          </div>
        </div>
      )
    }

    if (roundState.mechanicType === 'boss-gate' && roundState.stageKey === 'sex') {
      return (
        <div>
          <WheelGate pointerValue={pointerValue} targetZone={currentTargetZone} isBlocked={isBlocked} locksByPlayer={locksByPlayer} hideLockedValues={handoffVisible || activePlayer === 'B'} />
          <GateLegend lockedCount={lockedCount} isBlocked={isBlocked} />
          <LockButton
            activePlayer={activePlayer}
            activeLabel={activeLabel}
            canPlay={canPlay}
            locked={currentPlayerDone}
            pointerValue={pointerValue}
            isBlocked={isBlocked}
            onLock={onLock}
          />
        </div>
      )
    }

    return (
      <div>
        <LinearTrack
          pointerValue={pointerValue}
          targetZone={currentTargetZone}
          locksByPlayer={locksByPlayer}
          isBlocked={isBlocked}
          hideLockedValues={handoffVisible || activePlayer === 'B'}
        />
        <GateLegend lockedCount={lockedCount} isBlocked={isBlocked} />
        <LockButton
          activePlayer={activePlayer}
          activeLabel={activeLabel}
          canPlay={canPlay}
          locked={currentPlayerDone}
          pointerValue={pointerValue}
          isBlocked={isBlocked}
          onLock={onLock}
        />
      </div>
    )
  }

  function getCurrentPlayerDone(): boolean {
    if (roundState.mechanicType === 'choice-sync') return Boolean(choiceSelections[activePlayer])
    if (roundState.mechanicType === 'rhythm-chain') return rhythmHits[activePlayer] >= rhythmRequiredHits
    return locksByPlayer[activePlayer] !== null
  }
}

function FlowGuide({ activePlayer, screenState }: { activePlayer: PlayerKey; screenState: string }) {
  const steps = [
    { key: 'A', label: 'A 操作' },
    { key: 'B', label: 'B 操作' },
    { key: 'result', label: '揭晓结果' },
  ]

  return (
    <div className="mt-4 grid grid-cols-3 gap-1.5">
      {steps.map(step => {
        const active = screenState === 'challenge-running' && step.key === activePlayer
        const waitingResult = screenState === 'challenge-running' && step.key === 'result'
        return (
          <div
            key={step.key}
            className={`rounded-2xl px-2 py-2 text-center text-[11px] font-black ${active ? 'bg-warm-500 text-white' : waitingResult ? 'bg-pink-50 text-pink-600' : 'bg-warm-50 text-text-muted'}`}
          >
            {step.label}
          </div>
        )
      })}
    </div>
  )
}

function HandoffOverlay({
  activePlayer,
  playerLabels,
  onHandoffReady,
}: {
  activePlayer: PlayerKey
  playerLabels: Record<PlayerKey, string>
  onHandoffReady: () => void
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/95 p-5 text-center shadow-sm">
      <p className="text-xs font-black text-warm-500">结果已隐藏</p>
      <h4 className="mt-2 text-lg font-black text-text-primary">请把手机交给 B 路 {playerLabels.B}</h4>
      <p className="mt-2 text-xs leading-relaxed text-text-muted">
        A 路 {playerLabels[activePlayer]} 的选择已经锁住了。B 操作前不要查看上一位的结果。
      </p>
      <button
        type="button"
        onClick={onHandoffReady}
        className="mt-5 min-h-[48px] w-full rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99]"
      >
        B 已接过手机，开始操作
      </button>
    </div>
  )
}

function LinearTrack({
  pointerValue,
  targetZone,
  locksByPlayer,
  isBlocked,
  hideLockedValues,
}: {
  pointerValue: number
  targetZone: TargetZone
  locksByPlayer: LocksByPlayer
  isBlocked: boolean
  hideLockedValues: boolean
}) {
  const obstacleLeft = Math.max(6, targetZone.low - 20)
  const obstacleWidth = Math.min(18, Math.max(10, targetZone.width * 0.65))

  return (
    <div className="relative h-10 rounded-full bg-warm-100 shadow-inner">
      <div
        className="absolute top-1/2 h-7 -translate-y-1/2 rounded-full bg-pink-200/80 ring-2 ring-pink-300/50"
        style={{ left: `${targetZone.low}%`, width: `${targetZone.width}%` }}
      />
      <div
        className="absolute top-1/2 h-7 -translate-y-1/2 rounded-full bg-text-primary/15"
        style={{ left: `${obstacleLeft}%`, width: `${obstacleWidth}%` }}
      />
      <div
        className={`absolute top-1/2 h-11 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_8px_20px_rgba(240,133,115,0.3)] ${isBlocked ? 'bg-text-primary' : 'bg-warm-500'}`}
        style={{ left: `${pointerValue}%` }}
      />
      {(['A', 'B'] as PlayerKey[]).map(playerKey => {
        const value = locksByPlayer[playerKey]
        if (value === null || hideLockedValues) return null
        return (
          <div
            key={playerKey}
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-pink-500 text-center text-[10px] font-black leading-4 text-white shadow"
            style={{ left: `${value}%` }}
          >
            {playerKey}
          </div>
        )
      })}
    </div>
  )
}

function WheelGate({
  pointerValue,
  targetZone,
  isBlocked,
  locksByPlayer,
  hideLockedValues,
}: {
  pointerValue: number
  targetZone: TargetZone
  isBlocked: boolean
  locksByPlayer: LocksByPlayer
  hideLockedValues: boolean
}) {
  const pointerAngle = pointerValue * 3.6
  const targetStart = targetZone.low * 3.6
  const targetEnd = targetZone.high * 3.6
  const lockAngles = (['A', 'B'] as PlayerKey[]).map(playerKey => ({
    playerKey,
    angle: (locksByPlayer[playerKey] ?? -1) * 3.6,
    visible: locksByPlayer[playerKey] !== null && !hideLockedValues,
  }))

  return (
    <div className="flex justify-center py-2">
      <div
        className="relative h-48 w-48 rounded-full shadow-inner"
        style={{
          background: `conic-gradient(from -90deg, rgba(255,255,255,0.9) 0deg ${targetStart}deg, rgba(244,114,182,0.34) ${targetStart}deg ${targetEnd}deg, rgba(31,41,55,0.18) ${targetEnd}deg ${targetEnd + 42}deg, rgba(255,255,255,0.9) ${targetEnd + 42}deg 360deg)`,
        }}
      >
        <div className="absolute inset-8 rounded-full bg-warm-50" />
        <div
          className={`absolute left-1/2 top-1/2 h-[92px] w-1 origin-bottom -translate-x-1/2 -translate-y-full rounded-full ${isBlocked ? 'bg-text-primary' : 'bg-warm-500'}`}
          style={{ transform: `translateX(-50%) translateY(-100%) rotate(${pointerAngle}deg)` }}
        />
        {lockAngles.map(lock => lock.visible ? (
          <div
            key={lock.playerKey}
            className="absolute left-1/2 top-1/2 h-[78px] w-5 origin-bottom -translate-x-1/2 -translate-y-full text-center text-xs font-black text-pink-600"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${lock.angle}deg)` }}
          >
            {lock.playerKey}
          </div>
        ) : null)}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-xs font-black text-text-muted">最终环门</p>
            <p className="text-lg font-black text-text-primary">{Math.round(pointerValue)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GateLegend({ lockedCount, isBlocked }: { lockedCount: number; isBlocked: boolean }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-black">
      <LegendItem label="粉色：目标区" tone="pink" />
      <LegendItem label="灰色：障碍区" tone="dark" />
      <LegendItem label="橙色：当前指针" tone="warm" />
      <div className="rounded-2xl bg-warm-50 px-3 py-2 text-text-muted">已锁定 {lockedCount}/2</div>
      {isBlocked ? <div className="col-span-2 rounded-2xl bg-text-primary px-3 py-2 text-white">当前指针在障碍区，锁定会触发补救</div> : null}
    </div>
  )
}

function LockButton({
  activePlayer,
  activeLabel,
  canPlay,
  locked,
  pointerValue,
  isBlocked,
  onLock,
}: {
  activePlayer: PlayerKey
  activeLabel: string
  canPlay: boolean
  locked: boolean
  pointerValue: number
  isBlocked: boolean
  onLock: (value: number, blocked: boolean) => void
}) {
  return (
    <button
      type="button"
      disabled={!canPlay || locked}
      onClick={() => onLock(pointerValue, isBlocked)}
      className={`mt-5 min-h-[50px] w-full rounded-2xl px-3 py-3 text-sm font-black active:scale-[0.99] disabled:active:scale-100 ${locked ? 'bg-pink-100 text-pink-600' : 'bg-warm-500 text-white disabled:bg-warm-100 disabled:text-text-muted'}`}
    >
      {locked ? `${activePlayer} 已锁定` : `${activePlayer} 锁定 · ${activeLabel}`}
    </button>
  )
}

function StatusPill({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`rounded-2xl px-3 py-2 text-center ${active ? 'bg-pink-100 text-pink-600' : 'bg-warm-50 text-text-muted'}`}>
      {label}
    </div>
  )
}

function LegendItem({ label, tone }: { label: string; tone: 'pink' | 'warm' | 'dark' }) {
  const toneClass = tone === 'pink' ? 'bg-pink-100 text-pink-600' : tone === 'warm' ? 'bg-warm-100 text-warm-600' : 'bg-text-primary/10 text-text-muted'
  return <div className={`rounded-2xl px-3 py-2 ${toneClass}`}>{label}</div>
}

function getMechanicCopy(roundState: ChallengeRoundState) {
  if (roundState.mechanicType === 'reaction-stop') {
    return {
      eyebrow: '调情机关',
      title: '反应停点',
      description: 'A/B 轮流停点，目标是都停进粉色甜点区，并且两个人的位置尽量靠近。',
      standard: '完成标准：A/B 都命中粉色目标区且距离够近，偏离会触发回应或补救。',
    }
  }

  if (roundState.mechanicType === 'choice-sync') {
    return {
      eyebrow: '前戏机关',
      title: '隐藏默契选择',
      description: 'A 先选并隐藏答案，再把手机交给 B。两人选择一致则通过。',
      standard: '完成标准：A/B 选择相同为成功，不同则进入回应任务。',
    }
  }

  if (roundState.mechanicType === 'rhythm-chain') {
    return {
      eyebrow: '深入机关',
      title: '双人节奏连击',
      description: 'A/B 轮流各自完成节奏点，满连击成功，少量命中会进入回应。',
      standard: '完成标准：两个人都点满节奏点成功，半数以上是 partial，太少则补救。',
    }
  }

  if (roundState.mechanicType === 'dynamic-gate') {
    return {
      eyebrow: '做爱机关',
      title: '动态障碍同步门',
      description: 'A/B 轮流锁定移动指针，避开灰色障碍，靠近粉色目标区。',
      standard: '完成标准：两人都靠近粉色目标区且没有撞障碍，Boss 失败会补救后重试。',
    }
  }

  return {
    eyebrow: roundState.stageKey === 'sex' ? '最终 Boss' : '阶段 Boss',
    title: roundState.stageKey === 'sex' ? '环形同步 Boss' : '压力同步门',
    description: roundState.stageKey === 'sex'
      ? 'A/B 轮流锁定环形指针，最终 Boss 需要避开障碍并尽量同步。'
      : 'A/B 轮流锁定压力门，越靠后目标越窄。',
    standard: roundState.stageKey === 'deepening' || roundState.stageKey === 'sex'
      ? '完成标准：命中目标且距离够近；失败后补救，再回到 Boss 重试。'
      : '完成标准：命中目标且距离够近；失败后补救，然后进入下一阶段。',
  }
}
