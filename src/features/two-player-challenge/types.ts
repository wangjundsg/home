export type StageKey = 'beginner' | 'intermediate' | 'advanced' | 'finale'
export type GateType = 'normal' | 'boss'
export type PlayerKey = 'A' | 'B'
export type MeterStatus = 'ready' | 'running' | 'settled' | 'disabled'
export type ResultKey = 'perfect-sync' | 'heart-hit' | 'near-miss' | 'overheat' | 'cooldown'
export type TaskMode = 'directed' | 'response' | 'duo' | 'scene'
export type TaskModifier = 'reverse' | 'add-on' | 'cooldown'

export const stageLabels: Record<StageKey, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
  finale: '最终',
}

export const taskModeLabels: Record<TaskMode, string> = {
  directed: '定向任务',
  response: '回应任务',
  duo: '共同任务',
  scene: '场景任务',
}

export const resultLabels: Record<ResultKey, string> = {
  'perfect-sync': '完美同步',
  'heart-hit': '心动达成',
  'near-miss': '擦肩而过',
  overheat: '过热',
  cooldown: '冷却',
}

export interface RouteState {
  stageKey: StageKey
  startStageKey: StageKey
  gateIndex: number
  gateId: string
  routeEnded: boolean
  resolvedGateIds: string[]
}

export interface TargetZone {
  low: number
  high: number
  center: number
  width: number
}

export interface PlayerLock {
  playerKey: PlayerKey
  value: number
}

export type LocksByPlayer = Record<PlayerKey, number | null>

export interface MeterParams {
  speed: number
  targetWidth: number
  targetCenter: number
}

export interface GateProfile extends MeterParams {
  stageKey: StageKey
  gateIndex: number
  gateType: GateType
  gateCount: number
  pressureLabel: string
  objectiveLabel: string
}

export interface GateResult {
  gateId: string
  resultKey: ResultKey
  locksByPlayer: Record<PlayerKey, number>
  targetZone: TargetZone
  center: number
  gap: number
}

export interface IdentityAssignment {
  taskMode: TaskMode
  actorKey: PlayerKey | null
  targetKey: PlayerKey | null
  bothKeys: PlayerKey[]
  modifiers: TaskModifier[]
  triggerLabel: string
  triggerReason: string
  labels: {
    actor: string | null
    target: string | null
    both: string
  }
}

export interface ChallengeMaterial {
  id: string
  stageKey: StageKey
  taskMode: TaskMode
  title: string
  template: string
  intensity: 1 | 2 | 3 | 4 | 5
  tags: string[]
  curated: boolean
  source?: string
  notes?: string
}

export interface RenderedTask {
  materialId: string
  title: string
  text: string
  triggerLabel: string
  triggerReason: string
  warnings: string[]
}

export interface TemplateRenderResult {
  ok: boolean
  task: RenderedTask | null
  errors: string[]
  warnings: string[]
}
