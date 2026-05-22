import { useCallback, useMemo } from 'react'
import { ChevronLeft, Cloud, Heart, Sprout } from 'lucide-react'
import type { Identity } from '../hooks/useIdentity'
import { useCoupleEmotionState } from '../hooks/useCoupleEmotionState'
import {
  EMOTION_CATEGORIES,
  getEmotionStatesByCategory,
  type EmotionCategoryId,
} from '../data/emotion-character-states'

interface EmotionStationPageProps {
  identity: Identity
  navigate: (route: string) => void
  category: EmotionCategoryId
}

const HOME_EMOTION_BUBBLE_KEY = 'qinggan_home_emotion_bubble'

interface EmotionBubbleLayoutItem {
  id: string
  label: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  float: string
  size?: 'primary' | 'secondary' | 'weak'
  orbit?: 'normal' | 'wide'
}

const GOOD_BUBBLE_LAYOUT: EmotionBubbleLayoutItem[] = [
  { id: 'empty_mind', label: '放空', top: '4%', left: '42%', float: 'emotion-designed-float-1', size: 'primary', orbit: 'wide' },
  { id: 'smooth', label: '顺利', top: '20%', left: '4%', float: 'emotion-designed-float-2', size: 'secondary', orbit: 'normal' },
  { id: 'movie', label: '看电影', top: '20%', right: '4%', float: 'emotion-designed-float-3', size: 'secondary', orbit: 'normal' },
  { id: 'content', label: '满足', top: '43%', left: '2%', float: 'emotion-designed-float-4', size: 'weak', orbit: 'normal' },
  { id: 'reading', label: '看书', top: '43%', right: '2%', float: 'emotion-designed-float-5', size: 'weak', orbit: 'normal' },
  { id: 'rest', label: '休息', top: '68%', left: '6%', float: 'emotion-designed-float-1', size: 'secondary', orbit: 'normal' },
  { id: 'nap', label: '午睡', top: '68%', right: '6%', float: 'emotion-designed-float-2', size: 'secondary', orbit: 'normal' },
  { id: 'relaxed', label: '轻松', bottom: '16%', left: '31%', float: 'emotion-designed-float-3', size: 'primary', orbit: 'wide' },
  { id: 'calm', label: '平静', bottom: '6%', left: '43%', float: 'emotion-designed-float-4', size: 'secondary', orbit: 'wide' },
]

const SWEET_BUBBLE_LAYOUT: EmotionBubbleLayoutItem[] = [
  { id: 'sweet_moment', label: '甜蜜', top: '18%', left: '8%', float: 'emotion-designed-float-1', size: 'secondary', orbit: 'normal' },
  { id: 'companionship', label: '陪伴', top: '10%', left: '43%', float: 'emotion-designed-float-2', size: 'primary', orbit: 'wide' },
  { id: 'kiss', label: '亲亲', top: '24%', right: '6%', float: 'emotion-designed-float-3', size: 'secondary', orbit: 'normal' },
  { id: 'hug', label: '拥抱', top: '44%', left: '4%', float: 'emotion-designed-float-4', size: 'secondary', orbit: 'normal' },
  { id: 'fondness', label: '喜欢', top: '56%', right: '13%', float: 'emotion-designed-float-5', size: 'primary', orbit: 'wide' },
  { id: 'heartbeat', label: '心动', top: '47%', right: '4%', float: 'emotion-designed-float-1', size: 'secondary', orbit: 'normal' },
  { id: 'holding_hands', label: '牵手', top: '74%', left: '12%', float: 'emotion-designed-float-2', size: 'weak', orbit: 'normal' },
  { id: 'cuddle', label: '依偎', top: '70%', right: '12%', float: 'emotion-designed-float-3', size: 'weak', orbit: 'normal' },
]

