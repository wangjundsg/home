import { createIdentityAssignment } from './identity'
import { createTargetZone, getGateProfile } from './meter'
import { judgeGateResult } from './result'
import { advanceRouteOnce, createRouteState, getGateType } from './route'
import { selectChallengeMaterial } from './materials'
import { renderChallengeTemplate } from './template'
import type { GateProfile, GateResult, IdentityAssignment, LocksByPlayer, PlayerKey, PlayerLock, RenderedTask, RouteState, StageKey, TargetZone } from './types'

export type ChallengeScreenState = 'gate-ready' | 'locking' | 'reveal' | 'task' | 'ending'

export interface ChallengeSessionState {
  screenState: ChallengeScreenState
  routeState: RouteState | null
  targetZone: TargetZone | null
  gateProfile: GateProfile | null
  locksByPlayer: LocksByPlayer
  gateResult: GateResult | null
  identityAssignment: IdentityAssignment | null
  renderedTask: RenderedTask | null
  error: string | null
}

export interface ChallengePlayerLabels {
  A: string
  B: string
}

export type ChallengeSessionAction =
  | { type: 'select-stage'; stageKey: StageKey }
  | { type: 'start-gate' }
  | { type: 'lock'; playerKey: PlayerKey; value: number; playerLabels: ChallengePlayerLabels }
  | { type: 'continue' }
  | { type: 'restart' }

const initialLocks: LocksByPlayer = { A: null, B: null }

export const initialChallengeSessionState: ChallengeSessionState = prepareGate(createRouteState('beginner'))

export function challengeSessionReducer(state: ChallengeSessionState, action: ChallengeSessionAction): ChallengeSessionState {
  if (action.type === 'restart') {
    return initialChallengeSessionState
  }

  if (action.type === 'select-stage') {
    return prepareGate(createRouteState(action.stageKey))
  }

  if (!state.routeState || state.routeState.routeEnded) {
    return state
  }

  if (action.type === 'start-gate') {
    return {
      ...state,
      screenState: 'locking',
      error: null,
    }
  }

  if (action.type === 'lock') {
    if (state.screenState !== 'locking' || !state.targetZone) {
      return state
    }

    const locksByPlayer = {
      ...state.locksByPlayer,
      [action.playerKey]: action.value,
    }

    if (locksByPlayer.A === null || locksByPlayer.B === null) {
      return {
        ...state,
        locksByPlayer,
        error: null,
      }
    }

    const locks: PlayerLock[] = [
      { playerKey: 'A', value: locksByPlayer.A },
      { playerKey: 'B', value: locksByPlayer.B },
    ]
    const gateResult = judgeGateResult(state.routeState.gateId, state.targetZone, locks)
    const identity = createIdentityAssignment(gateResult, action.playerLabels)
    const material = selectChallengeMaterial(state.routeState.stageKey, identity.taskMode, state.routeState.gateId)

    if (!material) {
      return {
        ...state,
        screenState: 'reveal',
        locksByPlayer,
        gateResult,
        identityAssignment: identity,
        renderedTask: null,
        error: '当前阶段的任务素材暂时不够，请换一个阶段再试。',
      }
    }

    const rendered = renderChallengeTemplate(material, identity)

    if (!rendered.ok || !rendered.task) {
      return {
        ...state,
        screenState: 'reveal',
        locksByPlayer,
        gateResult,
        identityAssignment: identity,
        renderedTask: null,
        error: rendered.errors[0] || '任务渲染失败，请再试一次。',
      }
    }

    return {
      ...state,
      screenState: 'task',
      locksByPlayer,
      gateResult,
      identityAssignment: identity,
      renderedTask: rendered.task,
      error: null,
    }
  }

  if (action.type === 'continue') {
    if (!state.renderedTask) {
      return state
    }

    const nextRouteState = advanceRouteOnce(state.routeState, state.routeState.gateId)

    if (nextRouteState.routeEnded) {
      return {
        ...state,
        screenState: 'ending',
        routeState: nextRouteState,
        targetZone: null,
        gateProfile: null,
        locksByPlayer: initialLocks,
      }
    }

    return prepareGate(nextRouteState)
  }

  return state
}

function prepareGate(routeState: RouteState): ChallengeSessionState {
  const gateType = getGateType(routeState.stageKey, routeState.gateIndex)
  const gateProfile = getGateProfile(routeState.stageKey, routeState.gateIndex, gateType)
  const targetZone = createTargetZone(gateProfile)

  return {
    screenState: 'gate-ready',
    routeState,
    targetZone,
    gateProfile,
    locksByPlayer: initialLocks,
    gateResult: null,
    identityAssignment: null,
    renderedTask: null,
    error: null,
  }
}
