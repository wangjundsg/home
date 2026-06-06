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
  heartbeatChoices,
  heartbeatPenalties,
  heartbeatRewards,
  type HeartbeatProgressMilestone,
  type HeartbeatCell,
  type HeartbeatLevel,
} from '../../data/private-flying-chess'
import { getRandomMaterial, type InteractionMaterial } from '../../data/interact-materials'
import {
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
  player: PlayerKey
  partner: PlayerKey
  roll: number
  position: number
  cell: HeartbeatCell
  level: HeartbeatLevel
  draw?: HeartbeatCardDraw
  secondDraw?: HeartbeatCardDraw
  fallbackMaterial?: InteractionMaterial
  secondFallbackMaterial?: InteractionMaterial
  effect?: string
  addon?: string
  retainTurn?: boolean
  choicePending?: boolean
  rewardPending?: boolean
  progressEvent?: HeartbeatProgressEvent
  movementNote?: string
}

type TurnPhase = 'idle' | 'rolling' | 'moving' | 'revealing'

type PlayerKey = 'A' | 'B'
type ChoiceAction = 'normal' | 'lower' | 'swap' | HeartTuneMode
type HeartbeatProgressEventType = 'personal' | 'shared'

interface HeartbeatCardDrawInput {
  cellType: HeartbeatCell['type']
  level: HeartbeatLevel
  roller: PlayerKey
  partner: PlayerKey
  positions: Record<PlayerKey, number>
  forcedMode?: HeartTuneMode
  levelOverride?: HeartbeatLevel
}

interface HeartbeatMilestoneDrawInput {
  type: HeartbeatProgressEventType
  level: HeartbeatLevel
  triggerPlayer: PlayerKey
  follower?: PlayerKey
  forcedMode?: HeartTuneMode
}

interface HeartbeatCardDraw {
  cellType?: HeartbeatCell['type']
  stage: HeartTuneStage
  level: HeartbeatLevel
  primaryMode: HeartTuneMode | null
  secondMode?: HeartTuneMode
  leadPlayer: PlayerKey
  responsePlayer: PlayerKey | null
  triggerPlayer: PlayerKey
  shared: boolean
  needsChoice: boolean
  roleSummary: string
  material?: HeartTuneMaterial
  secondMaterial?: HeartTuneMaterial
  fallbackMaterial?: InteractionMaterial
  secondFallbackMaterial?: InteractionMaterial
}

interface HeartbeatProgressEvent {
  type: HeartbeatProgressEventType
  milestone: HeartbeatProgressMilestone
  player?: PlayerKey
  follower?: PlayerKey
  draw: HeartbeatCardDraw
}

interface OpeningRollState {
  ready: boolean
  rolls: Record<PlayerKey, number> | null
  winner: PlayerKey | null
  tied: boolean
}

const MAP_COLUMNS = 5
const MAP_ROWS = 5
const VISIBLE_CELL_COUNT = MAP_COLUMNS * MAP_ROWS
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const

const pickRandom = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]
const heartbeatStageMap: Record<HeartbeatLevel, HeartTuneStage> = {
  beginner: 'flirt',
  intermediate: 'foreplay',
  advanced: 'deepening',
  finale: 'finale',
}
const personalEventModes: readonly HeartTuneMode[] = ['directed', 'response']
const sharedEventModes: readonly HeartTuneMode[] = ['duo', 'scene']
const rewardChoiceModes: readonly HeartTuneMode[] = ['directed', 'response', 'duo', 'scene']

