# Emotion Pixel Character V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V1 emotion pixel character flow on the Home page: shared couple emotion state, category preview without saving, exact-state selection through a bottom sheet, and Supabase-backed synchronization.

**Architecture:** Keep the approved Home layout and replace only the internals of the emotion repair station. Store the 24-state atlas in a data module, isolate Supabase read/write/realtime logic in a hook, render the character and state picker through two focused components, and add a small Supabase singleton table for the current shared state. V1 uses a CSS/text pixel placeholder and deliberately defers animated characters to a later phase.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4 plus `src/styles/index.css`, Supabase JS client, existing custom state-based routing.

---

## Compatibility Notes

- The project directory is currently not a git repository. Do not run `git commit`, `git reset`, or worktree commands for this implementation unless the user explicitly initializes git first.
- There is no test runner and no `npm test` script. Validation uses targeted ESLint, `npm run build`, and mobile browser manual testing.
- Run commands from `C:/Users/weirenminfuwu/Desktop/小程序/qinggan-weihu-v2`.
- Vite build may show existing non-blocking warnings about large chunks or PWA config. Treat TypeScript errors, ESLint errors in touched files, runtime console errors, and layout overflow as blockers.
- Dynamic character animation is not in V1 scope. Do not add sprite sheets, APNG/WebP animation, or interactive animation systems in this plan.

## File Structure

Create:

- `supabase/migrations_v5.4.sql` — singleton table for the shared couple emotion state.
- `src/data/emotion-character-states.ts` — 24-state atlas, category metadata, and lookup helpers.
- `src/hooks/useCoupleEmotionState.ts` — load/save/realtime hook for the shared state.
- `src/components/emotion/EmotionCharacterCard.tsx` — current state display and tap target that opens the picker.
- `src/components/emotion/EmotionStateSheet.tsx` — bottom sheet for exact state selection.

Modify:

- `src/pages/HomePage.tsx` — replace the existing three-button emotion status block with category preview + character card + sheet integration.
- `src/styles/index.css` — add emotion character card, placeholder, category buttons, bottom sheet, and compact responsive styles.

Do not modify:

- `src/components/ui/BottomNav.tsx`
- `src/pages/CoupleSpacePage.tsx`
- `src/pages/InteractPage.tsx`
- Any interaction game pages.

---

### Task 1: Add Supabase schema for the current shared emotion state

**Files:**
- Create: `supabase/migrations_v5.4.sql`

- [ ] **Step 1: Create the migration SQL file**

Create `supabase/migrations_v5.4.sql` with exactly this content:

```sql
-- V5.4 Migration: Shared couple emotion state

CREATE TABLE IF NOT EXISTS couple_emotion_state (
  id TEXT PRIMARY KEY DEFAULT 'shared',
  state_id TEXT NOT NULL DEFAULT 'calm',
  updated_by TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT couple_emotion_state_singleton CHECK (id = 'shared')
);

INSERT INTO couple_emotion_state (id, state_id, updated_by)
VALUES ('shared', 'calm', 'system')
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE couple_emotion_state;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;
```

- [ ] **Step 2: Apply the SQL in Supabase**

Open the Supabase SQL editor for this project and run the full contents of `supabase/migrations_v5.4.sql`.

Expected: the SQL succeeds. If `supabase_realtime` publication is not available in the hosted project, the `undefined_object` exception is ignored and the table still exists for normal read/write synchronization.

- [ ] **Step 3: Verify the table exists manually**

In Supabase Table Editor or SQL editor, verify `couple_emotion_state` has one row:

```sql
SELECT id, state_id, updated_by, updated_at
FROM couple_emotion_state
WHERE id = 'shared';
```

Expected row shape:

```text
id      state_id  updated_by  updated_at
shared  calm      system      <timestamp>
```

- [ ] **Step 4: Run scoped validation**

Run:

```bash
npm run build
```

Expected: build completes. No frontend code has changed yet, so any failure here is pre-existing and should be reported before continuing.

---

### Task 2: Add the 24-state emotion atlas and lookup helpers

**Files:**
- Create: `src/data/emotion-character-states.ts`

- [ ] **Step 1: Create the state atlas file**

Create `src/data/emotion-character-states.ts` with exactly this content:

