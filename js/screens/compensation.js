// Compensation Store Screen
window.renderCompensation = function(container, data) {
  const selfName = data.partners.personA.name;
  const partnerName = data.partners.personB.name;
  const comps = data.compensations || [];
  const pending = comps.filter(c => !c.compensationDone || !c.acknowledged);
  const resolved = comps.filter(c => c.compensationDone && c.acknowledged);

  container.innerHTML = `
    <div class="compensation-page">
      <!-- Pending compensations -->
      <div class="section-header">
        <h3 class="section-title">⏳ 待处理</h3>
        <button class="btn btn-soft btn-sm" id="btnAddComp">+ 记录</button>
      </div>
      <div id="pendingComps">
        ${pending.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">🎉</div>
            <div class="empty-state-text">没有待处理的补偿，保持下去！</div>
          </div>
        ` : pending.map(c => renderCompCard(c, selfName, partnerName)).join('')}
      </div>

      <!-- Resolved compensations -->
      ${resolved.length > 0 ? `
        <div class="section-header mt-lg">
          <h3 class="section-title">✅ 已翻篇</h3>
        </div>
        <div id="resolvedComps">
          ${resolved.map(c => renderCompCard(c, selfName, partnerName)).join('')}
        </div>
      ` : ''}
    </div>
  `;

  // Add compensation
  const addBtn = container.querySelector('#btnAddComp');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const content = `
        <div class="form-group">
          <label class="form-label">谁触犯了规则？</label>
          <select class="form-select" id="compViolator">
            <option value="A">${selfName}</option>
            <option value="B">${partnerName}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">违规内容</label>
          <input class="form-input" id="compViolation" placeholder="例如：提了分手暗示 / 翻旧账">
        </div>
        <div class="form-group">
          <label class="form-label">级别</label>
          <select class="form-select" id="compLevel">
            <option value="red">🔴 红线</option>
            <option value="yellow">🟡 黄线</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">补偿内容</label>
          <input class="form-input" id="compDetail" placeholder="例如：24小时内长语音道歉 + 点一杯奶茶">
        </div>
        <button class="btn btn-primary btn-block" id="submitComp">记录</button>
      `;
      const modal = window.R.showModal({ title: '记录触犯', content });
      modal.sheet.querySelector('#submitComp').addEventListener('click', () => {
        const violator = modal.sheet.querySelector('#compViolator').value;
        const violation = modal.sheet.querySelector('#compViolation').value.trim();
        const level = modal.sheet.querySelector('#compLevel').value;
        const detail = modal.sheet.querySelector('#compDetail').value.trim();
        if (!violation) {
          window.R.showToast('请填写违规内容', 'error');
          return;
        }
        const d = window.getData();
        d.compensations = d.compensations || [];
        d.compensations.unshift({
          id: window.R.generateId(),
          date: new Date().toISOString().split('T')[0],
          violator,
          recorder: 'A',
          violation,
          level,
          compensation: detail || (level === 'red' ? '24小时内手写信/长语音道歉 + 对方指定一件事' : '下单小补偿'),
          compensationDone: false,
          acknowledged: false,
          note: ''
        });
        window.updateData(d);
        modal.close();
        window.R.showToast('已记录，记得完成补偿哦', 'success');
        window.renderAllScreens();
      });
    });
  }

  // Toggle checkboxes
  container.querySelectorAll('.comp-check').forEach(check => {
    check.addEventListener('click', () => {
      const compId = check.dataset.id;
      const field = check.dataset.field;
      const d = window.getData();
      const comp = d.compensations.find(c => c.id === compId);
      if (comp) {
        comp[field] = !comp[field];
        window.updateData(d);
        if (field === 'acknowledged' && comp.acknowledged && comp.compensationDone) {
          window.R.showToast('翻篇了！这件事过去了 💚', 'success');
          window.R.spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
        } else if (field === 'compensationDone' && comp.compensationDone) {
          window.R.showToast('补偿已完成，等待对方确认原谅', 'success');
        }
        window.renderAllScreens();
      }
    });
  });
};

function renderCompCard(c, selfName, partnerName) {
  const violatorName = c.violator === 'A' ? selfName : partnerName;
  const levelBadge = c.level === 'red'
    ? '<span class="badge badge-red">红线</span>'
    : '<span class="badge badge-yellow">黄线</span>';
  const cardClass = c.level === 'red' ? 'card-red' : 'card-yellow';
  const isResolved = c.compensationDone && c.acknowledged;

  return `
    <div class="card ${cardClass} ${isResolved ? 'resolved' : ''}" style="padding:var(--space-md);opacity:${isResolved ? '0.7' : '1'}">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:var(--space-sm)">
        <div>
          ${levelBadge}
          <span class="text-sm text-soft" style="margin-left:var(--space-sm)">${c.date}</span>
        </div>
      </div>
      <div style="margin-bottom:var(--space-sm)">
        <strong>${violatorName}</strong> → ${c.violation}
      </div>
      <div style="color:var(--color-text-soft);font-size:var(--font-size-sm);margin-bottom:var(--space-sm)">
        补偿：${c.compensation}
      </div>
      ${c.note ? `<div style="color:var(--color-text-soft);font-size:var(--font-size-sm);margin-bottom:var(--space-sm);font-style:italic">"${c.note}"</div>` : ''}
      <div style="display:flex;gap:var(--space-lg)">
        <span class="check-fancy ${c.compensationDone ? 'checked' : ''} comp-check" data-id="${c.id}" data-field="compensationDone">
          <span class="check-box"></span>
          <span class="text-sm">补偿完成</span>
        </span>
        <span class="check-fancy ${c.acknowledged ? 'checked' : ''} comp-check" data-id="${c.id}" data-field="acknowledged">
          <span class="check-box"></span>
          <span class="text-sm">已收到原谅</span>
        </span>
      </div>
    </div>
  `;
}
