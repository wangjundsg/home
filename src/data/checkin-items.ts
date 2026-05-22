export interface CheckinItem {
  id: string
  emoji: string
  text: string
  category: string
  isRedline: boolean
}

export const checkinPool: CheckinItem[] = [
  // 沟通类
  { id: 'c01', emoji: '💬', text: '今日深度聊天≥20分钟', category: '沟通', isRedline: false },
  { id: 'c02', emoji: '🗣️', text: '使用了"我感觉"句式表达情绪', category: '沟通', isRedline: false },
  { id: 'c03', emoji: '🤗', text: '吵架后有做修复仪式（道歉/拥抱/写小纸条）', category: '沟通', isRedline: false },
  { id: 'c04', emoji: '👂', text: '今天认真倾听对方说话≥10分钟，没有打断', category: '沟通', isRedline: false },
  { id: 'c05', emoji: '💕', text: '今天对TA说出了自己的一个真实需求', category: '沟通', isRedline: false },
  { id: 'c06', emoji: '🙏', text: '今天向TA表达了一次感谢', category: '沟通', isRedline: false },
  { id: 'c07', emoji: '💭', text: '今天没有打断对方说话', category: '沟通', isRedline: false },
  { id: 'c08', emoji: '📝', text: '今天给TA写了一段心里话', category: '沟通', isRedline: false },

  // 日常暖意
  { id: 'c09', emoji: '📸', text: '发送了今日"我在"信号（一张日常照片）', category: '日常暖意', isRedline: false },
  { id: 'c10', emoji: '🌅', text: '和TA互道了早安或晚安', category: '日常暖意', isRedline: false },
  { id: 'c11', emoji: '☁️', text: '分享了一张今天看到的天空或风景', category: '日常暖意', isRedline: false },
  { id: 'c12', emoji: '🍜', text: '分享今天吃了什么（照片或描述）', category: '日常暖意', isRedline: false },
  { id: 'c13', emoji: '🎵', text: '分享了一首正在听的歌给TA', category: '日常暖意', isRedline: false },
  { id: 'c14', emoji: '😄', text: '今天让TA笑了（发了好玩的东西/讲了笑话）', category: '日常暖意', isRedline: false },
  { id: 'c15', emoji: '🫂', text: '今天用语言给TA了一个"远程拥抱"', category: '日常暖意', isRedline: false },
  { id: 'c16', emoji: '📱', text: '今天和TA分享了一个有趣的视频或文章', category: '日常暖意', isRedline: false },

  // 异地专属
  { id: 'c17', emoji: '📹', text: '视频通话≥30分钟', category: '异地专属', isRedline: false },
  { id: 'c18', emoji: '🎬', text: '一起线上看了一集剧/一部电影', category: '异地专属', isRedline: false },
  { id: 'c19', emoji: '✈️', text: '今天认真讨论了下次见面的计划', category: '异地专属', isRedline: false },
  { id: 'c20', emoji: '🎮', text: '一起玩了一局线上游戏', category: '异地专属', isRedline: false },
  { id: 'c21', emoji: '📦', text: '今天给对方寄/点了一个小东西', category: '异地专属', isRedline: false },
  { id: 'c22', emoji: '🗺️', text: '一起畅想了未来要一起去的地方', category: '异地专属', isRedline: false },
  { id: 'c23', emoji: '💤', text: '今天连麦睡觉或者一起同时睡觉', category: '异地专属', isRedline: false },
  { id: 'c24', emoji: '🍽️', text: '一起同时吃饭（开着视频或拍照同步）', category: '异地专属', isRedline: false },

  // 自我成长
  { id: 'c25', emoji: '🧠', text: '今天在情绪上来时，先暂停了5分钟再回应', category: '自我成长', isRedline: false },
  { id: 'c26', emoji: '💪', text: '今天主动说出了自己的需求（而不是等对方猜）', category: '自我成长', isRedline: false },
  { id: 'c27', emoji: '🎭', text: '今天扮演了"照顾者"角色，给TA支持和包容', category: '自我成长', isRedline: false },
  { id: 'c28', emoji: '🛑', text: '今天忍住了一次讲道理/说教的冲动', category: '自我成长', isRedline: false },
  { id: 'c29', emoji: '🪞', text: '今天意识到了自己的一个情绪触发点', category: '自我成长', isRedline: false },
  { id: 'c30', emoji: '📖', text: '今天学到了一点关于关系/沟通的新知识', category: '自我成长', isRedline: false },
  { id: 'c31', emoji: '🎯', text: '今天在生气时成功使用了安全词', category: '自我成长', isRedline: false },
  { id: 'c32', emoji: '🏠', text: '今天主动为"我们"做了一件小事', category: '自我成长', isRedline: false },

  // 红线守护
  { id: 'c33', emoji: '🚫', text: '今日无提分手字眼', category: '红线守护', isRedline: true },
  { id: 'c34', emoji: '⏮️', text: '今日无翻旧账', category: '红线守护', isRedline: true },
  { id: 'c35', emoji: '❄️', text: '今日无冷暴力（已读不回/关机/拉黑/不理人）', category: '红线守护', isRedline: true },
  { id: 'c36', emoji: '😤', text: '今日无人身攻击（骂人/贬低/羞辱）', category: '红线守护', isRedline: true },
  { id: 'c37', emoji: '🚪', text: '今日无摔门/摔东西/暴怒发泄', category: '红线守护', isRedline: true },
  { id: 'c38', emoji: '🤐', text: '今日无讽刺挖苦（阴阳怪气/说反话）', category: '红线守护', isRedline: true },
  { id: 'c39', emoji: '👥', text: '今日无搬出第三方比较（"你看别人家XX"）', category: '红线守护', isRedline: true },
  { id: 'c40', emoji: '🔄', text: '今日无反复纠缠同一个问题', category: '红线守护', isRedline: true },

  // 随机掉落
  { id: 'c41', emoji: '🧋', text: '今日偷偷给对方点了奶茶/外卖/小礼物', category: '随机掉落', isRedline: false },
  { id: 'c42', emoji: '🎙️', text: '今天录了一条语音情书发给TA', category: '随机掉落', isRedline: false },
  { id: 'c43', emoji: '🎶', text: '今天同步哼了同一首歌给对方听', category: '随机掉落', isRedline: false },
  { id: 'c44', emoji: '💌', text: '今天给TA发了一条突然的"想你"消息', category: '随机掉落', isRedline: false },
  { id: 'c45', emoji: '🌻', text: '今天拍了一张花/植物发给TA', category: '随机掉落', isRedline: false },
  { id: 'c46', emoji: '🎨', text: '今天画/写了一小段东西给TA（哪怕是火柴人）', category: '随机掉落', isRedline: false },
  { id: 'c47', emoji: '🗓️', text: '今天翻看了你们的旧照片/旧聊天记录', category: '随机掉落', isRedline: false },
  { id: 'c48', emoji: '💤', text: '今天和TA说了"晚安，梦到我"', category: '随机掉落', isRedline: false },
  { id: 'c49', emoji: '🎲', text: '今天和TA玩了一个随机决定的小游戏（猜拳/骰子等）', category: '随机掉落', isRedline: false },
  { id: 'c50', emoji: '🌈', text: '今天发现了一件让TA开心的小事情并做了', category: '随机掉落', isRedline: false },
]
