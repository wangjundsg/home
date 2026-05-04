// Growth Layer Screen
window.renderGrowth = function(container, data) {
  const selfName = data.partners.personA.name;
  const partnerName = data.partners.personB.name;

  container.innerHTML = `
    <div class="growth-page">
      <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-lg)">
        <button class="btn btn-soft flex-1 growth-tab active" data-person="A">${selfName}</button>
        <button class="btn btn-outline flex-1 growth-tab" data-person="B">${partnerName}</button>
      </div>

      <div id="growthContent"></div>
    </div>
  `;

  function renderPerson(personKey) {
    const person = data.partners[`person${personKey}`];
    const name = personKey === 'A' ? selfName : partnerName;
    const content = container.querySelector('#growthContent');

    content.innerHTML = `
      <!-- Emotional buttons -->
      <div class="section-header">
        <h3 class="section-title">💥 我的情绪按钮</h3>
        <button class="btn btn-soft btn-sm add-growth-btn" data-field="triggers" data-person="${personKey}">+</button>
      </div>
      ${(person.triggers || []).length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-text">什么话/什么事会一点就着？</div>
        </div>
      ` : (person.triggers || []).filter(t => t.active !== false).map(t => `
        <div class="card" style="padding:var(--space-md);display:flex;align-items:center;justify-content:space-between">
          <span>💢 ${t.text}</span>
          <button class="btn btn-sm delete-growth-btn" data-field="triggers" data-id="${t.id}" data-person="${personKey}" style="color:var(--color-danger);font-size:var(--font-size-xs)">删除</button>
        </div>
      `).join('')}

      <!-- Needs when angry -->
      <div class="section-header mt-lg">
        <h3 class="section-title">🤔 我发火时真正需要什么</h3>
        <button class="btn btn-soft btn-sm add-growth-btn" data-field="needsWhenAngry" data-person="${personKey}">+</button>
      </div>
      ${(person.needsWhenAngry || []).length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-text">生气的时候，其实最需要TA做什么？</div>
        </div>
      ` : (person.needsWhenAngry || []).filter(n => n.active !== false).map(n => `
        <div class="card" style="padding:var(--space-md);display:flex;align-items:center;justify-content:space-between">
          <span>💭 ${n.text}</span>
          <button class="btn btn-sm delete-growth-btn" data-field="needsWhenAngry" data-id="${n.id}" data-person="${personKey}" style="color:var(--color-danger);font-size:var(--font-size-xs)">删除</button>
        </div>
      `).join('')}

      <!-- Loved moments -->
      <div class="section-header mt-lg">
        <h3 class="section-title">💗 最近"被爱到"的瞬间</h3>
        <button class="btn btn-soft btn-sm add-growth-btn" data-field="lovedMoments" data-person="${personKey}">+</button>
      </div>
      ${(person.lovedMoments || []).length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-text">最近TA做了什么让你心里一暖？</div>
        </div>
      ` : (person.lovedMoments || []).map(m => `
        <div class="card" style="padding:var(--space-md)">
          <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-xs)">
            <span>💗</span>
            <span class="text-sm text-soft">${m.date}</span>
          </div>
          <p>${m.text}</p>
        </div>
      `).join('')}
    `;

    // Tab switching
    container.querySelectorAll('.growth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.growth-tab').forEach(t => {
          t.classList.remove('active', 'btn-soft');
          t.classList.add('btn-outline');
        });
        tab.classList.add('active', 'btn-soft');
        tab.classList.remove('btn-outline');
        renderPerson(tab.dataset.person);
      });
    });

    // Add buttons
    content.querySelectorAll('.add-growth-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.field;
        const personKey = btn.dataset.person;
        const fieldLabels = {
          triggers: '情绪按钮',
          needsWhenAngry: '发火时真正需要什么',
          lovedMoments: '被爱到的瞬间'
        };
        const isLoved = field === 'lovedMoments';

        const modalContent = `
          <div class="form-group">
            <label class="form-label">${isLoved ? '描述那个瞬间' : '添加一条'}</label>
            ${isLoved ? '<textarea class="form-input form-textarea" id="growthText" placeholder="TA做了什么让你心里一暖..."></textarea>' :
              `<input class="form-input" id="growthText" placeholder="${field === 'triggers' ? '例如：被敷衍回应时' : '例如：需要一个拥抱'}">`}
          </div>
          <button class="btn btn-primary btn-block" id="submitGrowth">添加</button>
        `;
        const modal = window.R.showModal({ title: `添加${fieldLabels[field]}`, content: modalContent });
        modal.sheet.querySelector('#submitGrowth').addEventListener('click', () => {
          const text = modal.sheet.querySelector('#growthText').value.trim();
          if (text) {
            const d = window.getData();
            const arr = d.partners[`person${personKey}`][field];
            const entry = { id: window.R.generateId(), text, active: true };
            if (isLoved) entry.date = new Date().toISOString().split('T')[0];
            arr.push(entry);
            if (isLoved && personKey === 'A') {
              d.partners.personA.points += 5;
              d.pointsLog = d.pointsLog || [];
              d.pointsLog.push({ id: window.R.generateId(), date: new Date().toISOString().split('T')[0], person: 'A', amount: 5, reason: '记录被爱到的瞬间' });
            }
            window.updateData(d);
            modal.close();
            window.R.showToast('已添加' + (isLoved ? '，+5积分！' : ''), 'success');
            renderPerson(personKey);
          }
        });
      });
    });

    // Delete buttons
    content.querySelectorAll('.delete-growth-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.field;
        const id = btn.dataset.id;
        const personKey = btn.dataset.person;
        const d = window.getData();
        d.partners[`person${personKey}`][field] = d.partners[`person${personKey}`][field].filter(
          item => item.id !== id
        );
        window.updateData(d);
        renderPerson(personKey);
      });
    });
  }

  renderPerson('A');
};
