import { useState, useMemo, useCallback } from 'react'
import { CheckCircle, FileText, CalendarHeart, Sprout, MessageSquare, Cake, BarChart3, CalendarDays, Heart, Settings, Gift } from 'lucide-react'
import { useIdentity } from './hooks/useIdentity'
import { useMigration } from './hooks/useMigration'
import { useWarmReminders } from './hooks/useWarmReminders'
import { useDataWarmup } from './hooks/useDataWarmup'
import { Header } from './components/ui/Header'
import { BottomNav } from './components/ui/BottomNav'
import { OnboardingPage } from './pages/OnboardingPage'
import { HomePage } from './pages/HomePage'
import { DailyPage } from './pages/DailyPage'
import { InteractPage } from './pages/InteractPage'
import { CoupleSpacePage } from './pages/CoupleSpacePage'
import { AgreementsPage } from './pages/AgreementsPage'
import { MeetingPage } from './pages/MeetingPage'
import { GrowthPage } from './pages/GrowthPage'
import { PhrasesPage } from './pages/PhrasesPage'
import { AnniversaryPage } from './pages/AnniversaryPage'
import { PointsLogPage } from './pages/PointsLogPage'
import { PeriodPage } from './pages/PeriodPage'
import { IntimacyPage } from './pages/IntimacyPage'
import { SettingsPage } from './pages/SettingsPage'
import { EmotionStationPage } from './pages/EmotionStationPage'
import { InteractionMaterialsPage } from './pages/InteractionMaterialsPage'
import { InteractionMaterialLibraryPage } from './pages/InteractionMaterialLibraryPage'
import { PrivateOfflineGamesPage } from './pages/PrivateOfflineGamesPage'
import { OfflineGamesPage } from './pages/OfflineGamesPage'
import { PrivateFlyingChessPage } from './pages/PrivateFlyingChessPage'
import { TwoPlayerChallengePage } from './pages/TwoPlayerChallengePage'
import { TruthBox } from './components/interact/TruthBox'
import { MatchBox } from './components/interact/MatchBox'
import { DoodleCanvas } from './components/interact/DoodleCanvas'
import { SharedDiary } from './components/interact/SharedDiary'
import { RelayStory } from './components/interact/RelayStory'
import { DiceGame } from './components/interact/DiceGame'
import { TruthDarePerson } from './components/interact/TruthDarePerson'
import { WheelGame } from './components/interact/WheelGame'

const MAIN_SCREENS: Record<string, string> = {
  '/': '首页',
  '/space': '情侣空间',
  '/interact': '互动中心',
}

const SUB_SCREENS: Record<string, string> = {
  '/daily': '每日打卡',
  '/agreements': '承诺墙',
  '/meeting': '见面管理',
  '/growth': '成长层',
  '/phrases': '启动句库',
  '/anniversary': '纪念日',
  '/points-log': '积分明细',
  '/period': '经期记录',
  '/intimacy': '爱爱记录',
  '/settings': '设置',
  '/emotion/good': '我们都好',
  '/emotion/sweet': '我们的小确幸',
  '/emotion/cloudy': '心里有个小乌云',
  '/interact/materials': '互动素材库',
  '/interact/materials/beginner': '初级素材库',
  '/interact/materials/intermediate': '中级素材库',
  '/interact/materials/advanced': '高级素材库',
  '/interact/materials/finale': '最终素材库',
  '/interact/private': '线上游戏',
  '/interact/online-games': '线上游戏',
  '/interact/offline-games': '线下游戏',
  '/interact/private/games': '线上游戏',
  '/interact/private/flying-chess': '双人心跳棋',
  '/interact/private/two-player-challenge': '双人默契闯关',
  '/interact/truth': '真心话盲盒',
  '/interact/match': '默契大考验',
  '/interact/doodle': '心情大涂鸦',
  '/interact/diary': '共同日记',
  '/interact/story': '接力故事',
  '/interact/dice': '掷骰子比大小',
  '/interact/truthdare': '真心话大冒险',
  '/interact/wheel': '奖惩转盘',
}

const MENU_SCREENS = Object.entries(SUB_SCREENS).filter(([key]) => !key.startsWith('/interact/') && !key.startsWith('/emotion/'))