```ts
export type EmotionCategoryId = 'good' | 'sweet' | 'cloudy'

export interface EmotionCategory {
  id: EmotionCategoryId
  label: string
  shortLabel: string
  description: string
}

export interface EmotionCharacterState {
  id: string
  category: EmotionCategoryId
  label: string
  shortLabel: string
  description: string
  placeholder: string
}

export const DEFAULT_EMOTION_STATE_ID = 'calm'

export const EMOTION_CATEGORIES: EmotionCategory[] = [
  {
    id: 'good',
    label: '我们都好',
    shortLabel: '都好',
    description: '风平浪静的一天，关系稳稳地亮着小灯。',
  },
  {
    id: 'sweet',
    label: '我们的小确幸',
    shortLabel: '小确幸',
    description: '把今天甜甜的瞬间存进小花园。',
  },
  {
    id: 'cloudy',
    label: '心里有个小乌云',
    shortLabel: '小乌云',
    description: '先接住情绪，再慢慢把话说清楚。',
  },
]

export const EMOTION_CHARACTER_STATES: EmotionCharacterState[] = [
  {
    id: 'calm',
    category: 'good',
    label: '平静待机',
    shortLabel: '平静',
    description: '今天的我们平平稳稳，也是一种很安心的甜。',
    placeholder: 'calm',
  },
  {
    id: 'thinking',
    category: 'good',
    label: '思考中',
    shortLabel: '思考',
    description: '现在可以安静想一想，不急着马上给答案。',
    placeholder: 'thinking',
  },
  {
    id: 'sleeping',
    category: 'good',
    label: '睡觉睡觉',
    shortLabel: '睡觉',
    description: '今天先好好休息，爱也需要充满电。',
    placeholder: 'sleeping',
  },
  {
    id: 'studying',
    category: 'good',
    label: '一起学习',
    shortLabel: '学习',
    description: '各自努力的时候，也是在一起往前走。',
    placeholder: 'studying',
  },
  {
    id: 'movie',
    category: 'good',
    label: '看电影',
    shortLabel: '电影',
    description: '一起放松一下，把今天调成柔软频道。',
    placeholder: 'movie',
  },
  {
    id: 'travel',
    category: 'good',
    label: '一起旅行',
    shortLabel: '旅行',
    description: '把期待放进行李箱，下一站还是我们。',
    placeholder: 'travel',
  },
  {
    id: 'holding_hands',
    category: 'sweet',
    label: '牵手',
    shortLabel: '牵手',
    description: '牵一下手，很多话就不用急着说完。',
    placeholder: 'holding-hands',
  },
  {
    id: 'hug',
    category: 'sweet',
    label: '拥抱',
    shortLabel: '拥抱',
    description: '今天想靠近一点，让拥抱替我们充电。',
    placeholder: 'hug',
  },
  {
    id: 'kiss',
    category: 'sweet',
    label: '亲亲',
    shortLabel: '亲亲',
    description: '亲亲一下，把甜度悄悄加满。',
    placeholder: 'kiss',
  },
  {
    id: 'cuddle',
    category: 'sweet',
    label: '甜蜜依偎',
    shortLabel: '依偎',
    description: '想贴近你，像小猫靠在暖暖的枕头上。',
    placeholder: 'cuddle',
  },
  {
    id: 'head_pat',
    category: 'sweet',
    label: '摸头杀',
    shortLabel: '摸头',
    description: '被温柔照顾一下，心就会软下来。',
    placeholder: 'head-pat',
  },
  {
    id: 'happy_jump',
    category: 'sweet',
    label: '开心跳跃',
    shortLabel: '开心',
    description: '今天有好开心的事，想第一时间告诉你。',
    placeholder: 'happy-jump',
  },
  {
    id: 'blush',
    category: 'sweet',
    label: '害羞脸红',
    shortLabel: '害羞',
    description: '被你说中了心事，脸红也要装作没事。',
    placeholder: 'blush',
  },
  {
    id: 'miss_you',
    category: 'sweet',
    label: '想你中',
    shortLabel: '想你',
    description: '今天的想念冒出来了，想让你知道。',
    placeholder: 'miss-you',
  },
  {
    id: 'angry',
    category: 'cloudy',
    label: '生气',
    shortLabel: '生气',
    description: '现在有火气，先别互相刺伤，慢慢来。',
    placeholder: 'angry',
  },
  {
    id: 'wronged',
    category: 'cloudy',
    label: '小委屈',
    shortLabel: '委屈',
    description: '不是想吵，只是希望这份难过能被看见。',
    placeholder: 'wronged',
  },
  {
    id: 'arguing',
    category: 'cloudy',
    label: '吵架中',
    shortLabel: '吵架',
    description: '先暂停攻击，我们是在解决问题，不是在打败彼此。',
    placeholder: 'arguing',
  },
  {
    id: 'cooling_down',
    category: 'cloudy',
    label: '冷静中',
    shortLabel: '冷静',
    description: '先给情绪一点空间，等心软一点再说。',
    placeholder: 'cooling-down',
  },
  {
    id: 'apologizing',
    category: 'cloudy',
    label: '道歉中',
    shortLabel: '道歉',
    description: '愿意低头修复的人，也是在认真守护我们。',
    placeholder: 'apologizing',
  },
  {
    id: 'comforting',
    category: 'cloudy',
    label: '安慰中',
    shortLabel: '安慰',
    description: '先抱抱情绪，再把误会一块一块拆开。',
    placeholder: 'comforting',
  },
  {
    id: 'need_hug',
    category: 'cloudy',
    label: '想被抱抱',
    shortLabel: '抱抱',
    description: '现在不一定需要道理，可能只是很需要一个抱抱。',
    placeholder: 'need-hug',
  },
  {
    id: 'low_battery',
    category: 'cloudy',
    label: '难过掉电',
    shortLabel: '掉电',
    description: '能量有点低，今天请对彼此更轻一点。',
    placeholder: 'low-battery',
  },
  {
    id: 'jealous',
    category: 'cloudy',
    label: '吃醋中',
    shortLabel: '吃醋',
    description: '醋意背后也许是想被坚定选择。',
    placeholder: 'jealous',
  },
  {
    id: 'insecure',
    category: 'cloudy',
    label: '不安害怕',
    shortLabel: '不安',
    description: '给彼此一点确认感，让心慢慢落地。',
    placeholder: 'insecure',
  },
]

export function getEmotionStateById(stateId: string | null | undefined) {
  return EMOTION_CHARACTER_STATES.find(state => state.id === stateId) ?? getDefaultEmotionState()
}

export function getDefaultEmotionState() {
  const state = EMOTION_CHARACTER_STATES.find(item => item.id === DEFAULT_EMOTION_STATE_ID)
  if (!state) throw new Error('Default emotion state is missing')
  return state
}

export function getEmotionStatesByCategory(category: EmotionCategoryId) {
  return EMOTION_CHARACTER_STATES.filter(state => state.category === category)
}

export function getEmotionCategoryById(category: EmotionCategoryId) {
  return EMOTION_CATEGORIES.find(item => item.id === category) ?? EMOTION_CATEGORIES[0]
}
```

