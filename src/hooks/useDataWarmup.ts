import { useEffect } from 'react'
import { supabase } from '../supabase'
import type { Identity } from './useIdentity'
import { writeCache } from '../utils/localCache'

export function useDataWarmup(identity: Identity) {
  useEffect(() => {
    if (!identity) return

    let cancelled = false

    const warmup = async () => {
      const [
        wishesRes,
        commitmentsRes,
        compensationsRes,
        reviewsRes,
        anniversariesRes,
        periodRes,
        intimacyRes,
        scoreLogsRes,
        scoreTotalRes,
        redemptionsRes,
        diaryRes,
      ] = await Promise.allSettled([
        supabase.from('wishes').select('*').order('created_at', { ascending: true }),
        supabase.from('commitments').select('*').order('created_at', { ascending: true }),
        supabase.from('compensations').select('*').order('created_at', { ascending: false }),
        supabase.from('conflict_reviews').select('*').order('record_date', { ascending: false }),
        supabase.from('anniversaries').select('*').order('date', { ascending: true }),
        supabase.from('period_logs').select('*').order('start_date', { ascending: false }),
        supabase.from('intimacy_logs').select('*').order('date', { ascending: false }),
        supabase.from('score_logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('score_logs').select('amount').eq('author', identity),
        supabase.from('reward_redemptions').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('shared_diaries').select('*').order('created_at', { ascending: false }).limit(30),
      ])

      if (cancelled) return

      if (wishesRes.status === 'fulfilled' && wishesRes.value.data) writeCache('qinggan_cache_wishes', wishesRes.value.data)
      if (commitmentsRes.status === 'fulfilled' && commitmentsRes.value.data) writeCache('qinggan_cache_commitments', commitmentsRes.value.data)
      if (compensationsRes.status === 'fulfilled' && compensationsRes.value.data) writeCache('qinggan_cache_compensations', compensationsRes.value.data)
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value.data) writeCache('qinggan_cache_conflict_reviews', reviewsRes.value.data)
      if (anniversariesRes.status === 'fulfilled' && anniversariesRes.value.data) writeCache('qinggan_cache_anni', anniversariesRes.value.data)
      if (periodRes.status === 'fulfilled' && periodRes.value.data) writeCache('qinggan_cache_period', periodRes.value.data)
      if (intimacyRes.status === 'fulfilled' && intimacyRes.value.data) writeCache('qinggan_cache_intimacy_logs', intimacyRes.value.data)
      if (scoreLogsRes.status === 'fulfilled' && scoreLogsRes.value.data) writeCache('qinggan_cache_score_logs', scoreLogsRes.value.data)
      if (scoreTotalRes.status === 'fulfilled' && scoreTotalRes.value.data) {
        const total = (scoreTotalRes.value.data as { amount: number }[]).reduce((sum, row) => sum + row.amount, 0)
        writeCache('qinggan_cache_score_total', total)
      }
      if (redemptionsRes.status === 'fulfilled' && redemptionsRes.value.data) writeCache('qinggan_cache_reward_redemptions', redemptionsRes.value.data)
      if (diaryRes.status === 'fulfilled' && diaryRes.value.data) writeCache('qinggan_cache_shared_diaries', diaryRes.value.data)
    }

    const timeoutId = window.setTimeout(() => void warmup(), 0)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [identity])
}
