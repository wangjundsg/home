import { useState, useEffect, useCallback } from 'react'
import type { Identity } from '../../hooks/useIdentity'
import { matchQuestions } from '../../data/questions-match'
import { supabase } from '../../supabase'
import { notifyPartnerActivity } from '../../utils/pushEvents'

interface MatchBoxProps {
  identity: Identity
  partnerName: string
}

interface HistoryItem {
  id: string
  type: string
  question: string
  answer: string
  date: string
  rating: number
  author: string
}

export function MatchBox({ identity, partnerName }: MatchBoxProps) {
  const [question, setQuestion] = useState('点击开始测试默契度~')
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [questionRating, setQuestionRating] = useState(1)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from('interaction_history')
      .select('*')
      .eq('type', 'match')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setHistory(data as HistoryItem[])
  }, [])

  useEffect(() => { void Promise.resolve().then(loadHistory) }, [loadHistory])

  const draw = () => {
    const q = matchQuestions[Math.floor(Math.random() * matchQuestions.length)]
    setQuestion(q.text)
    setOptions(q.options)
    setQuestionRating(q.rating)
    setSelected(null)
  }

  const save = async (idx: number) => {
    setSelected(idx)
    const { error } = await supabase.from('interaction_history').insert({
      author: identity, date: new Date().toISOString().split('T')[0],
      type: 'match', question, answer: options[idx], rating: questionRating,
    })
    if (!error) void notifyPartnerActivity(identity, 'interaction')
    void loadHistory()
  }

  return (
    <div className="pixel-page flex h-full min-h-0 flex-col gap-3 overflow-hidden px-4 pt-4 pb-3">
      <div className="pixel-card shrink-0 min-h-[82px] p-4 text-center flex flex-col justify-center">
        <p className="text-sm font-semibold leading-relaxed text-text-secondary">{question}</p>
      </div>
      <button onClick={draw} className="shrink-0 w-full min-h-[48px] rounded-2xl bg-warm-100 text-warm-600 text-sm font-black shadow-[0_8px_18px_rgba(61,44,46,0.045)]">
        换一张默契题卡（题库80题）
      </button>
      {options.length > 0 && (
        <div className="shrink-0 space-y-2">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => save(i)}
              className={`w-full min-h-[46px] rounded-2xl border px-4 py-2 text-left text-sm font-semibold transition-all ${
                selected === i ? 'border-warm-500 bg-warm-50 shadow-[0_8px_18px_rgba(61,44,46,0.045)]' : 'border-warm-100/90 bg-white/80'
              }`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
      )}
      {selected !== null && (
        <p className="shrink-0 text-center text-sm text-text-secondary">你的答案已保存，让TA也来选！</p>
      )}

      <div className="pixel-card flex min-h-0 flex-1 flex-col p-4">
        <h4 className="mb-3 shrink-0 text-sm font-black text-text-primary">互动记录小卡</h4>
        {history.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl bg-white/55 px-4 text-center">
            <p className="text-sm text-text-muted">还没有记录，换一题后留下你的小选择吧。</p>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-1">
            {history.map(h => (
              <div key={h.id} className="rounded-2xl border border-warm-100 bg-white/80 px-4 py-2.5 shadow-sm">
                <p className="text-sm text-text-primary leading-relaxed">{h.question}</p>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  <span className="text-xs text-text-muted">{h.answer}</span>
                  <span className="text-xs text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{h.date}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    h.author === identity ? 'bg-warm-100 text-warm-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {h.author === identity ? '我' : (partnerName || 'TA')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
