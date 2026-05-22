import goodSheet from '../assets/emotion-characters/good-sheet.png'
import sweetSheet from '../assets/emotion-characters/sweet-sheet.png'
import cloudySheet from '../assets/emotion-characters/cloudy-sheet.png'

export type EmotionCategoryId = 'good' | 'sweet' | 'cloudy'

type EmotionSpriteSheetId = 'good' | 'sweet' | 'cloudy'

export interface EmotionSpriteRect {
  x: number
  y: number
  width: number
  height: number
}

export interface EmotionSpriteConfig {
  sheet: EmotionSpriteSheetId
  src: string
  rect: EmotionSpriteRect
}

export interface EmotionCategory {
  id: EmotionCategoryId
  label: string
  shortLabel: string
  description: string
}

export interface EmotionCharacterState {
  id: string
  category: EmotionCategoryId
  label: string
  shortLabel: string
  description: string
  placeholder: string
}

export const DEFAULT_EMOTION_STATE_ID = 'calm'

export const EMOTION_CATEGORIES: EmotionCategory[] = [
  {
    id: 'good',
    label: '我们都好',
    shortLabel: '都好',
    description: '风平浪静的一天，关系稳稳地亮着小灯。',
  },
  {
    id: 'sweet',
    label: '我们的小确幸',
    shortLabel: '小确幸',
    description: '把今天甜甜的瞬间存进小花园。',
  },
  {
    id: 'cloudy',
    label: '心里有个小乌云',
    shortLabel: '小乌云',
    description: '先接住情绪，再慢慢把话说清楚。',
  },
]

