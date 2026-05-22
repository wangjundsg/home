import { Gift, CalendarDays, Heart, CalendarHeart, FileText, Sprout, Cake, MessageSquare } from 'lucide-react'
import type { Identity } from '../hooks/useIdentity'

interface CoupleSpacePageProps {
  identity: Identity
  partnerName: string
  navigate: (route: string) => void
}

interface SpaceItem {
  route: string
  Icon: typeof Gift
  label: string
  desc: string
  color: string
  bg: string
  tag?: string
}

const SPACE_ITEMS: SpaceItem[] = [
  { route: '/daily', Icon: Gift, label: '礼物小铺', desc: '积分换好礼', color: 'text-[#7a4b16]', bg: 'bg-[#FFDFA8]' },
  { route: '/period', Icon: CalendarDays, label: '月亮小屋', desc: '贴心关怀每一天', color: 'text-[#7d2648]', bg: 'bg-[#ff8fb3]', tag: '记录中' },
  { route: '/intimacy', Icon: Heart, label: '秘密册', desc: '私密的美好时光', color: 'text-[#773018]', bg: 'bg-[#ff9a7a]' },
  { route: '/meeting', Icon: CalendarHeart, label: '小车站', desc: '倒数下次相聚', color: 'text-[#004f48]', bg: 'bg-[#54c6b8]' },
  { route: '/agreements', Icon: FileText, label: '木牌墙', desc: '我们的约定', color: 'text-[#295a45]', bg: 'bg-[#AEE6C8]' },
  { route: '/growth', Icon: Sprout, label: '树苗屋', desc: '共同进步的足迹', color: 'text-[#783118]', bg: 'bg-[#ff8a70]' },
  { route: '/anniversary', Icon: Cake, label: '纪念册', desc: '重要的日子', color: 'text-[#7d2648]', bg: 'bg-[#ffd9e2]' },
  { route: '/phrases', Icon: MessageSquare, label: '信箱', desc: '灵感对话开场', color: 'text-[#4b3c73]', bg: 'bg-[#E8DFF5]' },
]

export function CoupleSpacePage({ navigate, partnerName }: CoupleSpacePageProps) {
  return (
    <div className="space-page flex h-full min-h-0 flex-col overflow-hidden">
      <div className="space-dot-layer pointer-events-none absolute inset-0" />
      <section className="space-hero shrink-0">
        <div className="space-hero-copy">
          <h2>小花园房间</h2>
          <p>我们的秘密空间，收藏你和{partnerName || 'TA'}的小日常。</p>
        </div>
        <button onClick={() => navigate('/anniversary')} className="space-memory-card ui-touch-target" aria-label="查看我们的回忆">
          <Heart size={26} strokeWidth={2.2} />
          <span>我们的回忆</span>
        </button>
      </section>

      <div className="space-room-grid min-h-0 flex-1">
        {SPACE_ITEMS.map(item => (
          <button
            key={item.route}
            onClick={() => navigate(item.route)}
            className="space-room-card card-pressable ui-touch-target text-left"
          >
            <div className="space-room-top">
              <span className={`space-room-icon ${item.bg}`}>
                <item.Icon size={21} className={item.color} />
              </span>
              {item.tag && <span className="space-room-tag">{item.tag}</span>}
            </div>
            <span className="space-room-copy">
              <span className="space-room-title ui-clamp-1">{item.label}</span>
              <span className="space-room-desc ui-clamp-1">{item.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
