import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, RefreshCw, Shield, SlidersHorizontal } from 'lucide-react'
import {
  HEART_TUNE_RULES,
  HEART_TUNE_SCENES,
  HEART_TUNE_STAGES,
  createEmptyVotes,
  drawCompatibleHeartTuneScene,
  drawHeartTuneProposals,
  drawHeartTuneRule,
  drawMaterialForLead,
  getHigherStage,
  getLowerStage,
  renderHeartTuneCard,
  resolveTuneRound,
  type HeartTuneBoosts,
  type HeartTuneMaterial,
  type HeartTunePlayerKey,
  type HeartTuneProposal,
  type HeartTuneProposalKey,
  type HeartTuneRenderedCard,
  type HeartTuneRoundResult,
  type HeartTuneScene,
  type HeartTuneStage,
  type HeartTuneVotes,
} from '../features/heart-tune'

interface TwoPlayerChallengePageProps {
  identity?: string | null
  partnerName?: string | null
  navigate: (route: string) => void
}

const playerKeys: readonly HeartTunePlayerKey[] = ['A', 'B']
const maxMarks = 3
const stageShiftCost = 2
const avoidCost = 3
const sceneRollMs = 2000
const proposalDealMs = 2000
const ruleResolveMs = 2200
const animationTickMs = 180
const dealPhrases = ['洗目标牌', '命题入池', '锁定主导', '准备翻面']
type TuneFlowState = 'rollingScene' | 'dealingProposals' | 'voting' | 'resolvingRule' | 'revealed'

const randomIndex = (length: number) => Math.floor(Math.random() * length)

