import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { BookOpen, Gamepad2, LockKeyhole, ShieldCheck } from 'lucide-react'
import {
  acknowledgePrivateConsent,
  hasPrivateConsent,
  hasPrivatePasscode,
  isPrivateUnlocked,
  lockPrivateArea,
  setPrivatePasscode,
  unlockPrivateArea,
  verifyPrivatePasscode,
} from '../utils/interactAccess'

interface PrivateInteractionGatePageProps {
  navigate: (route: string) => void
}

const CONSENT_ITEMS = [
  '双方均为成年人。',
  '双方都清醒、理性，状态适合继续。',
  '任一方都可以随时暂停、跳过或停止。',
  '已经约定好停止词或停止手势。',
  '所有任务都不是必须完成的。',
  '道具安全、干净，并且使用起来舒适。',
]

export function PrivateInteractionGatePage({ navigate }: PrivateInteractionGatePageProps) {
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState('')
  const [hasPasscode, setHasPasscode] = useState(() => hasPrivatePasscode())
  const [unlocked, setUnlocked] = useState(() => isPrivateUnlocked())
  const [consentAcknowledged, setConsentAcknowledged] = useState(() => hasPrivateConsent())
  const [checkedItems, setCheckedItems] = useState<boolean[]>(() => CONSENT_ITEMS.map(() => false))
  const allConsentChecked = useMemo(() => checkedItems.every(Boolean), [checkedItems])

  const handlePasscodeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanPasscode = passcode.trim()
    if (!cleanPasscode) {
      setPasscodeError(hasPasscode ? '请输入本地私密密码。' : '请先设置一个本地私密密码。')
      return
    }

    if (!hasPasscode) {
      setPrivatePasscode(cleanPasscode)
      unlockPrivateArea()
      setHasPasscode(true)
      setUnlocked(true)
      setPasscode('')
      setPasscodeError('')
      return
    }

    if (!verifyPrivatePasscode(cleanPasscode)) {
      setPasscodeError('密码不正确，请再试一次。')
      return
    }

    unlockPrivateArea()
    setUnlocked(true)
    setPasscode('')
    setPasscodeError('')
  }

  const handleConsentToggle = (index: number) => {
    setCheckedItems(items => items.map((checked, itemIndex) => (itemIndex === index ? !checked : checked)))
  }

  const handleConsentConfirm = () => {
    if (!allConsentChecked) return

    acknowledgePrivateConsent()
    setConsentAcknowledged(true)
  }

  const handleLock = () => {
    lockPrivateArea()
    setUnlocked(false)
    setConsentAcknowledged(false)
    setCheckedItems(CONSENT_ITEMS.map(() => false))
  }

  if (!unlocked) {
    return (
      <div className="pixel-page flex min-h-full flex-col gap-4 px-4 pt-4 pb-8">
        <section className="pixel-card p-5">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
            <LockKeyhole size={22} />
          </span>
          <h2 className="mt-4 text-xl font-black text-text-primary">私密互动入口</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            这里使用本机密码做轻量隐私保护，只适合避免他人随手看到，不是强安全加密。
          </p>
        </section>

        <form onSubmit={handlePasscodeSubmit} className="pixel-card flex flex-col gap-3 p-5">
          <label htmlFor="private-passcode" className="text-sm font-black text-text-primary">
            {hasPasscode ? '输入本地私密密码' : '设置本地私密密码'}
          </label>
          <input
            id="private-passcode"
            value={passcode}
            onChange={event => {
              setPasscode(event.target.value)
              setPasscodeError('')
            }}
            type="password"
            autoComplete="current-password"
            className="min-h-[44px] rounded-2xl border border-warm-200 bg-white px-4 text-base font-semibold text-text-primary outline-none focus:border-warm-400"
            aria-describedby={passcodeError ? 'private-passcode-error' : undefined}
          />
          {passcodeError && (
            <p id="private-passcode-error" className="text-sm font-semibold text-red-500">
              {passcodeError}
            </p>
          )}
          <button
            type="submit"
            className="ui-touch-target min-h-[44px] rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white shadow-sm active:scale-[0.99]"
          >
            {hasPasscode ? '解锁私密入口' : '设置并进入'}
          </button>
        </form>
      </div>
    )
  }

  if (!consentAcknowledged) {
    return (
      <div className="pixel-page flex min-h-full flex-col gap-4 px-4 pt-4 pb-8">
        <section className="pixel-card p-5">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <ShieldCheck size={22} />
          </span>
          <h2 className="mt-4 text-xl font-black text-text-primary">进入前的安全确认</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            请两个人都确认下面的内容。这里不记录细节，只帮助你们把边界和舒适度放在第一位。
          </p>
        </section>

        <section className="pixel-card flex flex-col gap-2 p-4">
          {CONSENT_ITEMS.map((item, index) => (
            <label key={item} className="flex min-h-[44px] items-start gap-3 rounded-2xl px-2 py-3 text-sm font-semibold leading-relaxed text-text-secondary">
              <input
                type="checkbox"
                checked={checkedItems[index]}
                onChange={() => handleConsentToggle(index)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-warm-500"
              />
              <span>{item}</span>
            </label>
          ))}
        </section>

        <button
          type="button"
          onClick={handleConsentConfirm}
          disabled={!allConsentChecked}
          className="ui-touch-target min-h-[44px] rounded-2xl bg-warm-500 px-4 py-3 text-sm font-black text-white shadow-sm disabled:bg-warm-200 disabled:text-text-muted"
        >
          我们已确认，继续进入
        </button>
      </div>
    )
  }

  return (
    <div className="pixel-page flex min-h-full flex-col gap-4 px-4 pt-4 pb-8">
      <section className="pixel-hero shrink-0 p-5">
        <div className="relative z-10">
          <p className="text-xs font-semibold leading-[1.45] text-white/75">本地已解锁</p>
          <h2 className="mt-1 text-xl font-black leading-tight tracking-tight">私密互动中心</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">只展示入口，不在这里展开具体内容。需要时可以重新确认边界。</p>
        </div>
      </section>

      <button
        type="button"
        onClick={() => navigate('/interact/private/games')}
        className="pixel-card card-pressable ui-touch-target flex min-h-[96px] items-center gap-3 p-4 text-left"
      >
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
          <Gamepad2 size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-text-primary">私密游戏中心</span>
          <span className="mt-1 block text-sm leading-relaxed text-text-muted">进入前已完成本地密码和安全确认。</span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => navigate('/interact/materials')}
        className="pixel-card card-pressable ui-touch-target flex min-h-[96px] items-center gap-3 p-4 text-left"
      >
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warm-100 text-warm-600">
          <BookOpen size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-text-primary">互动素材库</span>
          <span className="mt-1 block text-sm leading-relaxed text-text-muted">按初级、中级、高级和最终阶段抽取线下互动素材。</span>
        </span>
      </button>

      <button
        type="button"
        onClick={handleLock}
        className="ui-touch-target min-h-[44px] rounded-2xl border border-warm-200 bg-white/80 px-4 py-3 text-sm font-black text-text-secondary"
      >
        锁定私密区
      </button>
    </div>
  )
}
