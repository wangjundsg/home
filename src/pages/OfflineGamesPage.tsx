import { CheckCircle2, Dice5, HeartHandshake, Layers3, PackageCheck, PlayCircle, Spade, Timer } from 'lucide-react'

interface OfflinePhysicalGame {
  title: string
  summary: string
  duration: string
  props: readonly string[]
  quickStart: readonly string[]
  rules: readonly string[]
  stages: readonly {
    name: string
    focus: string
    boss: string
  }[]
  materials: readonly {
    stage: string
    groups: readonly {
      title: string
      items: readonly string[]
    }[]
  }[]
}

const physicalGames: readonly OfflinePhysicalGame[] = [
  {
    title: '心动花色牌',
    summary: '用一副扑克牌完成四阶段实体互动：比牌决定主动方，花色决定互动类型，Boss 门决定是否继续深入。',
    duration: '20-35 分钟',
    props: ['一副扑克牌', '可选计时器', 'App 内规则和花色任务表'],
    quickStart: [
      '选定起始阶段：调情、前戏、深入或最终。',
      '每门双方各出一张牌，点数大的一方成为主动方。',
      '看胜方牌的花色，在当前阶段任务表里选一条执行。',
      '每阶段玩 4 门，第 4 门是 Boss 门，用来确认继续、暂停或停下。',
    ],
    rules: [
      '红桃偏调情，方块偏感官，梅花偏动作，黑桃偏反转或选择权。',
      'A-5 选轻度任务，6-10 选标准任务，J/Q/K 触发事件任务。',
      'J 表示主动方二选一，Q 表示回应方拥有改写权，K 表示本门可延长一次或降一级执行。',
      'Joker 是暂停、跳过或重洗本门，任何一方都可以无解释使用。',
      '牌面只决定互动类型，不代表必须完成或必须升级。',
    ],
    stages: [
      { name: '调情', focus: '眼神、夸奖、轻触、喂食和靠近。', boss: '第 4 门确认是否进入前戏，或停留在轻松调情。' },
      { name: '前戏', focus: '亲吻、感官、服装变化和节奏试探。', boss: '第 4 门确认是否进入深入，或选择降回调情。' },
      { name: '深入', focus: '主导回应、身体靠近、节奏控制和明确选择权。', boss: '第 4 门确认是否进入最终，按更保守的一方决定。' },
      { name: '最终', focus: '更深亲密前的确认、节奏照顾、收束和温存。', boss: '第 4 门作为结束门，不自动重开，不记录细节。' },
    ],
    materials: [
      {
        stage: '调情',
        groups: [
          { title: '红桃', items: ['主动方说出对方今天最让自己心动的一个细节。', '双方对视 10 秒，回应方决定是否靠近一步。'] },
          { title: '方块', items: ['主动方喂对方一小口安全食物，对方评价味道和心情。', '用一种香气或饮品制造开场氛围。'] },
          { title: '梅花', items: ['主动方邀请对方换一个更靠近的位置。', '主动方做一个轻触动作，回应方选择位置或时长。'] },
          { title: '黑桃', items: ['回应方改写本门任务为更轻或更慢的版本。', '双方互换主动方，本门只做一句请求和一句回应。'] },
        ],
      },
      {
        stage: '前戏',
        groups: [
          { title: '红桃', items: ['主动方用一句话描述接下来想让氛围变成什么样。', '回应方指定一个亲近方式，主动方按更轻版本执行。'] },
          { title: '方块', items: ['用食物、饮品或温度制造一次感官试探。', '主动方让对方闭眼闻一种味道，再说出联想到的画面。'] },
          { title: '梅花', items: ['主动方提出一个姿势或距离变化，回应方可以调整。', '双方用 30 秒把节奏放慢，不急着进入下一步。'] },
          { title: '黑桃', items: ['回应方获得本门指挥权，可以降级、暂停或换任务。', '本门改为只用语言，不做动作。'] },
        ],
      },
      {
        stage: '深入',
        groups: [
          { title: '红桃', items: ['主动方说清楚想继续的方向，回应方回答愿意、慢一点或换一种。', '双方各说一个现在最舒服的点。'] },
          { title: '方块', items: ['选择一个安全道具辅助氛围，先确认再使用。', '主动方设计一次感官节奏，回应方随时可以喊停。'] },
          { title: '梅花', items: ['主动方拥有 1 分钟节奏权，回应方保留随时修改权。', '双方约定一个动作边界，然后只在边界内互动。'] },
          { title: '黑桃', items: ['本门降一级执行，并由回应方决定结束点。', '主动方和回应方互换，重新选择更适合的任务。'] },
        ],
      },
      {
        stage: '最终',
        groups: [
          { title: '确认', items: ['双方先各说一句明确确认：继续、慢一点、换方式或停下。', '任一方选择降级时，直接回到深入或前戏素材。'] },
          { title: '收束', items: ['本门默认可以结束整局，并转入拥抱、聊天或休息。', '把注意力放在舒适、节奏和事后照顾。'] },
        ],
      },
    ],
  },
  {
    title: '秘密道具宴',
    summary: '用骰子、食物、服装和触感小道具推进四阶段，让真实道具成为互动本体。',
    duration: '18-30 分钟',
    props: ['一颗骰子', '3-6 种安全食物', '2-4 件服装或配饰', '触感小道具'],
    quickStart: [
      '摆好食物、服装/配饰、触感道具，先排除任何不舒服的物品。',
      '选择起始阶段，每阶段玩 4 轮。',
      '每轮掷骰，按点数查当前阶段的道具任务。',
      '第 4 轮是 Boss 轮，双方必须表达继续、暂停、降级或结束。',
    ],
    rules: [
      '1 是食物，2 是服装/配饰，3 是触感道具，4 是语言指令，5 是对方选择，6 是双方共同完成。',
      '骰子只决定道具类型，不决定强度；强度由当前阶段和双方状态决定。',
      '如果掷到当前没有准备的道具类型，可以改为 5 点“对方选择”。',
      '连续两轮有人选择跳过或降级时，本阶段直接进入休息或结束。',
      '最终阶段只做确认、节奏和照顾方向，不让骰子自动推进现实行为。',
    ],
    stages: [
      { name: '调情', focus: '轻松尝试食物、配饰、眼神和语言。', boss: '第 4 轮确认是否进入前戏，允许停在约会氛围。' },
      { name: '前戏', focus: '更多感官试探、亲近距离和氛围变化。', boss: '第 4 轮确认是否进入深入，任何一方可选择降级。' },
      { name: '深入', focus: '主导回应、身体靠近、节奏控制和明确边界。', boss: '第 4 轮只在双方都明确愿意时进入最终。' },
      { name: '最终', focus: '继续前确认、过程中照顾、结束后的温存。', boss: '第 4 轮默认收束整局，不自动重开。' },
    ],
    materials: [
      {
        stage: '调情',
        groups: [
          { title: '1 食物', items: ['喂对方一小口，对方说一个今天的心情词。', '选一种味道当今晚的开场暗号。'] },
          { title: '2 服装', items: ['换上一件更有约会感的外套或配饰。', '对方选择一个小配饰，主动方戴 1 轮。'] },
          { title: '3 触感', items: ['用柔软布料轻碰手背或手臂。', '用温杯外壁制造一次短暂触感。'] },
          { title: '4-6 选择', items: ['说一句请求，对方只回答愿意、慢一点或换一个。', '双方共同摆出一个更靠近的坐姿。'] },
        ],
      },
      {
        stage: '前戏',
        groups: [
          { title: '1 食物', items: ['主动方用食物制造一次慢节奏喂食。', '回应方选择味道、距离和是否继续。'] },
          { title: '2 服装', items: ['选择一件能改变氛围的衣物或配饰。', '回应方决定保留、换掉或只看一轮。'] },
          { title: '3 触感', items: ['用道具制造 30 秒感官试探，随时可停。', '主动方先说明会怎么做，再等待回应方点头。'] },
          { title: '4-6 选择', items: ['对方给出二选一：更近一点或更慢一点。', '双方共同决定下一轮使用哪类道具。'] },
        ],
      },
      {
        stage: '深入',
        groups: [
          { title: '1 食物', items: ['把食物任务改成节奏任务：慢、停、靠近、照顾。', '回应方指定结束点，主动方负责遵守。'] },
          { title: '2 服装', items: ['服装只用于氛围，不用于压力；对方拥有修改权。', '双方一起决定是否保留当前氛围进入下一轮。'] },
          { title: '3 触感', items: ['选一种明确安全的触感方式，先确认边界。', '主动方执行 1 分钟内的轻重变化，回应方随时调整。'] },
          { title: '4-6 选择', items: ['回应方拥有本轮完整选择权。', '双方共同说出继续前最重要的一条边界。'] },
        ],
      },
      {
        stage: '最终',
        groups: [
          { title: '确认', items: ['双方轮流说继续、慢一点、换方式或停下。', '如果出现犹豫，立刻降级到深入或前戏。'] },
          { title: '照顾', items: ['选择一种结束后会让彼此舒服的小照顾。', '本轮可以直接收束整局，进入温存。'] },
        ],
      },
    ],
  },
]

