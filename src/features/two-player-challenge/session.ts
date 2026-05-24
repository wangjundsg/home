import { createIdentityAssignment } from './identity'
import { createTargetZone, getGateProfile } from './meter'
import { judgeGateResult } from './result'
import { selectChallengeMaterial } from './materials'
import { renderChallengeTemplate } from './template'
import {
  challengeMechanicLabels,
  intimacyStageLabels,
  intimacyStageMaterialMap,
  type ChallengeMechanicType,
  type ChallengeOutcomeKey,
  type GateProfile,
  type GateResult,
  type IdentityAssignment,
  type IntimacyStageKey,
  type LocksByPlayer,
  type PlayerKey,
  type PlayerLock,
  type RenderedTask,
  type TargetZone,
  type TaskMode,
} from './types'

export type ChallengePlayableScreenState = 'challenge-ready' | 'challenge-running' | 'challenge-result' | 'result-task' | 'remedy-task'
export type ChallengeScreenState = ChallengePlayableScreenState | 'challenge-paused' | 'ending' | 'session-ended'

export interface ChallengeRoundState {
  stageKey: IntimacyStageKey
  stageIndex: number
  roundIndex: number
  roundCount: number
  isBoss: boolean
  mechanicType: ChallengeMechanicType
  difficulty: number
  attempt: number
}

export interface ChallengeStageState {
  stageKey: IntimacyStageKey
  stageIndex: number
  completedRounds: number
  roundCount: number
}

export interface ChallengeSessionState {
  screenState: ChallengeScreenState
  stageState: ChallengeStageState
  roundState: ChallengeRoundState
  playerLabels: ChallengePlayerLabels
  totalCompletedRounds: number
  totalRoundCount: number
  targetZone: TargetZone | null
  gateProfile: GateProfile | null
  locksByPlayer: LocksByPlayer
  blockedByPlayer: Record<PlayerKey, boolean>
  gateResult: GateResult | null
  identityAssignment: IdentityAssignment | null
  renderedTask: RenderedTask | null
  pausedFromScreenState: ChallengePlayableScreenState | null
  error: string | null
}

export interface ChallengePlayerLabels {
  A: string
  B: string
}

export type ChallengeSessionAction =
  | { type: 'start-challenge' }
  | { type: 'resolve-reaction'; locks: Record<PlayerKey, number>; playerLabels: ChallengePlayerLabels }
  | { type: 'resolve-choice'; choices: Record<PlayerKey, string>; playerLabels: ChallengePlayerLabels }
  | { type: 'resolve-rhythm'; hits: Record<PlayerKey, number>; requiredHits: number; playerLabels: ChallengePlayerLabels }
  | { type: 'lock'; playerKey: PlayerKey; value: number; playerLabels: ChallengePlayerLabels; blocked?: boolean; targetZone?: TargetZone }
  | { type: 'open-result-task' }
  | { type: 'complete-result-task' }
  | { type: 'complete-remedy-task' }
  | { type: 'pause-challenge' }
  | { type: 'resume-challenge' }
  | { type: 'skip-round' }
  | { type: 'end-session' }
  | { type: 'restart'; playerLabels?: ChallengePlayerLabels }

export const INTIMACY_STAGE_ORDER: IntimacyStageKey[] = ['flirt', 'foreplay', 'deepening', 'sex']

