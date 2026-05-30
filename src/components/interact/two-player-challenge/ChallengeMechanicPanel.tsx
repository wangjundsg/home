import { challengeMechanicLabels, taskModeLabels } from '../../../features/two-player-challenge'
import type {
  ChallengeActionOption,
  ChallengeResponseOption,
  ChallengeRoundState,
  PlayerKey,
} from '../../../features/two-player-challenge'

interface ChallengeMechanicPanelProps {
  roundState: ChallengeRoundState
  playerLabels: Record<PlayerKey, string>
  onStartGate: () => void
  onChooseActiveAction: (actionId: string) => void
  onChoosePartnerResponse: (responseId: string) => void
  onRecordResonance: (playerKey: PlayerKey) => void
  onConfirmBoss: (playerKey: PlayerKey) => void
  onRevealGate: () => void
}

export function ChallengeMechanicPanel({
  roundState,
  playerLabels,
  onStartGate,
  onChooseActiveAction,
  onChoosePartnerResponse,
  onRecordResonance,
  onConfirmBoss,
  onRevealGate,
}: ChallengeMechanicPanelProps) {
  const activeLabel = playerLabels[roundState.activePlayer]
  const partnerLabel = playerLabels[roundState.partnerPlayer]

  return (
    <section className="pixel-card overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-warm-500">
            {roundState.isBoss ? '阶段收束' : challengeMechanicLabels[roundState.mechanicType]}
          </p>
          <h3 className="mt-1 text-lg font-black text-text-primary">{roundState.gateTitle}</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">{roundState.gatePrompt}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-warm-50 px-3 py-2 text-right text-[11px] font-black text-text-muted">
          <p>{roundState.isBoss ? 'Boss' : `第 ${roundState.roundIndex + 1} 门`}</p>
          <p>{roundState.activePlayer} · {activeLabel}</p>
        </div>
      </div>

      <FlowGuide roundState={roundState} />

      <div className="mt-4 rounded-2xl bg-pink-50 px-3 py-3 text-xs font-bold leading-relaxed text-pink-700">
        同屏可见：{activeLabel} 先做动作，{partnerLabel} 再回应。双方动作完成后才会揭晓素材。
      </div>

      {roundState.interactionStep === 'gate-ready' ? (
        <GateReadyPanel
          roundState={roundState}
          activeLabel={activeLabel}
          partnerLabel={partnerLabel}
          onStartGate={onStartGate}
        />
      ) : null}

      {roundState.interactionStep === 'active-action' ? (
        <ActiveActionPanel
          roundState={roundState}
          activeLabel={activeLabel}
          onChooseActiveAction={onChooseActiveAction}
        />
      ) : null}

      {roundState.interactionStep === 'partner-response' && roundState.isBoss ? (
        <BossConfirmPanel
          roundState={roundState}
          playerLabels={playerLabels}
          onConfirmBoss={onConfirmBoss}
        />
      ) : null}

      {roundState.interactionStep === 'partner-response' && roundState.mechanicType === 'lead-shift' && !roundState.isBoss ? (
        <ResonancePanel
          roundState={roundState}
          playerLabels={playerLabels}
          onRecordResonance={onRecordResonance}
        />
      ) : null}

      {roundState.interactionStep === 'partner-response' && roundState.mechanicType !== 'lead-shift' && !roundState.isBoss ? (
        <PartnerResponsePanel
          roundState={roundState}
          partnerLabel={partnerLabel}
          onChoosePartnerResponse={onChoosePartnerResponse}
        />
      ) : null}

      {roundState.interactionStep === 'gate-reveal' ? (
        <GateRevealPanel
          roundState={roundState}
          onRevealGate={onRevealGate}
        />
      ) : null}
    </section>
  )
}

function GateReadyPanel({
  roundState,
  activeLabel,
  partnerLabel,
  onStartGate,
}: {
  roundState: ChallengeRoundState
  activeLabel: string
  partnerLabel: string
  onStartGate: () => void
}) {
  return (
    <div className="mt-4 rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-black text-text-muted">准备开门</p>
      <p className="mt-2 text-sm font-bold leading-relaxed text-text-primary">
        {activeLabel} 先发起，{partnerLabel} 看着屏幕一起参与。完成两步后才会进入揭晓。
      </p>
      <button
        type="button"
        onClick={onStartGate}
        className="mt-4 min-h-[50px] w-full rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99]"
      >
        开始这道{roundState.isBoss ? ' Boss' : '小门'}
      </button>
    </div>
  )
}

