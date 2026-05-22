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
    <div className="pixel-page flex min-h-full flex-col gap-3 px-4 pt-3 pb-8">
      <section className="pixel-card p-2">
        <div className="grid grid-cols-4 gap-1.5">
          {heartbeatLevelOrder.map(item => {
            const selected = level === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setLevel(item)}
                className={`min-h-[42px] rounded-2xl px-2 py-2 text-xs font-black ${selected ? 'bg-warm-500 text-white shadow-sm' : 'bg-white text-text-primary ring-1 ring-warm-100'}`}
                aria-label={`${heartbeatLevelLabels[item]}，${heartbeatLevelDescriptions[item]}`}
              >
                {heartbeatLevelLabels[item]}
              </button>
            )
          })}
        </div>
      </section>

      <PrivateFlyingChessBoard level={level} playerAName={identity || '大大怪'} playerBName={partnerName || '小怪兽'} />
    </div>
  )
}
