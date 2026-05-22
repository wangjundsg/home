export interface StarterPhrase {
  id: string
  scenario: string
  text: string
}

export const starterPhrases: StarterPhrase[] = [
  { id: 'p1', scenario: '暂停信号', text: 'TA好像饿了，我们先吃点东西再聊好吗？' },
  { id: 'p2', scenario: '伸出橄榄枝', text: '我不想和你吵架，我只想和你好好在一起。' },
  { id: 'p3', scenario: '翻译需求', text: '我现在需要的不是建议，只是一个抱抱。' },
  { id: 'p4', scenario: '修复口令', text: '刚才我说的话太重了，对不起。我真实想说的是……' },
  { id: 'p5', scenario: '求助口令', text: '我现在很难受，你能陪陪我吗？不用说话，就陪着就行。' },
  { id: 'p6', scenario: '日常暖心', text: '今天有件事让我特别想你……' },
  { id: 'p7', scenario: '自定义', text: '' }
]
