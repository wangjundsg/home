import { useState, useEffect, useCallback } from 'react'
import { Trash2 } from 'lucide-react'
import { supabase } from '../supabase'
import { starterPhrases as defaultPhrases } from '../data/starter-phrases'
import { Toast } from '../components/ui'
import { useRealtime } from '../hooks/useRealtime'
import { copyToClipboard } from '../utils/clipboard'

interface Phrase { id: string; author: string; scenario: string; text: string; used: number }
interface PhrasesPageProps { identity: string; navigate: (route: string) => void }

const scenarios = ['暂停信号', '伸出橄榄枝', '翻译需求', '修复口令', '求助口令', '日常暖心', '自定义']

export function PhrasesPage({ identity }: PhrasesPageProps) {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [toast, setToast] = useState('')
  const [newText, setNewText] = useState('')
  const [newScenario, setNewScenario] = useState('自定义')

  const { onChange } = useRealtime<Record<string, unknown>>('phrases', { event: '*' })

  const loadPhrases = useCallback(async () => {
    const { data } = await supabase.from('phrases').select('*').order('created_at', { ascending: true })
    if (data && data.length > 0) {
      setPhrases(data as Phrase[])
    } else {
      setPhrases(defaultPhrases.filter(p => p.text).map(p => ({ id: p.id, author: '', scenario: p.scenario, text: p.text, used: 0 })))
    }
  }, [])

  const seedDefaults = useCallback(async () => {
    const { data } = await supabase.from('phrases').select('id').limit(1)
    if (!data || data.length === 0) {
      for (const p of defaultPhrases.filter(p => p.text)) {
        await supabase.from('phrases').insert({ author: '', scenario: p.scenario, text: p.text, used: 0 })
      }
      loadPhrases()
    }
  }, [loadPhrases])

  useEffect(() => { return onChange(() => loadPhrases()) }, [onChange, loadPhrases])
  useEffect(() => {
    void Promise.resolve().then(async () => {
      await loadPhrases()
      await seedDefaults()
    })
  }, [loadPhrases, seedDefaults])

  const copyPhrase = async (p: Phrase) => {
    const ok = await copyToClipboard(p.text)
    setToast(ok ? '已复制' : '复制失败，请手动长按复制')
    if (ok) {
      await supabase.from('phrases').update({ used: (p.used || 0) + 1 }).eq('id', p.id)
      loadPhrases()
    }
  }

  const addPhrase = async () => {
    if (!newText.trim()) return
    await supabase.from('phrases').insert({ author: identity, scenario: newScenario, text: newText, used: 0 })
    setNewText('')
    loadPhrases()
  }

  const deletePhrase = async (id: string) => {
    await supabase.from('phrases').delete().eq('id', id)
    loadPhrases()
  }

  const grouped: Record<string, Phrase[]> = {}
  phrases.forEach(p => {
    if (!grouped[p.scenario]) grouped[p.scenario] = []
    grouped[p.scenario].push(p)
  })

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      <p className="text-sm text-text-secondary">关键时刻不知道怎么开口？用这些句子帮你们安全地表达</p>

      {Object.entries(grouped).map(([scenario, items]) => (
        <div key={scenario} className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-semibold text-sm text-warm-600 mb-3">{scenario}</h3>
          <div className="space-y-2">
            {items.map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-warm-50 rounded-xl px-4 py-3">
                <p className="min-w-0 flex-1 text-sm text-text-secondary italic leading-relaxed">"{p.text}"</p>
                <span className="shrink-0 text-[10px] text-text-muted">{p.used || 0}次</span>
                <div className="shrink-0 flex items-center gap-2">
                  <button onClick={() => copyPhrase(p)} className="min-h-[44px] px-4 bg-warm-500 text-white rounded-full text-xs font-medium">复制</button>
                  {p.author && (
                    <button
                      onClick={() => deletePhrase(p.id)}
                      aria-label="删除短语"
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-white text-text-muted ring-1 ring-warm-200 active:bg-warm-100"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <h3 className="font-semibold text-sm text-text-primary">+ 添加你们自己的句子</h3>
        <select value={newScenario} onChange={e => setNewScenario(e.target.value)} className="w-full rounded-xl border border-warm-200 px-3 py-2 text-sm">
          {scenarios.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="写下你们的专属句子..."
          className="w-full rounded-xl border border-warm-200 px-3 py-2 text-sm h-20 resize-none" />
        <button onClick={addPhrase} className="w-full py-2.5 bg-warm-500 text-white rounded-full text-sm font-medium">保存</button>
      </div>

      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}
    </div>
  )
}
