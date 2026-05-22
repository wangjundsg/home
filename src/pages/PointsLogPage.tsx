import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'

interface ScoreLogEntry {
  id: string
  author: string
  date: string
  source: string
  amount: number
  balance: number
  detail?: string
}

interface PointsLogPageProps { identity: Identity; navigate: (route: string) => void }

export function PointsLogPage({ identity }: PointsLogPageProps) {
  const [logs, setLogs] = useState<ScoreLogEntry[]>([])
  const [filter, setFilter] = useState<'all' | 'mine'>('all')
  const [cumulativeScore, setCumulativeScore] = useState(0)

  useEffect(() => {
    loadLogs()
    loadCumulativeScore()
  }, [])

  const loadLogs = async () => {
    const query = supabase.from('score_logs').select('*').order('created_at', { ascending: false }).limit(100)
    const { data } = await query
    if (data) setLogs(data as ScoreLogEntry[])
  }

  const loadCumulativeScore = async () => {
    const { data } = await supabase.from('score_logs').select('amount').eq('author', identity)
    if (data) {
      const total = (data as { amount: number }[]).reduce((sum, r) => sum + r.amount, 0)
      setCumulativeScore(total)
    }
  }

  const filteredLogs = filter === 'mine' ? logs.filter(l => l.author === identity) : logs

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Cumulative score card */}
      <div className="bg-gradient-to-br from-warm-400 to-warm-500 rounded-2xl p-4 text-white text-center shadow-sm">
        <p className="text-xs text-white/70">累计积分</p>
        <p className="text-3xl font-black">{cumulativeScore}</p>
        <p className="text-xs text-white/70 mt-1">继续努力，解锁更多奖励！</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {([
          { key: 'all' as const, label: '全部' },
          { key: 'mine' as const, label: '仅我的' },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm ${filter === f.key ? 'bg-warm-500 text-white' : 'bg-white text-text-secondary'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-text-muted text-sm">还没有积分记录</p>
          <p className="text-text-muted text-xs mt-1">完成打卡来获得第一笔积分吧</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-warm-50">
            {filteredLogs.map(log => (
              <div key={log.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">{log.source}</p>
                  <p className="text-xs text-text-muted">{log.date} · {log.author}</p>
                  {log.detail && <p className="text-xs text-text-muted mt-0.5">{log.detail}</p>}
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${log.amount >= 0 ? 'text-green' : 'text-redline'}`}>
                    {log.amount >= 0 ? '+' : ''}{log.amount}
                  </p>
                  <p className="text-xs text-text-muted">余额 {log.balance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
