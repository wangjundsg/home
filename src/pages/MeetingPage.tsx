import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { useRealtime } from '../hooks/useRealtime'

interface Wish { id: string; author: string; text: string; fulfilled: boolean; fulfilled_at?: string | null }

interface MeetingPageProps { identity: Identity; navigate: (route: string) => void }

const WISH_COMPLETED_TIMES_KEY = 'qinggan_wish_completed_times'

const loadWishCompletedTimes = () => {
  try {
    return JSON.parse(localStorage.getItem(WISH_COMPLETED_TIMES_KEY) || '{}') as Record<string, string>
  } catch {
    return {}
  }
}

const formatCompletedTime = (value?: string | null) => {
  if (!value) return '已完成'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '已完成'
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `完成于 ${month}/${day} ${hour}:${minute}`
}

const parseLocalDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function MeetingPage({ identity }: MeetingPageProps) {
  const [nextDate, setNextDate] = useState('')
  const [daysUntil, setDaysUntil] = useState<number | null>(null)
  const [wishlist, setWishlist] = useState<Wish[]>([])
  const [wishCompletedTimes, setWishCompletedTimes] = useState<Record<string, string>>(loadWishCompletedTimes)
  const [newWish, setNewWish] = useState('')
  const [showWishInput, setShowWishInput] = useState(false)
  const [editingWishId, setEditingWishId] = useState<string | null>(null)
  const [editingWishText, setEditingWishText] = useState('')
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { onChange } = useRealtime<Record<string, unknown>>('wishes', { event: '*' })

  const persistWishCompletedTimes = (next: Record<string, string>) => {
    setWishCompletedTimes(next)
    localStorage.setItem(WISH_COMPLETED_TIMES_KEY, JSON.stringify(next))
  }

  const updateDaysUntil = useCallback((date: string) => {
    const target = parseLocalDate(date)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    setDaysUntil(Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  }, [])

  const loadWishes = useCallback(async () => {
    const { data } = await supabase.from('wishes').select('*').order('created_at', { ascending: true })
    if (data) setWishlist(data as Wish[])
  }, [])

  const loadDate = useCallback(async () => {
    const { data } = await supabase.from('meeting_schedule')
      .select('next_date').order('created_at', { ascending: false }).limit(1)
    if (data && data.length > 0) {
      const date = (data[0] as Record<string, string>).next_date
      setNextDate(date)
      localStorage.setItem('qinggan_meeting_date', date)
      updateDaysUntil(date)
    } else {
      const stored = localStorage.getItem('qinggan_meeting_date')
      if (stored) {
        setNextDate(stored)
        updateDaysUntil(stored)
      }
    }
  }, [updateDaysUntil])

  useEffect(() => {
    return onChange(() => loadWishes())
  }, [onChange, loadWishes])

  useEffect(() => {
    void Promise.resolve().then(async () => {
      await loadDate()
      await loadWishes()
    })
  }, [loadDate, loadWishes])

  const saveDate = async (date: string) => {
    setNextDate(date)
    localStorage.setItem('qinggan_meeting_date', date)
    updateDaysUntil(date)
    await supabase.from('meeting_schedule').insert({ author: identity, next_date: date })
  }

  const addWish = async () => {
    if (!showWishInput) {
      setShowWishInput(true)
      return
    }
    if (!newWish.trim()) {
      setShowWishInput(false)
      return
    }
    await supabase.from('wishes').insert({ author: identity, text: newWish.trim(), fulfilled: false })
    setNewWish('')
    setShowWishInput(false)
    loadWishes()
  }

  const toggleWish = async (w: Wish) => {
    const fulfilled = !w.fulfilled
    const fulfilledAt = fulfilled ? new Date().toISOString() : null
    const nextTimes = { ...wishCompletedTimes }

    if (fulfilled && fulfilledAt) nextTimes[w.id] = fulfilledAt
    else delete nextTimes[w.id]
    persistWishCompletedTimes(nextTimes)

    const { error } = await supabase
      .from('wishes')
      .update({ fulfilled, fulfilled_at: fulfilledAt })
      .eq('id', w.id)

    if (error) {
      await supabase.from('wishes').update({ fulfilled }).eq('id', w.id)
    }

    loadWishes()
  }

  const startEditWish = (w: Wish) => {
    setEditingWishId(w.id)
    setEditingWishText(w.text)
  }

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const beginLongPress = (w: Wish) => {
    clearLongPress()
    longPressTimer.current = setTimeout(() => startEditWish(w), 550)
  }

  const saveEditWish = async () => {
    if (!editingWishId) return
    const text = editingWishText.trim()
    if (!text) return
    await supabase.from('wishes').update({ text }).eq('id', editingWishId)
    setEditingWishId(null)
    setEditingWishText('')
    loadWishes()
  }

  const cancelEditWish = () => {
    setEditingWishId(null)
    setEditingWishText('')
  }

  return (
    <div className="pixel-page min-h-full space-y-4 px-4 pt-4 pb-6">
      <section className="pixel-hero px-4 py-5 text-center">
        <div className="relative z-10">
        {nextDate ? (
          <>
            <p className="text-sm font-semibold text-white/80">距离下次见面还有</p>
            <p className="text-5xl font-black text-white my-2 drop-shadow-sm">{daysUntil !== null ? (daysUntil > 0 ? daysUntil : daysUntil === 0 ? '🎉' : '-') : '...'}</p>
            <p className="text-sm font-semibold text-white/85">{daysUntil !== null ? (daysUntil > 0 ? '天' : daysUntil === 0 ? '就是今天！' : '该定下次啦') : ''}</p>
          </>
        ) : (
          <p className="font-semibold text-white/85">还没有设定见面日期</p>
        )}
        <input type="date" value={nextDate} onChange={e => saveDate(e.target.value)}
          className="mt-4 min-h-[44px] rounded-2xl border border-white/70 bg-white/85 px-4 py-2 text-sm text-text-primary" />
        </div>
      </section>

      <div className="pixel-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-black text-text-primary">见面心愿车票</h3>
          <button
            onClick={addWish}
            className="min-h-[44px] shrink-0 rounded-2xl bg-warm-500 px-4 text-sm font-black text-white shadow-[0_10px_18px_rgba(184,74,36,0.16)] active:scale-95"
          >
            {showWishInput ? '保存心愿' : '添加心愿'}
          </button>
        </div>

        {showWishInput && (
          <input
            value={newWish}
            onChange={e => setNewWish(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addWish()}
            placeholder="见面时想一起做的事..."
            className="mb-3 min-h-[44px] w-full rounded-2xl border border-warm-100/90 bg-warm-50 px-3 py-2 text-sm"
            autoFocus
          />
        )}

        <div className="space-y-2">
          {wishlist.map(w => {
            const completedAt = w.fulfilled_at || wishCompletedTimes[w.id]
            return (
              <div key={w.id} className="flex items-center gap-3 rounded-2xl border border-warm-100 bg-warm-50/80 p-3 shadow-sm">
                <button onClick={() => toggleWish(w)}
                  className={`min-w-[44px] min-h-[44px] rounded-full border-2 flex items-center justify-center shrink-0 text-sm ${w.fulfilled ? 'bg-green border-green text-white' : 'border-warm-300 text-transparent'}`}
                  aria-label={w.fulfilled ? '取消完成心愿' : '完成心愿'}>
                  ✓
                </button>
                {editingWishId === w.id ? (
                  <div className="min-w-0 flex-1 space-y-2">
                    <input
                      value={editingWishText}
                      onChange={e => setEditingWishText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEditWish()}
                      className="w-full min-h-[44px] rounded-xl border border-warm-200 bg-white px-3 py-2 text-sm"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={cancelEditWish} className="min-h-[44px] rounded-full border border-warm-200 px-4 text-xs text-text-muted">取消</button>
                      <button onClick={saveEditWish} className="min-h-[44px] rounded-full bg-warm-500 px-4 text-xs font-medium text-white">保存</button>
                    </div>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1">
                    <span
                      className={`block text-sm leading-relaxed ${w.fulfilled ? 'line-through text-text-muted' : 'text-text-secondary'}`}
                      onTouchStart={() => beginLongPress(w)}
                      onTouchEnd={clearLongPress}
                      onTouchMove={clearLongPress}
                      onMouseDown={() => beginLongPress(w)}
                      onMouseUp={clearLongPress}
                      onMouseLeave={clearLongPress}
                      onContextMenu={e => {
                        e.preventDefault()
                        clearLongPress()
                        startEditWish(w)
                      }}
                      title="长按编辑"
                    >
                      {w.text}
                    </span>
                    {w.fulfilled && (
                      <p className="mt-1 text-[11px] font-medium text-green-600">{formatCompletedTime(completedAt)}</p>
                    )}
                  </div>
                )}
                <span className="shrink-0 text-[10px] text-text-muted">{w.author}</span>
              </div>
            )
          })}
          {wishlist.length === 0 && <p className="text-sm text-text-muted text-center py-4">还没有心愿，添加一个吧</p>}
        </div>
      </div>
    </div>
  )
}
