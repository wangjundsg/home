export interface EmergencyTip {
  id: string
  text: string
  isDo: boolean
}

export interface EmergencySection {
  reminders: string[]
  dos: EmergencyTip[]
  donts: EmergencyTip[]
}

export const iAmAngry: EmergencySection = {
  reminders: [
    '情绪是暂时的，话说出口就收不回来了',
    '她现在可能比你更害怕，害怕失去你',
    '先暂停5分钟，再做决定'
  ],
  dos: [
    { id: 'do1', text: '用"我感觉"而不是"你总是"开头', isDo: true },
    { id: 'do2', text: '说出你真正的需求，而不是指责', isDo: true },
    { id: 'do3', text: '用安全词暂停，说"我需要冷静一下"', isDo: true }
  ],
  donts: [
    { id: 'dont1', text: '不提分手两个字', isDo: false },
    { id: 'dont2', text: '不翻旧账', isDo: false },
    { id: 'dont3', text: '不冷暴力（已读不回/关机/拉黑）', isDo: false }
  ]
}

export const taIsAngry: EmergencySection = {
  reminders: [
    '她发火可能是因为别的事，不一定是你的错',
    '先接住情绪，再解决问题',
    '你的平静能帮她稳定下来'
  ],
  dos: [
    { id: 'do4', text: '先倾听，不急着讲道理', isDo: true },
    { id: 'do5', text: '说"我在听，你慢慢说"', isDo: true },
    { id: 'do6', text: '问她"你现在最需要什么？"', isDo: true }
  ],
  donts: [
    { id: 'dont4', text: '不说"你又来了"或"你每次都这样"', isDo: false },
    { id: 'dont5', text: '不打断她的话', isDo: false },
    { id: 'dont6', text: '不要在她哭的时候讲道理', isDo: false }
  ]
}

export const weAreGood: EmergencySection = {
  reminders: [
    '珍惜现在的平静，这是给感情的"存款"',
    '记录下这一刻的甜蜜',
    '你们都在努力，这本身就值得庆祝'
  ],
  dos: [
    { id: 'do7', text: '记录一个被爱的瞬间', isDo: true },
    { id: 'do8', text: '告诉TA今天你感激TA的一件事', isDo: true },
    { id: 'do9', text: '给对方发一张日常照片', isDo: true }
  ],
  donts: [
    { id: 'dont7', text: '不要因为太平静就觉得无聊', isDo: false },
    { id: 'dont8', text: '不要忽视对方的小情绪信号', isDo: false }
  ]
}

export const defaultSafeWord = {
  phrase: 'TA好像饿了',
  meaning: '当我们中的一个人感觉到冲突在升级，说出这句话意味着：我们先暂停，不是要逃跑，而是需要冷静一下再继续。就像饿了的人容易暴躁，先"吃点东西"再回来。'
}
