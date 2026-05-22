# 我们的花园 —— 情感维护工具

## 项目背景

为汪俊（wangjundsg）和女朋友"小怪兽"开发的双人情感维护网页工具。两人是异地恋学生，她重情绪、表达别扭，他重逻辑、正在学习包容。

核心原则：**不是法律条款，而是让两人成为彼此的避难所。**

## 技术栈

- **纯 HTML/CSS/JS**，零依赖，无 npm/build
- **PWA**（manifest.json + sw.js），可添加到手机主屏幕，离线可用
- **localStorage** 存所有数据（无后端、无隐私担忧）
- **GitHub Pages** 部署：https://wangjundsg.github.io/home/
- **移动端优先**，系统字体，emoji 图标
- **Python 辅助脚本**：`generate_icons.py` 和 `generate_pdf.py`

## 文件结构

```
qinggan-weihu/
├── index.html           # 单页应用外壳
├── manifest.json        # PWA 配置（PNG 图标）
├── sw.js                # Service Worker（离线缓存）
├── .nojekyll            # 禁止 GitHub Pages 用 Jekyll 渲染
│
├── css/
│   ├── reset.css        # CSS 重置
│   ├── variables.css    # 暖橘色调色板（#E8734A 主色）
│   ├── base.css         # 排版、布局、底部导航
│   ├── components.css   # 卡片、按钮、弹窗、toast 等组件
│   └── screens.css      # 各页面专属样式
│
├── js/
│   ├── storage.js       # localStorage 读写、默认数据、合并导入
│   ├── ui.js            # toast、弹窗、全屏覆盖、粒子特效、确认对话框
│   ├── router.js        # 简易 hash 路由（含导航更新）
│   ├── app.js           # 入口文件：启动、新手指南、渲染调度
│   └── screens/
│       ├── home.js         # 急救贴士（首页，最核心）
│       ├── daily.js        # 打卡积分 + 奖励商店 + 心愿池
│       ├── commitments.js  # 承诺墙（红/黄线标记）
│       ├── compensation.js # 补偿小卖部（双勾闭环）
│       ├── interact.js     # 7种互动模式
│       ├── meeting.js      # 见面管理（倒计时 + 记录）
│       ├── growth.js       # 成长层（情绪按钮/需求/被爱瞬间）
│       ├── phrases.js      # 启动句库
│       └── settings.js     # 设置 + 导入导出 + 重置
│
├── assets/icons/
│   ├── icon-192.png    # PWA 图标 192x192
│   └── icon-512.png    # PWA 图标 512x512
│
├── README.md           # 使用说明书（完整版）
├── CLAUDE.md           # 本文件：项目文档
├── generate_icons.py   # 生成 PWA PNG 图标脚本
└── generate_pdf.py     # 将 README.md 转 PDF 脚本
```

## 底部导航（5 个 Tab）

| 图标 | 名称 | 功能 |
|------|------|------|
| 🩺 | 急救 | 情绪上头时的三卡片选择，一键复制启动句 |
| 📋 | 日常 | 打卡攒积分 + 4档奖励商店 + 见面倒计时 + 心愿池 |
| 🤝 | 承诺 | 双方承诺墙，红线/黄线区分标记 |
| 🏪 | 补偿 | 记录违规→补偿✓→原谅✓→翻篇，双人闭环 |
| 🎮 | 互动 | 7种互动模式（见下方） |

## 核心功能模块

### 1. 急救贴士（首页）
- 三个大卡片：🔴我生气了 / 🔴TA生气了 / 🟢我们很好
- 点击展开显示✅可说的和❌别做的
- 一键复制句子到微信
- 安全词全屏提醒按钮

### 2. 打卡积分 & 奖励商店
- 自愿打卡，不强制
- 积分项目：每日信号+5 / 深度视频+20 / 使用启动句+10 / 记录被爱瞬间+5 / 一周无违规+30 / 见面+50
- 4档奖励：🥉30分 / 🥈60分 / 🥇100分 / 🏆200分
- 兑换后对方需确认兑现

### 3. 承诺墙
- 双方承诺分开展示
- 红线承诺左侧红边，黄线承诺左侧黄边
- 可编辑、可删除

### 4. 补偿小卖部
- 记录谁 + 什么违规 + 红线/黄线 + 补偿方案
- 两个勾选框：补偿完成 ✓（触发方）→ 已收到原谅 ✓（对方）
- 双勾后自动归入"已翻篇"

### 5. 互动模块（7 种）
- 💬 真心话盲盒（抽题回答）
- 🎯 默契大考验（选择题比默契度）
- 🎲 骰子挑战（6种小任务）
- 📝 共同日记（每日话题）
- 🎨 接力故事（一人一句编故事）
- 🌈 心情涂鸦（画布涂鸦截屏）
- 🎵 我们的歌单（共享音乐）

### 6. 更多菜单（📋左上角）
- 🌱 成长层：情绪按钮、发火时的需求、被爱瞬间
- 💬 启动句库：7 句可直接复制的句子
- 💑 见面管理：倒计时 + 心愿池 + 见面记录

### 7. 设置（⚙️右上角）
- 双方名字、安全词、见面日期
- 字体大小（小/中/大）
- JSON 导出导入（数据同步）
- 重置所有数据

## 数据模型

所有数据存在 localStorage key `relationshipTool` 中，JSON 结构包含：
- `partners`: personA（汪俊）/ personB（小怪兽），含名字、积分、承诺、触发点、需求、被爱瞬间
- `safeWord`: 安全词短语和含义
- `emergencyTips`: 三个状态的提示内容
- `checkins`: 打卡记录数组
- `pointsLog`: 积分变动日志
- `rewardRedemptions`: 奖励兑换记录
- `meeting`: 见面日期、心愿池、历史见面
- `compensations`: 补偿记录（含双勾状态）
- `interactData`: 互动数据（真心话、默契分、共同日记、歌单等）
- `phrases`: 启动句数组
- `settings`: 设置
- `onboardingComplete`: 是否已完成新手指引

## 数据同步方式

双方各自的数据存在各自的手机 localStorage 中。同步方式：
1. 设置 → 导出数据 → 下载 JSON 文件
2. 通过微信发给对方
3. 对方在设置 → 导入数据，自动合并（不覆盖各自已有的内容）

## 视觉风格

- 暖橘色主调 #E8734A，米白背景 #FFF8F5
- 圆角卡片，柔和阴影
- 大触控区域（≥48px）
- 系统字体（中文优先）
- 尊重 `prefers-reduced-motion`

## 关键修改记录

- v1.0 (2026-05-04)：首次部署到 GitHub Pages
- PWA 图标修复：从 SVG 改为 PNG 192x192 + 512x512（解决 Android 安装问题）
- 华为自带浏览器不支持 PWA 安装，需用 Chrome

## 注意

- 所有 JS 文件使用全局 `window.R` 对象共享工具函数（非 ES modules），加载顺序：storage.js → ui.js → router.js → screen/*.js → app.js
- screen 文件通过 `window.renderXxx(container, data)` 方式注册，app.js 通过 `'render' + screenName.charAt(0).toUpperCase() + screenName.slice(1)` 动态调用
