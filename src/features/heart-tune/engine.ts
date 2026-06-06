import { heartTuneMaterials } from './materials'
import type {
  HeartTuneBoosts,
  HeartTuneLeadMeta,
  HeartTuneDrawOptions,
  HeartTuneMaterial,
  HeartTuneMode,
  HeartTuneModeMeta,
  HeartTunePlayerKey,
  HeartTuneProposal,
  HeartTuneRenderedCard,
  HeartTuneRule,
  HeartTuneRoundInput,
  HeartTuneRoundResult,
  HeartTuneScene,
  HeartTuneStage,
  HeartTuneStageMeta,
  HeartTuneVotes,
} from './types'

export const HEART_TUNE_STAGES: readonly HeartTuneStageMeta[] = [
  { key: 'flirt', label: '调情', description: '破冰、靠近、脱去外层防备。' },
  { key: 'foreplay', label: '前戏', description: '感官升温、敏感带试探、衣物减少。' },
  { key: 'deepening', label: '深入', description: '强前戏、主动服务、姿势准备。' },
  { key: 'finale', label: '最终', description: '正式姿势、结合节奏、场景收束。' },
]

export const HEART_TUNE_MODES: readonly HeartTuneModeMeta[] = [
  { key: 'directed', label: '主动卡', description: '一方发起具体动作。' },
  { key: 'response', label: '回应卡', description: '一方发起，另一方明确回应。' },
  { key: 'duo', label: '双人卡', description: '两人同时完成。' },
  { key: 'scene', label: '场景卡', description: '进入真实家居姿势和场景。' },
]

export const HEART_TUNE_LEADS: readonly HeartTuneLeadMeta[] = [
  { key: 'A', label: '大大怪主导', description: '本轮更偏向大大怪带节奏。' },
  { key: 'B', label: '小怪兽主导', description: '本轮更偏向小怪兽带节奏。' },
]

export const HEART_TUNE_RULES: readonly HeartTuneRule[] = [
  {
    key: 'a-decides',
    label: '听大大怪的',
    description: '左右同分时，采用大大怪支持的那边。',
    modeDecider: 'A',
    leadDecider: 'A',
  },
  {
    key: 'b-decides',
    label: '听小怪兽的',
    description: '左右同分时，采用小怪兽支持的那边。',
    modeDecider: 'B',
    leadDecider: 'B',
  },
  {
    key: 'turn-decides',
    label: '轮到谁谁拍板',
    description: '左右同分时，采用本轮轮值方支持的那边。',
    modeDecider: 'turn',
    leadDecider: 'turn',
  },
  {
    key: 'active-priority',
    label: '主动优先',
    description: '争夺时更偏向主动卡或回应卡。',
    modePriority: ['directed', 'response', 'scene', 'duo'],
    leadDecider: 'turn',
  },
  {
    key: 'together-priority',
    label: '贴近优先',
    description: '左右同分时，更偏向双人卡或场景卡。',
    modePriority: ['duo', 'scene', 'response', 'directed'],
    leadDecider: 'turn',
  },
  {
    key: 'fate-decides',
    label: '随机拍板',
    description: '左右同分时，随机采用其中一边。',
    modeDecider: 'fate',
    leadDecider: 'fate',
  },
]

export const HEART_TUNE_SCENES: readonly HeartTuneScene[] = [
  {
    key: 'same-wave',
    label: '同频局',
    description: '这一轮要读懂对方：两人支持同一个命题，就一起拿心动印记。',
    rewardText: '同选一个命题，双方各 +1。',
  },
  {
    key: 'split-bet',
    label: '争夺局',
    description: '这一轮鼓励站不同边：命题被采用的一方拿心动印记。',
    rewardText: '争夺成功的一方 +1。',
  },
  {
    key: 'lead-race',
    label: '抢拍局',
    description: '这一轮争主导：最终命题里的主导方拿心动印记。',
    rewardText: '最终主导方 +1。',
  },
  {
    key: 'give-and-take',
    label: '让渡局',
    description: '这一轮奖励让给对方：支持对方主导且命题生效的人拿心动印记。',
    rewardText: '让出主导且争夺成功的一方 +1。',
  },
  {
    key: 'close-range',
    label: '贴近局',
    description: '这一轮奖励亲近路线：最终出双人卡或场景卡时，双方都拿心动印记。',
    rewardText: '双人卡/场景卡被采用，双方各 +1。',
  },
  {
    key: 'reverse-read',
    label: '反读局',
    description: '这一轮适合反手：没拿到主导权，但自己支持的命题生效时拿心动印记。',
    rewardText: '非主导方争夺成功 +1。',
  },
]

