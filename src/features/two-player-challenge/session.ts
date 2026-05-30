import { selectChallengeMaterial } from './materials'
import { renderChallengeTemplate } from './template'
import {
  challengeMechanicLabels,
  intimacyStageLabels,
  intimacyStageMaterialMap,
  taskModeLabels,
  type ChallengeMechanicType,
  type ChallengeOutcomeKey,
  type GateProfile,
  type GateResult,
  type IdentityAssignment,
  type IntimacyStageKey,
  type LocksByPlayer,
  type PlayerKey,
  type RenderedTask,
  type TargetZone,
  type TaskMode,
} from './types'

export type ChallengeInteractionStep = 'gate-ready' | 'active-action' | 'partner-response' | 'gate-reveal' | 'result-task' | 'remedy-task'
export type ChallengePlayableScreenState = ChallengeInteractionStep
export type ChallengeScreenState = ChallengePlayableScreenState | 'ending' | 'session-ended'

export interface ChallengeRoundState {
  stageKey: IntimacyStageKey
  stageIndex: number
  roundIndex: number
  roundCount: number
  isBoss: boolean
  mechanicType: ChallengeMechanicType
  difficulty: number
  attempt: number
  activePlayer: PlayerKey
  partnerPlayer: PlayerKey
  interactionStep: ChallengeInteractionStep
  gateTitle: string
  gatePrompt: string
  activeActions: ChallengeActionOption[]
  partnerResponses: ChallengeResponseOption[]
  activeAction: ChallengeActionOption | null
  partnerResponse: ChallengeResponseOption | null
  resonanceHits: PlayerKey[]
  bossConfirmations: PlayerKey[]
  gateDecision: ChallengeGateDecision | null
}

export interface ChallengeActionOption {
  id: string
  label: string
  description: string
  gesture: string
  intent: 'close' | 'invite' | 'tease' | 'slow' | 'lead' | 'together'
}

export interface ChallengeResponseOption {
  id: string
  label: string
  description: string
  taskMode: TaskMode
  outcomeKey: ChallengeOutcomeKey
  actorStrategy: 'active' | 'partner' | 'both' | 'female-led'
}

export interface ChallengeGateDecision {
  taskMode: TaskMode
  outcomeKey: ChallengeOutcomeKey
  actorStrategy: ChallengeResponseOption['actorStrategy']
  summary: string
  activeActionLabel: string
  partnerResponseLabel: string
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
  rerollsLeft: number
}

export interface ChallengePlayerLabels {
  A: string
  B: string
}

export type ChallengeSessionAction =
  | { type: 'start-gate' }
  | { type: 'choose-active-action'; actionId: string }
  | { type: 'choose-partner-response'; responseId: string }
  | { type: 'record-resonance'; playerKey: PlayerKey }
  | { type: 'confirm-boss'; playerKey: PlayerKey }
  | { type: 'reveal-gate'; playerLabels: ChallengePlayerLabels }
  | { type: 'open-result-task' }
  | { type: 'complete-result-task' }
  | { type: 'complete-remedy-task' }
  | { type: 'reroll-softer-task'; playerLabels: ChallengePlayerLabels }
  | { type: 'skip-task' }
  | { type: 'end-session' }
  | { type: 'restart'; playerLabels?: ChallengePlayerLabels }

export const INTIMACY_STAGE_ORDER: IntimacyStageKey[] = ['flirt', 'foreplay', 'deepening', 'sex']

export const CHALLENGE_STAGE_CONFIG: Record<IntimacyStageKey, {
  normalRounds: number
  baseDifficulty: number
}> = {
  flirt: { normalRounds: 2, baseDifficulty: 1 },
  foreplay: { normalRounds: 2, baseDifficulty: 2 },
  deepening: { normalRounds: 3, baseDifficulty: 3 },
  sex: { normalRounds: 3, baseDifficulty: 4 },
}

export const TOTAL_CHALLENGE_ROUNDS = INTIMACY_STAGE_ORDER.reduce((total, stageKey) => total + getRoundCount(stageKey), 0)