function ActiveActionPanel({
  roundState,
  activeLabel,
  onChooseActiveAction,
}: {
  roundState: ChallengeRoundState
  activeLabel: string
  onChooseActiveAction: (actionId: string) => void
}) {
  return (
    <div className="mt-4 space-y-2">
      <p className="rounded-2xl bg-warm-50 px-3 py-2 text-xs font-black text-text-muted">
        {roundState.activePlayer} · {activeLabel} 先做一个可见动作
      </p>
      {roundState.activeActions.map(action => (
        <ActionButton
          key={action.id}
          action={action}
          onChooseActiveAction={onChooseActiveAction}
        />
      ))}
    </div>
  )
}

function PartnerResponsePanel({
  roundState,
  partnerLabel,
  onChoosePartnerResponse,
}: {
  roundState: ChallengeRoundState
  partnerLabel: string
  onChoosePartnerResponse: (responseId: string) => void
}) {
  return (
    <div className="mt-4 space-y-2">
      <p className="rounded-2xl bg-warm-50 px-3 py-2 text-xs font-black text-text-muted">
        已完成：{roundState.activeAction?.gesture}。现在由 {roundState.partnerPlayer} · {partnerLabel} 回应。
      </p>
      {roundState.partnerResponses.map(response => (
        <ResponseButton
          key={response.id}
          response={response}
          onChoosePartnerResponse={onChoosePartnerResponse}
        />
      ))}
    </div>
  )
}

function ResonancePanel({
  roundState,
  playerLabels,
  onRecordResonance,
}: {
  roundState: ChallengeRoundState
  playerLabels: Record<PlayerKey, string>
  onRecordResonance: (playerKey: PlayerKey) => void
}) {
  const nextPlayer: PlayerKey = roundState.resonanceHits.length % 2 === 0 ? roundState.activePlayer : roundState.partnerPlayer
  const done = roundState.resonanceHits.length >= 3

  return (
    <div className="mt-4 rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-black text-text-muted">主导权共振 · {roundState.resonanceHits.length}/3</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map(index => {
          const playerKey = roundState.resonanceHits[index]
          return (
            <div
              key={index}
              className={`rounded-2xl px-2 py-3 text-center text-xs font-black ${playerKey ? 'bg-pink-100 text-pink-600' : 'bg-warm-50 text-text-muted'}`}
            >
              {playerKey ? `${playerKey} 点亮` : `第 ${index + 1} 下`}
            </div>
          )
        })}
      </div>
      <button
        type="button"
        disabled={done}
        onClick={() => onRecordResonance(nextPlayer)}
        className="mt-4 min-h-[50px] w-full rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99] disabled:bg-warm-100 disabled:text-text-muted"
      >
        {done ? '共振完成，准备揭晓' : `${nextPlayer} · ${playerLabels[nextPlayer]} 轻点一下`}
      </button>
      <p className="mt-2 text-[11px] font-bold leading-relaxed text-text-muted">
        最后一次点亮的人会获得这一轮主导权。
      </p>
    </div>
  )
}