export const createEmptyVotes = (): HeartTuneVotes => ({ A: null, B: null })

export const getStageMeta = (stage: HeartTuneStage): HeartTuneStageMeta =>
  HEART_TUNE_STAGES.find(item => item.key === stage) ?? HEART_TUNE_STAGES[0]

export const getModeMeta = (mode: HeartTuneMode): HeartTuneModeMeta =>
  HEART_TUNE_MODES.find(item => item.key === mode) ?? HEART_TUNE_MODES[0]

export const getLowerStage = (stage: HeartTuneStage): HeartTuneStage => {
  const index = HEART_TUNE_STAGES.findIndex(item => item.key === stage)
  return HEART_TUNE_STAGES[Math.max(0, index - 1)].key
}

export const getHigherStage = (stage: HeartTuneStage): HeartTuneStage => {
  const index = HEART_TUNE_STAGES.findIndex(item => item.key === stage)
  return HEART_TUNE_STAGES[Math.min(HEART_TUNE_STAGES.length - 1, index + 1)].key
}

export const getOtherPlayer = (player: HeartTunePlayerKey): HeartTunePlayerKey => player === 'A' ? 'B' : 'A'

export const drawHeartTuneRule = (previousKey?: string | null): HeartTuneRule => {
  const pool = HEART_TUNE_RULES.filter(rule => rule.key !== previousKey)
  return pool[Math.floor(Math.random() * pool.length)] ?? HEART_TUNE_RULES[0]
}

export const drawHeartTuneScene = (previousKey?: string | null): HeartTuneScene => {
  const pool = HEART_TUNE_SCENES.filter(scene => scene.key !== previousKey)
  return pool[Math.floor(Math.random() * pool.length)] ?? HEART_TUNE_SCENES[0]
}

export const drawCompatibleHeartTuneScene = (
  proposals: readonly [HeartTuneProposal, HeartTuneProposal],
  previousKey?: string | null,
): HeartTuneScene => {
  const compatible = HEART_TUNE_SCENES.filter(scene => scene.key !== previousKey && isSceneCompatible(scene, proposals))
  const pool = compatible.length > 0
    ? compatible
    : HEART_TUNE_SCENES.filter(scene => isSceneCompatible(scene, proposals))
  return pool[Math.floor(Math.random() * pool.length)] ?? HEART_TUNE_SCENES[0]
}

export function drawHeartTuneProposals(previous?: readonly HeartTuneProposal[]): [HeartTuneProposal, HeartTuneProposal] {
  const pairs = createProposalPairs()
  const previousSignature = previous ? getProposalPairSignature(previous) : null
  const pool = previousSignature && pairs.length > 1
    ? pairs.filter(pair => getProposalPairSignature(pair) !== previousSignature)
    : pairs
  const selected = pool[Math.floor(Math.random() * pool.length)] ?? pairs[0]
  return [
    { ...selected[0], key: 'A', label: '左命题' },
    { ...selected[1], key: 'B', label: '右命题' },
  ]
}

