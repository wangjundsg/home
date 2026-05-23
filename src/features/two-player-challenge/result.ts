import { clampTrack } from './meter'
import type { ChallengeMechanicType, ChallengeOutcomeKey, GateResult, PlayerLock, ResultKey, TargetZone, TaskMode } from './types'

const PERFECT_GAP = 5
const HEART_HIT_GAP = 10
const NEAR_MARGIN = 8

interface JudgeGateOptions {
  mechanicType?: ChallengeMechanicType
  isBoss?: boolean
  retryAfterRemedy?: boolean
  blocked?: boolean
  forcedOutcome?: ChallengeOutcomeKey
}

export function judgeGateResult(gateId: string, targetZone: TargetZone, locks: PlayerLock[], options: JudgeGateOptions = {}): GateResult {
  const lockA = locks.find(lock => lock.playerKey === 'A')
  const lockB = locks.find(lock => lock.playerKey === 'B')

  if (!lockA || !lockB) {
    return createCooldownResult(gateId, targetZone, options)
  }

  const valueA = clampTrack(lockA.value)
  const valueB = clampTrack(lockB.value)
  const center = (valueA + valueB) / 2
  const gap = Math.abs(valueA - valueB)
  const hitByPlayer = {
    A: valueA >= targetZone.low && valueA <= targetZone.high,
    B: valueB >= targetZone.low && valueB <= targetZone.high,
  }
  const insideTarget = center >= targetZone.low && center <= targetZone.high
  const insideNearBand = center >= targetZone.low - NEAR_MARGIN && center <= targetZone.high + NEAR_MARGIN
  const resultKey: ResultKey = !Number.isFinite(valueA) || !Number.isFinite(valueB)
    ? 'cooldown'
    : insideTarget && gap <= PERFECT_GAP
      ? 'perfect-sync'
      : insideTarget && gap <= HEART_HIT_GAP
        ? 'heart-hit'
        : insideNearBand
          ? 'near-miss'
          : center > targetZone.high + NEAR_MARGIN
            ? 'overheat'
            : 'cooldown'
  const baseOutcome = getOutcomeKey(resultKey, hitByPlayer)
  const outcomeKey = getFinalOutcome(baseOutcome, options)
  const taskBranch = getTaskBranch(outcomeKey, hitByPlayer)
  const passed = outcomeKey === 'success' || outcomeKey === 'boss-clear'

  return {
    gateId,
    resultKey,
    outcomeKey,
    mechanicType: options.mechanicType ?? 'dynamic-gate',
    isBoss: options.isBoss ?? false,
    retryAfterRemedy: options.retryAfterRemedy ?? false,
    blocked: options.blocked ?? false,
    locksByPlayer: { A: valueA, B: valueB },
    targetZone,
    center,
    gap,
    hitByPlayer,
    passed,
    taskBranch,
    ...getFeedback(resultKey, hitByPlayer, gap, outcomeKey, options.retryAfterRemedy ?? false),
  }
}

function createCooldownResult(gateId: string, targetZone: TargetZone, options: JudgeGateOptions): GateResult {
  const outcomeKey = getFinalOutcome('miss', options)

  return {
    gateId,
    resultKey: 'cooldown',
    outcomeKey,
    mechanicType: options.mechanicType ?? 'dynamic-gate',
    isBoss: options.isBoss ?? false,
    retryAfterRemedy: options.retryAfterRemedy ?? false,
    blocked: options.blocked ?? false,
    locksByPlayer: { A: 0, B: 0 },
    targetZone,
    center: 0,
    gap: 0,
    hitByPlayer: { A: false, B: false },
    passed: false,
    taskBranch: getTaskBranch(outcomeKey, { A: false, B: false }),
    feedbackTitle: outcomeKey === 'boss-failed' ? 'Boss 门还没放行' : '节奏还没靠近',
    feedbackText: options.retryAfterRemedy
      ? '这一轮先用一张补救任务把节奏接回来，补完后再挑战这道 Boss 门。'
      : '这一轮没有对上，先用一张补救任务把气氛重新拉回来。',
  }
}

