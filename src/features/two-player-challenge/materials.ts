import { extractPlaceholders } from './template'
import type { ChallengeMaterial, StageKey, TaskMode } from './types'

export const challengeMaterials: ChallengeMaterial[] = [
  {
    "id": "dungeon_beginner_directed_001",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 靠近 {target} 的耳边，用只有两人能听见的声音夸赞对方的嘴唇。",
    "intensity": 2,
    "tags": [
      "耳语挑逗",
      "主动靠近"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_002",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 隔着衣服轻轻从 {target} 的肩膀抚摸到腰侧，暧昧地停留十秒钟。",
    "intensity": 2,
    "tags": [
      "隔衣抚摸",
      "身体探索"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_003",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 捧起 {target} 的脸颊，在对方的鼻尖和嘴唇边缘轻轻落下一吻。",
    "intensity": 2,
    "tags": [
      "捧脸",
      "轻吻"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_004",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 深情凝视 {target} 的眼睛，慢慢靠近直到鼻尖几乎相碰，保持十秒。",
    "intensity": 2,
    "tags": [
      "深情凝视",
      "张力拉满"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_005",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 亲吻 {target} 的锁骨处，并用指腹轻轻摩挲对方的颈侧肌肤。",
    "intensity": 2,
    "tags": [
      "锁骨亲吻",
      "轻度挑逗"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_006",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 从背后轻轻拥抱 {target}，将下巴搁在对方的肩膀上深呼吸三次。",
    "intensity": 2,
    "tags": [
      "背后拥抱",
      "气息试探"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_007",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 拉起 {target} 的手，在对方的手腕内侧落下一个极其轻柔的吻。",
    "intensity": 2,
    "tags": [
      "手腕亲吻",
      "温柔对待"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_008",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 注视着 {target}，用手指轻轻描摹对方的眉眼和脸部轮廓。",
    "intensity": 2,
    "tags": [
      "指尖描摹",
      "眼神拉丝"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_009",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 靠在 {target} 的肩膀上，说出对方今晚最让自己心动的一个瞬间。",
    "intensity": 2,
    "tags": [
      "心动告白",
      "依偎"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_010",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 轻轻挑起 {target} 的下巴，眼神暧昧地打量对方，维持二十秒不许笑。",
    "intensity": 2,
    "tags": [
      "挑下巴",
      "暧昧打量"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_011",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 将手放在 {target} 的腿侧隔衣轻抚，同时直视对方的眼睛。",
    "intensity": 2,
    "tags": [
      "腿侧轻触",
      "眼神锁定"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_012",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 亲吻 {target} 的耳垂，并轻轻往对方耳道边缘吹一口气。",
    "intensity": 2,
    "tags": [
      "耳垂亲吻",
      "气息挑逗"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_013",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 贴近 {target} 的后背，双手环住对方的腰，安静地感受彼此的心跳。",
    "intensity": 2,
    "tags": [
      "后背贴近",
      "环抱"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_014",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 慢慢凑近 {target}，在距离嘴唇只有一厘米的地方停下，保持十秒。",
    "intensity": 2,
    "tags": [
      "距离试探",
      "呼吸交错"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_015",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 用指尖顺着 {target} 的脊椎线条隔衣缓缓滑下，挑逗对方的神经。",
    "intensity": 2,
    "tags": [
      "背部抚摸",
      "指尖挑逗"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_016",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 看着 {target}，用最温柔的语气夸奖对方身上最性感的一个部位。",
    "intensity": 2,
    "tags": [
      "性感夸奖",
      "语言挑逗"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_017",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 轻轻拨开 {target} 颈边的头发，在那里留下一个长达十秒的吻。",
    "intensity": 2,
    "tags": [
      "颈侧长吻",
      "温柔攻势"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_018",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 握住 {target} 的双手，将其拉到自己唇边，仔细亲吻对方的指尖。",
    "intensity": 2,
    "tags": [
      "指尖亲吻",
      "手部互动"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_019",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 紧紧抱住 {target}，在对方耳边低语一句充满暗示的暧昧情话。",
    "intensity": 2,
    "tags": [
      "紧拥",
      "情话暗示"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_directed_020",
    "stageKey": "beginner",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 侧头靠向 {target}，用鼻尖轻轻摩擦对方的侧脸，试探对方的反应。",
    "intensity": 2,
    "tags": [
      "鼻尖摩擦",
      "脸颊贴贴"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_001",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 轻轻勾住对方的手指，{target} 顺势将距离拉近并送上一个轻吻。",
    "intensity": 2,
    "tags": [
      "回应亲吻",
      "拉近距离"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_002",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 停在半步之外用眼神挑逗，{target} 主动上前环住对方的腰。",
    "intensity": 2,
    "tags": [
      "眼神挑逗",
      "主动拥抱"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_003",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 凑到耳边低语一句夸奖，{target} 用同样暧昧的语气在耳畔回击。",
    "intensity": 2,
    "tags": [
      "耳畔回击",
      "语言拉扯"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_004",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 将手搭在肩上，{target} 顺着动作靠进对方怀里，保持拥抱十秒。",
    "intensity": 2,
    "tags": [
      "顺势入怀",
      "拥抱回应"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_005",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 故意盯着嘴唇看，{target} 需要主动凑近，在对方下巴处落下一吻。",
    "intensity": 2,
    "tags": [
      "视线暗示",
      "下巴亲吻"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_006",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 轻轻碰了一下腰侧，{target} 转身回抱住对方，并深情凝视十秒。",
    "intensity": 2,
    "tags": [
      "转身回抱",
      "视线交汇"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_007",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在颈侧留下一个蜻蜓点水的吻，{target} 用手捧起对方的脸颊回应。",
    "intensity": 2,
    "tags": [
      "点水轻吻",
      "捧脸接住"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_008",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 给出拥抱的姿势并停顿，{target} 需要紧紧贴上去，让身体完全贴合。",
    "intensity": 2,
    "tags": [
      "邀请拥抱",
      "身体贴合"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_009",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 隔着衣服轻抚背部，{target} 顺势靠近，将下巴搭在对方肩上。",
    "intensity": 2,
    "tags": [
      "背部轻抚",
      "顺势依靠"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_010",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用指尖在手心画圈，{target} 握住那只手并拉到唇边温柔亲吻。",
    "intensity": 2,
    "tags": [
      "手心画圈",
      "吻手背"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_011",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 故意移开视线，{target} 需要把脸凑过去，强迫对方与自己对视。",
    "intensity": 2,
    "tags": [
      "欲擒故纵",
      "追逐视线"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_012",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 轻轻扯住衣角，{target} 领会信号，低头在对方额头上亲一下。",
    "intensity": 2,
    "tags": [
      "扯衣角",
      "额头回应"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_013",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 试探性地靠近半步，{target} 直接跨出剩下的一步，将对方拥入怀中。",
    "intensity": 2,
    "tags": [
      "距离试探",
      "双向奔赴"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_014",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 呼唤名字并停顿，{target} 用极尽温柔的声音说出一句情话作为回应。",
    "intensity": 2,
    "tags": [
      "名字呼唤",
      "情话补位"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_015",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 将下巴靠在肩膀上，{target} 侧过头，在对方的脸颊上温柔亲吻。",
    "intensity": 2,
    "tags": [
      "靠肩膀",
      "侧头回吻"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_016",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用眼神描摹锁骨，{target} 配合地微微扬起头，给对方更好的视野。",
    "intensity": 2,
    "tags": [
      "视线描摹",
      "配合展示"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_017",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 轻轻捏了一下手臂，{target} 顺势将对方的手拉过环绕在自己腰间。",
    "intensity": 2,
    "tags": [
      "手臂轻捏",
      "引向腰间"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_018",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 闭上眼睛等待，{target} 需要在十秒内决定亲吻对方脸上的哪个部位。",
    "intensity": 2,
    "tags": [
      "闭眼索吻",
      "主动选择"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_019",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 凑近呼吸但保持距离，{target} 打破僵局，主动贴上对方的鼻尖摩挲。",
    "intensity": 2,
    "tags": [
      "呼吸拉扯",
      "鼻尖贴合"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_response_020",
    "stageKey": "beginner",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 给出一个暧昧的微笑，{target} 用手指轻轻刮一下对方的鼻梁作为互动。",
    "intensity": 2,
    "tags": [
      "微笑暗示",
      "宠溺刮鼻"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_001",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 面对面坐近，额头贴着额头，闭上眼睛共同感受彼此的呼吸二十秒。",
    "intensity": 2,
    "tags": [
      "额头相贴",
      "同频呼吸"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_002",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 紧紧相拥，在抱住对方的同时，在对方的耳边说出一个暧昧的秘密。",
    "intensity": 2,
    "tags": [
      "紧紧相拥",
      "秘密耳语"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_003",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 保持深情凝视三十秒，谁先忍不住笑场，就要被对方亲吻一口脸颊。",
    "intensity": 2,
    "tags": [
      "深情凝视",
      "对视挑战"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_004",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相抚摸对方的头发和后颈，用最温柔的力度让彼此放松下来。",
    "intensity": 2,
    "tags": [
      "后颈抚摸",
      "温柔安抚"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_005",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 同时向对方靠近，直到鼻尖相触，维持这种暧昧的距离十秒钟。",
    "intensity": 2,
    "tags": [
      "同时靠近",
      "鼻尖相碰"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_006",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 十指紧扣并将手放在两人胸口中间，感受彼此因为靠近而加快的心跳。",
    "intensity": 2,
    "tags": [
      "十指紧扣",
      "心跳共鸣"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_007",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 轮流夸奖对方身体最吸引人的一个部位，眼神必须锁定在那个部位上。",
    "intensity": 2,
    "tags": [
      "互相夸奖",
      "视线锁定"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_008",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 脸颊贴着脸颊，在这样亲密的距离下，一起慢慢深呼吸三次。",
    "intensity": 2,
    "tags": [
      "脸颊贴贴",
      "共同呼吸"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_009",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相用指尖在对方的掌心写下一个字，让对方猜猜是什么。",
    "intensity": 2,
    "tags": [
      "掌心画字",
      "指尖互动"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_010",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 同时闭上眼睛，慢慢靠近对方，直到两人的嘴唇边缘轻轻触碰到一起。",
    "intensity": 2,
    "tags": [
      "闭眼试探",
      "唇边轻触"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_011",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 依偎在一起，互相分享今天最想和对方做的一件亲密小事。",
    "intensity": 2,
    "tags": [
      "互相依偎",
      "亲密分享"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_012",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相捧起对方的脸，在对方的额头中心郑重地落下一个亲吻。",
    "intensity": 2,
    "tags": [
      "捧脸凝视",
      "额头互吻"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_013",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 侧身拥抱，让彼此的腿侧隔着衣物轻轻贴在一起，感受体温。",
    "intensity": 2,
    "tags": [
      "侧身拥抱",
      "腿侧相贴"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_014",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 同时在对方的耳侧低声说一句挑逗的话，看谁的心跳跳得更快。",
    "intensity": 2,
    "tags": [
      "耳畔互撩",
      "低声挑逗"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_015",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 双手交握，看着对方的眼睛，共同回忆两人第一次接吻时的感觉。",
    "intensity": 2,
    "tags": [
      "双手交握",
      "回忆初吻"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_016",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相捏捏对方的脸颊，用带点宠溺的语气叫出一个只有彼此知道的昵称。",
    "intensity": 2,
    "tags": [
      "捏脸互动",
      "宠溺互称"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_017",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 紧紧贴在一起站立或坐着，保持十五秒，中途不允许有任何对话。",
    "intensity": 2,
    "tags": [
      "无声拥抱",
      "安静贴合"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_018",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 同时倾身向前，交换一个带有试探和挑逗意味的长久拥抱。",
    "intensity": 2,
    "tags": [
      "试探拥抱",
      "同时倾身"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_019",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相轻抚对方的后背，隔着衣物用掌心传递温暖与想要靠近的信号。",
    "intensity": 2,
    "tags": [
      "后背互抚",
      "掌心温度"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_duo_020",
    "stageKey": "beginner",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 闭上双眼，仅凭直觉和触感去寻找对方的嘴唇，轻轻碰触一下。",
    "intensity": 2,
    "tags": [
      "闭眼盲寻",
      "直觉触碰"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_001",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 一起拉过被子将两人罩住，在昏暗狭小的空间里深情对视二十秒。",
    "intensity": 2,
    "tags": [
      "被子空间",
      "昏暗对视"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_002",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 坐在床边，其中一人躺在另一人的大腿上，互相看着对方的眼睛调情。",
    "intensity": 2,
    "tags": [
      "床边膝枕",
      "放松调情"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_003",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 用手机设置一个三十秒的倒计时，在此期间只能用眼神和微笑挑逗对方。",
    "intensity": 2,
    "tags": [
      "手机倒数",
      "无声微笑"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_004",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 隔着一件外套或衬衫互相拥抱，感受这种隐秘又亲近的肌肤热度。",
    "intensity": 2,
    "tags": [
      "隔衣拥抱",
      "衣物缓冲"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_005",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 坐在同一张椅子上或挤在一起，让彼此的身体毫无缝隙地贴合。",
    "intensity": 2,
    "tags": [
      "共挤一椅",
      "贴合坐姿"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_006",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 靠在枕头上，互相用手指轻轻卷起对方的头发把玩，放松地闲聊几句。",
    "intensity": 2,
    "tags": [
      "依靠枕头",
      "把玩头发"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_007",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助领带或衣服的带子，轻轻拉扯对方靠近自己，然后交换一个拥抱。",
    "intensity": 2,
    "tags": [
      "领带拉扯",
      "借物靠近"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_008",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 在桌子两端面对面，慢慢向中间靠拢，直到能在桌面上碰到对方的鼻尖。",
    "intensity": 2,
    "tags": [
      "桌面对视",
      "慢慢靠拢"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_009",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 一起倒在床上，侧躺着面对面，隔着衣服轻轻抚摸对方的腰部。",
    "intensity": 2,
    "tags": [
      "床榻侧躺",
      "抚腰缓冲"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_010",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 用手机打出一句平时不好意思说的暧昧情话，同时递给对方看。",
    "intensity": 2,
    "tags": [
      "手机传情",
      "文字暧昧"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_011",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 把房间的灯光调暗或者关掉主灯，在微光中互相抚摸对方的脸颊。",
    "intensity": 2,
    "tags": [
      "微光房间",
      "氛围触碰"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_012",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 隔着被子轻轻压着对方，在这个安全的距离下说出对方最性感的部位。",
    "intensity": 2,
    "tags": [
      "被子相隔",
      "安全距离"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_013",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 分享同一个枕头，头靠着头，倾听彼此在耳边的轻浅呼吸声。",
    "intensity": 2,
    "tags": [
      "共用枕头",
      "耳畔呼吸"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_014",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助对方的衬衫衣领或裙摆边缘，轻轻将对方拉近，在锁骨处凝视十秒。",
    "intensity": 2,
    "tags": [
      "衣领拉近",
      "锁骨凝视"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_015",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 背靠着床或墙壁坐下，肩膀紧贴着肩膀，闭上眼睛享受这份宁静的亲昵。",
    "intensity": 2,
    "tags": [
      "并肩靠墙",
      "宁静亲昵"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_016",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 用手机播放一首暧昧的音乐，随着节奏轻轻相拥摇摆半分钟。",
    "intensity": 2,
    "tags": [
      "音乐摇摆",
      "相拥慢舞"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_017",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 坐在床沿，双腿交叠在一起，互相用手掌隔着衣服摩挲对方的膝盖。",
    "intensity": 2,
    "tags": [
      "床沿交叠",
      "摩挲膝盖"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_018",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 将对方的外套披在自己身上，然后紧紧抱住对方，像被对方的气息完全包裹。",
    "intensity": 2,
    "tags": [
      "外套包裹",
      "气息感受"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_019",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 趴在床上，两人的头凑在一起，互相在对方的颈侧留下一个轻柔的吻。",
    "intensity": 2,
    "tags": [
      "趴床凑近",
      "颈侧互吻"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_beginner_scene_020",
    "stageKey": "beginner",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 隔着桌子握住彼此的手，用手指轻轻刮擦对方的手背，挑起暧昧的张力。",
    "intensity": 2,
    "tags": [
      "隔桌握手",
      "手背刮擦"
    ],
    "curated": true,
    "source": "初级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_001",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 跨坐在 {target} 腿上，用发烫的大腿内侧隔着衣物用力蹭弄对方，眼神充满放肆的挑逗。",
    "intensity": 3,
    "tags": [
      "跨坐蹭弄",
      "放肆眼神"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_002",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 将 {target} 抵在墙上，低头重重咬在对方的颈侧，双手同时滑入对方的上衣尽情抚摸。",
    "intensity": 3,
    "tags": [
      "抵墙压制",
      "重咬颈侧"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_003",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 扯开自己的领口，贴着 {target} 的耳边用最诱人的低音喘息，手掌顺势覆上对方的腰际。",
    "intensity": 3,
    "tags": [
      "扯开领口",
      "耳畔喘息"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_004",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 强势地拨开 {target} 的双腿，用膝盖抵入其中，同时用指腹用力摩挲对方的锁骨边缘。",
    "intensity": 3,
    "tags": [
      "拨开双腿",
      "膝盖抵入"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_005",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 剥去 {target} 的外衣，肌肤相贴，用胸膛的温度和滚烫的深吻彻底点燃对方的理智。",
    "intensity": 3,
    "tags": [
      "剥去外衣",
      "滚烫深吻"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_006",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 顺着 {target} 的下颌线一路向下吸吮，在胸前边缘留下惹眼的红痕，享受对方的战栗。",
    "intensity": 3,
    "tags": [
      "一路吸吮",
      "惹眼红痕"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_007",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 握住 {target} 的手按在自己发烫的身体上，眼神拉丝地诱导对方感受自己此刻的渴望。",
    "intensity": 3,
    "tags": [
      "按手感受",
      "诱导渴望"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_008",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 将手指探入 {target} 腿间轻拢慢捻，同时堵住对方的嘴唇，将那些奔放的喘息全数吞下。",
    "intensity": 3,
    "tags": [
      "探入腿间",
      "吞咽喘息"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_009",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 隔着单薄的布料，用掌心用力按压 {target} 的私密处揉弄，欣赏对方彻底敞开的诱人姿态。",
    "intensity": 3,
    "tags": [
      "隔布按压",
      "欣赏姿态"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_010",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 埋首在 {target} 颈窝深呼吸，用带点粗暴的力度将对方揉进怀里，下半身紧紧贴合摩擦。",
    "intensity": 3,
    "tags": [
      "颈窝深吸",
      "贴合摩擦"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_011",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 用指尖顺着 {target} 的脊椎一路往下滑，停在腰窝处打圈，引诱对方挺起腰肢主动迎合。",
    "intensity": 3,
    "tags": [
      "脊椎下滑",
      "引诱迎合"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_012",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 一手扣住 {target} 的后脑勺加深亲吻，另一手探入裤腰，在最敏感的边缘进行奔放的挑逗。",
    "intensity": 3,
    "tags": [
      "扣后脑勺",
      "奔放挑逗"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_013",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 故意放慢动作，用鼻尖和嘴唇在 {target} 的胸口游移却不落下实质的吻，逼迫对方开口索求。",
    "intensity": 3,
    "tags": [
      "游移挑逗",
      "逼迫索求"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_014",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 拽住 {target} 的衣领把人拉近，用舌尖舔舐对方的唇缝，手掌肆无忌惮地在对方大腿内侧游走。",
    "intensity": 3,
    "tags": [
      "拽衣拉近",
      "大腿游走"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_015",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 用极具侵略性的目光打量 {target} 半裸的身体，掌心带着热度直接覆上对方跳动的心口。",
    "intensity": 3,
    "tags": [
      "侵略目光",
      "覆上心口"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_016",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 让 {target} 仰躺着，自己俯身用微凉的发丝扫过对方敏感的腹部，用触觉的反差制造战栗。",
    "intensity": 3,
    "tags": [
      "发丝扫过",
      "反差战栗"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_017",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 褪去 {target} 的内衣边缘，肌肤直触，用最狂热的揉捏让对方感受到自己不加掩饰的热情。",
    "intensity": 3,
    "tags": [
      "褪去内衣",
      "狂热揉捏"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_018",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 贴着 {target} 的耳廓吹气，用极度直白且露骨的词汇，告诉对方自己现在有多想完全占有。",
    "intensity": 3,
    "tags": [
      "耳廓吹气",
      "直白露骨"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_019",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 用双手捧着 {target} 的脸颊激烈交锋，下半身却用最原始的本能重重地顶了对方一下。",
    "intensity": 3,
    "tags": [
      "捧脸深吻",
      "本能顶撞"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_directed_020",
    "stageKey": "intermediate",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 解开自己的一两颗扣子，抓着 {target} 的手腕探入其中，让对方用指尖感受自己狂乱的心跳。",
    "intensity": 3,
    "tags": [
      "解扣引手",
      "感受心跳"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_001",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 的手刚触碰到腰侧， {target} 就热情地挺起身体，主动将毫无防备的自己送进对方怀里。",
    "intensity": 3,
    "tags": [
      "挺身迎合",
      "热情送怀"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_002",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 带着侵略性地靠近， {target} 毫不退缩，直接伸手揽住对方的脖颈回以一个更狂热的深吻。",
    "intensity": 3,
    "tags": [
      "毫不退缩",
      "揽脖狂吻"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_003",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在腿根处试探性地流连， {target} 奔放地大张开双腿，用眼神催促对方直接探入更深处。",
    "intensity": 3,
    "tags": [
      "大张双腿",
      "眼神催促"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_004",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 停止了唇舌的挑逗， {target} 难耐地扭动着腰肢，主动贴紧对方的身体用力摩擦起伏。",
    "intensity": 3,
    "tags": [
      "扭动腰肢",
      "贴紧摩擦"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_005",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 隔着衣物重重压按了一下， {target} 倒吸一口气，随后放肆地发出一声极具诱惑的甜腻喘息。",
    "intensity": 3,
    "tags": [
      "倒吸凉气",
      "放肆喘息"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_006",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 将呼吸喷洒在敏感的耳畔， {target} 趁机咬住对方的下唇，用舌尖挑起一场不留余地的纠缠。",
    "intensity": 3,
    "tags": [
      "咬住下唇",
      "不留余地"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_007",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 眼神火热地打量着， {target} 索性自己扯下碍事的上衣，将大片滚烫的肌肤毫无保留地展现。",
    "intensity": 3,
    "tags": [
      "扯下上衣",
      "毫无保留"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_008",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 的手在私密处边缘打转， {target} 急促地弓起背脊，抓着对方的手背强硬地按下，索要触碰。",
    "intensity": 3,
    "tags": [
      "弓起背脊",
      "强硬按下"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_009",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 故意拉开一寸距离， {target} 立刻用双腿紧紧盘住对方的腰，将那份令人疯狂的摩擦拉回来。",
    "intensity": 3,
    "tags": [
      "盘住腰肢",
      "拉回摩擦"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_010",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 咬了一下肩膀， {target} 顺势将手滑入对方的衣摆深处，用指尖在背脊上刮出动情的红痕。",
    "intensity": 3,
    "tags": [
      "顺势滑入",
      "刮出红痕"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_011",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用声音蛊惑着， {target} 彻底抛开矜持，大声说出自己现在有多渴望被对方用力抱紧。",
    "intensity": 3,
    "tags": [
      "抛开矜持",
      "大声渴望"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_012",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 的手指滑入下体边缘， {target} 浑身战栗，却依然用力挺腰，将自己彻底打开迎接这份狂热。",
    "intensity": 3,
    "tags": [
      "浑身战栗",
      "挺腰打开"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_013",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 给出诱人的暗示， {target} 直接翻身跨坐上去，居高临下地开始用腰腹的力量主导研磨。",
    "intensity": 3,
    "tags": [
      "翻身跨坐",
      "居高主导"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_014",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 动作略带粗暴地扯拉衣领， {target} 顺从地仰起脆弱的脖颈，任由对方在锁骨留下深深的印记。",
    "intensity": 3,
    "tags": [
      "粗暴扯衣",
      "仰脖顺从"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_015",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 喘息着停顿， {target} 毫不犹豫地追上去，用自己滚烫的身体严丝合缝地贴住对方的每一寸。",
    "intensity": 3,
    "tags": [
      "毫不犹豫",
      "严丝合缝"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_016",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在胸前肌肤上留下湿热的吻， {target} 用力抓住对方的头发，将脸更紧地压向自己的胸口。",
    "intensity": 3,
    "tags": [
      "胸前留吻",
      "抓发压紧"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_017",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用膝盖顶开双腿， {target} 配合地迎合上去，用最奔放的姿态感受两人下半身的危险贴近。",
    "intensity": 3,
    "tags": [
      "顶开双腿",
      "危险贴近"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_018",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 给出挑逗的眼神， {target} 心领神会，握住对方作乱的手引导至自己最渴望被抚慰的要害处。",
    "intensity": 3,
    "tags": [
      "心领神会",
      "握手引导"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_019",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 呼吸变得沉重， {target} 用同样急促的呼吸回应，并在对方耳边吐露一句大胆的求爱宣言。",
    "intensity": 3,
    "tags": [
      "沉重呼吸",
      "大胆宣言"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_response_020",
    "stageKey": "intermediate",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 退开半步欣赏， {target} 直接跪在床上，用充满情欲的眼神和半裸的身体发出无声的邀请。",
    "intensity": 3,
    "tags": [
      "跪姿邀请",
      "情欲眼神"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_001",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 半裸着紧紧相拥，在床铺上疯狂翻滚，任由彼此发烫的身体毫无阻碍地来回摩擦。",
    "intensity": 3,
    "tags": [
      "半裸相拥",
      "疯狂翻滚"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_002",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 激烈地交缠着唇舌，双手各自在对方的下半身肆意探索游走，谁也不肯在热情中落下风。",
    "intensity": 3,
    "tags": [
      "交缠唇舌",
      "肆意游走"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_003",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 跨坐交叠，大腿根部紧紧贴合在一起，用最原始的本能进行着奔放的研磨与蹭弄。",
    "intensity": 3,
    "tags": [
      "跨坐交叠",
      "原始研磨"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_004",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相扯去对方上半身的衣物，胸膛贴着胸膛，感受着两颗心脏在肌肤相亲下的剧烈共振。",
    "intensity": 3,
    "tags": [
      "互扯衣物",
      "心脏共振"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_005",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 跪坐在彼此面前，用带有侵略性的目光对视，同时双手探入对方的腿间进行火热的挑逗。",
    "intensity": 3,
    "tags": [
      "跪坐对视",
      "火热挑逗"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_006",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 放弃一切矜持与理智，在深吻的间隙大口喘息，任由手指在对方身体的每一处敏感带点火。",
    "intensity": 3,
    "tags": [
      "放弃矜持",
      "大口喘息"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_007",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相舔咬着对方的锁骨和颈侧，用微微的刺痛感和湿热的呼吸，将前戏的热度推向顶点。",
    "intensity": 3,
    "tags": [
      "互咬锁骨",
      "热度推顶"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_008",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 十指紧扣压在枕头上，下半身极其奔放地用力贴合碰撞，享受着未进入却同样致命的快感。",
    "intensity": 3,
    "tags": [
      "十指紧扣",
      "贴合碰撞"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_009",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 同步加快了手中的抚慰动作，互相逼迫着对方发出平时绝对听不到的、令人脸红的浪叫。",
    "intensity": 3,
    "tags": [
      "同步加快",
      "逼迫浪叫"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_010",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 闭上眼睛，完全放开自我，只凭触觉和急促的呼吸去感受对方身体因为动情而泛起的战栗。",
    "intensity": 3,
    "tags": [
      "闭眼感受",
      "放开自我"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_011",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 将对方的双手拉向自己最敏感的地方，互相引导着进行一场毫无保留的身体探索。",
    "intensity": 3,
    "tags": [
      "牵手引导",
      "毫无保留"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_012",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 一起向对方的耳廓吹气，用低哑诱人的声音互诉情话，让听觉和触觉同时陷入疯狂。",
    "intensity": 3,
    "tags": [
      "耳廓吹气",
      "视听疯狂"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_013",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 紧密贴合在一起，用沾满汗水的身体互相蹭弄，在濒临失控的边缘体验双向奔赴的快感。",
    "intensity": 3,
    "tags": [
      "紧密贴合",
      "濒临失控"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_014",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相用指尖划过对方的小腹，一路向下探入最隐秘的湿润与滚烫，同时发出一声满足的喟叹。",
    "intensity": 3,
    "tags": [
      "指尖划腹",
      "满足喟叹"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_015",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 额头相抵，在急促的喘息中互相解开最后的纽扣，让这场升温的互动变得更加赤裸和直接。",
    "intensity": 3,
    "tags": [
      "额头相抵",
      "赤裸直接"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_016",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 侧躺着双腿交缠，互相用大腿内侧用力摩擦着对方的私密边缘，用摩擦力点燃彻底的欲火。",
    "intensity": 3,
    "tags": [
      "双腿交缠",
      "大腿摩擦"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_017",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相在对方裸露的背脊上留下带点野性的抓痕，用这种奔放的方式证明此刻热烈的情感。",
    "intensity": 3,
    "tags": [
      "野性抓痕",
      "奔放证明"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_018",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 同步用唇齿在对方的肌肤上游移，所过之处留下一串串湿热的印记，宣告着强烈的占有欲。",
    "intensity": 3,
    "tags": [
      "唇齿游移",
      "强烈占有"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_019",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 将身体的重量完全压向对方，在激烈的深吻中互相揉捏着腰臀，享受肉体带来的极致愉悦。",
    "intensity": 3,
    "tags": [
      "重量压制",
      "极致愉悦"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_duo_020",
    "stageKey": "intermediate",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 在狂热的前戏中互相凝视，从对方充满情欲的眼神里确认，彼此都已经准备好彻底沦陷。",
    "intensity": 3,
    "tags": [
      "狂热凝视",
      "彻底沦陷"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_001",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 将对方用力推抵在门背上，在昏暗的玄关处就迫不及待地扯开衣领，开始一场狂热的拥吻。",
    "intensity": 3,
    "tags": [
      "门背推抵",
      "狂热拥吻"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_002",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助房间里的一面镜子，看着两人半裸交缠的诱人身姿，强烈的视觉刺激让抚摸变得更奔放。",
    "intensity": 3,
    "tags": [
      "镜前欣赏",
      "视觉刺激"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_003",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 坐在床沿，双腿毫无顾忌地完全张开交缠在一起，用最开放的姿态互相探索彼此的身体。",
    "intensity": 3,
    "tags": [
      "床沿交缠",
      "开放姿态"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_004",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 倒在凌乱的被褥间，把厚重的被子踢到地毯上，在毫无遮挡的大床上尽情释放前戏的热情。",
    "intensity": 3,
    "tags": [
      "踢落被子",
      "毫无遮挡"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_005",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 面对面挤在一张椅子上跨坐，在狭窄空间的逼迫下，让身体的贴合与研磨变得更加紧密激烈。",
    "intensity": 3,
    "tags": [
      "挤椅跨坐",
      "紧密研磨"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_006",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 把手机扔在一旁，借助台灯暧昧的暖光，互相欣赏并用手指一寸寸点燃对方发烫的肌肤。",
    "intensity": 3,
    "tags": [
      "台灯暖光",
      "一寸点火"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_007",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 靠在冰冷的墙壁上，用背后坚硬的触感反衬身前火热交缠的躯体，在反差中将气氛推向沸点。",
    "intensity": 3,
    "tags": [
      "靠冰冷墙",
      "反差沸点"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_008",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 跪在地毯上互相撕扯掉上衣，在没有床铺柔软缓冲的情况下，用最原始的粗暴感互相取悦。",
    "intensity": 3,
    "tags": [
      "地毯撕衣",
      "原始粗暴"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_009",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 躲进被窝里，在漆黑且充满彼此体味和荷尔蒙的私密空间内，抛开所有矜持进行彻底的互慰。",
    "intensity": 3,
    "tags": [
      "躲进被窝",
      "彻底互慰"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_010",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助桌沿的高度，一人半靠着仰起头，另一人俯身在其胸前与颈侧留下极具侵略性的吻痕。",
    "intensity": 3,
    "tags": [
      "桌沿半靠",
      "侵略吻痕"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_011",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 拿着手机设置 60 秒倒计时，挑战在这期间仅凭双手和亲吻，把对方逼到不得不大声求饶的地步。",
    "intensity": 3,
    "tags": [
      "倒数挑战",
      "大声求饶"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_012",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 倒在床铺边缘，一人站立一人躺下，利用视角的落差带来强烈的征服欲与被征服的快感。",
    "intensity": 3,
    "tags": [
      "视角落差",
      "征服快感"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_013",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 将房间冷气调低，在微凉的空气中，感受对方滚烫的手掌和唇舌在自己身上四处点火。",
    "intensity": 3,
    "tags": [
      "冷气微凉",
      "四处点火"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_014",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助一条领带轻轻缠住两人的手腕，在半束缚的刺激感中，互相用身体的起伏去摩擦对方。",
    "intensity": 3,
    "tags": [
      "领带轻缠",
      "半束缚感"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_015",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 在书桌前互相拉开衣襟，不顾一切地贴近，在文静的场景里做着最狂热奔放的肉体探索。",
    "intensity": 3,
    "tags": [
      "书桌敞衣",
      "狂热探索"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_016",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 趴在枕头上，从背后紧紧拥抱住对方，在耳边用最性感的声音说出平时绝对不敢说的情话。",
    "intensity": 3,
    "tags": [
      "枕头趴握",
      "性感耳语"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_017",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助大床的宽敞，互相追逐着翻滚压制，在类似摔跤的打闹中顺理成章地擦出放肆的火花。",
    "intensity": 3,
    "tags": [
      "翻滚打闹",
      "放肆火花"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_018",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 半靠在床头，让对方完全跨坐在自己身上，用双手掌控着这具诱人躯体上下起伏的节奏。",
    "intensity": 3,
    "tags": [
      "半靠床头",
      "跨坐起伏"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_019",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 扯下床单将彼此裹住，在隐秘的安全感里，肆无忌惮地把手探向对方下半身最深处的要害。",
    "intensity": 3,
    "tags": [
      "床单裹住",
      "肆无忌惮"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_intermediate_scene_020",
    "stageKey": "intermediate",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 站在窗帘背后，在一种随时可能被发现的禁忌刺激下，用颤抖而狂热的动作互相索取着热情。",
    "intensity": 3,
    "tags": [
      "窗帘背后",
      "禁忌刺激"
    ],
    "curated": true,
    "source": "中级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_001",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 褪去 {target} 的下半身衣物，用温柔的口吻在对方最敏感的私密地带留下湿热的亲吻。",
    "intensity": 4,
    "tags": [
      "口唇挑逗",
      "褪去防线"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_002",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 引导 {target} 躺好，双唇顺着小腹一路向下，用舌尖轻柔地挑逗对方的私密边缘。",
    "intensity": 4,
    "tags": [
      "舌尖游走",
      "向下探索"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_003",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 埋首在 {target} 的双腿之间，用口舌交替的节奏为其进行长达九十秒的深情口爱服务。",
    "intensity": 4,
    "tags": [
      "口爱服务",
      "深情取悦"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_004",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 隔着内衣揉捏 {target} 的最敏感处，同时用眼神锁定对方，逼迫对方发出渴望的喘息。",
    "intensity": 4,
    "tags": [
      "隔衣揉捏",
      "视觉压迫"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_005",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 一手掌控住 {target} 的要害部位，一边深吻对方的嘴唇，让上下两端的快感同时爆发。",
    "intensity": 4,
    "tags": [
      "双管齐下",
      "上下同进"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_006",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 用手指沾取些许爱液，在 {target} 的私处缓慢打圈，仔细观察对方身体的每一次战栗。",
    "intensity": 4,
    "tags": [
      "指腹打圈",
      "观察战栗"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_007",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 将 {target} 逼至床角，强行褪去最后一件阻碍，用灵活的舌尖让对方体验失控的边缘。",
    "intensity": 4,
    "tags": [
      "逼至床角",
      "舌尖失控"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_008",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 故意放慢手上的爱抚动作，直到 {target} 忍不住挺起腰身主动索求更深入的触碰。",
    "intensity": 4,
    "tags": [
      "放慢爱抚",
      "逼迫索求"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_009",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 吻着 {target} 的大腿内侧，牙齿轻轻啃咬敏感的肌肤，一点点向最渴望的中心地带逼近。",
    "intensity": 4,
    "tags": [
      "大腿啃咬",
      "逼近中心"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_010",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 握住 {target} 已经动情的部位，用指腹上下滑动，用恰到好处的力道掌控对方的呼吸节奏。",
    "intensity": 4,
    "tags": [
      "掌控要害",
      "指腹滑动"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_011",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 让 {target} 闭上眼睛，用微凉的指尖和湿热的舌尖交替刺激对方的敏感带，制造反差快感。",
    "intensity": 4,
    "tags": [
      "冰火交替",
      "反差刺激"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_012",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 在 {target} 的耳畔低语情话，同时手指向下探入最隐秘的湿润地带，轻轻扣弄。",
    "intensity": 4,
    "tags": [
      "耳语情话",
      "指尖探入"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_013",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 压制住 {target} 的双手，埋首于其胸前用力吸吮，膝盖则强势地顶入对方的双腿之间摩擦。",
    "intensity": 4,
    "tags": [
      "双手压制",
      "膝盖摩擦"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_014",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 彻底褪去 {target} 的遮掩，用充满占有欲的目光巡视后，俯身献上一个长达 60 秒的口唇服侍。",
    "intensity": 4,
    "tags": [
      "彻底裸露",
      "专心服侍"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_015",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 引导 {target} 抚摸自己的身体，同时自己则专心用唇舌取悦对方的下半身。",
    "intensity": 4,
    "tags": [
      "引导抚摸",
      "口舌取悦"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_016",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 故意在 {target} 即将攀上高峰时突然停下口中的动作，坏笑着等对方开口求饶。",
    "intensity": 4,
    "tags": [
      "高潮边缘",
      "停下求饶"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_017",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 用手指轻轻撑开 {target} 的双腿，将温热的呼吸喷洒在最脆弱的部位，感受对方的紧绷。",
    "intensity": 4,
    "tags": [
      "撑开双腿",
      "呼吸喷洒"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_018",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 紧紧抱住 {target}，手指在对方敏感处快速揉弄，直到感受到对方身体泛起一阵阵潮红。",
    "intensity": 4,
    "tags": [
      "快速揉弄",
      "潮红反应"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_019",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 让 {target} 靠在床头，自己则跪在对方面前，用极尽温柔的舔舐让其完全放松下来。",
    "intensity": 4,
    "tags": [
      "跪姿服务",
      "极尽温柔"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_directed_020",
    "stageKey": "advanced",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 把 {target} 的双腿架在自己肩上，用带有侵略性的亲吻和口爱，将前戏推向最浓烈的高潮。",
    "intensity": 4,
    "tags": [
      "架起双腿",
      "侵略口爱"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_001",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 埋首在双腿间开始舔舐，{target} 难耐地扬起脖颈，伸手抓住对方的头发引导更深入。",
    "intensity": 4,
    "tags": [
      "埋首舔舐",
      "抓发引导"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_002",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 的手指在私密边缘徘徊挑逗，{target} 忍不住挺起腰肢，主动将那作乱的手指迎合进来。",
    "intensity": 4,
    "tags": [
      "边缘徘徊",
      "挺腰迎合"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_003",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 停下了令人沉醉的口头服侍，{target} 必须用最软糯的声音恳求对方的唇舌重新回来。",
    "intensity": 4,
    "tags": [
      "中止服侍",
      "恳求回来"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_004",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用指腹快速揉捏着敏感点，{target} 咬紧下唇，用急促的喘息声回应这股逐渐失控的快感。",
    "intensity": 4,
    "tags": [
      "快速揉捏",
      "喘息回应"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_005",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 故意隔着内衣吹气挑逗，{target} 忍无可忍地直接扯下自己的最后防线，邀请对方享用。",
    "intensity": 4,
    "tags": [
      "隔衣吹气",
      "扯下防线"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_006",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在进行口爱时故意放慢节奏，{target} 焦急地收紧双腿，企图将对方紧紧夹住不放。",
    "intensity": 4,
    "tags": [
      "放慢口爱",
      "收紧双腿"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_007",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 把带有爱液的手指递到唇边，{target} 会意地张开双唇，将那根手指含入口中轻轻吮吸。",
    "intensity": 4,
    "tags": [
      "递送手指",
      "含入口中"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_008",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 俯身亲吻着小腹向下探索，{target} 配合地彻底敞开自己，迎接即将到来的湿热包裹。",
    "intensity": 4,
    "tags": [
      "向下探索",
      "彻底敞开"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_009",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 的动作突然变得粗重且带有侵略性，{target} 用同样热烈的回吻和扭动的腰肢来接住狂热。",
    "intensity": 4,
    "tags": [
      "粗重侵略",
      "扭腰回吻"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_010",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在耳边低声询问舒服吗，{target} 用一记重重的挺腰和满足的低吟作为最真实的回答。",
    "intensity": 4,
    "tags": [
      "耳边询问",
      "挺腰低吟"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_011",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用舌尖在那一点上打着圈，{target} 浑身战栗，双手紧紧攥住床单以防自己叫得太大声。",
    "intensity": 4,
    "tags": [
      "舌尖打圈",
      "攥紧床单"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_012",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 的手指试图探入更深处，{target} 稍微放松身体，用湿润的包容去接纳这份隐秘的试探。",
    "intensity": 4,
    "tags": [
      "探入深处",
      "湿润包容"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_013",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 给出互相取悦的眼神暗示，{target} 立刻调整姿势，俯下身为对方拉开拉链献上唇舌。",
    "intensity": 4,
    "tags": [
      "眼神暗示",
      "俯身献吻"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_014",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 退开半步欣赏对方半裸的姿态，{target} 主动拉过对方的手，按在自己最渴望被抚摸的地方。",
    "intensity": 4,
    "tags": [
      "退步欣赏",
      "按手索求"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_015",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 将湿热的吻印在大腿根部，{target} 颤抖着抚摸对方的脸颊，无声地催促对方继续向上。",
    "intensity": 4,
    "tags": [
      "腿根湿吻",
      "抚脸催促"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_016",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用轻柔的动作安抚着即将过载的神经，{target} 趁机深吸几口气，准备迎接下一波猛烈的口爱。",
    "intensity": 4,
    "tags": [
      "轻柔安抚",
      "深吸迎接"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_017",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 故意停在边缘不肯给个痛快，{target} 直接伸手搂住对方的脖子，强迫那张嘴完全贴合上来。",
    "intensity": 4,
    "tags": [
      "停在边缘",
      "强迫贴合"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_018",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 引导着触碰彼此最私密的地方，{target} 毫不犹豫地握住，并开始用熟练的动作上下套弄。",
    "intensity": 4,
    "tags": [
      "引导触碰",
      "熟练套弄"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_019",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 结束了长达两分钟的深情舔舐，{target} 意犹未尽地贴近，将带有对方气息的吻还了回去。",
    "intensity": 4,
    "tags": [
      "结束舔舐",
      "气息回吻"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_response_020",
    "stageKey": "advanced",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 轻轻拍了一下大腿暗示张开，{target} 顺从地照做，并用充满情欲的眼神期待接下来的口舌。",
    "intensity": 4,
    "tags": [
      "拍腿暗示",
      "顺从张开"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_001",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 采用 69 的姿势躺在床上，同时用口舌为对方进行极其深入的前戏服务，持续 90 秒。",
    "intensity": 4,
    "tags": [
      "体位配合",
      "互相口爱"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_002",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 褪去所有衣物紧紧相拥，互相用手指探索对方最隐秘的敏感地带，一起感受水乳交融。",
    "intensity": 4,
    "tags": [
      "赤裸相拥",
      "隐秘探索"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_003",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 在深吻的同时，双手各自握住对方的要害部位，用相同的频率互相套弄和揉捏。",
    "intensity": 4,
    "tags": [
      "深吻互慰",
      "相同频率"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_004",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 轮流为对方进行 60 秒的口爱服务，看谁能先让对方发出无法克制的愉悦喘息。",
    "intensity": 4,
    "tags": [
      "轮流口爱",
      "比拼喘息"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_005",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 将彼此的私密部位贴合在一起，不进行实质进入，只靠着最敏感的肌肤互相摩擦起伏。",
    "intensity": 4,
    "tags": [
      "私密贴合",
      "外部摩擦"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_006",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 一边激烈地交缠着唇舌，一边互相帮对方褪去最后的内衣，让毫无阻挡的肌肤彻底相亲。",
    "intensity": 4,
    "tags": [
      "交缠唇舌",
      "互脱内衣"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_007",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相用微凉的指尖在对方的大腿内侧和敏感边缘画圈，比拼谁的自制力能撑得更久。",
    "intensity": 4,
    "tags": [
      "敏感画圈",
      "自制比拼"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_008",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 在剧烈的喘息中停下口部的动作，深情凝视后，交换一个带着彼此体液味道的深吻。",
    "intensity": 4,
    "tags": [
      "停下口爱",
      "体液深吻"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_009",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 面对面跨坐，在不进入的前提下，用最紧密的姿态互相摩擦彼此的私处，直达高潮边缘。",
    "intensity": 4,
    "tags": [
      "跨坐摩擦",
      "直达边缘"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_010",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相用舌尖清理对方胸前和腹部的汗水，一路向下，直到双唇同时吻上最渴望的重点。",
    "intensity": 4,
    "tags": [
      "舌尖清理",
      "吻上重点"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_011",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 闭上眼睛，完全把自己交给对方的手指和嘴唇，享受同时被互相取悦的双倍快感。",
    "intensity": 4,
    "tags": [
      "闭眼享受",
      "互相取悦"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_012",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 共同将前戏推向顶点，用手指和口舌将彼此逼到即将失控的边缘，然后极其默契地停下。",
    "intensity": 4,
    "tags": [
      "推向顶点",
      "默契急停"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_013",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 十指紧扣压在枕头上，下半身紧紧贴合并疯狂摩擦，试图用这种方式解渴却越陷越深。",
    "intensity": 4,
    "tags": [
      "十指紧扣",
      "疯狂摩擦"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_014",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相引导着对方的手探入自己的私密深处，一边感受指尖的温度，一边急促地交换呼吸。",
    "intensity": 4,
    "tags": [
      "引导探入",
      "指尖温度"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_015",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 跪坐在床上，互相用嘴唇和牙齿解开对方最后的防备，让最原始的欲望暴露在空气中。",
    "intensity": 4,
    "tags": [
      "跪坐互解",
      "原始欲望"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_016",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 同步进行着唇舌的服务，在感受到对方即将到达顶点时，不约而同地放慢了速度挑逗。",
    "intensity": 4,
    "tags": [
      "同步口爱",
      "放慢挑逗"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_017",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 贴着耳朵互相交流刚才被口爱时的真实感受，用露骨的词汇进一步刺激彼此的神经。",
    "intensity": 4,
    "tags": [
      "耳边交流",
      "露骨刺激"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_018",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相用大腿内侧夹住对方的身体，用力收紧并来回蹭弄，享受这种不留缝隙的压迫感。",
    "intensity": 4,
    "tags": [
      "大腿夹紧",
      "蹭弄压迫"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_019",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相用手指沾取彼此溢出的爱液，涂抹在对方的胸口和锁骨上，并在那里留下深深的吻痕。",
    "intensity": 4,
    "tags": [
      "沾取涂抹",
      "锁骨留痕"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_duo_020",
    "stageKey": "advanced",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 紧紧抱在一起，感受着互相摩擦带来的极致快感，在进入正式主题前完成最后一次深呼吸。",
    "intensity": 4,
    "tags": [
      "紧抱感受",
      "深呼吸"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_001",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助床沿的高度差，一人站立一人躺下，极其方便地为对方献上一次深入的口唇服务。",
    "intensity": 4,
    "tags": [
      "床沿高差",
      "口唇服务"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_002",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 将一条领带蒙在其中一人的眼睛上，在视觉被剥夺的黑暗中，尽情享受对方舌尖的刺激。",
    "intensity": 4,
    "tags": [
      "领带蒙眼",
      "舌尖刺激"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_003",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 趴在宽大的被子上，互相交叠在一起，隔着薄薄的布料用力摩擦彼此最敏感的核心。",
    "intensity": 4,
    "tags": [
      "交叠趴卧",
      "隔布摩擦"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_004",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 面对面坐在椅子上，将空间压缩到极致，互相把手探入对方双腿间进行放肆的挑逗。",
    "intensity": 4,
    "tags": [
      "同椅相对",
      "放肆挑逗"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_005",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 靠在昏暗的墙边，互相半跪着为对方拉开拉链，在这个角落里进行口爱互助。",
    "intensity": 4,
    "tags": [
      "昏暗靠墙",
      "半跪互助"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_006",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 拿过一个厚枕头垫在腰下，让私密部位完全暴露在对方的视野和唇舌之下，毫无保留。",
    "intensity": 4,
    "tags": [
      "垫高腰部",
      "视野暴露"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_007",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 把手机放在旁边计时，挑战在接下来的 90 秒内，用互相的手工或口爱服务让对方求饶。",
    "intensity": 4,
    "tags": [
      "手机计时",
      "服务求饶"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_008",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 躲进被窝里，在狭小且充满两人气息的空间内，互相探索对方下半身最深处的秘密。",
    "intensity": 4,
    "tags": [
      "躲进被窝",
      "下半身探索"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_009",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 将凌乱的衣服堆在床尾，两人赤裸着缠绕在一起，用最原始的肌肤触碰来重新对齐节奏。",
    "intensity": 4,
    "tags": [
      "赤裸缠绕",
      "对齐节奏"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_010",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 坐在床边，互相用温热的纸巾轻轻擦拭对方刚刚被口舌取悦过的私密区域，温柔又暧昧。",
    "intensity": 4,
    "tags": [
      "床边擦拭",
      "事后温柔"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_011",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助桌子的边缘，一人半靠着，另一人埋首在其双腿间，在微凉的桌面和湿热间体会反差。",
    "intensity": 4,
    "tags": [
      "桌边依靠",
      "反差体会"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_012",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 打开手机的手电筒，借着微弱的光源仔细端详对方私密处的动情反应，然后俯身吻上去。",
    "intensity": 4,
    "tags": [
      "手机微光",
      "端详亲吻"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_013",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 扯下床单将彼此裹在其中，在隐秘的安全感里，互相用手掌抚慰着对方已经肿胀的渴望。",
    "intensity": 4,
    "tags": [
      "床单包裹",
      "手掌抚慰"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_014",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 靠着床头的软垫，互相交换位置轮流体验被对方完全服侍的快感，不急于进入下一步。",
    "intensity": 4,
    "tags": [
      "床头软垫",
      "轮流体验"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_015",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 在地毯上互相压制，抢夺主动权，谁赢了就能用口舌将另一方逼迫到失控的边缘。",
    "intensity": 4,
    "tags": [
      "地毯压制",
      "抢夺主动"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_016",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借着窗外透进来的微光，互相看着对方的眼睛，手在底下进行着最不加掩饰的私密互慰。",
    "intensity": 4,
    "tags": [
      "窗外微光",
      "私密互慰"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_017",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 将房间里的冷气调低，在微凉的空气中，感受对方滚烫的唇舌包裹住自己敏感处的极致热度。",
    "intensity": 4,
    "tags": [
      "调低冷气",
      "滚烫包裹"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_018",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 面对着房间里有反光面的玻璃或镜子，看着两人交缠的半裸身体，互相探索最渴望的地带。",
    "intensity": 4,
    "tags": [
      "镜面反光",
      "视觉刺激"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_019",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 把枕头抱在胸前作为缓冲，身体的下半部分却毫无阻碍地紧密贴合，互相用腰力摩擦撞击。",
    "intensity": 4,
    "tags": [
      "抱枕缓冲",
      "腰力摩擦"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_advanced_scene_020",
    "stageKey": "advanced",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 结束了疯狂的口爱与边缘试探，并排躺在床上大口喘息 30 秒，为即将到来的结合蓄满体力。",
    "intensity": 4,
    "tags": [
      "事后喘息",
      "蓄满体力"
    ],
    "curated": true,
    "source": "高级阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_001",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 将 {target} 的双腿架在肩膀上，以最深的传教士体位进入，控制前三十次缓慢而有力的抽送节奏。",
    "intensity": 5,
    "tags": [
      "传教士",
      "深度抽送"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_002",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 引导 {target} 翻身背对采用后入式，双手紧握对方的腰肢，开始由慢至快地猛烈撞击敏感点。",
    "intensity": 5,
    "tags": [
      "后入式",
      "猛烈撞击"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_003",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 让 {target} 跨坐在自己身上，由 {actor} 掌控对方的腰部，引导画圈式的研磨深入。",
    "intensity": 5,
    "tags": [
      "跨坐女上",
      "画圈研磨"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_004",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 以侧卧的姿势从背后进入 {target}，贴紧对方的背部，在耳边低语的同时进行绵长深沉的挺进。",
    "intensity": 5,
    "tags": [
      "侧卧后入",
      "绵长挺进"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_005",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 将 {target} 压在身下，采用九浅一深的经典技巧抽插，让对方在期待和失落的交替中沦陷。",
    "intensity": 5,
    "tags": [
      "九浅一深",
      "技巧拉扯"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_006",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 托起 {target} 的臀部使其悬空，以这种极度吃力的体位进行十次最深挺进，逼迫对方尖叫。",
    "intensity": 5,
    "tags": [
      "托臀悬空",
      "最深挺进"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_007",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 在即将到达顶点时突然停止抽送，保持结合的姿态，要求 {target} 自己扭动腰肢来获取最后满足。",
    "intensity": 5,
    "tags": [
      "边缘停顿",
      "逼迫扭腰"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_008",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 改变进入的角度，刻意向上顶弄 {target} 体内最敏感的那个点，在对方的娇喘声中持续猛攻。",
    "intensity": 5,
    "tags": [
      "改变角度",
      "精准猛攻"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_009",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 把 {target} 拉到床沿边双脚悬空，自己站立着强力挺进，利用高度差带来前所未有的深入感。",
    "intensity": 5,
    "tags": [
      "床沿站立",
      "高度差深入"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_010",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 引导 {target} 趴在床上并垫高腰部，在这个毫无防备的体位下，用狂暴的冲刺彻底击溃对方理智。",
    "intensity": 5,
    "tags": [
      "垫腰趴卧",
      "狂暴冲刺"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_011",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 紧紧抱起 {target} 采用毫无缝隙的面对面体位，用极致的贴合度和重力带来直达灵魂的撞击。",
    "intensity": 5,
    "tags": [
      "紧密拥抱",
      "重力撞击"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_012",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 在深插到底时故意缓慢旋转腰部，用这种折磨人的研磨技巧，逼出 {target} 眼角难耐的生理性泪水。",
    "intensity": 5,
    "tags": [
      "深插旋转",
      "研磨逼泪"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_013",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 每次都退到快要完全离开的边缘，再狠狠一穿到底，用这种极致的落差感让 {target} 彻底迷失。",
    "intensity": 5,
    "tags": [
      "边缘重插",
      "极致落差"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_014",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 让 {target} 仰躺并弯曲双膝贴紧胸口，在这个能完全打开身体的姿势下，进行长达两分钟的稳定输出。",
    "intensity": 5,
    "tags": [
      "屈膝大开",
      "稳定输出"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_015",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 从后方进入掌控节奏，另一手绕到前方揉捏 {target} 胸前的敏感处，带来上下双重的极致快感。",
    "intensity": 5,
    "tags": [
      "后入掌控",
      "上下双重"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_016",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 在传教士体位下与 {target} 十指紧扣，伴随着深情的注视，用尽全力撞击那个令人疯狂的深度。",
    "intensity": 5,
    "tags": [
      "十指紧扣",
      "深情撞击"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_017",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 放慢抽送的速度，每次进出都要求 {target} 准确说出正在摩擦哪里，否则就停在最深处不许动。",
    "intensity": 5,
    "tags": [
      "放慢惩罚",
      "羞耻问答"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_018",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 将 {target} 的一条腿抬高挂在自己手臂上，以这种侧开的体位进行不规则频率的抽插，打乱呼吸。",
    "intensity": 5,
    "tags": [
      "单腿挂臂",
      "不规则抽插"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_019",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 躺在下方，命令跨坐的 {target} 必须用最快的速度起伏三十下，否则立刻翻身将其压在身下狠狠贯穿。",
    "intensity": 5,
    "tags": [
      "下方命令",
      "快速起伏"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_directed_020",
    "stageKey": "finale",
    "taskMode": "directed",
    "title": "任务",
    "template": "{actor} 在最后的冲刺阶段，将 {target} 死死按在怀里，用最原始的交合姿势和暴烈的速度，送彼此上顶峰。",
    "intensity": 5,
    "tags": [
      "死死按怀",
      "冲刺顶峰"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_001",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 采用后入式发起猛烈攻势，{target} 顺从地塌下腰背高高翘起臀部，让每一次撞击都能达到最深处。",
    "intensity": 5,
    "tags": [
      "后入攻势",
      "塌腰迎合"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_002",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 躺在下方保持不动，{target} 会意地跨坐上去，主动用腰腹的力量进行深浅交替的起伏和研磨。",
    "intensity": 5,
    "tags": [
      "下方静止",
      "跨坐起伏"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_003",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在传教士体位中突然加快节奏，{target} 立刻用双腿紧紧盘住对方的腰肢，承受这波狂热的冲刺。",
    "intensity": 5,
    "tags": [
      "突然加速",
      "盘腰承受"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_004",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 刻意将抽插变得极浅，{target} 不满地伸手拉住对方，主动挺起腰身去追寻能将自己完全填满的深度。",
    "intensity": 5,
    "tags": [
      "极浅拉扯",
      "挺腰追寻"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_005",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 换成侧卧姿势从背后缓慢顶入，{target} 配合地蜷缩起身体，让两人在像勺子一样的贴合中深入。",
    "intensity": 5,
    "tags": [
      "侧卧顶入",
      "蜷缩贴合"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_006",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 将进入的角度稍微偏转，{target} 敏锐地捕捉到酥麻感，立刻扭动身体引导对方继续撞击该点。",
    "intensity": 5,
    "tags": [
      "角度偏转",
      "扭动引导"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_007",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在高潮边缘突然放慢了冲刺，{target} 急切地收缩体内，试图用绞紧的技巧逼迫对方全数释放。",
    "intensity": 5,
    "tags": [
      "边缘放慢",
      "绞紧逼迫"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_008",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 把战场转移到床沿站立进入，{target} 张开双腿迎接更猛烈的狂风暴雨，双手死死抓住床单稳住重心。",
    "intensity": 5,
    "tags": [
      "床沿站立",
      "抓单迎接"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_009",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用九浅一深的技巧刻意拉扯，{target} 在深插的那一下用力咬住对方的肩膀，发出一声满足的娇吟。",
    "intensity": 5,
    "tags": [
      "九浅一深",
      "深插咬肩"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_010",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 给出换姿势的暗示，{target} 立刻翻转身体变成仰躺，拉着对方的手臂引导其重新进入自己的身体。",
    "intensity": 5,
    "tags": [
      "换姿暗示",
      "翻身引导"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_011",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在女上位时放开对腰部的掌控，{target} 完全接管节奏，用熟练的画圈技巧让下方伴侣倒吸凉气。",
    "intensity": 5,
    "tags": [
      "放开掌控",
      "接管画圈"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_012",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 每次退出都几乎要滑出体外，{target} 惊慌地用内部力量牢牢吸附住，生怕失去这份致命的充实感。",
    "intensity": 5,
    "tags": [
      "滑出边缘",
      "吸附挽留"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_013",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 以极具压迫感的姿势悬在上方深插，{target} 仰头献上热吻，在唇舌交缠中化解下半身野蛮的力度。",
    "intensity": 5,
    "tags": [
      "上方悬空",
      "热吻化解"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_014",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 停止抽送要求反馈，{target} 必须准确说出想要换成哪种体位，并主动摆好姿势等待再次被贯穿。",
    "intensity": 5,
    "tags": [
      "停止反馈",
      "主动摆姿"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_015",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 开始毫无规律的狂乱抽插，{target} 放弃理智，随着撞击的频率疯狂摇晃身体，任由快感淹没自己。",
    "intensity": 5,
    "tags": [
      "狂乱抽插",
      "放弃理智"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_016",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 顶到最深处后开始细密地研磨，{target} 颤抖着扬起修长的脖颈，用身体的痉挛和收缩来回应折磨。",
    "intensity": 5,
    "tags": [
      "深处研磨",
      "痉挛回应"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_017",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 轻轻拍了一下臀部暗示配合，{target} 乖巧地调整大腿张开的幅度，让接下来的挺进变得顺畅无阻。",
    "intensity": 5,
    "tags": [
      "拍臀暗示",
      "调腿配合"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_018",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 在冲刺阶段用手固定住胯部，{target} 毫无退路，只能大声尖叫着承受最后几十下不留余地的深插。",
    "intensity": 5,
    "tags": [
      "固定胯部",
      "承受深插"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_019",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用稳定的频率在深处撞击敏感点，{target} 配合每次撞击的节奏大口呼吸，两人在完美的同步中攀升。",
    "intensity": 5,
    "tags": [
      "撞击敏感点",
      "呼吸同步"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_response_020",
    "stageKey": "finale",
    "taskMode": "response",
    "title": "任务",
    "template": "{actor} 用深情的眼神注视宣告即将释放，{target} 紧紧回抱住对方，在体内最深处的滚烫灌注中一起高潮。",
    "intensity": 5,
    "tags": [
      "眼神宣告",
      "回抱高潮"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_001",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 采用经典的传教士体位，将呼吸完全同频，在每次共同吸气时抽离，在每次共同呼气时重重顶入。",
    "intensity": 5,
    "tags": [
      "传教士",
      "呼吸同频"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_002",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 尝试高难度的站立或半站立交合体位，互相支撑着彼此的重量，体验失重感带来的极度刺激冲撞。",
    "intensity": 5,
    "tags": [
      "站立体位",
      "失重冲撞"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_003",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 换成女上位姿势，下方用力向上顶弄，上方配合着重力向下坐，在双向奔赴的撞击中把快感推向极致。",
    "intensity": 5,
    "tags": [
      "女上位",
      "双向奔赴"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_004",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 保持侧卧的后入姿势，在这个省力却异常亲密的体位下，进行长达两分钟缓慢而又缠绵的深插研磨。",
    "intensity": 5,
    "tags": [
      "侧卧后入",
      "深插研磨"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_005",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 默契地采用九浅一深的节奏，一起在浅处挑逗蓄力，然后在最深处的那一次撞击中同时爆发出喘息。",
    "intensity": 5,
    "tags": [
      "九浅一深",
      "蓄力爆发"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_006",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 紧密贴合在一起不再大开大合，而是共同用腰腹力量画圈，享受在最深处持续研磨的极限酸爽感。",
    "intensity": 5,
    "tags": [
      "紧密贴合",
      "画圈研磨"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_007",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 锁定那个让双方都疯狂的敏感点，放弃一切技巧，仅凭本能和渴望，发起长达一分钟的狂暴冲刺。",
    "intensity": 5,
    "tags": [
      "锁定敏感点",
      "狂暴冲刺"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_008",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 在即将到达高潮的边缘同时停下动作，死死咬住对方的嘴唇，硬生生把快感压制回去等待下一次爆发。",
    "intensity": 5,
    "tags": [
      "边缘急停",
      "压制爆发"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_009",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 十指紧扣压在头顶两侧，将手掌的握力与下半身冲撞的力度完美同步，每一次用力都伴随灵魂战栗。",
    "intensity": 5,
    "tags": [
      "十指紧扣",
      "力度同步"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_010",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相用大腿内侧死死夹住对方，在没有丝毫缝隙的贴合状态下，用微小的起伏带来极强烈的摩擦快感。",
    "intensity": 5,
    "tags": [
      "死死夹住",
      "微小起伏"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_011",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 将一条腿架在对方肩膀上彻底打开身体，在极其开阔的视角下，共同感受结合处的进出与水声。",
    "intensity": 5,
    "tags": [
      "单腿架肩",
      "视角全开"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_012",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 展开一场耐力较量，用最猛烈的体位和动作互相挑逗，看谁会先一步丢盔弃甲在攻势下迎来释放。",
    "intensity": 5,
    "tags": [
      "耐力较量",
      "猛烈挑逗"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_013",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 约定一个简单的动作信号，在给出信号后同时放弃所有节奏控制，向着最终的共同高潮发起最后冲刺。",
    "intensity": 5,
    "tags": [
      "动作信号",
      "最后冲刺"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_014",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 维持下半身稳定而深入的结合，同时上半身激烈拥吻，用唇舌交缠来回应下面每一次真刀真枪的撞击。",
    "intensity": 5,
    "tags": [
      "深插拥吻",
      "真枪实弹"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_015",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 配合着微微调整重心的位置，探索出今天这个体位下能到达的最深角度，然后保持这个角度疯狂输出。",
    "intensity": 5,
    "tags": [
      "调整重心",
      "最深角度"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_016",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 互相抚摸着汗湿的后背，在极其狂暴的做爱节奏中，给予对方最温柔的触觉支撑和情感回应。",
    "intensity": 5,
    "tags": [
      "抚摸后背",
      "狂暴支撑"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_017",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 保持身体的完全重叠缓慢挺进，直到胸膛贴着胸膛，在每一次交合中感受两颗心脏剧烈跳动的共振。",
    "intensity": 5,
    "tags": [
      "重叠挺进",
      "心脏共振"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_018",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 放弃语言，只用身体的痉挛、收缩和喉咙深处的低吼作为交流，引导彼此变换到最深入舒服的体位。",
    "intensity": 5,
    "tags": [
      "身体交流",
      "变换体位"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_019",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 在剧烈的冲刺中同时绷紧身体，伴随着一声共同的长叹，在极其深入的姿态下将滚烫激情彻底释放。",
    "intensity": 5,
    "tags": [
      "同时绷紧",
      "彻底释放"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_duo_020",
    "stageKey": "finale",
    "taskMode": "duo",
    "title": "任务",
    "template": "{both} 高潮过后依然保持着深深结合的体位不要分开，紧紧拥抱在一起互相亲吻，享受长达两分钟的美好余韵。",
    "intensity": 5,
    "tags": [
      "结合不分",
      "美好余韵"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_001",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 挪动到床沿边，利用自然的高度差形成最适合发力的交合体位，借着床铺的边缘开启新一轮猛烈攻势。",
    "intensity": 5,
    "tags": [
      "床沿高度差",
      "猛烈攻势"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_002",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 拿过两个厚实枕头垫在腰下，强行抬高骨盆的进入角度，在这个极度暴露的体位下找回被打断的深入。",
    "intensity": 5,
    "tags": [
      "枕头垫腰",
      "抬高骨盆"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_003",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 暂停激烈的动作，保持插入状态双双倒在凌乱的被褥间大口调整呼吸，再用更慢的节奏重新开始研磨。",
    "intensity": 5,
    "tags": [
      "保持插入",
      "倒床调整"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_004",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 转移到房间宽大的椅子上面对面跨坐，在狭小空间的逼迫下，建立起一种极其缓慢但深入至极的节奏。",
    "intensity": 5,
    "tags": [
      "椅子跨坐",
      "逼迫深入"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_005",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 将手机放在桌上设两分钟倒计时，期间无论发生什么都不许更换当前的传教士体位，只专注保持进出。",
    "intensity": 5,
    "tags": [
      "手机倒计时",
      "死守体位"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_006",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助坚固的床头板作为发力支撑点，将身体完全压制在上面，让每一次后入抽送都带上不容抗拒的力量。",
    "intensity": 5,
    "tags": [
      "床头板支撑",
      "后入压制"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_007",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 拉过被子将两人纠缠的身体完全盖住，在闷热、充满体液味道的私密空间里靠着纯粹的触觉继续冲撞。",
    "intensity": 5,
    "tags": [
      "被子遮盖",
      "纯粹触觉"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_008",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 靠在床头休息半分钟，期间下半身始终保持完全插入的连结状态，用片刻的宁静缓冲刚才过热的激情。",
    "intensity": 5,
    "tags": [
      "床头休息",
      "连结缓冲"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_009",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借助优质床垫的弹性，顺着床铺的起伏进行反弹，建立起一种极其省力但极具韵律感的上下起伏抽插。",
    "intensity": 5,
    "tags": [
      "床垫弹性",
      "韵律起伏"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_010",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 保持着结合的状态在宽大的床上共同翻滚半圈，顺势将上下位置互换，在全新的视野中无缝衔接挺进。",
    "intensity": 5,
    "tags": [
      "翻滚换位",
      "无缝挺进"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_011",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 抓起散落的衬衫或毛巾，互相擦去对方额头和锁骨间因为剧烈交合渗出的汗水，然后再向着高潮进发。",
    "intensity": 5,
    "tags": [
      "擦拭汗水",
      "重整进发"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_012",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 稍微停下片刻去拿水杯润喉，但在喝水时，两人的身体必须依然保持着严丝合缝的结合姿态不能分开。",
    "intensity": 5,
    "tags": [
      "喝水润喉",
      "严丝合缝"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_013",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 关掉房间里所有的灯光，在纯粹的黑暗中，只能听到极其清晰的肉体拍打声和彼此无法克制的高亢娇喘。",
    "intensity": 5,
    "tags": [
      "关灯全暗",
      "听觉刺激"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_014",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 挪动到坚硬的桌沿边靠着，用桌子的冰冷坚硬反衬交合处的滚烫柔软，在视觉和触觉的反差中开启新节奏。",
    "intensity": 5,
    "tags": [
      "桌沿冰冷",
      "滚烫反衬"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_015",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 扯下床单的一角死死咬在嘴里，用这种方式堵住即将因为过度深入而脱口而出的尖叫，放任疯狂冲撞。",
    "intensity": 5,
    "tags": [
      "咬住床单",
      "堵住尖叫"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_016",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 将一件外套搭在两人结合的敏感部位遮挡，在视觉被部分剥夺的情况下，将全部注意力集中在抽插上。",
    "intensity": 5,
    "tags": [
      "外套遮盖",
      "注意力集中"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_017",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 回到床铺的正中央，互相死死抓住对方的手臂作为稳固的锚点，以此来抵御即将到来的一波波最猛烈顶撞。",
    "intensity": 5,
    "tags": [
      "手臂锚点",
      "抵御猛撞"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_018",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 换成对体力消耗最小的侧卧姿势躺在床上，在不需要支撑身体的放松状态下，维持极其持久且磨人的进出。",
    "intensity": 5,
    "tags": [
      "侧卧放松",
      "持久磨人"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_019",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 用手机播放一首节奏感极其强烈的音乐，随后两人将抽送和撞击的频率完全贴合着音乐的重低音节拍进行。",
    "intensity": 5,
    "tags": [
      "音乐重低音",
      "节拍冲撞"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  },
  {
    "id": "dungeon_finale_scene_020",
    "stageKey": "finale",
    "taskMode": "scene",
    "title": "任务",
    "template": "{both} 借着窗外透进来的微光，看着镜子里两人交缠的倒影，在这个极具视觉冲击力的体位下完成最后的释放。",
    "intensity": 5,
    "tags": [
      "镜子倒影",
      "视觉冲击"
    ],
    "curated": true,
    "source": "最终阶段.TXT"
  }
] as ChallengeMaterial[]

const requiredPlaceholdersByMode: Record<TaskMode, string[]> = {
  directed: ['actor', 'target'],
  response: ['actor', 'target'],
  duo: ['both'],
  scene: ['both'],
}

export function getEligibleChallengeMaterials(stageKey: StageKey, taskMode: TaskMode): ChallengeMaterial[] {
  return challengeMaterials.filter(material => {
    if (!material.curated || material.stageKey !== stageKey || material.taskMode !== taskMode) {
      return false
    }

    const placeholders = extractPlaceholders(material.template)
    return requiredPlaceholdersByMode[taskMode].every(placeholder => placeholders.includes(placeholder))
  })
}

export function selectChallengeMaterial(stageKey: StageKey, taskMode: TaskMode, gateId: string, seed = ''): ChallengeMaterial | null {
  const eligibleMaterials = getEligibleChallengeMaterials(stageKey, taskMode)

  if (eligibleMaterials.length === 0) {
    return null
  }

  const index = hashString(`${stageKey}:${taskMode}:${gateId}:${seed}`) % eligibleMaterials.length
  return eligibleMaterials[index]
}

function hashString(value: string): number {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}