export function resolveTuneRound(input: HeartTuneRoundInput): HeartTuneRoundResult {
  if (!input.votes.A || !input.votes.B) {
    throw new Error('大大怪和小怪兽都需要先选择支持的命题')
  }

  const resolution = resolveProposal(input.proposals, input.votes, input.boosts, input.defaultLead, input.rule)
  const selectedProposal = resolution.proposal
  const leadPlayer = selectedProposal.leadPlayer
  const selectedBy = getSelectedBy(input.votes, selectedProposal.key)
  const candidate = {
    material: drawMaterialForLead(input.stage, selectedProposal.mode, leadPlayer, {
      usedIds: input.usedIds,
      blockedStates: input.completedStates,
    }),
    selectedBy,
  }
  const winners = resolveSceneWinners(input.scene, input.votes, selectedProposal)

  return {
    stage: input.stage,
    leadPlayer,
    modes: [selectedProposal.mode],
    candidates: [candidate],
    directSelection: true,
    rule: input.rule,
    ruleSummary: createRuleSummary(input.proposals, input.votes, input.boosts, selectedProposal, input.rule, resolution.usedRule),
    ruleUsed: resolution.usedRule,
    scene: input.scene,
    winners,
    rewardSummary: createRewardSummary(input.scene, winners),
    selectedProposal,
    selectedBy,
  }
}

