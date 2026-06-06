import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const sourceRoot = resolve(root, '..', '四阶段四类型')
const outputPath = resolve(root, 'src', 'features', 'heart-tune', 'materials.ts')
const offlinePath = resolve(root, 'src', 'data', 'offline-couple-materials.ts')
const reportDir = resolve(root, 'docs', 'heart-tune-material-audit')
const keptReportPath = resolve(reportDir, 'heart-tune-kept-materials.json')
const rejectedReportPath = resolve(reportDir, 'heart-tune-rejected-materials.json')

const stageFiles = [
  ['一阶段.txt', 'flirt', '调情'],
  ['二阶段.txt', 'foreplay', '前戏'],
  ['三阶段.txt', 'deepening', '深入'],
  ['四阶段.txt', 'finale', '最终'],
]

const stageOrder = ['flirt', 'foreplay', 'deepening', 'finale']
const modeOrder = ['directed', 'response', 'duo', 'scene']
const modeLabels = {
  directed: '主动卡',
  response: '回应卡',
  duo: '双人卡',
  scene: '场景卡',
}

const groupConfig = {
  directed_male: { mode: 'directed', rolePolicy: 'fixed', expectedLead: 'A' },
  directed_female: { mode: 'directed', rolePolicy: 'fixed', expectedLead: 'B' },
  response_male_to_female: { mode: 'response', rolePolicy: 'fixed', expectedLead: 'A', expectedResponder: 'B' },
  response_female_to_male: { mode: 'response', rolePolicy: 'fixed', expectedLead: 'B', expectedResponder: 'A' },
  duo_neutral: { mode: 'duo', rolePolicy: 'none', expectedLead: null },
  duo_male_lead: { mode: 'duo', rolePolicy: 'fixed', expectedLead: 'A' },
  duo_female_lead: { mode: 'duo', rolePolicy: 'fixed', expectedLead: 'B' },
  scene_male_lead: { mode: 'scene', rolePolicy: 'fixed', expectedLead: 'A' },
  scene_female_lead: { mode: 'scene', rolePolicy: 'fixed', expectedLead: 'B' },
}

const offlineLevelToStage = {
  beginner: ['flirt', '调情'],
  intermediate: ['foreplay', '前戏'],
  advanced: ['deepening', '深入'],
  finale: ['finale', '最终'],
}

const bannedFlowPatterns = [
  /要不要继续/,
  /是否继续/,
  /继续还是/,
  /继续或停止/,
  /说继续或停/,
  /停下来确认/,
  /暂停确认/,
  /阶段确认/,
  /准备进入下一/,
  /进入下一阶段/,
  /下一阶段/,
  /通关/,
  /事后/,
  /温存/,
  /aftercare/i,
  /收尾/,
  /动作中途.*说停/,
  /说停(?:住)?/,
  /同时停下/,
  /立刻停住/,
  /马上停住/,
  /停下.*保持贴近/,
]

const lowExecutionPatterns = [
  /感受彼此/,
  /感受对方/,
  /升温/,
  /氛围/,
  /看着对方$/,
  /保持身体贴近$/,
  /保持贴近$/,
  /不做别的/,
  /什么都不做/,
]

const stageBoundaryPatterns = {
  flirt: [/阴道/, /阴茎/, /龟头/, /下体/, /私密/, /内裤/, /插入/, /进入/, /口交/, /乳头/, /裸臀/],
  foreplay: [/插入/, /进入阴道/, /阴道后/, /口交/, /龟头/, /抽插/, /正式做爱/],
  deepening: [/正式做爱/, /正式进入/, /连续抽插/, /快速冲刺/, /射精/],
  finale: [],
}

const upperUndressPatterns = [
  /脱(?:去|下|掉)?(?:.*?)(?:上衣|外套|上身衣物|胸衣|内衣)/,
  /上衣(?:脱掉|脱下)/,
  /上身裸露/,
  /裸胸/,
]
const lowerUndressPatterns = [
  /脱(?:去|下|掉)?(?:.*?)(?:外裤|裤子|短裤|下身外衣|裙子|内裤)/,
  /下身外衣(?:脱掉|脱下)/,
  /裸腿/,
  /裸臀/,
]
const coverChangePatterns = [/被子/, /浴巾/, /毯子/, /遮住/, /盖住/, /挡住/, /拉开遮挡/, /拿开遮挡/]
const clothingResetPatterns = [/穿(?:上|回|好)/, /整理(?:衣服|上衣|裤子|内衣|内裤|裙子)/, /扣好/, /盖回/]