export function PrivateFlyingChessBoard({ level, playerAName, playerBName }: PrivateFlyingChessBoardProps) {
  const [board, setBoard] = useState<HeartbeatCell[]>(() => generateHeartbeatSegment(0))
  const [positions, setPositions] = useState<Record<PlayerKey, number>>({ A: 0, B: 0 })
  const [displayPositions, setDisplayPositions] = useState<Record<PlayerKey, number>>({ A: 0, B: 0 })
  const [currentPlayer, setCurrentPlayer] = useState<PlayerKey>('A')
  const [movingPlayer, setMovingPlayer] = useState<PlayerKey | null>(null)
  const [phase, setPhase] = useState<TurnPhase>('idle')
  const [dicePreview, setDicePreview] = useState(1)
  const [result, setResult] = useState<HeartbeatResult | null>(null)
  const [openingRoll, setOpeningRoll] = useState<OpeningRollState>(() => createInitialOpeningRoll(level))
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
  const personalProgressBase = Math.max(0, nextPersonalMilestone.steps - 20)
  const personalProgressRange = nextPersonalMilestone.steps - personalProgressBase
  const sharedProgressBase = Math.max(0, nextSharedMilestone.steps - 30)
  const sharedProgressRange = nextSharedMilestone.steps - sharedProgressBase
  const personalProgressPercent = Math.max(0, Math.min(100, ((Math.max(positions.A, positions.B) - personalProgressBase) / personalProgressRange) * 100))
  const sharedProgressPercent = Math.max(0, Math.min(100, ((sharedSteps - sharedProgressBase) / sharedProgressRange) * 100))
  const shouldRollForOpening = shouldContinueOpeningRoll(level, openingRoll, positions)
  const shouldShowOpening = shouldShowOpeningRoll(level, openingRoll, positions)

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

    if (shouldRollForOpening) {
      const rolls = {
        A: Math.floor(Math.random() * 6) + 1,
        B: Math.floor(Math.random() * 6) + 1,
      }
      const openingResult = resolveOpeningRoll(rolls)

      setDicePreview(rolls[openingResult.winner ?? 'A'])
      setOpeningRoll({
        ready: !openingResult.tied,
        rolls,
        winner: openingResult.winner,
        tied: openingResult.tied,
      })
      setCurrentPlayer(openingResult.winner ?? 'A')
      setResult(null)
      return
    }

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
      resolveHeartbeatCell(cell, rollingPlayer, partner, roll, nextPosition, level, positions, resolvedMovement.note),
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
          : shouldRollForOpening ? '比大小决定先手' : '掷骰 / 再掷一次'

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
            {playerNames.A} {positions.A}步 · {playerNames.B} {positions.B}步
          </div>
        </div>
        <div className="mb-2 grid gap-2 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-warm-100">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <p className="text-[10px] font-black text-warm-600">个人</p>
            <div className="h-2 overflow-hidden rounded-full bg-warm-100">
              <div className="h-full rounded-full bg-warm-500 transition-all" style={{ width: `${personalProgressPercent}%` }} />
            </div>
            <p className="text-[10px] font-black text-warm-600">下次 {nextPersonalMilestone.steps}步 {nextPersonalMilestone.label}</p>
          </div>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <p className="text-[10px] font-black text-pink-600">共同</p>
            <div className="h-2 overflow-hidden rounded-full bg-pink-100">
              <div className="h-full rounded-full bg-pink-500 transition-all" style={{ width: `${sharedProgressPercent}%` }} />
            </div>
            <p className="text-[10px] font-black text-pink-600">下次 共{nextSharedMilestone.steps}步 {nextSharedMilestone.label}</p>
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
        <ResultPanel phase={phase} result={result} currentPlayer={currentPlayer} playerNames={playerNames} openingRoll={openingRoll} useOpeningRoll={shouldShowOpening} onChoice={choice => {
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

export function createHeartbeatCellDraw(input: HeartbeatCardDrawInput): HeartbeatCardDraw {
  const stage = heartbeatStageMap[input.levelOverride ?? input.level]
  const mode = getCellPrimaryMode(input)
  const leadPlayer = getCellLeadPlayer(input, mode)
  const responsePlayer = getCellResponsePlayer(input, mode, leadPlayer)
  const shared = mode === 'duo' || mode === 'scene'
  const baseDraw: HeartbeatCardDraw = {
    cellType: input.cellType,
    stage,
    level: input.levelOverride ?? input.level,
    primaryMode: mode,
    secondMode: input.cellType === 'double' ? 'response' : undefined,
    leadPlayer,
    responsePlayer,
    triggerPlayer: input.roller,
    shared,
    needsChoice: input.cellType === 'choice' || input.cellType === 'reward',
    roleSummary: createHeartbeatRoleSummary(input.cellType, mode, input.roller, leadPlayer, responsePlayer, shared),
  }

  if (!mode) return baseDraw

  const material = drawHeartbeatMaterial(stage, mode, leadPlayer)
  const secondMaterial = input.cellType === 'double'
    ? drawHeartbeatMaterial(stage, 'response', input.partner)
    : undefined

  return {
    ...baseDraw,
    material: material.material,
    fallbackMaterial: material.fallbackMaterial,
    secondMaterial: secondMaterial?.material,
    secondFallbackMaterial: secondMaterial?.fallbackMaterial,
  }
}

export function createHeartbeatMilestoneDraw(input: HeartbeatMilestoneDrawInput): HeartbeatCardDraw {
  const stage = heartbeatStageMap[input.level]
  const mode = input.forcedMode ?? pickRandom(input.type === 'personal' ? personalEventModes : sharedEventModes)
  const shared = mode === 'duo' || mode === 'scene'
  const leadPlayer = getMilestoneLeadPlayer(input, mode)
  const responsePlayer = input.type === 'personal' && mode === 'response'
    ? input.follower ?? (input.triggerPlayer === 'A' ? 'B' : 'A')
    : null
  const material = drawHeartbeatMaterial(stage, mode, leadPlayer)

  return {
    stage,
    level: input.level,
    primaryMode: mode,
    leadPlayer,
    responsePlayer,
    triggerPlayer: input.triggerPlayer,
    shared,
    needsChoice: false,
    roleSummary: createHeartbeatMilestoneRoleSummary(input, mode, leadPlayer, responsePlayer, shared),
    material: material.material,
    fallbackMaterial: material.fallbackMaterial,
  }
}

export function resolveOpeningRoll(rolls: Record<PlayerKey, number>): { winner: PlayerKey | null, tied: boolean } {
  if (rolls.A === rolls.B) return { winner: null, tied: true }
  return { winner: rolls.A > rolls.B ? 'A' : 'B', tied: false }
}

export function shouldUseOpeningRoll(level: HeartbeatLevel): boolean {
  return level === 'beginner'
}

export function shouldShowOpeningRoll(level: HeartbeatLevel, openingRoll: OpeningRollState, positions: Record<PlayerKey, number>): boolean {
  return shouldUseOpeningRoll(level) && Boolean(openingRoll.rolls) && positions.A === 0 && positions.B === 0
}

export function shouldContinueOpeningRoll(level: HeartbeatLevel, openingRoll: OpeningRollState, positions: Record<PlayerKey, number>): boolean {
  return shouldUseOpeningRoll(level) && !openingRoll.ready && positions.A === 0 && positions.B === 0
}

function createInitialOpeningRoll(level: HeartbeatLevel): OpeningRollState {
  return shouldUseOpeningRoll(level)
    ? { ready: false, rolls: null, winner: null, tied: false }
    : { ready: true, rolls: null, winner: null, tied: false }
}

export function createOpeningRollSummary(openingRoll: OpeningRollState, playerNames: Record<PlayerKey, string>): string {
  if (!openingRoll.rolls) return '比大小不移动、不抽卡、不计步。'

  const scoreText = `${playerNames.A} ${openingRoll.rolls.A} · ${playerNames.B} ${openingRoll.rolls.B}`
  if (openingRoll.tied) return `${scoreText}，平局，再比一次。`
  if (openingRoll.winner) return `${scoreText}，${playerNames[openingRoll.winner]}先手。`
  return scoreText
}

function getCellPrimaryMode(input: HeartbeatCardDrawInput): HeartTuneMode | null {
  if (input.forcedMode) return input.forcedMode

  switch (input.cellType) {
    case 'rest':
    case 'choice':
    case 'reward':
      return null
    case 'penalty':
      return 'directed'
    case 'close':
      return 'duo'
    case 'advance':
      return 'scene'
    default:
      return 'directed'
  }
}

function getCellLeadPlayer(input: HeartbeatCardDrawInput, mode: HeartTuneMode | null): PlayerKey {
  if (input.cellType === 'reverse') return input.partner
  if (input.cellType === 'penalty' && mode === 'response') return input.partner
  return input.roller
}

function getCellResponsePlayer(input: HeartbeatCardDrawInput, mode: HeartTuneMode | null, leadPlayer: PlayerKey): PlayerKey | null {
  if (mode !== 'response') return input.cellType === 'penalty' ? input.roller : null
  if (input.cellType === 'penalty') return input.roller
  return leadPlayer === 'A' ? 'B' : 'A'
}

function getMilestoneLeadPlayer(input: HeartbeatMilestoneDrawInput, mode: HeartTuneMode): PlayerKey {
  if (input.type === 'shared') return input.triggerPlayer
  const follower = input.follower ?? (input.triggerPlayer === 'A' ? 'B' : 'A')
  if (mode === 'response') return input.triggerPlayer
  return follower
}

function drawHeartbeatMaterial(stage: HeartTuneStage, mode: HeartTuneMode, leadPlayer: PlayerKey): { material?: HeartTuneMaterial, fallbackMaterial?: InteractionMaterial } {
  try {
    return { material: drawMaterialForLead(stage, mode, leadPlayer, []) }
  } catch {
    const fallbackLevel = getHeartbeatLevelByStage(stage)
    return { fallbackMaterial: getRandomMaterial({ level: fallbackLevel }) }
  }
}

function getHeartbeatLevelByStage(stage: HeartTuneStage): HeartbeatLevel {
  const entry = Object.entries(heartbeatStageMap).find(([, value]) => value === stage)
  return (entry?.[0] ?? 'beginner') as HeartbeatLevel
}

function createHeartbeatRoleSummary(
  cellType: HeartbeatCell['type'],
  mode: HeartTuneMode | null,
  roller: PlayerKey,
  leadPlayer: PlayerKey,
  responsePlayer: PlayerKey | null,
  shared: boolean,
): string {
  if (cellType === 'rest') return '休息格：本回合不抽任务。'
  if (cellType === 'choice') return '选择格：掷骰者先决定正常、降档或换主导。'
  if (cellType === 'reward') return '奖励格：掷骰者先选择主动、回应、双人或场景。'
  if (shared) return '共同执行：两人一起完成这张卡。'
  if (cellType === 'penalty' && mode === 'response' && responsePlayer) return `${roller} 踩到惩罚：${leadPlayer} 发起要求，${responsePlayer} 必须回应。`
  if (cellType === 'penalty') return `${roller} 踩到惩罚：${leadPlayer} 主动完成，并追加惩罚条件。`
  if (mode === 'response' && responsePlayer) return `${leadPlayer} 发起要求，${responsePlayer} 回应。`
  return `${leadPlayer} 主导，对方配合。`
}

function createHeartbeatMilestoneRoleSummary(
  _input: HeartbeatMilestoneDrawInput,
  mode: HeartTuneMode,
  leadPlayer: PlayerKey,
  responsePlayer: PlayerKey | null,
  shared: boolean,
): string {
  if (shared) return '共同里程碑：两人一起完成这张共同任务。'
  if (mode === 'response' && responsePlayer) return `个人里程碑：${leadPlayer} 发起要求，${responsePlayer} 作为落后方回应。`
  return `个人里程碑：${leadPlayer} 作为落后方主动获得一次任务机会。`
}

function resolveHeartbeatCell(
  cell: HeartbeatCell,
  player: PlayerKey,
  partner: PlayerKey,
  roll: number,
  position: number,
  level: HeartbeatLevel,
  positions: Record<PlayerKey, number>,
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
  const drawInput: HeartbeatCardDrawInput = {
    cellType: cell.type,
    level,
    roller: player,
    partner,
    positions,
  }

  if (cell.type === 'rest') {
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw(drawInput),
      effect: '休息格：这一格不抽卡，自然缓一缓。想继续就直接再掷骰。',
    }
  }

  if (cell.type === 'choice') {
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw(drawInput),
      effect: pickRandom(heartbeatChoices),
      choicePending: true,
    }
  }

  if (cell.type === 'reward') {
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw(drawInput),
      effect: pickRandom(heartbeatRewards),
      rewardPending: true,
    }
  }

  if (cell.type === 'penalty') {
    const mode = pickRandom(personalEventModes)
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw({ ...drawInput, forcedMode: mode }),
      addon: pickRandom(heartbeatPenalties),
    }
  }

  if (cell.type === 'boost') {
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw(drawInput),
      addon: pickRandom(heartbeatBoosts),
    }
  }

  if (cell.type === 'reverse') {
    return {
      ...baseResult,
      player: partner,
      partner: player,
      draw: createHeartbeatCellDraw(drawInput),
      effect: '反转格：本回合由对方获得主导权。',
    }
  }

  if (cell.type === 'double') {
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw(drawInput),
      effect: '双抽格：抽一张主动卡和一张回应卡，掷骰者现场二选一。',
    }
  }

  if (cell.type === 'reroll') {
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw(drawInput),
      retainTurn: true,
      addon: '再掷格：派发这张后，当前玩家保留回合，可以立刻再掷一次。',
    }
  }

  if (cell.type === 'close') {
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw(drawInput),
      effect: '贴近格：走得更远的一方回到另一方附近，再完成这一张靠近任务。',
    }
  }

  if (cell.type === 'advance') {
    return {
      ...baseResult,
      draw: createHeartbeatCellDraw(drawInput),
      effect: '前进格：两个人一起向前推进 1 步，心跳旅程更快到达奖励点。',
    }
  }

  return {
    ...baseResult,
    draw: createHeartbeatCellDraw(drawInput),
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
  const partner = rollingPlayer === 'A' ? 'B' : 'A'
  const playersByPriority: readonly PlayerKey[] = [rollingPlayer, partner]

  for (const player of playersByPriority) {
    const milestone = getNextHeartbeatPersonalMilestone(claimedPersonalMilestones[player])

    if (previousPositions[player] < milestone.steps && nextPositions[player] >= milestone.steps) {
      const follower = player === 'A' ? 'B' : 'A'
      const mode = personalEventModes[Math.floor(Math.random() * personalEventModes.length)]
      return {
        type: 'personal',
        milestone,
        player,
        follower,
        draw: createHeartbeatMilestoneDraw({
          type: 'personal',
          level,
          triggerPlayer: player,
          follower,
          forcedMode: mode,
        }),
      }
    }
  }

  const previousSharedSteps = previousPositions.A + previousPositions.B
  const nextSharedSteps = nextPositions.A + nextPositions.B
  const sharedMilestone = getNextHeartbeatSharedMilestone(claimedSharedMilestones)

  if (!(previousSharedSteps < sharedMilestone.steps && nextSharedSteps >= sharedMilestone.steps)) return undefined

  const mode = sharedEventModes[Math.floor(Math.random() * sharedEventModes.length)]
  return {
    type: 'shared',
    milestone: sharedMilestone,
    draw: createHeartbeatMilestoneDraw({
      type: 'shared',
      level,
      triggerPlayer: rollingPlayer,
      forcedMode: mode,
    }),
  }
}

