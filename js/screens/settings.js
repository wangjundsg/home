// Settings Screen
window.renderSettings = function(container, data) {
  const selfName = data.partners.personA.name;
  const partnerName = data.partners.personB.name;
  const settings = data.settings || {};

  container.innerHTML = `
    <div class="settings-page">
      <!-- Names -->
      <div class="section-header">
        <h3 class="section-title">👤 名字设置</h3>
      </div>
      <div class="card" style="padding:var(--space-md)">
        <div class="form-group">
          <label class="form-label">我的名字</label>
          <input class="form-input" id="setNameA" value="${selfName}">
        </div>
        <div class="form-group">
          <label class="form-label">TA的名字</label>
          <input class="form-input" id="setNameB" value="${partnerName}">
        </div>
        <button class="btn btn-primary btn-block" id="btnSaveNames">保存名字</button>
      </div>

      <!-- Safe Word -->
      <div class="section-header mt-lg">
        <h3 class="section-title">🚨 安全词</h3>
      </div>
      <div class="card" style="padding:var(--space-md)">
        <div class="form-group">
          <label class="form-label">安全词</label>
          <input class="form-input" id="setSafePhrase" value="${data.safeWord.phrase}">
        </div>
        <div class="form-group">
          <label class="form-label">含义</label>
          <input class="form-input" id="setSafeMeaning" value="${data.safeWord.meaning}">
        </div>
        <button class="btn btn-primary btn-block" id="btnSaveSafe">保存安全词</button>
      </div>

      <!-- Meeting Date -->
      <div class="section-header mt-lg">
        <h3 class="section-title">📅 下次见面</h3>
      </div>
      <div class="card" style="padding:var(--space-md)">
        <div class="form-group">
          <label class="form-label">见面日期</label>
          <input class="form-input" type="date" id="setMeetingDate" value="${data.meeting?.nextDate || ''}">
        </div>
        <button class="btn btn-primary btn-block" id="btnSaveDate">保存日期</button>
      </div>

      <!-- Font Size -->
      <div class="section-header mt-lg">
        <h3 class="section-title">🔤 字体大小</h3>
      </div>
      <div class="card" style="padding:var(--space-md)">
        <div style="display:flex;gap:var(--space-sm)">
          <button class="btn ${settings.fontSize === 'small' ? 'btn-primary' : 'btn-outline'} flex-1 font-size-btn" data-size="small">小</button>
          <button class="btn ${settings.fontSize === 'medium' || !settings.fontSize ? 'btn-primary' : 'btn-outline'} flex-1 font-size-btn" data-size="medium">中</button>
          <button class="btn ${settings.fontSize === 'large' ? 'btn-primary' : 'btn-outline'} flex-1 font-size-btn" data-size="large">大</button>
        </div>
      </div>

      <!-- Data -->
      <div class="section-header mt-lg">
        <h3 class="section-title">💾 数据管理</h3>
      </div>
      <div class="card" style="padding:var(--space-md)">
        <button class="btn btn-soft btn-block" id="btnExport">
          📤 导出数据
        </button>
        <p class="text-sm text-soft text-center" style="margin:var(--space-sm) 0">
          导出为JSON文件，通过微信发给TA
        </p>
        <button class="btn btn-outline btn-block mt-md" id="btnImport">
          📥 导入TA的数据
        </button>
        <p class="text-sm text-soft text-center" style="margin:var(--space-sm) 0">
          选择TA发来的JSON文件，合并数据
        </p>
        ${settings.lastExportDate ? `
          <p class="text-sm text-soft text-center">上次导出：${settings.lastExportDate}</p>
        ` : ''}
      </div>

      <!-- Reset -->
      <div class="section-header mt-lg">
        <h3 class="section-title">⚠️ 危险操作</h3>
      </div>
      <div class="card" style="padding:var(--space-md)">
        <button class="btn btn-danger btn-block" id="btnReset">
          🔄 重置所有数据
        </button>
        <p class="text-sm text-soft text-center" style="margin:var(--space-sm) 0">
          这会删除所有数据，不可恢复！
        </p>
      </div>

      <!-- About -->
      <div class="text-center mt-lg mb-lg">
        <p class="text-sm text-soft">我们的花园 v1.0</p>
        <p class="text-sm text-soft">属于两个人的情感小窝 🏡</p>
      </div>
    </div>
  `;

  // Save names
  container.querySelector('#btnSaveNames').addEventListener('click', () => {
    const d = window.getData();
    d.partners.personA.name = container.querySelector('#setNameA').value.trim() || '汪俊';
    d.partners.personB.name = container.querySelector('#setNameB').value.trim() || '小怪兽';
    window.updateData(d);
    window.R.showToast('名字已保存', 'success');
    window.renderAllScreens();
  });

  // Save safe word
  container.querySelector('#btnSaveSafe').addEventListener('click', () => {
    const d = window.getData();
    d.safeWord.phrase = container.querySelector('#setSafePhrase').value.trim() || 'TA好像饿了';
    d.safeWord.meaning = container.querySelector('#setSafeMeaning').value.trim() || '我需要被照顾了';
    window.updateData(d);
    window.R.showToast('安全词已保存', 'success');
  });

  // Save date
  container.querySelector('#btnSaveDate').addEventListener('click', () => {
    const d = window.getData();
    d.meeting.nextDate = container.querySelector('#setMeetingDate').value;
    window.updateData(d);
    window.R.showToast('见面日期已保存', 'success');
  });

  // Font size
  container.querySelectorAll('.font-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.size;
      container.querySelectorAll('.font-size-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
      const d = window.getData();
      d.settings = d.settings || {};
      d.settings.fontSize = size;
      document.documentElement.setAttribute('data-font', size);
      window.updateData(d);
    });
  });

  // Export
  container.querySelector('#btnExport').addEventListener('click', () => {
    const d = window.getData();
    d.settings.lastExportDate = new Date().toISOString().split('T')[0];
    window.updateData(d);
    window.R.exportJSON(d);
    window.R.showToast('数据已导出', 'success');
  });

  // Import
  container.querySelector('#btnImport').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const imported = await window.R.importJSON(file);
        const current = window.getData();
        const merged = window.R.mergeData(current, imported);
        window.updateData(merged);
        window.renderAllScreens();
        window.R.showToast('数据已合并导入', 'success');
      } catch (err) {
        window.R.showToast(err.message || '导入失败', 'error');
      }
    });
    input.click();
  });

  // Reset
  container.querySelector('#btnReset').addEventListener('click', () => {
    window.R.confirmDialog({
      title: '确认重置',
      message: '这将删除所有数据，包括打卡记录、积分、补偿记录等。此操作不可恢复！确定要继续吗？',
      confirmText: '确认重置',
      cancelText: '取消'
    }).then(confirmed => {
      if (confirmed) {
        window.R.reset();
        window.R.showToast('数据已重置，请刷新页面', 'success');
        setTimeout(() => location.reload(), 1500);
      }
    });
  });
};
