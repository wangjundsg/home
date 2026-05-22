import { useState, useEffect, useCallback } from 'react'
import { Cake, Droplet, Heart, Mail } from 'lucide-react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { Toast } from '../components/ui'
import { EmotionCharacterCard } from '../components/emotion/EmotionCharacterCard'
import { useCoupleEmotionState } from '../hooks/useCoupleEmotionState'
import { EMOTION_CATEGORIES } from '../data/emotion-character-states'
import { readCache, writeCache } from '../utils/localCache'

interface HomePageProps {
  identity: Identity
  partnerName: string
  navigate: (route: string) => void
  warmReminder?: string
}

interface PeriodRecord {
  id: string
  start_date: string
  end_date: string | null
}

interface Anniversary {
  id: string
  name: string
  date: string
  type: string
}

const RELATIONSHIP_START_DATE = '2024-05-20'
const HOME_EMOTION_BUBBLE_KEY = 'qinggan_home_emotion_bubble'

function getStoredMeeting() {
  const stored = localStorage.getItem('qinggan_meeting_date')
  if (!stored) return { meetingDate: null, daysUntil: null }

  return {
    meetingDate: stored,
    daysUntil: daysUntilDate(stored),
  }
}

function getCachedPeriodPhase() {
  return getPhaseInfo(readCache<PeriodRecord[]>('qinggan_cache_period', []))
}

function getCachedUpcomingAnniversary() {
  const data = readCache<Anniversary[]>('qinggan_cache_anni', [])
  if (data.length === 0) return null

  let closest: { name: string; days: number } | null = null
  for (const a of data) {
    const d = daysUntilNext(a.date)
    if (!closest || d < closest.days) closest = { name: a.name, days: d }
  }
  return closest
}

function getStoredEmotionBubble() {
  const raw = localStorage.getItem(HOME_EMOTION_BUBBLE_KEY)
  if (!raw) return ''

  localStorage.removeItem(HOME_EMOTION_BUBBLE_KEY)

  try {
    const parsed = JSON.parse(raw) as { text?: string; ts?: number }
    return parsed.text && parsed.ts && Date.now() - parsed.ts < 15000 ? parsed.text : ''
  } catch {
    return ''
  }
}