export const CHALLENGE_STAGE_CONFIG: Record<IntimacyStageKey, {
  normalRounds: number
  normalMechanic: ChallengeMechanicType
  bossMechanic: ChallengeMechanicType
  baseDifficulty: number
  bossDifficulty: number
  retryBossOnFail: boolean
}> = {
  flirt: {
    normalRounds: 2,
    normalMechanic: 'reaction-stop',
    bossMechanic: 'boss-gate',
    baseDifficulty: 1,
    bossDifficulty: 2,
    retryBossOnFail: false,
  },
  foreplay: {
    normalRounds: 2,
    normalMechanic: 'choice-sync',
    bossMechanic: 'boss-gate',
    baseDifficulty: 2,
    bossDifficulty: 3,
    retryBossOnFail: false,
  },
  deepening: {
    normalRounds: 3,
    normalMechanic: 'rhythm-chain',
    bossMechanic: 'boss-gate',
    baseDifficulty: 3,
    bossDifficulty: 4,
    retryBossOnFail: true,
  },
  sex: {
    normalRounds: 3,
    normalMechanic: 'dynamic-gate',
    bossMechanic: 'boss-gate',
    baseDifficulty: 4,
    bossDifficulty: 5,
    retryBossOnFail: true,
  },
}

export const TOTAL_CHALLENGE_ROUNDS = INTIMACY_STAGE_ORDER.reduce((total, stageKey) => total + getRoundCount(stageKey), 0)

const initialLocks: LocksByPlayer = { A: null, B: null }
const initialBlocked: Record<PlayerKey, boolean> = { A: false, B: false }
const defaultLabels: ChallengePlayerLabels = { A: '大大怪', B: '小怪兽' }

export const initialChallengeSessionState: ChallengeSessionState = createInitialState(defaultLabels)

export function createInitialState(playerLabels: ChallengePlayerLabels = defaultLabels): ChallengeSessionState {
  return prepareRound(0, 0, 0, 0, playerLabels)
}

