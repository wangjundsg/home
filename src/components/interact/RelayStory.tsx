import { useCallback, useEffect, useState } from 'react'
import { Check, Pencil, Send, Trash2, Undo2, X } from 'lucide-react'
import type { Identity } from '../../hooks/useIdentity'
import { ConfirmDialog } from '../ui'
import { useRealtime } from '../../hooks/useRealtime'
import { supabase } from '../../supabase'
import { notifyPartnerActivity } from '../../utils/pushEvents'
import relayChatBg from '../../assets/relay-chat-bg.svg'

interface RelayStoryProps {
  identity: Identity
  partnerName: string
}

interface RelaySentence {
  id: string
  story_id: string
  author: string
  sentence: string
  turn_number: number
  created_at: string
}

const STORY_TITLE_KEY = 'qinggan_relay_story_titles'
const CHAT_BACKGROUND_KEY = 'qinggan_relay_chat_background_url'

const loadStoredTitles = () => {
  try {
    return JSON.parse(localStorage.getItem(STORY_TITLE_KEY) || '{}') as Record<string, string>
  } catch {
    return {}
  }
}

const loadChatBackgroundUrl = () => {
  try {
    return localStorage.getItem(CHAT_BACKGROUND_KEY) || relayChatBg
  } catch {
    return relayChatBg
  }
}

