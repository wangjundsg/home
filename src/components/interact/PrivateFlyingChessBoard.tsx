import { useEffect, useMemo, useRef, useState } from 'react'
import { Dice5 } from 'lucide-react'
import {
  ensureHeartbeatBoard,
  generateHeartbeatSegment,
  getLowerHeartbeatLevel,
  heartbeatBoosts,
  heartbeatCellMeta,
  heartbeatChoices,
  heartbeatPenalties,
  heartbeatRewards,
  type HeartbeatCell,
  type HeartbeatLevel,
} from '../../data/private-flying-chess'
import { getRandomMaterial, type InteractionMaterial } from '../../data/interact-materials'

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
}

type TurnPhase = 'idle' | 'rolling' | 'moving' | 'revealing'

type PlayerKey = 'A' | 'B'

const MAP_COLUMNS = 5
const MAP_ROWS = 5
const VISIBLE_CELL_COUNT = MAP_COLUMNS * MAP_ROWS
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const

const pickRandom = (items: readonly string[]) => items[Math.floor(Math.random() * items.length)]

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
  const timersRef = useRef<number[]>([])
  const runIdRef = useRef(0)

  const activeTaskPlayer = result && result.cell.type === 'reverse' ? result.player : currentPlayer
  const playerNames = useMemo(() => ({ A: playerAName, B: playerBName }), [playerAName, playerBName])
  const activeMapPosition = movingPlayer ? displayPositions[movingPlayer] : Math.max(displayPositions.A, displayPositions.B)
  const visibleStart = animationWindowStart ?? Math.max(0, activeMapPosition - 12)

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
    const resolved = resolveHeartbeatCell(cell, rollingPlayer, partner, roll, nextPosition, level)
    const fixedWindowStart = Math.max(0, startPosition - 8)

    setBoard(nextBoard)
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

    setPositions(prev => ({ ...prev, [rollingPlayer]: nextPosition }))
    setResult(resolved)
    setPhase('revealing')

    await wait(420)
    if (runIdRef.current !== runId) return

    setCurrentPlayer(partner)
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
    <div className="flex flex-col gap-3">
      <section className="pixel-card private-flying-player-strip px-3 py-1">
        <div className="grid h-full grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center gap-5">
          <PlayerStatusCard player="A" name={playerNames.A} active={activeTaskPlayer === 'A'} />
          <DiceWidget value={dicePreview} phase={phase} />
          <PlayerStatusCard player="B" name={playerNames.B} active={activeTaskPlayer === 'B'} />
        </div>
      </section>

      <section className="pixel-card p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-black text-warm-500">心跳地图</p>
          <div className="rounded-full bg-warm-100 px-3 py-1 text-xs font-black text-warm-600">
            A {displayPositions.A + 1} / B {displayPositions.B + 1}
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
        <ResultPanel phase={phase} result={result} currentPlayer={currentPlayer} playerNames={playerNames} />
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
): HeartbeatResult {
  const baseResult: HeartbeatResult = {
    player,
    partner,
    roll,
    position,
    cell,
    level,
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
      addon: '再掷格：派发这张后，当前玩家可以立刻再掷一次。',
    }
  }

  return {
    ...baseResult,
    material: getRandomMaterial({ level }),
  }
}

function DiceWidget({ value, phase }: { value: number, phase: TurnPhase }) {
  const rolling = phase === 'rolling'

  return (
    <div className={`mx-auto flex h-[38px] w-[38px] -translate-y-0.5 items-center justify-center rounded-2xl bg-warm-500 text-2xl font-black text-white shadow-sm transition-all duration-150 ${rolling ? 'scale-105 rotate-6' : 'scale-100 rotate-0'}`}>
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
    <div className={`flex min-w-0 flex-col px-1 py-0.5 ${alignClass}`}>
      <p className={`text-[9px] font-black ${active ? activeColor : labelColor}`}>{player}</p>
      <p className={`mt-0.5 max-w-full truncate text-[13px] font-black leading-tight ${active ? activeColor : 'text-text-primary'}`}>{name}</p>
    </div>
  )
}

function ResultPanel({ phase, result, currentPlayer, playerNames }: { phase: TurnPhase, result: HeartbeatResult | null, currentPlayer: PlayerKey, playerNames: Record<PlayerKey, string> }) {
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
      {result.effect ? (
        <p className="rounded-2xl bg-warm-50 px-3 py-2 text-sm font-semibold leading-relaxed text-text-secondary">{result.effect}</p>
      ) : null}
      {result.material ? <MaterialCard material={result.material} /> : null}
      {result.secondMaterial ? <MaterialCard material={result.secondMaterial} label="备选" muted /> : null}
      {result.addon ? (
        <p className="rounded-2xl bg-pink-50 px-3 py-2 text-sm font-semibold leading-relaxed text-pink-700">{result.addon}</p>
      ) : null}
    </div>
  )
}

function MaterialCard({ material, label, muted = false }: { material: InteractionMaterial, label?: string, muted?: boolean }) {
  return (
    <div className={`rounded-3xl border p-3 ${muted ? 'border-pink-100 bg-pink-50/70' : 'border-warm-100 bg-white/90'}`}>
      {label ? <p className="mb-2 text-[10px] font-black text-pink-500">{label}</p> : null}
      <p className="text-base font-black leading-relaxed text-text-primary">{material.content}</p>
    </div>
  )
}
