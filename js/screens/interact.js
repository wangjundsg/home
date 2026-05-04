// Interaction Module Screen
window.renderInteract = function(container, data) {
  const selfName = data.partners.personA.name;
  const partnerName = data.partners.personB.name;

  container.innerHTML = `
    <div class="interact-page">
      <div class="screen-subtitle" style="text-align:center">
        选一个模式，和${partnerName}一起玩吧
      </div>

      <!-- Mode cards -->
      <div class="interact-grid">
        <!-- Truth or Dare Blind Box -->
        <div class="card interact-card" id="interactTruth">
          <div class="interact-icon">💬</div>
          <div class="interact-card-title">真心话盲盒</div>
          <div class="interact-card-desc">抽一张真心话卡片，诚实地回答</div>
        </div>

        <!-- Chemistry Test -->
        <div class="card interact-card" id="interactChemistry">
          <div class="interact-icon">🎯</div>
          <div class="interact-card-title">默契大考验</div>
          <div class="interact-card-desc">看看你们有多了解对方</div>
        </div>

        <!-- Dice Challenge -->
        <div class="card interact-card" id="interactDice">
          <div class="interact-icon">🎲</div>
          <div class="interact-card-title">骰子挑战</div>
          <div class="interact-card-desc">扔骰子，完成对应任务</div>
        </div>

        <!-- Shared Diary -->
        <div class="card interact-card" id="interactDiary">
          <div class="interact-icon">📝</div>
          <div class="interact-card-title">共同日记</div>
          <div class="interact-card-desc">每天一个话题，写下心里话</div>
        </div>

        <!-- Story Chain -->
        <div class="card interact-card" id="interactStory">
          <div class="interact-icon">🎨</div>
          <div class="interact-card-title">接力故事</div>
          <div class="interact-card-desc">一人写一句，编一个你们的故事</div>
        </div>

        <!-- Mood Doodle -->
        <div class="card interact-card" id="interactDoodle">
          <div class="interact-icon">🌈</div>
          <div class="interact-card-title">心情涂鸦</div>
          <div class="interact-card-desc">画出今天的心情，截屏分享</div>
        </div>

        <!-- Shared Playlist -->
        <div class="card interact-card" id="interactPlaylist">
          <div class="interact-icon">🎵</div>
          <div class="interact-card-title">我们的歌单</div>
          <div class="interact-card-desc">记录让彼此想到对方的歌</div>
        </div>
      </div>
    </div>

    <!-- Dice overlay (hidden by default) -->
    <div id="diceOverlay" style="display:none">
      <div class="fullscreen-overlay" style="background:rgba(255,248,245,0.95)">
        <div id="diceResult" style="font-size:6rem;transition:transform 0.3s">🎲</div>
        <div id="diceTask" style="font-size:var(--font-size-xl);text-align:center;padding:0 var(--space-lg);color:var(--color-text)"></div>
        <button class="btn btn-primary btn-lg" id="btnRollDice">扔骰子！</button>
        <button class="btn btn-outline" id="btnCloseDice">返回</button>
      </div>
    </div>
  `;

  // Truth or Dare
  const truthCard = container.querySelector('#interactTruth');
  if (truthCard) {
    truthCard.addEventListener('click', () => {
      const questions = [
        '你最近一次想我是什么时候？',
        '如果明天就能见面，你最想做什么？',
        '你觉得我最让你感动的一件事是什么？',
        '你最喜欢我身上的哪个特质？',
        '我们第一次见面时，你第一反应是什么？',
        '如果用一个动物形容我，你觉得是什么？',
        '你觉得我最需要改进的地方是什么？（温柔地说）',
        '你最近一次因为我而笑是什么事？',
        '如果我们可以立刻去任何地方，你想去哪？',
        '你觉得我们之间最默契的是什么？',
        '你最想和我一起完成的一件事是什么？',
        '我在你心里的专属位置是什么？',
        '你觉得什么时候的你最帅/最美？',
        '有什么话你一直想对我说但还没说？',
        '如果给我起一个只有你能叫的昵称，会是什么？'
      ];
      const question = questions[Math.floor(Math.random() * questions.length)];

      const interactData = data.interactData || {};
      interactData.真心话Questions = interactData.真心话Questions || [];
      interactData.真心话Answers = interactData.真心话Answers || {};

      const content = `
        <div style="text-align:center;padding:var(--space-lg) 0">
          <div style="font-size:4rem;margin-bottom:var(--space-lg)">💬</div>
          <div style="font-size:var(--font-size-xl);font-weight:600;margin-bottom:var(--space-lg);line-height:1.6;color:var(--color-primary)">
            "${question}"
          </div>
          <div class="form-group" style="text-align:left">
            <label class="form-label">你的回答</label>
            <textarea class="form-input form-textarea" id="truthAnswer" placeholder="诚实地写下你的回答..."></textarea>
          </div>
          <button class="btn btn-primary btn-block" id="submitTruth">记录我的回答 💗</button>
          <button class="btn btn-outline btn-block mt-md" id="reshuffleTruth">换一题 🔄</button>
        </div>
      `;
      const modal = window.R.showModal({ title: '真心话盲盒', content });

      modal.sheet.querySelector('#reshuffleTruth').addEventListener('click', () => {
        const newQ = questions[Math.floor(Math.random() * questions.length)];
        modal.sheet.querySelector('.card').querySelector('div').textContent = `"${newQ}"`;
      });

      modal.sheet.querySelector('#submitTruth').addEventListener('click', () => {
        const answer = modal.sheet.querySelector('#truthAnswer').value.trim();
        if (answer) {
          const d = window.getData();
          d.interactData = d.interactData || {};
          d.interactData.真心话Answers = d.interactData.真心话Answers || {};
          const key = `${question}_A`;
          d.interactData.真心话Answers[key] = {
            date: new Date().toISOString().split('T')[0],
            answer,
            person: 'A'
          };
          window.updateData(d);
          modal.close();
          window.R.showToast('回答已记录 💗', 'success');
        }
      });
    });
  }

  // Chemistry Test
  const chemCard = container.querySelector('#interactChemistry');
  if (chemCard) {
    chemCard.addEventListener('click', () => {
      const tests = [
        { q: 'TA生气时最希望你做什么？', options: ['讲道理', '先抱住TA', '给TA空间', '送礼物'] },
        { q: 'TA最喜欢的约会方式？', options: ['在家一起做饭', '出去吃大餐', '散步聊天', '看电影'] },
        { q: 'TA最不喜欢你说哪句话？', options: ['"你又这样"', '"随便你"', '"哦"', '"冷静一下"'] },
        { q: 'TA什么时候最需要你？', options: ['开心时', '难过时', '生气时', '所有时候'] },
        { q: 'TA觉得你什么时候最帅/最美？', options: ['认真做事时', '笑起来时', '刚睡醒时', '穿正装时'] }
      ];
      const test = tests[Math.floor(Math.random() * tests.length)];

      const content = `
        <div style="text-align:center;padding:var(--space-md) 0">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">🎯</div>
          <div style="font-size:var(--font-size-lg);font-weight:600;margin-bottom:var(--space-lg);line-height:1.6">
            ${test.q}
          </div>
          <div style="text-align:left">
            ${test.options.map((o, i) => `
              <button class="btn btn-outline btn-block chem-option" data-answer="${o}" style="margin-bottom:var(--space-sm);text-align:left;justify-content:flex-start">
                ${['A', 'B', 'C', 'D'][i]}. ${o}
              </button>
            `).join('')}
          </div>
          <p class="text-sm text-soft mt-md">选好后让TA也选一下，看看默契度！</p>
        </div>
      `;
      const modal = window.R.showModal({ title: '默契大考验', content });

      modal.sheet.querySelectorAll('.chem-option').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.style.background = 'var(--color-primary-soft)';
          btn.style.borderColor = 'var(--color-primary)';
          btn.style.color = 'var(--color-primary)';
          modal.sheet.querySelectorAll('.chem-option').forEach(b => {
            if (b !== btn) b.disabled = true;
          });
          const d = window.getData();
          d.interactData = d.interactData || {};
          d.interactData.默契Scores = d.interactData.默契Scores || [];
          d.interactData.默契Scores.push({
            id: window.R.generateId(),
            date: new Date().toISOString().split('T')[0],
            question: test.q,
            answerA: btn.dataset.answer,
            person: 'A'
          });
          window.updateData(d);
          window.R.showToast('你的答案已记录！让TA也来答吧', 'success');
        });
      });
    });
  }

  // Dice Challenge
  const diceCard = container.querySelector('#interactDice');
  if (diceCard) {
    diceCard.addEventListener('click', () => {
      const diceOverlay = container.querySelector('#diceOverlay');
      const diceResult = container.querySelector('#diceResult');
      const diceTask = container.querySelector('#diceTask');

      diceOverlay.style.display = 'block';
      diceResult.textContent = '🎲';
      diceTask.textContent = '扔出骰子，完成对应的小任务！';

      const tasks = {
        1: '夸对方三句，要具体的！',
        2: '模仿对方的语气说一句话',
        3: '唱两句歌给对方听',
        4: '说出对方一个你最近才发现的新优点',
        5: '发一张此刻的自拍给对方',
        6: '抽一次真心话盲盒！'
      };

      container.querySelector('#btnRollDice').addEventListener('click', () => {
        diceResult.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
          const num = Math.floor(Math.random() * 6) + 1;
          const diceEmojis = { 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣' };
          diceResult.textContent = diceEmojis[num];
          diceResult.style.transform = 'rotate(0deg) scale(1)';
          diceTask.innerHTML = `<strong>任务 ${num}：</strong>${tasks[num]}`;

          const d = window.getData();
          d.interactData = d.interactData || {};
          d.interactData.diceHistory = d.interactData.diceHistory || [];
          d.interactData.diceHistory.push({
            id: window.R.generateId(),
            date: new Date().toISOString().split('T')[0],
            number: num,
            task: tasks[num]
          });
          window.updateData(d);
        }, 300);
      });

      container.querySelector('#btnCloseDice').addEventListener('click', () => {
        diceOverlay.style.display = 'none';
      });
    });
  }

  // Shared Diary
  const diaryCard = container.querySelector('#interactDiary');
  if (diaryCard) {
    diaryCard.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      const topics = [
        '今天最想对方的瞬间',
        '今天让我感到幸福的一件小事',
        '如果有超能力，今天想为TA做什么',
        '今天的心情用天气来形容',
        '今天我想对TA说但还没说的话',
        '今天做什么事的时候想到了TA'
      ];
      const topic = topics[new Date().getDay() % topics.length];

      const interactData = data.interactData || {};
      interactData.共同Diary = interactData.共同Diary || [];
      const todayEntry = interactData.共同Diary.find(d => d.date === today && d.person === 'A');

      const content = `
        <div style="text-align:center;padding:var(--space-md) 0">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">📝</div>
          <div style="background:var(--color-primary-soft);padding:var(--space-md);border-radius:var(--radius-md);margin-bottom:var(--space-lg)">
            <div class="text-sm text-soft">今日话题</div>
            <div style="font-size:var(--font-size-lg);font-weight:600;color:var(--color-primary)">${topic}</div>
          </div>
          ${todayEntry ? `
            <div class="card" style="background:var(--color-bg);text-align:left">
              <div class="text-sm text-soft">你今天的记录</div>
              <p style="margin-top:var(--space-sm)">${todayEntry.text}</p>
            </div>
          ` : `
            <div class="form-group" style="text-align:left">
              <label class="form-label">写下你的心里话</label>
              <textarea class="form-input form-textarea" id="diaryText" placeholder="想到什么写什么..."></textarea>
            </div>
            <button class="btn btn-primary btn-block" id="submitDiary">记录今天的日记 💗</button>
          `}
        </div>
      `;
      const modal = window.R.showModal({ title: '共同日记', content });

      const submitBtn = modal.sheet.querySelector('#submitDiary');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          const text = modal.sheet.querySelector('#diaryText').value.trim();
          if (text) {
            const d = window.getData();
            d.interactData = d.interactData || {};
            d.interactData.共同Diary = d.interactData.共同Diary || [];
            d.interactData.共同Diary.push({
              id: window.R.generateId(),
              date: today,
              topic,
              text,
              person: 'A'
            });
            window.updateData(d);
            modal.close();
            window.R.showToast('日记已记录 💗', 'success');
          }
        });
      }
    });
  }

  // Story Chain
  const storyCard = container.querySelector('#interactStory');
  if (storyCard) {
    storyCard.addEventListener('click', () => {
      const interactData = data.interactData || {};
      interactData.storyChain = interactData.storyChain || [];
      const story = interactData.storyChain;

      const content = `
        <div style="text-align:center;padding:var(--space-md) 0">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">🎨</div>
          <div style="margin-bottom:var(--space-lg)">
            ${story.length === 0 ? `
              <p class="text-soft">还没有开始，写第一句吧！</p>
            ` : `
              <div class="card" style="background:var(--color-bg);text-align:left;max-height:200px;overflow-y:auto">
                ${story.map(s => `
                  <p style="margin-bottom:var(--space-sm);${s.person === 'A' ? 'color:var(--color-primary)' : 'color:var(--color-accent)'}">
                    <strong>${s.person === 'A' ? selfName : partnerName}：</strong>${s.text}
                  </p>
                `).join('')}
              </div>
            `}
          </div>
          <div class="form-group" style="text-align:left">
            <label class="form-label">续写一句</label>
            <input class="form-input" id="storyLine" placeholder="接上一句写...">
          </div>
          <button class="btn btn-primary btn-block" id="submitStory">续写 ✍️</button>
          ${story.length > 0 ? `<button class="btn btn-outline btn-block mt-md" id="resetStory">重新开始</button>` : ''}
        </div>
      `;
      const modal = window.R.showModal({ title: '接力故事', content });

      modal.sheet.querySelector('#submitStory')?.addEventListener('click', () => {
        const text = modal.sheet.querySelector('#storyLine').value.trim();
        if (text) {
          const d = window.getData();
          d.interactData = d.interactData || {};
          d.interactData.storyChain = d.interactData.storyChain || [];
          d.interactData.storyChain.push({
            id: window.R.generateId(),
            date: new Date().toISOString().split('T')[0],
            text,
            person: 'A'
          });
          window.updateData(d);
          modal.close();
          window.R.showToast('故事续写了！让TA接下一句吧', 'success');
        }
      });

      modal.sheet.querySelector('#resetStory')?.addEventListener('click', () => {
        window.R.confirmDialog({ title: '重新开始', message: '确定要清空故事重新开始吗？' }).then(confirmed => {
          if (confirmed) {
            const d = window.getData();
            d.interactData = d.interactData || {};
            d.interactData.storyChain = [];
            window.updateData(d);
            modal.close();
            window.R.showToast('故事已清空', 'success');
          }
        });
      });
    });
  }

  // Mood Doodle
  const doodleCard = container.querySelector('#interactDoodle');
  if (doodleCard) {
    doodleCard.addEventListener('click', () => {
      const content = `
        <div style="text-align:center;padding:var(--space-md) 0">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">🌈</div>
          <p style="margin-bottom:var(--space-lg);color:var(--color-text-soft)">
            选一个颜色，在画布上涂鸦。画出今天的心情，截屏分享给TA！
          </p>
          <div style="display:flex;gap:var(--space-sm);justify-content:center;margin-bottom:var(--space-md);flex-wrap:wrap" id="colorPicker">
            ${['#E8734A','#F4A261','#7FB069','#D64045','#4A90D9','#9B59B6','#3D2C2E','#F0C040'].map(c => `
              <button class="color-btn" style="width:36px;height:36px;border-radius:50%;background:${c};border:3px solid transparent" data-color="${c}"></button>
            `).join('')}
          </div>
          <canvas id="doodleCanvas" width="300" height="300" style="border:2px solid var(--color-border);border-radius:var(--radius-md);touch-action:none;background:#fff;max-width:100%"></canvas>
          <div style="display:flex;gap:var(--space-md);justify-content:center;margin-top:var(--space-md)">
            <button class="btn btn-outline btn-sm" id="clearDoodle">清空</button>
            <button class="btn btn-soft btn-sm" id="saveDoodle">我画好了</button>
          </div>
          <p class="text-sm text-soft mt-md">画完记得截屏发给TA哦 📸</p>
        </div>
      `;
      const modal = window.R.showModal({ title: '心情涂鸦板', content });

      setTimeout(() => {
        const canvas = modal.sheet.querySelector('#doodleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let drawing = false;
        let currentColor = '#E8734A';

        modal.sheet.querySelectorAll('.color-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            currentColor = btn.dataset.color;
            modal.sheet.querySelectorAll('.color-btn').forEach(b => b.style.borderColor = 'transparent');
            btn.style.borderColor = 'var(--color-text)';
          });
        });
        modal.sheet.querySelectorAll('.color-btn')[0]?.style && (modal.sheet.querySelectorAll('.color-btn')[0].style.borderColor = 'var(--color-text)');

        const draw = (e) => {
          if (!drawing) return;
          e.preventDefault();
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
          const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
          ctx.fillStyle = currentColor;
          ctx.beginPath();
          ctx.arc(x * scaleX, y * scaleY, 4, 0, Math.PI * 2);
          ctx.fill();
        };

        canvas.addEventListener('mousedown', (e) => { drawing = true; draw(e); });
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => { drawing = false; });
        canvas.addEventListener('touchstart', (e) => { drawing = true; draw(e); });
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', () => { drawing = false; });

        modal.sheet.querySelector('#clearDoodle').addEventListener('click', () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        modal.sheet.querySelector('#saveDoodle').addEventListener('click', () => {
          window.R.showToast('画好了！截屏分享给TA吧~', 'success');
        });
      }, 100);
    });
  }

  // Shared Playlist
  const playlistCard = container.querySelector('#interactPlaylist');
  if (playlistCard) {
    playlistCard.addEventListener('click', () => {
      const interactData = data.interactData || {};
      const songs = interactData.songs || [];

      const content = `
        <div style="padding:var(--space-md) 0">
          ${songs.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">🎵</div>
              <div class="empty-state-text">还没有添加歌曲</div>
            </div>
          ` : `
            <div style="margin-bottom:var(--space-lg)">
              ${songs.map(s => `
                <div class="card" style="padding:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">
                  <span style="font-size:1.5rem">🎵</span>
                  <div style="flex:1">
                    <div style="font-weight:600">${s.title}</div>
                    <div class="text-sm text-soft">${s.artist || ''} · 添加者：${s.addedBy === 'A' ? selfName : partnerName}</div>
                    ${s.note ? `<div class="text-sm text-soft" style="font-style:italic">"${s.note}"</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          `}
          <div class="form-group">
            <label class="form-label">歌名</label>
            <input class="form-input" id="songTitle" placeholder="让我想到TA的歌">
          </div>
          <div class="form-group">
            <label class="form-label">歌手（选填）</label>
            <input class="form-input" id="songArtist" placeholder="歌手名">
          </div>
          <div class="form-group">
            <label class="form-label">为什么这首歌让你想到TA？（选填）</label>
            <input class="form-input" id="songNote" placeholder="因为...">
          </div>
          <button class="btn btn-primary btn-block" id="submitSong">添加歌曲 🎵</button>
        </div>
      `;
      const modal = window.R.showModal({ title: '我们的歌单', content });

      modal.sheet.querySelector('#submitSong')?.addEventListener('click', () => {
        const title = modal.sheet.querySelector('#songTitle').value.trim();
        if (title) {
          const d = window.getData();
          d.interactData = d.interactData || {};
          d.interactData.songs = d.interactData.songs || [];
          d.interactData.songs.push({
            id: window.R.generateId(),
            date: new Date().toISOString().split('T')[0],
            title,
            artist: modal.sheet.querySelector('#songArtist').value.trim(),
            note: modal.sheet.querySelector('#songNote').value.trim(),
            addedBy: 'A'
          });
          window.updateData(d);
          modal.close();
          window.R.showToast('歌曲已添加 🎵', 'success');
        }
      });
    });
  }
};