- [ ] **Step 2: Run targeted lint for the new data file**

Run:

```bash
npx eslint src/data/emotion-character-states.ts
```

Expected: no ESLint errors.

- [ ] **Step 3: Run TypeScript build check**

Run:

```bash
npm run build
```

Expected: TypeScript compiles. Existing Vite/PWA warnings are allowed.

---

### Task 3: Add the Supabase hook for load, save, and realtime sync

**Files:**
- Create: `src/hooks/useCoupleEmotionState.ts`

- [ ] **Step 1: Create the hook file**

Create `src/hooks/useCoupleEmotionState.ts` with exactly this content:

```ts
import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase'
import type { Identity } from './useIdentity'
import { DEFAULT_EMOTION_STATE_ID, getEmotionStateById } from '../data/emotion-character-states'

interface CoupleEmotionStateRecord {
  id: string
  state_id: string
  updated_by: string
  updated_at: string
}

const SHARED_EMOTION_ROW_ID = 'shared'
const FAILURE_MESSAGE = '这次没有同步成功，稍后再试一次。'

export function useCoupleEmotionState(identity: Identity) {
  const [currentStateId, setCurrentStateIdState] = useState(DEFAULT_EMOTION_STATE_ID)
  const [updatedBy, setUpdatedBy] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const applyRecord = useCallback((record: Partial<CoupleEmotionStateRecord> | null | undefined) => {
    if (!record?.state_id) return
    const nextState = getEmotionStateById(record.state_id)
    setCurrentStateIdState(nextState.id)
    setUpdatedBy(record.updated_by || '')
    setUpdatedAt(record.updated_at || '')
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: loadError } = await supabase
      .from('couple_emotion_state')
      .select('id,state_id,updated_by,updated_at')
      .eq('id', SHARED_EMOTION_ROW_ID)
      .maybeSingle()

    if (loadError) {
      setError(FAILURE_MESSAGE)
      setLoading(false)
      return
    }

    applyRecord(data as CoupleEmotionStateRecord | null)
    setLoading(false)
  }, [applyRecord])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  useEffect(() => {
    const channel = supabase
      .channel('couple-emotion-state-shared')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'couple_emotion_state',
          filter: `id=eq.${SHARED_EMOTION_ROW_ID}`,
        },
        payload => {
          applyRecord(payload.new as CoupleEmotionStateRecord)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [applyRecord])

  const saveState = useCallback(async (nextStateId: string) => {
    const nextState = getEmotionStateById(nextStateId)
    const previousStateId = currentStateId
    const nextUpdatedAt = new Date().toISOString()

    setSaving(true)
    setError('')
    setCurrentStateIdState(nextState.id)
    setUpdatedBy(identity || '')
    setUpdatedAt(nextUpdatedAt)

    const { data, error: saveError } = await supabase
      .from('couple_emotion_state')
      .upsert(
        {
          id: SHARED_EMOTION_ROW_ID,
          state_id: nextState.id,
          updated_by: identity || '',
          updated_at: nextUpdatedAt,
        },
        { onConflict: 'id' },
      )
      .select('id,state_id,updated_by,updated_at')
      .maybeSingle()

    setSaving(false)

    if (saveError) {
      setError(FAILURE_MESSAGE)
      setCurrentStateIdState(previousStateId)
      return false
    }

    applyRecord(data as CoupleEmotionStateRecord | null)
    return true
  }, [applyRecord, currentStateId, identity])

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
```

- [ ] **Step 2: Run targeted lint for the hook**

Run:

```bash
npx eslint src/hooks/useCoupleEmotionState.ts
```

Expected: no ESLint errors.

- [ ] **Step 3: Run TypeScript build check**

Run:

```bash
npm run build
```

Expected: TypeScript compiles. Existing Vite/PWA warnings are allowed.

---

### Task 4: Add the emotion character card component

**Files:**
- Create: `src/components/emotion/EmotionCharacterCard.tsx`

