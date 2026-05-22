import { useState } from 'react'
import type { Identity } from './useIdentity'
import { supabase } from '../supabase'

const V1_KEY = 'relationshipTool'

interface V1Data {
  partners?: {
    personA?: { name?: string; commitments?: { id: string; text: string; active?: boolean }[] }
    personB?: { name?: string; commitments?: { id: string; text: string; active?: boolean }[] }
  }
  checkins?: { date: string; dailySignal?: { done?: boolean; note?: string }; deepVideo?: { done?: boolean } }[]
  safeWord?: { phrase?: string; meaning?: string }
  meeting?: { nextDate?: string; wishlist?: { id: string; text: string; fulfilled?: boolean }[] }
  compensations?: { id: string; date: string; violator: string; recorder: string; violation: string; level: string; compensation: string; compensationDone?: boolean; acknowledged?: boolean }[]
  onboardingComplete?: boolean
}

export function useMigration(identity: Identity) {
  const [hasV1Data, setHasV1Data] = useState(() => Boolean(identity && detectV1Data()))
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const [migratedCount, setMigratedCount] = useState(0)

  const migrate = async () => {
    if (!identity) return
    setMigrating(true)

    const stored = localStorage.getItem(V1_KEY)
    if (!stored) { setMigrating(false); return }

    let data: V1Data
    try {
      data = JSON.parse(stored)
    } catch { setMigrating(false); return }

    let count = 0

    // Migrate checkins
    if (data.checkins) {
      for (const c of data.checkins) {
        const items: string[] = []
        if (c.dailySignal?.done) items.push('v1_dailySignal')
        if (c.deepVideo?.done) items.push('v1_deepVideo')

        if (items.length > 0) {
          const { error } = await supabase.from('checkins').upsert({
            author: identity,
            date: c.date,
            items,
            daily_score: items.length,
            redline_clear: false,
            starter_used: false,
          }, { onConflict: 'author,date' })
          if (!error) count++
        }
      }
    }

    // Migrate compensations
    if (data.compensations) {
      for (const comp of data.compensations) {
        const { error } = await supabase.from('compensations').upsert({
          id: comp.id,
          author: comp.violator,
          date: comp.date,
          violator: comp.violator,
          recorder: comp.recorder,
          violation: comp.violation,
          level: comp.level,
          compensation: comp.compensation,
          compensation_done: comp.compensationDone || false,
          acknowledged: comp.acknowledged || false,
        }, { onConflict: 'id' })
        if (!error) count++
      }
    }

    // Migrate meeting date
    if (data.meeting?.nextDate) {
      localStorage.setItem('qinggan_meeting_date', data.meeting.nextDate)
    }

    // Backup V1 data and mark as migrated
    localStorage.setItem(`${V1_KEY}_backup`, stored)
    localStorage.setItem('qinggan_v1_migrated', 'true')

    setMigratedCount(count)
    setMigrated(true)
    setHasV1Data(false)
    setMigrating(false)
  }

  const skip = () => {
    setHasV1Data(false)
    localStorage.setItem('qinggan_v1_migrated', 'true')
  }

  return { hasV1Data, migrating, migrated, migratedCount, migrate, skip }
}

function detectV1Data() {
  const stored = localStorage.getItem(V1_KEY)
  if (!stored) return false

  try {
    const data = JSON.parse(stored) as V1Data
    return Boolean(data.onboardingComplete || data.checkins?.length || data.compensations?.length)
  } catch {
    return false
  }
}
