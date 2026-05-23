import {
  foodAddonItems,
  foodDecisionItems,
  type FoodAddonItem,
  type FoodDecisionHistoryEntry,
  type FoodDecisionItem,
  type FoodTuningTag,
  type MealTime,
} from '../data/food-decisions'

export const FOOD_HISTORY_CACHE_KEY = 'qinggan_food_decision_history_v1'
const MAX_HISTORY_ITEMS = 20

export interface RecommendFoodOptions {
  mealTime?: MealTime
  tuningTags?: readonly FoodTuningTag[]
  rejectedIds?: readonly string[]
  history?: readonly FoodDecisionHistoryEntry[]
  now?: Date
}

export function inferMealTime(now = new Date()): MealTime {
  const hour = now.getHours()
  if (hour < 10) return 'breakfast'
  if (hour < 15) return 'lunch'
  if (hour < 22) return 'dinner'
  return 'late'
}

export function recommendFood(options: RecommendFoodOptions = {}): FoodDecisionItem {
  const mealTime = options.mealTime ?? inferMealTime(options.now)
  const rejected = new Set(options.rejectedIds ?? [])
  const recentAccepted = new Set(
    (options.history ?? [])
      .filter(entry => entry.type === 'main')
      .slice(0, 6)
      .map(entry => entry.id)
  )
  const tuningTags = new Set(options.tuningTags ?? [])

  const basePool = foodDecisionItems.filter(item => item.mealTimes.includes(mealTime))
  const pool = basePool.length > 0 ? basePool : foodDecisionItems
  const available = pool.filter(item => !rejected.has(item.id))
  const candidates = available.length > 0 ? available : pool

  const scored = candidates.map(item => ({
    item,
    score: scoreFoodItem(item, tuningTags, recentAccepted),
  }))
  const maxScore = Math.max(...scored.map(candidate => candidate.score))
  const winners = scored.filter(candidate => candidate.score === maxScore)

  return winners[Math.floor(Math.random() * winners.length)].item
}

export function recommendAddon(
  main: FoodDecisionItem,
  kind: 'dessert' | 'drink' | 'any',
  rejectedIds: readonly string[] = []
): FoodAddonItem {
  const rejected = new Set(rejectedIds)
  const kindPool = foodAddonItems.filter(item => kind === 'any' || item.kind === kind)
  const pairable = kindPool.filter(item => item.pairingTags.some(tag => main.pairingTags.includes(tag)))
  const pool = pairable.length > 0 ? pairable : kindPool
  const available = pool.filter(item => !rejected.has(item.id))
  const candidates = available.length > 0 ? available : pool

  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function readFoodHistory(): FoodDecisionHistoryEntry[] {
  try {
    const raw = localStorage.getItem(FOOD_HISTORY_CACHE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as FoodDecisionHistoryEntry[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isHistoryEntry).slice(0, MAX_HISTORY_ITEMS)
  } catch {
    return []
  }
}

export function writeFoodHistory(history: readonly FoodDecisionHistoryEntry[]) {
  try {
    localStorage.setItem(FOOD_HISTORY_CACHE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)))
  } catch {
    // Local memory is best-effort. Recommendation still works without it.
  }
}

export function rememberFoodChoice(
  history: readonly FoodDecisionHistoryEntry[],
  entry: FoodDecisionHistoryEntry
): FoodDecisionHistoryEntry[] {
  return [entry, ...history.filter(item => !(item.id === entry.id && item.type === entry.type))].slice(0, MAX_HISTORY_ITEMS)
}

function scoreFoodItem(
  item: FoodDecisionItem,
  tuningTags: Set<FoodTuningTag>,
  recentAccepted: Set<string>
) {
  let score = 10

  if (recentAccepted.has(item.id)) score -= 8
  if (tuningTags.has('light')) {
    score += item.flavorTags.includes('light') ? 6 : -3
    score += item.energyLevel === 1 ? 2 : 0
  }
  if (tuningTags.has('rich')) {
    score += item.flavorTags.includes('rich') ? 6 : -2
    score += item.energyLevel === 3 ? 2 : 0
  }
  if (tuningTags.has('no-spicy')) {
    score += item.flavorTags.includes('spicy') ? -10 : 3
  }
  if (tuningTags.has('budget')) {
    score += item.priceLevel === 1 ? 6 : item.priceLevel === 2 ? 1 : -5
    score += item.flavorTags.includes('budget') ? 2 : 0
  }

  return score
}

function isHistoryEntry(value: unknown): value is FoodDecisionHistoryEntry {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    (record.type === 'main' || record.type === 'addon') &&
    typeof record.acceptedAt === 'string'
  )
}
