import { useState, useEffect, useCallback } from 'react'

const IDENTITY_KEY = 'qinggan_identity'
const PARTNER_KEY = 'qinggan_partner_name'

export type Identity = string | null

export function useIdentity() {
  const [identity, setIdentityState] = useState<string | null>(null)
  const [partnerName, setPartnerNameState] = useState<string>('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(IDENTITY_KEY)
    const storedPartner = localStorage.getItem(PARTNER_KEY)
    if (stored) setIdentityState(stored)
    if (storedPartner) setPartnerNameState(storedPartner)
    setReady(true)
  }, [])

  const setIdentity = useCallback((who: string) => {
    localStorage.setItem(IDENTITY_KEY, who)
    setIdentityState(who)
  }, [])

  const setPartnerName = useCallback((name: string) => {
    localStorage.setItem(PARTNER_KEY, name)
    setPartnerNameState(name)
  }, [])

  const clearIdentity = useCallback(() => {
    localStorage.removeItem(IDENTITY_KEY)
    localStorage.removeItem(PARTNER_KEY)
    setIdentityState(null)
    setPartnerNameState('')
  }, [])

  return { identity, partnerName, setIdentity, setPartnerName, clearIdentity, ready }
}
