import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'

const root = resolve(import.meta.dirname, '..')
const rolldownBin = resolve(root, 'node_modules', 'rolldown', 'bin', 'cli.mjs')
const outFile = join(tmpdir(), 'heart-tune-copy-check.mjs')

if (!existsSync(rolldownBin)) {
  throw new Error(`Missing rolldown binary at ${rolldownBin}`)
}

execFileSync(process.execPath, [
  rolldownBin,
  resolve(root, 'src', 'features', 'heart-tune', 'index.ts'),
  '--format', 'esm',
  '--platform', 'node',
  '--file', outFile,
], { stdio: 'pipe' })

const mod = await import(pathToFileURL(outFile).href)
const stages = ['flirt', 'foreplay', 'deepening', 'finale']
const modes = ['directed', 'response', 'duo', 'scene']
const bannedCopyPattern = /玩家|伴侣|要不要继续|是否继续|继续还是|继续或停止|说继续或停|说停|同时停下|动作中途.*停|停下.*保持贴近|停下来确认|暂停确认|阶段确认|准备进入下一|进入下一阶段|下一阶段|通关|事后|温存|aftercare|收尾/i

assert.ok(mod.heartTuneMaterials.length >= 480, `heart tune material count too low: ${mod.heartTuneMaterials.length}`)

const ids = new Set()
for (const material of mod.heartTuneMaterials) {
  assert.ok(!ids.has(material.id), `duplicate material id: ${material.id}`)
  ids.add(material.id)
  assert.doesNotMatch(`${material.title} ${material.text}`, bannedCopyPattern, `bad copy in ${material.id}`)
}

for (const stage of stages) {
  for (const mode of modes) {
    const count = mod.heartTuneMaterials.filter(material => material.stage === stage && material.mode === mode).length
    assert.ok(count >= 30, `${stage}/${mode} expected at least 30, got ${count}`)
  }
}

assert.ok(
  mod.heartTuneMaterials.filter(material => material.sourceBatch === 'new-480').length >= 390,
  'new-480 selected source batch count is unexpectedly low',
)
assert.ok(
  mod.heartTuneMaterials.filter(material => material.sourceBatch === 'legacy-selected').length >= 250,
  'legacy-selected source batch count is unexpectedly low',
)
assert.ok(
  mod.heartTuneMaterials.filter(material => material.sourceBatch === 'interaction-selected').length >= 50,
  'interaction-selected source batch count is unexpectedly low',
)

assert.ok(existsSync(resolve(root, 'docs', 'heart-tune-material-audit', 'heart-tune-kept-materials.json')), 'kept material audit report missing')
assert.ok(existsSync(resolve(root, 'docs', 'heart-tune-material-audit', 'heart-tune-rejected-materials.json')), 'rejected material audit report missing')

const stateMaterials = mod.heartTuneMaterials.filter(material => material.stage === 'foreplay' && material.stateTags?.length)
assert.ok(stateMaterials.length > 0, 'foreplay state-tagged material missing')
assert.ok(stateMaterials.every(material => material.blockedByState?.length), 'state-tagged material must define blockedByState')

const stateCandidate = stateMaterials.find(material => {
  const pool = mod.heartTuneMaterials.filter(item => item.stage === material.stage && item.mode === material.mode)
  return pool.some(item => !mod.isMaterialBlockedByState(item, material.blockedByState))
})
assert.ok(stateCandidate, 'missing state-filter test candidate')

for (let index = 0; index < 20; index += 1) {
  const drawn = mod.drawMaterial(stateCandidate.stage, stateCandidate.mode, {
    blockedStates: stateCandidate.blockedByState,
  })
  assert.equal(mod.isMaterialBlockedByState(drawn, stateCandidate.blockedByState), false, 'drawMaterial returned a blocked state card while alternatives exist')
}

const proposals = mod.drawHeartTuneProposals()
assert.equal(proposals[0].label, '左命题')
assert.equal(proposals[1].label, '右命题')

const result = mod.resolveTuneRound({
  stage: 'flirt',
  defaultLead: 'A',
  proposals: [
    { key: 'A', label: '左命题', mode: 'directed', leadPlayer: 'A' },
    { key: 'B', label: '右命题', mode: 'duo', leadPlayer: 'B' },
  ],
  votes: { A: 'A', B: 'B' },
  boosts: { B: 'B' },
  usedIds: [],
  rule: mod.HEART_TUNE_RULES.find(rule => rule.key === 'together-priority'),
  scene: mod.HEART_TUNE_SCENES.find(scene => scene.key === 'close-range'),
})

assert.equal(result.selectedProposal.label, '右命题')
assert.match(result.ruleSummary, /左命题 1 : 右命题 2/)
assert.match(result.ruleSummary, /加码/)
assert.match(result.ruleSummary, /采用右命题/)
assert.doesNotMatch(result.ruleSummary, /命题 A|命题 B/)

console.log('heart tune copy checks passed')