const CLOUDY_BUBBLE_LAYOUT: EmotionBubbleLayoutItem[] = [
  { id: 'arguing', label: '吵架', top: '6%', left: '43%', float: 'emotion-cloudy-float-1', size: 'primary', orbit: 'wide' },
  { id: 'wronged', label: '委屈', top: '19%', left: '9%', float: 'emotion-cloudy-float-2', size: 'secondary', orbit: 'normal' },
  { id: 'anxious', label: '焦虑', top: '24%', right: '6%', float: 'emotion-cloudy-float-3', size: 'secondary', orbit: 'normal' },
  { id: 'angry', label: '生气', top: '36%', left: '2%', float: 'emotion-cloudy-float-4', size: 'secondary', orbit: 'normal' },
  { id: 'low_battery', label: '掉电', top: '47%', right: '2%', float: 'emotion-cloudy-float-5', size: 'weak', orbit: 'normal' },
  { id: 'lonely', label: '孤独', top: '58%', left: '9%', float: 'emotion-cloudy-float-1', size: 'secondary', orbit: 'normal' },
  { id: 'stressed', label: '压力', top: '67%', right: '17%', float: 'emotion-cloudy-float-2', size: 'primary', orbit: 'wide' },
  { id: 'sad', label: '难过', bottom: '12%', left: '3%', float: 'emotion-cloudy-float-3', size: 'weak', orbit: 'normal' },
  { id: 'insecure', label: '不安', bottom: '8%', right: '8%', float: 'emotion-cloudy-float-4', size: 'secondary', orbit: 'wide' },
]

const EMOTION_BUBBLE_TEXTS: Record<string, string> = {
  calm: '我们稳稳地在一起',
  thinking: '我在想你，也在想我们',
  sleeping: '先休息一下，醒来再抱抱',
  studying: '一起认真，也一起进步',
  movie: '这段时光刚刚好',
  travel: '想和你去看看世界',
  empty_mind: '想放空一下，静静靠着你',
  smooth: '今天很顺利，想和你分享',
  content: '此刻很满足，心里软软的',
  rest: '想休息一下，也想被你惦记',
  relaxed: '现在很轻松，像被温柔包住',
  nap: '想午睡一会儿，醒来再找你',
  reading: '看会儿书，也把想你夹进书页',
  holding_hands: '牵着你就很安心',
  hug: '抱一下，今天会更好',
  kiss: '啵一下，甜度超标',
  cuddle: '贴贴一下，心都软了',
  head_pat: '摸摸头，辛苦啦',
  happy_jump: '今天开心到想蹦起来',
  blush: '被你一看就脸红了',
  miss_you: '有点想你，现在就想',
  sweet_moment: '今天有点甜，想存起来',
  companionship: '有你陪着，就很安心',
  fondness: '喜欢你这件事又冒泡了',
  heartbeat: '心跳突然变得好明显',
  angry: '我有点上头，先缓一缓',
  wronged: '我有点委屈，想被理解',
  anxious: '我有点焦虑，想慢慢稳下来',
  arguing: '先别急，我们慢慢说',
  cooling_down: '我在降温，等会儿聊',
  apologizing: '对不起，我愿意改',
  comforting: '我在这，慢慢抱住你',
  need_hug: '现在好想要一个抱抱',
  lonely: '有点孤单，想靠近你一点',
  sad: '我有点难过，想被抱抱',
  low_battery: '今天电量低，先充充电',
  stressed: '压力有点大，想被轻轻接住',
  jealous: '我有点吃醋，想你哄我',
  insecure: '我有点没底，想听你一句安心话',
}