const concreteActionPatterns = [
  /亲吻/,
  /亲/,
  /吻/,
  /咬/,
  /舔/,
  /含/,
  /摸/,
  /碰/,
  /抚摸/,
  /揉/,
  /按/,
  /滑/,
  /握/,
  /扶/,
  /抱/,
  /拉/,
  /带/,
  /推/,
  /解开/,
  /脱/,
  /贴/,
  /靠/,
  /摩擦/,
  /刺激/,
  /插入/,
  /进入/,
  /抽插/,
  /夹/,
  /跨坐/,
  /跪/,
  /躺/,
  /坐/,
  /站/,
  /趴/,
]
const leadActionPattern = /(主动|发起|要求|拉|扶|抱|握|亲|吻|摸|揉|按|解|脱|刺激|插入|进入|舔|含|顶|抽插|摩擦|催促)/
const responsePatterns = [
  /回应/,
  /回吻/,
  /回礼/,
  /反馈/,
  /确认/,
  /许可/,
  /说/,
  /要求/,
  /请求/,
  /催促/,
  /点头/,
  /配合/,
  /选择/,
  /猜/,
  /引导/,
  /交换/,
  /接住/,
  /张开/,
  /夹住/,
  /按住/,
  /握住/,
  /抱住/,
  /拉住/,
  /拉过/,
  /回拉/,
  /靠近/,
  /靠向/,
  /贴住/,
  /抬起/,
  /迎合/,
  /回答/,
  /告诉/,
]
const scenePatterns = [/床/, /沙发/, /墙/, /浴室/, /镜子/, /地毯/, /椅/, /桌/, /门边/, /床沿/, /床中央/, /身后/, /面对面/, /后入/, /跨坐/, /跪/, /躺/, /坐/, /站/, /趴/]
const genericRolePattern = /玩家|伴侣/

const pad = value => String(value).padStart(3, '0')
const normalizeLine = line => line.replace(/\r/g, '').trim()
const roleName = player => player === 'A' ? '大大怪' : '小怪兽'
const otherRoleName = player => player === 'A' ? '小怪兽' : '大大怪'

