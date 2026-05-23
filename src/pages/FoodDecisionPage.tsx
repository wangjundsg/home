import { useMemo, useState } from 'react'
import { Check, Coffee, Cookie, RefreshCw, RotateCcw, Sparkles, Utensils } from 'lucide-react'
import type { FoodAddonItem, FoodDecisionItem, FoodTuningTag } from '../data/food-decisions'
import { FOOD_TUNING_LABELS } from '../data/food-decisions'
import {
  inferMealTime,
  readFoodHistory,
  recommendAddon,
  recommendFood,
  rememberFoodChoice,
  writeFoodHistory,
} from '../features/food-decision'
import { Toast } from '../components/ui'

type FoodStep = 'main' | 'addon' | 'final'

interface FoodDecisionPageProps {
  partnerName: string
}

const mealTimeCopy = {
  breakfast: '这个点适合吃点温和的',
  lunch: '午饭就别纠结了',
  dinner: '晚饭交给我来定',
  late: '夜宵要轻一点也要开心',
}

const tuningOptions: readonly FoodTuningTag[] = ['light', 'rich', 'no-spicy', 'budget']

export function FoodDecisionPage({ partnerName }: FoodDecisionPageProps) {
  const [history, setHistory] = useState(readFoodHistory)
  const [step, setStep] = useState<FoodStep>('main')
  const [tuningTags, setTuningTags] = useState<FoodTuningTag[]>([])
  const [rejectedMainIds, setRejectedMainIds] = useState<string[]>([])
  const [rejectedAddonIds, setRejectedAddonIds] = useState<string[]>([])
  const [mainChoice, setMainChoice] = useState<FoodDecisionItem>(() => recommendFood({ history }))
  const [addonChoice, setAddonChoice] = useState<FoodAddonItem | null>(null)
  const [toast, setToast] = useState('')
  const mealTime = useMemo(() => inferMealTime(), [])

  const drawMain = (nextTags = tuningTags, rejectedIds = rejectedMainIds) => {
    const next = recommendFood({
      mealTime,
      tuningTags: nextTags,
      rejectedIds,
      history,
    })
    setMainChoice(next)
    setStep('main')
    setAddonChoice(null)
    setRejectedAddonIds([])
  }

  const rejectMain = () => {
    const nextRejected = [...rejectedMainIds, mainChoice.id]
    setRejectedMainIds(nextRejected)
    drawMain(tuningTags, nextRejected)
  }

  const applyTuning = (tag: FoodTuningTag) => {
    const nextTags = tuningTags.includes(tag)
      ? tuningTags.filter(item => item !== tag)
      : [...tuningTags, tag]
    setTuningTags(nextTags)
    setRejectedMainIds([mainChoice.id])
    drawMain(nextTags, [mainChoice.id])
  }

  const confirmMain = () => {
    setStep('addon')
    setToast(`好，正餐先定 ${mainChoice.name}`)
  }

  const pickAddon = (kind: 'dessert' | 'drink' | 'any') => {
    const next = recommendAddon(mainChoice, kind, rejectedAddonIds)
    setAddonChoice(next)
    setStep('final')
  }

  const changeAddon = () => {
    if (!addonChoice) {
      pickAddon('any')
      return
    }
    const nextRejected = [...rejectedAddonIds, addonChoice.id]
    setRejectedAddonIds(nextRejected)
    setAddonChoice(recommendAddon(mainChoice, addonChoice.kind, nextRejected))
  }

  const skipAddon = () => {
    setAddonChoice(null)
    setStep('final')
  }

  const acceptDecision = () => {
    const acceptedAt = new Date().toISOString()
    let nextHistory = rememberFoodChoice(history, { id: mainChoice.id, type: 'main', acceptedAt })
    if (addonChoice) {
      nextHistory = rememberFoodChoice(nextHistory, { id: addonChoice.id, type: 'addon', acceptedAt })
    }
    setHistory(nextHistory)
    writeFoodHistory(nextHistory)
    setToast('已收下这个答案，今天就不纠结了')
  }

  const restart = () => {
    setStep('main')
    setTuningTags([])
    setRejectedMainIds([])
    setRejectedAddonIds([])
    setAddonChoice(null)
    setMainChoice(recommendFood({ mealTime, history }))
  }

  return (
    <div className="pixel-page flex min-h-full flex-col gap-3 px-4 pt-4 pb-8">
      <section className="pixel-hero shrink-0 p-5">
        <div className="relative z-10">
          <p className="text-xs font-semibold leading-[1.45] text-white/75">
            给你和{partnerName || 'TA'}的饭点答案
          </p>
          <h2 className="mt-1 text-xl font-black leading-tight tracking-tight">今天吃什么</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            {mealTimeCopy[mealTime]}。先定正餐，满意了再看要不要甜品或喝的。
          </p>
        </div>
      </section>

      <section className="pixel-note px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white text-warm-600">
            <Utensils size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black text-text-primary">先别想太多，我先给一个</p>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">
              不喜欢就换，想清淡、便宜或不辣，也可以直接点下面的小按钮。
            </p>
          </div>
        </div>
      </section>

      <section className="pixel-card overflow-hidden p-0">
        <div className="bg-warm-50/80 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-black text-warm-600">正餐推荐</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-text-muted">
              {mainChoice.priceLevel === 1 ? '省心价' : mainChoice.priceLevel === 2 ? '正常吃' : '犒劳一下'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-warm-100 text-4xl">
              {mainChoice.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-black leading-tight text-text-primary">{mainChoice.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{mainChoice.reason}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {mainChoice.flavorTags.slice(0, 4).map(tag => (
              <span key={tag} className="pixel-tag">{tag}</span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={rejectMain}
              className="ui-touch-target inline-flex items-center justify-center gap-2 rounded-2xl border border-warm-200 bg-white px-3 py-3 text-sm font-black text-text-secondary active:scale-[0.99]"
            >
              <RefreshCw size={16} />
              换一个
            </button>
            <button
              type="button"
              onClick={confirmMain}
              className="ui-touch-target inline-flex items-center justify-center gap-2 rounded-2xl bg-warm-500 px-3 py-3 text-sm font-black text-white shadow-[0_10px_18px_rgba(232,115,74,0.16)] active:scale-[0.99]"
            >
              <Check size={16} />
              就这个
            </button>
          </div>
        </div>
      </section>

      {step === 'main' && (
        <section className="grid grid-cols-4 gap-2">
          {tuningOptions.map(tag => {
            const active = tuningTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => applyTuning(tag)}
                className={`ui-touch-target rounded-2xl px-2 py-2 text-xs font-black active:scale-[0.99] ${
                  active
                    ? 'bg-warm-500 text-white shadow-[0_8px_14px_rgba(232,115,74,0.16)]'
                    : 'border border-warm-100 bg-white/80 text-text-secondary'
                }`}
              >
                {FOOD_TUNING_LABELS[tag]}
              </button>
            )
          })}
        </section>
      )}

      {step === 'addon' && (
        <section className="pixel-card p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="text-base font-black text-text-primary">要不要配点什么？</h3>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                正餐已经定了，下面只是锦上添花。
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => pickAddon('dessert')}
              className="ui-touch-target inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-50 px-3 py-3 text-sm font-black text-pink-600 active:scale-[0.99]"
            >
              <Cookie size={16} />
              来点甜品
            </button>
            <button
              type="button"
              onClick={() => pickAddon('drink')}
              className="ui-touch-target inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-3 py-3 text-sm font-black text-blue-600 active:scale-[0.99]"
            >
              <Coffee size={16} />
              来杯喝的
            </button>
            <button
              type="button"
              onClick={() => pickAddon('any')}
              className="ui-touch-target rounded-2xl bg-warm-100 px-3 py-3 text-sm font-black text-warm-600 active:scale-[0.99]"
            >
              随便配一个
            </button>
            <button
              type="button"
              onClick={skipAddon}
              className="ui-touch-target rounded-2xl border border-warm-200 bg-white px-3 py-3 text-sm font-black text-text-secondary active:scale-[0.99]"
            >
              不要了
            </button>
          </div>
        </section>
      )}

      {step === 'final' && (
        <section className="pixel-card p-4">
          <p className="text-xs font-black text-warm-600">最终答案</p>
          <h3 className="mt-2 text-xl font-black leading-tight text-text-primary">
            今天就吃 {mainChoice.name}
            {addonChoice ? ` + ${addonChoice.name}` : ''}
          </h3>
          {addonChoice && (
            <div className="mt-4 rounded-2xl bg-warm-50 p-3">
              <p className="text-sm font-black text-text-primary">
                {addonChoice.emoji} {addonChoice.name}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">{addonChoice.reason}</p>
            </div>
          )}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={restart}
              className="ui-touch-target inline-flex items-center justify-center gap-2 rounded-2xl border border-warm-200 bg-white px-3 py-3 text-sm font-black text-text-secondary active:scale-[0.99]"
            >
              <RotateCcw size={16} />
              重新来
            </button>
            <button
              type="button"
              onClick={addonChoice ? changeAddon : () => setStep('addon')}
              className="ui-touch-target rounded-2xl bg-warm-100 px-3 py-3 text-sm font-black text-warm-600 active:scale-[0.99]"
            >
              {addonChoice ? '换配餐' : '加个配餐'}
            </button>
            <button
              type="button"
              onClick={acceptDecision}
              className="ui-touch-target col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-warm-500 px-3 py-3 text-sm font-black text-white shadow-[0_10px_18px_rgba(232,115,74,0.16)] active:scale-[0.99]"
            >
              <Check size={16} />
              收下这个答案
            </button>
          </div>
        </section>
      )}

      {toast && <Toast message={toast} type="info" onClose={() => setToast('')} />}
    </div>
  )
}
