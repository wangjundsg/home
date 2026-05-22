import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { hasCache, readCache, subscribeCache, writeCache } from '../utils/localCache'

interface IntimacyRecord {
  id: string
  author: string
  date: string
  rating: number
  note: string
  duration: number | null
}

interface IntimacyPageProps { identity: Identity; navigate: (route: string) => void }
const INTIMACY_CACHE_KEY = 'qinggan_cache_intimacy_logs'

export function IntimacyPage({ identity }: IntimacyPageProps) {
  const [records, setRecords] = useState<IntimacyRecord[]>(() => readCache(INTIMACY_CACHE_KEY, [] as IntimacyRecord[]))
  const [loadingRecords, setLoadingRecords] = useState(() => !hasCache(INTIMACY_CACHE_KEY))
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [rating, setRating] = useState(3)
  const [note, setNote] = useState('')
  const [duration, setDuration] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const loadRecords = useCallback(async () => {
    const { data } = await supabase.from('intimacy_logs').select('*').order('date', { ascending: false })
    if (data) {
      const next = data as IntimacyRecord[]
      setRecords(next)
      writeCache(INTIMACY_CACHE_KEY, next)
    }
    setLoadingRecords(false)
  }, [])

  useEffect(() => subscribeCache<IntimacyRecord[]>(INTIMACY_CACHE_KEY, data => {
    setRecords(data)
    setLoadingRecords(false)
  }), [])
  useEffect(() => { void Promise.resolve().then(loadRecords) }, [loadRecords])

  const saveRecord = async () => {
    const payload = { date, rating, note: note || '', duration: duration ? parseInt(duration) : null }
    if (editId) {
      await supabase.from('intimacy_logs').update(payload).eq('id', editId)
    } else {
      await supabase.from('intimacy_logs').insert({ ...payload, author: identity })
    }
    loadRecords(); setShowForm(false); setEditId(null)
  }

  const openAddForm = () => { setDate(new Date().toISOString().split('T')[0]); setRating(3); setNote(''); setDuration(''); setEditId(null); setShowForm(true) }

  const startEdit = (r: IntimacyRecord) => {
    setDate(r.date); setRating(r.rating); setNote(r.note || ''); setDuration(r.duration ? String(r.duration) : '')
    setEditId(r.id); setShowForm(true)
  }

  // Stats
  const thisMonth = records.filter(r => {
    const d = new Date(r.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const monthlyCount = thisMonth.length
  const avgRating = monthlyCount > 0
    ? (thisMonth.reduce((sum, r) => sum + r.rating, 0) / monthlyCount).toFixed(1)
    : '-'

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <p className="text-3xl font-black text-warm-500">{monthlyCount}</p>
          <p className="text-xs text-text-muted">本月次数</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <p className="text-3xl font-black text-warm-500">{avgRating}</p>
          <p className="text-xs text-text-muted">本月平均评分</p>
        </div>
      </div>

      {/* Records list */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-semibold text-text-primary mb-3">💕 记录列表</h3>
        {records.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6">{loadingRecords ? '正在同步记录...' : '还没有记录'}</p>
        ) : (
          <div className="space-y-2">
            {records.slice(0, 20).map(r => (
              <div key={r.id} className="bg-warm-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{r.date}</span>
                    <span className="text-yellow-500 text-sm">{'⭐'.repeat(r.rating)}</span>
                  </div>
                  {r.note && <p className="text-xs text-text-muted mt-0.5">{r.note}</p>}
                  <p className="text-[10px] text-text-muted">{r.author}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.duration && <span className="text-xs text-text-muted">{r.duration}分钟</span>}
                  <button onClick={() => startEdit(r)} className="min-h-[44px] rounded-full bg-warm-100/80 px-3 text-xs font-medium text-text-secondary">编辑</button>
                  <button onClick={async () => { await supabase.from('intimacy_logs').delete().eq('id', r.id); loadRecords() }}
                    className="min-h-[44px] rounded-full bg-red-50 px-3 text-xs font-medium text-red-400">删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={openAddForm} className="w-full py-3 bg-warm-100 rounded-full text-sm text-warm-600 font-medium">
        + 添加记录
      </button>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <h3 className="font-semibold">{editId ? '编辑记录' : '添加记录'}</h3>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full rounded-xl border border-warm-200 px-3 py-2 text-sm" />
          <div>
            <label className="text-xs text-text-muted">评分</label>
            <div className="flex gap-1 mt-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)}
                  className={`text-2xl transition-all ${s <= rating ? 'scale-110' : 'opacity-30'}`}>⭐</button>
              ))}
            </div>
          </div>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="一句话备注（可选）"
            className="w-full rounded-xl border border-warm-200 px-3 py-2 text-sm" />
          <input value={duration} onChange={e => setDuration(e.target.value)} type="number" placeholder="时长（分钟，可选）"
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