export function challengeSessionReducer(state: ChallengeSessionState, action: ChallengeSessionAction): ChallengeSessionState {
  if (action.type === 'restart') {
    return createInitialState(action.playerLabels ?? defaultLabels)
  }

  if (action.type === 'start-challenge') {
    if (state.screenState !== 'challenge-ready') return state
    return {
      ...state,
      screenState: 'challenge-running',
      locksByPlayer: initialLocks,
      gateResult: null,
      identityAssignment: null,
      renderedTask: null,
      error: null,
    }
  }

  if (action.type === 'pause-challenge') {
    if (!isPlayableScreenState(state.screenState)) return state
    return {
      ...state,
      screenState: 'challenge-paused',
      pausedFromScreenState: state.screenState,
    }
  }

  if (action.type === 'resume-challenge') {
    if (state.screenState !== 'challenge-paused') return state
    return {
      ...state,
      screenState: state.pausedFromScreenState ?? 'challenge-ready',
      pausedFromScreenState: null,
    }
  }

  if (action.type === 'skip-round') {
    if (state.screenState === 'ending' || state.screenState === 'session-ended') return state
    return advanceAfterRound(state)
  }

  if (action.type === 'end-session') {
    return {
      ...state,
      screenState: 'session-ended',
      targetZone: null,
      gateProfile: null,
      locksByPlayer: initialLocks,
      blockedByPlayer: initialBlocked,
      renderedTask: null,
      pausedFromScreenState: null,
      error: null,
    }
  }

  if (action.type === 'resolve-reaction') {
    if (state.screenState !== 'challenge-running' || state.roundState.mechanicType !== 'reaction-stop' || !state.targetZone) return state
    const valueA = clampChallengeValue(action.locks.A)
    const valueB = clampChallengeValue(action.locks.B)

    return settleGateLikeChallenge(state, [
      { playerKey: 'A', value: valueA },
      { playerKey: 'B', value: valueB },
    ], action.playerLabels, { locksByPlayer: { A: valueA, B: valueB } })
  }

  if (action.type === 'resolve-choice') {
    if (state.screenState !== 'challenge-running' || state.roundState.mechanicType !== 'choice-sync' || !state.targetZone) return state
    const matched = action.choices.A === action.choices.B
    const valueA = getChoiceValue(action.choices.A)
    const valueB = getChoiceValue(action.choices.B)
    const forcedOutcome: ChallengeOutcomeKey = matched ? 'success' : 'partial'

    return settleGateLikeChallenge(state, [
      { playerKey: 'A', value: valueA },
      { playerKey: 'B', value: valueB },
    ], action.playerLabels, { forcedOutcome })
  }

  if (action.type === 'resolve-rhythm') {
    if (state.screenState !== 'challenge-running' || state.roundState.mechanicType !== 'rhythm-chain' || !state.targetZone) return state
    const totalHits = action.hits.A + action.hits.B
    const totalRequiredHits = action.requiredHits * 2
    const hitRatio = totalRequiredHits <= 0 ? 0 : totalHits / totalRequiredHits
    const forcedOutcome: ChallengeOutcomeKey = hitRatio >= 1 ? 'success' : hitRatio >= 0.5 ? 'partial' : 'miss'
    const spread = hitRatio >= 1 ? 2 : hitRatio >= 0.5 ? state.targetZone.width + 4 : state.targetZone.width + 22

    return settleGateLikeChallenge(state, [
      { playerKey: 'A', value: state.targetZone.center - spread / 2 },
      { playerKey: 'B', value: state.targetZone.center + spread / 2 },
    ], action.playerLabels, { forcedOutcome })
  }

  if (action.type === 'lock') {
    if (state.screenState !== 'challenge-running' || !state.targetZone) return state
    if (state.roundState.mechanicType !== 'dynamic-gate' && state.roundState.mechanicType !== 'boss-gate') return state

    const locksByPlayer = {
      ...state.locksByPlayer,
      [action.playerKey]: action.value,
    }
    const blockedByPlayer = {
      ...state.blockedByPlayer,
      [action.playerKey]: action.blocked ?? false,
    }

    if (locksByPlayer.A === null || locksByPlayer.B === null) {
      return {
        ...state,
        locksByPlayer,
        blockedByPlayer,
        error: null,
      }
    }

    return settleGateLikeChallenge(state, [
      { playerKey: 'A', value: locksByPlayer.A },
      { playerKey: 'B', value: locksByPlayer.B },
    ], action.playerLabels, {
      locksByPlayer,
      blocked: blockedByPlayer.A || blockedByPlayer.B,
      targetZone: action.targetZone,
    })
  }

  if (action.type === 'open-result-task') {
    if (state.screenState !== 'challenge-result' || !state.renderedTask) return state
    return {
      ...state,
      screenState: 'result-task',
    }
  }

  if (action.type === 'complete-result-task') {
    if (state.screenState !== 'result-task' || !state.renderedTask) return state
    return advanceAfterRound(state)
  }

  if (action.type === 'complete-remedy-task') {
    if (state.screenState !== 'remedy-task' || !state.renderedTask) return state

    if (state.gateResult?.retryAfterRemedy) {
      return prepareRound(
        state.roundState.stageIndex,
        state.roundState.roundIndex,
        state.roundState.attempt + 1,
        state.totalCompletedRounds,
        state.playerLabels
      )
    }

    return advanceAfterRound(state)
  }

  return state
}

function settleGateLikeChallenge(
  state: ChallengeSessionState,
  locks: PlayerLock[],
  playerLabels: ChallengePlayerLabels,
  options: { forcedOutcome?: ChallengeOutcomeKey; locksByPlayer?: LocksByPlayer; blocked?: boolean; targetZone?: TargetZone } = {}
): ChallengeSessionState {
  const targetZone = options.targetZone ?? state.targetZone
  if (!targetZone) return state

  const retryAfterRemedy = state.roundState.isBoss && getStageConfig(state.roundState.stageKey).retryBossOnFail
  const gateResult = judgeGateResult(getRoundId(state.roundState), targetZone, locks, {
    mechanicType: state.roundState.mechanicType,
    isBoss: state.roundState.isBoss,
    retryAfterRemedy,
    blocked: options.blocked,
    forcedOutcome: options.forcedOutcome,
  })
  const identity = createIdentityAssignment(gateResult, playerLabels)
  const rendered = gateResult.passed
    ? createResultTask(state.roundState, gateResult.taskBranch, identity)
    : createRemedyTask(state.roundState, gateResult.taskBranch, identity)

  return {
    ...state,
    screenState: gateResult.passed ? 'challenge-result' : 'remedy-task',
    playerLabels,
    locksByPlayer: options.locksByPlayer ?? {
      A: locks.find(lock => lock.playerKey === 'A')?.value ?? null,
      B: locks.find(lock => lock.playerKey === 'B')?.value ?? null,
    },
    blockedByPlayer: initialBlocked,
    gateResult,
    identityAssignment: identity,
    renderedTask: rendered.task,
    pausedFromScreenState: null,
    error: rendered.error,
  }
}

