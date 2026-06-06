import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { checkinPool, type CheckinItem } from '../data/checkin-items'
import { useRealtime } from '../hooks/useRealtime'
import { Toast, ConfirmDialog } from '../components/ui'
import { notifyPartnerActivity } from '../utils/pushEvents'
import { readCache, subscribeCache, writeCache } from '../utils/localCache'

interface DailyPageProps {
  identity: Identity
  partnerName: string
  navigate: (route: string) => void
}

const MAX_CHECKINS_PER_DAY = 3
const MAX_REFRESH = 3
const DISPLAY_ITEMS = 6
const WEEKLY_REDLINE_SCORE = 5
const MONTHLY_REDLINE_SCORE = 10
const DAILY_CACHE_KEY = 'qinggan_cache_daily_state'
const SCORE_TOTAL_CACHE_KEY = 'qinggan_cache_score_total'
const REDEMPTIONS_CACHE_KEY = 'qinggan_cache_reward_redemptions'

const getToday = () => new Date().toISOString().split('T')[0]
const getWeekStart = () => {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + 1)
  return d.toISOString().split('T')[0]
}
const getMonthStart = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

interface CachedDailyState {
  date: string
  completed: string[]
  partnerCompleted: string[]
  todayCheckinCount: number
  partnerScore: number
  weeklyRedline: boolean
  monthlyRedline: boolean
}

const getCachedDailyState = () => readCache<CachedDailyState>(DAILY_CACHE_KEY, {
  date: getToday(),
  completed: [],
  partnerCompleted: [],
  todayCheckinCount: 0,
  partnerScore: 0,
  weeklyRedline: false,
  monthlyRedline: false,
})

