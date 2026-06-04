const segmentSize = 40

const cellBag = [
  ...Array(10).fill('normal'),
  ...Array(5).fill('double'),
  ...Array(4).fill('boost'),
  ...Array(4).fill('reverse'),
  ...Array(4).fill('choice'),
  ...Array(3).fill('reward'),
  ...Array(3).fill('close'),
  ...Array(2).fill('advance'),
  ...Array(2).fill('rest'),
  ...Array(2).fill('penalty'),
  'reroll',
]

const configs = [
  { name: 'too-fast: personal 12/24/36/48, shared 20/40/60', personal: [12, 24, 36, 48], shared: [20, 40, 60] },
  { name: 'stepped: personal 20/40/60, shared 30/60/90', personal: [20, 40, 60], shared: [30, 60, 90] },
  { name: 'medium: personal 24/48/72, shared 60/120', personal: [24, 48, 72], shared: [60, 120] },
  { name: 'stage-60: personal 30/60, shared 60/120', personal: [30, 60], shared: [60, 120] },
  { name: 'stage-60 calmer: personal 30/60, shared 90/180', personal: [30, 60], shared: [90, 180] },
  { name: 'sparse: personal 60, shared 90/180', personal: [60], shared: [90, 180] },
  { name: 'slow: personal 40/80, shared 80/160', personal: [40, 80], shared: [80, 160] },
  { name: 'long: personal 45/90, shared 90/180', personal: [45, 90], shared: [90, 180] },
]

const runs = 12000
const maxRolls = 260
const secondsPerRollAnimation = 5

function seededShuffle(items, seed) {
  const result = [...items]
  let value = (seed + 1) * 9301 + 49297

  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280
    const swapIndex = Math.floor((value / 233280) * (index + 1))
    const temp = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = temp
  }

  return result
}

const boardCache = []

function getCell(index) {
  while (index >= boardCache.length) {
    const startIndex = Math.floor(boardCache.length / segmentSize) * segmentSize
    boardCache.push(...seededShuffle(cellBag, Math.floor(startIndex / segmentSize)))
  }

  return boardCache[index]
}

function resolveMove(cell, player, landedPosition, positions) {
  const nextPositions = { ...positions, [player]: landedPosition }

  if (cell === 'advance') {
    return {
      A: nextPositions.A + 1,
      B: nextPositions.B + 1,
    }
  }

  if (cell !== 'close') return nextPositions

  const leader = nextPositions.A >= nextPositions.B ? 'A' : 'B'
  const follower = leader === 'A' ? 'B' : 'A'
  const target = Math.min(nextPositions[leader], nextPositions[follower] + 1)

  return {
    ...nextPositions,
    [leader]: target,
  }
}

function simulateRun(config) {
  let positions = { A: 0, B: 0 }
  let currentPlayer = 'A'
  const personalHits = Object.fromEntries(config.personal.map(steps => [steps, null]))
  const sharedHits = Object.fromEntries(config.shared.map(steps => [steps, null]))
  const events = []

  for (let rollCount = 1; rollCount <= maxRolls; rollCount += 1) {
    const player = currentPlayer
    const partner = player === 'A' ? 'B' : 'A'
    const before = { ...positions }
    const beforeShared = before.A + before.B
    const roll = Math.floor(Math.random() * 6) + 1
    const landedPosition = before[player] + roll
    const cell = getCell(landedPosition)

    positions = resolveMove(cell, player, landedPosition, positions)

    const crossedPersonal = config.personal.find(steps =>
      personalHits[steps] === null && before[player] < steps && positions[player] >= steps)
    const crossedShared = config.shared.find(steps =>
      sharedHits[steps] === null && beforeShared < steps && positions.A + positions.B >= steps)

    if (crossedPersonal) {
      personalHits[crossedPersonal] = rollCount
      events.push({ rollCount, type: 'personal', steps: crossedPersonal })
    } else if (crossedShared) {
      sharedHits[crossedShared] = rollCount
      events.push({ rollCount, type: 'shared', steps: crossedShared })
    }

    currentPlayer = cell === 'reroll' ? player : partner
  }

  return { personalHits, sharedHits, events }
}

function percentile(sortedValues, ratio) {
  if (sortedValues.length === 0) return null
  return sortedValues[Math.min(sortedValues.length - 1, Math.floor(sortedValues.length * ratio))]
}

function summarize(values) {
  const finite = values.filter(Number.isFinite).sort((a, b) => a - b)
  const mean = finite.reduce((sum, value) => sum + value, 0) / finite.length

  return {
    hit: `${((finite.length / values.length) * 100).toFixed(1)}%`,
    avg: Number(mean.toFixed(1)),
    p10: percentile(finite, 0.1),
    p50: percentile(finite, 0.5),
    p90: percentile(finite, 0.9),
  }
}

function countEventsByRoll(events, maxRoll) {
  return events.filter(event => event.rollCount <= maxRoll).length
}

const results = configs.map(config => {
  const firstPersonal = []
  const finalPersonal = []
  const firstShared = []
  const eventsBy20 = []
  const eventsBy30 = []
  const eventsBy60 = []
  const firstEventTypes = { personal: 0, shared: 0 }

  for (let index = 0; index < runs; index += 1) {
    const result = simulateRun(config)
    firstPersonal.push(result.personalHits[config.personal[0]] ?? Infinity)
    finalPersonal.push(result.personalHits[config.personal.at(-1)] ?? Infinity)
    firstShared.push(result.sharedHits[config.shared[0]] ?? Infinity)
    eventsBy20.push(countEventsByRoll(result.events, 20))
    eventsBy30.push(countEventsByRoll(result.events, 30))
    eventsBy60.push(countEventsByRoll(result.events, 60))
    if (result.events[0]) firstEventTypes[result.events[0].type] += 1
  }

  return {
    config: config.name,
    firstPersonal: summarize(firstPersonal),
    finalPersonal: summarize(finalPersonal),
    firstShared: summarize(firstShared),
    avgEventsBy20: Number((eventsBy20.reduce((sum, value) => sum + value, 0) / runs).toFixed(2)),
    avgEventsBy30: Number((eventsBy30.reduce((sum, value) => sum + value, 0) / runs).toFixed(2)),
    avgEventsBy60: Number((eventsBy60.reduce((sum, value) => sum + value, 0) / runs).toFixed(2)),
    firstEventSplit: {
      personal: `${((firstEventTypes.personal / runs) * 100).toFixed(1)}%`,
      shared: `${((firstEventTypes.shared / runs) * 100).toFixed(1)}%`,
    },
  }
})

console.table(results.map(result => ({
  config: result.config,
  firstPersonalRollP50: result.firstPersonal.p50,
  firstPersonalAnimSecP50: result.firstPersonal.p50 * secondsPerRollAnimation,
  finalPersonalRollP50: result.finalPersonal.p50,
  firstSharedRollP50: result.firstShared.p50,
  firstSharedAnimSecP50: result.firstShared.p50 * secondsPerRollAnimation,
  eventsBy20Rolls: result.avgEventsBy20,
  eventsBy30Rolls: result.avgEventsBy30,
  eventsBy60Rolls: result.avgEventsBy60,
  firstPersonal: result.firstEventSplit.personal,
  firstShared: result.firstEventSplit.shared,
})))

console.log(JSON.stringify(results, null, 2))
