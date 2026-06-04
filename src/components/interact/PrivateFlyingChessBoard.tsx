import { useEffect, useMemo, useRef, useState } from 'react'
import { Dice5 } from 'lucide-react'
import {
  ensureHeartbeatBoard,
  generateHeartbeatSegment,
  getLowerHeartbeatLevel,
  getNextHeartbeatPersonalMilestone,
  getNextHeartbeatSharedMilestone,
  heartbeatBoosts,
  heartbeatCellMeta,
  heartbeatPersonalCompletionStep,
  heartbeatChoices,
  heartbeatPenalties,
  heartbeatPersonalMilestones,
  heartbeatRewards,
  heartbeatSharedMilestones,
  type HeartbeatProgressMilestone,
  type HeartbeatCell,
  type HeartbeatLevel,
} from '../../data/private-flying-chess'
import { getRandomMaterial, type InteractionMaterial } from '../../data/interact-materials'
import {
  drawMaterial,
  drawMaterialForLead,
  renderHeartTuneCard,
  type HeartTuneMaterial,
  type HeartTuneMode,
  type HeartTuneStage,
} from '../../features/heart-tune'

interface PrivateFlyingChessBoardProps {
  level: HeartbeatLevel
  playerAName: string
  playerBName: string
}

interface HeartbeatResult {
  player: 'A' | 'B'
  partner: 'A' | 'B'
  roll: number
  position: number
  cell: HeartbeatCell
  level: HeartbeatLevel
  material?: InteractionMaterial
  secondMaterial?: InteractionMaterial
  effect?: string
  addon?: string
  retainTurn?: boolean
  choicePending?: boolean
  progressEvent?: HeartbeatProgressEvent
  movementNote?: string
}

type TurnPhase = 'idle' | 'rolling' | 'moving' | 'revealing'

type PlayerKey = 'A' | 'B'
type ChoiceAction = 'normal' | 'lower' | 'swap'
type HeartbeatProgressEventType = 'personal' | 'shared'

interface HeartbeatProgressEvent {
  type: HeartbeatProgressEventType
  milestone: HeartbeatProgressMilestone
  player?: PlayerKey
  follower?: PlayerKey
  material: HeartTuneMaterial
  leadPlayer: PlayerKey
}

const MAP_COLUMNS = 5
const MAP_ROWS = 5
const VISIBLE_CELL_COUNT = MAP_COLUMNS * MAP_ROWS
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const

const pickRandom = (items: readonly string[]) => items[Math.floor(Math.random() * items.length)]
const heartbeatStageMap: Record<HeartbeatLevel, HeartTuneStage> = {
  beginner: 'flirt',
  intermediate: 'foreplay',
  advanced: 'deepening',
  finale: 'finale',
}
const personalEventModes: readonly HeartTuneMode[] = ['directed', 'response']
const sharedEventModes: readonly HeartTuneMode[] = ['duo', 'scene']