export const EMOTION_CHARACTER_STATES: EmotionCharacterState[] = [
  {
    id: 'calm',
    category: 'good',
    label: '平静待机',
    shortLabel: '平静',
    description: '今天的我们平平稳稳，也是一种很安心的甜。',
    placeholder: 'calm',
  },
  {
    id: 'thinking',
    category: 'good',
    label: '思考中',
    shortLabel: '思考',
    description: '现在可以安静想一想，不急着马上给答案。',
    placeholder: 'thinking',
  },
  {
    id: 'sleeping',
    category: 'good',
    label: '睡觉睡觉',
    shortLabel: '睡觉',
    description: '今天先好好休息，爱也需要充满电。',
    placeholder: 'sleeping',
  },
  {
    id: 'studying',
    category: 'good',
    label: '一起学习',
    shortLabel: '学习',
    description: '各自努力的时候，也是在一起往前走。',
    placeholder: 'studying',
  },
  {
    id: 'movie',
    category: 'good',
    label: '看电影',
    shortLabel: '电影',
    description: '一起放松一下，把今天调成柔软频道。',
    placeholder: 'movie',
  },
  {
    id: 'travel',
    category: 'good',
    label: '一起旅行',
    shortLabel: '旅行',
    description: '把期待放进行李箱，下一站还是我们。',
    placeholder: 'travel',
  },
  {
    id: 'empty_mind',
    category: 'good',
    label: '放空',
    shortLabel: '放空',
    description: '把脑袋轻轻清空，和你一起慢慢待着。',
    placeholder: 'calm',
  },
  {
    id: 'smooth',
    category: 'good',
    label: '顺利',
    shortLabel: '顺利',
    description: '今天走得很顺，想把这份轻快告诉你。',
    placeholder: 'calm',
  },
  {
    id: 'content',
    category: 'good',
    label: '满足',
    shortLabel: '满足',
    description: '不需要很热闹，这一刻已经刚刚好。',
    placeholder: 'calm',
  },
  {
    id: 'rest',
    category: 'good',
    label: '休息',
    shortLabel: '休息',
    description: '先把节奏放慢一点，爱也可以安静充电。',
    placeholder: 'sleeping',
  },
  {
    id: 'relaxed',
    category: 'good',
    label: '轻松',
    shortLabel: '轻松',
    description: '心里松松软软的，像被温柔包住。',
    placeholder: 'calm',
  },
  {
    id: 'nap',
    category: 'good',
    label: '午睡',
    shortLabel: '午睡',
    description: '小睡一会儿，醒来还是想靠近你。',
    placeholder: 'sleeping',
  },
  {
    id: 'reading',
    category: 'good',
    label: '看书',
    shortLabel: '看书',
    description: '安静读一页，也把想你夹进书里。',
    placeholder: 'studying',
  },
  {
    id: 'holding_hands',
    category: 'sweet',
    label: '牵手',
    shortLabel: '牵手',
    description: '牵一下手，很多话就不用急着说完。',
    placeholder: 'holding-hands',
  },
  {
    id: 'hug',
    category: 'sweet',
    label: '拥抱',
    shortLabel: '拥抱',
    description: '今天想靠近一点，让拥抱替我们充电。',
    placeholder: 'hug',
  },
  {
    id: 'kiss',
    category: 'sweet',
    label: '亲亲',
    shortLabel: '亲亲',
    description: '亲亲一下，把甜度悄悄加满。',
    placeholder: 'kiss',
  },
  {
    id: 'cuddle',
    category: 'sweet',
    label: '甜蜜依偎',
    shortLabel: '依偎',
    description: '想贴近你，像小猫靠在暖暖的枕头上。',
    placeholder: 'cuddle',
  },
  {
    id: 'head_pat',
    category: 'sweet',
    label: '摸头杀',
    shortLabel: '摸头',
    description: '被温柔照顾一下，心就会软下来。',
    placeholder: 'head-pat',
  },
  {
    id: 'happy_jump',
    category: 'sweet',
    label: '开心跳跃',
    shortLabel: '开心',
    description: '今天有好开心的事，想第一时间告诉你。',
    placeholder: 'happy-jump',
  },
  {
    id: 'blush',
    category: 'sweet',
    label: '害羞脸红',
    shortLabel: '害羞',
    description: '被你说中了心事，脸红也要装作没事。',
    placeholder: 'blush',
  },
  {
    id: 'miss_you',
    category: 'sweet',
    label: '想你中',
    shortLabel: '想你',
    description: '今天的想念冒出来了，想让你知道。',
    placeholder: 'miss-you',
  },
  {
    id: 'sweet_moment',
    category: 'sweet',
    label: '甜蜜',
    shortLabel: '甜蜜',
    description: '今天有一点甜，想悄悄存进我们的小花园。',
    placeholder: 'cuddle',
  },
  {
    id: 'companionship',
    category: 'sweet',
    label: '陪伴',
    shortLabel: '陪伴',
    description: '有你陪着，普通时间也会发光。',
    placeholder: 'holding-hands',
  },
  {
    id: 'fondness',
    category: 'sweet',
    label: '喜欢',
    shortLabel: '喜欢',
    description: '喜欢又冒出来了，想认真告诉你。',
    placeholder: 'blush',
  },
  {
    id: 'heartbeat',
    category: 'sweet',
    label: '心动',
    shortLabel: '心动',
    description: '某个瞬间心跳快了一下，因为是你。',
    placeholder: 'blush',
  },
  {
    id: 'angry',
    category: 'cloudy',
    label: '生气',
    shortLabel: '生气',
    description: '现在有火气，先别互相刺伤，慢慢来。',
    placeholder: 'angry',
  },
  {
    id: 'wronged',
    category: 'cloudy',
    label: '小委屈',
    shortLabel: '委屈',
    description: '不是想吵，只是希望这份难过能被看见。',
    placeholder: 'wronged',
  },
  {
    id: 'anxious',
    category: 'cloudy',
    label: '焦虑',
    shortLabel: '焦虑',
    description: '心里有点乱，先慢慢呼吸，把节奏找回来。',
    placeholder: 'insecure',
  },
  {
    id: 'arguing',
    category: 'cloudy',
    label: '吵架中',
    shortLabel: '吵架',
    description: '先暂停攻击，我们是在解决问题，不是在打败彼此。',
    placeholder: 'arguing',
  },
  {
    id: 'cooling_down',
    category: 'cloudy',
    label: '冷静中',
    shortLabel: '冷静',
    description: '先给情绪一点空间，等心软一点再说。',
    placeholder: 'cooling-down',
  },
  {
    id: 'apologizing',
    category: 'cloudy',
    label: '道歉中',
    shortLabel: '道歉',
    description: '愿意低头修复的人，也是在认真守护我们。',
    placeholder: 'apologizing',
  },
  {
    id: 'comforting',
    category: 'cloudy',
    label: '安慰中',
    shortLabel: '安慰',
    description: '先抱抱情绪，再把误会一块一块拆开。',
    placeholder: 'comforting',
  },
  {
    id: 'need_hug',
    category: 'cloudy',
    label: '想被抱抱',
    shortLabel: '抱抱',
    description: '现在不一定需要道理，可能只是很需要一个抱抱。',
    placeholder: 'need-hug',
  },
  {
    id: 'lonely',
    category: 'cloudy',
    label: '孤独',
    shortLabel: '孤独',
    description: '有点孤单的时候，也可以被温柔接住。',
    placeholder: 'need-hug',
  },
  {
    id: 'sad',
    category: 'cloudy',
    label: '难过',
    shortLabel: '难过',
    description: '今天有点难过，希望这份心情能被轻轻抱住。',
    placeholder: 'wronged',
  },
  {
    id: 'low_battery',
    category: 'cloudy',
    label: '难过掉电',
    shortLabel: '掉电',
    description: '能量有点低，今天请对彼此更轻一点。',
    placeholder: 'low-battery',
  },
  {
    id: 'stressed',
    category: 'cloudy',
    label: '压力',
    shortLabel: '压力',
    description: '压力有点重，先把肩膀放松一点。',
    placeholder: 'low-battery',
  },
  {
    id: 'jealous',
    category: 'cloudy',
    label: '吃醋中',
    shortLabel: '吃醋',
    description: '醋意背后也许是想被坚定选择。',
    placeholder: 'jealous',
  },
  {
    id: 'insecure',
    category: 'cloudy',
    label: '不安害怕',
    shortLabel: '不安',
    description: '给彼此一点确认感，让心慢慢落地。',
    placeholder: 'insecure',
  },
]

