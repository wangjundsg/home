import { useState } from 'react'
import { PrivateFlyingChessBoard } from '../components/interact/PrivateFlyingChessBoard'
import { heartbeatLevelDescriptions, heartbeatLevelLabels, heartbeatLevelOrder, type HeartbeatLevel } from '../data/private-flying-chess'

interface PrivateFlyingChessPageProps {
  identity?: string
  partnerName?: string
  navigate: (route: string) => void
}

export function PrivateFlyingChessPage({ identity, partnerName }: PrivateFlyingChessPageProps) {
  const [level, setLevel] = useState<HeartbeatLevel>('beginner')

  return (
    <div className="pixel-page flex min-h-full flex-col gap-2 px-4 pt-2 pb-8">
      <section className="pixel-card p-1">
        <div className="grid grid-cols-4 gap-1">
          {heartbeatLevelOrder.map(item => {
            const selected = level === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setLevel(item)}
                className={`min-h-[32px] rounded-xl px-2 py-1 text-xs font-black ${selected ? 'bg-warm-500 text-white shadow-sm' : 'bg-white text-text-primary ring-1 ring-warm-100'}`}
                aria-label={`${heartbeatLevelLabels[item]}，${heartbeatLevelDescriptions[item]}`}
              >
                {heartbeatLevelLabels[item]}
              </button>
            )
          })}
        </div>
      </section>

      <PrivateFlyingChessBoard key={level} level={level} playerAName={identity || '大大怪'} playerBName={partnerName || '小怪兽'} />
    </div>
  )
}
