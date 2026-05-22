import { useState, useEffect, useCallback } from 'react'
import type { Identity } from '../../hooks/useIdentity'
import { truthQuestions } from '../../data/questions-truth'
import { supabase } from '../../supabase'
import { notifyPartnerActivity } from '../../utils/pushEvents'

interface TruthBoxProps {
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

export function TruthBox({ identity, partnerName }: TruthBoxProps) {
  const [question, setQuestion] = useState('点击"抽一题"开始吧~')
  const [questionRating, setQuestionRating] = useState(1)
  const [answer, setAnswer] = useState('')
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from('interaction_history')
      .select('*')
      .eq('type', 'truth')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setHistory(data as HistoryItem[])
  }, [])

  useEffect(() => { void Promise.resolve().then(loadHistory) }, [loadHistory])

  const draw = () => {
    const q = truthQuestions[Math.floor(Math.random() * truthQuestions.length)]
    setQuestion(q.text)
    setQuestionRating(q.rating)
    setAnswer('')
    setSaved(false)
  }

  const save = async () => {
    if (!answer.trim()) return
    const { error } = await supabase.from('interaction_history').insert({
      author: identity, date: new Date().toISOString().split('T')[0],
      type: 'truth', question, answer, rating: questionRating,
    })
    if (!error) void notifyPartnerActivity(identity, 'interaction')
    setSaved(true)
    void loadHistory()
  }

  return (
    <div className="pixel-page flex h-full min-h-0 flex-col gap-3 overflow-hidden px-4 pt-4 pb-3">
      <div className="pixel-card shrink-0 min-h-[82px] p-4 text-center flex flex-col justify-center">
        <p className="text-sm font-semibold leading-relaxed text-text-secondary">{question}</p>
      </div>
      <button onClick={draw} className="shrink-0 w-full min-h-[48px] rounded-2xl bg-warm-100 text-warm-600 text-sm font-black shadow-[0_8px_18px_rgba(61,44,46,0.045)]">
        换一张真心话卡（题库200题）
      </button>
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="写下你的回答..."
        className="shrink-0 w-full h-24 resize-none rounded-2xl border border-warm-100/90 bg-white/80 p-3 text-sm focus:border-warm-400 focus:outline-none"
      />
      <button
        onClick={save}
        disabled={!answer.trim() || saved}
        className={`shrink-0 w-full min-h-[48px] rounded-2xl text-sm font-black shadow-[0_10px_18px_rgba(184,74,36,0.16)] ${saved ? 'bg-green-100 text-green-600' : 'bg-warm-500 text-white'}`}
      >
        {saved ? '已保存 ✅' : '保存回答'}
      </button>

      <div className="pixel-card flex min-h-0 flex-1 flex-col p-4">
        <h4 className="mb-3 shrink-0 text-sm font-black text-text-primary">互动记录小卡</h4>
        {history.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl bg-white/55 px-4 text-center">
            <p className="text-sm text-text-muted">还没有记录，抽一题后写下你的小答案吧。</p>
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
