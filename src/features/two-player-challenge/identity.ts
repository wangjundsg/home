import { taskModeLabels } from './types'
import type { GateResult, IdentityAssignment, PlayerKey } from './types'

interface PlayerLabels {
  A: string
  B: string
}

export function createIdentityAssignment(result: GateResult, playerLabels: PlayerLabels): IdentityAssignment {
  const both = `${playerLabels.A}和${playerLabels.B}`

  if (result.resultKey === 'perfect-sync') {
    return {
      taskMode: 'duo',
      actorKey: null,
      targetKey: null,
      bothKeys: ['A', 'B'],
      modifiers: ['add-on'],
      triggerLabel: taskModeLabels.duo,
      triggerReason: '两次锁定都贴近中心并且彼此很近，所以进入共同任务。',
      labels: { actor: null, target: null, both },
    }
  }

  if (result.resultKey === 'heart-hit') {
    const actorKey = getCloserPlayer(result, 'A')
    const targetKey = getOtherPlayer(actorKey)
    const actorLabel = playerLabels[actorKey]

    return {
      taskMode: 'directed',
      actorKey,
      targetKey,
      bothKeys: ['A', 'B'],
      modifiers: ['add-on'],
      triggerLabel: taskModeLabels.directed,
      triggerReason: `${actorLabel}更靠近中心，这一关由${actorLabel}带节奏。`,
      labels: { actor: actorLabel, target: playerLabels[targetKey], both },
    }
  }

  if (result.resultKey === 'near-miss') {
    const actorKey = getFartherPlayer(result, 'B')
    const targetKey = getOtherPlayer(actorKey)

    return {
      taskMode: 'response',
      actorKey,
      targetKey,
      bothKeys: ['A', 'B'],
      modifiers: ['reverse'],
      triggerLabel: taskModeLabels.response,
      triggerReason: '两次锁定差一点同步，需要一方接住另一方。',
      labels: { actor: playerLabels[actorKey], target: playerLabels[targetKey], both },
    }
  }

  const overheated = result.resultKey === 'overheat'

  return {
    taskMode: 'scene',
    actorKey: null,
    targetKey: null,
    bothKeys: ['A', 'B'],
    modifiers: ['cooldown'],
    triggerLabel: taskModeLabels.scene,
    triggerReason: overheated ? '节奏冲过头，先用场景任务重新对齐。' : '节奏偏离较远，先用场景任务重新靠近。',
    labels: { actor: null, target: null, both },
  }
}

function getCloserPlayer(result: GateResult, tieBreaker: PlayerKey): PlayerKey {
  const distanceA = Math.abs(result.locksByPlayer.A - result.targetZone.center)
  const distanceB = Math.abs(result.locksByPlayer.B - result.targetZone.center)

  if (distanceA === distanceB) return tieBreaker
  return distanceA < distanceB ? 'A' : 'B'
}

function getFartherPlayer(result: GateResult, tieBreaker: PlayerKey): PlayerKey {
  const distanceA = Math.abs(result.locksByPlayer.A - result.targetZone.center)
  const distanceB = Math.abs(result.locksByPlayer.B - result.targetZone.center)

  if (distanceA === distanceB) return tieBreaker
  return distanceA > distanceB ? 'A' : 'B'
}

function getOtherPlayer(playerKey: PlayerKey): PlayerKey {
  return playerKey === 'A' ? 'B' : 'A'
}
