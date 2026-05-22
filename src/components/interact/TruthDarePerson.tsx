import { useState } from 'react'
import { truthItems, dareItems, type TruthOrDareItem } from '../../data/truth-or-dare-items'

type GameType = 'truth' | 'dare'

const CUSTOM_KEYS: Record<GameType, string> = {
  truth: 'qinggan_custom_truths',
  dare: 'qinggan_custom_dares',
}

export function TruthDarePerson() {
  const [mode, setMode] = useState<GameType | null>(null)
  const [item, setItem] = useState<TruthOrDareItem | null>(null)
  const [usedIds, setUsedIds] = useState<Record<GameType, Set<number>>>({ truth: new Set(), dare: new Set() })
  const [showForm, setShowForm] = useState(false)
  const [customText, setCustomText] = useState('')
  const [customType, setCustomType] = useState<GameType>('truth')

  const getCustomPool = (type: GameType) => JSON.parse(localStorage.getItem(CUSTOM_KEYS[type]) || '[]') as string[]

  const getPool = (type: GameType): TruthOrDareItem[] => {
    const basePool = type === 'truth' ? truthItems : dareItems
    const customPool = getCustomPool(type).map((content, index): TruthOrDareItem => ({
      id: -1000 - index,
      type,
      level: 'normal',
      content,
    }))
    return [...basePool, ...customPool]
  }

  const draw = (type: GameType) => {
    setMode(type)
    const pool = getPool(type)
    const used = usedIds[type]
    const available = pool.filter(option => !used.has(option.id))

    if (available.length === 0) {
      setItem({ id: -1, type, level: 'normal', content: '题库已抽完，点击重置后再来一轮吧！' })
      return
    }

    const next = available[Math.floor(Math.random() * available.length)]
    setUsedIds(prev => {
      const newUsed = new Set(prev[type])
      newUsed.add(next.id)
      return { ...prev, [type]: newUsed }
    })
    setItem(next)
  }

  const addCustom = () => {
    if (!customText.trim()) return
    const existing = getCustomPool(customType)
    existing.push(customText.trim())
    localStorage.setItem(CUSTOM_KEYS[customType], JSON.stringify(existing))
    setCustomText('')
    setShowForm(false)
  }

  const resetAll = () => {
    setUsedIds({ truth: new Set(), dare: new Set() })
    setItem(null)
  }

  const truthTotal = getPool('truth').length
  const dareTotal = getPool('dare').length
  const truthRemaining = Math.max(0, truthTotal - usedIds.truth.size)
  const dareRemaining = Math.max(0, dareTotal - usedIds.dare.size)

  return (
    <div className="space-y-4 px-4 pt-4">
      <p className="text-xs text-text-muted text-center">面对面专用 · 全题库随机抽取</p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => draw('truth')}
          className="card card-pressable w-full min-h-[112px] text-left overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-pink-600">❤️ 真心话</p>
              <p className="mt-1 text-xs text-text-muted leading-relaxed">从 100 道真心话与自定义题目中随机抽取</p>
              <p className="mt-3 text-[10px] text-pink-500">剩余 {truthRemaining} / {truthTotal} 题</p>
            </div>
            <span className="shrink-0 rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-sm">抽取</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => draw('dare')}
          className="card card-pressable w-full min-h-[112px] text-left overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-purple-600">⚡ 大冒险</p>
              <p className="mt-1 text-xs text-text-muted leading-relaxed">从 100 道大冒险与自定义题目中随机抽取</p>
              <p className="mt-3 text-[10px] text-purple-500">剩余 {dareRemaining} / {dareTotal} 题</p>
            </div>
            <span className="shrink-0 rounded-full bg-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-sm">抽取</span>
          </div>
        </button>
      </div>

      {item && (
        <div className={`rounded-2xl p-6 text-center card shadow-md ${
          mode === 'truth'
            ? 'bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100'
            : 'bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100'
        }`} style={{ animation: 'scaleIn 0.25s ease' }}>
          <p className="text-base text-text-primary font-medium leading-relaxed">{item.content}</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              mode === 'truth' ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600'
            }`}>
              {mode === 'truth' ? '真心话' : '大冒险'}
            </span>
            <span className="text-[10px] text-text-muted">
              已抽 {mode === 'truth' ? usedIds.truth.size : usedIds.dare.size} 题
            </span>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-text-muted">
        全题库剩余：真心话 {truthRemaining} 题 · 大冒险 {dareRemaining} 题
      </p>

      <button onClick={() => setShowForm(!showForm)}
        className="w-full py-3 text-xs text-warm-500 font-medium card card-pressable">
        {showForm ? '收起自定义' : '＋ 自定义题目'}
      </button>

      {showForm && (
        <div className="card space-y-3 p-4">
          <div className="flex gap-2">
            <button onClick={() => setCustomType('truth')}
              className={`flex-1 py-2 rounded-full text-xs font-medium transition-all ${
                customType === 'truth'
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-warm-50 text-text-muted'
              }`}>
              真心话
            </button>
            <button onClick={() => setCustomType('dare')}
              className={`flex-1 py-2 rounded-full text-xs font-medium transition-all ${
                customType === 'dare'
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-warm-50 text-text-muted'
              }`}>
              大冒险
            </button>
          </div>
          <input value={customText} onChange={e => setCustomText(e.target.value)}
            placeholder="输入你的题目..."
            className="w-full rounded-xl border border-warm-200 bg-warm-50 px-4 py-3 text-sm min-h-[44px]" />
          <button onClick={addCustom}
            className="w-full py-3 bg-warm-500 text-white rounded-full text-sm font-medium active:scale-95 transition-transform">
            添加
          </button>
        </div>
      )}

      <button
        onClick={resetAll}
        className="w-full py-3 text-xs text-text-muted card card-pressable text-center">
        重置题库
      </button>
    </div>
  )
}
