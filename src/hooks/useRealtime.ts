import { useEffect, useRef, useCallback, useId } from 'react'
import { supabase } from '../supabase'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

export type RealtimePayload<T = Record<string, unknown>> = {
  new: T | null
  old: T | null
  eventType: RealtimeEvent
  table: string
  schema: string
}

export function useRealtime<T extends Record<string, unknown>>(
  table: string,
  options: {
    event?: RealtimeEvent
    filter?: string
    enabled?: boolean
  } = {}
) {
  const { event = '*', filter, enabled = true } = options
  const listenersRef = useRef<Set<(payload: RealtimePayload<T>) => void>>(new Set())
  const channelId = useId()
  const channelName = `${table}-changes-${channelId.replace(/:/g, '')}`

  useEffect(() => {
    if (!enabled) return

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as never,
        { event, schema: 'public', table, filter },
        (payload: RealtimePayload<T>) => {
          listenersRef.current.forEach((cb) => cb(payload))
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [table, event, filter, enabled, channelName])

  const onChange = useCallback(
    (callback: (payload: RealtimePayload<T>) => void) => {
      listenersRef.current.add(callback)
      return () => {
        listenersRef.current.delete(callback)
      }
    },
    []
  )

  return { onChange }
}
