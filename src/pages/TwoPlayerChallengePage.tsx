import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ChallengeMechanicPanel } from '../components/interact/two-player-challenge/ChallengeMechanicPanel'
import { ChallengeProgressHeader } from '../components/interact/two-player-challenge/ChallengeProgressHeader'
import { ChallengeResultReveal } from '../components/interact/two-player-challenge/ChallengeResultReveal'
import { ChallengeTaskCard } from '../components/interact/two-player-challenge/ChallengeTaskCard'
import { challengeSessionReducer, createInitialState, getPointerValue } from '../features/two-player-challenge'
import type { LocksByPlayer, PlayerKey, TargetZone } from '../features/two-player-challenge'

interface TwoPlayerChallengePageProps {
  identity?: string | null
  partnerName?: string | null
  navigate: (route: string) => void
}

interface ChoiceOption {
  id: string
  label: string
}

interface PlayerRhythmState {
  A: number
  B: number
}

const choiceOptionSets: ChoiceOption[][] = [
  [
    { id: 'A', label: '靠近' },
    { id: 'B', label: '停顿' },
    { id: 'C', label: '回应' },
  ],
  [
    { id: 'A', label: '轻一点' },
    { id: 'B', label: '慢一点' },
    { id: 'C', label: '再近点' },
  ],
]

const initialChoiceSelections: Record<PlayerKey, string | null> = { A: null, B: null }
const initialRhythmHits: PlayerRhythmState = { A: 0, B: 0 }
const initialLocalLocks: LocksByPlayer = { A: null, B: null }
const baseTargetZone: TargetZone = { low: 38, high: 62, center: 50, width: 24 }