const initialLocks: LocksByPlayer = { A: null, B: null }
const initialBlocked: Record<PlayerKey, boolean> = { A: false, B: false }
const defaultLabels: ChallengePlayerLabels = { A: '大大怪', B: '小乖乖' }
const stableTargetZone: TargetZone = { low: 40, high: 60, center: 50, width: 20 }

export const initialChallengeSessionState: ChallengeSessionState = createInitialState(defaultLabels)

export function createInitialState(playerLabels: ChallengePlayerLabels = defaultLabels): ChallengeSessionState {
  return prepareRound(0, 0, 0, 0, playerLabels)
}

export function challengeSessionReducer(state: ChallengeSessionState, action: ChallengeSessionAction): ChallengeSessionState {
  if (action.type === 'restart') {
    return createInitialState(action.playerLabels ?? defaultLabels)
  }

  if (action.type === 'start-gate') {
    if (state.screenState !== 'gate-ready') return state
    return {
      ...state,
      screenState: 'active-action',
      roundState: {
        ...state.roundState,
        interactionStep: 'active-action',
      },
      error: null,
    }
  }

  if (action.type === 'choose-active-action') {
    if (state.screenState !== 'active-action') return state
    const activeAction = state.roundState.activeActions.find(item => item.id === action.actionId)
    if (!activeAction) return state
    return {
      ...state,
      screenState: 'partner-response',
      roundState: {
        ...state.roundState,
        interactionStep: 'partner-response',
        activeAction,
      },
      error: null,
    }
  }

  if (action.type === 'choose-partner-response') {
    if (state.screenState !== 'partner-response') return state
    const partnerResponse = state.roundState.partnerResponses.find(item => item.id === action.responseId)
    if (!partnerResponse) return state
    const gateDecision = createGateDecision(state.roundState, partnerResponse)
    return {
      ...state,
      screenState: 'gate-reveal',
      roundState: {
        ...state.roundState,
        interactionStep: 'gate-reveal',
        partnerResponse,
        gateDecision,
      },
      error: null,
    }
  }

  if (action.type === 'record-resonance') {
    if (state.screenState !== 'partner-response' || state.roundState.mechanicType !== 'lead-shift') return state
    if (state.roundState.resonanceHits.length >= 3) return state

    const expectedPlayer: PlayerKey = state.roundState.resonanceHits.length % 2 === 0
      ? state.roundState.activePlayer
      : state.roundState.partnerPlayer
    if (action.playerKey !== expectedPlayer) return state

    const resonanceHits = [...state.roundState.resonanceHits, action.playerKey]
    const partnerResponse = resonanceHits.length >= 3
      ? getLeadShiftResponse(state.roundState, resonanceHits)
      : null
    const nextRoundState = {
      ...state.roundState,
      interactionStep: partnerResponse ? 'gate-reveal' as const : 'partner-response' as const,
      resonanceHits,
      partnerResponse,
    }

    return {
      ...state,
      screenState: partnerResponse ? 'gate-reveal' : 'partner-response',
      roundState: {
        ...nextRoundState,
        gateDecision: partnerResponse ? createGateDecision(nextRoundState, partnerResponse) : null,
      },
      error: null,
    }
  }

  if (action.type === 'confirm-boss') {
    if (state.screenState !== 'partner-response' || !state.roundState.isBoss) return state
    if (state.roundState.bossConfirmations.includes(action.playerKey)) return state

    const bossConfirmations = [...state.roundState.bossConfirmations, action.playerKey]
    const partnerResponse = bossConfirmations.length >= 2
      ? state.roundState.partnerResponses[0]
      : null

    return {
      ...state,
      screenState: partnerResponse ? 'gate-reveal' : 'partner-response',
      roundState: {
        ...state.roundState,
        interactionStep: partnerResponse ? 'gate-reveal' : 'partner-response',
        bossConfirmations,
        partnerResponse,
        gateDecision: partnerResponse ? createGateDecision(state.roundState, partnerResponse) : null,
      },
      error: null,
    }
  }

  if (action.type === 'reveal-gate') {
    if (state.screenState !== 'gate-reveal' || !state.roundState.gateDecision) return state
    return settleRouteGate(state, state.roundState.gateDecision, action.playerLabels, 0)
  }

  if (action.type === 'open-result-task') {
    if (state.screenState !== 'gate-reveal' || !state.renderedTask) return state
    return {
      ...state,
      screenState: 'result-task',
      roundState: {
        ...state.roundState,
        interactionStep: 'result-task',
      },
    }
  }

  if (action.type === 'complete-result-task') {
    if (state.screenState !== 'result-task' || !state.renderedTask) return state
    return advanceAfterRound(state)
  }

  if (action.type === 'complete-remedy-task') {
    if (state.screenState !== 'remedy-task' || !state.renderedTask) return state
    return advanceAfterRound(state)
  }

  if (action.type === 'reroll-softer-task') {
    if ((state.screenState !== 'result-task' && state.screenState !== 'remedy-task') || !state.roundState.gateDecision || state.rerollsLeft <= 0) return state
    const softerDecision: ChallengeGateDecision = {
      ...state.roundState.gateDecision,
      taskMode: state.roundState.gateDecision.taskMode === 'duo' ? 'scene' : 'response',
      outcomeKey: state.roundState.gateDecision.outcomeKey === 'boss-clear' ? 'boss-clear' : 'partial',
      actorStrategy: state.roundState.gateDecision.actorStrategy === 'both' ? 'both' : 'partner',
      summary: '换成更温和的承接任务。',
    }
    const rerolledState = settleRouteGate({
      ...state,
      rerollsLeft: state.rerollsLeft - 1,
      roundState: {
        ...state.roundState,
        gateDecision: softerDecision,
      },
    }, softerDecision, action.playerLabels, state.rerollsLeft)
    const taskStep = rerolledState.renderedTask?.kind === 'remedy-task' ? 'remedy-task' : state.screenState

    return {
      ...rerolledState,
      screenState: taskStep,
      roundState: {
        ...rerolledState.roundState,
        interactionStep: taskStep,
      },
    }
  }

  if (action.type === 'skip-task') {
    if (state.screenState !== 'result-task' && state.screenState !== 'remedy-task') return state
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

  return state
}

function settleRouteGate(
  state: ChallengeSessionState,
  decision: ChallengeGateDecision,
  playerLabels: ChallengePlayerLabels,
  rerollSeed: number
): ChallengeSessionState {
  const gateResult = createRouteGateResult(state.roundState, decision)
  const identity = createRouteIdentity(state.roundState, decision, playerLabels)
  const rendered = decision.outcomeKey === 'miss' || decision.outcomeKey === 'boss-failed'
    ? createRemedyTask(state.roundState, decision.taskMode, identity, rerollSeed)
    : createResultTask(state.roundState, decision.taskMode, identity, rerollSeed)
  const nextStep = rendered.task?.kind === 'remedy-task' ? 'remedy-task' : 'gate-reveal'

  return {
    ...state,
    screenState: nextStep,
    playerLabels,
    gateResult,
    identityAssignment: identity,
    renderedTask: rendered.task,
    error: rendered.error,
    locksByPlayer: {
      A: state.roundState.activePlayer === 'A' ? 50 : 46,
      B: state.roundState.activePlayer === 'B' ? 50 : 54,
    },
    blockedByPlayer: initialBlocked,
    pausedFromScreenState: null,
    roundState: {
      ...state.roundState,
      interactionStep: nextStep,
      gateDecision: decision,
    },
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
  return screenState === 'gate-ready'
    || screenState === 'active-action'
    || screenState === 'partner-response'
    || screenState === 'gate-reveal'
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

  return {
    screenState: 'gate-ready',
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
    targetZone: stableTargetZone,
    gateProfile: null,
    locksByPlayer: initialLocks,
    blockedByPlayer: initialBlocked,
    gateResult: null,
    identityAssignment: null,
    renderedTask: null,
    pausedFromScreenState: null,
    error: null,
    rerollsLeft: 1,
  }
}

function createRoundState(stageKey: IntimacyStageKey, stageIndex: number, roundIndex: number, attempt: number): ChallengeRoundState {
  const config = getStageConfig(stageKey)
  const roundCount = getRoundCount(stageKey)
  const isBoss = roundIndex === roundCount - 1
  const mechanicType = getMechanicType(roundIndex, isBoss)
  const activePlayer: PlayerKey = (stageIndex + roundIndex) % 2 === 0 ? 'A' : 'B'
  const partnerPlayer = getOtherPlayer(activePlayer)
  const gateCopy = getGateCopy(stageKey, roundIndex, isBoss, mechanicType, activePlayer, partnerPlayer)

  return {
    stageKey,
    stageIndex,
    roundIndex,
    roundCount,
    isBoss,
    mechanicType,
    difficulty: isBoss ? config.baseDifficulty + 1 : config.baseDifficulty,
    attempt,
    activePlayer,
    partnerPlayer,
    interactionStep: 'gate-ready',
    activeAction: null,
    partnerResponse: null,
    resonanceHits: [],
    bossConfirmations: [],
    gateDecision: null,
    ...gateCopy,
  }
}

function createResultTask(roundState: ChallengeRoundState, taskMode: TaskMode, identity: IdentityAssignment, rerollSeed: number) {
  const materialStage = intimacyStageMaterialMap[roundState.stageKey]
  const material = selectChallengeMaterial(materialStage, taskMode, `${getRoundId(roundState)}-result-${roundState.attempt}`, `${identity.triggerLabel}-${rerollSeed}`)

  if (!material) {
    return { task: null, error: `${intimacyStageLabels[roundState.stageKey]}阶段的${taskModeLabels[taskMode]}暂时不够。` }
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

function createRemedyTask(roundState: ChallengeRoundState, taskMode: TaskMode, identity: IdentityAssignment, rerollSeed: number) {
  return {
    task: {
      materialId: `${getRoundId(roundState)}-gentle-remedy-${rerollSeed}`,
      title: '补救任务',
      text: getGentleRemedyText(roundState, taskMode, identity),
      triggerLabel: roundState.isBoss ? 'Boss 温和补救' : '小门温和补救',
      triggerReason: roundState.isBoss
        ? 'Boss 没有完全打开，先完成一次低压力确认，再自然进入下一阶段。'
        : '小门没有完全打开，先把节奏接回来，再继续往前走。',
      kind: 'remedy-task' as const,
      warnings: [],
    },
    error: null,
  }
}

function getGentleRemedyText(roundState: ChallengeRoundState, taskMode: TaskMode, identity: IdentityAssignment): string {
  const activeName = identity.labels.actor ?? identity.labels.both
  const targetName = identity.labels.target ?? '对方'

  if (roundState.isBoss) {
    return `${identity.labels.both} 先停下来牵住手，各说一句“我还在”，再一起慢慢呼吸三次。`
  }

  if (taskMode === 'scene') {
    return `${identity.labels.both} 先退回到舒服的距离，互相说出一个现在愿意继续的小动作。`
  }

  if (taskMode === 'directed') {
    return `${activeName} 放慢语气问 ${targetName}：“这样可以吗？”等对方点头或改成更轻的方式。`
  }

  return `${identity.labels.both} 暂停十秒，互相确认“继续 / 放慢 / 跳过”里最舒服的一个选择。`
}

function createRouteIdentity(roundState: ChallengeRoundState, decision: ChallengeGateDecision, playerLabels: ChallengePlayerLabels): IdentityAssignment {
  const actorKey = resolveActorKey(roundState, decision.actorStrategy)
  const targetKey = actorKey ? getOtherPlayer(actorKey) : null
  const both = `${playerLabels.A}和${playerLabels.B}`

  return {
    taskMode: decision.taskMode,
    actorKey,
    targetKey,
    bothKeys: ['A', 'B'],
    modifiers: decision.outcomeKey === 'partial' ? ['reverse'] : decision.outcomeKey === 'miss' ? ['cooldown'] : ['add-on'],
    triggerLabel: taskModeLabels[decision.taskMode],
    triggerReason: getIdentityReason(roundState, decision, playerLabels),
    labels: {
      actor: actorKey ? playerLabels[actorKey] : null,
      target: targetKey ? playerLabels[targetKey] : null,
      both,
    },
  }
}

function createRouteGateResult(roundState: ChallengeRoundState, decision: ChallengeGateDecision): GateResult {
  const passed = decision.outcomeKey !== 'miss' && decision.outcomeKey !== 'boss-failed'
  const bossOutcome: ChallengeOutcomeKey = roundState.isBoss && passed ? 'boss-clear' : roundState.isBoss && !passed ? 'boss-failed' : decision.outcomeKey

  return {
    gateId: getRoundId(roundState),
    resultKey: passed ? 'heart-hit' : 'near-miss',
    outcomeKey: bossOutcome,
    mechanicType: roundState.mechanicType,
    isBoss: roundState.isBoss,
    retryAfterRemedy: false,
    blocked: false,
    locksByPlayer: { A: 50, B: 52 },
    targetZone: stableTargetZone,
    center: 51,
    gap: decision.outcomeKey === 'success' || bossOutcome === 'boss-clear' ? 2 : decision.outcomeKey === 'partial' ? 8 : 14,
    hitByPlayer: { A: true, B: passed },
    passed,
    taskBranch: decision.taskMode,
    feedbackTitle: getFeedbackTitle(roundState, bossOutcome),
    feedbackText: getFeedbackText(roundState, decision, bossOutcome),
  }
}

function getMechanicType(roundIndex: number, isBoss: boolean): ChallengeMechanicType {
  if (isBoss) return 'stage-boss'
  const types: ChallengeMechanicType[] = ['guess-heart', 'entrust', 'lead-shift']
  return types[roundIndex % types.length]
}

function getGateCopy(
  stageKey: IntimacyStageKey,
  roundIndex: number,
  isBoss: boolean,
  mechanicType: ChallengeMechanicType,
  activePlayer: PlayerKey,
  partnerPlayer: PlayerKey
): Pick<ChallengeRoundState, 'gateTitle' | 'gatePrompt' | 'activeActions' | 'partnerResponses'> {
  if (isBoss) {
    return {
      gateTitle: `${intimacyStageLabels[stageKey]}收束门`,
      gatePrompt: `${activePlayer} 先发起阶段收束，${partnerPlayer} 接住后两人各确认一次，再揭晓 Boss 素材。`,
      activeActions: [
        {
          id: 'boss-hold',
          label: '握住对方',
          description: '先握住对方的手，停三秒，确认两个人都还在同一节奏里。',
          gesture: '握手停三秒',
          intent: 'together',
        },
        {
          id: 'boss-look',
          label: '看着对方',
          description: '看着对方说一句“我们继续往下一步走”。',
          gesture: '对视确认',
          intent: 'lead',
        },
      ],
      partnerResponses: [
        {
          id: 'boss-clear',
          label: '一起收束',
          description: '两个人都确认后打开 Boss 素材。',
          taskMode: 'duo',
          outcomeKey: 'boss-clear',
          actorStrategy: 'both',
        },
      ],
    }
  }

  if (mechanicType === 'guess-heart') {
    return {
      gateTitle: '猜心门',
      gatePrompt: `${activePlayer} 先表达一个可见心意，${partnerPlayer} 再选择回应方式，组合后揭晓任务类型。`,
      activeActions: [
        {
          id: `guess-close-${roundIndex}`,
          label: '靠近一点',
          description: '向对方靠近一点，用眼神停住三秒。',
          gesture: '靠近 + 对视',
          intent: 'close',
        },
        {
          id: `guess-soft-${roundIndex}`,
          label: '放慢一点',
          description: '把语气放轻，给对方一个更容易接住的台阶。',
          gesture: '轻声邀请',
          intent: 'slow',
        },
        {
          id: `guess-tease-${roundIndex}`,
          label: '逗一下',
          description: '用一句短短的暧昧话，把悬念递给对方。',
          gesture: '一句暧昧提示',
          intent: 'tease',
        },
      ],
      partnerResponses: [
        {
          id: `guess-answer-${roundIndex}`,
          label: '我接住',
          description: '回应对方，让这一门变成回应任务。',
          taskMode: 'response',
          outcomeKey: 'partial',
          actorStrategy: 'partner',
        },
        {
          id: `guess-lead-${roundIndex}`,
          label: '你来带',
          description: '把这一轮主导权交给发起者。',
          taskMode: 'directed',
          outcomeKey: 'success',
          actorStrategy: 'active',
        },
        {
          id: `guess-scene-${roundIndex}`,
          label: '一起进入',
          description: '两个人都参与，打开一张场景任务。',
          taskMode: 'scene',
          outcomeKey: 'success',
          actorStrategy: 'female-led',
        },
      ],
    }
  }

  if (mechanicType === 'entrust') {
    return {
      gateTitle: '委托门',
      gatePrompt: `${activePlayer} 先发出一个委托，${partnerPlayer} 决定接住、一起做，还是放慢。`,
      activeActions: [
        {
          id: `entrust-lead-${roundIndex}`,
          label: '委托对方回应',
          description: '说一句“你来接住我一下”。',
          gesture: '发出委托',
          intent: 'invite',
        },
        {
          id: `entrust-guide-${roundIndex}`,
          label: '我先带一下',
          description: '先做一个轻动作，再邀请对方接住。',
          gesture: '轻动作示范',
          intent: 'lead',
        },
      ],
      partnerResponses: [
        {
          id: `entrust-catch-${roundIndex}`,
          label: '我接住',
          description: '由回应者成为任务发起者。',
          taskMode: 'response',
          outcomeKey: 'partial',
          actorStrategy: 'partner',
        },
        {
          id: `entrust-duo-${roundIndex}`,
          label: '一起做',
          description: '两人共同完成，降低压力。',
          taskMode: 'duo',
          outcomeKey: 'success',
          actorStrategy: 'both',
        },
        {
          id: `entrust-soft-${roundIndex}`,
          label: '放慢',
          description: '这门改成温和场景，不惩罚也不倒退。',
          taskMode: 'scene',
          outcomeKey: 'miss',
          actorStrategy: 'both',
        },
      ],
    }
  }

  return {
    gateTitle: '主导权门',
    gatePrompt: `${activePlayer} 和 ${partnerPlayer} 轮流完成 3 次共振点击，最后一次点击的人获得主导权。`,
    activeActions: [
      {
        id: `lead-start-${roundIndex}`,
        label: '开始共振',
        description: '两个人把手靠近屏幕，准备按 A/B/A 或 B/A/B 的节奏轻点三次。',
        gesture: '准备三次轻点',
        intent: 'together',
      },
    ],
    partnerResponses: [
      {
        id: `lead-directed-${roundIndex}`,
        label: '主导权揭晓',
        description: '三次共振完成后，由最后点击的人带这一轮。',
        taskMode: 'directed',
        outcomeKey: 'success',
        actorStrategy: 'partner',
      },
    ],
  }
}

function createGateDecision(roundState: ChallengeRoundState, partnerResponse: ChallengeResponseOption): ChallengeGateDecision {
  const activeAction = roundState.activeAction ?? roundState.activeActions[0]
  const leadShiftActor = roundState.mechanicType === 'lead-shift'
    ? roundState.resonanceHits[roundState.resonanceHits.length - 1] ?? roundState.partnerPlayer
    : null
  const taskMode = getTaskModeFromInteraction(roundState, activeAction, partnerResponse)
  const actorStrategy = leadShiftActor === roundState.activePlayer
    ? 'active'
    : leadShiftActor === roundState.partnerPlayer
      ? 'partner'
      : partnerResponse.actorStrategy
  const outcomeKey = roundState.isBoss ? 'boss-clear' : partnerResponse.outcomeKey

  return {
    taskMode,
    outcomeKey,
    actorStrategy,
    activeActionLabel: activeAction.label,
    partnerResponseLabel: partnerResponse.label,
    summary: `${roundState.activePlayer} 先选择“${activeAction.label}”，${roundState.partnerPlayer} 回应“${partnerResponse.label}”。`,
  }
}

function getLeadShiftResponse(roundState: ChallengeRoundState, resonanceHits: PlayerKey[]): ChallengeResponseOption {
  const lastPlayer = resonanceHits[resonanceHits.length - 1] ?? roundState.partnerPlayer
  return {
    id: `lead-${lastPlayer}`,
    label: `${lastPlayer} 带这一轮`,
    description: '三次共振完成，最后点击的人获得这一轮主导权。',
    taskMode: 'directed',
    outcomeKey: 'success',
    actorStrategy: lastPlayer === roundState.activePlayer ? 'active' : 'partner',
  }
}

function getTaskModeFromInteraction(
  roundState: ChallengeRoundState,
  activeAction: ChallengeActionOption,
  partnerResponse: ChallengeResponseOption
): TaskMode {
  if (roundState.isBoss) return partnerResponse.taskMode
  if (roundState.mechanicType === 'lead-shift') return 'directed'
  if (activeAction.intent === 'together') return 'duo'
  if (activeAction.intent === 'slow' && partnerResponse.taskMode !== 'directed') return 'scene'
  return partnerResponse.taskMode
}

function getResultTaskReason(roundState: ChallengeRoundState, triggerReason: string): string {
  const roundLabel = roundState.isBoss ? '阶段 Boss' : `第 ${roundState.roundIndex + 1} 道小门`
  return `${roundLabel}经过双方动作后打开。${triggerReason}`
}

function getIdentityReason(roundState: ChallengeRoundState, decision: ChallengeGateDecision, playerLabels: ChallengePlayerLabels): string {
  if (decision.actorStrategy === 'both') {
    return `${decision.summary} 这一门由两个人共同完成。`
  }

  if (decision.actorStrategy === 'female-led') {
    return `${decision.summary} 这道门给更害羞的一方一个温柔台阶，用回应或场景引导主动。`
  }

  const actorKey = resolveActorKey(roundState, decision.actorStrategy)
  return actorKey
    ? `${decision.summary} ${playerLabels[actorKey]}获得这一轮主导权。`
    : `${decision.summary} 这一门交给两个人一起完成。`
}

function getFeedbackTitle(roundState: ChallengeRoundState, outcomeKey: ChallengeOutcomeKey): string {
  if (outcomeKey === 'boss-clear') return 'Boss 门打开了'
  if (outcomeKey === 'boss-failed') return 'Boss 换成温和补救'
  if (outcomeKey === 'partial') return '回应接住了'
  if (outcomeKey === 'miss') return '换成温和补救'
  return roundState.isBoss ? '阶段门打开了' : '小门打开了'
}

function getFeedbackText(roundState: ChallengeRoundState, decision: ChallengeGateDecision, outcomeKey: ChallengeOutcomeKey): string {
  if (outcomeKey === 'boss-failed') {
    return '这次不用重试折磨，先用补救任务把气氛接回来，然后继续推进。'
  }

  if (outcomeKey === 'miss') {
    return '这道门没有卡住你们，只是换成更温和的任务继续。'
  }

  const gateName = roundState.isBoss ? 'Boss' : '小门'
  return `${gateName}已经经过双方动作打开：${decision.summary} 接下来触发${taskModeLabels[decision.taskMode]}。`
}

function resolveActorKey(roundState: ChallengeRoundState, strategy: ChallengeResponseOption['actorStrategy']): PlayerKey | null {
  if (strategy === 'both') return null
  if (strategy === 'active') return roundState.activePlayer
  if (strategy === 'partner') return roundState.partnerPlayer
  return 'B'
}

function getStageConfig(stageKey: IntimacyStageKey) {
  return CHALLENGE_STAGE_CONFIG[stageKey]
}

function getRoundCount(stageKey: IntimacyStageKey): number {
  return getStageConfig(stageKey).normalRounds + 1
}

function getRoundId(roundState: ChallengeRoundState): string {
  return `${roundState.stageKey}-${roundState.isBoss ? 'boss' : `gate-${roundState.roundIndex + 1}`}`
}

function getOtherPlayer(playerKey: PlayerKey): PlayerKey {
  return playerKey === 'A' ? 'B' : 'A'
}