function parseNewMaterials() {
  const candidates = []
  const parsedStats = {}

  for (const [fileName, stage, stageLabel] of stageFiles) {
    const filePath = resolve(sourceRoot, fileName)
    const lines = readFileSync(filePath, 'utf8').split('\n').map(normalizeLine)
    const modeCounters = Object.fromEntries(modeOrder.map(mode => [mode, 0]))
    let group = null
    let current = null
    let rawCount = 0

    const flush = () => {
      if (!current || !group) return
      const config = groupConfig[group]
      if (!config) return
      rawCount += 1
      modeCounters[config.mode] += 1
      candidates.push(createCandidate({
        id: `${stage}-${config.mode}-${pad(modeCounters[config.mode])}`,
        stage,
        stageLabel,
        mode: config.mode,
        rolePolicy: config.rolePolicy,
        title: current.title.trim(),
        text: current.textLines.join(' ').replace(/\s+/g, ' ').trim(),
        source: `${fileName}#${current.rawId}`,
        sourceBatch: 'new-480',
        expectedLead: config.expectedLead,
        expectedResponder: config.expectedResponder,
        sourceRank: 1,
      }))
      current = null
    }

    for (const line of lines) {
      if (!line || line === '---') continue

      const groupMatch = line.match(/^##\s+.*?\b(directed_male|directed_female|response_male_to_female|response_female_to_male|duo_neutral|duo_male_lead|duo_female_lead|scene_male_lead|scene_female_lead)\b/)
      if (groupMatch) {
        flush()
        group = groupMatch[1]
        continue
      }

      const cardMatch = line.match(/^\*\*(.+?)\*\*$/)
      if (cardMatch) {
        flush()
        const rawHeader = cardMatch[1].trim()
        const [rawId, ...titleParts] = rawHeader.split(/\s+/)
        current = { rawId, title: titleParts.join(' '), textLines: [] }
        continue
      }

      if (!current || /^标签[:：]/.test(line)) continue
      current.textLines.push(line)
    }

    flush()
    parsedStats[stage] = { rawCount, modeCounters }
  }

  return { candidates, parsedStats }
}

function parseLegacyMaterials() {
  const source = execFileSync('git', ['show', 'HEAD:src/features/heart-tune/materials.ts'], {
    cwd: root,
    encoding: 'utf8',
  })
  const legacy = parseMaterialArray(source)
  return legacy.map((material, index) => {
    const converted = convertLegacyMaterial(material, index)
    return createCandidate({
      ...converted,
      id: `${converted.stage}-${converted.mode}-legacy-${pad(index + 1)}`,
      source: `legacy:${material.id}`,
      sourceBatch: 'legacy-selected',
      expectedLead: converted.expectedLead ?? inferExpectedLeadFromMaterial(converted),
      sourceRank: 2,
    })
  })
}

function convertLegacyMaterial(material, index) {
  if (material.rolePolicy !== 'dynamic' || !genericRolePattern.test(material.text)) return material

  const expectedLead = index % 2 === 0 ? 'A' : 'B'
  const lead = roleName(expectedLead)
  const partner = otherRoleName(expectedLead)

  return {
    ...material,
    text: material.text
      .replaceAll('玩家', lead)
      .replaceAll('伴侣', partner),
    rolePolicy: material.mode === 'duo' ? 'none' : 'fixed',
    expectedLead: material.mode === 'duo' ? null : expectedLead,
  }
}

function parseOfflineMaterials() {
  const source = readFileSync(offlinePath, 'utf8')
  const blocks = [...source.matchAll(/\{\s*id:\s*"([^"]+)",\s*level:\s*"([^"]+)",\s*title:\s*"((?:\\.|[^"])*)",\s*content:\s*"((?:\\.|[^"])*)",[\s\S]*?source:\s*"interaction-question-bank",\s*\}/g)]
  const candidates = []

  for (const [index, match] of blocks.entries()) {
    const [, rawId, level, rawTitle, rawContent] = match
    const stageInfo = offlineLevelToStage[level]
    if (!stageInfo) continue

    const title = parseEscapedString(rawTitle)
    const content = parseEscapedString(rawContent)
    const converted = convertOfflineMaterial({ rawId, level, title, content, index })
    if (!converted) {
      candidates.push(createRejectedStub({
        source: `interaction:${rawId}`,
        sourceBatch: 'interaction-selected',
        title,
        text: content,
        reason: 'generic-role',
        detail: '互动素材无法稳定转换为明确角色和四类型任务。',
      }))
      continue
    }

    const [stage, stageLabel] = stageInfo
    candidates.push(createCandidate({
      ...converted,
      id: `${stage}-${converted.mode}-interaction-${pad(index + 1)}`,
      stage,
      stageLabel,
      source: `interaction:${rawId}`,
      sourceBatch: 'interaction-selected',
      sourceRank: 3,
    }))
  }

  return candidates
}

function convertOfflineMaterial({ title, content, index }) {
  if (!genericRolePattern.test(content)) return null
  if (hasBannedFlowCopy(content) || /不许|必须|惩罚|命令|绝对/.test(content)) return null

  const mode = inferOfflineMode(title, content)
  const expectedLead = index % 2 === 0 ? 'A' : 'B'
  const lead = roleName(expectedLead)
  const partner = otherRoleName(expectedLead)
  const text = content
    .replaceAll('玩家', lead)
    .replaceAll('伴侣', partner)
    .replaceAll('双方', '两人')

  return {
    mode,
    modeLabel: modeLabels[mode],
    rolePolicy: mode === 'duo' ? 'none' : 'fixed',
    expectedLead: mode === 'duo' ? null : expectedLead,
    title,
    text,
  }
}

function inferOfflineMode(title, text) {
  const copy = `${title} ${text}`
  if (/双方|两人|一起|互相|同时|轮流/.test(copy)) return 'duo'
  if (scenePatterns.some(pattern => pattern.test(copy)) && /姿势|位置|床|沙发|墙|浴室|镜子/.test(copy)) return 'scene'
  if (/伴侣(?:说|选择|回应|回答|评价|反馈|接受|拒绝)|索要|请求|回应|回答|评价|反馈|接受|拒绝/.test(copy)) return 'response'
  if (responsePatterns.some(pattern => pattern.test(copy)) && /回应|回答|说|告诉|评价|反馈/.test(copy)) return 'response'
  return 'directed'
}

function createCandidate(input) {
  const material = {
    id: input.id,
    stage: input.stage,
    stageLabel: input.stageLabel,
    mode: input.mode,
    modeLabel: input.modeLabel ?? modeLabels[input.mode],
    title: input.title,
    text: input.text,
    rolePolicy: input.rolePolicy,
    source: input.source,
    sourceBatch: input.sourceBatch,
  }
  addStateMetadata(material)

  return {
    material,
    expectedLead: input.expectedLead,
    expectedResponder: input.expectedResponder,
    sourceRank: input.sourceRank,
  }
}

function createRejectedStub({ source, sourceBatch, title, text, reason, detail }) {
  return {
    rejectedOnly: true,
    material: {
      id: source,
      stage: 'unknown',
      mode: 'unknown',
      title,
      text,
      source,
      sourceBatch,
    },
    rejection: { reason, detail },
  }
}

function selectMaterials(candidates) {
  const kept = []
  const rejected = []
  const actionKeys = new Set()
  const idCounters = new Map()

  for (const candidate of candidates) {
    if (candidate.rejectedOnly) {
      rejected.push(formatRejected(candidate, candidate.rejection.reason, candidate.rejection.detail))
      continue
    }

    const rejection = getRejection(candidate)
    if (rejection) {
      rejected.push(formatRejected(candidate, rejection.reason, rejection.detail))
      continue
    }

    const actionKey = getActionKey(candidate.material)
    if (actionKeys.has(actionKey)) {
      rejected.push(formatRejected(candidate, 'duplicate-action', '同阶段同类型已有更清楚或优先级更高的同类动作。'))
      continue
    }

    actionKeys.add(actionKey)
    kept.push(candidate)
  }

  const sorted = sortCandidates(kept)
  const finalMaterials = sorted.map(candidate => {
    const material = { ...candidate.material }
    const key = `${material.stage}-${material.mode}-${material.sourceBatch}`
    const next = (idCounters.get(key) ?? 0) + 1
    idCounters.set(key, next)

    if (material.sourceBatch === 'legacy-selected') material.id = `${material.stage}-${material.mode}-legacy-${pad(next)}`
    if (material.sourceBatch === 'interaction-selected') material.id = `${material.stage}-${material.mode}-interaction-${pad(next)}`
    return material
  })

  return { finalMaterials, kept: sorted, rejected }
}

function getRejection(candidate) {
  const { material } = candidate
  const copy = `${material.title} ${material.text}`

  if (genericRolePattern.test(copy)) {
    return { reason: 'generic-role', detail: '仍包含玩家/伴侣泛称。' }
  }
  if (hasBannedFlowCopy(copy)) {
    return { reason: 'flow-interrupt', detail: '包含说停、询问继续、事后温存或阶段确认等流程中断表达。' }
  }
  if (stageBoundaryPatterns[material.stage]?.some(pattern => pattern.test(copy))) {
    return { reason: 'stage-boundary', detail: '动作强度或词汇超过当前阶段边界。' }
  }
  if (isLowExecution(copy)) {
    return { reason: 'low-execution-value', detail: '动作价值偏低，容易变成停顿、贴近或空转。' }
  }
  if (!hasEnoughConcreteAction(material)) {
    return { reason: 'ambiguous-action', detail: '缺少足够明确的可执行动作。' }
  }
  if (isRoleMismatch(candidate)) {
    return { reason: 'role-mismatch', detail: '素材角色方向与来源分组或卡牌类型不一致。' }
  }
  if (material.mode === 'response' && !isValidResponse(candidate)) {
    return { reason: 'ambiguous-action', detail: '回应卡没有明确发起者、回应者和回应动作。' }
  }
  if (material.mode === 'scene' && !scenePatterns.some(pattern => pattern.test(copy))) {
    return { reason: 'ambiguous-action', detail: '场景卡缺少地点、姿势或位置关系。' }
  }

  return null
}

function hasBannedFlowCopy(copy) {
  return bannedFlowPatterns.some(pattern => pattern.test(copy))
}

function isLowExecution(copy) {
  if (lowExecutionPatterns.some(pattern => pattern.test(copy))) return true
  if (/保持贴近/.test(copy) && countConcreteActions(copy) < 2) return true
  if (/看着对方/.test(copy) && countConcreteActions(copy) < 2) return true
  return false
}

function hasEnoughConcreteAction(material) {
  const count = countConcreteActions(`${material.title} ${material.text}`)
  if (material.mode === 'scene') return count >= 1
  if (material.mode === 'duo') return count >= 1
  return count >= 1
}

function countConcreteActions(copy) {
  return concreteActionPatterns.filter(pattern => pattern.test(copy)).length
}

function isRoleMismatch(candidate) {
  const { material, expectedLead } = candidate
  const copy = `${material.title} ${material.text}`
  if (material.rolePolicy === 'none') return false
  if (!copy.includes('大大怪') || !copy.includes('小怪兽')) return true
  if (material.mode === 'response') return false
  if (material.mode === 'scene') return false
  if (!expectedLead) return false

  const estimated = estimateLead(copy)
  return Boolean(estimated && estimated !== expectedLead)
}

function estimateLead(copy) {
  const hits = []
  for (const player of ['A', 'B']) {
    const name = roleName(player)
    const regex = new RegExp(`${name}.{0,12}${leadActionPattern.source}`)
    const match = copy.match(regex)
    if (match?.index !== undefined) hits.push({ player, index: match.index })
  }
  hits.sort((a, b) => a.index - b.index)
  return hits[0]?.player ?? null
}

function isValidResponse(candidate) {
  const { material, expectedLead, expectedResponder } = candidate
  const copy = `${material.title} ${material.text}`
  if (!copy.includes('大大怪') || !copy.includes('小怪兽')) return false
  if (!responsePatterns.some(pattern => pattern.test(copy))) return false
  if (!expectedLead || !expectedResponder) return true
  return copy.includes(roleName(expectedLead)) && copy.includes(roleName(expectedResponder))
}

function getActionKey(material) {
  return [
    material.stage,
    material.mode,
    normalizeCopy(material.title),
    normalizeCopy(material.text).slice(0, 24),
  ].join('|')
}

function normalizeCopy(value) {
  return String(value)
    .toLowerCase()
    .replace(/大大怪|小怪兽|玩家|伴侣|双方|两人/g, '')
    .replace(/[0-9０-９一二三四五六七八九十]+(?:秒|次|分钟|下)?/g, '')
    .replace(/[，。、“”‘’：:；;！!？?（）()【】\[\]\s]/g, '')
}

function parseMaterialArray(source) {
  const assignmentIndex = source.indexOf('= [')
  const start = assignmentIndex >= 0 ? assignmentIndex + 2 : source.indexOf('[')
  const end = source.lastIndexOf(']')
  if (start < 0 || end < start) return []
  return JSON.parse(source.slice(start, end + 1))
}

function inferExpectedLeadFromMaterial(material) {
  const first = estimateLead(`${material.title} ${material.text}`)
  return first
}

function addStateMetadata(material) {
  if (material.stage !== 'foreplay') return
  const text = `${material.title} ${material.text}`
  const stateTags = []

  if (upperUndressPatterns.some(pattern => pattern.test(text))) stateTags.push('upper-undress')
  if (lowerUndressPatterns.some(pattern => pattern.test(text))) stateTags.push('lower-undress')
  if (coverChangePatterns.some(pattern => pattern.test(text))) stateTags.push('cover-change')
  if (clothingResetPatterns.some(pattern => pattern.test(text))) stateTags.push('clothing-reset')

  if (stateTags.length > 0) {
    material.stateTags = [...new Set(stateTags)]
    material.blockedByState = material.stateTags
  }
}

function parseEscapedString(value) {
  return JSON.parse(`"${value}"`)
}

function sortCandidates(candidates) {
  return [...candidates].sort((a, b) => {
    const stageDiff = stageOrder.indexOf(a.material.stage) - stageOrder.indexOf(b.material.stage)
    if (stageDiff !== 0) return stageDiff
    const modeDiff = modeOrder.indexOf(a.material.mode) - modeOrder.indexOf(b.material.mode)
    if (modeDiff !== 0) return modeDiff
    const rankDiff = a.sourceRank - b.sourceRank
    if (rankDiff !== 0) return rankDiff
    return a.material.id.localeCompare(b.material.id, 'en')
  })
}

function formatRejected(candidate, reason, detail) {
  const { material } = candidate
  return {
    id: material.id,
    source: material.source,
    sourceBatch: material.sourceBatch,
    stage: material.stage,
    mode: material.mode,
    title: material.title,
    text: material.text,
    reason,
    detail,
  }
}

function assertCounts({ parsedNewStats, legacyCandidates, offlineCandidates, finalMaterials }) {
  const parsedNew = Object.values(parsedNewStats).reduce((sum, item) => sum + item.rawCount, 0)
  if (parsedNew !== 480) throw new Error(`新素材解析数量异常：${parsedNew}，预期 480`)
  if (legacyCandidates.length !== 400) throw new Error(`旧素材候选数量异常：${legacyCandidates.length}，预期 400`)
  if (offlineCandidates.length !== 200) throw new Error(`互动素材候选数量异常：${offlineCandidates.length}，预期 200`)

  const ids = new Set()
  for (const material of finalMaterials) {
    if (ids.has(material.id)) throw new Error(`重复素材 ID：${material.id}`)
    ids.add(material.id)
    const copy = `${material.title} ${material.text}`
    if (genericRolePattern.test(copy)) throw new Error(`素材仍含泛称：${material.id}`)
    if (hasBannedFlowCopy(copy)) throw new Error(`素材含流程干扰文案：${material.id}`)
  }

  for (const stage of stageOrder) {
    for (const mode of modeOrder) {
      const count = finalMaterials.filter(material => material.stage === stage && material.mode === mode).length
      if (count < 30) throw new Error(`${stage}/${mode} 数量不足：${count}`)
    }
  }
}

function writeMaterials(materials) {
  const body = JSON.stringify(materials, null, 2)
  const output = `import type { HeartTuneMaterial } from './types'\n\nexport const heartTuneMaterials: readonly HeartTuneMaterial[] = ${body}\n`
  writeFileSync(outputPath, output, 'utf8')
}

function writeReports({ kept, rejected, finalMaterials }) {
  mkdirSync(reportDir, { recursive: true })
  const keptReport = kept.map(candidate => ({
    id: candidate.material.id,
    source: candidate.material.source,
    sourceBatch: candidate.material.sourceBatch,
    stage: candidate.material.stage,
    mode: candidate.material.mode,
    title: candidate.material.title,
    stateTags: candidate.material.stateTags ?? [],
  }))
  writeFileSync(keptReportPath, JSON.stringify(keptReport, null, 2), 'utf8')
  writeFileSync(rejectedReportPath, JSON.stringify(rejected, null, 2), 'utf8')

  const finalStats = Object.fromEntries(stageOrder.map(stage => [
    stage,
    Object.fromEntries(modeOrder.map(mode => [
      mode,
      finalMaterials.filter(material => material.stage === stage && material.mode === mode).length,
    ])),
  ]))
  return finalStats
}

const { candidates: newCandidates, parsedStats: parsedNewStats } = parseNewMaterials()
const legacyCandidates = parseLegacyMaterials()
const offlineCandidates = parseOfflineMaterials()
const allCandidates = [...newCandidates, ...legacyCandidates, ...offlineCandidates]
const { finalMaterials, kept, rejected } = selectMaterials(allCandidates)
const finalStats = writeReports({ kept, rejected, finalMaterials })

assertCounts({ parsedNewStats, legacyCandidates, offlineCandidates, finalMaterials })
writeMaterials(finalMaterials)

console.log(JSON.stringify({
  sourceCandidates: {
    new480: newCandidates.length,
    legacy400: legacyCandidates.length,
    interaction200: offlineCandidates.length,
  },
  finalTotal: finalMaterials.length,
  keptBySource: {
    new480: finalMaterials.filter(material => material.sourceBatch === 'new-480').length,
    legacySelected: finalMaterials.filter(material => material.sourceBatch === 'legacy-selected').length,
    interactionSelected: finalMaterials.filter(material => material.sourceBatch === 'interaction-selected').length,
  },
  rejectedTotal: rejected.length,
  rejectedByReason: rejected.reduce((acc, item) => {
    acc[item.reason] = (acc[item.reason] ?? 0) + 1
    return acc
  }, {}),
  finalStats,
  reports: {
    kept: keptReportPath,
    rejected: rejectedReportPath,
  },
}, null, 2))