- [ ] **Step 1: Create the component file**

Create `src/components/emotion/EmotionCharacterCard.tsx` with exactly this content:

```tsx
import { Sparkles } from 'lucide-react'
import type { EmotionCharacterState } from '../../data/emotion-character-states'

interface EmotionCharacterCardProps {
  state: EmotionCharacterState
  saving: boolean
  onOpenPicker: () => void
}

export function EmotionCharacterCard({ state, saving, onOpenPicker }: EmotionCharacterCardProps) {
  return (
    <button
      type="button"
      className={`emotion-character-card ui-touch-target ${saving ? 'is-saving' : ''}`}
      onClick={onOpenPicker}
      aria-label={`当前情绪小人状态：${state.label}，点击选择更准确的状态`}
    >
      <span className={`emotion-character-stage emotion-character-stage-${state.category}`}>
        <span className={`emotion-pixel-couple emotion-pixel-couple-${state.placeholder}`} aria-hidden="true">
          <span className="emotion-pixel-person emotion-pixel-person-left" />
          <span className="emotion-pixel-person emotion-pixel-person-right" />
        </span>
      </span>
      <span className="emotion-character-copy">
        <span className="emotion-character-kicker">
          <Sparkles size={13} />
          当前小人
        </span>
        <span className="emotion-character-title">{state.label}</span>
        <span className="emotion-character-desc">{state.description}</span>
        <span className="emotion-character-hint">点击小人，选择更准确的状态</span>
      </span>
      {saving && <span className="emotion-character-saving">同步中</span>}
    </button>
  )
}
```

- [ ] **Step 2: Run targeted lint for the component**

Run:

```bash
npx eslint src/components/emotion/EmotionCharacterCard.tsx
```

Expected: no ESLint errors.

- [ ] **Step 3: Run TypeScript build check**

Run:

```bash
npm run build
```

Expected: TypeScript compiles. Existing Vite/PWA warnings are allowed.

---

### Task 5: Add the bottom sheet exact-state picker

**Files:**
- Create: `src/components/emotion/EmotionStateSheet.tsx`

- [ ] **Step 1: Create the bottom sheet component**

Create `src/components/emotion/EmotionStateSheet.tsx` with exactly this content:

```tsx
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import {
  EMOTION_CATEGORIES,
  getEmotionStatesByCategory,
  type EmotionCategoryId,
} from '../../data/emotion-character-states'

interface EmotionStateSheetProps {
  open: boolean
  selectedCategory: EmotionCategoryId
  currentStateId: string
  saving: boolean
  onCategoryChange: (category: EmotionCategoryId) => void
  onSelectState: (stateId: string) => void
  onClose: () => void
}

export function EmotionStateSheet({
  open,
  selectedCategory,
  currentStateId,
  saving,
  onCategoryChange,
  onSelectState,
  onClose,
}: EmotionStateSheetProps) {
  if (!open) return null

  const states = getEmotionStatesByCategory(selectedCategory)

  return createPortal(
    <div className="emotion-sheet-backdrop" onClick={onClose}>
      <section className="emotion-sheet" onClick={event => event.stopPropagation()} aria-label="选择情绪小人状态">
        <div className="emotion-sheet-handle" />
        <div className="emotion-sheet-head">
          <div>
            <p className="emotion-sheet-eyebrow">选择真实状态</p>
            <h3>今天的小人是什么样？</h3>
          </div>
          <button type="button" className="emotion-sheet-close ui-touch-target" onClick={onClose} aria-label="关闭情绪选择">
            <X size={18} />
          </button>
        </div>

        <div className="emotion-sheet-tabs" role="tablist" aria-label="情绪分类">
          {EMOTION_CATEGORIES.map(category => (
            <button
              key={category.id}
              type="button"
              className={`emotion-sheet-tab ui-touch-target ${selectedCategory === category.id ? 'is-active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.shortLabel}
            </button>
          ))}
        </div>

        <div className="emotion-sheet-grid">
          {states.map(state => {
            const active = currentStateId === state.id
            return (
              <button
                key={state.id}
                type="button"
                className={`emotion-state-option ui-touch-target ${active ? 'is-active' : ''}`}
                disabled={saving}
                onClick={() => onSelectState(state.id)}
              >
                <span className={`emotion-state-option-dot emotion-state-option-dot-${state.category}`} />
                <span>{state.shortLabel}</span>
              </button>
            )
          })}
        </div>
      </section>
    </div>,
    document.body,
  )
}
```

- [ ] **Step 2: Run targeted lint for the sheet**

Run:

```bash
npx eslint src/components/emotion/EmotionStateSheet.tsx
```

Expected: no ESLint errors.

- [ ] **Step 3: Run TypeScript build check**

Run:

```bash
npm run build
```

Expected: TypeScript compiles. Existing Vite/PWA warnings are allowed.

---

### Task 6: Integrate the character flow into HomePage without changing the approved outer layout

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Update imports**

In `src/pages/HomePage.tsx`, replace the current imports at the top:

```tsx
import { useState, useEffect, useCallback } from 'react'
import { Cake, Cloud, Droplet, Heart, Mail, Smile } from 'lucide-react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { Toast } from '../components/ui'
```

with:

```tsx
import { useState, useEffect, useCallback } from 'react'
import { Cake, Droplet, Heart, Mail } from 'lucide-react'
import { supabase } from '../supabase'
import type { Identity } from '../hooks/useIdentity'
import { Toast } from '../components/ui'
import { EmotionCharacterCard } from '../components/emotion/EmotionCharacterCard'
import { EmotionStateSheet } from '../components/emotion/EmotionStateSheet'
import { useCoupleEmotionState } from '../hooks/useCoupleEmotionState'
import { EMOTION_CATEGORIES, type EmotionCategoryId } from '../data/emotion-character-states'
```

- [ ] **Step 2: Remove the old tab type**

Remove this line:

```ts
type TabState = 'angry' | 'taAngry' | 'good'
```

- [ ] **Step 3: Replace the old tab state inside `HomePage`**

Inside `HomePage`, replace:

```tsx
const [tab, setTab] = useState<TabState>('good')
const [toast, setToast] = useState('')
```

with:

```tsx
const [selectedEmotionCategory, setSelectedEmotionCategory] = useState<EmotionCategoryId>('good')
const [emotionSheetOpen, setEmotionSheetOpen] = useState(false)
const [toast, setToast] = useState('')
const {
  currentState: emotionState,
  currentStateId: emotionStateId,
  saving: emotionSaving,
  error: emotionError,
  saveState: saveEmotionState,
  clearError: clearEmotionError,
} = useCoupleEmotionState(identity)
```

- [ ] **Step 4: Add the error-to-toast effect**

After the existing load effect:

```tsx
useEffect(() => { void Promise.resolve().then(loadAll) }, [loadAll])
```

add:

```tsx
useEffect(() => {
  if (!emotionError) return
  setToast(emotionError)
  clearEmotionError()
}, [clearEmotionError, emotionError])
```

- [ ] **Step 5: Remove the old emotion options block**

Remove the entire old block:

```tsx
const emotionOptions = [
  { key: 'good' as TabState, label: '我们都好', badge: '平安无事', status: '今日状态：平安无事，适合一起存一个小确幸。', Icon: Smile },
  { key: 'angry' as TabState, label: '我们的小确幸', badge: '甜甜小事', status: '今日状态：有甜甜的小事，记得把它收进小花园。', Icon: Heart },
  { key: 'taAngry' as TabState, label: '心里有个小乌云', badge: '需要抱抱', status: '今日状态：先抱抱情绪，再慢慢把话说清楚。', Icon: Cloud },
]
const selectedEmotion = emotionOptions.find(item => item.key === tab) ?? emotionOptions[0]
```

- [ ] **Step 6: Add exact-state selection handler**

After `const noteText = warmReminder || meetupNote`, add:

```tsx
const selectEmotionState = async (stateId: string) => {
  const saved = await saveEmotionState(stateId)
  if (saved) {
    setEmotionSheetOpen(false)
    setToast('小人状态已同步给你们啦')
  }
}
```

- [ ] **Step 7: Replace the emotion repair station JSX**

Replace the current emotion section:

```tsx
<section className="home-emotion-card min-h-0 flex-1">
  <div className="home-emotion-title-row">
    <Heart size={18} fill="currentColor" />
    <h2>情绪修理站</h2>
  </div>
  <div className="home-emotion-list">
    {emotionOptions.map(({ key, label, badge, Icon }) => {
      const active = tab === key
      return (
        <button key={key} onClick={() => setTab(key)} className={`home-emotion-button ui-touch-target ${active ? 'is-active' : ''}`}>
          <span className="flex min-w-0 items-center gap-3">
            <Icon size={19} />
            <span className="ui-clamp-1">{label}</span>
          </span>
          {active && <span className="home-emotion-badge">{badge}</span>}
        </button>
      )
    })}
  </div>
  <div className="home-emotion-status">
    <span className="home-emotion-status-label">{selectedEmotion.label}</span>
    <p>{selectedEmotion.status}</p>
  </div>
</section>
```

with:

```tsx
<section className="home-emotion-card min-h-0 flex-1">
  <div className="home-emotion-title-row">
    <Heart size={18} fill="currentColor" />
    <h2>情绪修理站</h2>
  </div>

  <div className="home-emotion-category-row" aria-label="情绪分类预览">
    {EMOTION_CATEGORIES.map(category => {
      const active = selectedEmotionCategory === category.id
      return (
        <button
          key={category.id}
          type="button"
          onClick={() => setSelectedEmotionCategory(category.id)}
          className={`home-emotion-category-button ui-touch-target ${active ? 'is-active' : ''}`}
          aria-pressed={active}
        >
          <span>{category.label}</span>
        </button>
      )
    })}
  </div>

  <EmotionCharacterCard
    state={emotionState}
    saving={emotionSaving}
    onOpenPicker={() => setEmotionSheetOpen(true)}
  />

  <p className="home-emotion-preview-note">
    点击分类只是预览，选择具体小人状态后才会同步给对方。
  </p>