function daysSince(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(1, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
}

function getPhaseInfo(records: PeriodRecord[]) {
  if (records.length === 0) return { emoji: '📅', phase: '暂无数据', color: 'text-text-muted' }
  const last = [...records].sort((a, b) => b.start_date.localeCompare(a.start_date))[0]
  const start = new Date(last.start_date)
  const today = new Date()
  const dayDiff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const periodLen = last.end_date
    ? Math.ceil((new Date(last.end_date).getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    : 5

  if (dayDiff >= 0 && dayDiff <= periodLen) return { emoji: '🔴', phase: '月经期', color: 'text-red-500' }
  else if (dayDiff > periodLen && dayDiff <= 13) return { emoji: '🟢', phase: '卵泡期', color: 'text-green' }
  else if (dayDiff > 13 && dayDiff <= 16) return { emoji: '🟡', phase: '排卵期', color: 'text-yellow-500' }
  else return { emoji: '🟠', phase: '黄体期', color: 'text-orange-500' }
}

function parseLocalDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function daysUntilDate(dateStr: string) {
  const target = parseLocalDate(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function daysUntilNext(dateStr: string) {
  const today = new Date()
  const target = parseLocalDate(dateStr)
  target.setFullYear(today.getFullYear())
  if (target < new Date(today.getFullYear(), today.getMonth(), today.getDate())) target.setFullYear(today.getFullYear() + 1)
  return Math.ceil((target.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / (1000 * 60 * 60 * 24))
}

export function HomePage({ identity, navigate, warmReminder = '' }: HomePageProps) {
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [meetingDate, setMeetingDate] = useState<string | null>(() => getStoredMeeting().meetingDate)
  const [daysUntil, setDaysUntil] = useState<number | null>(() => getStoredMeeting().daysUntil)
  const [emotionBubble, setEmotionBubble] = useState(getStoredEmotionBubble)
  const [periodPhase, setPeriodPhase] = useState<{ emoji: string; phase: string; color: string }>(getCachedPeriodPhase)
  const [upcomingAnniversary, setUpcomingAnniversary] = useState<{ name: string; days: number } | null>(getCachedUpcomingAnniversary)

  const {
    currentState: emotionState,
    saving: emotionSaving,
    error: emotionError,
    clearError: clearEmotionError,
  } = useCoupleEmotionState(identity)

  const loadAll = useCallback(async () => {
    const [meetingRes, periodRes, anniRes] = await Promise.allSettled([
      supabase.from('meeting_schedule').select('next_date').order('created_at', { ascending: false }).limit(1),
      supabase.from('period_logs').select('*').order('start_date', { ascending: false }).limit(5),
      supabase.from('anniversaries').select('*'),
    ])

    if (meetingRes.status === 'fulfilled' && meetingRes.value.data && meetingRes.value.data.length > 0) {
      const date = (meetingRes.value.data[0] as Record<string, string>).next_date
      setMeetingDate(date)
      localStorage.setItem('qinggan_meeting_date', date)
      setDaysUntil(daysUntilDate(date))
    } else {
      const stored = localStorage.getItem('qinggan_meeting_date')
      if (stored) {
        setMeetingDate(stored)
        setDaysUntil(daysUntilDate(stored))
      }
    }

    if (periodRes.status === 'fulfilled' && periodRes.value.data) {
      const data = periodRes.value.data as PeriodRecord[]
      setPeriodPhase(getPhaseInfo(data))
      writeCache('qinggan_cache_period', data)
    }

    if (anniRes.status === 'fulfilled' && anniRes.value.data && anniRes.value.data.length > 0) {
      const data = anniRes.value.data as Anniversary[]
      writeCache('qinggan_cache_anni', data)
      let closest: { name: string; days: number } | null = null
      for (const a of data) {
        const d = daysUntilNext(a.date)
        if (!closest || d < closest.days) closest = { name: a.name, days: d }
      }
      setUpcomingAnniversary(closest)
    }
  }, [])

  useEffect(() => { void Promise.resolve().then(loadAll) }, [loadAll])

  const homeBackgroundUrl = localStorage.getItem('qinggan_home_background_url') || ''
  const relationshipDays = daysSince(RELATIONSHIP_START_DATE)
  const meetupLabel = meetingDate && daysUntil !== null
    ? daysUntil > 0 ? String(daysUntil) : daysUntil === 0 ? '今天' : '已过'
    : '设置'
  const meetupNote = meetingDate && daysUntil !== null
    ? daysUntil > 0 ? `距离见面还有${daysUntil}天，可以悄悄准备一个小惊喜。` : daysUntil === 0 ? '就是今天，可以把拥抱准备好。' : '下一次见面，也值得好好期待。'
    : '记录下一次见面的日子，可以悄悄准备一个小惊喜。'
  const noteText = warmReminder || meetupNote

  useEffect(() => {
    if (!emotionError) return
    const timeoutId = window.setTimeout(() => {
      setToastType('error')
      setToast(emotionError)
      clearEmotionError()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [clearEmotionError, emotionError])

  useEffect(() => {
    if (!emotionBubble) return
    const timeoutId = window.setTimeout(() => {
      setEmotionBubble('')
    }, 2200)
    return () => window.clearTimeout(timeoutId)
  }, [emotionBubble])

  return (
    <div className="home-stitch-page relative h-full w-full max-w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {homeBackgroundUrl && (
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url("${homeBackgroundUrl}")` }}
          />
        )}
        <div className="home-dot-layer absolute inset-0" />
        <div className="home-bg-soft absolute inset-0" />
      </div>

      <div className="home-stitch-shell relative z-10 flex h-full min-h-0 w-full max-w-full flex-col">
        <section className="home-stitch-hero shrink-0">
          <button onClick={() => navigate('/meeting')} className="home-hero-copy ui-touch-target text-left">
            <p className="home-eyebrow">距离下次见面</p>
            <div className="home-count-line">
              <span className="home-count-number">{meetupLabel}</span>
              {meetingDate && daysUntil !== null && daysUntil > 0 && <span className="home-count-unit">天</span>}
            </div>
          </button>
          <button onClick={() => navigate('/anniversary')} className="home-relation-pill ui-touch-target" aria-label="查看恋爱纪念">
            <Heart size={13} fill="currentColor" />
            <span>相恋 {relationshipDays} 天</span>
          </button>
          <button onClick={() => navigate('/meeting')} className="home-hero-photo ui-touch-target" aria-label="查看见面计划" />
        </section>

        <div className="home-status-grid shrink-0">
          <button onClick={() => navigate('/anniversary')} className="home-status-card ui-touch-target text-left">
            <span className="home-status-icon bg-[#FFDFA8]/42 text-[#96472d]"><Cake size={18} /></span>
            <span className="min-w-0">
              <span className="home-status-title">纪念日</span>
              <span className="home-status-value ui-clamp-1">{upcomingAnniversary ? upcomingAnniversary.name : `相恋 ${relationshipDays} 天`}</span>
              <span className="home-status-desc ui-clamp-1">{upcomingAnniversary ? `还有 ${upcomingAnniversary.days} 天` : '每天都算数'}</span>
            </span>
          </button>

          <button onClick={() => navigate('/period')} className="home-status-card ui-touch-target text-left">
            <span className="home-status-icon bg-[#ffd9e2] text-[#9b3e60]"><Droplet size={18} /></span>
            <span className="min-w-0">
              <span className="home-status-title">月亮房温馨守护</span>
              <span className={`home-status-value ui-clamp-1 ${periodPhase.color}`}>{periodPhase.phase}</span>
              <span className="home-status-desc ui-clamp-1">温柔守护中</span>
            </span>
          </button>
        </div>

        <section className="home-note-card shrink-0">
          <span className="home-note-icon"><Mail size={18} /></span>
          <span className="min-w-0 flex-1">
            <span className="home-note-title">今日小纸条</span>
            <span className="home-note-text ui-clamp-2">“{noteText}”</span>
          </span>
        </section>

        <section className="home-emotion-card min-h-0 flex-1">
          <div className="home-emotion-title-row">
            <Heart size={18} fill="currentColor" />
            <h2>情绪修理站</h2>
          </div>
          <div className="home-emotion-list">
            {EMOTION_CATEGORIES.map(category => {
              const active = emotionState.category === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`home-emotion-button ui-touch-target ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => navigate(`/emotion/${category.id}`)}
                >
                  <span className="ui-clamp-1">{category.label}</span>
                  {active && <span className="home-emotion-badge">{emotionState.shortLabel}</span>}
                </button>
              )
            })}
          </div>
          <div className="home-emotion-status">
            <EmotionCharacterCard
              state={emotionState}
              saving={emotionSaving}
              bubbleText={emotionBubble}
              onOpenPicker={() => navigate(`/emotion/${emotionState.category}`)}
            />
          </div>
        </section>

        {toast && <Toast message={toast} type={toastType} onClose={() => setToast('')} />}
      </div>
    </div>
  )
}
