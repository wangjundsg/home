export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'late'
export type FoodKind = 'rice' | 'noodle' | 'soup' | 'snack' | 'western' | 'light'
export type AddonKind = 'dessert' | 'drink'
export type FoodTuningTag = 'light' | 'rich' | 'no-spicy' | 'budget'

export interface FoodDecisionItem {
  id: string
  name: string
  emoji: string
  kind: FoodKind
  mealTimes: readonly MealTime[]
  flavorTags: readonly string[]
  priceLevel: 1 | 2 | 3
  energyLevel: 1 | 2 | 3
  reason: string
  pairingTags: readonly string[]
}

export interface FoodAddonItem {
  id: string
  name: string
  emoji: string
  kind: AddonKind
  pairingTags: readonly string[]
  reason: string
}

export interface FoodDecisionHistoryEntry {
  id: string
  type: 'main' | 'addon'
  acceptedAt: string
}

export const FOOD_TUNING_LABELS: Record<FoodTuningTag, string> = {
  light: '清淡点',
  rich: '重口点',
  'no-spicy': '不要辣',
  budget: '便宜点',
}

export const foodDecisionItems: readonly FoodDecisionItem[] = [
  {
    id: 'tomato-beef-rice-noodle',
    name: '番茄肥牛米线',
    emoji: '🍜',
    kind: 'noodle',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['warm', 'sour-sweet', 'rich'],
    priceLevel: 2,
    energyLevel: 2,
    reason: '酸酸热热，适合不想太纠结但又想吃得有存在感的时候。',
    pairingTags: ['tea', 'fruit', 'light-dessert'],
  },
  {
    id: 'chicken-leg-rice',
    name: '照烧鸡腿饭',
    emoji: '🍱',
    kind: 'rice',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['sweet-salty', 'safe', 'budget'],
    priceLevel: 1,
    energyLevel: 2,
    reason: '稳、快、不会出错，是选择困难时的可靠答案。',
    pairingTags: ['tea', 'coffee', 'pudding'],
  },
  {
    id: 'claypot-rice',
    name: '腊味煲仔饭',
    emoji: '🍚',
    kind: 'rice',
    mealTimes: ['dinner'],
    flavorTags: ['rich', 'warm', 'salty'],
    priceLevel: 2,
    energyLevel: 3,
    reason: '晚饭吃它会有“今天好好收尾了”的满足感。',
    pairingTags: ['tea', 'fruit'],
  },
  {
    id: 'mala-hotpot-lite',
    name: '麻辣烫少辣版',
    emoji: '🍲',
    kind: 'soup',
    mealTimes: ['lunch', 'dinner', 'late'],
    flavorTags: ['spicy', 'rich', 'flexible'],
    priceLevel: 2,
    energyLevel: 2,
    reason: '想吃很多种东西但又懒得点一桌菜时，它很会救场。',
    pairingTags: ['milk-tea', 'soda'],
  },
  {
    id: 'cantonese-congee',
    name: '皮蛋瘦肉粥配小笼包',
    emoji: '🥣',
    kind: 'light',
    mealTimes: ['breakfast', 'lunch', 'dinner', 'late'],
    flavorTags: ['light', 'warm', 'comfort'],
    priceLevel: 1,
    energyLevel: 1,
    reason: '胃口一般、想轻一点的时候，它像一个温和的台阶。',
    pairingTags: ['soy-milk', 'fruit', 'light-dessert'],
  },
  {
    id: 'japanese-curry-rice',
    name: '日式咖喱饭',
    emoji: '🍛',
    kind: 'rice',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['rich', 'sweet-salty', 'safe'],
    priceLevel: 2,
    energyLevel: 3,
    reason: '浓郁但不刺激，适合想吃饱也想被安慰一下。',
    pairingTags: ['tea', 'pudding', 'coffee'],
  },
  {
    id: 'sour-soup-fish-noodle',
    name: '酸汤鱼粉',
    emoji: '🍜',
    kind: 'noodle',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['sour', 'spicy', 'fresh'],
    priceLevel: 2,
    energyLevel: 2,
    reason: '想醒醒味蕾但不想吃太油时，这个很合适。',
    pairingTags: ['tea', 'fruit'],
  },
  {
    id: 'beef-burger-fries',
    name: '牛肉汉堡配薯条',
    emoji: '🍔',
    kind: 'western',
    mealTimes: ['lunch', 'dinner', 'late'],
    flavorTags: ['rich', 'crispy', 'safe'],
    priceLevel: 2,
    energyLevel: 3,
    reason: '当脑子不想负责时，快乐碳水可以负责。',
    pairingTags: ['soda', 'ice-cream', 'coffee'],
  },
  {
    id: 'dumpling-soup',
    name: '鲜肉水饺配紫菜汤',
    emoji: '🥟',
    kind: 'snack',
    mealTimes: ['lunch', 'dinner', 'late'],
    flavorTags: ['light', 'warm', 'budget'],
    priceLevel: 1,
    energyLevel: 2,
    reason: '简单、热乎、不会太撑，适合今天想省点心力。',
    pairingTags: ['tea', 'soy-milk'],
  },
  {
    id: 'thai-basil-chicken-rice',
    name: '打抛鸡肉饭',
    emoji: '🍳',
    kind: 'rice',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['rich', 'spicy', 'fresh'],
    priceLevel: 2,
    energyLevel: 2,
    reason: '香气够，节奏快，适合想从普通饭点里跳出来一点。',
    pairingTags: ['soda', 'tea', 'fruit'],
  },
  {
    id: 'wonton-noodle',
    name: '云吞面',
    emoji: '🍜',
    kind: 'noodle',
    mealTimes: ['breakfast', 'lunch', 'dinner'],
    flavorTags: ['light', 'fresh', 'safe'],
    priceLevel: 1,
    energyLevel: 1,
    reason: '清清爽爽，不抢戏，但能把饭点稳稳接住。',
    pairingTags: ['tea', 'soy-milk', 'light-dessert'],
  },
  {
    id: 'korean-bibimbap',
    name: '韩式拌饭',
    emoji: '🥘',
    kind: 'rice',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['rich', 'spicy', 'vegetable'],
    priceLevel: 2,
    energyLevel: 2,
    reason: '一碗里什么都有，适合“想吃点菜但也想吃饱”。',
    pairingTags: ['soda', 'tea', 'fruit'],
  },
  {
    id: 'mushroom-chicken-soup-rice',
    name: '菌菇鸡汤饭',
    emoji: '🍲',
    kind: 'soup',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['light', 'warm', 'comfort'],
    priceLevel: 2,
    energyLevel: 2,
    reason: '热汤和米饭很会让人安静下来，适合累了一天之后。',
    pairingTags: ['fruit', 'tea', 'light-dessert'],
  },
  {
    id: 'scallion-oil-noodle',
    name: '葱油拌面加煎蛋',
    emoji: '🍝',
    kind: 'noodle',
    mealTimes: ['breakfast', 'lunch', 'dinner', 'late'],
    flavorTags: ['budget', 'sweet-salty', 'safe'],
    priceLevel: 1,
    energyLevel: 2,
    reason: '便宜但有香气，适合今天只想快速结束纠结。',
    pairingTags: ['tea', 'soy-milk'],
  },
  {
    id: 'salmon-poke-bowl',
    name: '三文鱼波奇饭',
    emoji: '🥗',
    kind: 'light',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['light', 'fresh', 'vegetable'],
    priceLevel: 3,
    energyLevel: 1,
    reason: '想吃清爽一点、又不想像在惩罚自己时，就选它。',
    pairingTags: ['fruit', 'tea', 'coffee'],
  },
  {
    id: 'bbq-rice-bowl',
    name: '烤肉拌饭',
    emoji: '🍖',
    kind: 'rice',
    mealTimes: ['lunch', 'dinner'],
    flavorTags: ['rich', 'salty', 'safe'],
    priceLevel: 2,
    energyLevel: 3,
    reason: '肉、饭、酱汁都到位，适合饥饿值明显在线的时候。',
    pairingTags: ['soda', 'milk-tea', 'fruit'],
  },
]