</section>

<EmotionStateSheet
  open={emotionSheetOpen}
  selectedCategory={selectedEmotionCategory}
  currentStateId={emotionStateId}
  saving={emotionSaving}
  onCategoryChange={setSelectedEmotionCategory}
  onSelectState={stateId => { void selectEmotionState(stateId) }}
  onClose={() => setEmotionSheetOpen(false)}
/>
```

- [ ] **Step 8: Run targeted lint for HomePage and new modules**

Run:

```bash
npx eslint src/pages/HomePage.tsx src/components/emotion/EmotionCharacterCard.tsx src/components/emotion/EmotionStateSheet.tsx src/hooks/useCoupleEmotionState.ts src/data/emotion-character-states.ts
```

Expected: no ESLint errors.

- [ ] **Step 9: Run TypeScript build check**

Run:

```bash
npm run build
```

Expected: TypeScript compiles. Existing Vite/PWA warnings are allowed.

---

### Task 7: Add emotion character styles without disturbing Home/Couple Space layout

**Files:**
- Modify: `src/styles/index.css`

- [ ] **Step 1: Append the V1 emotion character styles**

Append this CSS after the existing `.home-emotion-status p` rule and before the `@media (max-height: 720px)` block:

```css
.home-emotion-category-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin-top: 12px;
}

.home-emotion-category-button {
  display: inline-flex;
  min-width: 0;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #ffd9c7;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  padding: 0 8px;
  color: #8d7a7d;
  font-size: 11px;
  font-weight: 900;
  line-height: 1.1;
  text-align: center;
}

.home-emotion-category-button.is-active {
  border-color: #ff9a7a;
  background: #ff9a7a;
  color: #773018;
  box-shadow: 0 4px 0 rgba(255, 154, 122, 0.18);
}

.emotion-character-card {
  position: relative;
  display: grid;
  min-width: 0;
  min-height: 124px;
  grid-template-columns: 92px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  overflow: hidden;
  border: 2px dashed #ffb59e;
  border-radius: 18px;
  background:
    radial-gradient(circle at 84% 18%, rgba(255, 223, 168, 0.22), transparent 28%),
    linear-gradient(90deg, rgba(255, 154, 122, 0.045) 1px, transparent 1px),
    linear-gradient(rgba(255, 154, 122, 0.038) 1px, transparent 1px),
    rgba(255, 248, 243, 0.82);
  background-size: 100% 100%, 18px 18px, 18px 18px, 100% 100%;
  padding: 12px;
  color: #3d2c2e;
  text-align: left;
}

.emotion-character-card.is-saving {
  opacity: 0.78;
}

.emotion-character-stage {
  display: flex;
  width: 92px;
  height: 92px;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffd9c7;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.emotion-character-stage-good {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(255, 248, 243, 0.76));
}

.emotion-character-stage-sweet {
  background: linear-gradient(180deg, rgba(255, 241, 237, 0.82), rgba(255, 221, 211, 0.62));
}

.emotion-character-stage-cloudy {
  background: linear-gradient(180deg, rgba(232, 223, 245, 0.72), rgba(255, 241, 237, 0.72));
}

.emotion-pixel-couple {
  position: relative;
  display: block;
  width: 62px;
  height: 54px;
}

.emotion-pixel-person {
  position: absolute;
  bottom: 0;
  width: 27px;
  height: 42px;
  border: 2px solid #3d2c2e;
  border-radius: 11px 11px 8px 8px;
  background: #fff;
  box-shadow: 0 3px 0 rgba(61, 44, 46, 0.16);
}

.emotion-pixel-person::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 7px;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #3d2c2e;
  box-shadow: 9px 0 0 #3d2c2e;
}

.emotion-pixel-person::after {
  content: '';
  position: absolute;
  right: 6px;
  bottom: 7px;
  left: 6px;
  height: 5px;
  border-radius: 999px;
  background: #ff9a7a;
}

.emotion-pixel-person-left {
  left: 3px;
  background: #fff4ee;
}

.emotion-pixel-person-right {
  right: 3px;
  background: #fff;
}

.emotion-pixel-couple-hug .emotion-pixel-person-left,
.emotion-pixel-couple-cuddle .emotion-pixel-person-left,
.emotion-pixel-couple-comforting .emotion-pixel-person-left,
.emotion-pixel-couple-need-hug .emotion-pixel-person-left {
  transform: translateX(4px) rotate(-4deg);
}

.emotion-pixel-couple-hug .emotion-pixel-person-right,
.emotion-pixel-couple-cuddle .emotion-pixel-person-right,
.emotion-pixel-couple-comforting .emotion-pixel-person-right,
.emotion-pixel-couple-need-hug .emotion-pixel-person-right {
  transform: translateX(-4px) rotate(4deg);
}

.emotion-pixel-couple-angry::before,
.emotion-pixel-couple-arguing::before,
.emotion-pixel-couple-jealous::before,
.emotion-pixel-couple-insecure::before,
.emotion-pixel-couple-wronged::before,
.emotion-pixel-couple-low-battery::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  width: 36px;
  height: 18px;
  border-radius: 999px;
  background: rgba(139, 118, 156, 0.28);
  transform: translateX(-50%);
}

