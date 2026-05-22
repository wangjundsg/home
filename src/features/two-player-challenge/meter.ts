import { getGateType, getStageGateCount } from './route'
import type { GateProfile, MeterParams, PlayerKey, PlayerLock, StageKey, TargetZone } from './types'

const TRACK_MIN = 0
const TRACK_MAX = 100
const BASE_SPEED = 32
const BASE_TARGET_WIDTH = 24
const BASE_TARGET_CENTER = 50

const stageTuning: Record<StageKey, {
  speedMultiplier: number
  widthMultiplier: number
  centerDrift: number
  pressureLabel: string
  objectiveLabel: string
}> = {
  beginner: {
    speedMultiplier: 0.82,
    widthMultiplier: 1.22,
    centerDrift: 0,
    pressureLabel: '学节奏',
    objectiveLabel: '一起靠近红区中心。',
  },
  intermediate: {
    speedMultiplier: 0.98,
    widthMultiplier: 1.02,
    centerDrift: 5,
    pressureLabel: '做修正',
    objectiveLabel: '第一下起势，第二下把节奏接回来。',
  },
  advanced: {
    speedMultiplier: 1.16,
    widthMultiplier: 0.86,
    centerDrift: 8,
    pressureLabel: '上压力',
    objectiveLabel: '红区更窄，别让节奏擦肩。',
  },
  finale: {
    speedMultiplier: 1.08,
    widthMultiplier: 0.78,
    centerDrift: 4,
    pressureLabel: '收束',
    objectiveLabel: '稳住同一个节奏，别急着冲过头。',
  },
}

export function clampTrack(value: number): number {
  return Math.min(TRACK_MAX, Math.max(TRACK_MIN, value))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function getMeterParams(stageKey: StageKey, gateIndexOrType: number | 'normal' | 'boss'): MeterParams {
  const gateIndex = typeof gateIndexOrType === 'number' ? gateIndexOrType : getStageGateCount(stageKey) - 1
  const gateType = typeof gateIndexOrType === 'number' ? getGateType(stageKey, gateIndexOrType) : gateIndexOrType
  return getGateProfile(stageKey, gateIndex, gateType)
}

export function getGateProfile(stageKey: StageKey, gateIndex: number, gateType = getGateType(stageKey, gateIndex)): GateProfile {
  const tuning = stageTuning[stageKey]
  const gateCount = getStageGateCount(stageKey)
  const progress = gateCount <= 1 ? 1 : gateIndex / (gateCount - 1)
  const bossPressure = gateType === 'boss' ? 1 : 0
  const speedPressure = 1 + progress * getProgressSpeedRamp(stageKey) + bossPressure * getBossSpeedRamp(stageKey)
  const widthPressure = 1 + progress * getProgressWidthRamp(stageKey) + bossPressure * getBossWidthRamp(stageKey)
  const driftDirection = gateIndex % 2 === 0 ? 1 : -1
  const targetCenter = BASE_TARGET_CENTER + driftDirection * tuning.centerDrift * progress

  return {
    stageKey,
    gateIndex,
    gateType,
    gateCount,
    speed: BASE_SPEED * tuning.speedMultiplier * speedPressure,
    targetWidth: clamp(BASE_TARGET_WIDTH * tuning.widthMultiplier / widthPressure, 10, 34),
    targetCenter: clamp(targetCenter, 18, 82),
    pressureLabel: gateType === 'boss' ? `${tuning.pressureLabel} · Boss压力门` : tuning.pressureLabel,
    objectiveLabel: gateType === 'boss' ? '压力门：两次锁定越贴近越好。' : tuning.objectiveLabel,
  }
}

function getProgressSpeedRamp(stageKey: StageKey): number {
  if (stageKey === 'beginner') return 0.1
  if (stageKey === 'intermediate') return 0.16
  if (stageKey === 'advanced') return 0.24
  return 0.18
}

function getProgressWidthRamp(stageKey: StageKey): number {
  if (stageKey === 'beginner') return 0.08
  if (stageKey === 'intermediate') return 0.14
  if (stageKey === 'advanced') return 0.22
  return 0.28
}

function getBossSpeedRamp(stageKey: StageKey): number {
  if (stageKey === 'beginner') return 0.1
  if (stageKey === 'intermediate') return 0.16
  if (stageKey === 'advanced') return 0.22
  return 0.18
}

function getBossWidthRamp(stageKey: StageKey): number {
  if (stageKey === 'beginner') return 0.12
  if (stageKey === 'intermediate') return 0.18
  if (stageKey === 'advanced') return 0.24
  return 0.3
}

export function createTargetZone(params: MeterParams): TargetZone {
  const width = clamp(params.targetWidth, 8, 40)
  const center = clamp(params.targetCenter, width / 2, TRACK_MAX - width / 2)

  return {
    low: center - width / 2,
    high: center + width / 2,
    center,
    width,
  }
}

export function getPointerValue(elapsedSeconds: number, speed: number, startOffset = 0): number {
  const cycleLength = 2 * (TRACK_MAX - TRACK_MIN)
  const cyclePosition = ((elapsedSeconds * speed + startOffset) % cycleLength + cycleLength) % cycleLength
  return TRACK_MAX - Math.abs(cyclePosition - (TRACK_MAX - TRACK_MIN))
}

export function captureLock(playerKey: PlayerKey, value: number): PlayerLock {
  return {
    playerKey,
    value: clampTrack(value),
  }
}
