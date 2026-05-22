import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ChallengeHeartMeter } from '../components/interact/two-player-challenge/ChallengeHeartMeter'
import { ChallengeProgressHeader } from '../components/interact/two-player-challenge/ChallengeProgressHeader'
import { ChallengeResultReveal } from '../components/interact/two-player-challenge/ChallengeResultReveal'
import { ChallengeStagePicker } from '../components/interact/two-player-challenge/ChallengeStagePicker'
import { ChallengeTaskCard } from '../components/interact/two-player-challenge/ChallengeTaskCard'
import { challengeSessionReducer, getPointerValue, initialChallengeSessionState } from '../features/two-player-challenge'
import type { PlayerKey } from '../features/two-player-challenge'

interface TwoPlayerChallengePageProps {
  identity?: string | null
  partnerName?: string | null
  navigate: (route: string) => void
}

export function TwoPlayerChallengePage({ identity, partnerName }: TwoPlayerChallengePageProps) {
  const [state, dispatch] = useReducer(challengeSessionReducer, initialChallengeSessionState)
  const [pointerValue, setPointerValue] = useState(50)
  const startedAtRef = useRef<number | null>(null)
  const playerLabels = useMemo<Record<PlayerKey, string>>(() => ({
    A: identity || '大大怪',
    B: partnerName || '小怪兽',
  }), [identity, partnerName])

  useEffect(() => {
    if (state.screenState !== 'locking' || !state.gateProfile) {
      startedAtRef.current = null
      return
    }

    startedAtRef.current = performance.now()
    let animationFrame = 0
    const speed = state.gateProfile.speed

    const tick = (time: number) => {
      const startedAt = startedAtRef.current ?? time
      const elapsedSeconds = (time - startedAt) / 1000
      setPointerValue(getPointerValue(elapsedSeconds, speed))
      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(animationFrame)
  }, [state.screenState, state.gateProfile])

  const routeState = state.routeState

  const handleContinue = () => {
    dispatch({ type: 'continue' })
    window.setTimeout(() => dispatch({ type: 'start-gate' }), 0)
  }

  return (
    <div className="pixel-page flex min-h-full flex-col gap-3 px-4 pt-3 pb-8">
      {routeState && state.screenState !== 'ending' ? (
        <>
          <ChallengeStagePicker currentStageKey={routeState.stageKey} onSelectStage={stageKey => dispatch({ type: 'select-stage', stageKey })} />
          <ChallengeProgressHeader routeState={routeState} gateProfile={state.gateProfile} />
          {state.targetZone ? (
            <ChallengeHeartMeter
              pointerValue={pointerValue}
              targetZone={state.targetZone}
              locksByPlayer={state.locksByPlayer}
              canLock={state.screenState === 'locking'}
              playerLabels={playerLabels}
              onLock={playerKey => dispatch({ type: 'lock', playerKey, value: pointerValue, playerLabels })}
            />
          ) : null}
          {state.screenState === 'gate-ready' ? (
            <button
              type="button"
              onClick={() => dispatch({ type: 'start-gate' })}
              className="min-h-[52px] rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white shadow-sm active:scale-[0.99]"
            >
              开始同步
            </button>
          ) : null}
          <ChallengeResultReveal gateResult={state.gateResult} />
          <ChallengeTaskCard task={state.renderedTask} error={state.error} onContinue={handleContinue} />
        </>
      ) : null}

      {state.screenState === 'ending' ? (
        <section className="pixel-card p-6 text-center">
          <p className="text-4xl">♡</p>
          <h2 className="mt-3 text-xl font-black text-text-primary">从初级到最终都完成了</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">现在把手机放下，继续留在彼此身边。</p>
          <button
            type="button"
            onClick={() => dispatch({ type: 'restart' })}
            className="mt-5 min-h-[48px] w-full rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99]"
          >
            重新从初级开始
          </button>
        </section>
      ) : null}
    </div>
  )
}