const EMOTION_SPRITE_LIBRARY: Record<EmotionSpriteSheetId, string> = {
  good: goodSheet,
  sweet: sweetSheet,
  cloudy: cloudySheet,
}

const GOOD_RECTS = {
  calm: { x: 48, y: 28, width: 304, height: 252 },
  thinking: { x: 448, y: 28, width: 304, height: 252 },
  movie: { x: 848, y: 28, width: 304, height: 252 },
  travel: { x: 48, y: 418, width: 304, height: 252 },
  sleeping: { x: 448, y: 418, width: 304, height: 252 },
  studying: { x: 848, y: 418, width: 304, height: 252 },
} as const

const SWEET_RECTS = {
  holding_hands: { x: 8, y: 0, width: 330, height: 304 },
  hug: { x: 346, y: 0, width: 330, height: 304 },
  kiss: { x: 686, y: 0, width: 330, height: 304 },
  cuddle: { x: 8, y: 296, width: 330, height: 304 },
  head_pat: { x: 346, y: 296, width: 330, height: 304 },
  happy_jump: { x: 686, y: 296, width: 330, height: 304 },
  blush: { x: 150, y: 612, width: 330, height: 304 },
  miss_you: { x: 540, y: 612, width: 330, height: 304 },
} as const

const CLOUDY_RECTS = {
  angry: { x: 10, y: 96, width: 220, height: 300 },
  wronged: { x: 250, y: 96, width: 220, height: 300 },
  arguing: { x: 490, y: 96, width: 220, height: 300 },
  'cooling-down': { x: 730, y: 96, width: 220, height: 300 },
  apologizing: { x: 970, y: 96, width: 220, height: 300 },
  comforting: { x: 10, y: 420, width: 220, height: 300 },
  'need-hug': { x: 250, y: 420, width: 220, height: 300 },
  jealous: { x: 490, y: 420, width: 220, height: 300 },
  'low-battery': { x: 730, y: 420, width: 220, height: 300 },
  insecure: { x: 970, y: 420, width: 220, height: 300 },
} as const

const EMOTION_SPRITE_BY_STATE_ID: Record<string, EmotionSpriteConfig> = {
  calm: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.calm },
  thinking: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.thinking },
  sleeping: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.sleeping },
  studying: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.studying },
  movie: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.movie },
  travel: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.travel },
  empty_mind: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.calm },
  smooth: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.calm },
  content: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.calm },
  rest: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.sleeping },
  relaxed: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.calm },
  nap: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.sleeping },
  reading: { sheet: 'good', src: EMOTION_SPRITE_LIBRARY.good, rect: GOOD_RECTS.studying },

  holding_hands: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.holding_hands },
  hug: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.hug },
  kiss: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.kiss },
  cuddle: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.cuddle },
  head_pat: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.head_pat },
  happy_jump: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.happy_jump },
  blush: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.blush },
  miss_you: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.miss_you },
  sweet_moment: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.cuddle },
  companionship: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.holding_hands },
  fondness: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.blush },
  heartbeat: { sheet: 'sweet', src: EMOTION_SPRITE_LIBRARY.sweet, rect: SWEET_RECTS.blush },

  angry: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS.angry },
  wronged: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS['need-hug'] },
  anxious: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS['need-hug'] },
  arguing: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS.arguing },
  cooling_down: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS['cooling-down'] },
  apologizing: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS.apologizing },
  comforting: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS.comforting },
  need_hug: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS['need-hug'] },
  lonely: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS['need-hug'] },
  sad: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS['need-hug'] },
  low_battery: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS['low-battery'] },
  stressed: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS['low-battery'] },
  jealous: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS.jealous },
  insecure: { sheet: 'cloudy', src: EMOTION_SPRITE_LIBRARY.cloudy, rect: CLOUDY_RECTS.insecure },
}

export function getEmotionSpriteByStateId(stateId: string | null | undefined) {
  if (!stateId) return null
  return EMOTION_SPRITE_BY_STATE_ID[stateId] ?? null
}

export function getEmotionStateById(stateId: string | null | undefined) {
  return EMOTION_CHARACTER_STATES.find(state => state.id === stateId) ?? getDefaultEmotionState()
}

export function getDefaultEmotionState() {
  const state = EMOTION_CHARACTER_STATES.find(item => item.id === DEFAULT_EMOTION_STATE_ID)
  if (!state) throw new Error('Default emotion state is missing')
  return state
}

export function getEmotionStatesByCategory(category: EmotionCategoryId) {
  return EMOTION_CHARACTER_STATES.filter(state => state.category === category)
}

export function getEmotionCategoryById(category: EmotionCategoryId) {
  return EMOTION_CATEGORIES.find(item => item.id === category) ?? EMOTION_CATEGORIES[0]
}