export function RelayStory({ identity, partnerName }: RelayStoryProps) {
  const [storyIds, setStoryIds] = useState<string[]>([])
  const [storyTitles, setStoryTitles] = useState<Record<string, string>>(loadStoredTitles)
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null)
  const [sentences, setSentences] = useState<RelaySentence[]>([])
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [pendingDeleteStoryId, setPendingDeleteStoryId] = useState<string | null>(null)
  const [chatBackgroundUrl] = useState(loadChatBackgroundUrl)
  const { onChange } = useRealtime<Record<string, unknown>>('relay_stories', { event: '*' })

  const getStoryTitle = (storyId: string) => storyTitles[storyId] || '未命名故事'

  const persistTitles = (next: Record<string, string>) => {
    setStoryTitles(next)
    localStorage.setItem(STORY_TITLE_KEY, JSON.stringify(next))
  }

  const loadStoryIds = useCallback(async () => {
    const { data } = await supabase
      .from('relay_stories')
      .select('story_id')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) {
      const ids = [...new Set((data as RelaySentence[]).map(d => d.story_id))]
      setStoryIds(ids)
    }
  }, [])

  const loadSentences = useCallback(async (storyId: string) => {
    const { data } = await supabase
      .from('relay_stories')
      .select('*')
      .eq('story_id', storyId)
      .order('turn_number', { ascending: true })
    if (data) setSentences(data as RelaySentence[])
  }, [])

  useEffect(() => { void Promise.resolve().then(loadStoryIds) }, [loadStoryIds])

  useEffect(() => {
    const unsub = onChange((payload) => {
      const changedRecord = (payload.new || payload.old) as Record<string, unknown> | null
      if (!changedRecord) return

      if (payload.eventType === 'INSERT' && payload.new) {
        void Promise.resolve().then(loadStoryIds)
      }

      if (changedRecord.story_id !== currentStoryId) return

      if (payload.eventType === 'DELETE' && payload.old) {
        const deletedId = payload.old.id
        setSentences(prev => prev.filter(s => s.id !== deletedId))
        void Promise.resolve().then(loadStoryIds)
        return
      }

      if (payload.eventType === 'INSERT' && payload.new) {
        const nextSentence = payload.new as unknown as RelaySentence
        setSentences(prev => {
          if (prev.some(s => s.id === nextSentence.id)) return prev
          return [...prev, nextSentence]
        })
      }
    })
    return unsub
  }, [onChange, currentStoryId, loadStoryIds])

  const startNewStory = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    const nextTitles = { ...storyTitles, [id]: '未命名故事' }
    persistTitles(nextTitles)
    setCurrentStoryId(id)
    setSentences([])
    setStoryIds(prev => [id, ...prev])
    setEditingTitle(true)
    setTitleDraft('未命名故事')
  }

  const selectStory = (storyId: string) => {
    setCurrentStoryId(storyId)
    setEditingTitle(false)
    setTitleDraft('')
    void loadSentences(storyId)
  }

  const startEditTitle = () => {
    if (!currentStoryId) return
    setTitleDraft(getStoryTitle(currentStoryId))
    setEditingTitle(true)
  }

  const saveStoryTitle = () => {
    if (!currentStoryId) return
    const title = titleDraft.trim() || '未命名故事'
    persistTitles({ ...storyTitles, [currentStoryId]: title })
    setEditingTitle(false)
    setTitleDraft('')
  }

  const deleteStory = async (storyId: string) => {
    await supabase.from('relay_stories').delete().eq('story_id', storyId)
    const nextTitles = { ...storyTitles }
    delete nextTitles[storyId]
    persistTitles(nextTitles)
    setStoryIds(prev => prev.filter(id => id !== storyId))
    if (currentStoryId === storyId) {
      setCurrentStoryId(null)
      setSentences([])
      setEditingTitle(false)
      setTitleDraft('')
    }
    setPendingDeleteStoryId(null)
  }

  const recallSentence = async (sentence: RelaySentence) => {
    if (sentence.author !== identity) return
    await supabase.from('relay_stories').delete().eq('id', sentence.id).eq('author', identity)
    setSentences(prev => prev.filter(s => s.id !== sentence.id))
  }

  const addSentence = async () => {
    if (!input.trim() || !currentStoryId) return
    setSaving(true)
    const nextTurn = sentences.length > 0 ? Math.max(...sentences.map(s => s.turn_number)) + 1 : 1
    const { error } = await supabase.from('relay_stories').insert({
      story_id: currentStoryId,
      author: identity,
      sentence: input.trim(),
      turn_number: nextTurn,
    })
    if (!error) void notifyPartnerActivity(identity, 'story', partnerName)
    setInput('')
    setSaving(false)
    loadSentences(currentStoryId)
  }

  return (
    <div className="pixel-page flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 px-4 pt-3 pb-2 flex gap-2 flex-wrap items-center">
        <button
          onClick={startNewStory}
          className={`min-h-[44px] rounded-2xl px-4 py-2 text-sm font-black shadow-[0_8px_18px_rgba(61,44,46,0.055)] transition-all ${
            !currentStoryId || sentences.length === 0
              ? 'bg-warm-500 text-white'
              : 'bg-warm-100/85 text-warm-600'
          }`}
        >
          ＋ 新故事
        </button>
        {storyIds.map(id => (
          <button
            key={id}
            onClick={() => selectStory(id)}
            className={`min-h-[38px] max-w-[150px] truncate rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
              currentStoryId === id
                ? 'bg-warm-100/90 text-warm-700 shadow-[0_6px_14px_rgba(61,44,46,0.045)]'
                : 'border border-warm-100/80 bg-white/65 text-text-muted'
            }`}
          >
            {getStoryTitle(id)}
          </button>
        ))}
      </div>

      {currentStoryId && (
        <div className="shrink-0 px-4 pb-2">
          {editingTitle ? (
            <div className="pixel-card flex items-center gap-2 p-2">
              <input
                value={titleDraft}
                onChange={e => setTitleDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveStoryTitle()}
                className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-warm-200 bg-white px-3 text-sm"
                placeholder="给这个故事起个名字"
                autoFocus
              />
              <button onClick={() => setEditingTitle(false)} className="min-h-[44px] min-w-[44px] rounded-full bg-white text-text-muted ring-1 ring-warm-200 flex items-center justify-center" aria-label="取消编辑故事名">
                <X size={16} />
              </button>
              <button onClick={saveStoryTitle} className="min-h-[44px] min-w-[44px] rounded-full bg-warm-500 text-white flex items-center justify-center" aria-label="保存故事名">
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={startEditTitle} className="flex min-h-[44px] min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl border border-warm-100/80 bg-white/65 px-4 text-left shadow-[0_8px_18px_rgba(61,44,46,0.045)]">
                <span className="min-w-0 truncate text-sm font-semibold text-text-primary">{getStoryTitle(currentStoryId)}</span>
                <Pencil size={16} className="shrink-0 text-warm-500" />
              </button>
              <button
                onClick={() => setPendingDeleteStoryId(currentStoryId)}
                className="min-h-[44px] min-w-[44px] rounded-full bg-white text-text-muted ring-1 ring-warm-200 active:bg-warm-100 flex items-center justify-center"
                aria-label="删除这个故事"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url("${chatBackgroundUrl}")` }}
        />
        <div className="absolute inset-0 bg-white/52 backdrop-blur-[1px]" />
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 scale-150 opacity-15">
          <div className="pixel-couple">
            <div className="pixel-heart" />
            <div className="pixel-person pixel-person-left" />
            <div className="pixel-person pixel-person-right" />
          </div>
        </div>
        <div className="relative h-full overflow-y-auto px-4 py-3 space-y-3">
          {!currentStoryId ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📜</span>
            </div>
            <p className="text-sm text-text-muted">
              开始一个接力故事吧！<br />像聊天室一样一起写属于你们的故事
            </p>
          </div>
        ) : sentences.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✍️</span>
            </div>
            <p className="text-sm text-text-muted">故事已创建，谁先想到都可以开头</p>
          </div>
        ) : (
          sentences.map((s) => {
            const isMe = s.author === identity
            return (
              <div
                key={s.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fadeIn 0.25s ease' }}
              >
                <div className="max-w-[80%]">
                  <p className={`text-[10px] mb-1 font-medium ${
                    isMe ? 'text-right text-warm-500 mr-1' : 'text-left text-text-muted ml-1'
                  }`}>
                    {isMe ? '我' : (partnerName || 'TA')}
                    <span className="text-text-muted font-normal ml-1">第{s.turn_number}句</span>
                  </p>
                  <div
                    className={`relative rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-[0_8px_18px_rgba(61,44,46,0.05)] ${
                      isMe
                        ? 'border-warm-400/70 bg-warm-500 text-white rounded-br-sm'
                        : 'border-warm-100/80 bg-white/90 text-text-primary rounded-bl-sm'
                    }`}
                  >
                    <p>{s.sentence}</p>
                  </div>
                  {isMe && (
                    <button
                      onClick={() => recallSentence(s)}
                      className="mt-1 ml-auto flex min-h-[44px] items-center gap-1 rounded-full px-3 text-xs text-text-muted active:bg-warm-100"
                      aria-label="撤回这条消息"
                    >
                      <Undo2 size={13} />
                      撤回
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
        </div>
      </div>

      {currentStoryId && (
        <div className="shrink-0 border-t border-warm-100/80 bg-white/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex gap-2 items-center">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSentence()}
              placeholder="继续写下一句..."
              className="min-h-[44px] flex-1 rounded-2xl border border-warm-100/90 bg-warm-50/80 px-4 py-3 text-sm"
            />
            <button
              onClick={addSentence}
              disabled={!input.trim() || saving}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl bg-warm-500 text-white shadow-[0_10px_18px_rgba(184,74,36,0.16)] transition-all active:scale-90 disabled:opacity-40"
            >
              {saving ? (
                <span className="text-xs">...</span>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      )}

      {pendingDeleteStoryId && (
        <ConfirmDialog
          title="删除故事"
          message="确认删除这个故事和里面所有聊天内容吗？删除后不能恢复。"
          onConfirm={() => deleteStory(pendingDeleteStoryId)}
          onCancel={() => setPendingDeleteStoryId(null)}
        />
      )}
    </div>
  )
}
