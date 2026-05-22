export type PartnerActivityType = 'checkin' | 'diary' | 'interaction' | 'story'

export const notifyPartnerActivity = async (author: string | null, category: PartnerActivityType) => {
  if (!author) return

  try {
    await fetch('/api/push-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, category }),
    })
  } catch {
    // Push is best-effort and must not block saving user content.
  }
}
