import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { hasCache, readCache, subscribeCache, writeCache } from '../utils/localCache'

interface PeriodRecord {
  id: string
  author: string
  start_date: string
  end_date: string | null
}

interface PeriodPageProps { identity: Identity; navigate: (route: string) => void }
const PERIOD_CACHE_KEY = 'qinggan_cache_period'

// Phase calculation
function getPhase(records: PeriodRecord[]): { phase: string; emoji: string; color: string; tip: string } {
  if (records.length === 0) return { phase: '暂无数据', emoji: '📅', color: 'text-text-muted', tip: '记录第一次月经开始日期' }

  const last = records.sort((a, b) => b.start_date.localeCompare(a.start_date))[0]
  const start = new Date(last.start_date)
  const today = new Date()
  const dayDiff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  // Default 28-day cycle
  const periodLen = last.end_date
    ? Math.ceil((new Date(last.end_date).getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    : 5

  if (dayDiff >= 0 && dayDiff <= periodLen) {
    return { phase: '月经期', emoji: '🔴', color: 'text-red-500', tip: '注意保暖，多休息。情绪可能比较敏感，请多包容哦~' }
  } else if (dayDiff > periodLen && dayDiff <= 13) {
    return { phase: '卵泡期', emoji: '🟢', color: 'text-green', tip: '精力最充沛的一段时间，适合安排重要的事情' }
  } else if (dayDiff > 13 && dayDiff <= 16) {
    return { phase: '排卵期', emoji: '🟡', color: 'text-yellow-500', tip: '身体可能有微妙变化，注意休息和营养' }
  } else {
    return { phase: '黄体期', emoji: '🟠', color: 'text-orange-500', tip: '这段时期情绪可能会有起伏，汪俊把启动句准备好哦' }
  }
}

export function PeriodPage({ identity }: PeriodPageProps) {
  const [records, setRecords] = useState<PeriodRecord[]>(() => readCache(PERIOD_CACHE_KEY, [] as PeriodRecord[]))
  const [loadingRecords, setLoadingRecords] = useState(() => !hasCache(PERIOD_CACHE_KEY))
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const loadRecords = useCallback(async () => {
    const { data } = await supabase.from('period_logs').select('*').order('start_date', { ascending: false })
    if (data) {
      const next = data as PeriodRecord[]
      setRecords(next)
      writeCache(PERIOD_CACHE_KEY, next)
    }
    setLoadingRecords(false)
  }, [])

  useEffect(() => subscribeCache<PeriodRecord[]>(PERIOD_CACHE_KEY, data => {
    setRecords(data)
    setLoadingRecords(false)
  }), [])
  useEffect(() => { void Promise.resolve().then(loadRecords) }, [loadRecords])

  const saveRecord = async () => {
    if (!startDate) return
    if (editId) {
      await supabase.from('period_logs').update({ start_date: startDate, end_date: endDate || null }).eq('id', editId)
    } else {
      await supabase.from('period_logs').insert({ author: identity, start_date: startDate, end_date: endDate || null })
    }
    setStartDate(''); setEndDate(''); setEditId(null); setShowForm(false)
    loadRecords()
  }

  const openAddForm = () => { setStartDate(''); setEndDate(''); setEditId(null); setShowForm(true) }

  const phase = getPhase(records)
  const predictedDate = records.length >= 2
    ? (() => {
        const cycles = records.slice(0, 3).map((r, i, arr) => {
          if (i === arr.length - 1) return null
          return (new Date(r.start_date).getTime() - new Date(arr[i + 1].start_date).getTime()) / (1000 * 60 * 60 * 24)
        }).filter(Boolean) as number[]
        if (cycles.length === 0) return null
        const avgCycle = cycles.reduce((a, b) => a + b, 0) / cycles.length
        const lastStart = new Date(records[0].start_date)
        return new Date(lastStart.getTime() + avgCycle * 1000 * 60 * 60 * 24)
      })()
    : null

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Current phase */}
      <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
        <div className="text-3xl mb-2">{phase.emoji}</div>
        <p className={`text-lg font-bold ${phase.color}`}>{phase.phase}</p>
        <p className="text-sm text-text-secondary mt-1">{phase.tip}</p>
        {predictedDate && (
          <p className="text-xs text-text-muted mt-2">
            预计下次：{predictedDate.toISOString().split('T')[0]}
          </p>
        )}
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-semibold text-text-primary mb-3">📅 历史记录</h3>
        {records.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">{loadingRecords ? '正在同步记录...' : '还没有记录'}</p>
        ) : (
          <div className="space-y-2">
            {records.slice(0, 10).map(r => (
              <div key={r.id} className="flex items-center justify-between bg-warm-50 rounded-xl px-4 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{r.start_date} ~ {r.end_date || '进行中'}</p>
                  <p className="text-[10px] text-text-muted">记录人：{r.author}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-text-muted">
                    {r.end_date
                      ? `${Math.ceil((new Date(r.end_date).getTime() - new Date(r.start_date).getTime()) / (1000 * 60 * 60 * 24))}天`
                      : ''
                    }
                  </span>
                  <button onClick={() => { setStartDate(r.start_date); setEndDate(r.end_date || ''); setEditId(r.id); setShowForm(true) }}
                    className="min-h-[44px] rounded-full bg-warm-100/80 px-3 text-xs font-medium text-text-secondary">编辑</button>
                  <button onClick={async () => { await supabase.from('period_logs').delete().eq('id', r.id); loadRecords() }}
                    className="min-h-[44px] rounded-full bg-red-50 px-3 text-xs font-medium text-red-400">删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={openAddForm} className="w-full py-3 bg-warm-100 rounded-full text-sm text-warm-600 font-medium">
        + 记录经期
      </button>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <h3 className="font-semibold">{editId ? '编辑经期记录' : '记录经期'}</h3>
          <label className="block text-xs text-text-muted">开始日期</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-warm-200 px-3 py-2 text-sm" />
          <label className="block text-xs text-text-muted">结束日期（可选）</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-warm-200 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-warm-200 rounded-full text-sm">取消</button>
            <button onClick={saveRecord} className="flex-1 py-2.5 bg-warm-500 text-white rounded-full text-sm">{editId ? '更新' : '保存'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
