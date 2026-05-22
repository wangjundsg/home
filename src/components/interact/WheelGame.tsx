import { useState } from 'react'
import { wheelItems, type WheelItem } from '../../data/wheel-items'

export function WheelGame() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<WheelItem | null>(null)

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    let count = 0
    const timer = setInterval(() => {
      const r = wheelItems[Math.floor(Math.random() * wheelItems.length)]
      setResult(r)
      count++
      if (count >= 15) {
        clearInterval(timer)
        setSpinning(false)
      }
    }, 100)
  }

  const displayEmoji = result
    ? result.actionType === 'reward' ? '🎁' : '😈'
    : '🎡'

  return (
    <div className="pixel-page min-h-full space-y-5 px-4 pt-4 pb-6 text-center">
      <p className="pixel-note px-4 py-3 text-sm font-semibold text-text-secondary">命运交给转盘！全题库随机抽取</p>

      <div className="flex justify-center items-center py-2">
        <div
          className={`w-[72vw] max-w-[300px] aspect-square rounded-full flex items-center justify-center text-5xl font-bold shadow-[0_10px_0_rgba(232,115,74,0.12),0_22px_38px_rgba(61,44,46,0.08)] border-8 transition-all ${
            result
              ? result.actionType === 'reward'
                ? 'border-pink-300 bg-pink-50 text-pink-600'
                : 'border-orange-300 bg-orange-50 text-orange-600'
              : 'border-warm-200 bg-warm-50 text-text-muted'
          } ${spinning ? 'animate-spin' : ''}`}
        >
          {displayEmoji}
        </div>
      </div>

      <button onClick={spin} disabled={spinning}
        className="min-h-[52px] w-full rounded-2xl bg-purple-500 py-3 text-sm font-black text-white shadow-[0_10px_18px_rgba(126,58,242,0.18)] transition-transform active:scale-95 disabled:opacity-60">
        {spinning ? '转盘中...' : '转动转盘！'}
      </button>

      {result && !spinning && (
        <div
          className={`rounded-2xl p-4 card shadow-md ${
            result.actionType === 'reward'
              ? 'bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100'
              : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100'
          }`}
          style={{ animation: 'scaleIn 0.25s ease' }}
        >
          <p className={`font-semibold text-base ${
            result.actionType === 'reward' ? 'text-pink-600' : 'text-orange-600'
          }`}>
            {result.content}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              result.actionType === 'reward' ? 'bg-pink-100 text-pink-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {result.actionType === 'reward' ? '奖励' : '惩罚'}
            </span>
          </div>
        </div>
      )}

      <p className="text-[10px] text-text-muted">
        全题库随机 · 共 {wheelItems.length} 项
      </p>
    </div>
  )
}
