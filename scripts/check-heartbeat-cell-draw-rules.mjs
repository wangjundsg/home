import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'

const root = resolve(import.meta.dirname, '..')
const rolldownBin = resolve(root, 'node_modules', 'rolldown', 'bin', 'cli.mjs')
const outFile = join(tmpdir(), 'heartbeat-cell-draw-rules-check.mjs')

if (!existsSync(rolldownBin)) {
  throw new Error(`Missing rolldown binary at ${rolldownBin}`)
}

execFileSync(process.execPath, [
  rolldownBin,
  resolve(root, 'src', 'components', 'interact', 'PrivateFlyingChessBoard.tsx'),
  '--format', 'esm',
  '--platform', 'node',
  '--file', outFile,
], { stdio: 'pipe' })

const mod = await import(pathToFileURL(outFile).href)

const assertDraw = (cellType, expected) => {
  const draw = mod.createHeartbeatCellDraw({
    cellType,
    level: 'beginner',
    roller: 'A',
    partner: 'B',
    positions: { A: 12, B: 9 },
  })

  assert.equal(draw.primaryMode, expected.primaryMode, `${cellType} primary mode`)
  assert.equal(draw.leadPlayer, expected.leadPlayer, `${cellType} lead player`)
  assert.equal(draw.responsePlayer, expected.responsePlayer ?? null, `${cellType} response player`)
  assert.equal(draw.shared, expected.shared ?? false, `${cellType} shared flag`)
  assert.equal(draw.needsChoice, expected.needsChoice ?? false, `${cellType} choice flag`)
}

assertDraw('normal', { primaryMode: 'directed', leadPlayer: 'A' })
assertDraw('boost', { primaryMode: 'directed', leadPlayer: 'A' })
assertDraw('reroll', { primaryMode: 'directed', leadPlayer: 'A' })
assertDraw('reverse', { primaryMode: 'directed', leadPlayer: 'B' })
assertDraw('penalty', { primaryMode: 'directed', leadPlayer: 'A', responsePlayer: 'A' })
assertDraw('double', { primaryMode: 'directed', leadPlayer: 'A' })
assertDraw('close', { primaryMode: 'duo', leadPlayer: 'A', shared: true })
assertDraw('advance', { primaryMode: 'scene', leadPlayer: 'A', shared: true })
assertDraw('rest', { primaryMode: null, leadPlayer: 'A' })
assertDraw('choice', { primaryMode: null, leadPlayer: 'A', needsChoice: true })
assertDraw('reward', { primaryMode: null, leadPlayer: 'A', needsChoice: true })

const responsePenalty = mod.createHeartbeatCellDraw({
  cellType: 'penalty',
  level: 'beginner',
  roller: 'A',
  partner: 'B',
  positions: { A: 12, B: 9 },
  forcedMode: 'response',
})
assert.equal(responsePenalty.primaryMode, 'response')
assert.equal(responsePenalty.leadPlayer, 'B', 'penalty response should be started by partner')
assert.equal(responsePenalty.responsePlayer, 'A', 'penalty response should be answered by roller')

const personalDirected = mod.createHeartbeatMilestoneDraw({
  type: 'personal',
  level: 'beginner',
  triggerPlayer: 'A',
  follower: 'B',
  forcedMode: 'directed',
})
assert.equal(personalDirected.primaryMode, 'directed')
assert.equal(personalDirected.leadPlayer, 'B')

const personalResponse = mod.createHeartbeatMilestoneDraw({
  type: 'personal',
  level: 'beginner',
  triggerPlayer: 'A',
  follower: 'B',
  forcedMode: 'response',
})
assert.equal(personalResponse.primaryMode, 'response')
assert.equal(personalResponse.leadPlayer, 'A')
assert.equal(personalResponse.responsePlayer, 'B')

const sharedScene = mod.createHeartbeatMilestoneDraw({
  type: 'shared',
  level: 'beginner',
  triggerPlayer: 'A',
  forcedMode: 'scene',
})
assert.equal(sharedScene.primaryMode, 'scene')
assert.equal(sharedScene.shared, true)

assert.deepEqual(mod.resolveOpeningRoll({ A: 6, B: 2 }), { winner: 'A', tied: false })
assert.deepEqual(mod.resolveOpeningRoll({ A: 1, B: 5 }), { winner: 'B', tied: false })
assert.deepEqual(mod.resolveOpeningRoll({ A: 4, B: 4 }), { winner: null, tied: true })
assert.equal(mod.shouldUseOpeningRoll('beginner'), true)
assert.equal(mod.shouldUseOpeningRoll('intermediate'), false)
assert.equal(mod.shouldUseOpeningRoll('advanced'), false)
assert.equal(mod.shouldUseOpeningRoll('finale'), false)
assert.equal(mod.shouldShowOpeningRoll('beginner', { ready: false, rolls: { A: 4, B: 4 }, winner: null, tied: true }, { A: 0, B: 0 }), true)
assert.equal(mod.shouldShowOpeningRoll('beginner', { ready: true, rolls: { A: 6, B: 2 }, winner: 'A', tied: false }, { A: 0, B: 0 }), true)
assert.equal(mod.shouldShowOpeningRoll('beginner', { ready: true, rolls: { A: 6, B: 2 }, winner: 'A', tied: false }, { A: 1, B: 0 }), false)
assert.equal(mod.shouldContinueOpeningRoll('beginner', { ready: false, rolls: { A: 4, B: 4 }, winner: null, tied: true }, { A: 0, B: 0 }), true)
assert.equal(mod.shouldContinueOpeningRoll('beginner', { ready: true, rolls: { A: 6, B: 2 }, winner: 'A', tied: false }, { A: 0, B: 0 }), false)
assert.equal(mod.createOpeningRollSummary({ ready: true, rolls: { A: 6, B: 2 }, winner: 'A', tied: false }, { A: '大大怪', B: '小怪兽' }), '大大怪 6 · 小怪兽 2，大大怪先手。')
assert.equal(mod.createOpeningRollSummary({ ready: false, rolls: { A: 4, B: 4 }, winner: null, tied: true }, { A: '大大怪', B: '小怪兽' }), '大大怪 4 · 小怪兽 4，平局，再比一次。')

console.log('heartbeat cell draw rule checks passed')
