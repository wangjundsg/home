import { useState, useEffect, useCallback } from 'react'
import type { Identity } from '../../hooks/useIdentity'
import { taskQuestions } from '../../data/questions-task'
import { supabase } from '../../supabase'

interface TaskBoxProps {
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

const ratingLabels: Record<number, string> = { 1: '纯情 🔥', 2: '亲密 🔥🔥', 3: '热辣 🔥🔥🔥' }

export function TaskBox({ identity, partnerName }: TaskBoxProps) {
  const [task, setTask] = useState('')
  const [taskRating, setTaskRating] = useState(1)
  const [completed, setCompleted] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from('interaction_history')
      .select('*')
      .eq('type', 'task')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setHistory(data as HistoryItem[])
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadHistory(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadHistory])

  const drawTask = () => {
    const t = taskQuestions[Math.floor(Math.random() * taskQuestions.length)]
    setTask(t.text)
    setTaskRating(t.rating)
    setCompleted(false)
  }

  const complete = async () => {
    setCompleted(true)
    await supabase.from('interaction_history').insert({
      author: identity, date: new Date().toISOString().split('T')[0],
      type: 'task', question: task, answer: '已完成', rating: taskRating,
    })
    void loadHistory()
  }

  return (
    <div className="space-y-4">
      <button onClick={drawTask} className="w-full py-3 rounded-full bg-warm-100 text-warm-600 font-medium text-sm">
        🎯 获取今日任务（题库80题）
      </button>
      {task && (
        <div className="bg-warm-50 rounded-xl p-4 text-center">
          <p className="text-text-primary font-medium">{task}</p>
          <p className="text-xs text-text-muted mt-1">{ratingLabels[taskRating]}</p>
          <button
            onClick={complete}
            disabled={completed}
            className={`mt-3 px-6 py-2 rounded-full text-sm font-medium ${
              completed ? 'bg-green-100 text-green-600' : 'bg-warm-500 text-white'
            }`}
          >
            {completed ? '已完成 ✅' : '我完成了！'}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h4 className="font-semibold text-sm text-text-primary mb-3">📝 互动记录</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.map(h => (
              <div key={h.id} className="bg-warm-50 rounded-xl px-4 py-2.5">
                <p className="text-sm text-text-primary">{h.question}</p>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  <span className="text-xs text-text-muted">{h.answer}</span>
                  <span className="text-xs text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{h.date}</span>
                  {h.rating ? <span className="text-xs text-text-muted">· {ratingLabels[h.rating]}</span> : null}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    h.author === identity ? 'bg-warm-100 text-warm-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {h.author === identity ? '我' : (partnerName || 'TA')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
