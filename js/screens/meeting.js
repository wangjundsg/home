// Meeting Countdown & Wishlist (sub-page, accessible from daily page)
window.renderMeeting = function(container, data) {
  const selfName = data.partners.personA.name;
  const partnerName = data.partners.personB.name;
  const meeting = data.meeting || {};
  const days = window.R.daysUntil(meeting.nextDate);

  container.innerHTML = `
    <div class="meeting-page">
      ${days !== null ? `
        <div class="card" style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:var(--font-size-sm);color:var(--color-text-soft);margin-bottom:var(--space-sm)">距离下次见面还有</div>
          <div style="font-size:4rem;font-weight:800;color:var(--color-primary);line-height:1">${days}</div>
          <div style="font-size:var(--font-size-lg);color:var(--color-text-soft);margin-bottom:var(--space-md)">天</div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-soft)">下次见面：${meeting.nextDate}</div>
          ${days <= 3 ? '<div style="margin-top:var(--space-md);font-size:var(--font-size-xl)">🎉 马上就能见面啦！</div>' : ''}
          <button class="btn btn-soft btn-sm mt-md" id="btnEditDate">修改日期</button>
        </div>
      ` : `
        <div class="card text-center" style="padding:var(--space-xl)">
          <div style="font-size:4rem;margin-bottom:var(--space-md)">📅</div>
          <p style="color:var(--color-text-soft);margin-bottom:var(--space-lg)">还没有设置下次见面日期</p>
          <button class="btn btn-primary btn-lg" id="btnSetDate">设置见面日期</button>
        </div>
      `}

      ${(meeting.pastMeetings || []).length > 0 ? `
        <div class="section-header mt-lg">
          <h3 class="section-title">📸 见面记录</h3>
        </div>
        ${meeting.pastMeetings.map(m => `
          <div class="card" style="padding:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">
            <span style="font-size:1.5rem">💑</span>
            <div>
              <div style="font-weight:600">${m.date}</div>
              <div class="text-sm text-soft">${m.note || ''}</div>
            </div>
          </div>
        `).join('')}
      ` : ''}

      <button class="btn btn-soft btn-block mt-lg" id="btnRecordMeeting">📝 记录一次见面</button>
    </div>
  `;

  // Edit date
  const editDateBtn = container.querySelector('#btnEditDate');
  const setDateBtn = container.querySelector('#btnSetDate');
  const setDateHandler = () => {
    const content = `
      <div class="form-group">
        <label class="form-label">下次见面日期</label>
        <input class="form-input" type="date" id="meetingDateInput" value="${meeting.nextDate || ''}">
      </div>
      <button class="btn btn-primary btn-block" id="submitDate">设置</button>
    `;
    const modal = window.R.showModal({ title: '设置见面日期', content });
    modal.sheet.querySelector('#submitDate').addEventListener('click', () => {
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
  };
  if (editDateBtn) editDateBtn.addEventListener('click', setDateHandler);
  if (setDateBtn) setDateBtn.addEventListener('click', setDateHandler);

  // Record meeting
  const recordBtn = container.querySelector('#btnRecordMeeting');
  if (recordBtn) {
    recordBtn.addEventListener('click', () => {
      const content = `
        <div class="form-group">
          <label class="form-label">见面日期</label>
          <input class="form-input" type="date" id="pastMeetingDate" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label class="form-label">做了什么？（选填）</label>
          <input class="form-input" id="pastMeetingNote" placeholder="例如：去了公园，很开心">
        </div>
        <button class="btn btn-primary btn-block" id="submitPastMeeting">记录 +50分</button>
      `;
      const modal = window.R.showModal({ title: '记录见面', content });
      modal.sheet.querySelector('#submitPastMeeting').addEventListener('click', () => {
        const date = modal.sheet.querySelector('#pastMeetingDate').value;
        const note = modal.sheet.querySelector('#pastMeetingNote').value.trim();
        if (date) {
          const d = window.getData();
          d.meeting.pastMeetings = d.meeting.pastMeetings || [];
          d.meeting.pastMeetings.push({ date, note: note || '见面啦 💑' });
          d.partners.personA.points += 50;
          d.pointsLog = d.pointsLog || [];
          d.pointsLog.push({ id: window.R.generateId(), date, person: 'A', amount: 50, reason: '见面完成' });
          window.updateData(d);
          modal.close();
          window.R.showToast('见面已记录！+50积分 🎉', 'success');
          window.R.spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
          window.renderAllScreens();
        }
      });
    });
  }
};
