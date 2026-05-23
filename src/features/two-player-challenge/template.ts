import type { ChallengeMaterial, IdentityAssignment, TaskMode, TemplateRenderResult } from './types'
import type { ChallengeTaskKind } from './types'

const allowedPlaceholders = new Set(['actor', 'target', 'both'])

const requiredPlaceholdersByMode: Record<TaskMode, string[]> = {
  directed: ['actor', 'target'],
  response: ['actor', 'target'],
  duo: ['both'],
  scene: ['both'],
}

export function renderChallengeTemplate(material: ChallengeMaterial, identity: IdentityAssignment, kind: ChallengeTaskKind = 'result-task'): TemplateRenderResult {
  const placeholders = extractPlaceholders(material.template)
  const unknownPlaceholders = placeholders.filter(placeholder => !allowedPlaceholders.has(placeholder))
  const requiredPlaceholders = requiredPlaceholdersByMode[material.taskMode]
  const missingPlaceholders = requiredPlaceholders.filter(placeholder => !placeholders.includes(placeholder))
  const errors: string[] = []
  const warnings: string[] = []

  if (unknownPlaceholders.length > 0) {
    errors.push(`未知占位符：${unknownPlaceholders.map(placeholder => `{${placeholder}}`).join('、')}`)
  }

  if (missingPlaceholders.length > 0) {
    errors.push(`缺少必要占位符：${missingPlaceholders.map(placeholder => `{${placeholder}}`).join('、')}`)
  }

  if (errors.length > 0) {
    return { ok: false, task: null, errors, warnings }
  }

  const actorLabel = identity.labels.actor || '大大怪'
  const targetLabel = identity.labels.target || '小怪兽'
  const bothLabel = identity.labels.both || '你们两个人'
  const text = material.template
    .replaceAll('{actor}', actorLabel)
    .replaceAll('{target}', targetLabel)
    .replaceAll('{both}', bothLabel)

  if (text.length > 72) {
    warnings.push('任务文本偏长，移动端可能需要换行显示')
  }

  return {
    ok: true,
    task: {
      materialId: material.id,
      title: material.title,
      text,
      triggerLabel: identity.triggerLabel,
      triggerReason: identity.triggerReason,
      kind,
      warnings,
    },
    errors: [],
    warnings,
  }
}

export function extractPlaceholders(template: string): string[] {
  return Array.from(template.matchAll(/\{([a-zA-Z0-9_-]+)\}/g)).map(match => match[1])
}
