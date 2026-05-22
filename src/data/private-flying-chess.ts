export type HeartbeatLevel = 'beginner' | 'intermediate' | 'advanced' | 'finale'

export type HeartbeatCellType = 'normal' | 'double' | 'boost' | 'reverse' | 'choice' | 'rest' | 'reward' | 'penalty' | 'reroll'

export interface HeartbeatCell {
  index: number
  type: HeartbeatCellType
}

export interface HeartbeatCellMeta {
  label: string
  icon: string
  description: string
  tone: string
}

const SEGMENT_SIZE = 40

const CELL_BAG: readonly HeartbeatCellType[] = [
  'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal',
  'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal',
  'double', 'double', 'double', 'double', 'double',
  'boost', 'boost', 'boost', 'boost', 'boost',
  'reverse', 'reverse', 'reverse',
  'choice', 'choice', 'choice',
  'rest', 'rest', 'rest',
  'reward', 'reward',
  'penalty', 'penalty',
  'reroll',
]

export const heartbeatLevelOrder: readonly HeartbeatLevel[] = ['beginner', 'intermediate', 'advanced', 'finale']

export const heartbeatLevelLabels: Record<HeartbeatLevel, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
  finale: '最终',
}

export const heartbeatLevelDescriptions: Record<HeartbeatLevel, string> = {
  beginner: '调情、破冰、轻互动',
  intermediate: '升温、感官、轻度挑逗',
  advanced: '深度亲密、前戏阶段',
  finale: '最终亲密阶段、姿势与节奏切换',
}

export const heartbeatCellMeta: Record<HeartbeatCellType, HeartbeatCellMeta> = {
  normal: {
    label: '普通格',
    icon: '♡',
    description: '抽当前层级任务卡',
    tone: 'bg-white text-text-primary ring-warm-100',
  },
  double: {
    label: '双抽格',
    icon: '⧉',
    description: '抽两张，二选一',
    tone: 'bg-pink-50 text-pink-600 ring-pink-100',
  },
  boost: {
    label: '加码格',
    icon: '+',
    description: '抽卡并追加轻量条件',
    tone: 'bg-amber-50 text-amber-600 ring-amber-100',
  },
  reverse: {
    label: '反转格',
    icon: '⇄',
    description: '本回合玩家/伴侣身份互换',
    tone: 'bg-purple-50 text-purple-600 ring-purple-100',
  },
  choice: {
    label: '选择格',
    icon: '◇',
    description: '当前玩家获得一次轻选择权',
    tone: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
  rest: {
    label: '休息格',
    icon: '…',
    description: '不抽卡，自然缓冲',
    tone: 'bg-green-50 text-green-600 ring-green-100',
  },
  reward: {
    label: '奖励格',
    icon: '☆',
    description: '临时获得一次控制权或降强度',
    tone: 'bg-yellow-50 text-yellow-700 ring-yellow-100',
  },
  penalty: {
    label: '惩罚格',
    icon: '!',
    description: '本回合临时增加条件',
    tone: 'bg-red-50 text-red-600 ring-red-100',
  },
  reroll: {
    label: '再掷格',
    icon: '↻',
    description: '派发任务后当前玩家可再掷一次',
    tone: 'bg-sky-50 text-sky-600 ring-sky-100',
  },
}

export const heartbeatBoosts = [
  '加码：本回合动作放慢一点，保持更清楚的反馈。',
  '加码：当前玩家可以指定一个更舒服的节奏。',
  '加码：伴侣需要用一句话回应现在的感受。',
  '加码：任务开始前先靠近十秒钟。',
]

export const heartbeatRewards = [
  '奖励：当前玩家获得一次主导权。',
  '奖励：本回合可以把素材强度降低一档。',
  '奖励：当前玩家可以选择先被照顾，或先照顾伴侣。',
  '奖励：如果这张不适合，可以直接换一张同层素材。',
]

export const heartbeatPenalties = [
  '惩罚：本回合需要更慢、更认真地执行。',
  '惩罚：当前玩家先说出一个自己想要的细节。',
  '惩罚：本回合不能急着结束，至少保持一个完整节奏。',
  '惩罚：伴侣可以追加一个轻量条件。',
]

export const heartbeatChoices = [
  '选择：当前玩家可以选择正常执行、降低一档，或把主导权交给伴侣。',
  '选择：当前玩家可以选择抽卡、休息一轮，或交换双方角色。',
  '选择：当前玩家可以选择更温柔、更直接，或更慢一点。',
]

const seededShuffle = <T,>(items: readonly T[], seed: number): T[] => {
  const result = [...items]
  let value = (seed + 1) * 9301 + 49297

  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280
    const swapIndex = Math.floor((value / 233280) * (index + 1))
    const temp = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = temp
  }

  return result
}

export const generateHeartbeatSegment = (startIndex: number): HeartbeatCell[] => {
  const segmentNumber = Math.floor(startIndex / SEGMENT_SIZE)
  const shuffled = seededShuffle(CELL_BAG, segmentNumber)

  return shuffled.map((type, offset) => ({
    index: startIndex + offset,
    type,
  }))
}

export const ensureHeartbeatBoard = (board: readonly HeartbeatCell[], targetIndex: number): HeartbeatCell[] => {
  const next = [...board]
  let startIndex = Math.floor(next.length / SEGMENT_SIZE) * SEGMENT_SIZE

  while (targetIndex >= next.length) {
    next.push(...generateHeartbeatSegment(startIndex))
    startIndex += SEGMENT_SIZE
  }

  return next
}

export const getLowerHeartbeatLevel = (level: HeartbeatLevel): HeartbeatLevel => {
  const index = heartbeatLevelOrder.indexOf(level)
  return heartbeatLevelOrder[Math.max(0, index - 1)]
}
