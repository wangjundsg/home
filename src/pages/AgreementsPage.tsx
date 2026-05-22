import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { useRealtime } from '../hooks/useRealtime'

interface Commitment { id: string; author: string; text: string; level: string }
interface Compensation { id: string; author: string; date: string; violator: string; violation: string; level: string; compensation: string; compensation_done: boolean; acknowledged: boolean }

interface AgreementsPageProps { identity: Identity; navigate: (route: string) => void }
type TabType = 'commitments' | 'compensations'

export function AgreementsPage({ identity }: AgreementsPageProps) {
  const [tab, setTab] = useState<TabType>('commitments')

  return (
    <div className="pixel-page min-h-full space-y-4 px-4 pt-4 pb-6">
      <section className="pixel-hero px-4 py-5">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white/75">关系里的小规矩</p>
            <h2 className="mt-1 text-xl font-black tracking-tight">承诺木牌墙</h2>
            <p className="mt-1 text-xs text-white/75">把重要约定挂起来，也把补偿认真记下来。</p>
          </div>
          <div className="pixel-couple scale-75 shrink-0">
            <div className="pixel-heart" />
            <div className="pixel-person pixel-person-left" />
            <div className="pixel-person pixel-person-right" />
          </div>
        </div>
      </section>

      <div className="pixel-card flex gap-2 p-1.5">
        <button onClick={() => setTab('commitments')} className={`min-h-[44px] flex-1 rounded-2xl text-sm font-black transition-all ${tab === 'commitments' ? 'bg-warm-500 text-white shadow-[0_8px_18px_rgba(184,74,36,0.14)]' : 'text-text-secondary'}`}>
          承诺墙
        </button>
        <button onClick={() => setTab('compensations')} className={`min-h-[44px] flex-1 rounded-2xl text-sm font-black transition-all ${tab === 'compensations' ? 'bg-warm-500 text-white shadow-[0_8px_18px_rgba(184,74,36,0.14)]' : 'text-text-secondary'}`}>
          补偿小卖部
        </button>
      </div>
      {tab === 'commitments' ? <CommitmentsTab identity={identity} /> : <CompensationsTab identity={identity} />}
    </div>
  )
}

