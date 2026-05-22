import { useState } from 'react'
import type { Identity } from '../../hooks/useIdentity'
import { truthItems, dareItems } from '../../data/truth-or-dare-items'
import { wheelItems } from '../../data/wheel-items'

interface DiceGameProps {
  identity: Identity
  partnerName: string
}

type ActionResult = {
  title: string
  content: string
  tag: string
  tone: 'pink' | 'purple' | 'orange'
}

type RoundOutcome = 'mine' | 'partner' | 'tie'
type FollowAction = 'truth' | 'dare' | 'wheel'
type RewardPunishment = {
  title: string
  content: string
  tag: string
  tone: 'reward' | 'punishment' | 'challenge'
}

const rewardPool = [
  '获得一次无条件夸夸，至少说满 30 秒。',
  '获得一个拥抱或贴贴，由赢家决定时长。',
  '获得一次小愿望兑换权，今天有效。',
  '获得对方主动安排的一件暖心小事。',
]

const punishmentPool = [
  '认真说出一个最近忽略对方的小细节，并补上一句道歉或感谢。',
  '完成一个撒娇动作，直到对方说过关。',
  '给对方发一段不少于 20 字的真心话。',
  '主动承担一个今天能完成的小任务。',
]

const sharedChallengePool = [
  '一起完成上面的题目，然后互相说一句“我刚刚听懂的是……”。',
  '一起完成上面的题目，再给这轮表现各打一个温柔分。',
  '一起完成上面的题目，并约定一个今天的小奖励。',
]

const pickOne = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