export const foodAddonItems: readonly FoodAddonItem[] = [
  {
    id: 'jasmine-milk-tea',
    name: '茉莉奶绿少糖',
    emoji: '🧋',
    kind: 'drink',
    pairingTags: ['milk-tea', 'tea'],
    reason: '香一点但别太甜，刚好给饭后一个尾音。',
  },
  {
    id: 'sparkling-lemon-tea',
    name: '气泡柠檬茶',
    emoji: '🥤',
    kind: 'drink',
    pairingTags: ['soda', 'tea'],
    reason: '解腻很利落，适合搭重口或油香的正餐。',
  },
  {
    id: 'iced-americano',
    name: '冰美式',
    emoji: '☕',
    kind: 'drink',
    pairingTags: ['coffee'],
    reason: '不抢味道，给这一顿收个清醒的尾。',
  },
  {
    id: 'soy-milk',
    name: '热豆浆',
    emoji: '🥛',
    kind: 'drink',
    pairingTags: ['soy-milk', 'light-dessert'],
    reason: '温温的，很适合清淡饭点或夜宵。',
  },
  {
    id: 'mango-pomelo',
    name: '杨枝甘露',
    emoji: '🥭',
    kind: 'dessert',
    pairingTags: ['fruit', 'light-dessert'],
    reason: '甜但有水果感，适合饭后想被哄一下。',
  },
  {
    id: 'caramel-pudding',
    name: '焦糖布丁',
    emoji: '🍮',
    kind: 'dessert',
    pairingTags: ['pudding', 'light-dessert'],
    reason: '小小一份，不会喧宾夺主。',
  },
  {
    id: 'vanilla-ice-cream',
    name: '香草冰淇淋',
    emoji: '🍨',
    kind: 'dessert',
    pairingTags: ['ice-cream'],
    reason: '快乐很直接，尤其适合搭汉堡薯条。',
  },
  {
    id: 'seasonal-fruit-cup',
    name: '时令水果杯',
    emoji: '🍓',
    kind: 'dessert',
    pairingTags: ['fruit', 'light-dessert'],
    reason: '清爽一点，像给这顿饭按了保存键。',
  },
]