function getFinalOutcome(baseOutcome: ChallengeOutcomeKey, options: JudgeGateOptions): ChallengeOutcomeKey {
  if (options.forcedOutcome) return normalizeBossOutcome(options.forcedOutcome, options.isBoss ?? false)
  if (options.blocked) return options.isBoss ? 'boss-failed' : 'blocked'
  return normalizeBossOutcome(baseOutcome, options.isBoss ?? false)
}

function normalizeBossOutcome(outcome: ChallengeOutcomeKey, isBoss: boolean): ChallengeOutcomeKey {
  if (!isBoss) return outcome
  return outcome === 'success' || outcome === 'boss-clear' ? 'boss-clear' : 'boss-failed'
}

function getOutcomeKey(resultKey: ResultKey, hitByPlayer: Record<'A' | 'B', boolean>): ChallengeOutcomeKey {
  if (resultKey === 'perfect-sync') return 'success'
  if (resultKey === 'heart-hit' && hitByPlayer.A && hitByPlayer.B) return 'success'
  if (hitByPlayer.A !== hitByPlayer.B) return 'partial'
  return 'miss'
}

function getTaskBranch(outcomeKey: ChallengeOutcomeKey, hitByPlayer: Record<'A' | 'B', boolean>): TaskMode {
  if (outcomeKey === 'success' || outcomeKey === 'boss-clear') return 'duo'
  if (outcomeKey === 'partial' || hitByPlayer.A !== hitByPlayer.B) return 'response'
  return 'scene'
}

function getFeedback(
  resultKey: ResultKey,
  hitByPlayer: Record<'A' | 'B', boolean>,
  gap: number,
  outcomeKey: ChallengeOutcomeKey,
  retryAfterRemedy: boolean
) {
  if (outcomeKey === 'boss-clear') {
    return {
      feedbackTitle: 'Boss 门打开了',
      feedbackText: `这次两个人把节奏压住了，差距 ${Math.round(gap)} 点，阶段机关顺利通过。`,
    }
  }

  if (outcomeKey === 'boss-failed') {
    return {
      feedbackTitle: retryAfterRemedy ? 'Boss 门还要再试一次' : 'Boss 门差一点',
      feedbackText: retryAfterRemedy
        ? '这道门没有完全对上，先完成补救任务，再回到 Boss 继续挑战。'
        : '这道门没有完全对上，先补救一下气氛，然后继续进入下一阶段。',
    }
  }

  if (outcomeKey === 'blocked') {
    return {
      feedbackTitle: '撞到障碍区了',
      feedbackText: '节奏被障碍挡了一下，先用补救任务把彼此重新接住。',
    }
  }

  if (resultKey === 'perfect-sync') {
    return {
      feedbackTitle: '气氛对齐了',
      feedbackText: `两个人都踩进目标区，而且只差 ${Math.round(gap)} 点，接下来的任务会更顺。`,
    }
  }

  if (resultKey === 'heart-hit' && hitByPlayer.A && hitByPlayer.B) {
    return {
      feedbackTitle: '同步门打开了',
      feedbackText: '你们都命中了目标区，只是还有一点点距离。带着这股节奏往下走。',
    }
  }

  if (hitByPlayer.A !== hitByPlayer.B) {
    return {
      feedbackTitle: '有一个人先靠近了',
      feedbackText: hitByPlayer.A
        ? 'A 已经进门，B 需要用一张回应任务把节奏接回来。'
        : 'B 已经进门，A 需要用一张回应任务把节奏接回来。',
    }
  }

  return {
    feedbackTitle: resultKey === 'overheat' ? '节奏冲过头了' : '节奏还差一点',
    feedbackText: '这一轮没有完全对上，先完成一张补救任务，再继续往下走。',
  }
}