export function TwoPlayerChallengePage({ identity, partnerName }: TwoPlayerChallengePageProps) {
  const playerLabels = useMemo<Record<HeartTunePlayerKey, string>>(() => ({
    A: identity || '大大怪',
    B: partnerName || '小怪兽',
  }), [identity, partnerName])
  const [stage, setStage] = useState<HeartTuneStage>('flirt')
  const [defaultLead, setDefaultLead] = useState<HeartTunePlayerKey>('A')
  const [votes, setVotes] = useState<HeartTuneVotes>(() => createEmptyVotes())
  const [boosts, setBoosts] = useState<HeartTuneBoosts>({})
  const [roundResult, setRoundResult] = useState<HeartTuneRoundResult | null>(null)
  const [selectedCard, setSelectedCard] = useState<HeartTuneRenderedCard | null>(null)
  const [usedIds, setUsedIds] = useState<string[]>([])
  const [rule, setRule] = useState(() => drawHeartTuneRule())
  const [proposals, setProposals] = useState<readonly [HeartTuneProposal, HeartTuneProposal]>(() => drawHeartTuneProposals())
  const [scene, setScene] = useState(() => drawCompatibleHeartTuneScene(proposals))
  const [proposalsRevealed, setProposalsRevealed] = useState(false)
  const [flowState, setFlowState] = useState<TuneFlowState>('rollingScene')
  const [animationTick, setAnimationTick] = useState(0)
  const [sceneRollOffset, setSceneRollOffset] = useState(() => randomIndex(HEART_TUNE_SCENES.length))
  const [dealSpinOffset, setDealSpinOffset] = useState(() => randomIndex(dealPhrases.length))
  const [ruleSpinOffset, setRuleSpinOffset] = useState(() => randomIndex(HEART_TUNE_RULES.length))
  const [pendingRoundResult, setPendingRoundResult] = useState<HeartTuneRoundResult | null>(null)
  const [marks, setMarks] = useState<Record<HeartTunePlayerKey, number>>({ A: 0, B: 0 })
  const [error, setError] = useState<string | null>(null)

  const readyToTune = flowState === 'voting' && proposalsRevealed && playerKeys.every(player => votes[player])
  const canLowerStage = selectedCard ? getLowerStage(selectedCard.stage) !== selectedCard.stage : false
  const canHigherStage = selectedCard ? getHigherStage(selectedCard.stage) !== selectedCard.stage : false

  const renderSelectedCard = useCallback((material: HeartTuneMaterial, result: HeartTuneRoundResult): HeartTuneRenderedCard =>
    renderHeartTuneCard(material, result.leadPlayer, playerLabels, result.ruleSummary, result.ruleUsed, getRewardSummary(result, playerLabels)), [playerLabels])

  const finalizeRoundResult = useCallback((result: HeartTuneRoundResult) => {
    if (flowState === 'revealed') return
    setRoundResult(result)
    setDefaultLead(result.leadPlayer === 'A' ? 'B' : 'A')
    setSelectedCard(renderSelectedCard(result.candidates[0].material, result))
    if (result.winners.length > 0) {
      setMarks(prev => result.winners.reduce(
        (next, player) => ({ ...next, [player]: Math.min(maxMarks, next[player] + 1) }),
        prev,
      ))
    }
    setPendingRoundResult(null)
    setAnimationTick(0)
    setFlowState('revealed')
    setError(null)
  }, [flowState, renderSelectedCard])

  useEffect(() => {
    if (flowState !== 'rollingScene' && flowState !== 'dealingProposals' && flowState !== 'resolvingRule') return
    const interval = window.setInterval(() => setAnimationTick(prev => prev + 1), animationTickMs)
    return () => window.clearInterval(interval)
  }, [flowState])

  useEffect(() => {
    if (flowState === 'rollingScene') {
      const timer = window.setTimeout(() => {
        setAnimationTick(0)
        setFlowState('dealingProposals')
      }, sceneRollMs)
      return () => window.clearTimeout(timer)
    }

    if (flowState === 'dealingProposals') {
      const timer = window.setTimeout(() => {
        setProposalsRevealed(true)
        setAnimationTick(0)
        setFlowState('voting')
      }, proposalDealMs)
      return () => window.clearTimeout(timer)
    }

    if (flowState === 'resolvingRule' && pendingRoundResult) {
      const timer = window.setTimeout(() => {
        finalizeRoundResult(pendingRoundResult)
      }, ruleResolveMs)
      return () => window.clearTimeout(timer)
    }
  }, [flowState, pendingRoundResult, finalizeRoundResult])

  const selectStage = (nextStage: HeartTuneStage) => {
    setStage(nextStage)
    startNewRound(drawHeartTuneProposals(proposals))
    setRule(drawHeartTuneRule(rule.key))
  }

  const voteFor = (player: HeartTunePlayerKey, proposalKey: HeartTuneProposalKey) => {
    if (flowState !== 'voting' || !proposalsRevealed || selectedCard) return
    const previousBoost = boosts[player]
    if (previousBoost) {
      setMarks(prev => ({ ...prev, [player]: Math.min(maxMarks, prev[player] + 1) }))
    }
    setVotes(prev => ({ ...prev, [player]: proposalKey }))
    setBoosts(prev => ({ ...prev, [player]: undefined }))
    setError(null)
  }

  const boostVote = (player: HeartTunePlayerKey) => {
    if (flowState !== 'voting' || !proposalsRevealed || selectedCard) return
    const vote = votes[player]
    if (!vote) {
      setError(`${playerLabels[player]} 需要先站队`)
      return
    }
    if (boosts[player]) {
      setBoosts(prev => ({ ...prev, [player]: undefined }))
      setMarks(prev => ({ ...prev, [player]: Math.min(maxMarks, prev[player] + 1) }))
      setError(null)
      return
    }
    if (marks[player] < 1) {
      setError(null)
      return
    }
    setBoosts(prev => ({ ...prev, [player]: vote }))
    setMarks(prev => ({ ...prev, [player]: prev[player] - 1 }))
    setError(null)
  }

  const tuneRound = () => {
    try {
      if (!readyToTune) return
      const result = resolveTuneRound({ stage, defaultLead, proposals, votes, boosts, usedIds, rule, scene })
      if (result.ruleUsed) {
        setPendingRoundResult(result)
        setAnimationTick(0)
        setRuleSpinOffset(randomIndex(HEART_TUNE_RULES.length))
        setFlowState('resolvingRule')
      } else {
        finalizeRoundResult(result)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '这一轮还没调出来')
    }
  }

  const spendMark = (player: HeartTunePlayerKey, cost = 1) => {
    if (marks[player] < cost) {
      setError(null)
      return false
    }
    setMarks(prev => ({ ...prev, [player]: prev[player] - cost }))
    setError(null)
    return true
  }

  const rerollSameType = (player: HeartTunePlayerKey) => {
    if (!selectedCard || !roundResult) return
    if (!spendMark(player)) return
    const material = drawMaterialForLead(selectedCard.stage, selectedCard.mode, roundResult.leadPlayer, [...usedIds, selectedCard.materialId])
    setSelectedCard(renderSelectedCard(material, roundResult))
  }

  const drawLowerStage = (player: HeartTunePlayerKey) => {
    if (!selectedCard || !roundResult) return
    const lowerStage = getLowerStage(selectedCard.stage)
    if (lowerStage === selectedCard.stage) return
    if (!spendMark(player, stageShiftCost)) return
    const material = drawMaterialForLead(lowerStage, selectedCard.mode, roundResult.leadPlayer, usedIds)
    setSelectedCard(renderSelectedCard(material, { ...roundResult, stage: lowerStage }))
  }

  const drawHigherStage = (player: HeartTunePlayerKey) => {
    if (!selectedCard || !roundResult) return
    const higherStage = getHigherStage(selectedCard.stage)
    if (higherStage === selectedCard.stage) return
    if (!spendMark(player, stageShiftCost)) return
    const material = drawMaterialForLead(higherStage, selectedCard.mode, roundResult.leadPlayer, usedIds)
    setSelectedCard(renderSelectedCard(material, { ...roundResult, stage: higherStage }))
  }

  const avoidResult = (player: HeartTunePlayerKey) => {
    if (!selectedCard || !roundResult) return
    if (!spendMark(player, avoidCost)) return
    startNewRound(drawHeartTuneProposals(proposals))
    setRule(drawHeartTuneRule(rule.key))
  }

  const nextRound = () => {
    if (selectedCard) {
      setUsedIds(prev => prev.includes(selectedCard.materialId) ? prev : [...prev, selectedCard.materialId])
    }
    startNewRound(drawHeartTuneProposals(proposals))
    setRule(drawHeartTuneRule(rule.key))
  }

  const startNewRound = (nextProposals: readonly [HeartTuneProposal, HeartTuneProposal]) => {
    resetRound(nextProposals)
    setScene(drawCompatibleHeartTuneScene(nextProposals, scene.key))
  }

  const resetRound = (nextProposals: readonly [HeartTuneProposal, HeartTuneProposal]) => {
    setVotes(createEmptyVotes())
    setBoosts({})
    setRoundResult(null)
    setSelectedCard(null)
    setPendingRoundResult(null)
    setProposals(nextProposals)
    setProposalsRevealed(false)
    setAnimationTick(0)
    setSceneRollOffset(randomIndex(HEART_TUNE_SCENES.length))
    setDealSpinOffset(randomIndex(dealPhrases.length))
    setFlowState('rollingScene')
    setError(null)
  }

  return (
    <div className="pixel-page mx-auto flex min-h-full w-full max-w-[560px] flex-col gap-2.5 px-3 pt-2.5 pb-5 sm:px-4 sm:pt-4">
      <section className="pixel-card space-y-2 p-2.5">
        <div className="grid grid-cols-4 gap-1">
          {HEART_TUNE_STAGES.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => selectStage(item.key)}
              className={`min-h-[36px] rounded-2xl px-1.5 py-1.5 text-[11px] font-black ${stage === item.key ? 'bg-warm-500 text-white shadow-sm' : 'bg-white text-text-primary ring-1 ring-warm-100'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-1.5">
          <SceneCard scene={scene} flowState={flowState} animationTick={animationTick} spinOffset={sceneRollOffset} />
          <MarkBoard marks={marks} playerLabels={playerLabels} />
        </div>
      </section>

      {flowState === 'rollingScene' || flowState === 'dealingProposals' ? (
        <ProposalDeck flowState={flowState} animationTick={animationTick} spinOffset={dealSpinOffset} />
      ) : (
        <ProposalDuel
          proposals={proposals}
          votes={votes}
          boosts={boosts}
          marks={marks}
          playerLabels={playerLabels}
          resultLocked={flowState !== 'voting'}
          onVote={voteFor}
          onBoost={boostVote}
        />
      )}

      {flowState === 'voting' ? (
        <button
          type="button"
          onClick={tuneRound}
          disabled={!readyToTune}
          className="min-h-[46px] rounded-2xl bg-warm-500 px-4 py-2.5 text-sm font-black text-white shadow-sm active:scale-[0.99] disabled:opacity-45"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal size={17} />
            调出本轮
          </span>
        </button>
      ) : null}
      {flowState === 'resolvingRule' ? (
        <RuleResolvingPanel rule={rule} animationTick={animationTick} spinOffset={ruleSpinOffset} />
      ) : null}
      {error ? (
        <section className="pixel-card border-red-100 bg-red-50/70 p-4 text-sm font-bold leading-relaxed text-red-600">
          {error}
        </section>
      ) : null}

      {flowState === 'revealed' && selectedCard ? (
        <SelectedCardPanel
          card={selectedCard}
          marks={marks}
          playerLabels={playerLabels}
          onReroll={rerollSameType}
          onAvoid={avoidResult}
          onLowerStage={drawLowerStage}
          onHigherStage={drawHigherStage}
          onNext={nextRound}
          canLowerStage={canLowerStage}
          canHigherStage={canHigherStage}
        />
      ) : null}
    </div>
  )
}

function ProposalDeck({
  flowState,
  animationTick,
  spinOffset,
}: {
  flowState: TuneFlowState
  animationTick: number
  spinOffset: number
}) {
  const dealing = flowState === 'dealingProposals'
  const leftLabel = dealing ? dealPhrases[(animationTick + spinOffset) % dealPhrases.length] : '目标洗牌'
  const rightLabel = dealing ? dealPhrases[(animationTick + spinOffset + 1) % dealPhrases.length] : '命题待命'

  return (
    <section className="pixel-card p-2">
      <div className="rounded-2xl bg-pink-50 px-3 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="text-xs font-black text-pink-600">{dealing ? '命题抽取中' : '目标转动中'}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <DeckBack label={leftLabel} active={dealing} />
          <DeckBack label={rightLabel} active={dealing} />
        </div>
        <h3 className="mt-3 text-lg font-black text-text-primary">
          {dealing ? '正在抽出两道命题' : '先锁定本轮目标'}
        </h3>
      </div>
    </section>
  )
}

function DeckBack({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`min-h-[92px] rounded-2xl border border-pink-100 bg-white px-3 py-4 shadow-sm ${active ? 'animate-pulse' : ''}`}>
      <p className="text-[11px] font-black text-pink-500">命题牌背</p>
      <p className="mt-3 text-base font-black text-text-primary">{label}</p>
      <div className="mt-3 grid grid-cols-3 gap-1">
        {[0, 1, 2].map(item => (
          <span key={item} className="h-1.5 rounded-full bg-pink-100" />
        ))}
      </div>
    </div>
  )
}

function SceneCard({
  scene,
  flowState,
  animationTick,
  spinOffset,
}: {
  scene: HeartTuneScene
  flowState: TuneFlowState
  animationTick: number
  spinOffset: number
}) {
  const rolling = flowState === 'rollingScene'
  const displayedScene = rolling ? HEART_TUNE_SCENES[(animationTick + spinOffset) % HEART_TUNE_SCENES.length] : scene

  return (
    <section className={`min-w-0 rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-warm-100 ${rolling ? 'animate-pulse' : ''}`}>
      <p className="text-[11px] font-black text-pink-600">{rolling ? '本轮目标转动中' : '本轮目标'} · {displayedScene.label}</p>
      <p className="mt-0.5 text-sm font-black leading-snug text-text-primary">
        {getScenePrompt(displayedScene)}
      </p>
    </section>
  )
}

function MarkBoard({
  marks,
  playerLabels,
}: {
  marks: Record<HeartTunePlayerKey, number>
  playerLabels: Record<HeartTunePlayerKey, string>
}) {
  return (
    <section className="grid w-[88px] shrink-0 grid-cols-1 gap-1">
      {playerKeys.map(player => (
        <div key={player} className="rounded-2xl bg-white/80 px-2 py-1.5 ring-1 ring-pink-100">
          <p className="truncate text-[10px] font-black text-pink-600">{playerLabels[player]}</p>
          <p className="text-sm font-black text-text-primary">{marks[player]}/3</p>
        </div>
      ))}
    </section>
  )
}

function ProposalDuel({
  proposals,
  votes,
  boosts,
  marks,
  playerLabels,
  resultLocked,
  onVote,
  onBoost,
}: {
  proposals: readonly [HeartTuneProposal, HeartTuneProposal]
  votes: HeartTuneVotes
  boosts: HeartTuneBoosts
  marks: Record<HeartTunePlayerKey, number>
  playerLabels: Record<HeartTunePlayerKey, string>
  resultLocked: boolean
  onVote: (player: HeartTunePlayerKey, proposalKey: HeartTuneProposalKey) => void
  onBoost: (player: HeartTunePlayerKey) => void
}) {
  return (
    <section className="grid gap-2">
      <div className="grid grid-cols-2 gap-1.5">
        {proposals.map(proposal => (
          <ProposalCard
            key={proposal.key}
            proposal={proposal}
            votes={votes}
            boosts={boosts}
            playerLabels={playerLabels}
          />
        ))}
      </div>
      <div className="pixel-card grid gap-2 p-2.5">
        {playerKeys.map(player => (
          <div key={player}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-black text-text-primary">{playerLabels[player]}</h3>
              <button
                type="button"
                onClick={() => onBoost(player)}
                disabled={resultLocked || !votes[player] || (!boosts[player] && marks[player] < 1)}
                className="min-h-[30px] rounded-2xl border border-pink-100 bg-white/80 px-3 text-[11px] font-black text-pink-600 disabled:opacity-45"
              >
                {boosts[player] ? '取消加码' : '加码'}
              </button>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {proposals.map(proposal => (
                <button
                  key={`${player}-${proposal.key}`}
                  type="button"
                  onClick={() => onVote(player, proposal.key)}
                  disabled={resultLocked}
                  className={`min-h-[40px] rounded-2xl px-3 text-sm font-black ${votes[player] === proposal.key ? 'bg-pink-500 text-white' : 'bg-white text-text-primary ring-1 ring-pink-100'}`}
                >
                  支持 {proposal.key}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProposalCard({
  proposal,
  votes,
  boosts,
  playerLabels,
}: {
  proposal: HeartTuneProposal
  votes: HeartTuneVotes
  boosts: HeartTuneBoosts
  playerLabels: Record<HeartTunePlayerKey, string>
}) {
  const supporters = playerKeys.filter(player => votes[player] === proposal.key)
  const boostedBy = playerKeys.filter(player => boosts[player] === proposal.key)

  return (
    <article className="pixel-card min-h-[94px] p-2.5">
      <p className="text-[11px] font-black text-pink-600">{proposal.label}</p>
      <h3 className="mt-0.5 text-xl font-black leading-tight text-text-primary">{getProposalModeText(proposal)}</h3>
      <p className="mt-1 text-xs font-black text-text-primary">{playerLabels[proposal.leadPlayer]}主导</p>
      <div className="mt-1.5 flex min-h-[18px] flex-wrap gap-1">
        {supporters.map(player => (
          <span key={player} className="rounded-full bg-warm-100 px-2 py-1 text-[10px] font-black text-warm-600">
            {playerLabels[player]}
          </span>
        ))}
        {boostedBy.map(player => (
          <span key={`${player}-boost`} className="rounded-full bg-pink-100 px-2 py-1 text-[10px] font-black text-pink-600">
            {playerLabels[player]}加码
          </span>
        ))}
      </div>
    </article>
  )
}

function RuleResolvingPanel({
  rule,
  animationTick,
  spinOffset,
}: {
  rule: HeartTuneRoundResult['rule']
  animationTick: number
  spinOffset: number
}) {
  const lockTick = Math.max(4, Math.floor(ruleResolveMs / animationTickMs) - 3)
  const locked = animationTick >= lockTick
  const displayedRule = locked ? rule : HEART_TUNE_RULES[(animationTick + spinOffset) % HEART_TUNE_RULES.length] ?? rule

  return (
    <section className="pixel-card p-3">
      <div className="rounded-2xl bg-pink-50 px-3 py-4">
        <div className="flex items-center justify-center gap-2">
          <p className="text-xs font-black text-pink-600">暗牌裁定中</p>
        </div>
        <div className="mt-3 rounded-2xl border border-pink-100 bg-white px-4 py-5 text-center shadow-sm animate-pulse">
          <p className="text-[11px] font-black text-pink-500">{locked ? '暗牌锁定' : '翻暗牌'}</p>
          <h3 className="mt-2 text-xl font-black text-text-primary">{displayedRule.label}</h3>
          <p className="mt-1 text-xs font-bold leading-relaxed text-text-muted">{displayedRule.description}</p>
        </div>
      </div>
    </section>
  )
}

interface SelectedCardPanelProps {
  card: HeartTuneRenderedCard
  marks: Record<HeartTunePlayerKey, number>
  playerLabels: Record<HeartTunePlayerKey, string>
  onReroll: (player: HeartTunePlayerKey) => void
  onAvoid: (player: HeartTunePlayerKey) => void
  onLowerStage: (player: HeartTunePlayerKey) => void
  onHigherStage: (player: HeartTunePlayerKey) => void
  onNext: () => void
  canLowerStage: boolean
  canHigherStage: boolean
}

function SelectedCardPanel({
  card,
  marks,
  playerLabels,
  onReroll,
  onAvoid,
  onLowerStage,
  onHigherStage,
  onNext,
  canLowerStage,
  canHigherStage,
}: SelectedCardPanelProps) {
  return (
    <section className="pixel-card p-3.5" style={{ animation: 'scaleIn 0.18s ease' }}>
      <div className="grid grid-cols-[1fr_auto] items-start gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-pink-600">结果 + 任务 · {card.leadLabel}主导</p>
          <h3 className="mt-0.5 text-xl font-black leading-tight text-text-primary">{card.title}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="pixel-tag">{card.stageLabel}</span>
          <span className="pixel-tag">{card.modeLabel}</span>
        </div>
      </div>
      <div className="mt-2.5 overflow-hidden rounded-2xl bg-warm-50">
        <p className="min-h-[72px] px-3 py-2.5 text-base font-black leading-relaxed text-text-primary">{card.text}</p>
        <div className="border-t border-white/75 bg-pink-50 px-3 py-2 text-[11px] font-bold leading-snug text-pink-600">
          <p>
            <span className="font-black">{card.ruleUsed ? '暗牌' : '说明'}：</span>
            {card.ruleSummary}
          </p>
          <p className="mt-0.5">{card.rewardSummary}</p>
        </div>
      </div>
      <div className="mt-2.5 grid gap-2">
        {playerKeys.map(player => (
          <div key={player} className="grid grid-cols-[minmax(62px,0.75fr)_1.9fr] items-center gap-2 rounded-2xl bg-white/70 p-2 ring-1 ring-warm-100">
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-text-primary">{playerLabels[player]}</p>
              <p className="text-[11px] font-black text-pink-600">{marks[player]}/3 印记</p>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <TokenActionButton label="换1" icon={<RefreshCw size={13} />} disabled={marks[player] < 1} onClick={() => onReroll(player)} />
              <TokenActionButton label="降2" icon={<ArrowDown size={13} />} disabled={marks[player] < stageShiftCost || !canLowerStage} onClick={() => onLowerStage(player)} />
              <TokenActionButton label="升2" icon={<ArrowUp size={13} />} disabled={marks[player] < stageShiftCost || !canHigherStage} onClick={() => onHigherStage(player)} />
              <TokenActionButton label="避3" icon={<Shield size={13} />} disabled={marks[player] < avoidCost} onClick={() => onAvoid(player)} />
            </div>
          </div>
        ))}
        <button type="button" onClick={onNext} className="min-h-[42px] rounded-2xl bg-warm-500 px-4 py-2 text-sm font-black text-white active:scale-[0.99]">
          下一轮
        </button>
      </div>
    </section>
  )
}

function TokenActionButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-[38px] flex-col items-center justify-center gap-0.5 rounded-2xl border border-warm-200 bg-white px-1 text-[10px] font-black text-text-muted active:scale-[0.99] disabled:opacity-45"
    >
      {icon}
      {label}
    </button>
  )
}

function getProposalModeText(proposal: HeartTuneProposal): string {
  const modeLabels: Record<HeartTuneProposal['mode'], string> = {
    directed: '主动卡',
    response: '回应卡',
    duo: '双人卡',
    scene: '场景卡',
  }
  return modeLabels[proposal.mode]
}

function getScenePrompt(scene: HeartTuneScene): string {
  const prompts: Record<HeartTuneScene['key'], string> = {
    'same-wave': '两个人押同一命题；如果它生效，双方各拿 1 枚印记。',
    'split-bet': '两个人押不同命题；结果生效的支持者拿 1 枚印记。',
    'lead-race': '押你认为会生效的主导方；最终主导方拿 1 枚印记。',
    'give-and-take': '押对方主导的命题；它生效时，支持者拿 1 枚印记。',
    'close-range': '押双人卡或场景卡；如果这类命题生效，双方各拿 1 枚印记。',
    'reverse-read': '押非自己主导的命题；它生效时，支持者拿 1 枚印记。',
  }
  return prompts[scene.key]
}

function getRewardSummary(
  result: HeartTuneRoundResult,
  playerLabels: Record<HeartTunePlayerKey, string>,
): string {
  if (result.winners.length === 0) return `未命中「${result.scene.label}」，无印记。`
  const winners = result.winners.map(player => playerLabels[player]).join('、')
  return `命中「${result.scene.label}」：${winners} +1。`
}
