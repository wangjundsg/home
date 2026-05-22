window.R = window.R || {};

window.R.HeartbeatContent = (function() {
  var LEVELS = {
    beginner: { label: '初级', shortLabel: '初级', order: 0, desc: '调情、破冰、轻互动' },
    intermediate: { label: '中级', shortLabel: '中级', order: 1, desc: '升温、感官、轻度挑逗' },
    advanced: { label: '高级', shortLabel: '高级', order: 2, desc: '深度亲密、前戏阶段' },
    final: { label: '最终', shortLabel: '最终', order: 3, desc: '最终亲密阶段、姿势与节奏切换' }
  };

  var LEVEL_ORDER = ['beginner', 'intermediate', 'advanced', 'final'];

  var CELL_TYPES = {
    normal: { label: '普通格', icon: '♡', desc: '抽当前层级任务卡' },
    double: { label: '双抽格', icon: '⧉', desc: '抽两张，二选一' },
    boost: { label: '加码格', icon: '+', desc: '抽卡并追加轻量条件' },
    reverse: { label: '反转格', icon: '⇄', desc: '本回合玩家/伴侣身份互换' },
    choice: { label: '选择格', icon: '◇', desc: '给当前玩家一个轻度选择权' },
    rest: { label: '休息格', icon: '…', desc: '不抽卡，自然缓冲' },
    reward: { label: '奖励格', icon: '☆', desc: '获得一次临时控制权' },
    penalty: { label: '惩罚格', icon: '!', desc: '本回合临时增加强度或限制' },
    reroll: { label: '再掷格', icon: '↻', desc: '派发任务后当前玩家可再掷一次' }
  };

  var CARDS = {
    beginner: [
      { title: '深情凝视', text: '玩家看着伴侣的眼睛，说出一个此刻最吸引自己的地方。' },
      { title: '温柔靠近', text: '玩家用一个很慢的动作靠近伴侣，让对方感受到被选择。' },
      { title: '耳边私语', text: '玩家贴近伴侣耳边，说一句平时不好意思说出口的情话。' },
      { title: '服务时间', text: '玩家为伴侣做一段短暂的放松服务，直到伴侣点头满意。' },
      { title: '手心写字', text: '玩家在伴侣手心写一个字，让伴侣闭眼猜。' },
      { title: '赞美之词', text: '玩家连续说出三个喜欢伴侣的理由，越具体越好。' },
      { title: '呼吸同步', text: '两人靠近并尝试把呼吸调整到同一个节奏。' },
      { title: '角色称呼', text: '接下来一小段时间里，玩家用一个更亲密的称呼叫伴侣。' }
    ],
    intermediate: [
      { title: '绝对服从', text: '玩家获得短暂指挥权，安排伴侣完成一个亲密但可控的小动作。' },
      { title: '视觉封锁', text: '玩家让伴侣闭眼一小段时间，再用声音或触碰引导对方。' },
      { title: '温度差', text: '玩家使用冷热感受制造一次轻微的感官变化。' },
      { title: '气息诱惑', text: '玩家贴近伴侣，用低声描述此刻的感受。' },
      { title: '发号施令', text: '玩家要求伴侣认真赞美自己身上最有吸引力的三个地方。' },
      { title: '心动密码', text: '玩家在伴侣手心或腿上写一个字，猜错则由玩家指定一个小任务。' },
      { title: '权利反转', text: '玩家指定一个规则，让伴侣短暂掌握主动。' },
      { title: '贴近挑战', text: '两人保持很近的距离，谁先笑场就接受一个轻量任务。' }
    ],
    advanced: [
      { title: '边缘控制', text: '玩家主导一段更强烈的亲密节奏，但要在关键处停住。' },
      { title: '乞求恩赐', text: '伴侣需要用撒娇或请求的方式向玩家索要继续。' },
      { title: '玩具登场', text: '如果现场有合适道具，玩家可以把它加入本回合任务。' },
      { title: '掌控节奏', text: '玩家负责节奏，伴侣只能用快、慢、轻、重来反馈。' },
      { title: '强制观看', text: '玩家要求伴侣认真看着自己完成一段亲密动作。' },
      { title: '双重夹击', text: '玩家同时使用两种方式制造感官刺激。' },
      { title: '深呼吸', text: '玩家靠近伴侣最有吸引力的位置，慢慢感受气味和反应。' },
      { title: '主动献上', text: '玩家把主动权交给伴侣，并说清楚自己现在想要什么。' }
    ],
    final: [
      { title: '姿势切换', text: '玩家指定一个新的亲密姿势，并负责带领切换。' },
      { title: '节奏命令', text: '玩家用明确口令控制接下来一段时间的快慢和深浅。' },
      { title: '停机冷却', text: '玩家喊停后，两人保持当前状态不动，感受彼此反应。' },
      { title: '权利反转', text: '玩家把下一段主导权交给伴侣，由伴侣决定节奏。' },
      { title: '语言释放', text: '玩家要求伴侣大声说出此刻最真实的身体感受。' },
      { title: '慢动作回放', text: '接下来一段时间里，两人用很慢的节奏进行。' },
      { title: '倒计时爆发', text: '玩家倒数十秒，两人一起把状态推到更高点。' },
      { title: '温存收束', text: '玩家主导一段更慢、更贴近的收束，让节奏自然落下来。' }
    ]
  };

  var BOOSTS = [
    '本回合动作放慢一倍。',
    '本回合增加一次眼神对视。',
    '本回合由玩家保持称呼，直到下一次掷骰。',
    '本回合伴侣闭眼感受。',
    '本回合玩家需要用更低的声音引导。',
    '本回合时间稍微延长。'
  ];

  var REWARDS = [
    '本回合可降低一级抽卡。',
    '本回合抽两张任选一张。',
    '免除一次加码。',
    '指定下一次先由谁掷骰。',
    '当前任务条件减轻。'
  ];

  var PENALTIES = [
    '本回合临时提高一级抽卡。',
    '本回合追加一个加码条件。',
    '本回合不能换卡。',
    '当前玩家抽卡后再额外掷一次。',
    '下一次掷骰点数翻倍前进。'
  ];

  return {
    levels: LEVELS,
    levelOrder: LEVEL_ORDER,
    cellTypes: CELL_TYPES,
    cards: CARDS,
    boosts: BOOSTS,
    rewards: REWARDS,
    penalties: PENALTIES
  };
})();