export function EmotionStationPage({ identity, navigate, category }: EmotionStationPageProps) {
  const { currentStateId, saving, saveState } = useCoupleEmotionState(identity)
  const states = useMemo(() => getEmotionStatesByCategory(category), [category])
  const categoryInfo = useMemo(() => EMOTION_CATEGORIES.find(item => item.id === category) ?? EMOTION_CATEGORIES[0], [category])
  const isCloudy = category === 'cloudy'
  const isSweet = category === 'sweet'
  const designedLayout = category === 'good' ? GOOD_BUBBLE_LAYOUT : isSweet ? SWEET_BUBBLE_LAYOUT : null

  const selectState = useCallback(async (stateId: string) => {
    const saved = await saveState(stateId)
    if (!saved) return
    const bubble = EMOTION_BUBBLE_TEXTS[stateId] ?? ''
    if (bubble) {
      localStorage.setItem(HOME_EMOTION_BUBBLE_KEY, JSON.stringify({ text: bubble, ts: Date.now() }))
    }
    navigate('/')
  }, [navigate, saveState])

  if (designedLayout) {
    const title = isSweet ? '小确幸' : categoryInfo.label

    return (
      <div className={`emotion-designed-page emotion-designed-page-${category}`}>
        <div className="emotion-designed-topbar">
          <button
            type="button"
            className="emotion-designed-back ui-touch-target"
            aria-label="返回首页"
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <h2 className="emotion-designed-title">{title}</h2>
          <span className="emotion-designed-topbar-spacer" aria-hidden="true" />
        </div>

        <main className={`emotion-designed-main ${isSweet ? 'is-sweet' : 'is-good'}`}>
          <div className="emotion-designed-canvas" role="list" aria-label={`${title}情绪状态`}>
            <div className="emotion-designed-haze" aria-hidden="true" />
            <div className={`emotion-designed-center ${isSweet ? 'is-sweet' : 'is-good'}`} aria-hidden="true">
              {isSweet ? <Heart size={78} strokeWidth={2.2} /> : <Sprout size={78} strokeWidth={2.2} />}
            </div>

            {designedLayout.map(layout => {
              const state = states.find(item => item.id === layout.id)
              if (!state) return null
              const active = currentStateId === state.id

              return (
                <button
                  key={state.id}
                  type="button"
                  role="listitem"
                  className={`emotion-designed-bubble ui-touch-target ${layout.float} emotion-bubble-size-${layout.size ?? 'secondary'} emotion-bubble-orbit-${layout.orbit ?? 'normal'} ${active ? 'is-active' : ''}`}
                  style={{ top: layout.top, bottom: layout.bottom, left: layout.left, right: layout.right }}
                  aria-pressed={active}
                  onClick={() => selectState(state.id)}
                  disabled={saving}
                >
                  {layout.label}
                </button>
              )
            })}
          </div>

          <div className="emotion-designed-copy">
            {!isSweet && <h3>一切都好</h3>}
            <p>{isSweet ? '今天发生了什么开心事？' : '生活平淡，但因为有你在，每一刻都很温馨。'}</p>
          </div>
        </main>
      </div>
    )
  }

  if (isCloudy) {
    return (
      <div className="emotion-cloudy-page">
        <div className="emotion-cloudy-topbar">
          <button
            type="button"
            className="emotion-cloudy-back ui-touch-target"
            aria-label="返回首页"
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <h2 className="emotion-cloudy-title">{categoryInfo.label}</h2>
          <span className="emotion-cloudy-topbar-spacer" aria-hidden="true" />
        </div>

        <main className="emotion-cloudy-main">
          <div className="emotion-cloudy-canvas" role="list" aria-label="小乌云情绪状态">
            <div className="emotion-cloudy-haze" aria-hidden="true" />
            <div className="emotion-cloudy-center-cloud" aria-hidden="true">
              <Cloud size={78} strokeWidth={2.1} />
            </div>

            {CLOUDY_BUBBLE_LAYOUT.map(layout => {
              const state = states.find(item => item.id === layout.id)
              if (!state) return null
              const active = currentStateId === state.id

              return (
                <button
                  key={state.id}
                  type="button"
                  role="listitem"
                  className={`emotion-cloudy-bubble ui-touch-target ${layout.float} emotion-bubble-size-${layout.size ?? 'secondary'} emotion-bubble-orbit-${layout.orbit ?? 'normal'} ${active ? 'is-active' : ''}`}
                  style={{ top: layout.top, bottom: layout.bottom, left: layout.left, right: layout.right }}
                  aria-pressed={active}
                  onClick={() => selectState(state.id)}
                  disabled={saving}
                >
                  {layout.label}
                </button>
              )
            })}
          </div>

          <p className="emotion-cloudy-guide">点击气泡，把坏情绪交给我</p>
        </main>
      </div>
    )
  }

  return null
}
