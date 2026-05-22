import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { useRealtime } from '../hooks/useRealtime'
import { Toast } from '../components/ui'
import { hasCache, readCache, subscribeCache, writeCache } from '../utils/localCache'

interface ConflictReview {
  id: string
  author: string
  record_date: string
  trigger_content: string
  need_content: string
  loved_content: string
  created_at: string
}

interface GrowthPageProps { identity: Identity; partnerName: string; navigate: (route: string) => void }
const REVIEWS_CACHE_KEY = 'qinggan_cache_conflict_reviews'

export function GrowthPage({ identity, partnerName }: GrowthPageProps) {
  const [reviews, setReviews] = useState<ConflictReview[]>(() => readCache(REVIEWS_CACHE_KEY, [] as ConflictReview[]))
  const [loadingReviews, setLoadingReviews] = useState(() => !hasCache(REVIEWS_CACHE_KEY))
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0])
  const [trigger, setTrigger] = useState('')
  const [need, setNeed] = useState('')
  const [loved, setLoved] = useState('')
  const [toast, setToast] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { onChange } = useRealtime<Record<string, unknown>>('conflict_reviews', { event: '*' })

  const loadReviews = useCallback(async () => {
    const { data } = await supabase.from('conflict_reviews').select('*').order('record_date', { ascending: false })
    if (data) {
      const next = data as ConflictReview[]
      setReviews(next)
      writeCache(REVIEWS_CACHE_KEY, next)
    }
    setLoadingReviews(false)
  }, [])

  useEffect(() => { return onChange(() => loadReviews()) }, [onChange, loadReviews])
  useEffect(() => subscribeCache<ConflictReview[]>(REVIEWS_CACHE_KEY, data => {
    setReviews(data)
    setLoadingReviews(false)
  }), [])
  useEffect(() => { void Promise.resolve().then(loadReviews) }, [loadReviews])

  const saveReview = async () => {
    if (!trigger.trim() && !need.trim() && !loved.trim()) {
      setToast('请至少填写一项内容')
      return
    }
    await supabase.from('conflict_reviews').insert({
      author: identity,
      record_date: recordDate,
      trigger_content: trigger.trim(),
      need_content: need.trim(),
      loved_content: loved.trim(),
    })
    setTrigger('')
    setNeed('')
    setLoved('')
    setRecordDate(new Date().toISOString().split('T')[0])
    setShowForm(false)
    setToast('复盘记录已保存')
    loadReviews()
  }

  const deleteReview = async (id: string) => {
    await supabase.from('conflict_reviews').delete().eq('id', id)
    loadReviews()
  }

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-')
    return `${y}年${parseInt(m)}月${parseInt(day)}日`
  }

  return (
    <div className="pixel-page min-h-full space-y-4 px-4 pt-4 pb-8">
      <section className="pixel-hero px-4 py-5">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white/75">矛盾复盘小树屋</p>
            <h2 className="mt-1 text-xl font-black tracking-tight">一起慢慢长大</h2>
            <p className="mt-1 text-xs text-white/75">每个矛盾都是更懂{partnerName || 'TA'}的一颗小种子。</p>
          </div>
          <div className="pixel-photo-card shrink-0 scale-90" />
        </div>
      </section>

      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="min-h-[52px] w-full rounded-2xl bg-warm-500 text-base font-black text-white shadow-[0_10px_18px_rgba(184,74,36,0.16)] transition-all active:scale-95">
          记录新的成长复盘
        </button>
      )}

      {showForm && (
        <div className="pixel-card space-y-3 p-4">
          <h3 className="text-sm font-black text-text-primary">新成长手账</h3>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-muted">发生日期</label>
            <input type="date" value={recordDate} onChange={e => setRecordDate(e.target.value)}
              className="min-h-[44px] w-full rounded-2xl border border-warm-100/90 bg-white/80 px-3 text-sm" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-muted">情绪触发点 · 起因</label>
            <textarea value={trigger} onChange={e => setTrigger(e.target.value)}
              placeholder="这件事的起因是什么？谁说了/做了什么？"
              className="h-20 w-full resize-none rounded-2xl border border-warm-100/90 bg-white/80 px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-muted">各自的需求 · 解决</label>
            <textarea value={need} onChange={e => setNeed(e.target.value)}
              placeholder="你们各自需要什么来化解这个矛盾？"
              className="h-20 w-full resize-none rounded-2xl border border-warm-100/90 bg-white/80 px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-muted">被爱瞬间 · 行动</label>
            <textarea value={loved} onChange={e => setLoved(e.target.value)}
              placeholder="矛盾后TA做了什么让你感到被爱？或你做了什么？"
              className="h-20 w-full resize-none rounded-2xl border border-warm-100/90 bg-white/80 px-3 py-2.5 text-sm" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)}
              className="min-h-[44px] flex-1 rounded-full border border-warm-200 bg-white/70 text-sm font-medium text-text-secondary">
              取消
            </button>
            <button onClick={saveReview}
              className="min-h-[44px] flex-1 rounded-full bg-warm-500 text-sm font-semibold text-white">
              保存记录
            </button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="pixel-card py-8 text-center">
          <p className="mb-2 text-4xl">🌱</p>
          <p className="text-sm text-text-muted">{loadingReviews ? '正在同步复盘记录...' : '还没有矛盾复盘记录'}</p>
          <p className="mt-1 text-xs text-text-muted">{loadingReviews ? '马上就好' : '每次矛盾都是了解彼此的机会'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-black text-text-primary">成长手账历史</h3>
          {reviews.map(r => (
            <div key={r.id} className="pixel-card space-y-2 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-warm-50 px-2 py-0.5 text-xs font-semibold text-warm-500">
                  {formatDate(r.record_date)}
                </span>
                <button onClick={() => deleteReview(r.id)} className="min-h-[44px] rounded-full border border-warm-200 bg-white/70 px-4 text-xs font-semibold text-text-muted active:bg-warm-100" aria-label="删除复盘记录">删除</button>
              </div>
              {r.trigger_content && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2">
                  <p className="mb-0.5 text-[10px] font-bold text-amber-600">情绪触发点</p>
                  <p className="text-sm leading-relaxed text-text-secondary">{r.trigger_content}</p>
                </div>
              )}
              {r.need_content && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2">
                  <p className="mb-0.5 text-[10px] font-bold text-blue-600">各自的需求</p>
                  <p className="text-sm leading-relaxed text-text-secondary">{r.need_content}</p>
                </div>
              )}
              {r.loved_content && (
                <div className="rounded-2xl border border-pink-100 bg-pink-50 px-3 py-2">
                  <p className="mb-0.5 text-[10px] font-bold text-pink-600">被爱瞬间</p>
                  <p className="text-sm leading-relaxed text-text-secondary">{r.loved_content}</p>
                </div>
              )}
              <p className="text-right text-[10px] text-text-muted">{r.author}</p>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}
    </div>
  )
}
