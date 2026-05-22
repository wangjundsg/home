const PRIVATE_PASSCODE_KEY = 'qinggan_interact_private_passcode'
const PRIVATE_UNLOCKED_KEY = 'qinggan_interact_private_unlocked'
const PRIVATE_CONSENT_ACK_KEY = 'qinggan_interact_private_consent_ack'

let privateUnlocked = false
let privateConsentAcknowledged = false

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const readLocalValue = (key: string) => {
  if (!canUseLocalStorage()) return null

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeLocalValue = (key: string, value: string) => {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Local privacy state is best-effort only.
  }
}

const removeLocalValue = (key: string) => {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Local privacy state is best-effort only.
  }
}

export function hasPrivatePasscode() {
  return Boolean(readLocalValue(PRIVATE_PASSCODE_KEY))
}

export function setPrivatePasscode(passcode: string) {
  writeLocalValue(PRIVATE_PASSCODE_KEY, passcode)
}

export function verifyPrivatePasscode(passcode: string) {
  return readLocalValue(PRIVATE_PASSCODE_KEY) === passcode
}

export function isPrivateUnlocked() {
  return privateUnlocked
}

export function unlockPrivateArea() {
  privateUnlocked = true
  writeLocalValue(PRIVATE_UNLOCKED_KEY, 'session-only')
}

export function lockPrivateArea() {
  privateUnlocked = false
  privateConsentAcknowledged = false
  removeLocalValue(PRIVATE_UNLOCKED_KEY)
  removeLocalValue(PRIVATE_CONSENT_ACK_KEY)
}

export function hasPrivateConsent() {
  return privateUnlocked && privateConsentAcknowledged
}

export function acknowledgePrivateConsent() {
  if (!privateUnlocked) return

  privateConsentAcknowledged = true
  writeLocalValue(PRIVATE_CONSENT_ACK_KEY, 'session-only')
}

export function resetPrivateConsent() {
  privateConsentAcknowledged = false
  removeLocalValue(PRIVATE_CONSENT_ACK_KEY)
}