export default function App() {
  const { identity, partnerName, setIdentity, setPartnerName, ready } = useIdentity()
  const { hasV1Data, migrating, migrated, migratedCount, migrate, skip } = useMigration(identity)
  const { reminder: warmReminder } = useWarmReminders(identity, partnerName)
  useDataWarmup(identity)
  const [screen, setScreen] = useState('/')
  const [screenHistory, setScreenHistory] = useState<string[]>([])
  const [showMenu, setShowMenu] = useState(false)

  const currentTitle = useMemo(() => {
    return MAIN_SCREENS[screen] || SUB_SCREENS[screen] || ''
  }, [screen])

  const isMainScreen = useMemo(() => screen in MAIN_SCREENS, [screen])
  const isSubScreen = useMemo(() => !(screen in MAIN_SCREENS), [screen])
  const isEmotionScreen = screen.startsWith('/emotion/')

  const navigate = useCallback((route: string) => {
    setScreenHistory(prev => [...prev, screen])
    setScreen(route)
    setShowMenu(false)
  }, [screen])

  const goBack = useCallback(() => {
    if (screenHistory.length === 0) {
      setScreen('/')
      return
    }
    const last = screenHistory[screenHistory.length - 1]
    setScreenHistory(prev => prev.slice(0, -1))
    setScreen(last)
  }, [screenHistory])

  const navigateTab = useCallback((route: string) => {
    setScreenHistory([])
    setScreen(route)
    setShowMenu(false)
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <p className="text-text-muted animate-pulse">加载中...</p>
      </div>
    )
  }

  if (!identity) {
    return <OnboardingPage onComplete={(name, pName) => { setIdentity(name); setPartnerName(pName) }} />
  }

  if (hasV1Data) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">检测到旧版本数据</h2>
          <p className="text-text-secondary text-sm mb-6">
            我们在你的手机中发现了旧版"我们的花园"的数据。要把它迁移到云端吗？迁移后你和TA都能看到这些记录。
          </p>
          <div className="space-y-3">
            <button onClick={migrate} disabled={migrating}
              className="w-full py-3 bg-warm-500 text-white rounded-full font-semibold text-sm">
              {migrating ? '迁移中...' : '迁移到云端'}
            </button>
            <button onClick={skip}
              className="w-full py-3 border border-warm-200 text-text-secondary rounded-full text-sm">
              跳过（数据保留在本地）
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (migrated) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">迁移完成！</h2>
          <p className="text-text-secondary text-sm mb-6">
            已成功迁移 {migratedCount} 条记录到云端。旧数据已备份在本地。
          </p>
          <button onClick={() => window.location.reload()}
            className="w-full py-3 bg-warm-500 text-white rounded-full font-semibold text-sm">
            进入我们的花园 🌸
          </button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    const props = { identity, partnerName, navigate }
    switch (screen) {
      case '/': return <HomePage {...props} warmReminder={warmReminder} />
      case '/space': return <CoupleSpacePage {...props} />
      case '/interact': return <InteractPage {...props} />
      case '/daily': return <DailyPage {...props} />
      case '/agreements': return <AgreementsPage identity={identity} navigate={navigate} />
      case '/meeting': return <MeetingPage identity={identity} navigate={navigate} />
      case '/growth': return <GrowthPage identity={identity} partnerName={partnerName} navigate={navigate} />
      case '/phrases': return <PhrasesPage identity={identity} navigate={navigate} />
      case '/anniversary': return <AnniversaryPage identity={identity} navigate={navigate} />
      case '/points-log': return <PointsLogPage identity={identity} navigate={navigate} />
      case '/period': return <PeriodPage identity={identity} navigate={navigate} />
      case '/intimacy': return <IntimacyPage identity={identity} navigate={navigate} />
      case '/settings': return <SettingsPage identity={identity} partnerName={partnerName} navigate={navigate} />
      case '/emotion/good': return <EmotionStationPage identity={identity} navigate={navigate} category="good" />
      case '/emotion/sweet': return <EmotionStationPage identity={identity} navigate={navigate} category="sweet" />
      case '/emotion/cloudy': return <EmotionStationPage identity={identity} navigate={navigate} category="cloudy" />
      case '/interact/materials': return <InteractionMaterialsPage navigate={navigate} />
      case '/interact/materials/beginner': return <InteractionMaterialLibraryPage level="beginner" navigate={navigate} />
      case '/interact/materials/intermediate': return <InteractionMaterialLibraryPage level="intermediate" navigate={navigate} />
      case '/interact/materials/advanced': return <InteractionMaterialLibraryPage level="advanced" navigate={navigate} />
      case '/interact/materials/finale': return <InteractionMaterialLibraryPage level="finale" navigate={navigate} />
      case '/interact/materials/truth':
      case '/interact/materials/dare':
      case '/interact/materials/rewards':
      case '/interact/materials/match':
      case '/interact/materials/doodle':
      case '/interact/materials/tasks':
      case '/interact/materials/dice':
      case '/interact/materials/private': return <InteractionMaterialsPage navigate={navigate} />
      case '/interact/private': return <PrivateOfflineGamesPage navigate={navigate} />
      case '/interact/online-games': return <PrivateOfflineGamesPage navigate={navigate} />
      case '/interact/offline-games': return <OfflineGamesPage navigate={navigate} />
      case '/interact/private/games': return <PrivateOfflineGamesPage navigate={navigate} />
      case '/interact/private/flying-chess': return <PrivateFlyingChessPage identity={identity} partnerName={partnerName} navigate={navigate} />
      case '/interact/private/two-player-challenge': return <TwoPlayerChallengePage identity={identity} partnerName={partnerName} navigate={navigate} />
      case '/interact/truth': return <TruthBox {...props} />
      case '/interact/match': return <MatchBox {...props} />
      case '/interact/doodle': return <DoodleCanvas {...props} />
      case '/interact/diary': return <SharedDiary {...props} />
      case '/interact/story': return <RelayStory {...props} />
      case '/interact/dice': return <DiceGame identity={identity} partnerName={partnerName} />
      case '/interact/truthdare': return <TruthDarePerson />
      case '/interact/wheel': return <WheelGame />
      default: return <HomePage {...props} warmReminder={warmReminder} />
    }
  }

  return (
    <div className="pixel-page h-dvh w-full max-w-full overflow-hidden flex flex-col">
      {!isEmotionScreen && (
        <Header
          title={currentTitle}
          showBack={isSubScreen || screen === '/settings'}
          onBack={goBack}
          showMenu={isMainScreen}
          onMenu={() => setShowMenu(!showMenu)}
          showSettings={isMainScreen}
          onSettings={() => navigate('/settings')}
          identity={identity}
        />
      )}
      <main className={`min-h-0 flex-1 w-full max-w-full overflow-x-hidden page-enter ${isEmotionScreen ? 'emotion-screen-content overflow-hidden pt-0' : `pt-1 ${isMainScreen ? 'main-screen-content' : 'overflow-y-auto'}`}`}>
        {renderPage()}
      </main>
      {isMainScreen && (
        <BottomNav current={screen} onNavigate={navigateTab} />
      )}

      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}>
          <div className="fixed top-12 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50" onClick={e => e.stopPropagation()}>
            <div className="mx-4 rounded-3xl border border-warm-100/75 bg-white/80 p-2 shadow-[0_18px_34px_rgba(61,44,46,0.1)] backdrop-blur-xl" style={{ animation: 'scaleIn 0.2s ease' }}>
              {MENU_SCREENS.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => navigate(key)}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-text-secondary hover:bg-warm-50 active:text-warm-600"
                >
                  <span className="text-base">{getMenuIcon(key)}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

function getMenuIcon(key: string) {
  const size = 16
  const className = "text-warm-500"
  switch (key) {
    case '/daily': return <Gift size={size} className={className} />
    case '/agreements': return <FileText size={size} className={className} />
    case '/meeting': return <CalendarHeart size={size} className={className} />
    case '/growth': return <Sprout size={size} className={className} />
    case '/phrases': return <MessageSquare size={size} className={className} />
    case '/anniversary': return <Cake size={size} className={className} />
    case '/points-log': return <BarChart3 size={size} className={className} />
    case '/period': return <CalendarDays size={size} className={className} />
    case '/intimacy': return <Heart size={size} className={className} />
    case '/settings': return <Settings size={size} className={className} />
    default: return <CheckCircle size={size} className={className} />
  }
}