function withProgressEvent(result: HeartbeatResult, progressEvent?: HeartbeatProgressEvent): HeartbeatResult {
  return {
    ...result,
    progressEvent,
  }
}

function resolveHeartbeatChoice(result: HeartbeatResult, choice: ChoiceAction, currentLevel: HeartbeatLevel): HeartbeatResult {
  const partner = result.player === 'A' ? 'B' : 'A'

  if (result.rewardPending && rewardChoiceModes.includes(choice as HeartTuneMode)) {
    const mode = choice as HeartTuneMode
    const draw = createHeartbeatCellDraw({
      cellType: result.cell.type,
      level: currentLevel,
      roller: result.player,
      partner,
      positions: { A: 0, B: 0 },
      forcedMode: mode,
    })

    return {
      ...result,
      draw,
      choicePending: false,
      rewardPending: false,
      effect: `奖励格：已选择${getHeartbeatModeLabel(mode)}，抽当前阶段任务卡。`,
    }
  }

  if (choice === 'lower') {
    const lowerLevel = getLowerHeartbeatLevel(currentLevel)
    return {
      ...result,
      level: lowerLevel,
      choicePending: false,
      draw: createHeartbeatCellDraw({
        cellType: result.cell.type,
        level: currentLevel,
        levelOverride: lowerLevel,
        roller: result.player,
        partner,
        positions: { A: 0, B: 0 },
        forcedMode: 'directed',
      }),
      effect: '选择格：已选择降低一档，抽一张更柔和的任务卡。',
    }
  }

  if (choice === 'swap') {
    const swappedPlayer = result.partner
    const swappedPartner = result.player
    return {
      ...result,
      player: swappedPlayer,
      partner: swappedPartner,
      choicePending: false,
      draw: createHeartbeatCellDraw({
        cellType: result.cell.type,
        level: currentLevel,
        roller: swappedPlayer,
        partner: swappedPartner,
        positions: { A: 0, B: 0 },
        forcedMode: 'directed',
      }),
      effect: '选择格：已交换主导，本回合由伴侣来带节奏。',
    }
  }

  return {
    ...result,
    choicePending: false,
    draw: createHeartbeatCellDraw({
      cellType: result.cell.type,
      level: currentLevel,
      roller: result.player,
      partner,
      positions: { A: 0, B: 0 },
      forcedMode: 'directed',
    }),
    effect: '选择格：已选择正常执行，抽当前阶段任务卡。',
  }
}

