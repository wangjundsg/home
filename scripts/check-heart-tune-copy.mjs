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
  resolve(root, 'src', 'features', 'heart-tune', 'engine.ts'),
  '--format', 'esm',
  '--platform', 'node',
  '--file', outFile,
], { stdio: 'pipe' })

const mod = await import(pathToFileURL(outFile).href)

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
