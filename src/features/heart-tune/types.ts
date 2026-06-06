export type HeartTuneStage = 'flirt' | 'foreplay' | 'deepening' | 'finale'
export type HeartTuneMode = 'directed' | 'response' | 'duo' | 'scene'
export type HeartTunePlayerKey = 'A' | 'B'
export type HeartTuneProposalKey = 'A' | 'B'
export type HeartTuneRolePolicy = 'dynamic' | 'fixed' | 'none'
export type HeartTuneMaterialSourceBatch = 'new-480' | 'legacy-selected' | 'interaction-selected'
export type HeartTuneRuleKey = 'a-decides' | 'b-decides' | 'turn-decides' | 'active-priority' | 'together-priority' | 'fate-decides'
export type HeartTuneSceneKey = 'same-wave' | 'split-bet' | 'lead-race' | 'give-and-take' | 'close-range' | 'reverse-read'

export interface HeartTuneMaterial {
  id: string
  stage: HeartTuneStage
  stageLabel: string
  mode: HeartTuneMode
  modeLabel: string
  title: string
  text: string
  rolePolicy: HeartTuneRolePolicy
  source: string
  stateTags?: readonly string[]
  blockedByState?: readonly string[]
  sourceBatch?: HeartTuneMaterialSourceBatch
}

export interface HeartTuneDrawOptions {
  usedIds?: readonly string[]
  blockedStates?: readonly string[]
  avoidBlockedStates?: boolean
}

export interface HeartTuneStageMeta {
  key: HeartTuneStage
  label: string
  description: string
}

export interface HeartTuneModeMeta {
  key: HeartTuneMode
  label: string
  description: string
}

export interface HeartTuneLeadMeta {
  key: HeartTunePlayerKey
  label: string
  description: string
}

export interface HeartTuneProposal {
  key: HeartTuneProposalKey
  mode: HeartTuneMode
  leadPlayer: HeartTunePlayerKey
  label: string
}

export type HeartTuneVotes = Record<HeartTunePlayerKey, HeartTuneProposalKey | null>
export type HeartTuneBoosts = Partial<Record<HeartTunePlayerKey, HeartTuneProposalKey>>

export interface HeartTuneRule {
  key: HeartTuneRuleKey
  label: string
  description: string
  modePriority?: readonly HeartTuneMode[]
  modeDecider?: HeartTunePlayerKey | 'turn' | 'fate'
  leadDecider: HeartTunePlayerKey | 'turn' | 'fate'
}

export interface HeartTuneScene {
  key: HeartTuneSceneKey
  label: string
  description: string
  rewardText: string
}

export interface HeartTuneRoundInput {
  stage: HeartTuneStage
  defaultLead: HeartTunePlayerKey
  proposals: readonly [HeartTuneProposal, HeartTuneProposal]
  votes: HeartTuneVotes
  boosts: HeartTuneBoosts
  usedIds: readonly string[]
  rule: HeartTuneRule
  scene: HeartTuneScene
  completedStates?: readonly string[]
}

export interface HeartTuneCandidate {
  material: HeartTuneMaterial
  selectedBy: HeartTunePlayerKey | 'both' | 'rule'
}

export interface HeartTuneRoundResult {
  stage: HeartTuneStage
  leadPlayer: HeartTunePlayerKey
  modes: readonly HeartTuneMode[]
  candidates: readonly HeartTuneCandidate[]
  directSelection: boolean
  rule: HeartTuneRule
  ruleSummary: string
  ruleUsed: boolean
  scene: HeartTuneScene
  winners: readonly HeartTunePlayerKey[]
  rewardSummary: string
  selectedProposal: HeartTuneProposal
  selectedBy: HeartTunePlayerKey | 'both' | 'rule'
}

export interface HeartTuneRenderedCard {
  materialId: string
  stage: HeartTuneStage
  mode: HeartTuneMode
  title: string
  text: string
  stageLabel: string
  modeLabel: string
  rolePolicy: HeartTuneRolePolicy
  leadLabel: string
  ruleSummary: string
  ruleUsed: boolean
  rewardSummary: string
  stateTags?: readonly string[]
  blockedByState?: readonly string[]
  sourceBatch?: HeartTuneMaterialSourceBatch
}