function getHeartbeatModeLabel(mode: HeartTuneMode): string {
  const labels: Record<HeartTuneMode, string> = {
    directed: '主动卡',
    response: '回应卡',
    duo: '双人卡',
    scene: '场景卡',
  }
  return labels[mode]
}

function getPlayerRoleLabel(player: PlayerKey): string {
  return player === 'A' ? '大大怪' : '小怪兽'
}

function createCompactTaskMeta(draw: HeartbeatCardDraw, playerNames: Record<PlayerKey, string>, label?: string): string {
  const cellLabel = label ?? heartbeatCellMeta[drawCellTypeForMeta(draw)].label
  const modeLabel = draw.primaryMode ? getHeartbeatModeLabel(draw.primaryMode) : '任务卡'
  const roleLabel = getCompactRoleLabel(draw, playerNames)
  return [cellLabel, modeLabel, roleLabel].filter(Boolean).join(' · ')
}

function drawCellTypeForMeta(draw: HeartbeatCardDraw): HeartbeatCell['type'] {
  if (draw.cellType) return draw.cellType
  if (draw.primaryMode === 'duo') return 'close'
  if (draw.primaryMode === 'scene') return 'advance'
  return 'normal'
}

function getCompactRoleLabel(draw: HeartbeatCardDraw, playerNames: Record<PlayerKey, string>): string {
  if (draw.shared) return '共同执行'
  if (draw.primaryMode === 'response' && draw.responsePlayer) {
    return `${getShortPlayerLabel(draw.leadPlayer, playerNames)}发起 / ${getShortPlayerLabel(draw.responsePlayer, playerNames)}回应`
  }
  return `${getShortPlayerLabel(draw.leadPlayer, playerNames)}主导`
}

