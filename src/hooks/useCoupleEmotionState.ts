import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { supabase } from '../supabase'
import type { Identity } from './useIdentity'
import { DEFAULT_EMOTION_STATE_ID, getEmotionStateById } from '../data/emotion-character-states'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

type RealtimePayload<T = Record<string, unknown>> = {
  new: T | null
  old: T | null
  eventType: RealtimeEvent
  table: string
  schema: string
}

interface CoupleEmotionStateRecord {
  id: string
  state_id: string
  updated_by: string
  updated_at: string
}

const SHARED_EMOTION_ROW_ID = 'shared'
const FAILURE_MESSAGE = '这次没有同步成功，稍后再试一次。'

export function useCoupleEmotionState(identity: Identity) {
  const [currentStateId, setCurrentStateId] = useState(DEFAULT_EMOTION_STATE_ID)
  const [updatedBy, setUpdatedBy] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const channelId = useId().replace(/:/g, '')

  const applyRecord = useCallback((record: CoupleEmotionStateRecord | null | undefined) => {
    if (!record) {
      setCurrentStateId(DEFAULT_EMOTION_STATE_ID)
      setUpdatedBy('')
      setUpdatedAt('')
      return
    }

    const nextState = getEmotionStateById(record.state_id)
    setCurrentStateId(nextState.id)
    setUpdatedBy(record.updated_by || '')
    setUpdatedAt(record.updated_at || '')
  }, [])

  const load = useCallback(async () => {
    setLoading(true)

    try {
      const { data, error: loadError } = await supabase
        .from('couple_emotion_state')
        .select('id,state_id,updated_by,updated_at')
        .eq('id', SHARED_EMOTION_ROW_ID)
        .maybeSingle()

      if (loadError) {
        setError(FAILURE_MESSAGE)
        return false
      }

      applyRecord(data as CoupleEmotionStateRecord | null)
      setError('')
      return true
    } finally {
      setLoading(false)
    }
  }, [applyRecord])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  useEffect(() => {
    const channel = supabase
      .channel(`couple-emotion-state-${channelId}`)
      .on(
        'postgres_changes' as never,
        {
          event: '*',
          schema: 'public',
          table: 'couple_emotion_state',
          filter: `id=eq.${SHARED_EMOTION_ROW_ID}`,
        },
        (payload: RealtimePayload<CoupleEmotionStateRecord>) => {
          applyRecord(payload.eventType === 'DELETE' ? payload.old : payload.new)
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [applyRecord, channelId])

  const saveState = useCallback(
    async (nextStateId: string) => {
      const nextState = getEmotionStateById(nextStateId)
      const previousStateId = currentStateId
      const previousUpdatedBy = updatedBy
      const previousUpdatedAt = updatedAt
      const nextUpdatedAt = new Date().toISOString()
      const nextUpdatedBy = identity || ''

      setSaving(true)
      setError('')
      setCurrentStateId(nextState.id)
      setUpdatedBy(nextUpdatedBy)
      setUpdatedAt(nextUpdatedAt)

      try {
        const { data, error: saveError } = await supabase
          .from('couple_emotion_state')
          .upsert(
            {
              id: SHARED_EMOTION_ROW_ID,
              state_id: nextState.id,
              updated_by: nextUpdatedBy,
              updated_at: nextUpdatedAt,
            },
            { onConflict: 'id' }
          )
          .select('id,state_id,updated_by,updated_at')
          .maybeSingle()

        if (saveError) {
          setCurrentStateId(previousStateId)
          setUpdatedBy(previousUpdatedBy)
          setUpdatedAt(previousUpdatedAt)
          setError(FAILURE_MESSAGE)
          return false
        }

        applyRecord(
          (data as CoupleEmotionStateRecord | null) ?? {
            id: SHARED_EMOTION_ROW_ID,
            state_id: nextState.id,
            updated_by: nextUpdatedBy,
            updated_at: nextUpdatedAt,
          }
        )
        return true
      } catch {
        setCurrentStateId(previousStateId)
        setUpdatedBy(previousUpdatedBy)
        setUpdatedAt(previousUpdatedAt)
        setError(FAILURE_MESSAGE)
        return false
      } finally {
        setSaving(false)
      }
    },
    [applyRecord, currentStateId, identity, updatedAt, updatedBy]
  )

  const clearError = useCallback(() => setError(''), [])

  const currentState = useMemo(() => getEmotionStateById(currentStateId), [currentStateId])

  return {
    currentState,
    currentStateId,
    updatedBy,
    updatedAt,
    loading,
    saving,
    error,
    saveState,
    clearError,
    reload: load,
  }
}