.emotion-pixel-couple-holding-hands::after,
.emotion-pixel-couple-kiss::after,
.emotion-pixel-couple-blush::after,
.emotion-pixel-couple-miss-you::after,
.emotion-pixel-couple-happy-jump::after,
.emotion-pixel-couple-head-pat::after {
  content: '♡';
  position: absolute;
  top: -16px;
  left: 50%;
  color: #f06f55;
  font-size: 18px;
  font-weight: 900;
  transform: translateX(-50%);
}

.emotion-character-copy {
  display: block;
  min-width: 0;
}

.emotion-character-kicker {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #f06f55;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
}

.emotion-character-title {
  display: block;
  margin-top: 4px;
  color: #3d2c2e;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.18;
}

.emotion-character-desc {
  display: -webkit-box;
  margin-top: 5px;
  overflow: hidden;
  color: #55433d;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.emotion-character-hint {
  display: block;
  margin-top: 7px;
  color: #8d7a7d;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.2;
}

.emotion-character-saving {
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  padding: 5px 8px;
  color: #96472d;
  font-size: 10px;
  font-weight: 900;
  line-height: 1;
}

.home-emotion-preview-note {
  margin-top: 8px;
  color: #8d7a7d;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.25;
}

.emotion-sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(61, 44, 46, 0.24);
  backdrop-filter: blur(5px);
}

.emotion-sheet {
  width: 100%;
  max-width: 480px;
  max-height: min(72vh, 560px);
  overflow-y: auto;
  border: 2px solid #ffd9c7;
  border-bottom: 0;
  border-radius: 26px 26px 0 0;
  background:
    linear-gradient(90deg, rgba(255, 154, 122, 0.04) 1px, transparent 1px),
    linear-gradient(rgba(255, 154, 122, 0.034) 1px, transparent 1px),
    #fff8f3;
  background-size: 18px 18px, 18px 18px, 100% 100%;
  padding: 8px 16px max(18px, env(safe-area-inset-bottom));
  box-shadow: 0 -12px 32px rgba(61, 44, 46, 0.14);
}

.emotion-sheet-handle {
  width: 42px;
  height: 5px;
  margin: 0 auto 12px;
  border-radius: 999px;
  background: #ffd9c7;
}

.emotion-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.emotion-sheet-eyebrow {
  color: #f06f55;
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
}

.emotion-sheet-head h3 {
  margin-top: 4px;
  color: #3d2c2e;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.2;
}

.emotion-sheet-close {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #fff1ed;
  color: #96472d;
}

.emotion-sheet-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 14px;
}

.emotion-sheet-tab {
  min-height: 44px;
  border: 1.5px solid #ffd9c7;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #8d7a7d;
  font-size: 12px;
  font-weight: 900;
}

.emotion-sheet-tab.is-active {
  border-color: #ff9a7a;
  background: #ff9a7a;
  color: #773018;
}

.emotion-sheet-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin-top: 14px;
}

.emotion-state-option {
  display: flex;
  min-width: 0;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1.5px solid #ffd9c7;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  color: #55433d;
  font-size: 13px;
  font-weight: 900;
  line-height: 1;
}

.emotion-state-option.is-active {
  border-color: #ff9a7a;
  background: #ffe1dc;
  color: #773018;
  box-shadow: 0 3px 0 rgba(255, 154, 122, 0.18);
}

.emotion-state-option:disabled {
  opacity: 0.55;
}

.emotion-state-option-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 999px;
}

.emotion-state-option-dot-good {
  background: #aee6c8;
}

.emotion-state-option-dot-sweet {
  background: #ff9a7a;
}

.emotion-state-option-dot-cloudy {
  background: #e8dff5;
}
```

- [ ] **Step 2: Add compact-height overrides**

Inside the existing `@media (max-height: 720px)` block, after the `.home-emotion-button` rule or near the other home emotion rules, add:

```css
  .home-emotion-category-row {
    gap: 6px;
    margin-top: 9px;
  }

  .home-emotion-category-button {
    min-height: 38px;
    font-size: 10px;
  }

  .emotion-character-card {
    min-height: 98px;
    grid-template-columns: 74px minmax(0, 1fr);
    gap: 9px;
    margin-top: 9px;
    padding: 9px;
  }

  .emotion-character-stage {
    width: 74px;
    height: 74px;
    border-radius: 17px;
  }

  .emotion-pixel-couple {
    transform: scale(0.82);
  }

  .emotion-character-title {
    font-size: 15px;
  }

  .emotion-character-desc {
    font-size: 11px;
    -webkit-line-clamp: 1;
  }

  .emotion-character-hint,
  .home-emotion-preview-note {
    font-size: 9px;
  }