function getShortPlayerLabel(player: PlayerKey, playerNames: Record<PlayerKey, string>): string {
  return playerNames[player] || getPlayerRoleLabel(player)
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

function ResultPanel({ phase, result, currentPlayer, playerNames, openingRoll, useOpeningRoll, onChoice }: { phase: TurnPhase, result: HeartbeatResult | null, currentPlayer: PlayerKey, playerNames: Record<PlayerKey, string>, openingRoll: OpeningRollState, useOpeningRoll: boolean, onChoice: (choice: ChoiceAction) => void }) {
  if (phase === 'rolling') {
    return <p className="text-center text-sm font-black leading-relaxed text-text-primary">骰子滚动中...</p>
  }

  if (phase === 'moving') {
    return <p className="text-center text-sm font-black leading-relaxed text-text-primary">棋子前进中...</p>
  }

  if (phase === 'revealing') {
    return <p className="text-center text-sm font-black leading-relaxed text-text-primary">任务卡出现中...</p>
  }

  if (useOpeningRoll && !openingRoll.ready) {
    return (
      <div className="space-y-2 text-center">
        <p className="text-sm font-black leading-relaxed text-text-primary">先比大小决定谁先投掷。</p>
        <p className="text-xs font-semibold leading-relaxed text-text-muted">{createOpeningRollSummary(openingRoll, playerNames)}</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="space-y-1 text-center">
        {useOpeningRoll && openingRoll.rolls ? <p className="text-xs font-semibold leading-relaxed text-warm-500">{createOpeningRollSummary(openingRoll, playerNames)}</p> : null}
        <p className="text-sm font-semibold leading-relaxed text-text-muted">{playerNames[currentPlayer]} 点击掷骰开始。</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold leading-tight text-warm-400">{playerNames[result.player]} 掷出 {result.roll}</p>
      {result.progressEvent ? <ProgressEventCard event={result.progressEvent} playerNames={playerNames} /> : null}
      {!result.progressEvent && result.choicePending ? (
        result.rewardPending ? (
          <div className="grid grid-cols-4 gap-1.5">
            {rewardChoiceModes.map(mode => (
              <button key={mode} type="button" onClick={() => onChoice(mode)} className="min-h-[38px] rounded-2xl bg-white px-1 text-[11px] font-black text-pink-600 ring-1 ring-pink-100">
                {getHeartbeatModeLabel(mode).replace('卡', '')}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" onClick={() => onChoice('normal')} className="min-h-[38px] rounded-2xl bg-warm-500 px-2 text-xs font-black text-white">正常</button>
            <button type="button" onClick={() => onChoice('lower')} className="min-h-[38px] rounded-2xl bg-white px-2 text-xs font-black text-warm-600 ring-1 ring-warm-100">降档</button>
            <button type="button" onClick={() => onChoice('swap')} className="min-h-[38px] rounded-2xl bg-white px-2 text-xs font-black text-pink-600 ring-1 ring-pink-100">换主导</button>
          </div>
        )
      ) : null}
      {!result.progressEvent && result.draw ? <HeartbeatDrawCard draw={result.draw} playerNames={playerNames} addon={result.addon} /> : null}
      {!result.progressEvent && (result.draw?.secondMaterial || result.draw?.secondFallbackMaterial) ? <HeartbeatDrawCard draw={createSecondHeartbeatDraw(result.draw)} playerNames={playerNames} label="备选" muted /> : null}
    </div>
  )
}

function ProgressEventCard({ event, playerNames }: { event: HeartbeatProgressEvent, playerNames: Record<PlayerKey, string> }) {
  return (
    <div className="rounded-3xl border border-pink-100 bg-pink-50/60 p-2.5">
      <HeartbeatDrawCard draw={event.draw} playerNames={playerNames} label={`${event.type === 'personal' ? '竞争触发' : '共同触发'} · ${event.milestone.label}`} />
    </div>
  )
}

function HeartbeatDrawCard({ draw, playerNames, label, muted = false, addon }: { draw: HeartbeatCardDraw, playerNames: Record<PlayerKey, string>, label?: string, muted?: boolean, addon?: string }) {
  if (!draw.material) {
    if (draw.primaryMode === null) {
      return (
        <div className={`rounded-3xl border p-3 ${muted ? 'border-pink-100 bg-pink-50/60' : 'border-warm-100 bg-white/90'}`}>
          <p className="truncate text-[10px] font-bold leading-tight text-pink-400">{createCompactTaskMeta(draw, playerNames, label)}</p>
          <p className="mt-2 text-base font-black leading-relaxed text-text-primary">这一格不抽任务，自然缓一缓。</p>
        </div>
      )
    }
    return draw.fallbackMaterial ? <MaterialCard material={draw.fallbackMaterial} label={label ?? '备用旧素材'} muted={muted} /> : null
  }

  const renderedCard = renderHeartTuneCard(
    draw.material,
    draw.leadPlayer,
    playerNames,
    '',
    false,
    '',
  )
  const metaText = createCompactTaskMeta(draw, playerNames, label)

  return (
    <div className={`rounded-3xl border p-3 ${muted ? 'border-pink-100 bg-pink-50/60' : 'border-warm-100 bg-white/90'}`}>
      <p className="truncate text-[10px] font-bold leading-tight text-pink-400">{metaText}</p>
      <p className="mt-2 text-base font-black leading-relaxed text-text-primary">{renderedCard.text}</p>
      {addon ? <p className="mt-2 text-[11px] font-semibold leading-relaxed text-pink-500">附加条件：{addon}</p> : null}
    </div>
  )
}

function createSecondHeartbeatDraw(draw: HeartbeatCardDraw): HeartbeatCardDraw {
  const mode = draw.secondMode ?? 'response'
  const responsePlayer = mode === 'response' ? draw.triggerPlayer : null

  return {
    ...draw,
    primaryMode: mode,
    secondMode: undefined,
    material: draw.secondMaterial,
    secondMaterial: undefined,
    fallbackMaterial: draw.secondFallbackMaterial,
    secondFallbackMaterial: undefined,
    leadPlayer: mode === 'response' ? (draw.triggerPlayer === 'A' ? 'B' : 'A') : draw.leadPlayer,
    responsePlayer,
    shared: mode === 'duo' || mode === 'scene',
    roleSummary: mode === 'response'
      ? `${draw.triggerPlayer === 'A' ? 'B' : 'A'} 发起要求，${draw.triggerPlayer} 回应。`
      : draw.roleSummary,
  }
}

function MaterialCard({ material, label, muted = false }: { material: InteractionMaterial, label?: string, muted?: boolean }) {
  return (
    <div className={`rounded-3xl border p-3 ${muted ? 'border-pink-100 bg-pink-50/70' : 'border-warm-100 bg-white/90'}`}>
      {label ? <p className="mb-2 text-[10px] font-black text-pink-500">{label}</p> : null}
      <p className="text-base font-black leading-relaxed text-text-primary">{material.content}</p>
    </div>
  )
}
