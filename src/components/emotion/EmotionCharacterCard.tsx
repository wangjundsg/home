import type { CSSProperties } from 'react'
import { getEmotionDesktopPetByStateId } from '../../data/emotion-desktop-pet-profiles'
import { getEmotionSpriteByStateId, type EmotionCharacterState } from '../../data/emotion-character-states'

interface EmotionCharacterCardProps {
  state: EmotionCharacterState
  saving: boolean
  bubbleText: string
  onOpenPicker?: () => void
}

export function EmotionCharacterCard({ state, saving, bubbleText, onOpenPicker }: EmotionCharacterCardProps) {
  const desktopPet = getEmotionDesktopPetByStateId(state.id)
  const sprite = desktopPet ? null : getEmotionSpriteByStateId(state.id)

  const spriteScale = sprite ? Math.min(132 / sprite.rect.width, 96 / sprite.rect.height) : 1
  const spriteStyle = sprite ? {
    '--sprite-sheet-width': `${sprite.sheet === 'sweet' ? 1024 : 1200}px`,
    '--sprite-sheet-height': `${sprite.sheet === 'sweet' ? 1024 : 896}px`,
    '--sprite-rect-x': `${sprite.rect.x}px`,
    '--sprite-rect-y': `${sprite.rect.y}px`,
    '--sprite-rect-width': `${sprite.rect.width}px`,
    '--sprite-rect-height': `${sprite.rect.height}px`,
    '--sprite-scale': `${spriteScale}`,
    '--sprite-window-width': `${sprite.rect.width * spriteScale}px`,
    '--sprite-window-height': `${sprite.rect.height * spriteScale}px`,
  } as CSSProperties : undefined

  const stage = (
    <>
      <span className={`emotion-character-stage emotion-character-stage-${state.category}`}>
        {bubbleText && <span className="emotion-character-bubble">{bubbleText}</span>}
        {desktopPet ? (
          <span className={`emotion-desktop-pet emotion-desktop-pet-${desktopPet.motion}`} aria-hidden="true">
            <img className="emotion-desktop-pet-image" src={desktopPet.src} alt="" />
          </span>
        ) : sprite ? (
          <span className="emotion-sprite-window" aria-hidden="true" style={spriteStyle}>
            <img
              className="emotion-sprite-sheet"
              src={sprite.src}
              alt=""
              style={spriteStyle}
            />
          </span>
        ) : (
          <span className={`emotion-pixel-couple emotion-pixel-couple-${state.placeholder}`} aria-hidden="true">
            <span className="emotion-pixel-person emotion-pixel-person-left" />
            <span className="emotion-pixel-person emotion-pixel-person-right" />
          </span>
        )}
      </span>
      {saving && <span className="emotion-character-saving">同步中</span>}
    </>
  )

  if (!onOpenPicker) {
    return (
      <div
        className={`emotion-character-stage-card ${saving ? 'is-saving' : ''}`}
        role="img"
        aria-label={`当前情绪小人状态：${state.label}${saving ? '，当前正在同步中' : ''}`}
      >
        {stage}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`emotion-character-stage-card ui-touch-target ${saving ? 'is-saving' : ''}`}
      onClick={onOpenPicker}
      aria-label={`当前情绪小人状态：${state.label}${saving ? '，当前正在同步中' : ''}`}
    >
      {stage}
    </button>
  )
}