```

- [ ] **Step 3: Remove obsolete emotion status styles only if unused**

After HomePage integration, these old selectors should no longer be used by JSX:

```css
.home-emotion-list
.home-emotion-button
.home-emotion-button.is-active
.home-emotion-badge
.home-emotion-status
.home-emotion-status-label
.home-emotion-status p
```

Do not delete them in this task. Leave them for now to reduce risk in a non-git workspace. Cleanup can happen after the UI is verified.

- [ ] **Step 4: Run targeted lint and build**

Run:

```bash
npx eslint src/pages/HomePage.tsx src/components/emotion/EmotionCharacterCard.tsx src/components/emotion/EmotionStateSheet.tsx src/hooks/useCoupleEmotionState.ts src/data/emotion-character-states.ts
npm run build
```

Expected: no ESLint errors in changed files and build completes. Existing Vite/PWA warnings are allowed.

---

### Task 8: Manual browser validation on mobile viewport

**Files:**
- No code changes.

- [ ] **Step 1: Start the dev server**

Run:

```bash
npm run dev
```

Expected: Vite starts and prints a local URL such as `http://localhost:5173/`.

- [ ] **Step 2: Open the Home page in a mobile-sized browser**

Open the dev server URL. Use a mobile viewport around 375px wide.

Expected: Home page still has the approved overall structure: hero, status cards, note card, emotion repair station, reserved lower space behavior, and shared bottom nav.

- [ ] **Step 3: Validate category preview does not save**

1. Note the current state name in the character card.
2. Tap `心里有个小乌云`.
3. Do not choose a specific state.
4. Refresh the page.

Expected: the shared current state has not changed just because the category was tapped.

- [ ] **Step 4: Validate exact state saves and syncs**

1. Tap the character card.
2. In the bottom sheet, select `小乌云` if needed.
3. Tap `小委屈`.
4. Confirm the sheet closes.
5. Confirm the card displays `小委屈`.
6. Refresh the page.

Expected: the card still displays `小委屈` after refresh.

- [ ] **Step 5: Validate sweet state saves and syncs**

1. Tap the character card.
2. Select the `小确幸` category.
3. Tap `拥抱`.
4. Confirm the card displays `拥抱`.
5. Refresh the page.

Expected: the card still displays `拥抱` after refresh.

- [ ] **Step 6: Validate mobile layout constraints**

At a 375px viewport:

- No horizontal scroll.
- Home page remains within the main screen area.
- Bottom nav does not cover the emotion picker trigger.
- Bottom sheet buttons are finger-friendly.
- Close button is at least 44px.
- Category taps visually differ from exact state selection.

- [ ] **Step 7: Validate saving failure copy if Supabase is unavailable**

Temporarily disable the network in DevTools or use an invalid Supabase env only in local dev.

1. Tap the character card.
2. Choose any exact state.

Expected: the app shows `这次没有同步成功，稍后再试一次。` and does not crash.

Restore the normal network/env before continuing.

---

### Task 9: Final validation and handoff

**Files:**
- No code changes unless validation finds a bug.

- [ ] **Step 1: Run final scoped lint**

Run:

```bash
npx eslint src/pages/HomePage.tsx src/components/emotion/EmotionCharacterCard.tsx src/components/emotion/EmotionStateSheet.tsx src/hooks/useCoupleEmotionState.ts src/data/emotion-character-states.ts
```

Expected: no ESLint errors.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build complete. Existing Vite/PWA warnings are allowed.

- [ ] **Step 3: Record changed files for non-git workspace**

Because this project is not a git repository, manually report this changed-file list in the handoff:

```text
supabase/migrations_v5.4.sql
src/data/emotion-character-states.ts
src/hooks/useCoupleEmotionState.ts
src/components/emotion/EmotionCharacterCard.tsx
src/components/emotion/EmotionStateSheet.tsx
src/pages/HomePage.tsx
src/styles/index.css
```

- [ ] **Step 4: Handoff summary**

Report:

- Whether Supabase SQL was applied.
- Whether category taps only preview and do not save.
- Whether exact state selection saves and survives refresh.
- Whether mobile layout remains non-scrolling and bottom nav remains unobstructed.
- Final lint/build results.

No commit is required because the workspace is not a git repository.

---

## Self-Review

### Spec coverage

- Shared couple state: covered by Tasks 1, 3, 6, 8.
- Three categories: covered by Task 2 and Task 6.
- Category preview without saving: covered by Task 6 and Task 8.
- Exact-state save through bottom sheet: covered by Tasks 5, 6, 8.
- 24-state atlas: covered by Task 2.
- Current-state-only storage: covered by Task 1 schema and Task 3 hook.
- Placeholder character, no dynamic animation: covered by Tasks 4 and 7.
- Home-only scope: covered by File Structure and Task 6.
- Mobile touch/readability constraints: covered by Tasks 5, 7, 8.

### Placeholder scan

The plan contains no unresolved implementation placeholders. The word `placeholder` refers to the approved V1 pixel placeholder field and visual fallback, not unfinished plan content.

### Type consistency

- Category type is consistently `EmotionCategoryId = 'good' | 'sweet' | 'cloudy'`.
- Default state is consistently `calm`.
- Supabase field is consistently `state_id`.
- Hook save function is consistently `saveState(stateId: string)`.
- Home integration calls `saveEmotionState` from the hook alias.
