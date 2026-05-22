import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { Identity } from './useIdentity'

interface AnniversaryReminder {
  id: string
  name: string
  date: string
}

interface MeetingReminder {
  next_date: string
}

interface ReminderCandidate {
  type: 'meeting' | 'anniversary'
  days: number
  name?: string
}

const DAY_MS = 1000 * 60 * 60 * 24
const RELATIONSHIP_START_DATE = '2024-05-20'

const parseDateOnly = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const todayStart = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const daysUntilDate = (value: string) => {
  const target = parseDateOnly(value)
  return Math.ceil((target.getTime() - todayStart().getTime()) / DAY_MS)
}

const daysUntilAnnualDate = (value: string) => {
  const source = parseDateOnly(value)
  const today = todayStart()
  const target = new Date(today.getFullYear(), source.getMonth(), source.getDate())
  if (target < today) target.setFullYear(today.getFullYear() + 1)
  return Math.ceil((target.getTime() - today.getTime()) / DAY_MS)
}

const daysSince = (value: string) => {
  const start = parseDateOnly(value)
  return Math.max(1, Math.floor((todayStart().getTime() - start.getTime()) / DAY_MS) + 1)
}

const buildReminder = (candidate: ReminderCandidate | null, partnerName: string) => {
  const partner = partnerName || 'TA'

  if (candidate?.type === 'meeting') {
    if (candidate.days <= 0) return '今天就是见面日啦，记得把最好的心情留给彼此。'
    return `距离见面还有${candidate.days}天，可以偷偷准备一个让${partner}笑出来的小惊喜。`
  }

  if (candidate?.type === 'anniversary') {
    if (candidate.days <= 0) return `今天是「${candidate.name}」，小花园替你们把这份甜认真记住啦。`
    return `还有${candidate.days}天就是「${candidate.name}」，可以提前藏一点小浪漫。`
  }

  return `今天是你们在一起的第${daysSince(RELATIONSHIP_START_DATE)}天，又是值得被小花园悄悄盖章的一天。`
}

export function useWarmReminders(identity: Identity, partnerName: string) {
  const [reminder, setReminder] = useState('')

  useEffect(() => {
    if (!identity) return

    let cancelled = false

    const loadReminder = async () => {
      const [meetingRes, anniversaryRes] = await Promise.allSettled([
        supabase.from('meeting_schedule').select('next_date').order('created_at', { ascending: false }).limit(1),
        supabase.from('anniversaries').select('id,name,date'),
      ])

      if (cancelled) return

      const candidates: ReminderCandidate[] = []

      if (meetingRes.status === 'fulfilled' && meetingRes.value.data && meetingRes.value.data.length > 0) {
        const meeting = meetingRes.value.data[0] as MeetingReminder
        const days = daysUntilDate(meeting.next_date)
        if (days >= 0) candidates.push({ type: 'meeting', days })
      }

      if (anniversaryRes.status === 'fulfilled' && anniversaryRes.value.data) {
        for (const anniversary of anniversaryRes.value.data as AnniversaryReminder[]) {
          const days = daysUntilAnnualDate(anniversary.date)
          if (days >= 0) candidates.push({ type: 'anniversary', days, name: anniversary.name })
        }
      }

      candidates.sort((a, b) => a.days - b.days)
      setReminder(buildReminder(candidates[0] ?? null, partnerName))
    }

    void loadReminder()

    return () => {
      cancelled = true
    }
  }, [identity, partnerName])

  return { reminder }
}
