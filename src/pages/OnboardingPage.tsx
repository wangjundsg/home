import { useState } from 'react'
import { Particles } from '../components/ui'

interface OnboardingPageProps {
  onComplete: (who: string, partnerName: string) => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [myName, setMyName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [showParticles, setShowParticles] = useState(false)

  const handleConfirm = () => {
    if (!myName.trim() || !partnerName.trim()) return
    setShowParticles(true)
    setTimeout(() => onComplete(myName.trim(), partnerName.trim()), 600)
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-8">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">欢迎来到我们的花园</h1>
        <p className="text-text-secondary text-sm">在开始之前，先告诉我你们怎么称呼彼此</p>
      </div>

      <div className="w-full max-w-xs space-y-4 mb-8">
        <div>
          <label className="text-sm text-text-secondary mb-1 block">我的昵称</label>
          <input
            value={myName}
            onChange={e => setMyName(e.target.value)}
            placeholder="输入你的昵称"
            className="w-full rounded-xl border-2 border-warm-200 px-4 py-3 text-sm focus:outline-none focus:border-warm-400 bg-white"
          />
        </div>
        <div>
          <label className="text-sm text-text-secondary mb-1 block">TA的昵称</label>
          <input
            value={partnerName}
            onChange={e => setPartnerName(e.target.value)}
            placeholder="输入TA的昵称"
            className="w-full rounded-xl border-2 border-warm-200 px-4 py-3 text-sm focus:outline-none focus:border-warm-400 bg-white"
          />
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!myName.trim() || !partnerName.trim()}
        className={`w-full max-w-xs py-3.5 rounded-full text-lg font-semibold transition-all ${
          myName.trim() && partnerName.trim()
            ? 'bg-warm-500 text-white shadow-lg hover:bg-warm-600 active:scale-95'
            : 'bg-warm-200 text-warm-400 cursor-not-allowed'
        }`}
      >
        进入我们的小花园 🌸
      </button>

      <p className="text-text-muted text-xs mt-6 text-center">
        这是只属于你们两个人的小工具<br />
        所有记录双方可见，请放心使用
      </p>

      {showParticles && <Particles emoji="🌸" />}
    </div>
  )
}