function advanceAfterRound(state: ChallengeSessionState): ChallengeSessionState {
  const nextTotal = Math.min(TOTAL_CHALLENGE_ROUNDS, state.totalCompletedRounds + 1)
  const nextRoundIndex = state.roundState.roundIndex + 1

  if (nextRoundIndex < state.roundState.roundCount) {
    return prepareRound(state.roundState.stageIndex, nextRoundIndex, 0, nextTotal, state.playerLabels)
  }

  const nextStageIndex = state.roundState.stageIndex + 1
  if (nextStageIndex >= INTIMACY_STAGE_ORDER.length) {
    return {
      ...state,
      screenState: 'ending',
      stageState: {
        ...state.stageState,
        completedRounds: state.stageState.roundCount,
      },
      totalCompletedRounds: nextTotal,
      targetZone: null,
      gateProfile: null,
      locksByPlayer: initialLocks,
      blockedByPlayer: initialBlocked,
      renderedTask: null,
      pausedFromScreenState: null,
      error: null,
    }
  }

  return prepareRound(nextStageIndex, 0, 0, nextTotal, state.playerLabels)
}

export function isPlayableScreenState(screenState: ChallengeScreenState): screenState is ChallengePlayableScreenState {
  return screenState === 'challenge-ready'
    || screenState === 'challenge-running'
    || screenState === 'challenge-result'
    || screenState === 'result-task'
    || screenState === 'remedy-task'
}

function prepareRound(
  stageIndex: number,
  roundIndex: number,
  attempt: number,
  totalCompletedRounds: number,
  playerLabels: ChallengePlayerLabels
): ChallengeSessionState {
  const stageKey = INTIMACY_STAGE_ORDER[stageIndex]
  const roundState = createRoundState(stageKey, stageIndex, roundIndex, attempt)
  const materialStage = intimacyStageMaterialMap[stageKey]
  const gateProfile = getGateProfile(materialStage, roundIndex, roundState.isBoss ? 'boss' : 'normal')
  const targetZone = createTargetZone({
    ...gateProfile,
    targetWidth: Math.max(7, gateProfile.targetWidth - Math.max(0, roundState.difficulty - 2) * 1.8),
  })

  return {
    screenState: 'challenge-ready',
    stageState: {
      stageKey,
      stageIndex,
      completedRounds: roundIndex,
      roundCount: roundState.roundCount,
    },
    roundState,
    playerLabels,
    totalCompletedRounds,
    totalRoundCount: TOTAL_CHALLENGE_ROUNDS,
    targetZone,
    gateProfile,
    locksByPlayer: initialLocks,
    blockedByPlayer: initialBlocked,
    gateResult: null,
    identityAssignment: null,
    renderedTask: null,
    pausedFromScreenState: null,
    error: null,
  }
}

