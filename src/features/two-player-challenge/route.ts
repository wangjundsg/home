import type { GateType, RouteState, StageKey } from './types'

export const STAGE_ORDER: StageKey[] = ['beginner', 'intermediate', 'advanced', 'finale']
export const GATES_PER_STAGE: Record<StageKey, number> = {
  beginner: 6,
  intermediate: 8,
  advanced: 12,
  finale: 16,
}

export function getStageGateCount(stageKey: StageKey): number {
  return GATES_PER_STAGE[stageKey]
}

export function getGateType(stageKey: StageKey, gateIndex: number): GateType {
  return gateIndex === getStageGateCount(stageKey) - 1 ? 'boss' : 'normal'
}

export function getGateId(stageKey: StageKey, gateIndex: number): string {
  return `${stageKey}-${gateIndex}`
}

export function createRouteState(startStage: StageKey = 'beginner'): RouteState {
  return {
    stageKey: startStage,
    startStageKey: startStage,
    gateIndex: 0,
    gateId: getGateId(startStage, 0),
    routeEnded: false,
    resolvedGateIds: [],
  }
}

export function advanceRouteOnce(routeState: RouteState, gateId: string): RouteState {
  if (routeState.routeEnded || gateId !== routeState.gateId || routeState.resolvedGateIds.includes(gateId)) {
    return routeState
  }

  const resolvedGateIds = [...routeState.resolvedGateIds, gateId]
  const nextGateIndex = routeState.gateIndex + 1

  if (nextGateIndex < getStageGateCount(routeState.stageKey)) {
    return {
      ...routeState,
      gateIndex: nextGateIndex,
      gateId: getGateId(routeState.stageKey, nextGateIndex),
      resolvedGateIds,
    }
  }

  const nextStageIndex = STAGE_ORDER.indexOf(routeState.stageKey) + 1

  if (nextStageIndex >= STAGE_ORDER.length) {
    return {
      ...routeState,
      routeEnded: true,
      resolvedGateIds,
    }
  }

  const nextStageKey = STAGE_ORDER[nextStageIndex]

  return {
    stageKey: nextStageKey,
    startStageKey: routeState.startStageKey,
    gateIndex: 0,
    gateId: getGateId(nextStageKey, 0),
    routeEnded: false,
    resolvedGateIds,
  }
}