export function DiceGame({ identity, partnerName }: DiceGameProps) {
  const [myDice, setMyDice] = useState<number | null>(null)
  const [taDice, setTaDice] = useState<number | null>(null)
  const [result, setResult] = useState('')
  const [rolling, setRolling] = useState(false)
  const [roundOutcome, setRoundOutcome] = useState<RoundOutcome | null>(null)
  const [roundResolved, setRoundResolved] = useState(false)
  const [actionResult, setActionResult] = useState<ActionResult | null>(null)
  const [rewardPunishment, setRewardPunishment] = useState<RewardPunishment | null>(null)

  const myName = identity || '你'
  const taName = partnerName || 'TA'

  const buildRewardPunishment = (action: FollowAction, actionTag: string, wheelTag?: string): RewardPunishment => {
    if (roundOutcome === 'tie') {
      return {
        title: '本轮共同挑战',
        content: pickOne(sharedChallengePool),
        tag: '一起完成',
        tone: 'challenge',
      }
    }

    const winner = roundOutcome === 'mine' ? myName : taName
    const loser = roundOutcome === 'mine' ? taName : myName

    if (action === 'wheel' && wheelTag === '奖励') {
      return {
        title: '本轮奖励',
        content: `${winner}领取上面的奖励；${loser}补一句真诚夸夸。`,
        tag: '赢家领取',
        tone: 'reward',
      }
    }

    if (action === 'wheel' && wheelTag === '惩罚') {
      return {
        title: '本轮惩罚',
        content: `${loser}执行上面的惩罚；${winner}负责温柔监督，不许嘲笑。`,
        tag: '输家执行',
        tone: 'punishment',
      }
    }

    return {
      title: '本轮奖惩',
      content: `${loser}完成上面的${actionTag}，再${pickOne(punishmentPool)}；${winner}${pickOne(rewardPool)}`,
      tag: '输家挑战',
      tone: 'punishment',
    }
  }

  const roll = () => {
    setRolling(true)
    setResult('')
    setRoundOutcome(null)
    setRoundResolved(false)
    setActionResult(null)
    setRewardPunishment(null)
    let count = 0
    const timer = setInterval(() => {
      setMyDice(Math.floor(Math.random() * 6) + 1)
      setTaDice(Math.floor(Math.random() * 6) + 1)
      count++
      if (count >= 10) {
        clearInterval(timer)
        setRolling(false)
        const m = Math.floor(Math.random() * 6) + 1
        const t = Math.floor(Math.random() * 6) + 1
        setMyDice(m)
        setTaDice(t)
        if (m > t) {
          setRoundOutcome('mine')
          setResult(`🎉 ${myName}赢了！请从下面选择奖惩。`)
        } else if (t > m) {
          setRoundOutcome('partner')
          setResult(`🎉 ${taName}赢了！请从下面选择奖惩。`)
        } else {
          setRoundOutcome('tie')
          setResult('🤝 平局！也可以抽一个共同挑战。')
        }
      }
    }, 100)
  }

  const drawTruthOrDare = (type: 'truth' | 'dare') => {
    if (roundResolved) return
    const next = pickOne(type === 'truth' ? truthItems : dareItems)
    const tag = type === 'truth' ? '真心话' : '大冒险'
    setActionResult({
      title: type === 'truth' ? '随机真心话' : '随机大冒险',
      content: next.content,
      tag,
      tone: type === 'truth' ? 'pink' : 'purple',
    })
    setRewardPunishment(buildRewardPunishment(type, tag))
    setRoundResolved(true)
  }

  const spinWheel = () => {
    if (roundResolved) return
    const next = pickOne(wheelItems)
    const tag = next.actionType === 'reward' ? '奖励' : '惩罚'
    setActionResult({
      title: next.actionType === 'reward' ? '转盘奖励' : '转盘惩罚',
      content: next.content,
      tag,
      tone: next.actionType === 'reward' ? 'pink' : 'orange',
    })
    setRewardPunishment(buildRewardPunishment('wheel', tag, tag))
    setRoundResolved(true)
  }

  const toneClass = actionResult?.tone === 'pink'
    ? 'from-pink-50 to-rose-50 border-pink-100 text-pink-600 bg-pink-100'
    : actionResult?.tone === 'purple'
      ? 'from-purple-50 to-violet-50 border-purple-100 text-purple-600 bg-purple-100'
      : 'from-orange-50 to-amber-50 border-orange-100 text-orange-600 bg-orange-100'

  const rewardToneClass = rewardPunishment?.tone === 'reward'
    ? 'from-green-50 to-emerald-50 border-green-100 text-green bg-green-100'
    : rewardPunishment?.tone === 'challenge'
      ? 'from-blue-50 to-sky-50 border-blue-100 text-blue bg-blue-100'
      : 'from-orange-50 to-amber-50 border-orange-100 text-orange-600 bg-orange-100'

  return (
    <div className="pixel-page min-h-full space-y-4 px-4 pt-4 pb-6 text-center">
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-xs text-text-muted mb-1">{myName}</p>
          <div className={`w-20 h-20 rounded-3xl border border-warm-100/90 flex items-center justify-center text-4xl font-black transition-all shadow-[0_10px_18px_rgba(61,44,46,0.055)] ${
            myDice ? 'bg-warm-100 text-warm-600 shadow-sm' : 'bg-warm-50 text-text-muted'
          }`}>
            {myDice || '?'}
          </div>
        </div>
        <span className="text-2xl text-text-muted">VS</span>
        <div className="text-center">
          <p className="text-xs text-text-muted mb-1">{taName}</p>
          <div className={`w-20 h-20 rounded-3xl border border-warm-100/90 flex items-center justify-center text-4xl font-black transition-all shadow-[0_10px_18px_rgba(61,44,46,0.055)] ${
            taDice ? 'bg-warm-100 text-warm-600 shadow-sm' : 'bg-warm-50 text-text-muted'
          }`}>
            {taDice || '?'}
          </div>
        </div>
      </div>

      <button
        onClick={roll}
        disabled={rolling}
        className="w-full min-h-[52px] rounded-2xl bg-warm-500 py-3 text-sm font-black text-white shadow-[0_10px_18px_rgba(184,74,36,0.16)] disabled:opacity-60 active:scale-95 transition-transform"
      >
        {rolling ? '🎲 骰子旋转中...' : '🎲 掷骰子！'}
      </button>

      {result && <p className="text-lg font-bold text-warm-600" style={{ animation: 'fadeIn 0.3s ease' }}>{result}</p>}

      {result && !rolling && (
        <div className="grid grid-cols-1 gap-3" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => drawTruthOrDare('truth')}
              disabled={roundResolved}
              className="w-full min-h-[52px] rounded-2xl border border-white/60 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(61,44,46,0.09)] disabled:opacity-50 disabled:grayscale active:scale-95 transition-transform"
            >
              抽真心话
            </button>
            <button
              onClick={() => drawTruthOrDare('dare')}
              disabled={roundResolved}
              className="w-full min-h-[52px] rounded-2xl border border-white/60 bg-gradient-to-r from-purple-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(61,44,46,0.09)] disabled:opacity-50 disabled:grayscale active:scale-95 transition-transform"
            >
              抽大冒险
            </button>
          </div>
          <button
            onClick={spinWheel}
            disabled={roundResolved}
            className="w-full min-h-[52px] rounded-2xl border border-white/60 bg-gradient-to-r from-orange-400 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(61,44,46,0.09)] disabled:opacity-50 disabled:grayscale active:scale-95 transition-transform"
          >
            转动转盘
          </button>
          {roundResolved && <p className="text-xs text-text-muted">本轮已生成结果，重新掷骰开启下一轮。</p>}
        </div>
      )}

      {actionResult && (
        <div
          className={`pixel-card bg-gradient-to-br p-5 text-left ${toneClass}`}
          style={{ animation: 'scaleIn 0.25s ease' }}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-text-primary">{actionResult.title}</p>
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${toneClass}`}>{actionResult.tag}</span>
          </div>
          <p className="text-base font-medium leading-relaxed text-text-primary">{actionResult.content}</p>
        </div>
      )}

      {rewardPunishment && (
        <div
          className={`pixel-card bg-gradient-to-br p-5 text-left ${rewardToneClass}`}
          style={{ animation: 'scaleIn 0.25s ease' }}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-text-primary">{rewardPunishment.title}</p>
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${rewardToneClass}`}>{rewardPunishment.tag}</span>
          </div>
          <p className="text-base font-medium leading-relaxed text-text-primary">{rewardPunishment.content}</p>
        </div>
      )}

      <p className="text-xs text-text-muted">赢家现场指定，输家立刻执行；平局就一起完成。</p>
    </div>
  )
}
