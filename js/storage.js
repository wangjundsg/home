const STORAGE_KEY = 'relationshipTool';

window.R = window.R || {};

window.R.getDefaultData = function() {
  const today = new Date().toISOString().split('T')[0];
  return {
    version: 1,
    lastModified: new Date().toISOString(),
    partners: {
      personA: {
        name: '汪俊',
        role: 'A',
        points: 0,
        commitments: [
          { id: 1, text: '不说单字"哦"，用"哦哦/好滴/知道了宝"代替', active: true },
          { id: 2, text: '有需求直接说出来，不让她猜', active: true },
          { id: 3, text: '吵架绝不提分手（红线）', active: true },
          { id: 4, text: '不翻旧账，不攻击家人（红线）', active: true },
          { id: 5, text: '累了就说，允许自己当一会儿小孩', active: true }
        ],
        triggers: [],
        needsWhenAngry: [],
        lovedMoments: []
      },
      personB: {
        name: '小怪兽',
        role: 'B',
        points: 0,
        commitments: [],
        triggers: [],
        needsWhenAngry: [],
        lovedMoments: []
      }
    },
    safeWord: { phrase: 'TA好像饿了', meaning: '我需要被照顾了' },
    emergencyTips: {
      iAmAngry: {
        title: '我现在需要被哄',
        reminder: '别讲理，先接住。',
        dos: [
          '说"我现在很难受，需要你哄哄我"',
          '发送安全词："我好像有点饿了"',
          '深呼吸三次，给TA一个机会'
        ],
        donts: [
          '不翻旧账',
          '不说"那就分手"',
          '不挂电话/不冷战'
        ]
      },
      taIsAngry: {
        title: 'TA生气了，我需要哄人',
        reminder: '别讲理，先接住。',
        dos: [
          '说"我听见了，你现在很难受"',
          '说"我可能没完全懂，但我在这儿"',
          '启动安全词："你是不是有点饿了？"'
        ],
        donts: [
          '不解释、不分析、不讲道理',
          '不说"你又这样"',
          '不沉默/不叹气/不挂电话'
        ]
      },
      weAreGood: {
        title: '我们很好，记录一下',
        reminder: '爱需要被看见。',
        dos: [
          '记录一件今天TA让你感动的事',
          '给TA发一条"想到你我就笑了一下"',
          '往心愿池里加一件下次见面想做的事'
        ],
        donts: []
      }
    },
    checkins: [],
    pointsLog: [],
    rewardRedemptions: [],
    meeting: {
      nextDate: '',
      wishlist: [],
      pastMeetings: []
    },
    compensations: [],
    interactData: {
      默契Scores: [],
      真心话Questions: [],
      真心话Answers: {},
      共同Diary: [],
      songs: [],
      diceHistory: [],
      storyChain: [],
      heartbeatGame: null,
      heartbeatHistory: []
    },
    growthRecords: [],
    phrases: [
      { id: 'p1', scenario: '暂停信号', text: '我现在脑子很乱，先别说了好不好？不是不让解决问题，是我怕说错话伤你。', used: 0 },
      { id: 'p2', scenario: '伸出橄榄枝', text: '我说刚才那些不是想吵赢你，是想让你知道我还在。', used: 0 },
      { id: 'p3', scenario: '翻译需求', text: '我猜，你现在是不是觉得我不够在意你？', used: 0 },
      { id: 'p4', scenario: '修复口令', text: '我们和好吧，我不想带着气过夜。', used: 0 },
      { id: 'p5', scenario: '求助口令', text: '我现在像个抢不到奶的小孩，你可以先当一下妈妈吗？', used: 0 },
      { id: 'p6', scenario: '暂停信号(简版)', text: '我需要冷静20分钟，会回来的，不是要跑。', used: 0 },
      { id: 'p7', scenario: '修复口令(简版)', text: '我们不吵了，我还在。', used: 0 }
    ],
    settings: {
      fontSize: 'medium',
      meetingReminderDays: 3,
      lastExportDate: null
    },
    onboardingComplete: false
  };
};

window.R.load = function() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return window.R.getDefaultData();
    const data = JSON.parse(raw);
    return data;
  } catch {
    return window.R.getDefaultData();
  }
};

window.R.save = function(data) {
  data.lastModified = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save to localStorage');
  }
};

window.R.reset = function() {
  localStorage.removeItem(STORAGE_KEY);
};

window.R.exportJSON = function(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `relationship-data-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.R.importJSON = function(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        resolve(data);
      } catch {
        reject(new Error('文件格式不正确'));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
};

window.R.mergeData = function(existing, imported) {
  const merged = JSON.parse(JSON.stringify(existing));

  if (imported.partners?.personB?.commitments?.length) {
    merged.partners.personB.commitments = imported.partners.personB.commitments;
  }
  if (imported.partners?.personB?.name) {
    merged.partners.personB.name = imported.partners.personB.name;
  }

  const existingCompIds = new Set((merged.compensations || []).map(c => c.id));
  const newComps = (imported.compensations || []).filter(c => !existingCompIds.has(c.id));
  merged.compensations = [...(merged.compensations || []), ...newComps];

  const existingWishIds = new Set((merged.meeting?.wishlist || []).map(w => w.id));
  const newWishes = (imported.meeting?.wishlist || []).filter(w => !existingWishIds.has(w.id));
  merged.meeting = { ...merged.meeting, ...imported.meeting, wishlist: [...(merged.meeting?.wishlist || []), ...newWishes] };

  if (imported.meeting?.nextDate) merged.meeting.nextDate = imported.meeting.nextDate;

  // Merge interact data
  if (imported.interactData) {
    merged.interactData = merged.interactData || {};
    if (imported.interactData.songs) {
      const existingSongIds = new Set((merged.interactData.songs || []).map(s => s.id));
      merged.interactData.songs = [...(merged.interactData.songs || []), ...imported.interactData.songs.filter(s => !existingSongIds.has(s.id))];
    }
    if (imported.interactData.storyChain) {
      const existingStoryIds = new Set((merged.interactData.storyChain || []).map(s => s.id));
      merged.interactData.storyChain = [...(merged.interactData.storyChain || []), ...imported.interactData.storyChain.filter(s => !existingStoryIds.has(s.id))];
    }
    if (imported.interactData.共同Diary) {
      const existingDiaryIds = new Set((merged.interactData.共同Diary || []).map(d => d.id));
      merged.interactData.共同Diary = [...(merged.interactData.共同Diary || []), ...imported.interactData.共同Diary.filter(d => !existingDiaryIds.has(d.id))];
    }
    if (imported.interactData.heartbeatHistory) {
      const existingHeartbeatIds = new Set((merged.interactData.heartbeatHistory || []).map(h => h.id));
      merged.interactData.heartbeatHistory = [
        ...(merged.interactData.heartbeatHistory || []),
        ...imported.interactData.heartbeatHistory.filter(h => !existingHeartbeatIds.has(h.id))
      ];
    }
  }

  merged.lastModified = new Date().toISOString();
  return merged;
};

window.R.getUserRole = function(data) {
  return data.partners?.personA?.name || '我';
};

window.R.getPartnerRole = function(data) {
  return data.partners?.personB?.name || 'TA';
};