function createRoundState(stageKey: IntimacyStageKey, stageIndex: number, roundIndex: number, attempt: number): ChallengeRoundState {
  const config = getStageConfig(stageKey)
  const roundCount = getRoundCount(stageKey)
  const isBoss = roundIndex === roundCount - 1

  return {
    stageKey,
    stageIndex,
    roundIndex,
    roundCount,
    isBoss,
    mechanicType: isBoss ? config.bossMechanic : config.normalMechanic,
    difficulty: isBoss ? config.bossDifficulty + Math.min(2, attempt) : config.baseDifficulty + Math.min(1, roundIndex),
    attempt,
  }
}

function createResultTask(roundState: ChallengeRoundState, taskMode: TaskMode, identity: IdentityAssignment) {
  const materialStage = intimacyStageMaterialMap[roundState.stageKey]
  const material = selectChallengeMaterial(materialStage, taskMode, `${getRoundId(roundState)}-result-${roundState.attempt}`)

  if (!material) {
    return { task: null, error: `${intimacyStageLabels[roundState.stageKey]}阶段的结果素材暂时不够。` }
  }

  const rendered = renderChallengeTemplate(material, {
    ...identity,
    triggerLabel: roundState.isBoss ? `${challengeMechanicLabels[roundState.mechanicType]}奖励` : `${challengeMechanicLabels[roundState.mechanicType]}结果`,
    triggerReason: getResultTaskReason(roundState, identity.triggerReason),
  }, 'result-task')

  return {
    task: rendered.task,
    error: rendered.ok ? null : rendered.errors[0] || '结果任务渲染失败，请继续下一轮。',
  }
}

function createRemedyTask(roundState: ChallengeRoundState, taskMode: TaskMode, identity: IdentityAssignment) {
  const materialStage = intimacyStageMaterialMap[roundState.stageKey]
  const material = selectChallengeMaterial(materialStage, taskMode, `${getRoundId(roundState)}-remedy-${roundState.attempt}`)

  if (!material) {
    return {
      task: {
        materialId: `${getRoundId(roundState)}-fallback-remedy`,
        title: '补救任务',
        text: '先停下来抱住对方，放慢呼吸，等两个人都重新靠近一点，再继续挑战。',
        triggerLabel: '补救任务',
        triggerReason: roundState.isBoss && getStageConfig(roundState.stageKey).retryBossOnFail
          ? 'Boss 机关没有完全通过，补救后要回来重试。'
          : '机关没有完全对上，用一个温和补救把气氛接回来。',
        kind: 'remedy-task' as const,
        warnings: [],
      },
      error: null,
    }
  }

  const rendered = renderChallengeTemplate(material, {
    ...identity,
    triggerLabel: roundState.isBoss ? 'Boss 补救任务' : '机关补救任务',
    triggerReason: roundState.isBoss && getStageConfig(roundState.stageKey).retryBossOnFail
      ? 'Boss 机关没有完全通过，补救后回到这道门再试一次。'
      : '机关没有完全对上，先把节奏接回来再继续。',
  }, 'remedy-task')

  return {
    task: rendered.task,
    error: rendered.ok ? null : rendered.errors[0] || '补救任务渲染失败，请继续下一轮。',
  }
}

function getResultTaskReason(roundState: ChallengeRoundState, triggerReason: string): string {
  const roundLabel = roundState.isBoss ? '阶段 Boss' : `第 ${roundState.roundIndex + 1} 轮机关`
  return `${roundLabel}已经结算。${triggerReason}`
}

function getStageConfig(stageKey: IntimacyStageKey) {
  return CHALLENGE_STAGE_CONFIG[stageKey]
}

function getRoundCount(stageKey: IntimacyStageKey): number {
  return getStageConfig(stageKey).normalRounds + 1
}

function getRoundId(roundState: ChallengeRoundState): string {
  return `${roundState.stageKey}-${roundState.isBoss ? 'boss' : `round-${roundState.roundIndex + 1}`}`
}

function getChoiceValue(choice: string): number {
  const normalized = choice.charCodeAt(0) || 65
  return 20 + ((normalized - 65) % 3) * 30
}

function clampChallengeValue(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
}
