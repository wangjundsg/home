import { useCallback, useEffect, useState } from 'react'
import { Cake, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { hasCache, readCache, subscribeCache, writeCache } from '../utils/localCache'

interface AnniversaryRecord {
  id: string
  name: string
  date: string
  type: string
  remind_before: number
  author: string
}

interface AnniversaryPageProps { identity: Identity; navigate: (route: string) => void }
const ANNIVERSARIES_CACHE_KEY = 'qinggan_cache_anni'

export function AnniversaryPage({ identity }: AnniversaryPageProps) {
  const [anniversaries, setAnniversaries] = useState<AnniversaryRecord[]>(() => readCache(ANNIVERSARIES_CACHE_KEY, [] as AnniversaryRecord[]))
  const [loadingAnniversaries, setLoadingAnniversaries] = useState(() => !hasCache(ANNIVERSARIES_CACHE_KEY))
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState('纪念日')
  const [remindBefore, setRemindBefore] = useState(3)

  const loadAnniversaries = useCallback(async () => {
    const { data } = await supabase.from('anniversaries').select('*').order('date', { ascending: true })
    if (data) {
      const next = data as AnniversaryRecord[]
      setAnniversaries(next)
      writeCache(ANNIVERSARIES_CACHE_KEY, next)
    }
    setLoadingAnniversaries(false)
  }, [])

  useEffect(() => subscribeCache<AnniversaryRecord[]>(ANNIVERSARIES_CACHE_KEY, data => {
    setAnniversaries(data)
    setLoadingAnniversaries(false)
  }), [])
  useEffect(() => { void Promise.resolve().then(loadAnniversaries) }, [loadAnniversaries])

  const addAnniversary = async () => {
    if (!name || !date) return
    await supabase.from('anniversaries').insert({
      author: identity,
      name,
      date,
      type,
      remind_before: remindBefore
    })
    setName(''); setDate(''); setType('纪念日'); setRemindBefore(3); setShowForm(false)
    loadAnniversaries()
  }

  const removeAnniversary = async (id: string) => {
    await supabase.from('anniversaries').delete().eq('id', id)
    loadAnniversaries()
  }

  const daysUntil = (d: string) => {
    const target = new Date(d)
    const now = new Date()
    target.setFullYear(now.getFullYear())
    if (target < now) target.setFullYear(now.getFullYear() + 1)
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="px-4 pt-4 space-y-4">
      {anniversaries.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mx-auto mb-4">
            <Cake size={28} className="text-pink-500" />
          </div>
          <p className="text-text-muted text-sm">{loadingAnniversaries ? '正在同步纪念日...' : '还没有纪念日'}</p>
          <p className="text-text-muted text-xs mt-1">{loadingAnniversaries ? '马上就好' : '记录你们的重要日子吧'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {anniversaries.map(a => {
            const d = daysUntil(a.date)
            const isClose = d <= 7
            return (
              <div key={a.id} className={`card flex items-center justify-between p-4 ${isClose ? 'border border-pink-100 bg-gradient-to-r from-pink-50/50 to-white' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isClose ? 'bg-pink-100' : 'bg-warm-50'}`}>
                    <Cake size={18} className={isClose ? 'text-pink-500' : 'text-warm-400'} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{a.name}</p>
                    <p className="text-xs text-text-muted">{a.date} · {a.type}</p>
                    <p className={`text-[10px] mt-0.5 font-medium ${isClose ? 'text-pink-500' : 'text-text-muted'}`}>
                      还有 {d} 天 {isClose ? '快到了！' : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => removeAnniversary(a.id)} className="text-text-muted p-2 active:text-redline">
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      <button onClick={() => setShowForm(true)} className="w-full py-3 card card-pressable text-sm text-warm-600 font-medium flex items-center justify-center gap-1.5">
        <Plus size={16} />
        添加纪念日
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold text-text-primary text-sm">添加纪念日</h3>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="名称（如：在一起纪念日）" className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm bg-warm-50/50" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm bg-warm-50/50" />
          <select value={type} onChange={e => setType(e.target.value)} className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm bg-warm-50/50">
            <option>纪念日</option><option>生日</option><option>自定义</option>
          </select>
          <select value={remindBefore} onChange={e => setRemindBefore(Number(e.target.value))} className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm bg-warm-50/50">
            <option value={1}>提前 1 天提醒</option><option value={3}>提前 3 天提醒</option><option value={7}>提前 7 天提醒</option>
          </select>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-warm-200 rounded-full text-sm text-text-secondary">取消</button>
            <button onClick={addAnniversary} className="flex-1 py-2.5 bg-warm-500 text-white rounded-full text-sm font-medium">保存</button>
          </div>
        </div>
      )}
    </div>
  )
}
