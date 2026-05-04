// Startup Phrases Library Screen
window.renderPhrases = function(container, data) {
  const phrases = data.phrases || [];

  // Group by scenario
  const grouped = {};
  phrases.forEach(p => {
    if (!grouped[p.scenario]) grouped[p.scenario] = [];
    grouped[p.scenario].push(p);
  });

  container.innerHTML = `
    <div class="phrases-page">
      <div class="screen-subtitle" style="text-align:center">
        吵到不知道说什么时，从这里抄一句
      </div>

      ${Object.entries(grouped).map(([scenario, items]) => `
        <div class="section-header mt-md">
          <h3 class="section-title">📌 ${scenario}</h3>
        </div>
        ${items.map(p => `
          <div class="card phrase-card" style="padding:var(--space-md)">
            <div class="phrase-text">"${p.text}"</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--space-sm)">
              <span class="text-sm text-soft">已使用 ${p.used || 0} 次</span>
              <button class="btn btn-soft btn-sm copy-phrase-btn" data-text="${p.text.replace(/"/g, '&quot;')}" data-id="${p.id}">📋 复制</button>
            </div>
          </div>
        `).join('')}
      `).join('')}

      <button class="btn btn-outline btn-block mt-lg" id="btnAddPhrase">+ 添加自己的启动句</button>
    </div>
  `;

  // Copy buttons
  container.querySelectorAll('.copy-phrase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.R.clipBoard(btn.dataset.text);
      const d = window.getData();
      const phrase = d.phrases.find(p => p.id === btn.dataset.id);
      if (phrase) {
        phrase.used = (phrase.used || 0) + 1;
        window.updateData(d);
        container.querySelector(`[data-id="${btn.dataset.id}"]`).previousElementSibling.textContent = `已使用 ${phrase.used} 次`;
      }
    });
  });

  // Add phrase
  const addBtn = container.querySelector('#btnAddPhrase');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const content = `
        <div class="form-group">
          <label class="form-label">场景</label>
          <select class="form-select" id="phraseScenario">
            <option value="暂停信号">暂停信号</option>
            <option value="伸出橄榄枝">伸出橄榄枝</option>
            <option value="翻译需求">翻译需求</option>
            <option value="修复口令">修复口令</option>
            <option value="求助口令">求助口令</option>
            <option value="日常暖心">日常暖心</option>
            <option value="自定义">自定义</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">句子</label>
          <textarea class="form-input form-textarea" id="phraseText" placeholder="写一句你想用在特定场景的话..."></textarea>
        </div>
        <button class="btn btn-primary btn-block" id="submitPhrase">添加</button>
      `;
      const modal = window.R.showModal({ title: '添加启动句', content });
      modal.sheet.querySelector('#submitPhrase').addEventListener('click', () => {
        const text = modal.sheet.querySelector('#phraseText').value.trim();
        const scenario = modal.sheet.querySelector('#phraseScenario').value;
        if (text) {
          const d = window.getData();
          d.phrases = d.phrases || [];
          d.phrases.push({ id: window.R.generateId(), scenario, text, used: 0 });
          window.updateData(d);
          modal.close();
          window.R.showToast('启动句已添加', 'success');
          window.renderAllScreens();
        }
      });
    });
  }
};