export function TwoPlayerChallengePage({ identity, partnerName }: TwoPlayerChallengePageProps) {
  const playerLabels = useMemo<Record<PlayerKey, string>>(() => ({
    A: identity || '大大怪',
    B: partnerName || '小怪兽',
  }), [identity, partnerName])
  const [state, dispatch] = useReducer(challengeSessionReducer, playerLabels, createInitialState)
  const [pointerValue, setPointerValue] = useState(50)
  const [activeTarget, setActiveTarget] = useState<{ key: string; zone: TargetZone } | null>(null)
  const [blockedState, setBlockedState] = useState<{ key: string; blocked: boolean }>({ key: '', blocked: false })
  const [reactionLockState, setReactionLockState] = useState<{ key: string; locks: LocksByPlayer }>({
    key: '',
    locks: initialLocalLocks,
  })
  const [rhythmState, setRhythmState] = useState<{ key: string; hits: PlayerRhythmState }>({ key: '', hits: initialRhythmHits })
  const [choiceState, setChoiceState] = useState<{ key: string; selections: Record<PlayerKey, string | null> }>({
    key: '',
    selections: initialChoiceSelections,
  })
  const [turnState, setTurnState] = useState<{ key: string; activePlayer: PlayerKey; handoffVisible: boolean }>({
    key: '',
    activePlayer: 'A',
    handoffVisible: false,
  })
  const startedAtRef = useRef<number | null>(null)

  const roundResetKey = getRoundResetKey(state)
  const choiceOptions = choiceOptionSets[state.roundState.roundIndex % choiceOptionSets.length]
  const rhythmRequiredHits = Math.min(4, 2 + Math.max(0, state.roundState.difficulty - 2))
  const rhythmHits = rhythmState.key === roundResetKey ? rhythmState.hits : initialRhythmHits
  const reactionLocks = reactionLockState.key === roundResetKey ? reactionLockState.locks : initialLocalLocks
  const visibleLocksByPlayer = state.roundState.mechanicType === 'reaction-stop' ? reactionLocks : state.locksByPlayer
  const choiceSelections = choiceState.key === roundResetKey ? choiceState.selections : initialChoiceSelections
  const activeTargetZone = activeTarget?.key === roundResetKey ? activeTarget.zone : null
  const isBlocked = blockedState.key === roundResetKey ? blockedState.blocked : false
  const activePlayer = turnState.key === roundResetKey ? turnState.activePlayer : 'A'
  const handoffVisible = turnState.key === roundResetKey ? turnState.handoffVisible : false

  useEffect(() => {
    if (state.screenState !== 'challenge-running' || !state.gateProfile || !state.targetZone) {
      startedAtRef.current = null
      return
    }

    startedAtRef.current = performance.now()
    let animationFrame = 0
    const speed = state.gateProfile.speed * getSpeedBoost(state.roundState.difficulty)
    const baseZone = state.targetZone

    const tick = (time: number) => {
      const startedAt = startedAtRef.current ?? time
      const elapsedSeconds = (time - startedAt) / 1000
      const nextPointer = getPointerValue(elapsedSeconds, speed)
      const nextTarget = getMovingTargetZone(baseZone, elapsedSeconds, state.roundState.difficulty, state.roundState.mechanicType === 'boss-gate')
      setPointerValue(nextPointer)
      setActiveTarget({ key: roundResetKey, zone: nextTarget })
      setBlockedState({ key: roundResetKey, blocked: isInsideObstacle(nextPointer, nextTarget, state.roundState.difficulty) })
      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(animationFrame)
  }, [state.screenState, state.gateProfile, state.targetZone, state.roundState.difficulty, state.roundState.mechanicType, roundResetKey])

  return (
    <div className="pixel-page flex min-h-full flex-col gap-3 px-4 pt-3 pb-8">
      {state.screenState !== 'ending' ? (
        <>
          <ChallengeProgressHeader
            stageState={state.stageState}
            roundState={state.roundState}
            totalCompletedRounds={state.totalCompletedRounds}
            totalRoundCount={state.totalRoundCount}
            gateProfile={state.gateProfile}
          />

          {state.screenState === 'challenge-ready' || state.screenState === 'challenge-running' ? (
            <ChallengeMechanicPanel
              roundState={state.roundState}
              screenState={state.screenState}
              activePlayer={activePlayer}
              handoffVisible={handoffVisible}
              pointerValue={pointerValue}
              targetZone={activeTargetZone ?? state.targetZone}
              locksByPlayer={visibleLocksByPlayer}
              playerLabels={playerLabels}
              rhythmHits={rhythmHits}
              rhythmRequiredHits={rhythmRequiredHits}
              choiceOptions={choiceOptions}
              choiceSelections={choiceSelections}
              isBlocked={isBlocked}
              onStart={() => {
                setTurnState({ key: roundResetKey, activePlayer: 'A', handoffVisible: false })
                dispatch({ type: 'start-challenge' })
              }}
              onHandoffReady={() => setTurnState({ key: roundResetKey, activePlayer: 'B', handoffVisible: false })}
              onResolveReaction={() => {
                if (reactionLocks.A === null || reactionLocks.B === null) return
                dispatch({ type: 'resolve-reaction', locks: { A: reactionLocks.A, B: reactionLocks.B }, playerLabels })
              }}
              onChoice={choiceId => {
                setChoiceState(prev => ({
                  key: roundResetKey,
                  selections: {
                    ...(prev.key === roundResetKey ? prev.selections : initialChoiceSelections),
                    [activePlayer]: choiceId,
                  },
                }))
                if (activePlayer === 'A') {
                  setTurnState({ key: roundResetKey, activePlayer: 'A', handoffVisible: true })
                }
              }}
              onResolveChoice={() => {
                if (!choiceSelections.A || !choiceSelections.B) return
                dispatch({ type: 'resolve-choice', choices: { A: choiceSelections.A, B: choiceSelections.B }, playerLabels })
              }}
              onRhythmHit={() => {
                const currentHits = rhythmHits[activePlayer]
                const nextHits = Math.min(rhythmRequiredHits, currentHits + 1)
                setRhythmState(prev => ({
                  key: roundResetKey,
                  hits: {
                    ...(prev.key === roundResetKey ? prev.hits : initialRhythmHits),
                    [activePlayer]: nextHits,
                  },
                }))
                if (activePlayer === 'A' && nextHits >= rhythmRequiredHits) {
                  setTurnState({ key: roundResetKey, activePlayer: 'A', handoffVisible: true })
                }
              }}
              onResolveRhythm={() => dispatch({ type: 'resolve-rhythm', hits: rhythmHits, requiredHits: rhythmRequiredHits, playerLabels })}
              onLock={(value, blocked) => {
                if (state.roundState.mechanicType === 'reaction-stop') {
                  setReactionLockState(prev => ({
                    key: roundResetKey,
                    locks: {
                      ...(prev.key === roundResetKey ? prev.locks : initialLocalLocks),
                      [activePlayer]: value,
                    },
                  }))
                  if (activePlayer === 'A') {
                    setTurnState({ key: roundResetKey, activePlayer: 'A', handoffVisible: true })
                  }
                  return
                }

                dispatch({
                  type: 'lock',
                  playerKey: activePlayer,
                  value,
                  blocked,
                  targetZone: activeTargetZone ?? state.targetZone ?? baseTargetZone,
                  playerLabels,
                })
                if (activePlayer === 'A') {
                  setTurnState({ key: roundResetKey, activePlayer: 'A', handoffVisible: true })
                }
              }}
            />
          ) : null}

          <ChallengeResultReveal gateResult={state.gateResult} />

          {state.screenState === 'challenge-result' ? (
            <button
              type="button"
              onClick={() => dispatch({ type: 'open-result-task' })}
              className="min-h-[52px] rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white shadow-sm active:scale-[0.99]"
            >
              打开结果任务
            </button>
          ) : null}

          {state.screenState === 'result-task' ? (
            <ChallengeTaskCard
              task={state.renderedTask}
              error={state.error}
              onComplete={() => dispatch({ type: 'complete-result-task' })}
            />
          ) : null}

          {state.screenState === 'remedy-task' ? (
            <ChallengeTaskCard
              task={state.renderedTask}
              error={state.error}
              retryAfterRemedy={state.gateResult?.retryAfterRemedy ?? false}
              onComplete={() => dispatch({ type: 'complete-remedy-task' })}
            />
          ) : null}
        </>
      ) : null}

      {state.screenState === 'ending' ? (
        <section className="pixel-card p-6 text-center">
          <p className="text-4xl">♥</p>
          <h2 className="mt-3 text-xl font-black text-text-primary">四个阶段都闯完了</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">调情、前戏、深入和做爱都走完了。现在把手机放下，继续留在彼此身边。</p>
          <button
            type="button"
            onClick={() => dispatch({ type: 'restart', playerLabels })}
            className="mt-5 min-h-[48px] w-full rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99]"
          >
            重新开始一局
          </button>
        </section>
      ) : null}
    </div>
  )
}

function getSpeedBoost(difficulty: number): number {
  return 1 + Math.max(0, difficulty - 1) * 0.08
}

function getRoundResetKey(state: ReturnType<typeof createInitialState>): string {
  return `${state.roundState.stageKey}-${state.roundState.roundIndex}-${state.roundState.attempt}`
}

function getMovingTargetZone(baseZone: TargetZone, elapsedSeconds: number, difficulty: number, isBoss: boolean): TargetZone {
  const drift = isBoss || difficulty >= 4 ? Math.sin(elapsedSeconds * (0.8 + difficulty * 0.12)) * (4 + difficulty * 1.2) : 0
  const widthPressure = isBoss ? 1.5 : 1 + Math.max(0, difficulty - 2) * 0.08
  const width = Math.max(7, baseZone.width / widthPressure)
  const center = clamp(baseZone.center + drift, width / 2, 100 - width / 2)

  return {
    low: center - width / 2,
    high: center + width / 2,
    center,
    width,
  }
}

function isInsideObstacle(value: number, targetZone: TargetZone, difficulty: number): boolean {
  if (difficulty < 4) return false
  const obstacleWidth = Math.min(18, Math.max(10, targetZone.width * 0.65))
  const obstacleLow = Math.max(0, targetZone.low - 20)
  return value >= obstacleLow && value <= obstacleLow + obstacleWidth
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
