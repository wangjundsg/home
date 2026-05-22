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