export function drawMaterial(
  stage: HeartTuneStage,
  mode: HeartTuneMode,
  usedIdsOrOptions: readonly string[] | HeartTuneDrawOptions = [],
): HeartTuneMaterial {
  const options = normalizeDrawOptions(usedIdsOrOptions)
  const pool = heartTuneMaterials.filter(material => material.stage === stage && material.mode === mode)
  const candidates = selectDrawCandidates(pool, options)

  if (candidates.length === 0) {
    throw new Error(`没有找到 ${getStageMeta(stage).label} / ${getModeMeta(mode).label} 素材`)
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function drawMaterialForLead(
  stage: HeartTuneStage,
  mode: HeartTuneMode,
  leadPlayer: HeartTunePlayerKey,
  usedIdsOrOptions: readonly string[] | HeartTuneDrawOptions = [],
): HeartTuneMaterial {
  const options = normalizeDrawOptions(usedIdsOrOptions)
  const pool = heartTuneMaterials.filter(material =>
    material.stage === stage &&
    material.mode === mode &&
    materialMatchesLead(material, leadPlayer)
  )
  const candidates = selectDrawCandidates(pool, options)

  if (candidates.length === 0) {
    return drawMaterial(stage, mode, options)
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function getMaterialStateTags(material?: Pick<HeartTuneMaterial, 'stateTags'> | null): readonly string[] {
  return material?.stateTags ?? []
}

export function getMaterialBlockedStates(material?: Pick<HeartTuneMaterial, 'blockedByState'> | null): readonly string[] {
  return material?.blockedByState ?? []
}

export function isMaterialBlockedByState(
  material: Pick<HeartTuneMaterial, 'blockedByState'> | undefined | null,
  blockedStates: readonly string[],
): boolean {
  if (!material?.blockedByState?.length || blockedStates.length === 0) return false
  return material.blockedByState.some(tag => blockedStates.includes(tag))
}

export function renderHeartTuneCard(
  material: HeartTuneMaterial,
  leadPlayer: HeartTunePlayerKey,
  playerLabels: Record<HeartTunePlayerKey, string>,
  ruleSummary = '',
  ruleUsed = false,
  rewardSummary = '',
): HeartTuneRenderedCard {
  const partner = getOtherPlayer(leadPlayer)
  const text = material.rolePolicy === 'dynamic'
    ? material.text
      .replaceAll('玩家', playerLabels[leadPlayer])
      .replaceAll('伴侣', playerLabels[partner])
    : material.text

  return {
    materialId: material.id,
    stage: material.stage,
    mode: material.mode,
    title: material.title,
    text,
    stageLabel: material.stageLabel,
    modeLabel: material.modeLabel,
    rolePolicy: material.rolePolicy,
    leadLabel: playerLabels[leadPlayer],
    ruleSummary,
    ruleUsed,
    rewardSummary,
    stateTags: material.stateTags,
    blockedByState: material.blockedByState,
    sourceBatch: material.sourceBatch,
  }
}

function normalizeDrawOptions(usedIdsOrOptions: readonly string[] | HeartTuneDrawOptions): Required<HeartTuneDrawOptions> {
  if (Array.isArray(usedIdsOrOptions)) {
    return {
      usedIds: usedIdsOrOptions,
      blockedStates: [],
      avoidBlockedStates: true,
    }
  }

  const options = usedIdsOrOptions as HeartTuneDrawOptions
  return {
    usedIds: options.usedIds ?? [],
    blockedStates: options.blockedStates ?? [],
    avoidBlockedStates: options.avoidBlockedStates ?? true,
  }
}

function selectDrawCandidates(
  pool: readonly HeartTuneMaterial[],
  options: Required<HeartTuneDrawOptions>,
): readonly HeartTuneMaterial[] {
  const freshPool = pool.filter(material => !options.usedIds.includes(material.id))
  if (!options.avoidBlockedStates) return freshPool.length > 0 ? freshPool : pool

  const freshStateSafePool = freshPool.filter(material => !isMaterialBlockedByState(material, options.blockedStates))
  if (freshStateSafePool.length > 0) return freshStateSafePool

  const stateSafePool = pool.filter(material => !isMaterialBlockedByState(material, options.blockedStates))
  if (stateSafePool.length > 0) return stateSafePool

  return freshPool.length > 0 ? freshPool : pool
}

function resolveProposal(
  proposals: readonly [HeartTuneProposal, HeartTuneProposal],
  votes: HeartTuneVotes,
  boosts: HeartTuneBoosts,
  defaultLead: HeartTunePlayerKey,
  rule: HeartTuneRule,
): { proposal: HeartTuneProposal; usedRule: boolean } {
  const scores = getProposalScores(votes, boosts)
  const topKeys = proposals
    .map(proposal => proposal.key)
    .filter(key => scores[key] === Math.max(...proposals.map(proposal => scores[proposal.key])))

  if (topKeys.length === 1) return { proposal: getProposal(proposals, topKeys[0]), usedRule: false }

  if (rule.modePriority) {
    const byMode = rule.modePriority
      .map(mode => proposals.find(proposal => topKeys.includes(proposal.key) && proposal.mode === mode))
      .find(Boolean)
    if (byMode) return { proposal: byMode, usedRule: true }
  }

  if (rule.modeDecider === 'A' || rule.modeDecider === 'B') {
    return { proposal: getProposal(proposals, votes[rule.modeDecider] ?? topKeys[0]), usedRule: true }
  }
  if (rule.modeDecider === 'fate') {
    return { proposal: getProposal(proposals, topKeys[Math.floor(Math.random() * topKeys.length)]), usedRule: true }
  }
  return { proposal: getProposal(proposals, votes[defaultLead] ?? topKeys[0]), usedRule: true }
}

function createRuleSummary(
  proposals: readonly [HeartTuneProposal, HeartTuneProposal],
  votes: HeartTuneVotes,
  boosts: HeartTuneBoosts,
  selectedProposal: HeartTuneProposal,
  rule: HeartTuneRule,
  usedRule: boolean,
): string {
  const scores = getProposalScores(votes, boosts)
  const scoreText = proposals.map(proposal => `${proposal.label} ${scores[proposal.key]}`).join(' : ')
  const boostText = Object.values(boosts).some(Boolean) ? '，加码已计入分数' : ''
  if (!usedRule) return `${scoreText}，采用${selectedProposal.label}${boostText}。`
  return `${scoreText}，左右同分时暗牌「${rule.label}」生效，采用${selectedProposal.label}${boostText}。`
}

function resolveSceneWinners(
  scene: HeartTuneScene,
  votes: HeartTuneVotes,
  selectedProposal: HeartTuneProposal,
): readonly HeartTunePlayerKey[] {
  switch (scene.key) {
    case 'same-wave':
      return votes.A && votes.A === votes.B ? ['A', 'B'] : []
    case 'split-bet':
      return votes.A !== votes.B ? playerKeys.filter(player => votes[player] === selectedProposal.key) : []
    case 'lead-race':
      return [selectedProposal.leadPlayer]
    case 'give-and-take':
      return playerKeys.filter(player => votes[player] === selectedProposal.key && selectedProposal.leadPlayer !== player)
    case 'close-range':
      return selectedProposal.mode === 'duo' || selectedProposal.mode === 'scene' ? ['A', 'B'] : []
    case 'reverse-read':
      return playerKeys.filter(player => votes[player] === selectedProposal.key && selectedProposal.leadPlayer !== player)
    default:
      return []
  }
}

function createRewardSummary(scene: HeartTuneScene, winners: readonly HeartTunePlayerKey[]): string {
  if (winners.length === 0) return `「${scene.label}」无人命中，本轮不加心动印记。`
  const label = winners.length === 2 ? '双方' : winners[0]
  return `「${scene.label}」命中：${label} 获得心动印记。`
}

function getProposalScores(votes: HeartTuneVotes, boosts: HeartTuneBoosts): Record<'A' | 'B', number> {
  const scores: Record<'A' | 'B', number> = { A: 0, B: 0 }

  for (const player of playerKeys) {
    const vote = votes[player]
    if (vote) scores[vote] += 1
    const boost = boosts[player]
    if (boost) scores[boost] += 1
  }

  return scores
}

function getProposal(proposals: readonly [HeartTuneProposal, HeartTuneProposal], key: 'A' | 'B'): HeartTuneProposal {
  return proposals.find(proposal => proposal.key === key) ?? proposals[0]
}

function createProposalPairs(): readonly [HeartTuneProposal, HeartTuneProposal][] {
  const base = HEART_TUNE_MODES.flatMap(mode =>
    playerKeys.map(leadPlayer => ({ mode: mode.key, leadPlayer })),
  )

  return base.flatMap(first =>
    base
      .filter(second => second.mode !== first.mode || second.leadPlayer !== first.leadPlayer)
      .map(second => [
        { key: 'A', label: '左命题', ...first },
        { key: 'B', label: '右命题', ...second },
      ] as [HeartTuneProposal, HeartTuneProposal]),
  )
}

function getProposalPairSignature(proposals: readonly HeartTuneProposal[]): string {
  return proposals.map(proposal => `${proposal.mode}:${proposal.leadPlayer}`).join('|')
}

function getSelectedBy(votes: HeartTuneVotes, selectedKey: 'A' | 'B'): HeartTunePlayerKey | 'both' | 'rule' {
  const supporters = playerKeys.filter(player => votes[player] === selectedKey)
  if (supporters.length === 2) return 'both'
  return supporters[0] ?? 'rule'
}

function materialMatchesLead(material: HeartTuneMaterial, leadPlayer: HeartTunePlayerKey): boolean {
  if (material.rolePolicy !== 'fixed') return true

  const text = `${material.title} ${material.text}`
  const bigIndex = text.indexOf('大大怪')
  const littleIndex = text.indexOf('小怪兽')

  if (bigIndex < 0 && littleIndex < 0) return true
  if (bigIndex >= 0 && littleIndex < 0) return leadPlayer === 'A'
  if (littleIndex >= 0 && bigIndex < 0) return leadPlayer === 'B'
  return leadPlayer === (bigIndex < littleIndex ? 'A' : 'B')
}

function isSceneCompatible(
  scene: HeartTuneScene,
  proposals: readonly [HeartTuneProposal, HeartTuneProposal],
): boolean {
  const hasDifferentVotes = proposals[0].key !== proposals[1].key
  const hasLeadChoice = proposals[0].leadPlayer !== proposals[1].leadPlayer
  const hasCloseRoute = proposals.some(proposal => proposal.mode === 'duo' || proposal.mode === 'scene')

  switch (scene.key) {
    case 'same-wave':
    case 'split-bet':
      return hasDifferentVotes
    case 'lead-race':
    case 'give-and-take':
    case 'reverse-read':
      return hasLeadChoice
    case 'close-range':
      return hasCloseRoute
    default:
      return true
  }
}

const playerKeys: readonly HeartTunePlayerKey[] = ['A', 'B']