function BossConfirmPanel({
  roundState,
  playerLabels,
  onConfirmBoss,
}: {
  roundState: ChallengeRoundState
  playerLabels: Record<PlayerKey, string>
  onConfirmBoss: (playerKey: PlayerKey) => void
}) {
  return (
    <div className="mt-4 rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-black text-text-muted">Boss 双确认</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(['A', 'B'] as PlayerKey[]).map(playerKey => {
          const confirmed = roundState.bossConfirmations.includes(playerKey)
          return (
            <button
              key={playerKey}
              type="button"
              disabled={confirmed}
              onClick={() => onConfirmBoss(playerKey)}
              className={`min-h-[58px] rounded-2xl px-3 py-3 text-sm font-black active:scale-[0.99] disabled:active:scale-100 ${
                confirmed ? 'bg-pink-100 text-pink-600' : 'bg-warm-500 text-white'
              }`}
            >
              {confirmed ? `${playerKey} 已确认` : `${playerKey} · ${playerLabels[playerKey]} 确认`}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] font-bold leading-relaxed text-text-muted">
        两个人都确认后才会揭晓 Boss 素材。
      </p>
    </div>
  )
}

function GateRevealPanel({
  roundState,
  onRevealGate,
}: {
  roundState: ChallengeRoundState
  onRevealGate: () => void
}) {
  return (
    <div className="mt-4 rounded-2xl bg-pink-50 p-4">
      <p className="text-xs font-black text-pink-600">双方动作已完成</p>
      <p className="mt-2 text-sm font-bold leading-relaxed text-text-primary">
        {roundState.gateDecision?.summary ?? '这道门已经准备揭晓。'}
      </p>
      <button
        type="button"
        onClick={onRevealGate}
        className="mt-4 min-h-[50px] w-full rounded-2xl bg-pink-500 px-4 py-3 text-sm font-black text-white active:scale-[0.99]"
      >
        揭晓这道门
      </button>
    </div>
  )
}

function ActionButton({
  action,
  onChooseActiveAction,
}: {
  action: ChallengeActionOption
  onChooseActiveAction: (actionId: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChooseActiveAction(action.id)}
      className="min-h-[74px] w-full rounded-2xl bg-white/85 px-4 py-3 text-left text-text-primary shadow-sm active:scale-[0.99]"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-black">{action.label}</span>
        <span className="rounded-full bg-pink-100 px-2 py-1 text-[10px] font-black text-pink-600">{action.gesture}</span>
      </span>
      <span className="mt-1 block text-xs font-bold leading-relaxed text-text-muted">{action.description}</span>
    </button>
  )
}

function ResponseButton({
  response,
  onChoosePartnerResponse,
}: {
  response: ChallengeResponseOption
  onChoosePartnerResponse: (responseId: string) => void
}) {
  const isSoft = response.outcomeKey === 'miss' || response.outcomeKey === 'boss-failed'
  return (
    <button
      type="button"
      onClick={() => onChoosePartnerResponse(response.id)}
      className={`min-h-[74px] w-full rounded-2xl px-4 py-3 text-left text-text-primary active:scale-[0.99] ${
        isSoft ? 'bg-warm-50' : 'bg-white/85 shadow-sm'
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-black">{response.label}</span>
        <span className={`rounded-full px-2 py-1 text-[10px] font-black ${
          isSoft ? 'bg-white text-text-muted' : 'bg-pink-100 text-pink-600'
        }`}>
          {isSoft ? '温和' : taskModeLabels[response.taskMode]}
        </span>
      </span>
      <span className="mt-1 block text-xs font-bold leading-relaxed text-text-muted">{response.description}</span>
    </button>
  )
}

function FlowGuide({ roundState }: { roundState: ChallengeRoundState }) {
  const steps = [
    { key: 'gate-ready', label: '准备' },
    { key: 'active-action', label: `${roundState.activePlayer} 动作` },
    { key: 'partner-response', label: `${roundState.partnerPlayer} 回应` },
    { key: 'gate-reveal', label: '揭晓' },
  ]

  return (
    <div className="mt-4 grid grid-cols-4 gap-1.5">
      {steps.map(step => {
        const active = step.key === roundState.interactionStep
        const done = getStepOrder(roundState.interactionStep) > getStepOrder(step.key)
        return (
          <div
            key={step.key}
            className={`rounded-2xl px-2 py-2 text-center text-[11px] font-black ${
              active ? 'bg-warm-500 text-white' : done ? 'bg-pink-100 text-pink-600' : 'bg-warm-50 text-text-muted'
            }`}
          >
            {step.label}
          </div>
        )
      })}
    </div>
  )
}

function getStepOrder(step: string): number {
  if (step === 'gate-ready') return 0
  if (step === 'active-action') return 1
  if (step === 'partner-response') return 2
  if (step === 'gate-reveal') return 3
  return 4
}
