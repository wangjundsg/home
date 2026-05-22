import { clampTrack } from './meter'
import type { GateResult, PlayerLock, ResultKey, TargetZone } from './types'

const PERFECT_GAP = 5
const HEART_HIT_GAP = 10
const NEAR_MARGIN = 8

export function judgeGateResult(gateId: string, targetZone: TargetZone, locks: PlayerLock[]): GateResult {
  const lockA = locks.find(lock => lock.playerKey === 'A')
  const lockB = locks.find(lock => lock.playerKey === 'B')

  if (!lockA || !lockB) {
    return createCooldownResult(gateId, targetZone)
  }

  const valueA = clampTrack(lockA.value)
  const valueB = clampTrack(lockB.value)
  const center = (valueA + valueB) / 2
  const gap = Math.abs(valueA - valueB)
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

  return {
    gateId,
    resultKey,
    locksByPlayer: { A: valueA, B: valueB },
    targetZone,
    center,
    gap,
  }
}

function createCooldownResult(gateId: string, targetZone: TargetZone): GateResult {
  return {
    gateId,
    resultKey: 'cooldown',
    locksByPlayer: { A: 0, B: 0 },
    targetZone,
    center: 0,
    gap: 0,
  }
}
