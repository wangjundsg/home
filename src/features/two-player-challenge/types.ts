export type StageKey = 'beginner' | 'intermediate' | 'advanced' | 'finale'
export type IntimacyStageKey = 'flirt' | 'foreplay' | 'deepening' | 'sex'
export type GateType = 'normal' | 'boss'
export type PlayerKey = 'A' | 'B'
export type MeterStatus = 'ready' | 'running' | 'settled' | 'disabled'
export type ResultKey = 'perfect-sync' | 'heart-hit' | 'near-miss' | 'overheat' | 'cooldown'
export type TaskMode = 'directed' | 'response' | 'duo' | 'scene'
export type TaskModifier = 'reverse' | 'add-on' | 'cooldown'
export type ChallengeTaskKind = 'result-task' | 'remedy-task'
export type ChallengeMechanicType = 'reaction-stop' | 'choice-sync' | 'rhythm-chain' | 'dynamic-gate' | 'boss-gate'
export type ChallengeOutcomeKey = 'success' | 'partial' | 'miss' | 'blocked' | 'boss-clear' | 'boss-failed'

export const stageLabels: Record<StageKey, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
  finale: '最终',
}

export const intimacyStageLabels: Record<IntimacyStageKey, string> = {
  flirt: '调情',
  foreplay: '前戏',
  deepening: '深入',
  sex: '做爱',
}

export const intimacyStageDescriptions: Record<IntimacyStageKey, string> = {
  flirt: '先把眼神和语言点亮，让气氛慢慢升起来。',
  foreplay: '把靠近变成探索，让彼此的反应带路。',
  deepening: '开始练习配合，用节奏和回应把距离拉近。',
  sex: '把前面的默契收束成完整的一次共同完成。',
}

export const intimacyStageMaterialMap: Record<IntimacyStageKey, StageKey> = {
  flirt: 'beginner',
  foreplay: 'intermediate',
  deepening: 'advanced',
  sex: 'finale',
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

export const challengeMechanicLabels: Record<ChallengeMechanicType, string> = {
  'reaction-stop': '反应停点',
  'choice-sync': '默契选择',
  'rhythm-chain': '节奏连击',
  'dynamic-gate': '动态同步门',
  'boss-gate': 'Boss 机关门',
}

export const challengeOutcomeLabels: Record<ChallengeOutcomeKey, string> = {
  success: '顺利命中',
  partial: '差一点同步',
  miss: '偏离目标',
  blocked: '撞上障碍',
  'boss-clear': 'Boss 通过',
  'boss-failed': 'Boss 未过',
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
  outcomeKey: ChallengeOutcomeKey
  mechanicType: ChallengeMechanicType
  isBoss: boolean
  retryAfterRemedy: boolean
  blocked: boolean
  locksByPlayer: Record<PlayerKey, number>
  targetZone: TargetZone
  center: number
  gap: number
  hitByPlayer: Record<PlayerKey, boolean>
  passed: boolean
  taskBranch: TaskMode
  feedbackTitle: string
  feedbackText: string
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
  kind: ChallengeTaskKind
  warnings: string[]
}

export interface TemplateRenderResult {
  ok: boolean
  task: RenderedTask | null
  errors: string[]
  warnings: string[]
}
