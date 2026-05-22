export interface PrivateOfflineGameGuide {
  key: string
  title: string
  summary: string
  duration: string
  props: readonly string[]
  setupSteps: readonly string[]
  playSteps: readonly string[]
  safetyRules: readonly string[]
  materialRoute?: string
}

export const privateOfflineGameGuides: readonly PrivateOfflineGameGuide[] = [
  {
    key: 'boundary-confirmation',
    title: '边界确认局',
    summary: '先把舒适区、可暂停信号和今天不玩的内容说清楚，再进入轻量互动。',
    duration: '8-12 分钟',
    props: ['纸笔或备忘录', '计时器', '双方都认可的停止词'],
    setupSteps: [
      '各自写下今天想尝试、可以考虑、明确不做的范围。',
      '一起确认停止词、暂停手势和跳过规则。',
      '从素材库挑选适合今天状态的奖励或惩罚，不临场加码。',
    ],
    playSteps: [
      '轮流读出自己的边界和期待，对方只确认理解，不催促解释。',
      '每轮只选择一个轻量互动目标，并约定完成后的照顾方式。',
      '结束时复盘“舒服 / 一般 / 下次不要”，把结论留给下次使用。',
    ],
    safetyRules: [
      '任一方说暂停、跳过或停止时立即生效。',
      '不把沉默当作同意，所有升级都需要明确确认。',
      '不使用临时编造的高压惩罚。',
    ],
    materialRoute: '/interact/materials',
  },
  {
    key: 'prop-quest',
    title: '道具寻宝局',
    summary: '把安全、干净、舒适的普通道具变成线索任务，重点是合作和沟通。',
    duration: '12-18 分钟',
    props: ['3-5 个安全普通道具', '收纳盒', '提示卡'],
    setupSteps: [
      '只选择双方都认可、安全干净、不会造成不适的道具。',
      '给每个道具写一个非露骨提示，例如颜色、位置或共同回忆。',
      '提前决定找到道具后抽取奖励、任务或事件卡。',
    ],
    playSteps: [
      '一方给提示，另一方寻找对应道具。',
      '找到后一起从互动素材库抽一张符合当前阶段的卡。',
      '每完成一轮都确认舒适度，再决定是否继续下一件道具。',
    ],
    safetyRules: [
      '道具不舒适、不干净或来源不明时不用。',
      '不蒙眼、不限制移动，避免跌倒或误碰。',
      '发现不适立即停下，换成聊天或休息。',
    ],
    materialRoute: '/interact/materials',
  },
  {
    key: 'dice-contract',
    title: '骰子合约局',
    summary: '用骰子决定回合顺序和素材类型，规则固定，避免临场压力。',
    duration: '10-15 分钟',
    props: ['一颗骰子', '规则卡', '素材库'],
    setupSteps: [
      '先写好 1-3 点与 4-6 点分别对应的素材类型。',
      '约定每人每局至少拥有一次免费跳过。',
      '确认今天最高只玩到双方都认可的阶段。',
    ],
    playSteps: [
      '轮流掷骰，根据点数抽取对应类型素材。',
      '执行前由当前玩家复述自己理解的规则和边界。',
      '完成、跳过或暂停后都轮到下一位，不追问原因。',
    ],
    safetyRules: [
      '骰子只决定类型，不代表必须完成。',
      '不得因为点数要求对方升级阶段。',
      '连续两次不舒服时直接结束本局。',
    ],
    materialRoute: '/interact/materials',
  },
  {
    key: 'reward-menu',
    title: '奖励菜单局',
    summary: '双方先共同制定温和奖励菜单，再用完成感推动互动。',
    duration: '10-20 分钟',
    props: ['奖励菜单', '便签或手机备忘录', '计时器'],
    setupSteps: [
      '各写 3 个想收到的照顾、奖励或陪伴方式。',
      '删除任何让一方犹豫、尴尬或不舒服的选项。',
      '从素材库补充轻量奖励或惩罚，保持非强迫。',
    ],
    playSteps: [
      '轮流抽取或选择一个小目标，完成后领取菜单奖励。',
      '如果有人跳过，改为选择一个低强度奖励或休息。',
      '最后各选一个“下次还想保留”的规则。',
    ],
    safetyRules: [
      '奖励不能变成交换压力或欠账。',
      '惩罚必须轻量、可拒绝、可替换。',
      '不记录敏感细节，只保留边界和偏好。',
    ],
    materialRoute: '/interact/materials',
  },
]
