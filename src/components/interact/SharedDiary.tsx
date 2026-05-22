import { useState, useEffect, useCallback } from 'react'
import type { Identity } from '../../hooks/useIdentity'
import { useRealtime } from '../../hooks/useRealtime'
import { supabase } from '../../supabase'
import { notifyPartnerActivity } from '../../utils/pushEvents'

interface SharedDiaryProps {
  identity: Identity
  partnerName: string
}

interface DiaryEntry {
  id: string
  author: string
  date: string
  content: string
  mood: string
  created_at: string
}

const MOODS = ['😊', '🥰', '😢', '😡', '😴', '😤', '🎉', '😰', '🤗', '💕']

export function SharedDiary({ identity, partnerName }: SharedDiaryProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('😊')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editMood, setEditMood] = useState('😊')
  const { onChange } = useRealtime<Record<string, unknown>>('shared_diaries', { event: 'INSERT' })

  const loadEntries = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('shared_diaries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
    if (data) setEntries(data as DiaryEntry[])
    setLoading(false)
  }, [])

  useEffect(() => { void Promise.resolve().then(loadEntries) }, [loadEntries])

  useEffect(() => {
    const unsub = onChange((payload) => {
      if (payload.new) {
        const entry = payload.new as unknown as DiaryEntry
        setEntries(prev => [entry, ...prev])
      }
    })
    return unsub
  }, [onChange])

  const saveEntry = async () => {
    if (!content.trim()) return
    setSaving(true)
    const { error } = await supabase.from('shared_diaries').insert({
      author: identity,
      date: new Date().toISOString().split('T')[0],
      content: content.trim(),
      mood,
    })
    if (!error) void notifyPartnerActivity(identity, 'diary')
    setContent('')
    setMood('😊')
    setSaving(false)
    void loadEntries()
  }

  const startEdit = (entry: DiaryEntry) => {
    setEditingId(entry.id)
    setEditContent(entry.content)
    setEditMood(entry.mood)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
    setEditMood('😊')
  }

  const saveEdit = async () => {
    if (!editContent.trim() || !editingId) return
    await supabase.from('shared_diaries').update({
      content: editContent.trim(),
      mood: editMood,
    }).eq('id', editingId)
    setEntries(prev => prev.map(e =>
      e.id === editingId ? { ...e, content: editContent.trim(), mood: editMood } : e
    ))
    cancelEdit()
  }

  const deleteEntry = async (id: string) => {
    if (!confirm('确定要删除这篇日记吗？')) return
    await supabase.from('shared_diaries').delete().eq('id', id)
    setEntries(prev => prev.filter(e => e.id !== id))
    if (editingId === id) cancelEdit()
  }

  return (
    <div className="pixel-page flex h-full min-h-0 flex-col gap-2 overflow-hidden px-3 pt-3 pb-2">
      <section className="pixel-hero shrink-0 px-6 py-3">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/75">共同日记本</p>
            <h2 className="mt-1 text-xl font-black tracking-tight">今天也留一页</h2>
            <p className="mt-1 text-xs text-white/75">把小心情贴进只属于你们的手账里。</p>
          </div>
          <div className="pixel-photo-card photo-card-4 shrink-0 scale-90" />
        </div>
      </section>

      <div className="pixel-card shrink-0 space-y-2 p-3">
        <p className="text-sm font-black text-text-primary">选择今天的心情贴纸</p>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map(m => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`min-h-[44px] rounded-2xl py-2 text-2xl transition-all ${
                mood === m ? 'scale-105 bg-white/90 shadow-[0_8px_18px_rgba(61,44,46,0.055)] ring-1 ring-warm-200' : 'bg-warm-50/75 hover:bg-warm-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="写下今天的心情..."
          className="h-16 w-full resize-none rounded-2xl border border-warm-100/90 bg-white/80 p-3 text-sm focus:border-warm-300 focus:outline-none"
        />
        <button
          onClick={saveEntry}
          disabled={!content.trim() || saving}
          className="min-h-[46px] w-full rounded-2xl bg-warm-500 py-2.5 text-sm font-black text-white shadow-[0_10px_18px_rgba(184,74,36,0.16)] disabled:opacity-60"
        >
          {saving ? '保存中...' : '记录今天 📔'}
        </button>
      </div>

      {/* Entries list */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {loading ? (
          <div className="pixel-card flex h-full items-center justify-center p-4 text-center text-sm text-text-muted">加载中...</div>
        ) : entries.length === 0 ? (
          <div className="pixel-card flex h-full flex-col items-center justify-center py-8 text-center">
            <p className="mb-2 text-4xl">📔</p>
            <p className="text-sm text-text-muted">还没有日记，写下你们的第一篇吧</p>
          </div>
        ) : (
          <div className="h-full space-y-2 overflow-y-auto pr-1">
            {entries.map(entry => (
              <div
                key={entry.id}
                className={`pixel-card p-3 ${
                  entry.author === identity ? 'bg-warm-50 border-warm-100' : 'bg-blue-50/50 border-blue-100'
                }`}
              >
                {editingId === entry.id ? (
                  <div className="space-y-2">
                    <p className="text-xs text-text-muted">编辑心情</p>
                    <div className="flex flex-wrap gap-1">
                      {MOODS.map(m => (
                        <button key={m} onClick={() => setEditMood(m)}
                          className={`min-h-[44px] min-w-[44px] rounded-full text-lg ${editMood === m ? 'bg-warm-100 scale-110' : ''}`}>{m}</button>
                      ))}
                    </div>
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                      className="h-20 w-full resize-none rounded-xl border border-warm-200 p-2 text-sm" />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="min-h-[44px] rounded-full bg-warm-500 px-4 text-xs text-white">保存</button>
                      <button onClick={cancelEdit} className="min-h-[44px] rounded-full border border-warm-200 px-4 text-xs text-text-muted">取消</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-lg">{entry.mood}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${
                          entry.author === identity ? 'bg-warm-100 text-warm-600' : 'bg-blue-100 text-blue-500'
                        }`}>
                          {entry.author === identity ? '我' : (partnerName || 'TA')}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="text-xs text-text-muted">{entry.date}</span>
                        {entry.author === identity && (
                          <>
                            <button onClick={() => startEdit(entry)}
                              className="min-h-[44px] min-w-[44px] rounded-full text-xs text-text-muted hover:bg-warm-200" aria-label="编辑日记">✏️</button>
                            <button onClick={() => deleteEntry(entry.id)}
                              className="min-h-[44px] min-w-[44px] rounded-full text-xs text-text-muted hover:bg-red-100" aria-label="删除日记">🗑️</button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">{entry.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
