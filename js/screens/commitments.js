// Commitments Wall Screen
window.renderCommitments = function(container, data) {
  const selfName = data.partners.personA.name;
  const partnerName = data.partners.personB.name;
  const selfCommits = data.partners.personA.commitments || [];
  const partnerCommits = data.partners.personB.commitments || [];

  container.innerHTML = `
    <div class="commitments-page">
      <!-- Self commitments -->
      <div class="section-header">
        <h3 class="section-title">💙 ${selfName}的承诺</h3>
        <button class="btn btn-soft btn-sm" id="btnEditSelf">✏️ 编辑</button>
      </div>
      <div id="selfCommits">
        ${selfCommits.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <div class="empty-state-text">还没有写下承诺</div>
          </div>
        ` : selfCommits.filter(c => c.active).map(c => `
          <div class="card commit-card ${c.text.includes('红线') ? 'card-red' : c.text.includes('黄线') ? 'card-yellow' : ''}" style="padding:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">
            <span>${c.text.includes('红线') ? '🔒' : c.text.includes('黄线') ? '⚠️' : '💚'}</span>
            <span style="flex:1">${c.text}</span>
            ${c.text.includes('红线') ? '<span class="badge badge-red">红线</span>' : ''}
            ${c.text.includes('黄线') ? '<span class="badge badge-yellow">黄线</span>' : ''}
          </div>
        `).join('')}
      </div>

      <div class="divider"></div>

      <!-- Partner commitments -->
      <div class="section-header">
        <h3 class="section-title">💗 ${partnerName}的承诺</h3>
      </div>
      <div id="partnerCommits">
        ${partnerCommits.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <div class="empty-state-text">${partnerName}还没有填写，等她写好了导入进来吧~</div>
          </div>
        ` : partnerCommits.filter(c => c.active).map(c => `
          <div class="card commit-card ${c.text.includes('红线') ? 'card-red' : c.text.includes('黄线') ? 'card-yellow' : ''}" style="padding:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">
            <span>${c.text.includes('红线') ? '🔒' : c.text.includes('黄线') ? '⚠️' : '💚'}</span>
            <span style="flex:1">${c.text}</span>
            ${c.text.includes('红线') ? '<span class="badge badge-red">红线</span>' : ''}
            ${c.text.includes('黄线') ? '<span class="badge badge-yellow">黄线</span>' : ''}
          </div>
        `).join('')}
      </div>

      <!-- Edit modal trigger -->
      <div class="mt-lg text-center">
        <p class="text-sm text-soft">红线 = 绝对不容许 | 黄线 = 需要改进</p>
      </div>
    </div>
  `;

  // Edit self commitments
  const editBtn = container.querySelector('#btnEditSelf');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const commits = window.getData().partners.personA.commitments;
      let listHtml = commits.map((c, i) => `
        <div style="display:flex;gap:var(--space-sm);align-items:center;margin-bottom:var(--space-sm)">
          <input class="form-input" value="${c.text.replace(/"/g, '&quot;')}" data-index="${i}" style="flex:1">
          <button class="btn btn-outline btn-sm delete-commit" data-index="${i}" style="color:var(--color-danger)">✕</button>
        </div>
      `).join('');

      const content = `
        <div id="commitEditList">${listHtml}</div>
        <button class="btn btn-soft btn-sm btn-block" id="btnAddCommit">+ 添加一条</button>
        <button class="btn btn-primary btn-block mt-md" id="btnSaveCommits">保存</button>
      `;
      const modal = window.R.showModal({ title: '编辑我的承诺', content });

      modal.sheet.querySelector('#btnAddCommit').addEventListener('click', () => {
        const list = modal.sheet.querySelector('#commitEditList');
        const idx = list.children.length;
        const div = document.createElement('div');
        div.style.cssText = 'display:flex;gap:var(--space-sm);align-items:center;margin-bottom:var(--space-sm)';
        div.innerHTML = `<input class="form-input" value="" data-index="${idx}" style="flex:1" placeholder="新的承诺...">
          <button class="btn btn-outline btn-sm delete-commit" data-index="${idx}" style="color:var(--color-danger)">✕</button>`;
        list.appendChild(div);
      });

      modal.sheet.querySelector('#btnSaveCommits').addEventListener('click', () => {
        const inputs = modal.sheet.querySelectorAll('#commitEditList input');
        const newCommits = [];
        inputs.forEach((input, i) => {
          const text = input.value.trim();
          if (text) {
            const existing = commits[i];
            newCommits.push({
              id: existing?.id || window.R.generateId(),
              text,
              active: true
            });
          }
        });
        const d = window.getData();
        d.partners.personA.commitments = newCommits;
        window.updateData(d);
        modal.close();
        window.R.showToast('承诺已更新', 'success');
        window.renderAllScreens();
      });

      modal.sheet.querySelectorAll('.delete-commit').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.parentElement.remove();
        });
      });
    });
  }
};
