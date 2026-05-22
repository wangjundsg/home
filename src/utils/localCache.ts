interface CacheEnvelope<T> {
  data: T
  ts: number
}

const listeners = new Map<string, Set<(data: unknown) => void>>()

export function readCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as CacheEnvelope<T> | T
    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
      return (parsed as CacheEnvelope<T>).data
    }

    return parsed as T
  } catch {
    return fallback
  }
}

export function writeCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // Cache writes are best-effort; the cloud remains the source of truth.
  }

  listeners.get(key)?.forEach(listener => listener(data))
}

export function subscribeCache<T>(key: string, listener: (data: T) => void) {
  const bucket = listeners.get(key) ?? new Set<(data: unknown) => void>()
  const wrapped = listener as (data: unknown) => void
  bucket.add(wrapped)
  listeners.set(key, bucket)

  return () => {
    bucket.delete(wrapped)
    if (bucket.size === 0) listeners.delete(key)
  }
}

export function hasCache(key: string) {
  return localStorage.getItem(key) !== null
}