export function PrivateFlyingChessBoard({ level, playerAName, playerBName }: PrivateFlyingChessBoardProps) {
  const [board, setBoard] = useState<HeartbeatCell[]>(() => generateHeartbeatSegment(0))
  const [positions, setPositions] = useState<Record<PlayerKey, number>>({ A: 0, B: 0 })
  const [displayPositions, setDisplayPositions] = useState<Record<PlayerKey, number>>({ A: 0, B: 0 })
  const [currentPlayer, setCurrentPlayer] = useState<PlayerKey>('A')
  const [movingPlayer, setMovingPlayer] = useState<PlayerKey | null>(null)
  const [phase, setPhase] = useState<TurnPhase>('idle')
  const [dicePreview, setDicePreview] = useState(1)
  const [result, setResult] = useState<HeartbeatResult | null>(null)
  const [animationWindowStart, setAnimationWindowStart] = useState<number | null>(null)
  const [claimedPersonalMilestones, setClaimedPersonalMilestones] = useState<Record<PlayerKey, number[]>>({ A: [], B: [] })
  const [claimedSharedMilestones, setClaimedSharedMilestones] = useState<number[]>([])
  const timersRef = useRef<number[]>([])
  const runIdRef = useRef(0)

  const activeTaskPlayer = result?.player ?? currentPlayer
  const playerNames = useMemo(() => ({ A: playerAName, B: playerBName }), [playerAName, playerBName])
  const activeMapPosition = movingPlayer ? displayPositions[movingPlayer] : Math.max(displayPositions.A, displayPositions.B)
  const visibleStart = animationWindowStart ?? Math.max(0, activeMapPosition - 12)
  const sharedSteps = positions.A + positions.B
  const leader = positions.A >= positions.B ? 'A' : 'B'
  const nextPersonalMilestone = getNextHeartbeatPersonalMilestone(claimedPersonalMilestones[leader])
  const nextSharedMilestone = getNextHeartbeatSharedMilestone(claimedSharedMilestones)

  const visibleCells = useMemo(() => {
    return board.slice(visibleStart, visibleStart + VISIBLE_CELL_COUNT)
  }, [board, visibleStart])

  const clearTimers = () => {
    timersRef.current.forEach(timer => {
      window.clearTimeout(timer)
      window.clearInterval(timer)
    })
    timersRef.current = []
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  const wait = (ms: number) => new Promise<void>(resolve => {
    const timeout = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter(timer => timer !== timeout)
      resolve()
    }, ms)
    timersRef.current.push(timeout)
  })

  const rollDice = async () => {
    if (phase !== 'idle') return

    clearTimers()
    const runId = runIdRef.current + 1
    runIdRef.current = runId

    const rollingPlayer = currentPlayer
    const partner = rollingPlayer === 'A' ? 'B' : 'A'
    const startPosition = positions[rollingPlayer]
    const roll = Math.floor(Math.random() * 6) + 1
    const nextPosition = startPosition + roll
    const nextBoard = ensureHeartbeatBoard(board, nextPosition + VISIBLE_CELL_COUNT)
    const cell = nextBoard[nextPosition]
    const resolvedMovement = resolveHeartbeatMovement(cell, rollingPlayer, nextPosition, positions)
    const progressEvent = resolveProgressEvent(
      positions,
      resolvedMovement.positions,
      rollingPlayer,
      level,
      claimedPersonalMilestones,
      claimedSharedMilestones,
    )
    const resolved = withProgressEvent(
      resolveHeartbeatCell(cell, rollingPlayer, partner, roll, nextPosition, level, resolvedMovement.note),
      progressEvent,
    )
    const fixedWindowStart = Math.max(0, startPosition - 8)
    const ensuredBoard = ensureHeartbeatBoard(nextBoard, Math.max(resolvedMovement.positions.A, resolvedMovement.positions.B) + VISIBLE_CELL_COUNT)

    setBoard(ensuredBoard)
    setResult(null)
    setMovingPlayer(rollingPlayer)
    setAnimationWindowStart(fixedWindowStart)
    setDisplayPositions(prev => ({ ...prev, [rollingPlayer]: startPosition }))
    setPhase('rolling')

    const rollInterval = window.setInterval(() => {
      setDicePreview(Math.floor(Math.random() * 6) + 1)
    }, 90)
    timersRef.current.push(rollInterval)

    await wait(2000)
    if (runIdRef.current !== runId) return

    window.clearInterval(rollInterval)
    timersRef.current = timersRef.current.filter(timer => timer !== rollInterval)
    setDicePreview(roll)

    await wait(180)
    if (runIdRef.current !== runId) return

    setPhase('moving')
    for (let position = startPosition + 1; position <= nextPosition; position += 1) {
      await wait(290)
      if (runIdRef.current !== runId) return
      setDisplayPositions(prev => ({ ...prev, [rollingPlayer]: position }))
    }

    if (runIdRef.current !== runId) return

    setPositions(resolvedMovement.positions)
    if (progressEvent?.type === 'personal' && progressEvent.player) {
      const eventPlayer = progressEvent.player
      setClaimedPersonalMilestones(prev => ({
        ...prev,
        [eventPlayer]: [...prev[eventPlayer], progressEvent.milestone.steps],
      }))
    } else if (progressEvent?.type === 'shared') {
      setClaimedSharedMilestones(prev => [...prev, progressEvent.milestone.steps])
    }
    setDisplayPositions(resolvedMovement.positions)
    setResult(resolved)
    setPhase('revealing')

    await wait(420)
    if (runIdRef.current !== runId) return

    setCurrentPlayer(resolved.retainTurn ? rollingPlayer : partner)
    setMovingPlayer(null)
    setAnimationWindowStart(null)
    setPhase('idle')
  }

  const rollButtonText = phase === 'rolling'
      ? '骰子滚动中'
      : phase === 'moving'
        ? '棋子前进中'
        : phase === 'revealing'
          ? '任务卡出现中'
          : '掷骰 / 再掷一次'

  return (
    <div className="flex flex-col gap-2">
      <section className="pixel-card private-flying-player-strip px-2 py-0.5">
        <div className="grid h-full grid-cols-[minmax(0,1fr)_34px_minmax(0,1fr)] items-center gap-3">
          <PlayerStatusCard player="A" name={playerNames.A} active={activeTaskPlayer === 'A'} />
          <DiceWidget value={dicePreview} phase={phase} />
          <PlayerStatusCard player="B" name={playerNames.B} active={activeTaskPlayer === 'B'} />
        </div>
      </section>

      <section className="pixel-card p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-black text-warm-500">心跳地图</p>
          <div className="rounded-full bg-warm-100 px-3 py-1 text-xs font-black text-warm-600">
            {playerNames.A} {positions.A}/{heartbeatPersonalCompletionStep} · {playerNames.B} {positions.B}/{heartbeatPersonalCompletionStep}
          </div>
        </div>
        <div className="mb-2 grid gap-2 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-warm-100">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <p className="text-[10px] font-black text-warm-600">个人</p>
            <div className="h-2 overflow-hidden rounded-full bg-warm-100">
              <div className="h-full rounded-full bg-warm-500 transition-all" style={{ width: `${Math.min(100, (Math.max(positions.A, positions.B) / heartbeatPersonalCompletionStep) * 100)}%` }} />
            </div>
            <p className="text-[10px] font-black text-warm-600">{nextPersonalMilestone ? `${nextPersonalMilestone.steps}步 ${nextPersonalMilestone.label}` : '可继续玩'}</p>
          </div>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <p className="text-[10px] font-black text-pink-600">共同</p>
            <div className="h-2 overflow-hidden rounded-full bg-pink-100">
              <div className="h-full rounded-full bg-pink-500 transition-all" style={{ width: `${Math.min(100, (sharedSteps / (nextSharedMilestone?.steps ?? heartbeatSharedMilestones.at(-1)?.steps ?? 180)) * 100)}%` }} />
            </div>
            <p className="text-[10px] font-black text-pink-600">{nextSharedMilestone ? `共${nextSharedMilestone.steps}步 ${nextSharedMilestone.label}` : '共振已满'}</p>
          </div>
        </div>

        <div className="grid grid-cols-5 grid-rows-5 gap-1.5">
          {visibleCells.map(cell => {
            const meta = heartbeatCellMeta[cell.type]
            const offset = cell.index - visibleStart
            const rowFromBottom = Math.floor(offset / MAP_COLUMNS)
            const colInRow = offset % MAP_COLUMNS
            const gridRow = MAP_ROWS - rowFromBottom
            const gridColumn = rowFromBottom % 2 === 0 ? colInRow + 1 : MAP_COLUMNS - colInRow
            const hasA = displayPositions.A === cell.index
            const hasB = displayPositions.B === cell.index
            const activePiece = movingPlayer ?? activeTaskPlayer
            const active = displayPositions[activePiece] === cell.index
            const movingHere = movingPlayer ? displayPositions[movingPlayer] === cell.index : false
            const taskHere = !movingPlayer && result?.cell.type === 'reverse' && displayPositions[activeTaskPlayer] === cell.index

            return (
              <div
                key={cell.index}
                className={`relative flex min-h-[62px] flex-col items-center justify-center rounded-2xl p-1 text-center ring-1 transition-all duration-200 ${meta.tone} ${active ? 'scale-[1.03] shadow-sm ring-2 ring-warm-300' : ''}`}
                style={{ gridColumn, gridRow }}
              >
                <span className="absolute left-1.5 top-1 text-[9px] font-black opacity-60">{cell.index + 1}</span>
                <span className="text-lg font-black leading-none">{meta.icon}</span>
                <span className="mt-0.5 text-[9px] font-black leading-tight">{meta.label}</span>
                <span className="absolute bottom-1 flex gap-0.5 text-[9px] font-black text-white">
                  {hasA ? <PieceBadge player="A" moving={movingHere && movingPlayer === 'A'} active={taskHere && activeTaskPlayer === 'A'} /> : null}
                  {hasB ? <PieceBadge player="B" moving={movingHere && movingPlayer === 'B'} active={taskHere && activeTaskPlayer === 'B'} /> : null}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="pixel-card p-4">
        <ResultPanel phase={phase} result={result} currentPlayer={currentPlayer} playerNames={playerNames} onChoice={choice => {
          if (!result?.choicePending) return
          setResult(resolveHeartbeatChoice(result, choice, level))
        }} />
      </section>

      <button
        type="button"
        onClick={rollDice}
        disabled={phase !== 'idle'}
        className="flex min-h-[52px] items-center justify-center gap-2 rounded-3xl bg-warm-500 px-4 py-3 text-base font-black text-white shadow-sm disabled:bg-warm-200 disabled:text-text-muted"
      >
        <Dice5 size={18} />
        {rollButtonText}
      </button>
    </div>
  )
}

function resolveHeartbeatCell(
  cell: HeartbeatCell,
  player: PlayerKey,
  partner: PlayerKey,
  roll: number,
  position: number,
  level: HeartbeatLevel,
  movementNote?: string,
): HeartbeatResult {
  const baseResult: HeartbeatResult = {
    player,
    partner,
    roll,
    position,
    cell,
    level,
    movementNote,
  }

  if (cell.type === 'rest') {
    return {
      ...baseResult,
      effect: '休息格：这一格不抽卡，自然缓一缓。想继续就直接再掷骰。',
    }
  }

  if (cell.type === 'choice') {
    return {
      ...baseResult,
      effect: pickRandom(heartbeatChoices),
      choicePending: true,
    }
  }

  if (cell.type === 'reward') {
    const lowerLevel = getLowerHeartbeatLevel(level)
    return {
      ...baseResult,
      level: lowerLevel,
      material: getRandomMaterial({ level: lowerLevel }),
      effect: pickRandom(heartbeatRewards),
    }
  }

  if (cell.type === 'penalty') {
    return {
      ...baseResult,
      material: getRandomMaterial({ level }),
      addon: pickRandom(heartbeatPenalties),
    }
  }

  if (cell.type === 'boost') {
    return {
      ...baseResult,
      material: getRandomMaterial({ level }),
      addon: pickRandom(heartbeatBoosts),
    }
  }

  if (cell.type === 'reverse') {
    return {
      ...baseResult,
      player: partner,
      partner: player,
      material: getRandomMaterial({ level }),
      effect: '反转格：本回合卡片里的“玩家”与“伴侣”身份互换。',
    }
  }

  if (cell.type === 'double') {
    return {
      ...baseResult,
      material: getRandomMaterial({ level }),
      secondMaterial: getRandomMaterial({ level }),
      effect: '双抽格：抽两张，你们现场二选一。',
    }
  }

  if (cell.type === 'reroll') {
    return {
      ...baseResult,
      material: getRandomMaterial({ level }),
      retainTurn: true,
      addon: '再掷格：派发这张后，当前玩家保留回合，可以立刻再掷一次。',
    }
  }

  if (cell.type === 'close') {
    return {
      ...baseResult,
      material: getRandomMaterial({ level }),
      effect: '贴近格：走得更远的一方回到另一方附近，再完成这一张靠近任务。',
    }
  }

  if (cell.type === 'advance') {
    return {
      ...baseResult,
      material: getRandomMaterial({ level }),
      effect: '前进格：两个人一起向前推进 1 步，心跳旅程更快到达奖励点。',
    }
  }

  return {
    ...baseResult,
    material: getRandomMaterial({ level }),
  }
}

function resolveHeartbeatMovement(
  cell: HeartbeatCell,
  player: PlayerKey,
  landedPosition: number,
  positions: Record<PlayerKey, number>,
): { positions: Record<PlayerKey, number>, note?: string } {
  const nextPositions = { ...positions, [player]: landedPosition }

  if (cell.type === 'advance') {
    return {
      positions: {
        A: nextPositions.A + 1,
        B: nextPositions.B + 1,
      },
      note: '前进格生效：双方各向前 1 步。',
    }
  }

  if (cell.type !== 'close') {
    return { positions: nextPositions }
  }

  const leader = nextPositions.A >= nextPositions.B ? 'A' : 'B'
  const follower = leader === 'A' ? 'B' : 'A'
  const target = Math.min(nextPositions[leader], nextPositions[follower] + 1)

  return {
    positions: {
      ...nextPositions,
      [leader]: target,
    },
    note: `${leader} 回到 ${follower} 附近，停在第 ${target + 1} 格。`,
  }
}

function resolveProgressEvent(
  previousPositions: Record<PlayerKey, number>,
  nextPositions: Record<PlayerKey, number>,
  rollingPlayer: PlayerKey,
  level: HeartbeatLevel,
  claimedPersonalMilestones: Record<PlayerKey, number[]>,
  claimedSharedMilestones: number[],
): HeartbeatProgressEvent | undefined {
  const stage = heartbeatStageMap[level]
  const partner = rollingPlayer === 'A' ? 'B' : 'A'
  const playersByPriority: readonly PlayerKey[] = [rollingPlayer, partner]

  for (const player of playersByPriority) {
    const milestone = heartbeatPersonalMilestones
      .filter(item => !claimedPersonalMilestones[player].includes(item.steps))
      .find(item => previousPositions[player] < item.steps && nextPositions[player] >= item.steps)

    if (milestone) {
      const follower = player === 'A' ? 'B' : 'A'
      const mode = personalEventModes[Math.floor(Math.random() * personalEventModes.length)]
      return {
        type: 'personal',
        milestone,
        player,
        follower,
        material: drawMaterialForLead(stage, mode, follower, []),
        leadPlayer: follower,
      }
    }
  }

  const previousSharedSteps = previousPositions.A + previousPositions.B
  const nextSharedSteps = nextPositions.A + nextPositions.B
  const sharedMilestone = heartbeatSharedMilestones
    .filter(item => !claimedSharedMilestones.includes(item.steps))
    .find(item => previousSharedSteps < item.steps && nextSharedSteps >= item.steps)

  if (!sharedMilestone) return undefined

  const mode = sharedEventModes[Math.floor(Math.random() * sharedEventModes.length)]
  return {
    type: 'shared',
    milestone: sharedMilestone,
    material: drawMaterial(stage, mode, []),
    leadPlayer: rollingPlayer,
  }
}

function withProgressEvent(result: HeartbeatResult, progressEvent?: HeartbeatProgressEvent): HeartbeatResult {
  return {
    ...result,
    progressEvent,
  }
}

function resolveHeartbeatChoice(result: HeartbeatResult, choice: ChoiceAction, currentLevel: HeartbeatLevel): HeartbeatResult {
  if (choice === 'lower') {
    const lowerLevel = getLowerHeartbeatLevel(currentLevel)
    return {
      ...result,
      level: lowerLevel,
      choicePending: false,
      material: getRandomMaterial({ level: lowerLevel }),
      effect: '选择格：已选择降低一档，抽一张更柔和的任务卡。',
    }
  }

  if (choice === 'swap') {
    return {
      ...result,
      player: result.partner,
      partner: result.player,
      choicePending: false,
      material: getRandomMaterial({ level: currentLevel }),
      effect: '选择格：已交换主导，本回合由伴侣来带节奏。',
    }
  }

  return {
    ...result,
    choicePending: false,
    material: getRandomMaterial({ level: currentLevel }),
    effect: '选择格：已选择正常执行，抽当前阶段任务卡。',
  }
}

function DiceWidget({ value, phase }: { value: number, phase: TurnPhase }) {
  const rolling = phase === 'rolling'

  return (
    <div className={`mx-auto flex h-[30px] w-[30px] -translate-y-0.5 items-center justify-center rounded-xl bg-warm-500 text-lg font-black text-white shadow-sm transition-all duration-150 ${rolling ? 'scale-105 rotate-6' : 'scale-100 rotate-0'}`}>
      {DICE_FACES[Math.max(0, Math.min(5, value - 1))]}
    </div>
  )
}

function PieceBadge({ player, moving, active }: { player: PlayerKey, moving: boolean, active: boolean }) {
  return (
    <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 transition-transform duration-150 ${player === 'A' ? 'bg-warm-500' : 'bg-pink-500'} ${moving || active ? '-translate-y-1 scale-110 shadow-sm ring-2 ring-white' : ''}`}>
      {player}
    </span>
  )
}

function PlayerStatusCard({ player, name, active }: { player: PlayerKey, name: string, active: boolean }) {
  const activeColor = player === 'A' ? 'text-warm-600' : 'text-pink-500'
  const labelColor = player === 'A' ? 'text-warm-500' : 'text-pink-500'
  const alignClass = player === 'B' ? 'items-end text-right' : 'items-start text-left'

  return (
    <div className={`flex min-w-0 flex-col px-1 ${alignClass}`}>
      <p className={`text-[8px] font-black leading-none ${active ? activeColor : labelColor}`}>{player}</p>
      <p className={`mt-0.5 max-w-full truncate text-xs font-black leading-tight ${active ? activeColor : 'text-text-primary'}`}>{name}</p>
    </div>
  )
}

function ResultPanel({ phase, result, currentPlayer, playerNames, onChoice }: { phase: TurnPhase, result: HeartbeatResult | null, currentPlayer: PlayerKey, playerNames: Record<PlayerKey, string>, onChoice: (choice: ChoiceAction) => void }) {
  if (phase === 'rolling') {
    return <p className="text-center text-sm font-black leading-relaxed text-text-primary">骰子滚动中...</p>
  }

  if (phase === 'moving') {
    return <p className="text-center text-sm font-black leading-relaxed text-text-primary">棋子前进中...</p>
  }

  if (phase === 'revealing') {
    return <p className="text-center text-sm font-black leading-relaxed text-text-primary">任务卡出现中...</p>
  }

  if (!result) {
    return <p className="text-center text-sm font-semibold leading-relaxed text-text-muted">{playerNames[currentPlayer]} 点击掷骰开始。</p>
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-black text-warm-500">{playerNames[result.player]} 掷出 {result.roll}</p>
      {result.movementNote ? (
        <p className="rounded-2xl bg-orange-50 px-3 py-2 text-sm font-semibold leading-relaxed text-orange-700">{result.movementNote}</p>
      ) : null}
      {result.progressEvent ? <ProgressEventCard event={result.progressEvent} playerNames={playerNames} /> : null}
      {result.effect ? (
        <p className="rounded-2xl bg-warm-50 px-3 py-2 text-sm font-semibold leading-relaxed text-text-secondary">{result.effect}</p>
      ) : null}
      {!result.progressEvent && result.choicePending ? (
        <div className="grid grid-cols-3 gap-1.5">
          <button type="button" onClick={() => onChoice('normal')} className="min-h-[38px] rounded-2xl bg-warm-500 px-2 text-xs font-black text-white">正常</button>
          <button type="button" onClick={() => onChoice('lower')} className="min-h-[38px] rounded-2xl bg-white px-2 text-xs font-black text-warm-600 ring-1 ring-warm-100">降档</button>
          <button type="button" onClick={() => onChoice('swap')} className="min-h-[38px] rounded-2xl bg-white px-2 text-xs font-black text-pink-600 ring-1 ring-pink-100">换主导</button>
        </div>
      ) : null}
      {!result.progressEvent && result.material ? <MaterialCard material={result.material} /> : null}
      {!result.progressEvent && result.secondMaterial ? <MaterialCard material={result.secondMaterial} label="备选" muted /> : null}
      {!result.progressEvent && result.addon ? (
        <p className="rounded-2xl bg-pink-50 px-3 py-2 text-sm font-semibold leading-relaxed text-pink-700">{result.addon}</p>
      ) : null}
    </div>
  )
}

function ProgressEventCard({ event, playerNames }: { event: HeartbeatProgressEvent, playerNames: Record<PlayerKey, string> }) {
  const renderedCard = renderHeartTuneCard(
    event.material,
    event.leadPlayer,
    playerNames,
    getProgressEventSummary(event, playerNames),
    false,
    '',
  )

  return (
    <div className="rounded-3xl border border-pink-100 bg-pink-50/80 p-3">
      <p className="text-[11px] font-black text-pink-600">
        {event.type === 'personal' ? '竞争触发' : '共同触发'} · {event.milestone.label}
      </p>
      <p className="mt-1 text-xs font-semibold leading-relaxed text-pink-700">{renderedCard.ruleSummary}</p>
      <div className="mt-2 rounded-2xl bg-white/90 p-3 ring-1 ring-pink-100">
        <p className="text-[10px] font-black text-pink-500">{renderedCard.stageLabel} · {renderedCard.modeLabel} · {renderedCard.leadLabel}主导</p>
        <p className="mt-1 text-base font-black leading-relaxed text-text-primary">{renderedCard.text}</p>
      </div>
    </div>
  )
}

function getProgressEventSummary(event: HeartbeatProgressEvent, playerNames: Record<PlayerKey, string>): string {
  if (event.type === 'personal' && event.player && event.follower) {
    const prefix = event.milestone.steps >= heartbeatPersonalCompletionStep ? '阶段通关' : '领先奖励'
    return `${prefix}：${playerNames[event.player]} 先到 ${event.milestone.steps} 步，${playerNames[event.follower]} 抽一张当前阶段指向性任务。通关后仍可继续玩或自由切阶段。`
  }

  return `${event.milestone.label}：两人合计到 ${event.milestone.steps} 步，触发当前阶段共同任务。`
}

function MaterialCard({ material, label, muted = false }: { material: InteractionMaterial, label?: string, muted?: boolean }) {
  return (
    <div className={`rounded-3xl border p-3 ${muted ? 'border-pink-100 bg-pink-50/70' : 'border-warm-100 bg-white/90'}`}>
      {label ? <p className="mb-2 text-[10px] font-black text-pink-500">{label}</p> : null}
      <p className="text-base font-black leading-relaxed text-text-primary">{material.content}</p>
    </div>
  )
}