function GuideList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map(item => (
        <li key={item} className="flex gap-2 text-xs font-semibold leading-relaxed text-text-secondary">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-warm-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function OfflineGamesPage() {
  return (
    <div className="pixel-page flex min-h-full flex-col gap-4 px-4 pt-4 pb-8">
      <section className="pixel-hero shrink-0 p-5">
        <div className="relative z-10">
          <p className="text-xs font-semibold leading-[1.45] text-white/75">扑克牌、骰子和道具直接开玩</p>
          <h2 className="mt-1 text-xl font-black leading-tight tracking-tight">实体线下游戏</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">手机只查规则和素材，不判定输赢、不保存敏感过程。</p>
        </div>
      </section>

      <section className="rounded-2xl bg-pink-50/80 p-3">
        <h3 className="flex items-center gap-2 text-xs font-black text-pink-700">
          <HeartHandshake size={15} />
          共用安全规则
        </h3>
        <GuideList items={['任一方说暂停、跳过或停止时立即生效。', 'Boss 轮按更保守的一方决定，不说服对方升级。', '食物、服装和道具必须安全、干净、舒适。']} />
      </section>

      {physicalGames.map(game => (
        <article key={game.title} className="pixel-card p-4">
          <p className="text-xs font-black text-pink-500">2 人 · {game.duration}</p>
          <h3 className="mt-1 text-lg font-black text-text-primary">{game.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{game.summary}</p>

          <section className="mt-4 rounded-2xl bg-warm-500 p-3 text-white">
            <h4 className="flex items-center gap-2 text-xs font-black">
              <Timer size={15} />
              1 分钟开局
            </h4>
            <ol className="mt-2 space-y-2">
              {game.quickStart.map((item, index) => (
                <li key={item} className="flex gap-2 text-xs font-semibold leading-relaxed text-white/90">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-black">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-3 grid gap-3">
            <section className="rounded-2xl border border-warm-100 bg-white/70 p-3">
              <h4 className="flex items-center gap-2 text-xs font-black text-text-primary">
                <PackageCheck size={15} className="text-warm-500" />
                准备物品
              </h4>
              <GuideList items={game.props} />
            </section>

            <section className="rounded-2xl border border-warm-100 bg-white/70 p-3">
              <h4 className="flex items-center gap-2 text-xs font-black text-text-primary">
                {game.title === '心动花色牌' ? <Spade size={15} className="text-warm-500" /> : <Dice5 size={15} className="text-warm-500" />}
                完整规则
              </h4>
              <GuideList items={game.rules} />
            </section>

            <section className="rounded-2xl border border-warm-100 bg-white/70 p-3">
              <h4 className="flex items-center gap-2 text-xs font-black text-text-primary">
                <Layers3 size={15} className="text-warm-500" />
                四阶段进程
              </h4>
              <div className="mt-2 grid gap-2">
                {game.stages.map(stage => (
                  <div key={stage.name} className="rounded-xl bg-warm-50 p-3">
                    <h5 className="text-xs font-black text-text-primary">{stage.name}</h5>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-text-secondary">{stage.focus}</p>
                    <p className="mt-1 text-[11px] font-bold leading-relaxed text-warm-600">{stage.boss}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-warm-100 bg-white/70 p-3">
              <h4 className="flex items-center gap-2 text-xs font-black text-text-primary">
                <PlayCircle size={15} className="text-warm-500" />
                任务素材入口
              </h4>
              <div className="mt-2 space-y-3">
                {game.materials.map(section => (
                  <div key={section.stage} className="rounded-xl bg-white p-3 ring-1 ring-warm-100">
                    <h5 className="text-xs font-black text-pink-600">{section.stage}</h5>
                    <div className="mt-2 grid gap-2">
                      {section.groups.map(group => (
                        <div key={group.title} className="rounded-lg bg-warm-50/80 p-2">
                          <p className="text-[11px] font-black text-text-primary">{group.title}</p>
                          <ul className="mt-1 space-y-1">
                            {group.items.map(item => (
                              <li key={item} className="text-[11px] font-semibold leading-relaxed text-text-secondary">· {item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>
      ))}
    </div>
  )
}
