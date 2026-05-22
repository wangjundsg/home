import { House, Heart, Gamepad2 } from 'lucide-react'

interface BottomNavProps {
  current: string
  onNavigate: (route: string) => void
}

const tabs = [
  { key: '/', label: '首页', Icon: House },
  { key: '/space', label: '情侣空间', Icon: Heart },
  { key: '/interact', label: '互动', Icon: Gamepad2 },
]

export function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 rounded-t-[28px] border-t-2 border-[#ffd9c7] bg-[#fbeae6]/94 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_22px_rgba(61,44,46,0.06)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-around gap-2 px-4">
        {tabs.map(({ key, label, Icon }) => {
          const active = current === key
          return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`ui-touch-target flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 font-bold transition-colors ${
              active ? 'bg-[#ff9a7a] text-[#773018] shadow-[0_8px_18px_rgba(240,111,85,0.18)] ring-1 ring-white/70' : 'text-[#55433d]'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.7} />
            <span className="text-[11px] font-bold leading-none">{label}</span>
          </button>
        )})}
      </div>
    </nav>
  )
}
