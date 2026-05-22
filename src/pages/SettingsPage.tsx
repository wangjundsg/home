import { useState } from 'react'
import { useIdentity } from '../hooks/useIdentity'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { ConfirmDialog } from '../components/ui'

interface SettingsPageProps {
  identity: string | null
  partnerName: string
  navigate: (route: string) => void
}

export function SettingsPage({ identity, partnerName }: SettingsPageProps) {
  const { setIdentity, setPartnerName } = useIdentity()
  const [editName, setEditName] = useState(identity || '')
  const [editPartner, setEditPartner] = useState(partnerName || '')
  const [showReset, setShowReset] = useState(false)
  const { supported, unsupportedReason, permission, enabled, loading, statusText, togglePush } = usePushSubscription(identity)

  const handleReset = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* 身份 */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <h3 className="font-semibold text-text-primary">👤 修改昵称</h3>
        <div>
          <label className="text-xs text-text-muted">我的昵称</label>
          <input value={editName} onChange={e => setEditName(e.target.value)}
            className="w-full rounded-xl border border-warm-200 px-3 py-2 text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs text-text-muted">TA的昵称</label>
          <input value={editPartner} onChange={e => setEditPartner(e.target.value)}
            className="w-full rounded-xl border border-warm-200 px-3 py-2 text-sm mt-1" />
        </div>
        <button onClick={() => { setIdentity(editName); setPartnerName(editPartner) }}
          className="w-full py-2.5 bg-warm-500 text-white rounded-full text-sm font-medium">
          保存昵称
        </button>
      </div>

      {/* 同步状态 */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-semibold text-text-primary mb-3">☁️ 数据同步</h3>
        <p className="text-sm text-text-secondary">所有共享数据存储在云端，双方实时互通</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-text-muted">已连接至云端</span>
        </div>
      </div>

      {/* 离线暖心推送 */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <h3 className="font-semibold text-text-primary">🔔 离线暖心推送</h3>
        <p className="text-sm text-text-secondary">开启后，就算退出应用，也能收到纪念日、见面日和早晚安的温柔提醒。</p>
        <button
          onClick={() => { void togglePush() }}
          disabled={!supported || loading || !identity}
          className={`w-full min-h-11 rounded-full text-sm font-medium transition ${enabled ? 'bg-warm-500 text-white' : 'bg-warm-100 text-warm-700'} disabled:opacity-60`}
        >
          {!supported
            ? '当前设备暂不支持推送'
            : loading
              ? '处理中...'
              : enabled
                ? '已开启离线推送（点击关闭）'
                : '开启离线推送'}
        </button>
        <p className="text-xs text-text-muted leading-relaxed">
          {statusText || (!supported
            ? unsupportedReason
            : enabled
              ? '每天早上 7:00 和晚上 22:00 都会准时送上一句温暖问候；对方离线时，也会收到一条不刷屏的温柔提醒。'
              : permission === 'denied'
                ? '你已关闭系统通知权限，请在系统设置中开启后再试。'
                : '开启后会自动订阅当前设备，后续可随时关闭。')}
        </p>
      </div>

      {/* 危险操作 */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-semibold text-text-primary mb-3">⚠️ 数据管理</h3>
        <button onClick={() => setShowReset(true)} className="w-full py-3 bg-red-50 text-red-500 rounded-full text-sm font-medium border border-red-200">
          重置所有数据
        </button>
        <p className="text-xs text-text-muted mt-2 text-center">这会清除本地所有数据（云端数据不受影响）</p>
      </div>

      <p className="text-center text-xs text-text-muted pb-4">
        我们的花园 v2.0 · 只属于你们两个人
      </p>

      {showReset && (
        <ConfirmDialog
          title="确认重置"
          message="这将清除所有本地数据并重新加载。云端数据不会受影响。确定要重置吗？"
          onConfirm={handleReset}
          onCancel={() => setShowReset(false)}
        />
      )}
    </div>
  )
}