function CommitmentsTab({ identity }: { identity: Identity }) {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [newText, setNewText] = useState('')
  const { onChange } = useRealtime<Record<string, unknown>>('commitments', { event: '*' })

  const loadCommitments = useCallback(async () => {
    const { data } = await supabase.from('commitments').select('*').order('created_at', { ascending: true })
    if (data) setCommitments(data as Commitment[])
  }, [])

  useEffect(() => { return onChange(() => loadCommitments()) }, [onChange, loadCommitments])
  useEffect(() => { void Promise.resolve().then(loadCommitments) }, [loadCommitments])

  const addCommitment = async () => {
    if (!newText.trim()) return
    const level = newText.includes('红线') ? '红线' : newText.includes('黄线') ? '黄线' : '约定'
    await supabase.from('commitments').insert({ author: identity, text: newText, level })
    setNewText('')
    loadCommitments()
  }

  const deleteCommitment = async (id: string) => {
    await supabase.from('commitments').delete().eq('id', id)
    loadCommitments()
  }

  return (
    <div className="space-y-3">
      <div className="pixel-card p-4">
        <h3 className="mb-3 font-black text-text-primary">我们的承诺木牌</h3>
        {commitments.length === 0 ? (
          <p className="rounded-2xl bg-warm-50/70 py-8 text-center text-sm text-text-muted">还没有写下承诺</p>
        ) : (
          <div className="space-y-2">
            {commitments.map(c => (
              <div key={c.id} className={`flex items-center justify-between gap-3 rounded-2xl border-l-4 p-3 shadow-sm ${
                c.level === '红线' ? 'border-redline bg-red-50' : c.level === '黄线' ? 'border-yellowline bg-yellow-50' : 'border-warm-300 bg-warm-50'
              }`}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-text-secondary">{c.text}</p>
                  <p className="mt-1 text-[10px] text-text-muted">{c.author} · {c.level}</p>
                </div>
                <button onClick={() => deleteCommitment(c.id)} className="min-h-[44px] shrink-0 rounded-full border border-warm-200 bg-white/75 px-4 text-xs font-semibold text-text-muted active:bg-warm-100" aria-label="删除承诺">
                  删除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pixel-card flex gap-2 p-3">
        <input value={newText} onChange={e => setNewText(e.target.value)} placeholder={'新的承诺（含"红线"或"黄线"会自动标记）'}
          className="min-h-[44px] min-w-0 flex-1 rounded-2xl border border-warm-100/90 bg-white/80 px-3 text-sm" />
        <button onClick={addCommitment} className="min-h-[44px] rounded-2xl bg-warm-500 px-5 text-sm font-black text-white shadow-[0_8px_18px_rgba(184,74,36,0.14)] active:scale-95">
          添加
        </button>
      </div>
    </div>
  )
}

function CompensationsTab({ identity }: { identity: Identity }) {
  const [records, setRecords] = useState<Compensation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [violator, setViolator] = useState('')
  const [violation, setViolation] = useState('')
  const [level, setLevel] = useState('黄线')
  const [compensation, setCompensation] = useState('')
  const { onChange } = useRealtime<Record<string, unknown>>('compensations', { event: '*' })

  const loadRecords = useCallback(async () => {
    const { data } = await supabase.from('compensations').select('*').order('created_at', { ascending: false })
    if (data) setRecords(data as Compensation[])
  }, [])

  useEffect(() => { return onChange(() => loadRecords()) }, [onChange, loadRecords])
  useEffect(() => { void Promise.resolve().then(loadRecords) }, [loadRecords])

  const addRecord = async () => {
    if (!violation.trim()) return
    await supabase.from('compensations').insert({
      author: identity,
      date: new Date().toISOString().split('T')[0],
      violator: violator || identity,
      violation,
      level,
      compensation: compensation || (level === '红线' ? '24小时内手写信/长语音道歉 + 对方指定一件事' : '下单小补偿'),
      compensation_done: false,
      acknowledged: false,
    })
    setShowForm(false); setViolation(''); setCompensation('')
    loadRecords()
  }

  const toggleDone = async (r: Compensation) => {
    await supabase.from('compensations').update({ compensation_done: !r.compensation_done }).eq('id', r.id)
    loadRecords()
  }

  const toggleAck = async (r: Compensation) => {
    await supabase.from('compensations').update({ acknowledged: !r.acknowledged }).eq('id', r.id)
    loadRecords()
  }

  return (
    <div className="space-y-3">
      {records.length === 0 ? (
        <div className="pixel-card py-8 text-center">
          <p className="mb-2 text-4xl">🏪</p>
          <p className="text-sm text-text-muted">还没有补偿记录</p>
        </div>
      ) : (
        records.map(r => (
          <div key={r.id} className={`pixel-card space-y-2 p-4 ${r.compensation_done && r.acknowledged ? 'opacity-70' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.level === '红线' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{r.level}</span>
              <span className="text-xs text-text-muted">{r.date}</span>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">{r.violator}：{r.violation}</p>
            <p className="rounded-2xl bg-warm-50/80 px-3 py-2 text-sm text-text-primary">补偿：{r.compensation}</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button onClick={() => toggleDone(r)} className={`flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border text-xs font-semibold ${r.compensation_done ? 'border-green bg-green text-white' : 'border-warm-100 bg-white/70 text-text-muted'}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded border ${r.compensation_done ? 'border-white bg-white text-green' : 'border-warm-300'}`}>{r.compensation_done ? '✓' : ''}</span>
                补偿完成
              </button>
              <button onClick={() => toggleAck(r)} className={`flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border text-xs font-semibold ${r.acknowledged ? 'border-green bg-green text-white' : 'border-warm-100 bg-white/70 text-text-muted'}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded border ${r.acknowledged ? 'border-white bg-white text-green' : 'border-warm-300'}`}>{r.acknowledged ? '✓' : ''}</span>
                已收到原谅
              </button>
            </div>
          </div>
        ))
      )}
      <button onClick={() => setShowForm(!showForm)} className="min-h-[50px] w-full rounded-2xl bg-warm-100 text-sm font-black text-warm-600 shadow-[0_8px_18px_rgba(61,44,46,0.045)] active:scale-95">
        + 记录一次补偿
      </button>
      {showForm && (
        <div className="pixel-card space-y-3 p-4">
          <input value={violator} onChange={e => setViolator(e.target.value)} placeholder="违规者（默认自己）" className="min-h-[44px] w-full rounded-2xl border border-warm-100/90 bg-white/80 px-3 text-sm" />
          <input value={violation} onChange={e => setViolation(e.target.value)} placeholder="违规行为描述" className="min-h-[44px] w-full rounded-2xl border border-warm-100/90 bg-white/80 px-3 text-sm" />
          <select value={level} onChange={e => setLevel(e.target.value)} className="min-h-[44px] w-full rounded-2xl border border-warm-100/90 bg-white/80 px-3 text-sm">
            <option>红线</option><option>黄线</option>
          </select>
          <input value={compensation} onChange={e => setCompensation(e.target.value)} placeholder="补偿方式（不填则使用默认）" className="min-h-[44px] w-full rounded-2xl border border-warm-100/90 bg-white/80 px-3 text-sm" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="min-h-[44px] flex-1 rounded-full border border-warm-200 bg-white/70 text-sm text-text-muted">取消</button>
            <button onClick={addRecord} className="min-h-[44px] flex-1 rounded-full bg-warm-500 text-sm font-semibold text-white">保存</button>
          </div>
        </div>
      )}
    </div>
  )
}
