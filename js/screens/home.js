// Emergency Quick Tips Screen
window.renderHome = function(container, data) {
  const tips = data.emergencyTips;
  const safeWord = data.safeWord;
  const selfName = data.partners.personA.name;
  const partnerName = data.partners.personB.name;

  container.innerHTML = `
    <div class="emergency-page">
      <div class="screen-subtitle" style="text-align:center">
        现在是什么状态？点一下就知道该怎么做
      </div>

      <!-- Card 1: I am angry -->
      <div class="emergency-card" data-mode="iAmAngry">
        <div class="emergency-card-header">
          <span class="emergency-icon">🔴</span>
          <div>
            <div class="emergency-title">我生气了 / 我需要被哄</div>
            <div class="emergency-desc">${selfName}现在很难受</div>
          </div>
          <span class="emergency-arrow">›</span>
        </div>
        <div class="emergency-card-body">
          <div class="emergency-reminder">${tips.iAmAngry.reminder}</div>
          <div class="emergency-section">
            <div class="emergency-label">✅ 可以说</div>
            ${tips.iAmAngry.dos.map(d => `
              <button class="emergency-item copy-btn" data-text="${d}">
                <span>${d}</span>
                <span class="copy-icon">📋</span>
              </button>
            `).join('')}
          </div>
          <div class="emergency-section">
            <div class="emergency-label dont-label">❌ 别做</div>
            ${tips.iAmAngry.donts.map(d => `
              <div class="emergency-item dont-item">${d}</div>
            `).join('')}
          </div>
          <button class="btn btn-primary btn-block mt-md safeword-btn">
            🚨 显示安全词提醒
          </button>
        </div>
      </div>

      <!-- Card 2: TA is angry -->
      <div class="emergency-card" data-mode="taIsAngry">
        <div class="emergency-card-header">
          <span class="emergency-icon">🔴</span>
          <div>
            <div class="emergency-title">TA生气了 / 我需要哄人</div>
            <div class="emergency-desc">${partnerName}现在需要我</div>
          </div>
          <span class="emergency-arrow">›</span>
        </div>
        <div class="emergency-card-body">
          <div class="emergency-reminder">${tips.taIsAngry.reminder}</div>
          <div class="emergency-section">
            <div class="emergency-label">✅ 可以说</div>
            ${tips.taIsAngry.dos.map(d => `
              <button class="emergency-item copy-btn" data-text="${d}">
                <span>${d}</span>
                <span class="copy-icon">📋</span>
              </button>
            `).join('')}
          </div>
          <div class="emergency-section">
            <div class="emergency-label dont-label">❌ 别做</div>
            ${tips.taIsAngry.donts.map(d => `
              <div class="emergency-item dont-item">${d}</div>
            `).join('')}
          </div>
          <button class="btn btn-primary btn-block mt-md safeword-btn">
            🚨 显示安全词提醒
          </button>
        </div>
      </div>

      <!-- Card 3: We are good -->
      <div class="emergency-card good-card" data-mode="weAreGood">
        <div class="emergency-card-header">
          <span class="emergency-icon">🟢</span>
          <div>
            <div class="emergency-title">我们很好，记录一下</div>
            <div class="emergency-desc">爱需要被看见</div>
          </div>
          <span class="emergency-arrow">›</span>
        </div>
        <div class="emergency-card-body">
          <div class="emergency-reminder">${tips.weAreGood.reminder}</div>
          <div class="emergency-section">
            <div class="emergency-label">✅ 可以做</div>
            ${tips.weAreGood.dos.map(d => `
              <div class="emergency-item good-item">
                <span>${d}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-soft btn-block mt-md" id="btnRecordLoved">
            💗 记录一件被爱到的瞬间
          </button>
        </div>
      </div>
    </div>
  `;

  // Event handlers
  container.querySelectorAll('.emergency-card-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.parentElement;
      const wasActive = card.classList.contains('expanded');
      // Close all
      container.querySelectorAll('.emergency-card').forEach(c => c.classList.remove('expanded'));
      if (!wasActive) {
        card.classList.add('expanded');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Copy buttons
  container.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.R.clipBoard(btn.dataset.text);
    });
  });

  // Safe word button
  container.querySelectorAll('.safeword-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.R.showFullscreen(`"${safeWord.phrase}"<br><span style="font-size:1rem;font-weight:400;color:var(--color-text-soft)">${safeWord.meaning}</span>`);
    });
  });

  // Record loved moment
  const lovedBtn = container.querySelector('#btnRecordLoved');
  if (lovedBtn) {
    lovedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = `
        <div class="form-group">
          <label class="form-label">记录一件让你感到被爱的事</label>
          <textarea class="form-input form-textarea" id="lovedMoment" placeholder="今天TA做了什么让你心里一暖..."></textarea>
        </div>
        <button class="btn btn-primary btn-block" id="submitLoved">记录 💗</button>
      `;
      const modal = window.R.showModal({ title: '记录被爱到的瞬间', content });
      modal.sheet.querySelector('#submitLoved').addEventListener('click', () => {
        const text = modal.sheet.querySelector('#lovedMoment').value.trim();
        if (text) {
          const d = window.refreshData ? window.getData() : null;
          if (d) {
            const moment = {
              id: window.R.generateId(),
              date: new Date().toISOString().split('T')[0],
              text
            };
            d.partners.personA.lovedMoments.unshift(moment);
            // Add points
            d.partners.personA.points += 5;
            d.pointsLog = d.pointsLog || [];
            d.pointsLog.push({
              id: window.R.generateId(),
              date: new Date().toISOString().split('T')[0],
              person: 'A',
              amount: 5,
              reason: '记录被爱到的瞬间'
            });
            window.updateData(d);
          }
          modal.close();
          window.R.showToast('已记录，+5积分！', 'success');
        }
      });
    });
  }
};
