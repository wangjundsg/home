// Daily Check-in & Points & Rewards Screen
window.renderDaily = function(container, data) {
  const selfName = data.partners.personA.name;
  const partnerName = data.partners.personB.name;
  const selfPoints = data.partners.personA.points || 0;
  const partnerPoints = data.partners.personB.points || 0;
  const today = new Date().toISOString().split('T')[0];

  // Check if daily signal done today
  const todayCheckin = (data.checkins || []).find(c => c.date === today);
  const dailyDone = todayCheckin?.dailySignal?.done;
  const weeklyDoneThisWeek = checkWeeklyDone(data);
  const meetingDays = window.R.daysUntil(data.meeting?.nextDate);

  container.innerHTML = `
    <div class="daily-page">
      <!-- Points display -->
      <div class="points-display">
        <div class="points-card">
          <div class="points-label">${selfName}的积分</div>
          <div class="points-value">${selfPoints}</div>
        </div>
        <div class="points-divider">💕</div>
        <div class="points-card">
          <div class="points-label">${partnerName}的积分</div>
          <div class="points-value">${partnerPoints}</div>
        </div>
      </div>

      <!-- Meeting countdown -->
      ${meetingDays !== null ? `
        <div class="meeting-countdown-card card">
          <div class="countdown-label">距离下次见面还有</div>
          <div class="countdown-days">${meetingDays}</div>
          <div class="countdown-label">天</div>
          ${meetingDays <= 3 ? '<div class="countdown-hype">🎉 马上就能见面啦！</div>' : ''}
        </div>
      ` : `
        <div class="card text-center" style="padding:var(--space-lg)">
          <div style="font-size:2rem;margin-bottom:var(--space-sm)">📅</div>
          <div class="text-soft">还没有设置下次见面日期</div>
          <button class="btn btn-soft btn-sm mt-md" id="btnSetDate">设置日期</button>
        </div>
      `}

      <!-- Daily check-in items -->
      <div class="section-header mt-lg">
        <h3 class="section-title">今日打卡</h3>
        <span class="text-sm text-soft">完成得积分 💪</span>
      </div>

      <div class="card check-card ${dailyDone ? 'done' : ''}" id="checkDailySignal">
        <div class="check-card-left">
          <div class="check-emoji">📸</div>
          <div>
            <div class="check-title">每日"我在"信号 <span class="badge badge-primary">+5分</span></div>
            <div class="check-desc">发一条自拍/云/"想你"给对方</div>
            ${todayCheckin?.dailySignal?.note ? `<div class="check-note">→ ${todayCheckin.dailySignal.note}</div>` : ''}
          </div>
        </div>
        <div class="check-status ${dailyDone ? 'checked' : ''}">${dailyDone ? '✓' : '○'}</div>
      </div>

      <div class="card check-card ${weeklyDoneThisWeek ? 'done' : ''}" id="checkWeeklyVideo">
        <div class="check-card-left">
          <div class="check-emoji">📹</div>
          <div>
            <div class="check-title">每周深度视频 <span class="badge badge-primary">+20分</span></div>
            <div class="check-desc">不玩手机，至少30分钟</div>
          </div>
        </div>
        <div class="check-status ${weeklyDoneThisWeek ? 'checked' : ''}">${weeklyDoneThisWeek ? '✓' : '○'}</div>
      </div>

      <div class="card check-card" id="checkUsePhrase">
        <div class="check-card-left">
          <div class="check-emoji">💬</div>
          <div>
            <div class="check-title">使用启动句 <span class="badge badge-primary">+10分</span></div>
            <div class="check-desc">用了一句启动句发给对方</div>
          </div>
        </div>
        <div class="check-status">○</div>
      </div>

      <div class="card check-card" id="checkNoViolation">
        <div class="check-card-left">
          <div class="check-emoji">🛡️</div>
          <div>
            <div class="check-title">一周无违规 <span class="badge badge-warning">+30分</span></div>
            <div class="check-desc">这周没有触发红线或黄线</div>
          </div>
        </div>
        <div class="check-status">○</div>
      </div>

      <!-- Reward Store -->
      <div class="section-header mt-lg">
        <h3 class="section-title">🏪 奖励商店</h3>
      </div>

      <div class="reward-grid">
        <div class="card reward-card" data-tier="bronze">
          <div class="reward-tier">🥉 小确幸</div>
          <div class="reward-cost">30 积分</div>
          <div class="reward-examples">定制情话 / 专属表情包 / 对方指定一首歌</div>
          <button class="btn btn-soft btn-sm btn-block mt-md redeem-btn" data-tier="bronze" data-cost="30" data-name="小确幸">兑换</button>
        </div>

        <div class="card reward-card" data-tier="silver">
          <div class="reward-tier">🥈 暖心奖</div>
          <div class="reward-cost">60 积分</div>
          <div class="reward-examples">15分钟专属按摩 / 一次不打断的倾听 / 对方指定一顿饭</div>
          <button class="btn btn-soft btn-sm btn-block mt-md redeem-btn" data-tier="silver" data-cost="60" data-name="暖心奖">兑换</button>
        </div>

        <div class="card reward-card" data-tier="gold">
          <div class="reward-tier">🥇 特别奖</div>
          <div class="reward-cost">100 积分</div>
          <div class="reward-examples">一次约会全包(≤100元) / 手工礼物一件 / 满足一个小心愿</div>
          <button class="btn btn-soft btn-sm btn-block mt-md redeem-btn" data-tier="gold" data-cost="100" data-name="特别奖">兑换</button>
        </div>

        <div class="card reward-card" data-tier="diamond">
          <div class="reward-tier">🏆 终极大奖</div>
          <div class="reward-cost">200 积分</div>
          <div class="reward-examples">一日完全服从对方安排 / 一封手写长信+视频念出来</div>
          <button class="btn btn-soft btn-sm btn-block mt-md redeem-btn" data-tier="diamond" data-cost="200" data-name="终极大奖">兑换</button>
        </div>
      </div>

      <!-- Redemption history -->
      ${(data.rewardRedemptions || []).length > 0 ? `
        <div class="section-header mt-lg">
          <h3 class="section-title">📜 兑换记录</h3>
        </div>
        <div>
          ${data.rewardRedemptions.slice(-5).reverse().map(r => `
            <div class="card" style="padding:var(--space-md)">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                  <span class="badge badge-primary">${r.tier}</span>
                  <span style="margin-left:var(--space-sm)">${r.rewardName} → ${r.from} 送给 ${r.to}</span>
                </div>
                <span class="text-sm text-soft">${r.date}</span>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Wishlist -->
      <div class="section-header mt-lg">
        <h3 class="section-title">📝 心愿池</h3>
        <button class="btn btn-soft btn-sm" id="btnAddWish">+ 添加</button>
      </div>
      <div id="wishlistContainer">
        ${(data.meeting?.wishlist || []).length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <div class="empty-state-text">还没有心愿，添加一个下次见面想一起做的事吧</div>
          </div>
        ` : (data.meeting?.wishlist || []).map(w => `
          <div class="card wish-item ${w.fulfilled ? 'fulfilled' : ''}" data-id="${w.id}" style="padding:var(--space-md);display:flex;align-items:center;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:var(--space-sm);flex:1">
              <span class="check-fancy ${w.fulfilled ? 'checked' : ''}">
                <span class="check-box"></span>
              </span>
              <span style="${w.fulfilled ? 'text-decoration:line-through;color:var(--color-text-soft)' : ''}">${w.text}</span>
            </div>
            <span class="text-sm text-soft">${w.addedBy === 'A' ? selfName : partnerName}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Event: daily signal check
  const dailyCard = container.querySelector('#checkDailySignal');
  if (dailyCard) {
    dailyCard.addEventListener('click', () => {
      if (dailyDone) return;
      const content = `
        <div class="form-group">
          <label class="form-label">今天的"我在"信号是什么？</label>
          <input class="form-input" id="signalNote" placeholder="例如：发了一张云的照片，说想你了">
        </div>
        <button class="btn btn-primary btn-block" id="submitSignal">确认打卡 +5分</button>
      `;
      const modal = window.R.showModal({ title: '每日"我在"信号', content });
      modal.sheet.querySelector('#submitSignal').addEventListener('click', () => {
        const note = modal.sheet.querySelector('#signalNote').value.trim();
        const d = window.getData();
        let checkins = d.checkins || [];
        let todayEntry = checkins.find(c => c.date === today);
        if (!todayEntry) {
          todayEntry = { date: today, dailySignal: {}, deepVideo: {}, teaTalk: {}, meeting: {} };
          checkins.push(todayEntry);
        }
        todayEntry.dailySignal = { done: true, note: note || '完成', by: 'A' };
        d.checkins = checkins;
        d.partners.personA.points += 5;
        d.pointsLog = d.pointsLog || [];
        d.pointsLog.push({ id: window.R.generateId(), date: today, person: 'A', amount: 5, reason: '每日"我在"信号' });
        window.updateData(d);
        modal.close();
        window.R.showToast('打卡成功！+5积分', 'success');
        window.R.spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
        window.renderAllScreens();
      });
    });
  }

  // Event: weekly video check
  const weeklyCard = container.querySelector('#checkWeeklyVideo');
  if (weeklyCard && !weeklyDoneThisWeek) {
    weeklyCard.addEventListener('click', () => {
      window.R.confirmDialog({
        title: '确认打卡',
        message: '这周你们进行了一次深度视频聊天（不玩手机，30分钟以上）吗？'
      }).then(confirmed => {
        if (confirmed) {
          const d = window.getData();
          let checkins = d.checkins || [];
          let todayEntry = checkins.find(c => c.date === today);
          if (!todayEntry) {
            todayEntry = { date: today, dailySignal: {}, deepVideo: {}, teaTalk: {}, meeting: {} };
            checkins.push(todayEntry);
          }
          todayEntry.deepVideo = { done: true, by: 'A' };
          d.checkins = checkins;
          d.partners.personA.points += 20;
          d.pointsLog = d.pointsLog || [];
          d.pointsLog.push({ id: window.R.generateId(), date: today, person: 'A', amount: 20, reason: '每周深度视频' });
          window.updateData(d);
          window.R.showToast('打卡成功！+20积分', 'success');
          window.R.spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
          window.renderAllScreens();
        }
      });
    });
  }

  // Event: use phrase check
  const phraseCard = container.querySelector('#checkUsePhrase');
  if (phraseCard) {
    phraseCard.addEventListener('click', () => {
      const d = window.getData();
      d.partners.personA.points += 10;
      d.pointsLog = d.pointsLog || [];
      d.pointsLog.push({ id: window.R.generateId(), date: today, person: 'A', amount: 10, reason: '主动使用启动句' });
      window.updateData(d);
      window.R.showToast('打卡成功！+10积分', 'success');
      window.R.spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
      window.renderAllScreens();
    });
  }

  // Event: no violation check
  const novioCard = container.querySelector('#checkNoViolation');
  if (novioCard) {
    novioCard.addEventListener('click', () => {
      const d = window.getData();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const recentViolations = (d.compensations || []).filter(c => c.date >= weekAgo && c.violator === 'A');
      if (recentViolations.length > 0) {
        window.R.showToast('这周有违规记录，不能领取哦', 'error');
      } else {
        d.partners.personA.points += 30;
        d.pointsLog = d.pointsLog || [];
        d.pointsLog.push({ id: window.R.generateId(), date: today, person: 'A', amount: 30, reason: '一周无违规' });
        window.updateData(d);
        window.R.showToast('太棒了！+30积分', 'success');
        window.R.spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
        window.renderAllScreens();
      }
    });
  }

  // Event: redeem rewards
  container.querySelectorAll('.redeem-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cost = parseInt(btn.dataset.cost);
      const name = btn.dataset.name;
      if (selfPoints < cost) {
        window.R.showToast(`积分不够，还需要 ${cost - selfPoints} 分`, 'error');
        return;
      }
      const content = `
        <p style="margin-bottom:var(--space-md);color:var(--color-text-soft)">
          你将用 <strong>${cost} 积分</strong> 兑换 <strong>${name}</strong>
        </p>
        <div class="form-group">
          <label class="form-label">具体想要什么？（可选）</label>
          <input class="form-input" id="redeemDetail" placeholder="例如：我想听你唱《小幸运》">
        </div>
        <div class="form-group">
          <label class="form-label">送给谁？</label>
          <select class="form-select" id="redeemTarget">
            <option value="B">送给 ${partnerName}</option>
            <option value="A">送给 ${selfName}（自己）</option>
          </select>
        </div>
        <button class="btn btn-primary btn-block" id="confirmRedeem">确认兑换</button>
      `;
      const modal = window.R.showModal({ title: `兑换 ${name}`, content });
      modal.sheet.querySelector('#confirmRedeem').addEventListener('click', () => {
        const d = window.getData();
        const target = modal.sheet.querySelector('#redeemTarget').value;
        const detail = modal.sheet.querySelector('#redeemDetail').value.trim();
        d.partners.personA.points -= cost;
        d.rewardRedemptions = d.rewardRedemptions || [];
        d.rewardRedemptions.push({
          id: window.R.generateId(),
          date: today,
          from: target === 'B' ? selfName : partnerName,
          to: target === 'B' ? partnerName : selfName,
          rewardName: name,
          tier: btn.dataset.tier,
          cost,
          detail,
          fulfilled: false
        });
        window.updateData(d);
        modal.close();
        window.R.showToast('兑换成功！快去兑现吧~', 'success');
        window.renderAllScreens();
      });
    });
  });

  // Event: add wish
  const addWishBtn = container.querySelector('#btnAddWish');
  if (addWishBtn) {
    addWishBtn.addEventListener('click', () => {
      const content = `
        <div class="form-group">
          <label class="form-label">下次见面想一起做什么？</label>
          <input class="form-input" id="wishText" placeholder="例如：一起去吃那家新开的日料">
        </div>
        <button class="btn btn-primary btn-block" id="submitWish">添加心愿</button>
      `;
      const modal = window.R.showModal({ title: '添加心愿', content });
      modal.sheet.querySelector('#submitWish').addEventListener('click', () => {
        const text = modal.sheet.querySelector('#wishText').value.trim();
        if (text) {
          const d = window.getData();
          d.meeting.wishlist = d.meeting.wishlist || [];
          d.meeting.wishlist.push({ id: window.R.generateId(), text, addedBy: 'A', fulfilled: false });
          window.updateData(d);
          modal.close();
          window.R.showToast('心愿已添加', 'success');
          window.renderAllScreens();
        }
      });
    });
  }

  // Event: toggle wish fulfilled
  container.querySelectorAll('.wish-item .check-fancy').forEach(check => {
    check.addEventListener('click', () => {
      const wishId = check.parentElement.parentElement.dataset.id;
      const d = window.getData();
      const wish = (d.meeting.wishlist || []).find(w => w.id === wishId);
      if (wish) {
        wish.fulfilled = !wish.fulfilled;
        window.updateData(d);
        window.renderAllScreens();
      }
    });
  });

  // Event: set meeting date
  const setDateBtn = container.querySelector('#btnSetDate');
  if (setDateBtn) {
    setDateBtn.addEventListener('click', () => {
      const content = `
        <div class="form-group">
          <label class="form-label">下次见面日期</label>
          <input class="form-input" type="date" id="meetingDateInput">
        </div>
        <button class="btn btn-primary btn-block" id="submitMeetingDate">设置</button>
      `;
      const modal = window.R.showModal({ title: '设置见面日期', content });
      modal.sheet.querySelector('#submitMeetingDate').addEventListener('click', () => {
        const date = modal.sheet.querySelector('#meetingDateInput').value;
        if (date) {
          const d = window.getData();
          d.meeting.nextDate = date;
          window.updateData(d);
          modal.close();
          window.R.showToast('见面日期已设置', 'success');
          window.renderAllScreens();
        }
      });
    });
  }
};

function checkWeeklyDone(data) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const weekStart = startOfWeek.toISOString().split('T')[0];
  return (data.checkins || []).some(c => c.date >= weekStart && c.deepVideo?.done);
}