const buildDisplayItems = (completed: Set<string>) => {
  const available = checkinPool.filter(c => !completed.has(c.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, DISPLAY_ITEMS)
  if (shuffled.length < DISPLAY_ITEMS) {
    const remaining = DISPLAY_ITEMS - shuffled.length
    const alreadyDone = checkinPool
      .filter(c => completed.has(c.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, remaining)
    shuffled.push(...alreadyDone)
  }
  return shuffled
}

export function DailyPage({ identity, partnerName, navigate }: DailyPageProps) {
  const cachedDaily = getCachedDailyState()
  const useTodayCache = cachedDaily.date === getToday()
  const initialCompleted = new Set(useTodayCache ? cachedDaily.completed : [])
  const [displayItems, setDisplayItems] = useState<CheckinItem[]>(() => buildDisplayItems(initialCompleted))
  const [completedToday, setCompletedToday] = useState<Set<string>>(() => initialCompleted)
  const [todayCheckinCount, setTodayCheckinCount] = useState(useTodayCache ? cachedDaily.todayCheckinCount : 0)
  const [cumulativeScore, setCumulativeScore] = useState(() => readCache(SCORE_TOTAL_CACHE_KEY, 0))
  const [partnerScore, setPartnerScore] = useState(useTodayCache ? cachedDaily.partnerScore : 0)
  const [weeklyRedline, setWeeklyRedline] = useState(useTodayCache ? cachedDaily.weeklyRedline : false)
  const [monthlyRedline, setMonthlyRedline] = useState(useTodayCache ? cachedDaily.monthlyRedline : false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [toast, setToast] = useState('')
  const [showConfirm, setShowConfirm] = useState<CheckinItem | null>(null)
  const [showWeeklyConfirm, setShowWeeklyConfirm] = useState(false)
  const [showMonthlyConfirm, setShowMonthlyConfirm] = useState(false)
  const [showRedeem, setShowRedeem] = useState<{ tier: string; level: string; name: string; cost: number; desc: string } | null>(null)
  const [redemptionHistory, setRedemptionHistory] = useState<Record<string, unknown>[]>(() => readCache(REDEMPTIONS_CACHE_KEY, [] as Record<string, unknown>[]))
  const [partnerCompleted, setPartnerCompleted] = useState<Set<string>>(() => new Set(useTodayCache ? cachedDaily.partnerCompleted : []))

  const shuffleDisplay = useCallback(() => {
    setDisplayItems(buildDisplayItems(completedToday))
  }, [completedToday])

  // Realtime subscription
  const { onChange } = useRealtime<Record<string, unknown>>('checkins', { event: '*' })

  useEffect(() => {
    return onChange((payload) => {
      if (payload.new && typeof payload.new === 'object') {
        const record = payload.new as Record<string, unknown>
        if (record.author !== identity && record.date === getToday()) {
          const items = (record.items as string[]) || []
          setPartnerCompleted(new Set(items))
        }
      }
    })
  }, [onChange, identity])

  const loadAll = useCallback(async () => {
    const today = getToday()
    const weekStart = getWeekStart()
    const monthStart = getMonthStart()
    const cached = getCachedDailyState()
    const cachedIsToday = cached.date === today
    let nextCompleted = cachedIsToday ? cached.completed : []
    let nextPartnerCompleted = cachedIsToday ? cached.partnerCompleted : []
    let nextTodayCheckinCount = cachedIsToday ? cached.todayCheckinCount : 0
    let nextPartnerScore = cachedIsToday ? cached.partnerScore : 0
    let nextWeeklyRedline = cachedIsToday ? cached.weeklyRedline : false
    let nextMonthlyRedline = cachedIsToday ? cached.monthlyRedline : false

    const [checkinRes, scoreRes, partnerScoreRes, wrRes, mrRes, redeemRes] = await Promise.allSettled([
      supabase.from('checkins').select('*').eq('date', today),
      supabase.from('score_logs').select('amount').eq('author', identity),
      supabase.from('score_logs').select('amount').neq('author', identity),
      supabase.from('weekly_redlines').select('cleared').eq('author', identity).eq('week_start', weekStart).maybeSingle(),
      supabase.from('monthly_redlines').select('cleared').eq('author', identity).eq('month_start', monthStart).maybeSingle(),
      supabase.from('reward_redemptions').select('*').order('created_at', { ascending: false }).limit(20),
    ])

    // Check-in data
    if (checkinRes.status === 'fulfilled' && checkinRes.value.data) {
      const data = checkinRes.value.data as Record<string, unknown>[]
      const mine = data.find(d => d.author === identity)
      const theirs = data.find(d => d.author !== identity)
      if (mine) {
        const items = (mine.items as string[]) || []
        nextCompleted = items
        nextTodayCheckinCount = Math.min(items.length, MAX_CHECKINS_PER_DAY)
        setCompletedToday(new Set(items))
        setDisplayItems(buildDisplayItems(new Set(items)))
        setTodayCheckinCount(nextTodayCheckinCount)
      }
      if (theirs) {
        nextPartnerCompleted = (theirs.items as string[]) || []
        setPartnerCompleted(new Set(nextPartnerCompleted))
      }
    }

    // Cumulative score (mine)
    if (scoreRes.status === 'fulfilled' && scoreRes.value.data) {
      const total = (scoreRes.value.data as { amount: number }[]).reduce((sum, r) => sum + r.amount, 0)
      setCumulativeScore(total)
      writeCache(SCORE_TOTAL_CACHE_KEY, total)
    }

    // Partner score
    if (partnerScoreRes.status === 'fulfilled' && partnerScoreRes.value.data) {
      const total = (partnerScoreRes.value.data as { amount: number }[]).reduce((sum, r) => sum + r.amount, 0)
      nextPartnerScore = total
      setPartnerScore(total)
    }

    // Weekly redline
    if (wrRes.status === 'fulfilled' && wrRes.value.data) {
      nextWeeklyRedline = (wrRes.value.data as Record<string, boolean>).cleared || false
      setWeeklyRedline(nextWeeklyRedline)
    }

    // Monthly redline
    if (mrRes.status === 'fulfilled' && mrRes.value.data) {
      nextMonthlyRedline = (mrRes.value.data as Record<string, boolean>).cleared || false
      setMonthlyRedline(nextMonthlyRedline)
    }

    // Redemption history
    if (redeemRes.status === 'fulfilled' && redeemRes.value.data) {
      const next = redeemRes.value.data as Record<string, unknown>[]
      setRedemptionHistory(next)
      writeCache(REDEMPTIONS_CACHE_KEY, next)
    }

    // Initialize display items
    const rc = localStorage.getItem(`qinggan_refresh_${today}`)
    if (rc) setRefreshCount(parseInt(rc))

    writeCache(DAILY_CACHE_KEY, {
      date: today,
      completed: nextCompleted,
      partnerCompleted: nextPartnerCompleted,
      todayCheckinCount: nextTodayCheckinCount,
      partnerScore: nextPartnerScore,
      weeklyRedline: nextWeeklyRedline,
      monthlyRedline: nextMonthlyRedline,
    })
  }, [identity])

  useEffect(() => { void Promise.resolve().then(loadAll) }, [loadAll])
  useEffect(() => subscribeCache<number>(SCORE_TOTAL_CACHE_KEY, setCumulativeScore), [])
  useEffect(() => subscribeCache<Record<string, unknown>[]>(REDEMPTIONS_CACHE_KEY, setRedemptionHistory), [])

  const refresh = () => {
    if (refreshCount >= MAX_REFRESH) {
      setToast('今日刷新次数已用完（3次/天）')
      return
    }
    const newCount = refreshCount + 1
    setRefreshCount(newCount)
    localStorage.setItem(`qinggan_refresh_${getToday()}`, String(newCount))
    shuffleDisplay()
    setToast(`已刷新！今日剩余 ${MAX_REFRESH - newCount} 次`)
  }

  const confirmCheckin = async (item: CheckinItem) => {
    setShowConfirm(null)

    if (todayCheckinCount >= MAX_CHECKINS_PER_DAY) {
      setToast('今日打卡积分已达上限（3分）')
      return
    }
    if (completedToday.has(item.id)) return

    const newCompleted = new Set(completedToday)
    newCompleted.add(item.id)
    setCompletedToday(newCompleted)

    const newCount = todayCheckinCount + 1
    setTodayCheckinCount(newCount)
    const newCumulative = cumulativeScore + 1
    setCumulativeScore(newCumulative)

    const { error: checkinError } = await supabase.from('checkins').upsert({
      author: identity,
      date: getToday(),
      items: [...newCompleted],
      daily_score: newCount,
    }, { onConflict: 'author,date' })

    if (!checkinError) void notifyPartnerActivity(identity, 'checkin', partnerName)

    await supabase.from('score_logs').insert({
      author: identity,
      date: getToday(),
      source: '每日打卡',
      amount: 1,
      balance: newCumulative,
      detail: `${item.emoji} ${item.text}`,
    })

    // Replace completed item in display with a new random item
    const available = checkinPool.filter(c => !newCompleted.has(c.id))
    if (available.length > 0) {
      const replacement = available[Math.floor(Math.random() * available.length)]
      setDisplayItems(prev => prev.map(d => d.id === item.id ? replacement : d))
    }

    setToast(`+1分！${item.emoji} ${item.text}`)
  }

  const markWeeklyRedline = async () => {
    if (weeklyRedline) return
    const weekStart = getWeekStart()
    setWeeklyRedline(true)

    await supabase.from('weekly_redlines').upsert({
      author: identity, week_start: weekStart, cleared: true,
    }, { onConflict: 'author,week_start' })

    const newCumulative = cumulativeScore + WEEKLY_REDLINE_SCORE
    await supabase.from('score_logs').insert({
      author: identity,
      date: getToday(),
      source: '一周无触红线',
      amount: WEEKLY_REDLINE_SCORE,
      balance: newCumulative,
    })

    setCumulativeScore(newCumulative)
    setToast(`一周无触红线 +${WEEKLY_REDLINE_SCORE}分！`)
  }

  const markMonthlyRedline = async () => {
    if (monthlyRedline) return
    const monthStart = getMonthStart()
    setMonthlyRedline(true)

    await supabase.from('monthly_redlines').upsert({
      author: identity, month_start: monthStart, cleared: true,
    }, { onConflict: 'author,month_start' })

    const newCumulative = cumulativeScore + MONTHLY_REDLINE_SCORE
    await supabase.from('score_logs').insert({
      author: identity,
      date: getToday(),
      source: '一月无触红线',
      amount: MONTHLY_REDLINE_SCORE,
      balance: newCumulative,
    })

    setCumulativeScore(newCumulative)
    setToast(`一月无触红线 +${MONTHLY_REDLINE_SCORE}分！`)
  }

  const loadRedemptionHistory = async () => {
    const { data } = await supabase.from('reward_redemptions').select('*').order('created_at', { ascending: false }).limit(20)
    if (data) setRedemptionHistory(data)
  }

  const redeemReward = async (tier: string, name: string, cost: number) => {
    await supabase.from('reward_redemptions').insert({
      author: identity, date: getToday(), tier, reward_name: name, cost, target: 'TA', detail: '',
    })
    const newCumulative = cumulativeScore - cost
    await supabase.from('score_logs').insert({
      author: identity,
      date: getToday(),
      source: `兑换: ${name}`,
      amount: -cost,
      balance: newCumulative,
    })
    setCumulativeScore(newCumulative)
    setShowRedeem(null)
    setToast(`已兑换 ${name}！告诉TA吧~`)
    loadRedemptionHistory()
  }

  return (
    <div className="pixel-page flex h-full min-h-0 flex-col gap-2 overflow-hidden px-3 pt-3 pb-2">
      <section className="pixel-hero shrink-0 px-6 py-3">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/75">每日打卡小任务</p>
            <h2 className="mt-1 text-xl font-black tracking-tight">今天也收集一点爱</h2>
            <p className="mt-1 text-xs text-white/75">完成三件小事，就给你们的小花园加分。</p>
          </div>
          <div className="pixel-couple scale-75 shrink-0">
            <div className="pixel-heart" />
            <div className="pixel-person pixel-person-left" />
            <div className="pixel-person pixel-person-right" />
          </div>
        </div>
      </section>

      {/* Weekly + Monthly redline buttons */}
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setShowWeeklyConfirm(true)}
          disabled={weeklyRedline}
          className={`min-h-[52px] flex-1 rounded-2xl py-2 text-xs font-medium transition-all ${
            weeklyRedline
              ? 'border border-green-200 bg-green-50/80 text-green-600'
              : 'border border-warm-100/80 bg-white/75 text-text-secondary shadow-[0_8px_18px_rgba(61,44,46,0.045)] active:bg-warm-50'
          }`}
        >
          🛡️ 一周无触红线
          <span className="block text-xs text-text-muted">
            {weeklyRedline ? '✅ 已领取' : `+${WEEKLY_REDLINE_SCORE}分`}
          </span>
        </button>
        <button
          onClick={() => setShowMonthlyConfirm(true)}
          disabled={monthlyRedline}
          className={`min-h-[52px] flex-1 rounded-2xl py-2 text-xs font-medium transition-all ${
            monthlyRedline
              ? 'border border-green-200 bg-green-50/80 text-green-600'
              : 'border border-warm-100/80 bg-white/75 text-text-secondary shadow-[0_8px_18px_rgba(61,44,46,0.045)] active:bg-warm-50'
          }`}
        >
          🏆 一月无触红线
          <span className="block text-xs text-text-muted">
            {monthlyRedline ? '✅ 已领取' : `+${MONTHLY_REDLINE_SCORE}分`}
          </span>
        </button>
      </div>

      {/* Daily check-in section */}
      <div className="flex shrink-0 items-center justify-between">
        <h3 className="font-black text-text-primary">
          今日打卡
          <span className="text-xs text-text-muted font-normal ml-1">
            ({todayCheckinCount}/{MAX_CHECKINS_PER_DAY})
          </span>
        </h3>
        <button
          onClick={refresh}
          disabled={refreshCount >= MAX_REFRESH}
          className={`min-h-[44px] rounded-2xl px-3 py-1.5 text-xs font-bold shadow-[0_6px_14px_rgba(61,44,46,0.045)] ${
            refreshCount >= MAX_REFRESH
              ? 'bg-warm-50/70 text-text-muted'
              : 'bg-warm-100/85 text-warm-600 active:bg-warm-200'
          }`}
        >
          🔄 刷新 ({MAX_REFRESH - refreshCount})
        </button>
      </div>

      {/* Check-in items grid */}
      <div className="grid min-h-0 flex-[1.15] grid-cols-2 grid-rows-3 gap-2">
        {displayItems.map(item => {
          const isComplete = completedToday.has(item.id)
          const partnerDid = partnerCompleted.has(item.id)
          const capped = !isComplete && todayCheckinCount >= MAX_CHECKINS_PER_DAY

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isComplete) return
                if (capped) {
                  setToast('今日打卡积分已达上限（3分）')
                  return
                }
                setShowConfirm(item)
              }}
              className={`min-h-0 rounded-2xl border p-2.5 text-left transition-all active:scale-95 ${
                isComplete
                  ? 'border-green-200 bg-green-50/80'
                  : capped
                    ? 'border-warm-100 bg-warm-50/70 opacity-50'
                    : 'border-warm-100/80 bg-white/75 shadow-[0_8px_18px_rgba(61,44,46,0.04)] hover:border-warm-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-tight ${
                    isComplete ? 'text-green-700' : 'text-text-secondary'
                  }`}>
                    {item.text}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    {item.category}
                    {item.isRedline && ' · 红线'}
                    {isComplete && ' ✅'}
                    {partnerDid && !isComplete && ' 👀 TA已完成'}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Checkin confirm dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="确认打卡"
          message={`${showConfirm.emoji} ${showConfirm.text}\n\n确认完成后将获得 +1 积分`}
          onConfirm={() => confirmCheckin(showConfirm)}
          onCancel={() => setShowConfirm(null)}
        />
      )}

      {/* Weekly redline confirm */}
      {showWeeklyConfirm && (
        <ConfirmDialog
          title="确认领取"
          message={`确认本周无触红线？\n\n领取后将获得 +${WEEKLY_REDLINE_SCORE} 积分`}
          onConfirm={() => { setShowWeeklyConfirm(false); markWeeklyRedline() }}
          onCancel={() => setShowWeeklyConfirm(false)}
        />
      )}

      {/* Monthly redline confirm */}
      {showMonthlyConfirm && (
        <ConfirmDialog
          title="确认领取"
          message={`确认本月无触红线？\n\n领取后将获得 +${MONTHLY_REDLINE_SCORE} 积分`}
          onConfirm={() => { setShowMonthlyConfirm(false); markMonthlyRedline() }}
          onCancel={() => setShowMonthlyConfirm(false)}
        />
      )}

      {/* Reward store */}
      <div className="pixel-card flex min-h-0 flex-[0.95] flex-col overflow-hidden p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-black text-text-primary">礼物小店</h3>
          <button onClick={() => navigate('/points-log')} className="min-h-[44px] px-2 text-xs font-medium text-warm-500 underline">
            查看积分明细
          </button>
        </div>
        <div className="mb-2 flex gap-2">
          <div className="flex-1 bg-warm-50 rounded-2xl p-2 text-center">
            <p className="text-[10px] text-text-muted">我的积分</p>
            <p className="text-lg font-bold text-warm-500">{cumulativeScore}</p>
          </div>
          <div className="flex-1 bg-blue-50 rounded-2xl p-2 text-center">
            <p className="text-[10px] text-text-muted">{partnerName || 'TA'}的积分</p>
            <p className="text-lg font-bold text-blue-500">{partnerScore}</p>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2">
          {[
            { tier: 'bronze', level: '🥉 铜', cost: 30, name: '铜级奖励', desc: '一个10分钟专属倾听' },
            { tier: 'silver', level: '🥈 银', cost: 60, name: '银级奖励', desc: '让对方做一件事（合理范围）' },
            { tier: 'gold', level: '🥇 金', cost: 100, name: '金级奖励', desc: '一次视频约会（TA来安排）' },
            { tier: 'diamond', level: '💎 钻石', cost: 200, name: '钻石奖励', desc: '一个心愿（TA来满足）' },
          ].map(r => {
            const canAfford = cumulativeScore >= r.cost
            return (
            <button
              key={r.tier}
              onClick={() => {
                if (!canAfford) {
                  setToast(`积分不足！还需 ${r.cost - cumulativeScore} 分`)
                  return
                }
                setShowRedeem(r)
              }}
              className={`min-h-0 rounded-2xl border p-2.5 text-left transition-all ${
                canAfford
                  ? 'border-warm-100/90 bg-white/75 shadow-[0_8px_18px_rgba(61,44,46,0.04)] active:bg-warm-50'
                  : 'border-warm-100 bg-warm-50/70 opacity-40'
              }`}
            >
              <p className="text-sm font-semibold text-text-primary">{r.level}</p>
              <p className="text-xs text-warm-500 font-medium">{r.cost}分</p>
              <p className="text-[10px] text-text-muted mt-1">{r.desc}</p>
            </button>
          )
        })}
        </div>
        {redemptionHistory.length > 0 && (
          <div className="mt-2 max-h-20 shrink-0 overflow-y-auto border-t border-warm-100 pt-2">
            <p className="text-xs text-text-muted mb-2">兑换记录</p>
            {redemptionHistory.map((r) => (
              <div key={r.id as string} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-text-secondary">{(r as Record<string, string>).reward_name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  (r as Record<string, boolean>).fulfilled ? 'bg-green-100 text-green-600' : 'bg-warm-100 text-warm-600'
                }`}>
                  {(r as Record<string, boolean>).fulfilled ? '已兑现' : '待兑现'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redeem confirmation overlay */}
      {showRedeem && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowRedeem(null)}>
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-sm shadow-xl" style={{ animation: 'scaleIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-text-primary mb-2">{showRedeem.level}</h3>
            <p className="text-text-secondary mb-1">{showRedeem.desc}</p>
            <p className="text-xs text-text-muted mb-5">消耗 {showRedeem.cost} 积分（当前累计 {cumulativeScore} 分）</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowRedeem(null)}
                className="px-5 py-2.5 rounded-full border border-warm-300 text-text-secondary text-sm">
                取消
              </button>
              <button
                onClick={() => redeemReward(showRedeem.tier, showRedeem.name, showRedeem.cost)}
                className="px-5 py-2.5 rounded-full bg-warm-500 text-white text-sm font-medium">
                确认兑换
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} type="info" onClose={() => setToast('')} />}
    </div>
  )
}
