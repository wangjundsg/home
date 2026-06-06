import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'

const root = resolve(import.meta.dirname, '..')
const rolldownBin = resolve(root, 'node_modules', 'rolldown', 'bin', 'cli.mjs')
const outFile = join(tmpdir(), 'private-flying-chess-check.mjs')

if (!existsSync(rolldownBin)) {
  throw new Error(`Missing rolldown binary at ${rolldownBin}`)
}

execFileSync(process.execPath, [
  rolldownBin,
  resolve(root, 'src', 'data', 'private-flying-chess.ts'),
  '--format', 'esm',
  '--platform', 'node',
  '--file', outFile,
], { stdio: 'pipe' })

const mod = await import(pathToFileURL(outFile).href)

const segment = mod.generateHeartbeatSegment(0)
const counts = segment.reduce((next, cell) => {
  next[cell.type] = (next[cell.type] ?? 0) + 1
  return next
}, {})

assert.equal(segment.length, 40, 'heartbeat board segment should stay at 40 cells')
assert.equal(counts.normal, 11, 'normal cells should appear 11 times per segment')
assert.equal(counts.double, 6, 'double cells should appear 6 times per segment')
assert.equal(counts.boost, 5, 'boost cells should appear 5 times per segment')
assert.equal(counts.reverse, 4, 'reverse cells should appear 4 times per segment')
assert.equal(counts.penalty, 4, 'penalty cells should appear 4 times per segment')
assert.equal(counts.close, 3, 'close cells should appear 3 times per segment')
assert.equal(counts.advance, 2, 'advance cells should appear 2 times per segment')
assert.equal(counts.choice, 2, 'choice cells should be reduced to 2 per segment')
assert.equal(counts.reward, 1, 'reward cells should be reduced to 1 per segment')
assert.equal(counts.rest, 1, 'rest cells should be reduced to 1 per segment')
assert.equal(counts.reroll, 1, 'reroll cells should stay rare')
assert.equal(mod.heartbeatCellMeta.close.label, '贴近格')
assert.equal(mod.heartbeatCellMeta.advance.label, '前进格')
assert.equal(mod.heartbeatPersonalCompletionStep, 60)
assert.equal(mod.getNextHeartbeatPersonalMilestone([])?.steps, 20)
assert.equal(mod.getNextHeartbeatPersonalMilestone([20])?.steps, 40)
assert.equal(mod.getNextHeartbeatPersonalMilestone([20, 40])?.steps, 60)
assert.equal(mod.getNextHeartbeatPersonalMilestone([20, 40, 60])?.steps, 80)
assert.equal(mod.getNextHeartbeatPersonalMilestone([20, 40, 60, 80])?.steps, 100)
assert.equal(mod.getNextHeartbeatSharedMilestone([])?.steps, 30)
assert.equal(mod.getNextHeartbeatSharedMilestone([30])?.steps, 60)
assert.equal(mod.getNextHeartbeatSharedMilestone([30, 60])?.steps, 90)
assert.equal(mod.getNextHeartbeatSharedMilestone([30, 60, 90])?.steps, 120)

console.log('private game mechanic checks passed')
