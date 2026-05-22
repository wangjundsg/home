import { offlineCoupleMaterials } from './offline-couple-materials'

export type MaterialLevel = 'beginner' | 'intermediate' | 'advanced' | 'finale'

export interface InteractionMaterial {
  id: string
  level: MaterialLevel
  title: string
  content: string
  tags: readonly string[]
  source: 'interaction-question-bank'
}

export interface MaterialLevelMeta {
  key: MaterialLevel
  title: string
  shortTitle: string
  description: string
}

export interface RandomMaterialFilters {
  level?: MaterialLevel
}

export const MATERIAL_LEVEL_META: readonly MaterialLevelMeta[] = [
  {
    key: 'beginner',
    title: '初级素材库',
    shortTitle: '初级',
    description: '破冰调情与温情互动，适合刚进入状态时随机抽取。',
  },
  {
    key: 'intermediate',
    title: '中级素材库',
    shortTitle: '中级',
    description: '感官觉醒与轻度挑逗，适合氛围升温后继续推进。',
  },
  {
    key: 'advanced',
    title: '高级素材库',
    shortTitle: '高级',
    description: '深度刺激与欲望爆发，适合双方都明确想继续加深时使用。',
  },
  {
    key: 'finale',
    title: '最终素材库',
    shortTitle: '最终',
    description: '最终亲密阶段的节奏与姿势切换，适合已经进入实战时抽取。',
  },
]

export const interactionMaterials: readonly InteractionMaterial[] = offlineCoupleMaterials

export const getMaterialsByLevel = (level: MaterialLevel): InteractionMaterial[] =>
  interactionMaterials.filter(material => material.level === level)

export const getMaterialCounts = () => {
  const byLevel = MATERIAL_LEVEL_META.reduce<Record<MaterialLevel, number>>((counts, level) => {
    counts[level.key] = getMaterialsByLevel(level.key).length
    return counts
  }, {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    finale: 0,
  })

  return {
    total: interactionMaterials.length,
    byLevel,
  }
}

export const getRandomMaterial = (filters: RandomMaterialFilters = {}): InteractionMaterial | undefined => {
  const materials = filters.level ? getMaterialsByLevel(filters.level) : interactionMaterials

  if (materials.length === 0) {
    return undefined
  }

  return materials[Math.floor(Math.random() * materials.length)]
}
